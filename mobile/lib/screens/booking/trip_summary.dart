import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../widgets/brutal.dart';
import '../../state/booking_controller.dart';
import '../../data/seat_map.dart';
import '../../models/seat.dart';

/// Collapsible fare + trip summary shown under each booking step.
class TripSummary extends StatelessWidget {
  const TripSummary({super.key, required this.controller});
  final BookingController controller;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final f = controller.flight;
    final fare = controller.fare;

    return BrutalCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Flight banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: c.surface2,
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              border: Border(bottom: BorderSide(color: c.border)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Mono('${f.flightNo} · ${f.airline.toUpperCase()}',
                    size: 11, color: c.muted, letterSpacing: 1.2),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Mono(f.fromCode, size: 26, weight: FontWeight.w900),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Text('→',
                          style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: c.accent)),
                    ),
                    Mono(f.toCode, size: 26, weight: FontWeight.w900),
                  ],
                ),
                const SizedBox(height: 6),
                Mono('${f.departTime} → ${f.arriveTime} · ${f.duration}',
                    size: 12, color: c.muted),
              ],
            ),
          ),
          // Passengers
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Eyebrow('Trip'),
                const SizedBox(height: 10),
                _row(context, 'Passengers', '${controller.passengerCount}'),
                for (var i = 0; i < controller.passengers.length; i++)
                  Builder(builder: (_) {
                    final p = controller.passengers[i];
                    final seat = p.seatId == null
                        ? null
                        : seatById(controller.seats, p.seatId!);
                    final name = p.displayName == 'Passenger'
                        ? 'Passenger ${i + 1}'
                        : p.displayName;
                    return _row(
                      context,
                      name,
                      seat == null
                          ? 'No seat yet'
                          : '${seat.id} · ${seat.cls.label}',
                      muted: seat == null,
                    );
                  }),
              ],
            ),
          ),
          Divider(color: c.border, height: 1),
          // Fare
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Eyebrow('Fare'),
                const SizedBox(height: 10),
                _row(context, 'Base × ${controller.passengerCount}',
                    '\$${fare.baseFare}'),
                _row(context, 'Seat upgrades', '\$${fare.seatSurcharge}'),
                _row(context, 'Taxes & fees', '\$${fare.taxes}'),
                const SizedBox(height: 10),
                Divider(color: c.border, height: 1),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total',
                        style: TextStyle(
                            fontWeight: FontWeight.w800, fontSize: 15)),
                    Mono('\$${fare.total}',
                        size: 24, color: c.accent, weight: FontWeight.w900),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _row(BuildContext context, String label, String value,
      {bool muted = false}) {
    final c = AppColors.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Flexible(
            child: Text(label,
                style: TextStyle(color: c.muted, fontSize: 13),
                overflow: TextOverflow.ellipsis),
          ),
          const SizedBox(width: 10),
          Text(value,
              style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                  color: muted ? c.muted : c.foreground)),
        ],
      ),
    );
  }
}
