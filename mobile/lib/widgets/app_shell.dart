import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../data/mock_flights.dart';
import '../models/flight.dart';
import '../platform/adaptive.dart';
import '../platform/haptics.dart';
import '../screens/bookings_screen.dart';
import '../screens/flight_details_screen.dart';
import '../screens/flights_screen.dart';
import '../screens/help_screen.dart';
import '../screens/home_screen.dart';
import '../screens/schedule_screen.dart';
import '../screens/search_screen.dart';
import '../services/deep_links.dart';
import '../services/notifications_service.dart';
import '../theme/app_theme.dart';

/// The tabs, in order. Index is used as identity throughout the shell.
enum AppTab {
  home('Home', Icons.home_outlined, Icons.home, CupertinoIcons.house_fill),
  search('Search', Icons.search, Icons.search, CupertinoIcons.search),
  flights('Flights', Icons.flight_outlined, Icons.flight,
      CupertinoIcons.airplane),
  schedule('Schedule', Icons.calendar_today_outlined, Icons.calendar_today,
      CupertinoIcons.calendar),
  bookings('Bookings', Icons.confirmation_number_outlined,
      Icons.confirmation_number, CupertinoIcons.ticket_fill);

  const AppTab(this.label, this.icon, this.selectedIcon, this.cupertinoIcon);

  final String label;
  final IconData icon;
  final IconData selectedIcon;
  final IconData cupertinoIcon;
}

/// Gives descendants a handle on the shell: switch tabs, open a flight, or
/// jump to a booking, without any of them knowing how navigation is wired.
class AppShellScope extends InheritedWidget {
  const AppShellScope({
    super.key,
    required this.state,
    required super.child,
  });

  final AppShellState state;

  static AppShellState of(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<AppShellScope>();
    assert(scope != null, 'No AppShell above this widget');
    return scope!.state;
  }

  /// Non-asserting lookup, for widgets that also render outside the shell.
  static AppShellState? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<AppShellScope>()?.state;

  @override
  bool updateShouldNotify(AppShellScope oldWidget) => state != oldWidget.state;
}

/// Root scaffold: persistent tabs, each with its own navigation stack.
///
/// Per-tab stacks are what makes the tab bar feel native rather than like five
/// buttons that reset the app — drill into a flight from Search, switch to
/// Bookings and back, and Search is still where it was left.
class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => AppShellState();
}

class AppShellState extends State<AppShell> {
  final Map<AppTab, GlobalKey<NavigatorState>> _navigatorKeys = {
    for (final tab in AppTab.values) tab: GlobalKey<NavigatorState>(),
  };

  AppTab _current = AppTab.home;

  /// Seeds the Search tab when a deep link carries a query.
  String? pendingSearchQuery;

  /// Seeds the Bookings tab when a deep link or notification names a booking.
  String? pendingBookingRef;

  AppTab get currentTab => _current;

  @override
  void initState() {
    super.initState();
    // Pre-warm the haptics engine so the first tap isn't the slow one.
    AppHaptics.prepare();

    // A tapped boarding reminder should land on the booking it's about.
    final notifications = NotificationsService.instance;
    notifications.onTapPayload =
        (ref) => handleDestination(BookingDestination(ref));

    WidgetsBinding.instance.addPostFrameCallback((_) {
      DeepLinks.instance.start(handleDestination);
      final launchRef = notifications.launchPayload;
      if (launchRef != null && launchRef.isNotEmpty) {
        notifications.launchPayload = null;
        handleDestination(BookingDestination(launchRef));
      }
    });
  }

  @override
  void dispose() {
    DeepLinks.instance.dispose();
    super.dispose();
  }

  /// Switches tabs. Tapping the tab you're already on pops that tab to its
  /// root, which is the platform convention on both Android and iOS.
  void goToTab(AppTab tab) {
    if (tab == _current) {
      _navigatorKeys[tab]?.currentState?.popUntil((r) => r.isFirst);
      return;
    }
    AppHaptics.selection();
    setState(() => _current = tab);
  }

  /// Opens a flight's detail screen inside the current tab.
  void openFlight(FlightOffer flight) {
    final navigator = _navigatorKeys[_current]?.currentState;
    if (navigator == null) return;
    navigator.push(
      Adaptive.pageRoute(
        context,
        builder: (_) => FlightDetailsScreen(flightId: flight.id),
        title: flight.flightNo,
      ),
    );
  }

  /// Routes an incoming deep link or notification tap.
  void handleDestination(AppDestination destination) {
    if (!mounted) return;
    switch (destination) {
      case FlightDestination(:final flightId):
        FlightOffer? match;
        for (final offer in kFlightOffers) {
          if (offer.id == flightId) {
            match = offer;
            break;
          }
        }
        // Bound to a final local so the null check promotes inside the
        // post-frame closure below.
        final flight = match;
        if (flight == null) {
          // Unknown id — land on the list rather than a dead end.
          goToTab(AppTab.flights);
          return;
        }
        goToTab(AppTab.flights);
        // Let the tab swap settle before pushing onto its navigator.
        WidgetsBinding.instance.addPostFrameCallback((_) => openFlight(flight));
      case BookingDestination(:final ref):
        setState(() {
          pendingBookingRef = ref;
          _current = AppTab.bookings;
        });
      case SearchDestination(:final query):
        setState(() {
          pendingSearchQuery = query;
          _current = AppTab.search;
        });
      case TabDestination(:final name):
        final tab = switch (name) {
          'flights' => AppTab.flights,
          'schedule' => AppTab.schedule,
          'bookings' => AppTab.bookings,
          'search' => AppTab.search,
          _ => AppTab.home,
        };
        if (name == 'help') {
          openHelp();
          return;
        }
        goToTab(tab);
    }
  }

  /// Help isn't a tab — it opens over whichever one is showing.
  void openHelp() {
    final navigator = _navigatorKeys[_current]?.currentState;
    navigator?.push(
      Adaptive.pageRoute(
        context,
        builder: (_) => const HelpScreen(),
        title: 'Help',
      ),
    );
  }

  Widget _rootFor(AppTab tab) => switch (tab) {
        AppTab.home => const HomeScreen(),
        AppTab.search => const SearchScreen(),
        AppTab.flights => const FlightsScreen(),
        AppTab.schedule => const ScheduleScreen(),
        AppTab.bookings => const BookingsScreen(),
      };

  /// Back should unwind the current tab's stack, then fall back to Home,
  /// and only then leave the app.
  Future<bool> _handleBack() async {
    final navigator = _navigatorKeys[_current]?.currentState;
    if (navigator != null && navigator.canPop()) {
      navigator.pop();
      return false;
    }
    if (_current != AppTab.home) {
      setState(() => _current = AppTab.home);
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final width = MediaQuery.sizeOf(context).width;
    // Wide enough for a rail without squeezing content — tablets, foldables
    // unfolded, and phones in landscape.
    final useRail = width >= 720;

    final stack = IndexedStack(
      index: _current.index,
      children: [
        for (final tab in AppTab.values)
          Navigator(
            key: _navigatorKeys[tab],
            onGenerateRoute: (settings) => Adaptive.pageRoute(
              context,
              builder: (_) => _rootFor(tab),
              title: tab.label,
            ),
          ),
      ],
    );

    return AppShellScope(
      state: this,
      child: PopScope(
        canPop: false,
        onPopInvokedWithResult: (didPop, _) async {
          if (didPop) return;
          final shouldExit = await _handleBack();
          if (shouldExit && context.mounted) {
            Navigator.of(context).maybePop();
          }
        },
        child: Scaffold(
          backgroundColor: c.background,
          body: useRail
              ? Row(
                  children: [
                    _Rail(
                      current: _current,
                      onSelect: goToTab,
                      onHelp: openHelp,
                    ),
                    Expanded(child: stack),
                  ],
                )
              : stack,
          bottomNavigationBar: useRail
              ? null
              : _BottomBar(current: _current, onSelect: goToTab),
        ),
      ),
    );
  }
}

/// Bottom navigation: Material 3 on Android, Cupertino tab bar on iOS.
class _BottomBar extends StatelessWidget {
  const _BottomBar({required this.current, required this.onSelect});

  final AppTab current;
  final ValueChanged<AppTab> onSelect;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);

    if (isCupertino(context)) {
      return DecoratedBox(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: c.border)),
        ),
        child: CupertinoTabBar(
          currentIndex: current.index,
          onTap: (i) => onSelect(AppTab.values[i]),
          backgroundColor: c.background,
          activeColor: c.accent,
          inactiveColor: c.muted,
          border: null,
          items: [
            for (final tab in AppTab.values)
              BottomNavigationBarItem(
                icon: Icon(tab.cupertinoIcon),
                label: tab.label,
              ),
          ],
        ),
      );
    }

    return NavigationBar(
      selectedIndex: current.index,
      onDestinationSelected: (i) => onSelect(AppTab.values[i]),
      backgroundColor: c.background,
      surfaceTintColor: Colors.transparent,
      indicatorColor: c.accentSoft,
      height: 68,
      labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
      destinations: [
        for (final tab in AppTab.values)
          NavigationDestination(
            icon: Icon(tab.icon, color: c.muted),
            selectedIcon: Icon(tab.selectedIcon, color: c.accent),
            label: tab.label,
          ),
      ],
    );
  }
}

/// Side rail for wide layouts.
class _Rail extends StatelessWidget {
  const _Rail({
    required this.current,
    required this.onSelect,
    required this.onHelp,
  });

  final AppTab current;
  final ValueChanged<AppTab> onSelect;
  final VoidCallback onHelp;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(right: BorderSide(color: c.border)),
      ),
      child: NavigationRail(
        selectedIndex: current.index,
        onDestinationSelected: (i) => onSelect(AppTab.values[i]),
        backgroundColor: c.background,
        indicatorColor: c.accentSoft,
        labelType: NavigationRailLabelType.all,
        leading: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Icon(Icons.flight_takeoff_rounded, color: c.accent, size: 26),
        ),
        trailing: Expanded(
          child: Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: IconButton(
                tooltip: 'Help',
                onPressed: onHelp,
                icon: Icon(Icons.help_outline, color: c.muted),
              ),
            ),
          ),
        ),
        destinations: [
          for (final tab in AppTab.values)
            NavigationRailDestination(
              icon: Icon(tab.icon, color: c.muted),
              selectedIcon: Icon(tab.selectedIcon, color: c.accent),
              label: Text(tab.label),
            ),
        ],
      ),
    );
  }
}
