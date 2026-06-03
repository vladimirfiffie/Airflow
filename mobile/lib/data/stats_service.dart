import 'dart:async';
import 'dart:math' as math;
import '../models/stats.dart';

class _Route {
  const _Route(this.code, this.route, this.time, this.gate);
  final String code;
  final String route;
  final String time;
  final String gate;
}

const _routes = [
  _Route('AF1001', 'JFK → LAX', '07:10', 'A12'),
  _Route('AF2204', 'JFK → SFO', '09:35', 'B4'),
  _Route('AF3320', 'ORD → SEA', '11:50', 'C9'),
  _Route('AF4892', 'MIA → BOS', '15:20', 'D2'),
  _Route('AF5108', 'DFW → PHX', '16:05', 'E7'),
  _Route('AF6711', 'ATL → DEN', '18:40', 'F3'),
  _Route('AF7224', 'BOS → DCA', '08:25', 'A4'),
  _Route('AF8830', 'SEA → DEN', '13:15', 'C2'),
  _Route('AF9145', 'LAX → JFK', '21:00', 'B11'),
];

// Deterministic pseudo-noise, matching the web app's jitter().
double _jitter(int seed, double range) {
  final x = math.sin(seed * 9301 + 49297) * 233280;
  return (x - x.floorToDouble()) * range;
}

BoardStatus _rotateStatus(int seed) {
  final r = _jitter(seed, 100).floor();
  if (r < 8) return BoardStatus.departed;
  if (r < 22) return BoardStatus.delayed;
  if (r < 38) return BoardStatus.boarding;
  return BoardStatus.onTime;
}

StatsSnapshot computeStats([DateTime? at]) {
  final now = at ?? DateTime.now();
  final tick = now.millisecondsSinceEpoch ~/ 5000;

  final hour = now.hour + now.minute / 60.0;
  final dayShape = 0.55 + 0.45 * math.sin(((hour - 6) / 24) * math.pi * 2);
  final flightsTracked = (900 + dayShape * 600 + _jitter(tick, 12)).round();

  final onTimeRate =
      (91 + _jitter(tick + 1, 6) - 3).round().clamp(78, 97);
  final avgDelayMin = (7 + _jitter(tick + 2, 6) - 3).round().clamp(0, 60);
  final activeGates = (28 + 14 + _jitter(tick + 3, 4)).round();
  final boardingNow = (4 + _jitter(tick + 4, 5)).round().clamp(0, 20);

  final board = <LiveBoardEntry>[];
  for (var i = 0; i < _routes.length; i++) {
    final r = _routes[i];
    final status = _rotateStatus(tick + i);
    final delay = status == BoardStatus.delayed
        ? math.max(5, (10 + _jitter(tick + i + 5, 30)).round())
        : null;
    board.add(LiveBoardEntry(
      code: r.code,
      route: r.route,
      time: r.time,
      gate: r.gate,
      status: status,
      delayMin: delay,
    ));
  }

  return StatsSnapshot(
    flightsTracked: flightsTracked,
    onTimeRate: onTimeRate,
    avgDelayMin: avgDelayMin,
    activeGates: activeGates,
    boardingNow: boardingNow,
    serverTime: now,
    liveBoard: board,
  );
}

/// Emits a fresh [StatsSnapshot] immediately and then every [interval].
Stream<StatsSnapshot> liveStats(
    {Duration interval = const Duration(seconds: 5)}) async* {
  yield computeStats();
  yield* Stream.periodic(interval, (_) => computeStats());
}
