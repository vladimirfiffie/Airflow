import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/brutal.dart';
import '../data/mock_flights.dart';
import '../models/flight.dart';
import 'home_screen.dart' show FlightCard;

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  String _query = '';
  int _maxStops = 2; // 0 nonstop, 1 ≤1 stop, 2 any
  double _maxPrice = 250;
  String _sort = 'price'; // price | duration

  List<FlightOffer> get _results {
    final q = _query.trim().toUpperCase();
    var list = kFlightOffers.where((f) {
      final matchesQuery = q.isEmpty ||
          f.fromCode.contains(q) ||
          f.toCode.contains(q) ||
          f.flightNo.contains(q) ||
          f.airline.toUpperCase().contains(q);
      final matchesStops = f.stops <= _maxStops;
      final matchesPrice = f.priceUsd <= _maxPrice;
      return matchesQuery && matchesStops && matchesPrice;
    }).toList();
    if (_sort == 'price') {
      list.sort((a, b) => a.priceUsd.compareTo(b.priceUsd));
    } else {
      list.sort((a, b) => a.duration.compareTo(b.duration));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final results = _results;
    return AppScaffold(
      currentRoute: '/search',
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('Search'),
          const SizedBox(height: 12),
          const Display('Find your flight.', size: 36),
          const SizedBox(height: 20),
          OffsetShadowBox(
            offset: const Offset(4, 4),
            padding: const EdgeInsets.fromLTRB(14, 4, 4, 4),
            child: Row(
              children: [
                Icon(Icons.search, size: 20, color: c.muted),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    onChanged: (v) => setState(() => _query = v),
                    decoration: InputDecoration(
                      isDense: true,
                      border: InputBorder.none,
                      hintText: 'Route, city or flight no…',
                      hintStyle: TextStyle(color: c.muted),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          BrutalCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Eyebrow('Filters'),
                const SizedBox(height: 14),
                Text('Max price: \$${_maxPrice.round()}',
                    style: const TextStyle(fontWeight: FontWeight.w700)),
                Slider(
                  value: _maxPrice,
                  min: 100,
                  max: 250,
                  divisions: 15,
                  activeColor: c.accent,
                  label: '\$${_maxPrice.round()}',
                  onChanged: (v) => setState(() => _maxPrice = v),
                ),
                const SizedBox(height: 8),
                Text('Stops', style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: [
                    _Choice('Non-stop', _maxStops == 0,
                        () => setState(() => _maxStops = 0)),
                    _Choice('≤ 1 stop', _maxStops == 1,
                        () => setState(() => _maxStops = 1)),
                    _Choice('Any', _maxStops == 2,
                        () => setState(() => _maxStops = 2)),
                  ],
                ),
                const SizedBox(height: 16),
                Text('Sort by', style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: [
                    _Choice('Price', _sort == 'price',
                        () => setState(() => _sort = 'price')),
                    _Choice('Duration', _sort == 'duration',
                        () => setState(() => _sort = 'duration')),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('${results.length} result${results.length == 1 ? '' : 's'}',
                  style: const TextStyle(
                      fontSize: 16, fontWeight: FontWeight.w800)),
            ],
          ),
          const SizedBox(height: 14),
          if (results.isEmpty)
            BrutalCard(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  child: Text('No flights match your filters.',
                      style: TextStyle(color: c.muted)),
                ),
              ),
            )
          else
            for (final f in results)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: FlightCard(flight: f),
              ),
        ],
      ),
    );
  }
}

class _Choice extends StatelessWidget {
  const _Choice(this.label, this.selected, this.onTap);
  final String label;
  final bool selected;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
        decoration: BoxDecoration(
          color: selected ? c.accentSoft : c.surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: selected ? c.accent : c.border),
        ),
        child: Text(label,
            style: TextStyle(
                fontWeight: FontWeight.w700,
                color: selected ? c.accent : c.foreground)),
      ),
    );
  }
}
