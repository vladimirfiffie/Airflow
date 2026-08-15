import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import '../widgets/brutal.dart';
import 'haptics.dart';

/// Whether this build should use iOS-flavoured interactions.
///
/// Read from the ambient [Theme] rather than `Platform.isIOS` so that
/// `debugDefaultTargetPlatformOverride` and widget tests can flip it.
bool isCupertino(BuildContext context) {
  final platform = Theme.of(context).platform;
  return platform == TargetPlatform.iOS || platform == TargetPlatform.macOS;
}

/// Platform-correct *behaviour* for a design system that stays constant.
///
/// The brutalist look (orange accent, hard borders, offset shadows) is the
/// same on every platform; what changes here is how things move, where sheets
/// come from, and which gestures work — the parts users feel as "native".
class Adaptive {
  const Adaptive._();

  // ---------------------------------------------------------------------
  // Motion & gesture
  // ---------------------------------------------------------------------

  /// Scroll feel: rubber-band overscroll on iOS, glow/stretch on Android.
  static ScrollPhysics scrollPhysics(BuildContext context) =>
      isCupertino(context)
          ? const BouncingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics(),
            )
          : const ClampingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics(),
            );

  /// A page transition that matches the platform, which also decides the back
  /// gesture: edge swipe-back on iOS, predictive back on Android.
  static Route<T> pageRoute<T>(
    BuildContext context, {
    required WidgetBuilder builder,
    String? title,
  }) {
    if (isCupertino(context)) {
      return CupertinoPageRoute<T>(builder: builder, title: title);
    }
    return MaterialPageRoute<T>(builder: builder);
  }

  /// Push a screen using the platform's own transition.
  static Future<T?> push<T>(
    BuildContext context, {
    required WidgetBuilder builder,
    String? title,
  }) {
    return Navigator.of(context).push<T>(
      pageRoute<T>(context, builder: builder, title: title),
    );
  }

  // ---------------------------------------------------------------------
  // Components with a stock adaptive constructor
  // ---------------------------------------------------------------------

  static Widget progressIndicator({double? size, Color? color}) {
    final indicator = CircularProgressIndicator.adaptive(
      strokeWidth: 2.4,
      valueColor: color == null ? null : AlwaysStoppedAnimation<Color>(color),
    );
    if (size == null) return indicator;
    return SizedBox(width: size, height: size, child: indicator);
  }

  static Widget toggle({
    required bool value,
    required ValueChanged<bool>? onChanged,
    Color? activeColor,
  }) {
    return Switch.adaptive(
      value: value,
      activeThumbColor: activeColor,
      onChanged: onChanged == null
          ? null
          : (v) {
              AppHaptics.selection();
              onChanged(v);
            },
    );
  }

  /// Pull-to-refresh. `.adaptive` swaps in the Cupertino spinner on iOS while
  /// keeping the Material trigger behaviour that works inside a scroll view.
  static Widget refreshable({
    required Future<void> Function() onRefresh,
    required Widget child,
    Color? color,
  }) {
    return RefreshIndicator.adaptive(
      onRefresh: () async {
        await AppHaptics.light();
        await onRefresh();
      },
      color: color,
      child: child,
    );
  }

  // ---------------------------------------------------------------------
  // Dialogs, sheets and pickers
  // ---------------------------------------------------------------------

  /// A yes/no confirmation. Returns false when dismissed.
  static Future<bool> confirm(
    BuildContext context, {
    required String title,
    required String message,
    String confirmLabel = 'Confirm',
    String cancelLabel = 'Cancel',
    bool destructive = false,
  }) async {
    final c = AppColors.of(context);

    if (isCupertino(context)) {
      final result = await showCupertinoDialog<bool>(
        context: context,
        builder: (ctx) => CupertinoAlertDialog(
          title: Text(title),
          content: Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(message),
          ),
          actions: [
            CupertinoDialogAction(
              onPressed: () => Navigator.of(ctx).pop(false),
              child: Text(cancelLabel),
            ),
            CupertinoDialogAction(
              isDestructiveAction: destructive,
              isDefaultAction: !destructive,
              onPressed: () => Navigator.of(ctx).pop(true),
              child: Text(confirmLabel),
            ),
          ],
        ),
      );
      return result ?? false;
    }

    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: c.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: c.border),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w900),
        ),
        content: Text(message, style: TextStyle(color: c.muted)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text(
              cancelLabel,
              style: TextStyle(color: c.muted, fontWeight: FontWeight.w700),
            ),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text(
              confirmLabel,
              style: TextStyle(
                color: destructive ? const Color(0xFFEF4444) : c.accent,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      ),
    );
    return result ?? false;
  }

  /// A list of choices: action sheet on iOS, bottom sheet on Android.
  static Future<T?> chooseFrom<T>(
    BuildContext context, {
    required String title,
    String? message,
    required List<AdaptiveChoice<T>> choices,
    String cancelLabel = 'Cancel',
  }) async {
    final c = AppColors.of(context);
    // Fire-and-forget: awaiting it would put an async gap in front of every
    // context use below for no benefit.
    AppHaptics.light();

    if (isCupertino(context)) {
      return showCupertinoModalPopup<T>(
        context: context,
        builder: (ctx) => CupertinoActionSheet(
          title: Text(title),
          message: message == null ? null : Text(message),
          actions: [
            for (final choice in choices)
              CupertinoActionSheetAction(
                isDestructiveAction: choice.destructive,
                onPressed: () => Navigator.of(ctx).pop(choice.value),
                child: Text(choice.label),
              ),
          ],
          cancelButton: CupertinoActionSheetAction(
            isDefaultAction: true,
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(cancelLabel),
          ),
        ),
      );
    }

    return showModalBottomSheet<T>(
      context: context,
      backgroundColor: c.background,
      showDragHandle: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Eyebrow(title),
                  if (message != null) ...[
                    const SizedBox(height: 6),
                    Text(message, style: TextStyle(color: c.muted)),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 8),
            for (final choice in choices)
              ListTile(
                leading: choice.icon == null
                    ? null
                    : Icon(
                        choice.icon,
                        color: choice.destructive
                            ? const Color(0xFFEF4444)
                            : c.accent,
                      ),
                title: Text(
                  choice.label,
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: choice.destructive
                        ? const Color(0xFFEF4444)
                        : c.foreground,
                  ),
                ),
                onTap: () => Navigator.of(ctx).pop(choice.value),
              ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  /// Date entry: calendar dialog on Android, wheel in a popup on iOS.
  static Future<DateTime?> pickDate(
    BuildContext context, {
    required DateTime initialDate,
    required DateTime firstDate,
    required DateTime lastDate,
    String helpText = 'Select date',
  }) async {
    if (!isCupertino(context)) {
      return showDatePicker(
        context: context,
        initialDate: initialDate,
        firstDate: firstDate,
        lastDate: lastDate,
        helpText: helpText,
      );
    }

    final c = AppColors.of(context);
    var selected = initialDate;
    final confirmed = await showCupertinoModalPopup<bool>(
      context: context,
      builder: (ctx) => Container(
        height: 320,
        color: c.background,
        child: SafeArea(
          top: false,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  CupertinoButton(
                    onPressed: () => Navigator.of(ctx).pop(false),
                    child: const Text('Cancel'),
                  ),
                  Text(
                    helpText,
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      color: c.foreground,
                    ),
                  ),
                  CupertinoButton(
                    onPressed: () => Navigator.of(ctx).pop(true),
                    child: Text(
                      'Done',
                      style: TextStyle(
                        color: c.accent,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
              ),
              Expanded(
                child: CupertinoDatePicker(
                  mode: CupertinoDatePickerMode.date,
                  initialDateTime: initialDate,
                  minimumDate: firstDate,
                  maximumDate: lastDate,
                  onDateTimeChanged: (value) => selected = value,
                ),
              ),
            ],
          ),
        ),
      ),
    );
    return confirmed == true ? selected : null;
  }

  // ---------------------------------------------------------------------
  // Transient messages
  // ---------------------------------------------------------------------

  /// A brief message. Snack bar on Android; a top banner on iOS, which has no
  /// snack bar convention of its own.
  static void notify(
    BuildContext context,
    String message, {
    bool isError = false,
  }) {
    if (isError) {
      AppHaptics.warning();
    } else {
      AppHaptics.light();
    }

    if (isCupertino(context)) {
      _showBanner(context, message, isError: isError);
      return;
    }

    final c = AppColors.of(context);
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(
            message,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          backgroundColor: isError ? const Color(0xFFEF4444) : c.foreground,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          duration: const Duration(seconds: 3),
        ),
      );
  }

  static void _showBanner(
    BuildContext context,
    String message, {
    required bool isError,
  }) {
    final overlay = Overlay.maybeOf(context);
    if (overlay == null) return;
    final c = AppColors.of(context);

    late OverlayEntry entry;
    entry = OverlayEntry(
      builder: (ctx) => Positioned(
        top: MediaQuery.of(ctx).padding.top + 8,
        left: 16,
        right: 16,
        child: _SlideInBanner(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isError ? const Color(0xFFEF4444) : c.foreground,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: isError ? Colors.white : c.background,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ),
      ),
    );

    overlay.insert(entry);
    Future<void>.delayed(const Duration(seconds: 3), entry.remove);
  }
}

/// One option in [Adaptive.chooseFrom].
class AdaptiveChoice<T> {
  const AdaptiveChoice({
    required this.label,
    required this.value,
    this.icon,
    this.destructive = false,
  });

  final String label;
  final T value;
  final IconData? icon;
  final bool destructive;
}

class _SlideInBanner extends StatefulWidget {
  const _SlideInBanner({required this.child});
  final Widget child;

  @override
  State<_SlideInBanner> createState() => _SlideInBannerState();
}

class _SlideInBannerState extends State<_SlideInBanner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 260),
  )..forward();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final curve = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    );
    return FadeTransition(
      opacity: curve,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, -0.5),
          end: Offset.zero,
        ).animate(curve),
        child: Material(color: Colors.transparent, child: widget.child),
      ),
    );
  }
}
