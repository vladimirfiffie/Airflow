import Link from "next/link";
import { Phone, Mail, Clock, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "How early should I arrive at the airport?",
    answer:
      "Domestic flights: at least 2 hours before departure. International flights: at least 3 hours.",
  },
  {
    question: "Can I change my flight after booking?",
    answer:
      "Yes, fare rules apply. Open Manage Booking and retrieve your trip to review available options.",
  },
  {
    question: "What happens if my flight is delayed?",
    answer:
      "You'll receive updates by email/SMS. Eligible delays include rebooking options and support assistance.",
  },
  {
    question: "How do I request special assistance?",
    answer:
      "Contact support at least 48 hours before departure so our team can prepare airport accommodations.",
  },
];

const contactCards = [
  { icon: Phone, title: "Call", value: "+1 (800) 555-0148", note: "24/7 support" },
  { icon: Mail, title: "Email", value: "support@airflow.example", note: "Reply within 3h" },
  { icon: Clock, title: "Hours", value: "Always on", note: "Live agents 24/7" },
];

export default function HelpPage() {
  return (
    <div>
      <section className="border-b border-neutral-200 dark:border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <p className="eyebrow">Support</p>
          <h1 className="display mt-4 text-5xl font-black text-neutral-950 md:text-7xl dark:text-white">
            Help center.
          </h1>
          <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
            Find answers quickly or contact a real human for booking and flight assistance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Manage booking
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/search"
              className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
            >
              Browse flights
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        {/* Contact Cards */}
        <div className="grid gap-3 md:grid-cols-3">
          {contactCards.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-orange-500 dark:border-neutral-900 dark:bg-neutral-950 dark:hover:border-orange-500"
            >
              <item.icon className="h-6 w-6 text-orange-500" />
              <p className="eyebrow !text-neutral-500 mt-5 dark:!text-neutral-400">{item.title}</p>
              <p className="mono mt-2 text-lg font-bold text-neutral-950 dark:text-white">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{item.note}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-12">
          <p className="eyebrow">Frequently asked</p>
          <h2 className="display mt-4 text-4xl font-black text-neutral-950 md:text-5xl dark:text-white">
            Common questions.
          </h2>

          <div className="mt-10 divide-y divide-neutral-200 border-t border-b border-neutral-200 dark:divide-neutral-900 dark:border-neutral-900">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <span className="text-lg font-bold text-neutral-950 transition-colors group-open:text-orange-500 dark:text-white">
                    {faq.question}
                  </span>
                  <span className="mono text-2xl font-black text-neutral-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
