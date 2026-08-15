import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/brutal.dart';

class _Faq {
  const _Faq(this.q, this.a);
  final String q;
  final String a;
}

const _faqs = [
  _Faq('How do I change or cancel a booking?',
      'Bookings can be changed or cancelled free of charge within 24 hours. After that, fare rules apply based on the ticket you purchased.'),
  _Faq('When can I select my seat?',
      'Seats are selected during checkout, right after entering passenger details. First-class and exit-row seats carry a surcharge.'),
  _Faq('Is my payment secure?',
      'Payments are processed over 256-bit SSL and are PCI-DSS compliant. In demo mode no real charge is made.'),
  _Faq('How many passengers can I book at once?',
      'Up to 6 passengers per booking. Each passenger needs a name matching their government-issued ID and a date of birth.'),
  _Faq('Where do I find my confirmation?',
      'A booking reference is shown on the confirmation screen and emailed to your contact address when email is configured.'),
];

class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return AppScaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Eyebrow('Support'),
          const SizedBox(height: 12),
          const Display('How can we help?', size: 36),
          const SizedBox(height: 24),
          for (final f in _faqs)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: BrutalCard(
                padding: EdgeInsets.zero,
                child: Theme(
                  data: Theme.of(context)
                      .copyWith(dividerColor: Colors.transparent),
                  child: ExpansionTile(
                    iconColor: c.accent,
                    collapsedIconColor: c.muted,
                    title: Text(f.q,
                        style: const TextStyle(
                            fontWeight: FontWeight.w800, fontSize: 15)),
                    childrenPadding:
                        const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(f.a,
                            style: TextStyle(color: c.muted, height: 1.5)),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          const SizedBox(height: 12),
          BrutalCard(
            color: c.surface2,
            child: Row(
              children: [
                Icon(Icons.support_agent, color: c.accent),
                const SizedBox(width: 12),
                Expanded(
                  child: Text('Still stuck? Reach the team at help@airflow.app',
                      style: TextStyle(color: c.muted)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
