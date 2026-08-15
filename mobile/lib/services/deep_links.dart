import 'dart:async';

import 'package:app_links/app_links.dart';
import 'package:flutter/foundation.dart';

/// Where an incoming link wants to go.
sealed class AppDestination {
  const AppDestination();
}

/// `airflow://flight/AF1001` or `https://airflow.app/flight/AF1001`
class FlightDestination extends AppDestination {
  const FlightDestination(this.flightId);
  final String flightId;
}

/// `airflow://booking/AB12CD`
class BookingDestination extends AppDestination {
  const BookingDestination(this.ref);
  final String ref;
}

/// `airflow://search?q=JFK`
class SearchDestination extends AppDestination {
  const SearchDestination(this.query);
  final String query;
}

/// A named tab: `airflow://flights`, `airflow://schedule`, `airflow://help`.
class TabDestination extends AppDestination {
  const TabDestination(this.name);
  final String name;
}

/// Parses and streams incoming deep links.
///
/// Handles both the custom `airflow://` scheme and `https://airflow.app`
/// App Links. The web app owns the same paths, so a link shared out of the
/// mobile app resolves in a browser for anyone without the app installed.
class DeepLinks {
  DeepLinks._();

  static final DeepLinks instance = DeepLinks._();

  static const scheme = 'airflow';
  static const webHost = 'airflow.app';

  final AppLinks _appLinks = AppLinks();
  StreamSubscription<Uri>? _subscription;

  static String flightUrl(String flightId) =>
      'https://$webHost/flights/$flightId';

  static String bookingUrl(String ref) => 'https://$webHost/booking/$ref';

  /// Starts listening. [onDestination] fires for the link that cold-started
  /// the app (if any) and for every link received while it runs.
  Future<void> start(ValueChanged<AppDestination> onDestination) async {
    final initial = await _appLinks.getInitialLink();
    if (initial != null) {
      final destination = parse(initial);
      if (destination != null) onDestination(destination);
    }

    _subscription ??= _appLinks.uriLinkStream.listen(
      (uri) {
        final destination = parse(uri);
        if (destination != null) onDestination(destination);
      },
      onError: (Object _) {
        // A malformed link is not actionable; ignore it.
      },
    );
  }

  Future<void> dispose() async {
    await _subscription?.cancel();
    _subscription = null;
  }

  /// Maps a URI onto a destination, or null when nothing matches.
  ///
  /// Custom-scheme URIs put the first segment in the host (`airflow://flight/X`
  /// → host `flight`), while https URIs put it in the path — both shapes are
  /// normalised to the same segment list before matching.
  @visibleForTesting
  static AppDestination? parse(Uri uri) {
    final segments = <String>[
      if (uri.scheme == scheme && (uri.host.isNotEmpty)) uri.host,
      ...uri.pathSegments.where((s) => s.isNotEmpty),
    ];
    if (segments.isEmpty) return null;

    final head = segments.first.toLowerCase();
    final tail = segments.length > 1 ? segments[1] : null;

    return switch (head) {
      'flight' || 'flights' when tail != null =>
        FlightDestination(tail.toUpperCase()),
      'flights' => const TabDestination('flights'),
      'booking' || 'bookings' when tail != null =>
        BookingDestination(tail.toUpperCase()),
      'booking' || 'bookings' => const TabDestination('bookings'),
      'search' => SearchDestination(uri.queryParameters['q'] ?? ''),
      'schedule' => const TabDestination('schedule'),
      'help' => const TabDestination('help'),
      'home' => const TabDestination('home'),
      _ => null,
    };
  }
}
