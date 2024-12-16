import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img 
            src="https://www.subliwear.fr/wp-content/uploads/2020/09/Logo.png" 
            alt="Subliwear Logo" 
            className="logo"
          />
        </Link>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user ? user.username : 'Utilisateur'}</span>
          <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
