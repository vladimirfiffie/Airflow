import Link from "next/link";

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
    answer: "You’ll receive updates by email/SMS. Eligible delays include rebooking options and support assistance.",
  },
  {
    question: "How do I request special assistance?",
    answer: "Contact support at least 48 hours before departure so our team can prepare airport accommodations.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/90 bg-white/85 p-8 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Find answers quickly or contact support for booking and flight assistance.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/booking"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Manage My Booking
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Browse Flights
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Call", value: "+1 (800) 555-0148" },
          { title: "Email", value: "support@airflow.example" },
          { title: "Hours", value: "24/7 live assistance" },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{item.title}</p>
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 dark:text-slate-100">
              {faq.question}
            </summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.answer}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
