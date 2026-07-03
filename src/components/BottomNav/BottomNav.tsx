import { NavLink } from 'react-router-dom';
import pokeballActive from '../../assets/icons/pokeball-nav-active.png';
import pokeballInactive from '../../assets/icons/pokeball-nav-inactive.png';
import regionsActive from '../../assets/icons/regions-nav-active.png';
import regionsInactive from '../../assets/icons/regions-nav-inactive.png';
import favoriteActive from '../../assets/icons/favorite-nav-active.png';
import favoriteInactive from '../../assets/icons/favorite-nav-inactive.png';
import profileActive from '../../assets/icons/profile-nav-active.png';
import profileInactive from '../../assets/icons/profile-nav-inactive.png';

const NAV_ITEMS = [
  { to: '/', label: 'Pokédex', activeIcon: pokeballActive, inactiveIcon: pokeballInactive },
  { to: '/regioes', label: 'Regiões', activeIcon: regionsActive, inactiveIcon: regionsInactive },
  { to: '/favoritos', label: 'Favoritos', activeIcon: favoriteActive, inactiveIcon: favoriteInactive },
  { to: '/conta', label: 'Conta', activeIcon: profileActive, inactiveIcon: profileInactive },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md items-center justify-around border-t border-neutral-200 bg-white py-2 md:max-w-3xl">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          aria-label={item.label}
          className="group flex flex-1 flex-col items-center justify-center gap-1 py-2"
        >
          {({ isActive }) => (
            <>
              <span className="relative flex h-6 w-6 items-center justify-center">
                <img
                  src={item.inactiveIcon}
                  alt=""
                  aria-hidden
                  className={`h-6 w-6 object-contain ${isActive ? 'hidden' : 'group-hover:hidden'}`}
                />
                <img
                  src={item.activeIcon}
                  alt=""
                  aria-hidden
                  className={`h-6 w-6 object-contain ${isActive ? 'block' : 'hidden group-hover:block'}`}
                />
              </span>
              <span
                className={`text-xs font-semibold text-blue-600 ${isActive ? 'block' : 'hidden group-hover:block'}`}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
