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
      <header>
        <h1 className="text-2xl font-bold text-ink">Administration</h1>
        <nav className="mt-4 flex gap-6 border-b-2 border-line text-base">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `-mb-0.5 border-b-4 pb-3 font-display font-semibold no-underline ${
                  isActive
                    ? 'border-accent text-ink'
                    : 'border-transparent text-primary hover:text-primary-hover'
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
