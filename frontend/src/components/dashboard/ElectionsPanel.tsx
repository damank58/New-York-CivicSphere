import type { Election } from "../../types/dashboard";

type Props = {
  elections: Election[];
  isLoading: boolean;
};

export const ElectionsPanel = ({ elections, isLoading }: Props) => {
  const entries: Array<Election | undefined> = isLoading ? Array.from({ length: 4 }, () => undefined) : elections;

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming Elections & Ballot Info</h2>
        <button className="text-sm font-semibold text-brand">View All Issues</button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {entries.map((election, index) => (
          <article key={election ? election.id : `election-${index}`} className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{election?.stance ?? "..."}</p>
            <h3 className="text-sm font-semibold text-slate-900">{election?.title ?? "Loading..."}</h3>
            <p className="text-sm text-slate-500">{election?.description}</p>
            <p className="mt-2 text-xs font-semibold text-slate-400">{election ? `${election.votes} survey votes` : ""}</p>
          </article>
        ))}
      </div>
      <button className="mt-4 w-full rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Explore Candidates</button>
    </section>
  );
};

