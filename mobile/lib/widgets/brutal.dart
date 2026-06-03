import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Small uppercase orange kicker — the web app's `.eyebrow`.
class Eyebrow extends StatelessWidget {
  const Eyebrow(this.text, {super.key, this.color});
  final String text;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Text(
      text.toUpperCase(),
      style: TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.8,
        color: color ?? c.accent,
      ),
    );
  }
}

/// Big black editorial heading — the web app's `.display`.
class Display extends StatelessWidget {
  const Display(this.text, {super.key, this.size = 40, this.color});
  final String text;
  final double size;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Text(
      text,
      style: TextStyle(
        fontSize: size,
        fontWeight: FontWeight.w900,
        letterSpacing: size * -0.04,
        height: 0.95,
        color: color ?? c.foreground,
      ),
    );
  }
}

/// Monospace text used for flight codes, prices and numeric data.
class Mono extends StatelessWidget {
  const Mono(
    this.text, {
    super.key,
    this.size = 13,
    this.color,
    this.weight = FontWeight.w600,
    this.letterSpacing,
  });
  final String text;
  final double size;
  final Color? color;
  final FontWeight weight;
  final double? letterSpacing;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Text(
      text,
      style: TextStyle(
        fontFamily: kMono,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: letterSpacing,
        color: color ?? c.foreground,
      ),
    );
  }
}

/// A bordered card matching the rounded-2xl bordered panels used throughout.
class BrutalCard extends StatelessWidget {
  const BrutalCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.color,
    this.borderColor,
    this.radius = 16,
    this.onTap,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? color;
  final Color? borderColor;
  final double radius;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final card = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color ?? c.surface,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: borderColor ?? c.border),
      ),
      child: child,
    );
    if (onTap == null) return card;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(radius),
      child: card,
    );
  }
}

/// A container with the signature hard offset shadow
/// (web: `shadow-[6px_6px_0_0_#f97316]`).
class OffsetShadowBox extends StatelessWidget {
  const OffsetShadowBox({
    super.key,
    required this.child,
    this.offset = const Offset(6, 6),
    this.radius = 12,
    this.borderColor,
    this.shadowColor,
    this.background,
    this.padding = EdgeInsets.zero,
  });

  final Widget child;
  final Offset offset;
  final double radius;
  final Color? borderColor;
  final Color? shadowColor;
  final Color? background;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final shadow = shadowColor ?? c.accent;
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        boxShadow: [
          BoxShadow(color: shadow, offset: offset, blurRadius: 0),
        ],
      ),
      child: Container(
        padding: padding,
        decoration: BoxDecoration(
          color: background ?? c.background,
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(color: borderColor ?? c.foreground, width: 2),
        ),
        child: child,
      ),
    );
  }
}

/// The primary orange action button.
class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.loading = false,
    this.expand = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool loading;
  final bool expand;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final child = Row(
      mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (loading)
          const SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation(Colors.white),
            ),
          )
        else if (icon != null)
          Icon(icon, size: 18, color: Colors.white),
        if (loading || icon != null) const SizedBox(width: 8),
        Text(
          loading ? 'Processing…' : label,
          style: const TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 14,
            color: Colors.white,
          ),
        ),
      ],
    );
    return Material(
      color: c.accent,
      borderRadius: BorderRadius.circular(8),
      child: InkWell(
        onTap: loading ? null : onPressed,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
          child: child,
        ),
      ),
    );
  }
}

/// Outlined secondary button.
class GhostButton extends StatelessWidget {
  const GhostButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: c.foreground,
        side: BorderSide(color: c.borderStrong),
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 18),
            const SizedBox(width: 8),
          ],
          Text(label,
              style: const TextStyle(
                  fontWeight: FontWeight.w800, fontSize: 14)),
        ],
      ),
    );
  }
}

/// A subtle dotted grid background used on hero / dark sections.
class GridLinesPainter extends CustomPainter {
  GridLinesPainter(this.color, {this.gap = 32});
  final Color color;
  final double gap;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1;
    for (double x = 0; x <= size.width; x += gap) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y <= size.height; y += gap) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant GridLinesPainter old) => old.color != color;
}
