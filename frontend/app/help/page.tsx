import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";

const faqs = [
  {
    question: "How early should I arrive at the airport?",
    answer: "Domestic flights: at least 2 hours before departure. International flights: at least 3 hours.",
  },
  {
    question: "Can I change my flight after booking?",
    answer: "Yes, fare rules apply. Open Manage Booking and retrieve your trip to review available options.",
  },
  {
    question: "What happens if my flight is delayed?",
    answer: "You'll receive updates by email/SMS. Eligible delays include rebooking options and support assistance.",
  },
  {
    question: "How do I request special assistance?",
    answer: "Contact support at least 48 hours before departure so our team can prepare airport accommodations.",
  },
];

const contactCards = [
  { icon: Phone, title: "Call", value: "+1 (800) 555-0148" },
  { icon: Mail, title: "Email", value: "support@airflow.example" },
  { icon: Clock, title: "Hours", value: "24/7 live assistance" },
];

export default function HelpPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Support</p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">Help Center</h1>
          <p className="mt-3 max-w-xl text-neutral-400">
            Find answers quickly or contact support for booking and flight assistance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/booking"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Manage Booking
            </Link>
            <Link
              href="/search"
              className="rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
            >
              Browse Flights
            </Link>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {contactCards.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-500">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{item.title}</p>
                <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <h2 className="text-xl font-black text-white">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-neutral-800 bg-neutral-900/50 px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-200 transition group-open:text-blue-400">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-neutral-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
