import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:timezone/data/latest_all.dart' as tz_data;
import 'package:timezone/timezone.dart' as tz;

import '../models/saved_booking.dart';

/// Boarding reminders, scheduled on the device.
///
/// Everything here is best-effort: a denied permission, an unparseable
/// timezone or a departure that has already passed all resolve to "no
/// reminder" rather than an error the user has to deal with mid-booking.
class NotificationsService {
  NotificationsService._();

  static final NotificationsService instance = NotificationsService._();

  static const _channelId = 'airflow.boarding';
  static const _channelName = 'Boarding reminders';
  static const _channelDescription =
      'Reminds you before check-in opens and before boarding starts.';

  /// How far ahead of departure each reminder fires.
  static const _checkInLeadTime = Duration(hours: 24);
  static const _boardingLeadTime = Duration(minutes: 45);

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  bool _ready = false;

  /// Payload of the notification that launched the app, if any — read once by
  /// the deep-link handler so a tapped reminder can open its booking.
  String? launchPayload;

  /// Called on notification taps while the app is running.
  ValueChanged<String>? onTapPayload;

  /// Sets up timezones, the Android channel, and tap handling.
  ///
  /// Safe to call more than once; only the first call does work.
  Future<void> init() async {
    if (_ready) return;

    await _configureTimeZone();

    const settings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );

    await _plugin.initialize(
      settings: settings,
      onDidReceiveNotificationResponse: (response) {
        final payload = response.payload;
        if (payload != null && payload.isNotEmpty) {
          onTapPayload?.call(payload);
        }
      },
    );

    final launchDetails = await _plugin.getNotificationAppLaunchDetails();
    if (launchDetails?.didNotificationLaunchApp ?? false) {
      launchPayload = launchDetails?.notificationResponse?.payload;
    }

    await _android?.createNotificationChannel(
      const AndroidNotificationChannel(
        _channelId,
        _channelName,
        description: _channelDescription,
        importance: Importance.high,
      ),
    );

    _ready = true;
  }

  AndroidFlutterLocalNotificationsPlugin? get _android =>
      _plugin.resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();

  /// `tz.local` defaults to UTC, which would fire reminders at the wrong
  /// wall-clock time for anyone not on UTC. Resolve the device zone instead.
  Future<void> _configureTimeZone() async {
    tz_data.initializeTimeZones();
    try {
      final info = await FlutterTimezone.getLocalTimezone();
      tz.setLocalLocation(tz.getLocation(info.identifier));
    } on tz.LocationNotFoundException {
      // Unknown zone name — leave tz.local as UTC.
    } catch (_) {
      // Channel failure on an unsupported platform. Same fallback.
    }
  }

  /// Asks for the Android 13+ POST_NOTIFICATIONS permission.
  ///
  /// Returns whether notifications may be posted. Call this at the point the
  /// user opts in — not at launch — so the prompt has visible context.
  Future<bool> requestPermission() async {
    await init();
    final granted = await _android?.requestNotificationsPermission();
    return granted ?? false;
  }

  Future<bool> hasPermission() async {
    await init();
    final enabled = await _android?.areNotificationsEnabled();
    return enabled ?? false;
  }

  /// Schedules the check-in and boarding reminders for [booking].
  ///
  /// Returns the number of reminders actually scheduled — lead times already
  /// in the past are skipped, so a flight departing in 10 minutes schedules
  /// nothing rather than firing immediately.
  Future<int> scheduleFor(SavedBooking booking) async {
    await init();

    final details = NotificationDetails(
      android: AndroidNotificationDetails(
        _channelId,
        _channelName,
        channelDescription: _channelDescription,
        importance: Importance.high,
        priority: Priority.high,
        category: AndroidNotificationCategory.reminder,
        styleInformation: const DefaultStyleInformation(true, true),
      ),
    );

    final route = '${booking.flight.fromCode} → ${booking.flight.toCode}';
    var scheduled = 0;

    final reminders = <({int idOffset, DateTime when, String title, String body})>[
      (
        idOffset: 0,
        when: booking.departsAt.subtract(_checkInLeadTime),
        title: 'Check-in is open — ${booking.flight.flightNo}',
        body: '$route departs tomorrow at ${booking.flight.departTime}. '
            'Reference ${booking.ref}.',
      ),
      (
        idOffset: 1,
        when: booking.departsAt.subtract(_boardingLeadTime),
        title: 'Boarding soon — ${booking.flight.flightNo}',
        body: '$route boards shortly. '
            'Seat ${booking.seatSummary} · gate info at the airport.',
      ),
    ];

    for (final reminder in reminders) {
      if (!reminder.when.isAfter(DateTime.now())) continue;
      await _plugin.zonedSchedule(
        id: booking.notificationId + reminder.idOffset,
        scheduledDate: tz.TZDateTime.from(reminder.when, tz.local),
        title: reminder.title,
        body: reminder.body,
        notificationDetails: details,
        payload: booking.ref,
        // Inexact keeps this off the SCHEDULE_EXACT_ALARM permission, which
        // Android only grants alarm-clock-grade apps. A reminder landing a few
        // minutes late is fine; being denied outright is not.
        androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      );
      scheduled++;
    }

    return scheduled;
  }

  Future<void> cancelFor(SavedBooking booking) async {
    await init();
    await _plugin.cancel(id: booking.notificationId);
    await _plugin.cancel(id: booking.notificationId + 1);
  }
}
