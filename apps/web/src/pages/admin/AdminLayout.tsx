import { NavLink, Outlet } from 'react-router-dom';

const TABS = [
  { to: '/admin', end: true, label: 'Overview' },
  { to: '/admin/knowledge', label: 'Knowledge' },
  { to: '/admin/schemes', label: 'Schemes' },
  { to: '/admin/grievances', label: 'Grievances' },
];

export function AdminLayout() {
  return (
    <div className="container-page max-w-6xl py-8">
      <header className="border-b border-line pb-4">
        <h1 className="text-xl font-semibold text-ink">Administration</h1>
        <nav className="mt-3 flex gap-6 text-sm">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `-mb-[17px] border-b-2 pb-3 ${
                  isActive
                    ? 'border-field font-medium text-ink'
                    : 'border-transparent text-muted hover:text-ink'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="pt-8">
        <Outlet />
      </div>
    </div>
  );
}
