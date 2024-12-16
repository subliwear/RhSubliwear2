import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    activeLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    totalLeaves: 0,
    departments: 0
  });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ici vous pouvez ajouter les appels API pour récupérer les vraies statistiques
        // const response = await axios.get(`${API_URL}/api/stats`);
        // setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Employés',
      value: stats.employees,
      icon: '👥',
      color: '#4CAF50'
    },
    {
      title: 'Absences en cours',
      value: stats.activeLeaves,
      icon: '🏥',
      color: '#2196F3'
    },
    {
      title: 'Congés en attente',
      value: stats.pendingLeaves,
      icon: '⏳',
      color: '#FF9800'
    },
    {
      title: 'Congés approuvés',
      value: stats.approvedLeaves,
      icon: '✅',
      color: '#4CAF50'
    }
  ];

  return (
    <div className="dashboard">
      <h1>Tableau de Bord</h1>
      
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
            <span className="stat-icon">{stat.icon}</span>
            <h3>{stat.title}</h3>
            <p className="stat-value" style={{ color: stat.color }}>{stat.value}</p>
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
