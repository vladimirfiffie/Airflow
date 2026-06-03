import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/brutal.dart';
import '../widgets/live_stats.dart';
import '../data/mock_flights.dart';
import '../models/flight.dart';
import 'flight_details_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      currentRoute: '/',
      padded: false,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: const [
          _Hero(),
          LiveStatsSection(),
          _Features(),
          _Destinations(),
          _PopularFlights(),
          _CtaSection(),
          _Footer(),
        ],
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  const _Hero();

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: c.border)),
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: GridLinesPainter(c.border.withValues(alpha: 0.5)),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 28, 20, 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _LiveBadge(),
                const SizedBox(height: 24),
                Text.rich(
                  TextSpan(
                    style: TextStyle(
                      fontSize: 72,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -3,
                      height: 0.9,
                      color: c.foreground,
                    ),
                    children: [
                      const TextSpan(text: 'Fly'),
                      TextSpan(text: '.', style: TextStyle(color: c.accent)),
                      TextSpan(
                        text: '\nSmarter.',
                        style: TextStyle(
                            color: c.muted.withValues(alpha: 0.6)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Real-time schedules, transparent pricing, and effortless '
                  'booking across 130+ routes. One platform from search to gate.',
                  style: TextStyle(
                      fontSize: 16, height: 1.4, color: c.muted),
                ),
                const SizedBox(height: 28),
                _SearchBar(),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Mono('POPULAR:', size: 11, color: c.muted),
                    for (final r in const [
                      'JFK → LAX',
                      'ORD → SEA',
                      'MIA → BOS',
                      'DFW → PHX'
                    ])
                      _RouteChip(r),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _LiveBadge extends StatelessWidget {
  const _LiveBadge();
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: c.accentSoft,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: c.accent.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
                color: c.accent, shape: BoxShape.circle),
          ),
          const SizedBox(width: 8),
          Mono('LIVE · 130+ ROUTES ACTIVE',
              size: 11, color: c.accent, weight: FontWeight.w700),
        ],
      ),
    );
  }
}

class _SearchBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return OffsetShadowBox(
      offset: const Offset(5, 5),
      padding: const EdgeInsets.fromLTRB(14, 6, 6, 6),
      child: Row(
        children: [
          Icon(Icons.search, size: 20, color: c.muted),
          const SizedBox(width: 8),
          Expanded(
            child: TextField(
              onSubmitted: (_) => Navigator.pushNamed(context, '/search'),
              decoration: InputDecoration(
                isDense: true,
                border: InputBorder.none,
                hintText: 'From JFK to anywhere...',
                hintStyle: TextStyle(color: c.muted, fontSize: 15),
              ),
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                  color: c.foreground),
            ),
          ),
          PrimaryButton(
            label: 'Search',
            icon: Icons.arrow_forward,
            onPressed: () => Navigator.pushNamed(context, '/search'),
          ),
        ],
      ),
    );
  }
}

class _RouteChip extends StatelessWidget {
  const _RouteChip(this.label);
  final String label;
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return InkWell(
      onTap: () => Navigator.pushNamed(context, '/search'),
      borderRadius: BorderRadius.circular(6),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: c.border),
        ),
        child: Mono(label,
            size: 12, color: c.foreground, weight: FontWeight.w700),
      ),
    );
  }
}

class _Features extends StatelessWidget {
  const _Features();
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    const features = [
      (Icons.search, 'Smart search', '130+ routes, side-by-side compare.'),
      (Icons.public, 'Global coverage', 'Coast-to-coast and beyond.'),
      (Icons.bolt, 'Instant booking', 'Confirmed in seconds.'),
      (Icons.shield_outlined, 'Flexible changes', 'Change or cancel with ease.'),
      (Icons.schedule, 'Live tracking', 'Gates, delays, boarding in real time.'),
    ];
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 48),
      decoration:
          BoxDecoration(border: Border(bottom: BorderSide(color: c.border))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('Why Airflow'),
          const SizedBox(height: 14),
          const Display('One platform.', size: 38),
          Display('Every step.', size: 38, color: c.accent),
          const SizedBox(height: 28),
          for (final f in features)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: BrutalCard(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(f.$1, color: c.accent, size: 24),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(f.$2,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w800, fontSize: 16)),
                          const SizedBox(height: 4),
                          Text(f.$3,
                              style: TextStyle(color: c.muted, fontSize: 13)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _Destinations extends StatelessWidget {
  const _Destinations();
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      padding: const EdgeInsets.only(top: 48, bottom: 48),
      decoration:
          BoxDecoration(border: Border(bottom: BorderSide(color: c.border))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Eyebrow('Get inspired'),
          ),
          const SizedBox(height: 14),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Display('Where to next?', size: 38),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 320,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: kDestinations.length,
              separatorBuilder: (_, _) => const SizedBox(width: 14),
              itemBuilder: (_, i) => _DestinationCard(kDestinations[i]),
            ),
          ),
        ],
      ),
    );
  }
}

class _DestinationCard extends StatelessWidget {
  const _DestinationCard(this.dest);
  final Destination dest;
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, '/search'),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: 230,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(dest.color),
              Color(dest.color).withValues(alpha: 0.7),
            ],
          ),
        ),
        padding: const EdgeInsets.all(22),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Mono(dest.country.toUpperCase(),
                size: 11, color: Colors.white70, weight: FontWeight.w700),
            const Spacer(),
            Mono(dest.code,
                size: 14, color: Colors.white70, weight: FontWeight.w700),
            const SizedBox(height: 6),
            Text(dest.city,
                style: const TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.w900,
                    height: 1,
                    color: Colors.white)),
            const SizedBox(height: 10),
            Text(dest.tagline,
                style: const TextStyle(color: Colors.white, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}

class _PopularFlights extends StatelessWidget {
  const _PopularFlights();
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 48),
      decoration:
          BoxDecoration(border: Border(bottom: BorderSide(color: c.border))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('Trending now'),
          const SizedBox(height: 14),
          const Display('Popular flights.', size: 38),
          const SizedBox(height: 24),
          for (final f in kFlightOffers.take(4))
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: FlightCard(flight: f),
            ),
        ],
      ),
    );
  }
}

class _CtaSection extends StatelessWidget {
  const _CtaSection();
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
        decoration: BoxDecoration(
          color: const Color(0xFF0A0A0A),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Column(
          children: [
            Icon(Icons.flight, color: c.accent, size: 36),
            const SizedBox(height: 20),
            Text.rich(
              textAlign: TextAlign.center,
              TextSpan(
                style: const TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w900,
                    height: 1,
                    letterSpacing: -1.5,
                    color: Colors.white),
                children: [
                  const TextSpan(text: 'Ready to '),
                  TextSpan(
                      text: 'take off', style: TextStyle(color: c.accent)),
                  const TextSpan(text: '?'),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Join thousands of travelers who book smarter with Airflow.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 28),
            PrimaryButton(
              label: 'Search Flights',
              icon: Icons.arrow_forward,
              onPressed: () => Navigator.pushNamed(context, '/search'),
            ),
          ],
        ),
      ),
    );
  }
}

class _Footer extends StatelessWidget {
  const _Footer();
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
      decoration:
          BoxDecoration(border: Border(top: BorderSide(color: c.border))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AirflowLogo(size: 18),
          const SizedBox(height: 12),
          Text('Next-generation flight booking platform.',
              style: TextStyle(color: c.muted, fontSize: 13)),
          const SizedBox(height: 16),
          Mono('© 2026 AIRFLOW', size: 11, color: c.muted),
        ],
      ),
    );
  }
}

/// Reusable flight offer card used on home, search and flights screens.
class FlightCard extends StatelessWidget {
  const FlightCard({super.key, required this.flight});
  final FlightOffer flight;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return BrutalCard(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => FlightDetailsScreen(flightId: flight.id)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Mono('${flight.flightNo} · ${flight.airline.toUpperCase()}',
                        size: 11, color: c.muted),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Mono(flight.fromCode,
                            size: 30, weight: FontWeight.w900),
                        Padding(
                          padding:
                              const EdgeInsets.symmetric(horizontal: 8),
                          child: Text('→',
                              style: TextStyle(
                                  fontSize: 26,
                                  fontWeight: FontWeight.w900,
                                  color: c.accent)),
                        ),
                        Mono(flight.toCode,
                            size: 30, weight: FontWeight.w900),
                      ],
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Mono('FROM', size: 11, color: c.muted),
                  const SizedBox(height: 2),
                  Mono('\$${flight.priceUsd}',
                      size: 26, color: c.accent, weight: FontWeight.w900),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Flexible(
                child: Mono(
                  '${flight.departTime} → ${flight.arriveTime} · ${flight.duration} · ${flight.stopsLabel}',
                  size: 12,
                  color: c.muted,
                ),
              ),
              Mono('${flight.seatsLeft} LEFT', size: 11, color: c.muted),
            ],
          ),
          const SizedBox(height: 14),
          Divider(color: c.border, height: 1),
          const SizedBox(height: 12),
          Row(
            children: [
              Text('View details',
                  style: TextStyle(
                      fontWeight: FontWeight.w800,
                      color: c.foreground,
                      fontSize: 13)),
              const SizedBox(width: 6),
              Icon(Icons.arrow_forward, size: 16, color: c.accent),
            ],
          ),
        ],
      ),
    );
  }
}
