import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { path: '/absences', label: 'Absences', icon: '📅' },
    { path: '/conges', label: 'Congés', icon: '🏖' },
    { path: '/employes', label: 'Employés', icon: '👥' },
    { path: '/rapports', label: 'Rapports', icon: '📈' },
  ];

  return (
    <nav className="sidebar">
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink 
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
