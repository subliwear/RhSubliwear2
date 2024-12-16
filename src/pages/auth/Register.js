import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérification de l'email
    if (!formData.email.endsWith('@subliwear.fr')) {
      setError('Vous devez utiliser une adresse email Subliwear');
      return;
    }

    // Simuler l'enregistrement (à remplacer par une vraie API)
    localStorage.setItem('pendingUser', JSON.stringify({
      username: formData.username,
      email: formData.email,
      role: 'pending',
      isAuthenticated: false
    }));

    // Redirection vers la page de connexion
    navigate('/login', { 
      state: { message: 'Compte créé avec succès. En attente de validation par un administrateur.' }
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img 
          src="https://www.subliwear.fr/wp-content/uploads/2020/09/Logo.png"
          alt="Subliwear Logo"
          className="auth-logo"
        />
        <h2>Créer un compte</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Subliwear</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="exemple@subliwear.fr"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            S'inscrire
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Déjà un compte ? Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
