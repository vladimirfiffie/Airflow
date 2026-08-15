import 'package:flutter/material.dart';
import '../../platform/adaptive.dart';
import '../../platform/haptics.dart';
import '../../theme/app_theme.dart';
import '../../widgets/brutal.dart';
import '../../state/booking_controller.dart';
import '../../data/seat_map.dart';
import '../../models/seat.dart';

/// Step 2 — interactive cabin seat map.
class SeatsStep extends StatefulWidget {
  const SeatsStep({
    super.key,
    required this.controller,
    required this.onNext,
    required this.onBack,
  });
  final BookingController controller;
  final VoidCallback onNext;
  final VoidCallback onBack;

  @override
  State<SeatsStep> createState() => _SeatsStepState();
}

class _SeatsStepState extends State<SeatsStep> {
  int _active = 0;

  void _tapSeat(Seat seat) {
    if (seat.taken) {
      // Tapping a sold seat is the most common miss on this screen — a buzz
      // explains the non-response faster than any label could.
      AppHaptics.warning();
      return;
    }
    final ctrl = widget.controller;
    setState(() {
      if (ctrl.passengers[_active].seatId == seat.id) {
        ctrl.assignSeat(_active, null);
        AppHaptics.selection();
      } else {
        ctrl.assignSeat(_active, seat.id);
        AppHaptics.rigid();
        // advance to next unseated passenger
        final next = ctrl.passengers
            .indexWhere((p) => p.seatId == null);
        if (next != -1) _active = next;
      }
    });
  }

  void _continue() {
    if (!widget.controller.allSeatsAssigned) {
      Adaptive.notify(
        context,
        'Pick a seat for every passenger.',
        isError: true,
      );
      return;
    }
    AppHaptics.step();
    widget.onNext();
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final ctrl = widget.controller;
    final seatsByRow = <int, List<Seat>>{};
    for (final s in ctrl.seats) {
      seatsByRow.putIfAbsent(s.row, () => []).add(s);
    }
    final assigned =
        ctrl.passengers.where((p) => p.seatId != null).length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Eyebrow('Step 2 of 4'),
        const SizedBox(height: 12),
        const Display('Choose your seats.', size: 32),
        const SizedBox(height: 8),
        Text(
          'Tap a seat to assign it to the active passenger. Exit rows and '
          'first class carry a surcharge.',
          style: TextStyle(color: c.muted),
        ),
        const SizedBox(height: 18),
        // Passenger picker
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (var i = 0; i < ctrl.passengers.length; i++)
              _PassengerChip(
                index: i,
                controller: ctrl,
                active: i == _active,
                onTap: () => setState(() => _active = i),
              ),
          ],
        ),
        const SizedBox(height: 18),
        BrutalCard(
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Mono('CABIN · A321neo', size: 11, color: c.muted),
                  Mono('$assigned/${ctrl.passengerCount} ASSIGNED',
                      size: 11, color: c.muted),
                ],
              ),
              const SizedBox(height: 12),
              // cabin nose
              Container(
                width: 120,
                height: 26,
                decoration: BoxDecoration(
                  border: Border.all(color: c.border),
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(60)),
                ),
              ),
              const SizedBox(height: 8),
              for (final entry
                  in (seatsByRow.entries.toList()
                        ..sort((a, b) => a.key.compareTo(b.key))))
                _SeatRow(
                  row: entry.key,
                  seats: entry.value,
                  controller: ctrl,
                  active: _active,
                  onTap: _tapSeat,
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        _Legend(),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            GhostButton(
                label: 'Back',
                icon: Icons.arrow_back,
                onPressed: widget.onBack),
            PrimaryButton(
              label: 'Continue to payment',
              icon: Icons.arrow_forward,
              onPressed: _continue,
            ),
          ],
        ),
      ],
    );
  }
}

class _PassengerChip extends StatelessWidget {
  const _PassengerChip({
    required this.index,
    required this.controller,
    required this.active,
    required this.onTap,
  });
  final int index;
  final BookingController controller;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final p = controller.passengers[index];
    final seat =
        p.seatId == null ? null : seatById(controller.seats, p.seatId!);
    final name =
        p.displayName == 'Passenger' ? 'Passenger ${index + 1}' : p.displayName;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: active ? c.accentSoft : c.surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: active ? c.accent : c.border),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.person,
                size: 16, color: active ? c.accent : c.muted),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    style: const TextStyle(
                        fontWeight: FontWeight.w800, fontSize: 13)),
                Mono(
                    seat == null
                        ? 'No seat'
                        : '${seat.id} · ${seat.cls.label}',
                    size: 11,
                    color: c.muted),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _SeatRow extends StatelessWidget {
  const _SeatRow({
    required this.row,
    required this.seats,
    required this.controller,
    required this.active,
    required this.onTap,
  });
  final int row;
  final List<Seat> seats;
  final BookingController controller;
  final int active;
  final void Function(Seat) onTap;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final isFirst = kFirstRows.contains(row);
    final aisleAfter = isFirst ? 1 : 2;

    final cells = <Widget>[];
    for (var i = 0; i < seats.length; i++) {
      cells.add(_SeatButton(
        seat: seats[i],
        controller: controller,
        active: active,
        onTap: onTap,
      ));
      if (i == aisleAfter) {
        cells.add(SizedBox(
          width: 22,
          child: Center(
            child: kExitRows.contains(row)
                ? Mono('EXIT', size: 8, color: c.accent, weight: FontWeight.w800)
                : Text('·', style: TextStyle(color: c.muted)),
          ),
        ));
      }
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 20,
            child: Mono('$row',
                size: 10, color: c.muted, weight: FontWeight.w700),
          ),
          ...cells,
        ],
      ),
    );
  }
}

class _SeatButton extends StatelessWidget {
  const _SeatButton({
    required this.seat,
    required this.controller,
    required this.active,
    required this.onTap,
  });
  final Seat seat;
  final BookingController controller;
  final int active;
  final void Function(Seat) onTap;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    int? ownerIndex;
    for (var i = 0; i < controller.passengers.length; i++) {
      if (controller.passengers[i].seatId == seat.id) {
        ownerIndex = i;
        break;
      }
    }
    final isMine = ownerIndex == active;
    final isOther = ownerIndex != null && ownerIndex != active;

    Color bg;
    Color fg;
    if (seat.taken) {
      bg = c.surface2;
      fg = c.muted.withValues(alpha: 0.5);
    } else if (isMine) {
      bg = c.accent;
      fg = Colors.white;
    } else if (isOther) {
      bg = c.foreground;
      fg = c.background;
    } else if (seat.cls == SeatClass.first) {
      bg = const Color(0xFFFEF3C7);
      fg = const Color(0xFF92400E);
    } else if (seat.cls == SeatClass.exit) {
      bg = const Color(0xFFD1FAE5);
      fg = const Color(0xFF065F46);
    } else {
      bg = c.surface2;
      fg = c.foreground;
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2),
      child: GestureDetector(
        onTap: () => onTap(seat),
        child: Container(
          width: 26,
          height: 26,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(5),
            border: isMine
                ? Border.all(color: c.accent, width: 1)
                : null,
          ),
          child: Mono(seat.col, size: 10, color: fg, weight: FontWeight.w700),
        ),
      ),
    );
  }
}

class _Legend extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    Widget item(Color color, String label) => Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 14,
              height: 14,
              decoration: BoxDecoration(
                  color: color, borderRadius: BorderRadius.circular(3)),
            ),
            const SizedBox(width: 6),
            Text(label, style: TextStyle(fontSize: 12, color: c.muted)),
          ],
        );
    return BrutalCard(
      child: Wrap(
        spacing: 16,
        runSpacing: 10,
        children: [
          item(c.accent, 'Your selection'),
          item(c.foreground, 'Other passenger'),
          item(const Color(0xFFFEF3C7), 'First +\$150'),
          item(const Color(0xFFD1FAE5), 'Exit +\$25'),
          item(c.surface2, 'Standard'),
          item(c.muted.withValues(alpha: 0.3), 'Taken'),
        ],
      ),
    );
  }
}
