// OpenSky Network — public real-time aircraft state vectors.
// Public endpoint with anonymous rate limit; auth gives higher limits.
// Docs: https://openskynetwork.github.io/opensky-api/rest.html

const STATES_URL = "https://opensky-network.org/api/states/all";

// Continental US bounding box — limits payload size and matches our domestic
// flight focus.
const US_BBOX = { lamin: 24.5, lamax: 49.5, lomin: -125, lomax: -66.9 };

export type OpenSkyState = {
  icao24: string;
  callsign: string | null;
  origin_country: string | null;
  longitude: number | null;
  latitude: number | null;
  geo_altitude: number | null;
  velocity: number | null;
  true_track: number | null;
  on_ground: boolean;
};

type OpenSkyResponse = {
  time: number;
  states: Array<unknown[]> | null;
};

function toState(row: unknown[]): OpenSkyState {
  return {
    icao24: String(row[0] ?? ""),
    callsign: row[1] ? String(row[1]).trim() : null,
    origin_country: (row[2] as string) ?? null,
    longitude: (row[5] as number) ?? null,
    latitude: (row[6] as number) ?? null,
    geo_altitude: (row[13] as number) ?? null,
    velocity: (row[9] as number) ?? null,
    true_track: (row[10] as number) ?? null,
    on_ground: Boolean(row[8]),
  };
}

export async function fetchUSAircraft(): Promise<OpenSkyState[] | null> {
  const params = new URLSearchParams({
    lamin: String(US_BBOX.lamin),
    lamax: String(US_BBOX.lamax),
    lomin: String(US_BBOX.lomin),
    lomax: String(US_BBOX.lomax),
  });
  const url = `${STATES_URL}?${params}`;

  const headers: HeadersInit = {};
  const user = process.env.OPENSKY_USERNAME;
  const pass = process.env.OPENSKY_PASSWORD;
  if (user && pass) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      // Cache for 30s — OpenSky updates every ~10s and we don't want to burn rate limit
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data: OpenSkyResponse = await res.json();
    if (!data.states) return [];
    return data.states.map(toState);
  } catch {
    return null;
  }
}
