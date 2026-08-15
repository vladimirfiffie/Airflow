import 'package:flutter/material.dart';

import '../models/saved_booking.dart';
import '../platform/adaptive.dart';
import '../platform/haptics.dart';
import '../services/biometrics_service.dart';
import '../services/bookings_repository.dart';
import '../services/calendar_service.dart';
import '../services/notifications_service.dart';
import '../services/share_service.dart';
import '../theme/app_theme.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/app_shell.dart';
import '../widgets/brutal.dart';

/// Saved bookings, restored from disk and optionally behind a biometric gate.
class BookingsScreen extends StatefulWidget {
  const BookingsScreen({super.key});

  @override
  State<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends State<BookingsScreen> {
  final _repo = BookingsRepository.instance;

  bool _lockEnabled = false;
  bool _unlocked = false;
  bool _checkingLock = true;
  bool _biometricsAvailable = false;

  @override
  void initState() {
    super.initState();
    _repo.addListener(_onRepoChanged);
    _bootstrap();
  }

  @override
  void dispose() {
    _repo.removeListener(_onRepoChanged);
    super.dispose();
  }

  void _onRepoChanged() {
    if (mounted) setState(() {});
  }

  Future<void> _bootstrap() async {
    if (!_repo.isLoaded) await _repo.load();
    final available = await BiometricsService.instance.isAvailable();
    final locked = await BiometricsService.instance.isLockEnabled();
    if (!mounted) return;
    setState(() {
      _biometricsAvailable = available;
      _lockEnabled = locked;
      _checkingLock = false;
      _unlocked = !locked;
    });
    if (locked) await _unlock();
  }

  Future<void> _unlock() async {
    final passed = await BiometricsService.instance.authenticate(
      reason: 'Unlock to view your bookings',
    );
    if (!mounted) return;
    if (passed) {
      AppHaptics.success();
      setState(() => _unlocked = true);
    } else {
      AppHaptics.error();
    }
  }

  Future<void> _toggleLock(bool value) async {
    final ok = await BiometricsService.instance.setLockEnabled(value);
    if (!mounted) return;
    if (!ok) {
      Adaptive.notify(context, 'Could not verify — lock unchanged',
          isError: true);
      return;
    }
    setState(() {
      _lockEnabled = value;
      if (!value) _unlocked = true;
    });
    Adaptive.notify(
      context,
      value ? 'Bookings locked' : 'Lock removed',
    );
  }

  Future<void> _showActions(SavedBooking booking) async {
    final action = await Adaptive.chooseFrom<String>(
      context,
      title: 'Booking ${booking.ref}',
      message: '${booking.flight.fromCode} → ${booking.flight.toCode}',
      choices: [
        const AdaptiveChoice(
          label: 'Share booking',
          value: 'share',
          icon: Icons.ios_share,
        ),
        const AdaptiveChoice(
          label: 'Add to calendar',
          value: 'calendar',
          icon: Icons.event_available_outlined,
        ),
        const AdaptiveChoice(
          label: 'Remind me before boarding',
          value: 'remind',
          icon: Icons.notifications_active_outlined,
        ),
        const AdaptiveChoice(
          label: 'Delete booking',
          value: 'delete',
          icon: Icons.delete_outline,
          destructive: true,
        ),
      ],
    );
    if (!mounted || action == null) return;

    switch (action) {
      case 'share':
        await ShareService.booking(booking);
      case 'calendar':
        final added = await CalendarService.addFlight(booking);
        if (!mounted) return;
        Adaptive.notify(
          context,
          added ? 'Opening your calendar…' : 'No calendar app found',
          isError: !added,
        );
      case 'remind':
        await _scheduleReminders(booking);
      case 'delete':
        await _confirmDelete(booking);
    }
  }

  Future<void> _scheduleReminders(SavedBooking booking) async {
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
    AppHaptics.success();
    Adaptive.notify(
      context,
      count == 0
          ? 'Departure is too soon to schedule a reminder'
          : 'You\'ll be reminded before boarding',
      isError: count == 0,
    );
  }

  Future<void> _confirmDelete(SavedBooking booking) async {
    final confirmed = await Adaptive.confirm(
      context,
      title: 'Delete booking ${booking.ref}?',
      message: 'This removes it from this device and cancels its reminders.',
      confirmLabel: 'Delete',
      destructive: true,
    );
    if (!confirmed || !mounted) return;
    await NotificationsService.instance.cancelFor(booking);
    await _repo.remove(booking.ref);
    if (!mounted) return;
    AppHaptics.warning();
    Adaptive.notify(context, 'Booking ${booking.ref} deleted');
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);

    // A deep link or notification tap can name a booking to highlight.
    final shell = AppShellScope.maybeOf(context);
    final highlightRef = shell?.pendingBookingRef;

    if (_checkingLock) {
      return AppScaffold(
        scrollable: false,
        body: Center(child: Adaptive.progressIndicator(size: 28)),
      );
    }

    if (_lockEnabled && !_unlocked) {
      return AppScaffold(
        scrollable: false,
        body: _LockedPane(onUnlock: _unlock),
      );
    }

    final upcoming = _repo.upcoming;
    final past = _repo.past;

    return AppScaffold(
      onRefresh: _repo.load,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('Your trips'),
          const SizedBox(height: 10),
          const Display('Bookings.', size: 38),
          const SizedBox(height: 8),
          Text(
            'Saved on this device — they survive a restart.',
            style: TextStyle(color: c.muted),
          ),
          const SizedBox(height: 22),
          if (_biometricsAvailable) ...[
            BrutalCard(
              padding: const EdgeInsets.fromLTRB(16, 6, 8, 6),
              child: Row(
                children: [
                  Icon(Icons.lock_outline, size: 20, color: c.muted),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'Require unlock to view',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                  Adaptive.toggle(
                    value: _lockEnabled,
                    activeColor: c.accent,
                    onChanged: _toggleLock,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),
          ],
          if (upcoming.isEmpty && past.isEmpty)
            const _EmptyState()
          else ...[
            if (upcoming.isNotEmpty) ...[
              const Eyebrow('Upcoming'),
              const SizedBox(height: 12),
              for (final booking in upcoming)
                _BookingCard(
                  booking: booking,
                  highlighted: booking.ref == highlightRef,
                  onTap: () => _showActions(booking),
                ),
            ],
            if (past.isNotEmpty) ...[
              const SizedBox(height: 20),
              const Eyebrow('Past'),
              const SizedBox(height: 12),
              for (final booking in past)
                _BookingCard(
                  booking: booking,
                  highlighted: booking.ref == highlightRef,
                  faded: true,
                  onTap: () => _showActions(booking),
                ),
            ],
          ],
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _LockedPane extends StatelessWidget {
  const _LockedPane({required this.onUnlock});
  final VoidCallback onUnlock;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.lock_outline, size: 48, color: c.accent),
            const SizedBox(height: 20),
            const Display('Locked.', size: 32),
            const SizedBox(height: 10),
            Text(
              'Your bookings are protected on this device.',
              textAlign: TextAlign.center,
              style: TextStyle(color: c.muted),
            ),
            const SizedBox(height: 24),
            PrimaryButton(
              label: 'Unlock',
              icon: Icons.fingerprint,
              onPressed: onUnlock,
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return BrutalCard(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
      child: Column(
        children: [
          Icon(Icons.confirmation_number_outlined, size: 40, color: c.muted),
          const SizedBox(height: 16),
          const Text(
            'No bookings yet',
            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
          ),
          const SizedBox(height: 6),
          Text(
            'Book a flight and it\'ll be saved here.',
            textAlign: TextAlign.center,
            style: TextStyle(color: c.muted),
          ),
          const SizedBox(height: 20),
          PrimaryButton(
            label: 'Find a flight',
            icon: Icons.search,
            onPressed: () =>
                AppShellScope.of(context).goToTab(AppTab.search),
          ),
        ],
      ),
    );
  }
}

class _BookingCard extends StatelessWidget {
  const _BookingCard({
    required this.booking,
    required this.onTap,
    this.highlighted = false,
    this.faded = false,
  });

  final SavedBooking booking;
  final VoidCallback onTap;
  final bool highlighted;
  final bool faded;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final f = booking.flight;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Opacity(
        opacity: faded ? 0.6 : 1,
        child: BrutalCard(
          borderColor: highlighted ? c.accent : null,
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Mono('${f.flightNo} · ${f.airline.toUpperCase()}',
                      size: 11, color: c.muted),
                  Mono(booking.ref,
                      size: 13, weight: FontWeight.w900, color: c.accent),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Mono(f.fromCode, size: 22, weight: FontWeight.w900),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Text(
                      '→',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: c.accent,
                      ),
                    ),
                  ),
                  Mono(f.toCode, size: 22, weight: FontWeight.w900),
                  const Spacer(),
                  Icon(Icons.more_horiz, size: 20, color: c.muted),
                ],
              ),
              const SizedBox(height: 8),
              Mono(
                '${f.departTime} → ${f.arriveTime} · seat ${booking.seatSummary}',
                size: 12,
                color: c.muted,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
