import { NavLink, Outlet } from 'react-router-dom';

const TABS = [
  { to: '/admin', end: true, label: 'Overview' },
  { to: '/admin/knowledge', label: 'Knowledge' },
  { to: '/admin/schemes', label: 'Schemes' },
  { to: '/admin/grievances', label: 'Grievances' },
];

export function AdminLayout() {
  return (
    <div className="container-page">
      <header>
        <h1 className="font-display text-3xl">Administration</h1>
        <nav className="mt-6 flex gap-8 border-b border-line text-sm">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `-mb-px border-b-2 pb-3 font-semibold no-underline transition-colors ${
                  isActive
                    ? 'border-primary text-ink'
                    : 'border-transparent text-ink-2 hover:text-ink'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="pt-10">
        <Outlet />
      </div>
    </div>
  );
}
