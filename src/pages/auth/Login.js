import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Vérification des identifiants administrateur
    if (credentials.username === 'Damz' && credentials.password === 'Damienvs1774') {
      localStorage.setItem('user', JSON.stringify({
        username: 'Damz',
        role: 'admin',
        isAuthenticated: true
      }));
      navigate('/dashboard');
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img 
          src="https://www.subliwear.fr/wp-content/uploads/2020/09/Logo.png"
          alt="Subliwear Logo"
          className="auth-logo"
        />
        <h2>Connexion</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Se connecter
          </button>
        </form>
        <div className="auth-links">
          <Link to="/register">Créer un compte</Link>
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
