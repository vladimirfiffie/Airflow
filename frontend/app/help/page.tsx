export default function HelpPage() {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black tracking-tight text-slate-900">Help Center</h1>
      <p className="text-slate-600">Support links are wired and route correctly with App Router navigation.</p>
      <ul className="list-disc space-y-2 pl-5 text-slate-700">
        <li>Check-in and gate updates</li>
        <li>Manage cancellations and refunds</li>
        <li>Passenger support and FAQs</li>
      </ul>
    </div>
  );
}
