import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../data/flight_times.dart';
import '../../data/seat_map.dart';
import '../../models/saved_booking.dart';
import '../../models/seat.dart';
import '../../platform/adaptive.dart';
import '../../platform/haptics.dart';
import '../../services/bookings_repository.dart';
import '../../services/calendar_service.dart';
import '../../services/notifications_service.dart';
import '../../services/share_service.dart';
import '../../state/booking_controller.dart';
import '../../theme/app_theme.dart';
import '../../widgets/app_shell.dart';
import '../../widgets/brutal.dart';

/// Step 4 — booking confirmed. Shows ref, passengers/seats and fare, and is
/// where the booking stops being ephemeral: it's written to device storage
/// here, then offered to the calendar, the share sheet and the reminder
/// scheduler.
class ConfirmationStep extends StatefulWidget {
  const ConfirmationStep({super.key, required this.controller});
  final BookingController controller;

  @override
  State<ConfirmationStep> createState() => _ConfirmationStepState();
}

class _ConfirmationStepState extends State<ConfirmationStep> {
  SavedBooking? _saved;
  bool _remindersOn = false;
  bool _working = false;

  @override
  void initState() {
    super.initState();
    _persist();
  }

  /// Snapshot the in-progress booking and store it.
  Future<void> _persist() async {
    final ctrl = widget.controller;
    final ref = ctrl.bookingRef;
    if (ref == null) return;

    final booking = SavedBooking(
      ref: ref,
      flight: ctrl.flight,
      passengers: [
        for (final p in ctrl.passengers)
          SavedPassenger(
            name: p.displayName,
            seatId: p.seatId,
            seatLabel: p.seatId == null
                ? ''
                : seatById(ctrl.seats, p.seatId!)?.cls.label ?? '',
          ),
      ],
      contactEmail: ctrl.contact.email,
      totalUsd: ctrl.fare.total,
      bookedAt: DateTime.now(),
      departsAt: FlightTimes.departure(ctrl.flight),
      arrivesAt: FlightTimes.arrival(ctrl.flight),
    );

    await BookingsRepository.instance.add(booking);
    if (!mounted) return;
    setState(() => _saved = booking);
  }

  Future<void> _share() async {
    final booking = _saved;
    if (booking == null) return;
    await ShareService.booking(booking);
  }

  Future<void> _addToCalendar() async {
    final booking = _saved;
    if (booking == null) return;
    setState(() => _working = true);
    final added = await CalendarService.addFlight(booking);
    if (!mounted) return;
    setState(() => _working = false);
    Adaptive.notify(
      context,
      added ? 'Opening your calendar…' : 'No calendar app found',
      isError: !added,
    );
  }

  Future<void> _toggleReminders(bool value) async {
    final booking = _saved;
    if (booking == null) return;

    if (!value) {
      await NotificationsService.instance.cancelFor(booking);
      if (!mounted) return;
      setState(() => _remindersOn = false);
      Adaptive.notify(context, 'Reminders off');
      return;
    }

    final granted = await NotificationsService.instance.requestPermission();
    if (!mounted) return;
    if (!granted) {
      Adaptive.notify(
        context,
        'Notifications are off for Airflow — enable them in Settings',
        isError: true,
      );
      return;
    }
    final count = await NotificationsService.instance.scheduleFor(booking);
    if (!mounted) return;
    setState(() => _remindersOn = count > 0);
    Adaptive.notify(
      context,
      count == 0
          ? 'Departure is too soon to schedule a reminder'
          : 'Reminders set for check-in and boarding',
      isError: count == 0,
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final ref = widget.controller.bookingRef ?? '—';
    final f = widget.controller.flight;
    final fare = widget.controller.fare;

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
        Text('A confirmation has been sent to ${widget.controller.contact.email}.',
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
                  Row(
                    children: [
                      IconButton(
                        tooltip: 'Copy',
                        icon: Icon(Icons.copy, size: 18, color: c.muted),
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: ref));
                          AppHaptics.light();
                          Adaptive.notify(context, 'Reference copied');
                        },
                      ),
                      IconButton(
                        tooltip: 'Share',
                        icon: Icon(Icons.ios_share, size: 18, color: c.muted),
                        onPressed: _saved == null ? null : _share,
                      ),
                    ],
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
              for (final p in widget.controller.passengers)
                Builder(builder: (_) {
                  final seat = p.seatId == null
                      ? null
                      : seatById(widget.controller.seats, p.seatId!);
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
        const SizedBox(height: 20),

        // ---- Native follow-ups -------------------------------------------
        const Eyebrow('Keep it handy'),
        const SizedBox(height: 12),
        BrutalCard(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: Column(
            children: [
              Row(
                children: [
                  Icon(Icons.notifications_active_outlined,
                      size: 20, color: c.muted),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'Remind me before boarding',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                  Adaptive.toggle(
                    value: _remindersOn,
                    activeColor: c.accent,
                    onChanged: _saved == null ? null : _toggleReminders,
                  ),
                ],
              ),
              Divider(color: c.border, height: 1),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.event_available_outlined,
                    size: 20, color: c.muted),
                title: const Text(
                  'Add to calendar',
                  style: TextStyle(fontWeight: FontWeight.w700),
                ),
                trailing: _working
                    ? Adaptive.progressIndicator(size: 18, color: c.accent)
                    : Icon(Icons.chevron_right, color: c.muted),
                onTap: _saved == null || _working ? null : _addToCalendar,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: GhostButton(
                label: 'My bookings',
                icon: Icons.confirmation_number_outlined,
                onPressed: () {
                  final shell = AppShellScope.maybeOf(context);
                  Navigator.of(context).popUntil((r) => r.isFirst);
                  shell?.goToTab(AppTab.bookings);
                },
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: PrimaryButton(
                label: 'Done',
                icon: Icons.check,
                expand: true,
                onPressed: () {
                  AppHaptics.light();
                  Navigator.of(context).popUntil((r) => r.isFirst);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }
}
