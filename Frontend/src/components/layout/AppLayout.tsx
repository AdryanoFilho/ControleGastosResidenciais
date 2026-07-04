import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { para: '/', rotulo: 'Dashboard' },
  { para: '/pessoas', rotulo: 'Pessoas' },
  { para: '/transacoes', rotulo: 'Transações' },
  { para: '/totais', rotulo: 'Totais' },
];

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">💰</span>
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
