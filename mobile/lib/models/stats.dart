enum BoardStatus { onTime, boarding, delayed, departed }

extension BoardStatusLabel on BoardStatus {
  String get label => switch (this) {
        BoardStatus.onTime => 'ON TIME',
        BoardStatus.boarding => 'BOARDING',
        BoardStatus.delayed => 'DELAYED',
        BoardStatus.departed => 'DEPARTED',
      };
}

class LiveBoardEntry {
  const LiveBoardEntry({
    required this.code,
    required this.route,
    required this.time,
    required this.gate,
    required this.status,
    this.delayMin,
  });

  final String code;
  final String route;
  final String time;
  final String gate;
  final BoardStatus status;
  final int? delayMin;
}

/// Live operations snapshot. Mirrors `StatsResponse` from /api/stats.
class StatsSnapshot {
  const StatsSnapshot({
    required this.flightsTracked,
    required this.onTimeRate,
    required this.avgDelayMin,
    required this.activeGates,
    required this.boardingNow,
    required this.serverTime,
    required this.liveBoard,
  });

  final int flightsTracked;
  final int onTimeRate;
  final int avgDelayMin;
  final int activeGates;
  final int boardingNow;
  final DateTime serverTime;
  final List<LiveBoardEntry> liveBoard;
}
