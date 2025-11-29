type HeaderProps = {
  city: string;
};

export const Header = ({ city }: HeaderProps) => (
  <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-brand to-violet-600 p-6 text-white shadow-card sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm uppercase tracking-wider text-white/80">NY Civic Sphere</p>
      <h1 className="text-2xl font-semibold">Good afternoon, Alex 👋</h1>
      <p className="text-white/80">Here is what's happening in {city}.</p>
    </div>
    <div className="flex gap-3">
      <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/30">
        Subscribe
      </button>
      <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-slate-50">
        Share dashboard
      </button>
    </div>
  </header>
);

