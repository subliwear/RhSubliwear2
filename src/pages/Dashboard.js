import React from 'react';

const Dashboard = () => {
  const stats = [
    { title: 'Employés Actifs', value: '0', icon: '👥' },
    { title: 'Absences en cours', value: '0', icon: '🏥' },
    { title: 'Congés en attente', value: '0', icon: '⏳' },
    { title: 'Congés approuvés', value: '0', icon: '✅' },
  ];

  return (
    <div className="dashboard">
      <h1>Tableau de Bord: Hello Damz</h1>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <h3>{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="recent-activity">
        <h2>Activité Récente</h2>
        <div className="activity-list">
          <p>Aucune activité récente</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
