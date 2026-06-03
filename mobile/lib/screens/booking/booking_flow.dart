import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../widgets/app_scaffold.dart';
import '../../models/flight.dart';
import '../../state/booking_controller.dart';
import 'trip_summary.dart';
import 'passengers_step.dart';
import 'seats_step.dart';
import 'payment_step.dart';
import 'confirmation_step.dart';

/// Self-contained 4-step booking wizard for a single flight.
class BookingFlow extends StatefulWidget {
  const BookingFlow({super.key, required this.flight});
  final FlightOffer flight;

  @override
  State<BookingFlow> createState() => _BookingFlowState();
}

class _BookingFlowState extends State<BookingFlow> {
  late final BookingController _ctrl = BookingController(widget.flight);
  int _step = 0;

  static const _labels = ['Passengers', 'Seats', 'Payment', 'Confirmation'];

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _to(int step) {
    setState(() => _step = step);
  }

  Future<bool> _onWillPop() async {
    if (_step > 0 && _step < 3) {
      _to(_step - 1);
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: _step == 0 || _step == 3,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _onWillPop();
      },
      child: AppScaffold(
        body: AnimatedBuilder(
          animation: _ctrl,
          builder: (context, _) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _Stepper(current: _step),
                const SizedBox(height: 20),
                _buildStep(),
                const SizedBox(height: 28),
                // Trip summary hidden on the confirmation step.
                if (_step < 3) TripSummary(controller: _ctrl),
                const SizedBox(height: 20),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildStep() {
    switch (_step) {
      case 0:
        return PassengersStep(controller: _ctrl, onNext: () => _to(1));
      case 1:
        return SeatsStep(
            controller: _ctrl, onNext: () => _to(2), onBack: () => _to(0));
      case 2:
        return PaymentStep(
            controller: _ctrl, onNext: () => _to(3), onBack: () => _to(1));
      default:
        return ConfirmationStep(controller: _ctrl);
    }
  }

  static const List<String> _stepLabels = _labels;
}

class _Stepper extends StatelessWidget {
  const _Stepper({required this.current});
  final int current;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (var i = 0; i < _BookingFlowState._stepLabels.length; i++) ...[
            _node(context, i),
            if (i < _BookingFlowState._stepLabels.length - 1)
              Container(
                width: 24,
                height: 1,
                margin: const EdgeInsets.symmetric(horizontal: 6),
                color: i < current ? c.muted : c.border,
              ),
          ],
        ],
      ),
    );
  }

  Widget _node(BuildContext context, int i) {
    final c = AppColors.of(context);
    final done = i < current;
    final isCurrent = i == current;
    final Color circleBg = isCurrent
        ? c.accent
        : done
            ? c.foreground
            : c.surface2;
    final Color circleFg =
        isCurrent || done ? (isCurrent ? Colors.white : c.background) : c.muted;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: isCurrent ? c.accentSoft : Colors.transparent,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: isCurrent ? c.accent : c.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 22,
            height: 22,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: circleBg, shape: BoxShape.circle),
            child: done
                ? Icon(Icons.check, size: 13, color: circleFg)
                : Text('${i + 1}',
                    style: TextStyle(
                        fontFamily: kMono,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: circleFg)),
          ),
          const SizedBox(width: 8),
          Text(
            _BookingFlowState._stepLabels[i],
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 13,
              color: isCurrent
                  ? c.accent
                  : done
                      ? c.foreground
                      : c.muted,
            ),
          ),
        ],
      ),
    );
  }
}
