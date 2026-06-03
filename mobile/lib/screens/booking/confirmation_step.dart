import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../theme/app_theme.dart';
import '../../widgets/brutal.dart';
import '../../state/booking_controller.dart';
import '../../data/seat_map.dart';
import '../../models/seat.dart';

/// Step 4 — booking confirmed. Shows ref, passengers/seats and fare.
class ConfirmationStep extends StatelessWidget {
  const ConfirmationStep({super.key, required this.controller});
  final BookingController controller;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final ref = controller.bookingRef ?? '—';
    final f = controller.flight;
    final fare = controller.fare;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Eyebrow('Step 4 of 4'),
        const SizedBox(height: 12),
        Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check,
                  color: Color(0xFF10B981), size: 26),
            ),
            const SizedBox(width: 14),
            const Expanded(child: Display("You're booked.", size: 30)),
          ],
        ),
        const SizedBox(height: 10),
        Text('A confirmation has been sent to ${controller.contact.email}.',
            style: TextStyle(color: c.muted)),
        const SizedBox(height: 20),
        OffsetShadowBox(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Mono('BOOKING REFERENCE', size: 11, color: c.muted),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Mono(ref,
                      size: 40, weight: FontWeight.w900, color: c.accent),
                  IconButton(
                    tooltip: 'Copy',
                    icon: Icon(Icons.copy, size: 18, color: c.muted),
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: ref));
                      ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Reference copied')));
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        BrutalCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Mono('${f.flightNo} · ${f.airline.toUpperCase()}',
                  size: 11, color: c.muted),
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
              Divider(color: c.border, height: 28),
              const Eyebrow('Passengers'),
              const SizedBox(height: 10),
              for (final p in controller.passengers)
                Builder(builder: (_) {
                  final seat = p.seatId == null
                      ? null
                      : seatById(controller.seats, p.seatId!);
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(p.displayName,
                            style:
                                const TextStyle(fontWeight: FontWeight.w600)),
                        Mono(
                            seat == null
                                ? '—'
                                : '${seat.id} · ${seat.cls.label}',
                            size: 13,
                            color: c.muted),
                      ],
                    ),
                  );
                }),
              Divider(color: c.border, height: 28),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Total paid',
                      style:
                          TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                  Mono('\$${fare.total}',
                      size: 24, color: c.accent, weight: FontWeight.w900),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: PrimaryButton(
            label: 'Back to home',
            icon: Icons.home_outlined,
            expand: true,
            onPressed: () =>
                Navigator.of(context).popUntil((r) => r.isFirst),
          ),
        ),
      ],
    );
  }
}
