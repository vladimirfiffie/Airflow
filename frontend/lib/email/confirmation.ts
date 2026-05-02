import type { FlightOffer } from "@/lib/mock/flights";

type Passenger = {
  firstName: string;
  lastName: string;
  seatId: string;
};

type Args = {
  ref: string;
  flight: FlightOffer;
  passengers: Passenger[];
  totalUsd: number;
  appUrl: string;
};

export function renderConfirmationEmail({ ref, flight, passengers, totalUsd, appUrl }: Args) {
  const subject = `Airflow · Booking ${ref} confirmed (${flight.fromCode} → ${flight.toCode})`;

  const passengerLines = passengers
    .map((p) => `  ${p.firstName} ${p.lastName}  ·  Seat ${p.seatId}`)
    .join("\n");

  const text = `
Booking confirmed.

  ${ref}
  ${flight.flightNo} · ${flight.airline}
  ${flight.fromCode} → ${flight.toCode}
  Depart ${flight.departTime}  Arrive ${flight.arriveTime}  ${flight.duration}

Passengers
${passengerLines}

Total charged: $${totalUsd}

Manage your booking: ${appUrl}/booking
`.trim();

  const passengerRows = passengers
    .map(
      (p) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eaeaea;color:#171717;font-weight:600;">${escape(`${p.firstName} ${p.lastName}`)}</td>
          <td style="padding:12px 0;border-bottom:1px solid #eaeaea;color:#f97316;font-family:ui-monospace,Menlo,monospace;font-weight:700;text-align:right;">${escape(p.seatId)}</td>
        </tr>
      `,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#fafafa;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;color:#171717;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <p style="margin:0;color:#737373;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
        <span style="color:#f97316;">Booking confirmed</span> · ${escape(ref)}
      </p>
      <h1 style="margin:16px 0 0;font-size:36px;font-weight:900;letter-spacing:-0.02em;">You're all set.</h1>

      <div style="margin-top:32px;background:#0a0a0a;color:#fff;border-radius:16px;padding:32px;">
        <p style="margin:0;color:#a3a3a3;font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:0.15em;">BOARDING PASS</p>
        <p style="margin:24px 0 0;font-size:48px;font-weight:900;letter-spacing:-0.03em;font-family:ui-monospace,Menlo,monospace;">
          ${escape(flight.fromCode)} <span style="color:#f97316;">→</span> ${escape(flight.toCode)}
        </p>
        <table style="width:100%;margin-top:24px;border-collapse:collapse;font-family:ui-monospace,Menlo,monospace;">
          <tr>
            <td style="color:#a3a3a3;font-size:10px;letter-spacing:0.15em;">FLIGHT</td>
            <td style="color:#a3a3a3;font-size:10px;letter-spacing:0.15em;">DEPART</td>
            <td style="color:#a3a3a3;font-size:10px;letter-spacing:0.15em;">ARRIVE</td>
            <td style="color:#a3a3a3;font-size:10px;letter-spacing:0.15em;">DURATION</td>
          </tr>
          <tr>
            <td style="padding-top:8px;color:#fff;font-weight:700;">${escape(flight.flightNo)}</td>
            <td style="padding-top:8px;color:#fff;font-weight:700;">${escape(flight.departTime)}</td>
            <td style="padding-top:8px;color:#fff;font-weight:700;">${escape(flight.arriveTime)}</td>
            <td style="padding-top:8px;color:#fff;font-weight:700;">${escape(flight.duration)}</td>
          </tr>
        </table>
      </div>

      <h2 style="margin:32px 0 8px;font-size:18px;font-weight:700;">Passengers & seats</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${passengerRows}
      </table>

      <div style="margin-top:24px;padding-top:16px;border-top:2px solid #171717;display:flex;justify-content:space-between;">
        <span style="font-weight:700;">Total charged</span>
        <span style="color:#f97316;font-weight:900;font-size:24px;font-family:ui-monospace,Menlo,monospace;">$${totalUsd}</span>
      </div>

      <p style="margin:32px 0 0;color:#737373;font-size:14px;line-height:1.5;">
        Online check-in opens 24 hours before departure. Arrive at the airport at least 2 hours early for domestic flights, 3 hours for international.
      </p>

      ${
        appUrl
          ? `<p style="margin:24px 0 0;"><a href="${escape(appUrl)}/booking" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;font-size:14px;">Manage booking</a></p>`
          : ""
      }

      <p style="margin:48px 0 0;color:#a3a3a3;font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:0.15em;">
        AIRFLOW · ALL SYSTEMS OPERATIONAL
      </p>
    </div>
  </body>
</html>`;

  return { html, text, subject };
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
