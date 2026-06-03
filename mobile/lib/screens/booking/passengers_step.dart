import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../theme/app_theme.dart';
import '../../widgets/brutal.dart';
import '../../state/booking_controller.dart';

/// Step 1 — passenger details + contact info.
class PassengersStep extends StatefulWidget {
  const PassengersStep(
      {super.key, required this.controller, required this.onNext});
  final BookingController controller;
  final VoidCallback onNext;

  @override
  State<PassengersStep> createState() => _PassengersStepState();
}

class _PassengersStepState extends State<PassengersStep> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _email =
      TextEditingController(text: widget.controller.contact.email);
  late final TextEditingController _phone =
      TextEditingController(text: widget.controller.contact.phone);

  @override
  void dispose() {
    _email.dispose();
    _phone.dispose();
    super.dispose();
  }

  Future<void> _pickDob(int i) async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(now.year - 30),
      firstDate: DateTime(1920),
      lastDate: now,
    );
    if (picked != null) {
      setState(() {
        widget.controller.passengers[i].dob =
            '${picked.year.toString().padLeft(4, '0')}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
      });
    }
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    final missingDob = widget.controller.passengers.any((p) => p.dob.isEmpty);
    if (missingDob) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Date of birth required for every passenger.')));
      return;
    }
    widget.controller.contact.email = _email.text.trim();
    widget.controller.contact.phone = _phone.text.trim();
    widget.onNext();
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final ctrl = widget.controller;
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('Step 1 of 4'),
          const SizedBox(height: 12),
          const Display("Who's flying?", size: 32),
          const SizedBox(height: 8),
          Text(
            'Names must match government-issued ID. Up to 6 passengers.',
            style: TextStyle(color: c.muted),
          ),
          const SizedBox(height: 20),
          for (var i = 0; i < ctrl.passengers.length; i++)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _PassengerCard(
                index: i,
                controller: ctrl,
                onPickDob: () => _pickDob(i),
                onRemove: ctrl.passengers.length > 1
                    ? () => setState(() => ctrl.removePassenger(i))
                    : null,
              ),
            ),
          if (ctrl.passengers.length < 6)
            InkWell(
              onTap: () => setState(ctrl.addPassenger),
              borderRadius: BorderRadius.circular(8),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                      color: c.borderStrong,
                      width: 2,
                      style: BorderStyle.solid),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.add, size: 18, color: c.foreground),
                    const SizedBox(width: 8),
                    const Text('Add passenger',
                        style: TextStyle(fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
            ),
          const SizedBox(height: 20),
          BrutalCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Eyebrow('Contact'),
                const SizedBox(height: 6),
                const Text('Where should we send updates?',
                    style:
                        TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                const SizedBox(height: 14),
                _field(
                  controller: _email,
                  label: 'Email',
                  hint: 'you@example.com',
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Email required';
                    if (!v.contains('@')) return 'Enter a valid email';
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                _field(
                  controller: _phone,
                  label: 'Phone',
                  hint: '(555) 000-0000',
                  keyboardType: TextInputType.phone,
                  validator: (v) {
                    final digits =
                        (v ?? '').replaceAll(RegExp(r'\D'), '');
                    if (digits.length < 10) return 'At least 10 digits';
                    return null;
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Align(
            alignment: Alignment.centerRight,
            child: PrimaryButton(
              label: 'Continue to seats',
              icon: Icons.arrow_forward,
              onPressed: _submit,
            ),
          ),
        ],
      ),
    );
  }

  Widget _field({
    required TextEditingController controller,
    required String label,
    required String hint,
    TextInputType? keyboardType,
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
          validator: validator,
          decoration: _inputDecoration(context, hint),
        ),
      ],
    );
  }
}

InputDecoration _inputDecoration(BuildContext context, String hint) {
  final c = AppColors.of(context);
  return InputDecoration(
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
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
  );
}

class _PassengerCard extends StatelessWidget {
  const _PassengerCard({
    required this.index,
    required this.controller,
    required this.onPickDob,
    this.onRemove,
  });
  final int index;
  final BookingController controller;
  final VoidCallback onPickDob;
  final VoidCallback? onRemove;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final p = controller.passengers[index];
    final nameFilter =
        FilteringTextInputFormatter.allow(RegExp(r"[a-zA-Z\s'-]"));
    return BrutalCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Eyebrow('Passenger ${(index + 1).toString().padLeft(2, '0')}',
                  color: c.muted),
              if (onRemove != null)
                InkWell(
                  onTap: onRemove,
                  child: Row(
                    children: [
                      Icon(Icons.close, size: 14, color: c.muted),
                      const SizedBox(width: 4),
                      Text('Remove',
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: c.muted)),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  initialValue: p.firstName,
                  inputFormatters: [nameFilter],
                  onChanged: (v) => p.firstName = v,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Required' : null,
                  decoration: _inputDecoration(context, 'First name'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: TextFormField(
                  initialValue: p.lastName,
                  inputFormatters: [nameFilter],
                  onChanged: (v) => p.lastName = v,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Required' : null,
                  decoration: _inputDecoration(context, 'Last name'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          InkWell(
            onTap: onPickDob,
            borderRadius: BorderRadius.circular(8),
            child: Container(
              width: double.infinity,
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: c.borderStrong),
              ),
              child: Row(
                children: [
                  Icon(Icons.calendar_today, size: 16, color: c.muted),
                  const SizedBox(width: 10),
                  Text(
                    p.dob.isEmpty ? 'Date of birth' : p.dob,
                    style: TextStyle(
                        color: p.dob.isEmpty ? c.muted : c.foreground,
                        fontWeight: FontWeight.w600),
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
