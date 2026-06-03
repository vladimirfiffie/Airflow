import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../theme/app_theme.dart';
import '../../widgets/brutal.dart';
import '../../state/booking_controller.dart';
import '../../data/seat_map.dart';

/// Step 3 — demo card payment. No real charge is made.
class PaymentStep extends StatefulWidget {
  const PaymentStep({
    super.key,
    required this.controller,
    required this.onNext,
    required this.onBack,
  });
  final BookingController controller;
  final VoidCallback onNext;
  final VoidCallback onBack;

  @override
  State<PaymentStep> createState() => _PaymentStepState();
}

class _PaymentStepState extends State<PaymentStep> {
  final _formKey = GlobalKey<FormState>();
  final _number = TextEditingController();
  final _name = TextEditingController();
  final _expiry = TextEditingController();
  final _cvv = TextEditingController();
  final _postal = TextEditingController();
  bool _processing = false;

  @override
  void dispose() {
    for (final c in [_number, _name, _expiry, _cvv, _postal]) {
      c.dispose();
    }
    super.dispose();
  }

  String? _validateExpiry(String? v) {
    if (v == null || !RegExp(r'^\d{2}/\d{2}$').hasMatch(v)) {
      return 'MM/YY';
    }
    final mm = int.parse(v.substring(0, 2));
    final yy = int.parse(v.substring(3));
    if (mm < 1 || mm > 12) return 'Bad month';
    final now = DateTime.now();
    final cy = now.year % 100;
    if (yy < cy || (yy == cy && mm < now.month)) return 'Expired';
    return null;
  }

  Future<void> _pay() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _processing = true);
    final p = widget.controller.payment;
    p.cardNumber = _number.text;
    p.cardName = _name.text;
    p.expiry = _expiry.text;
    p.cvv = _cvv.text;
    p.postalCode = _postal.text;
    await Future.delayed(const Duration(milliseconds: 800));
    widget.controller.bookingRef = generateBookingRef();
    if (!mounted) return;
    widget.onNext();
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final fare = widget.controller.fare;
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('Step 3 of 4'),
          const SizedBox(height: 12),
          const Display('Payment.', size: 32),
          const SizedBox(height: 8),
          Text(
            'Demo mode — no real charge. Use 4242 4242 4242 4242 with any '
            'future expiry and any CVC.',
            style: TextStyle(color: c.muted),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: const [
              _Trust(icon: Icons.lock, label: '256-bit SSL'),
              _Trust(icon: Icons.shield, label: 'PCI-DSS'),
              _Trust(icon: Icons.credit_card, label: 'Demo Mode'),
            ],
          ),
          const SizedBox(height: 20),
          BrutalCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Eyebrow('Card details'),
                const SizedBox(height: 14),
                _field(
                  controller: _number,
                  label: 'Card number',
                  hint: '4242 4242 4242 4242',
                  mono: true,
                  keyboardType: TextInputType.number,
                  formatters: [_CardNumberFormatter()],
                  validator: (v) =>
                      (v ?? '').replaceAll(' ', '').length < 15
                          ? 'Card number too short'
                          : null,
                ),
                const SizedBox(height: 12),
                _field(
                  controller: _name,
                  label: 'Cardholder name',
                  hint: 'JANE DOE',
                  formatters: [
                    FilteringTextInputFormatter.allow(
                        RegExp(r"[a-zA-Z\s'-]")),
                    _UpperCaseFormatter(),
                  ],
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: _field(
                        controller: _expiry,
                        label: 'Expiry',
                        hint: 'MM/YY',
                        mono: true,
                        keyboardType: TextInputType.number,
                        formatters: [_ExpiryFormatter()],
                        validator: _validateExpiry,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _field(
                        controller: _cvv,
                        label: 'CVV',
                        hint: '123',
                        mono: true,
                        keyboardType: TextInputType.number,
                        formatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(4),
                        ],
                        validator: (v) =>
                            (v ?? '').length < 3 ? '3–4 digits' : null,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _field(
                        controller: _postal,
                        label: 'Postal',
                        hint: '10001',
                        mono: true,
                        validator: (v) =>
                            (v == null || v.trim().isEmpty) ? 'Req' : null,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GhostButton(
                  label: 'Back',
                  icon: Icons.arrow_back,
                  onPressed: _processing ? null : widget.onBack),
              PrimaryButton(
                label: 'Pay \$${fare.total} & confirm',
                icon: Icons.lock,
                loading: _processing,
                onPressed: _pay,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _field({
    required TextEditingController controller,
    required String label,
    required String hint,
    bool mono = false,
    TextInputType? keyboardType,
    List<TextInputFormatter>? formatters,
    String? Function(String?)? validator,
  }) {
    final c = AppColors.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: TextStyle(
                fontWeight: FontWeight.w700, fontSize: 13, color: c.muted)),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          inputFormatters: formatters,
          validator: validator,
          style: mono
              ? const TextStyle(fontFamily: kMono, letterSpacing: 1)
              : null,
          decoration: InputDecoration(
            isDense: true,
            hintText: hint,
            hintStyle: TextStyle(color: c.muted),
            filled: true,
            fillColor: c.background,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: c.borderStrong),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: c.accent, width: 1.5),
            ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            errorStyle: const TextStyle(fontSize: 11),
          ),
        ),
      ],
    );
  }
}

class _Trust extends StatelessWidget {
  const _Trust({required this.icon, required this.label});
  final IconData icon;
  final String label;
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: c.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: c.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: const Color(0xFF10B981)),
          const SizedBox(width: 6),
          Text(label,
              style: const TextStyle(
                  fontWeight: FontWeight.w700, fontSize: 12)),
        ],
      ),
    );
  }
}

class _CardNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    final digits =
        newValue.text.replaceAll(RegExp(r'\D'), '');
    final trimmed = digits.length > 16 ? digits.substring(0, 16) : digits;
    final buf = StringBuffer();
    for (var i = 0; i < trimmed.length; i++) {
      if (i != 0 && i % 4 == 0) buf.write(' ');
      buf.write(trimmed[i]);
    }
    final text = buf.toString();
    return TextEditingValue(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}

class _ExpiryFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    final digits =
        newValue.text.replaceAll(RegExp(r'\D'), '');
    final trimmed = digits.length > 4 ? digits.substring(0, 4) : digits;
    String text;
    if (trimmed.length < 3) {
      text = trimmed;
    } else {
      text = '${trimmed.substring(0, 2)}/${trimmed.substring(2)}';
    }
    return TextEditingValue(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}

class _UpperCaseFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    return TextEditingValue(
      text: newValue.text.toUpperCase(),
      selection: newValue.selection,
    );
  }
}
