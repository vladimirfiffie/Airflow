import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/brutal.dart';

class _Event {
  const _Event(this.code, this.route, this.day, this.depart, this.arrive,
      this.gate, this.aircraft, this.status);
  final String code, route, day, depart, arrive, gate, aircraft, status;
}

const _events = [
  _Event('AF1001', 'JFK → LAX', 'Tue 03', '07:10', '10:40', 'A12', 'A321neo', 'Boarding'),
  _Event('AF2204', 'JFK → SFO', 'Wed 04', '09:35', '13:10', 'B4', 'B737-8', 'On Time'),
  _Event('AF3320', 'ORD → SEA', 'Thu 05', '11:50', '14:35', 'C9', 'A220-300', 'Delayed'),
  _Event('AF4892', 'MIA → BOS', 'Fri 06', '15:20', '18:25', 'D2', 'B737-9', 'On Time'),
  _Event('AF5108', 'DFW → PHX', 'Sat 07', '16:05', '17:35', 'E7', 'A319', 'On Time'),
  _Event('AF6711', 'ATL → DEN', 'Sun 08', '18:40', '20:05', 'F3', 'A320neo', 'Boarding'),
];

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});

  Color _statusColor(BuildContext context, String s) {
    switch (s) {
      case 'On Time':
        return const Color(0xFF10B981);
      case 'Boarding':
        return AppColors.of(context).accent;
      default:
        return const Color(0xFFEF4444);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return AppScaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('This week'),
          const SizedBox(height: 12),
          const Display('Flight schedule.', size: 36),
          const SizedBox(height: 24),
          for (final e in _events)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: BrutalCard(
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Mono(e.day.toUpperCase(),
                            size: 11, color: c.muted, weight: FontWeight.w700),
                        const SizedBox(height: 6),
                        Mono(e.depart, size: 22, weight: FontWeight.w900),
                        Mono(e.arrive, size: 13, color: c.muted),
                      ],
                    ),
                    const SizedBox(width: 18),
                    Container(width: 1, height: 56, color: c.border),
                    const SizedBox(width: 18),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Mono('${e.code} · ${e.route}',
                              size: 14, weight: FontWeight.w700),
                          const SizedBox(height: 6),
                          Mono('GATE ${e.gate} · ${e.aircraft}',
                              size: 11, color: c.muted),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _statusColor(context, e.status)
                                  .withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Mono(e.status.toUpperCase(),
                                size: 10,
                                color: _statusColor(context, e.status),
                                weight: FontWeight.w800),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
