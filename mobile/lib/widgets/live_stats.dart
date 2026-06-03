import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/stats_service.dart';
import '../models/stats.dart';
import 'brutal.dart';

/// Live operations panel — stat tiles + a departures board that refresh every 5s.
class LiveStatsSection extends StatelessWidget {
  const LiveStatsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      decoration:
          BoxDecoration(border: Border(bottom: BorderSide(color: c.border))),
      child: StreamBuilder<StatsSnapshot>(
        stream: liveStats(),
        initialData: computeStats(),
        builder: (context, snap) {
          final s = snap.data!;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Eyebrow('Live operations'),
                    const SizedBox(width: 10),
                    _Pulse(color: c.accent),
                  ],
                ),
                const SizedBox(height: 18),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 10,
                  crossAxisSpacing: 10,
                  childAspectRatio: 1.7,
                  children: [
                    _StatTile(
                        value: '${s.flightsTracked}',
                        label: 'Flights tracked'),
                    _StatTile(
                        value: '${s.onTimeRate}%', label: 'On-time rate'),
                    _StatTile(
                        value: '${s.avgDelayMin}m', label: 'Avg delay'),
                    _StatTile(
                        value: '${s.activeGates}', label: 'Active gates'),
                  ],
                ),
                const SizedBox(height: 20),
                _DepartureBoard(entries: s.liveBoard),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.value, required this.label});
  final String value;
  final String label;
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return BrutalCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Mono(value, size: 30, weight: FontWeight.w900, color: c.foreground),
          const SizedBox(height: 4),
          Text(label,
              style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: c.muted)),
        ],
      ),
    );
  }
}

class _DepartureBoard extends StatelessWidget {
  const _DepartureBoard({required this.entries});
  final List<LiveBoardEntry> entries;
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: c.borderStrong.withValues(alpha: 0.4)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Mono('DEPARTURES',
                  size: 12, color: Colors.white, weight: FontWeight.w800),
              _Pulse(color: c.accent),
            ],
          ),
          const SizedBox(height: 12),
          for (final e in entries.take(6)) _BoardRow(entry: e),
        ],
      ),
    );
  }
}

class _BoardRow extends StatelessWidget {
  const _BoardRow({required this.entry});
  final LiveBoardEntry entry;

  Color _statusColor() => switch (entry.status) {
        BoardStatus.onTime => const Color(0xFF34D399),
        BoardStatus.boarding => const Color(0xFFFB923C),
        BoardStatus.delayed => const Color(0xFFF87171),
        BoardStatus.departed => const Color(0xFF9CA3AF),
      };

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          SizedBox(
            width: 64,
            child: Mono(entry.code,
                size: 13, color: Colors.white, weight: FontWeight.w700),
          ),
          Expanded(
            child: Mono(entry.route, size: 12, color: Colors.white70),
          ),
          Mono('G${entry.gate}', size: 11, color: Colors.white38),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
            decoration: BoxDecoration(
              color: _statusColor().withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Mono(
              entry.delayMin != null
                  ? '+${entry.delayMin}m'
                  : entry.status.label,
              size: 10,
              color: _statusColor(),
              weight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }
}

class _Pulse extends StatefulWidget {
  const _Pulse({required this.color});
  final Color color;
  @override
  State<_Pulse> createState() => _PulseState();
}

class _PulseState extends State<_Pulse>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1100),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: Tween(begin: 0.3, end: 1.0).animate(_ctrl),
      child: Container(
        width: 8,
        height: 8,
        decoration:
            BoxDecoration(color: widget.color, shape: BoxShape.circle),
      ),
    );
  }
}
