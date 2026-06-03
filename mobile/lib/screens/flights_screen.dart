import 'package:flutter/material.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/brutal.dart';
import '../data/mock_flights.dart';
import 'home_screen.dart' show FlightCard;

class FlightsScreen extends StatelessWidget {
  const FlightsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      currentRoute: '/flights',
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('Inventory'),
          const SizedBox(height: 12),
          const Display('All flights.', size: 36),
          const SizedBox(height: 8),
          Text('${kFlightOffers.length} routes available today.'),
          const SizedBox(height: 24),
          for (final f in kFlightOffers)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: FlightCard(flight: f),
            ),
        ],
      ),
    );
  }
}
