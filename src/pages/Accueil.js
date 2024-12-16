import React from 'react';
import { Link } from 'react-router-dom';

const Accueil = () => {
  const quickStats = [
    { label: 'Employés', value: '0', icon: '👥', link: '/employes' },
    { label: 'Absences en cours', value: '0', icon: '🏥', link: '/absences' },
    { label: 'Congés en attente', value: '0', icon: '⏳', link: '/conges' },
    { label: 'Départements', value: '5', icon: '🏢', link: '/employes' }
  ];

  const recentActivity = [
    { type: 'Congé', message: 'Nouvelle demande de congé de Jean Dupont', date: '2024-01-15' },
    { type: 'Absence', message: 'Absence validée pour Marie Martin', date: '2024-01-14' },
    { type: 'Employé', message: 'Nouveau collaborateur : Pierre Durant', date: '2024-01-13' }
  ];

  return (
    <div className="accueil-page">
      <div className="welcome-section">
        <img 
          src="https://www.subliwear.fr/wp-content/uploads/2020/09/Logo.png"
          alt="Subliwear Logo"
          className="company-logo"
        />
        <h1>Bienvenue sur SubliwearRH</h1>
        <p>Votre plateforme de gestion des ressources humaines</p>
      </div>

      <div className="quick-stats">
        {quickStats.map((stat, index) => (
          <Link to={stat.link} key={index} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="main-content">
        <div className="left-column">
          <div className="quick-actions">
            <h2>Actions Rapides</h2>
            <div className="action-buttons">
              <Link to="/absences" className="action-btn">
                <span className="icon">➕</span>
                Déclarer une absence
              </Link>
              <Link to="/conges" className="action-btn">
                <span className="icon">🗓</span>
                Demander un congé
              </Link>
              <Link to="/employes" className="action-btn">
                <span className="icon">👤</span>
                Ajouter un employé
              </Link>
              <Link to="/rapports" className="action-btn">
                <span className="icon">📊</span>
                Générer un rapport
              </Link>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Activité Récente</h2>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'Congé' ? '🗓' : 
                     activity.type === 'Absence' ? '🏥' : '👤'}
                  </div>
                  <div className="activity-details">
                    <p>{activity.message}</p>
                    <span className="activity-date">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="calendar-widget">
            <h2>Calendrier</h2>
            <div className="calendar-placeholder">
              {/* Intégration future d'un calendrier */}
              <p>Calendrier des absences et congés</p>
            </div>
          </div>

          <div className="notifications">
            <h2>Notifications</h2>
            <div className="notifications-list">
              <div className="notification-item">
                <span className="icon">⚠️</span>
                <p>3 demandes de congés en attente de validation</p>
              </div>
              <div className="notification-item">
                <span className="icon">📅</span>
                <p>Entretiens annuels à planifier</p>
              </div>
              <div className="notification-item">
                <span className="icon">🎯</span>
                <p>Objectifs trimestriels à mettre à jour</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
