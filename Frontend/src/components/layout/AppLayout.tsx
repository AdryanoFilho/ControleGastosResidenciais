import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

interface ItemMenu {
  para: string;
  rotulo: string;
  icone: ReactNode;
}

const propsIcone = {
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const links: ItemMenu[] = [
  {
    para: '/',
    rotulo: 'Dashboard',
    icone: (
      <svg {...propsIcone} aria-hidden="true">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    para: '/pessoas',
    rotulo: 'Pessoas',
    icone: (
      <svg {...propsIcone} aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    para: '/transacoes',
    rotulo: 'Transações',
    icone: (
      <svg {...propsIcone} aria-hidden="true">
        <path d="M17 3l4 4-4 4" />
        <path d="M21 7H9" />
        <path d="M7 21l-4-4 4-4" />
        <path d="M3 17h12" />
      </svg>
    ),
  },
  {
    para: '/totais',
    rotulo: 'Totais',
    icone: (
      <svg {...propsIcone} aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="M8 17v-5" />
        <path d="M13 17V8" />
        <path d="M18 17v-9" />
      </svg>
    ),
  },
];

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">
            <svg {...propsIcone} width={20} height={20}>
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </span>
          <span>
            Controle de Gastos
            <small>Residenciais</small>
          </span>
        </div>
        <nav className="sidebar__nav" aria-label="Navegação principal">
          {links.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              end={link.para === '/'}
              className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--ativo' : ''}`}
            >
              {link.icone}
              {link.rotulo}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
