type Activity = {
  label: string;
  value: number;
  color: string;
};

const mockData: Activity[] = [
  { label: "Policy", value: 28, color: "bg-emerald-500" },
  { label: "Community", value: 32, color: "bg-indigo-500" },
  { label: "Safety", value: 18, color: "bg-amber-500" },
  { label: "Transit", value: 12, color: "bg-rose-500" },
  { label: "Events", value: 10, color: "bg-cyan-500" },
];

export const ActivityPulse = () => (
  <section className="card">
    <h2 className="text-lg font-semibold text-slate-900">Community Activity Pulse</h2>
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative mx-auto h-36 w-36 rounded-full bg-gradient-to-tr from-brand to-violet-500 text-center text-white">
        <div className="absolute inset-3 rounded-full bg-white text-slate-900">
          <div className="mt-10">
            <p className="text-xs uppercase tracking-wide text-slate-400">Active users</p>
            <p className="text-2xl font-semibold">2,847</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {mockData.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              {item.label}
            </div>
            <span className="font-semibold text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

