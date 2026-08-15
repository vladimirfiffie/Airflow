import 'package:flutter/material.dart';
import '../platform/adaptive.dart';
import '../platform/haptics.dart';
import '../services/share_service.dart';
import '../theme/app_theme.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/brutal.dart';
import '../data/mock_flights.dart';
import 'booking/booking_flow.dart';

class FlightDetailsScreen extends StatelessWidget {
  const FlightDetailsScreen({super.key, required this.flightId});
  final String flightId;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final flight = findFlight(flightId);
    if (flight == null) {
      return AppScaffold(
        body: Center(child: Text('Flight not found', style: TextStyle(color: c.muted))),
      );
    }
    return AppScaffold(
      title: flight.flightNo,
      actions: [
        IconButton(
          tooltip: 'Share flight',
          icon: const Icon(Icons.ios_share, size: 20),
          onPressed: () => ShareService.flight(flight),
        ),
      ],
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Mono('${flight.flightNo} · ${flight.airline.toUpperCase()}',
              size: 12, color: c.muted),
          const SizedBox(height: 14),
          Row(
            children: [
              Mono(flight.fromCode, size: 44, weight: FontWeight.w900),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Text('→',
                    style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: c.accent)),
              ),
              Mono(flight.toCode, size: 44, weight: FontWeight.w900),
            ],
          ),
          const SizedBox(height: 24),
          BrutalCard(
            child: Column(
              children: [
                _DetailRow(
                    label: 'Departs', value: flight.departTime, icon: Icons.flight_takeoff),
                Divider(color: c.border, height: 24),
                _DetailRow(
                    label: 'Arrives', value: flight.arriveTime, icon: Icons.flight_land),
                Divider(color: c.border, height: 24),
                _DetailRow(
                    label: 'Duration', value: flight.duration, icon: Icons.schedule),
                Divider(color: c.border, height: 24),
                _DetailRow(
                    label: 'Stops',
                    value: flight.stopsLabel,
                    icon: Icons.alt_route),
                Divider(color: c.border, height: 24),
                _DetailRow(
                    label: 'Seats left',
                    value: '${flight.seatsLeft}',
                    icon: Icons.event_seat),
              ],
            ),
          ),
          const SizedBox(height: 20),
          BrutalCard(
            color: c.surface2,
            child: Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Mono('FARE FROM', size: 11, color: c.muted),
                    const SizedBox(height: 4),
                    Mono('\$${flight.priceUsd}',
                        size: 36, color: c.accent, weight: FontWeight.w900),
                    Text('per passenger · taxes extra',
                        style: TextStyle(fontSize: 12, color: c.muted)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: PrimaryButton(
              label: 'Book this flight',
              icon: Icons.arrow_forward,
              expand: true,
              onPressed: () {
                AppHaptics.step();
                Adaptive.push(
                  context,
                  builder: (_) => BookingFlow(flight: flight),
                  title: 'Book ${flight.flightNo}',
                );
              },
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: Text('Free 24-hour cancellation · No hidden fees',
                style: TextStyle(fontSize: 12, color: c.muted)),
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow(
      {required this.label, required this.value, required this.icon});
  final String label;
  final String value;
  final IconData icon;
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Row(
      children: [
        Icon(icon, size: 18, color: c.accent),
        const SizedBox(width: 12),
        Text(label, style: TextStyle(color: c.muted, fontWeight: FontWeight.w600)),
        const Spacer(),
        Mono(value, size: 15, weight: FontWeight.w700),
      ],
    );
  }
}
