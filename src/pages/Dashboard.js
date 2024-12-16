import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { CSVLink } from 'react-csv';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 12,
    activeLeaves: 3,
    pendingLeaves: 5,
    approvedLeaves: 8,
    totalLeaves: 16,
    departments: 4
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Entretiens annuels à planifier pour 3 employés',
      date: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'info',
      message: 'Nouvelle mise à jour du système disponible',
      date: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 3,
      type: 'success',
      message: 'Les fiches de paie de mars sont prêtes',
      date: new Date(Date.now() - 7200000),
      read: true
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const [recentActivities, setRecentActivities] = useState([
    {
      type: 'leave_request',
      user: 'Sophie Martin',
      action: 'a demandé un congé',
      date: new Date(2024, 2, 15),
      status: 'pending'
    },
    {
      type: 'leave_approved',
      user: 'Marc Dubois',
      action: 'congé approuvé par',
      approver: 'Julie Lambert',
      date: new Date(2024, 2, 14),
      status: 'approved'
    },
    {
      type: 'new_employee',
      user: 'Thomas Bernard',
      action: 'a rejoint l\'entreprise',
      date: new Date(2024, 2, 13),
      department: 'Production'
    }
  ]);

  const [departmentStats, setDepartmentStats] = useState([
    { name: 'Production', employees: 5, absences: 2 },
    { name: 'Administration', employees: 3, absences: 1 },
    { name: 'Commercial', employees: 2, absences: 0 },
    { name: 'Logistique', employees: 2, absences: 0 }
  ]);

  const [filters, setFilters] = useState({
    dateRange: 'month',
    department: 'all',
    status: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [favoriteViews, setFavoriteViews] = useState(JSON.parse(localStorage.getItem('favoriteViews') || '[]'));
  const [currentView, setCurrentView] = useState('default');
  const [chartData, setChartData] = useState({
    absences: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      datasets: [{
        label: 'Absences',
        data: [12, 19, 8, 15, 10, 13],
        borderColor: '#2196F3',
        tension: 0.4
      }]
    },
    departments: {
      labels: departmentStats.map(dept => dept.name),
      datasets: [{
        label: 'Employés',
        data: departmentStats.map(dept => dept.employees),
        backgroundColor: '#4CAF50'
      }]
    }
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'd':
            e.preventDefault();
            setDarkMode(!darkMode);
            break;
          case 'f':
            e.preventDefault();
            setShowFilters(!showFilters);
            break;
          case 'n':
            e.preventDefault();
            setShowNotifications(!showNotifications);
            break;
          case 's':
            e.preventDefault();
            handleExport();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [darkMode, showFilters, showNotifications]);

  // Dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // Export data
  const handleExport = () => {
    const csvData = [
      ['Département', 'Employés', 'Absences'],
      ...departmentStats.map(dept => [dept.name, dept.employees, dept.absences])
    ];
    return csvData;
  };

  // Favorite views
  const saveCurrentView = () => {
    const newView = {
      id: Date.now(),
      name: prompt('Nom de la vue :'),
      filters: { ...filters },
      dateRange: filters.dateRange
    };
    if (newView.name) {
      const updatedViews = [...favoriteViews, newView];
      setFavoriteViews(updatedViews);
      localStorage.setItem('favoriteViews', JSON.stringify(updatedViews));
    }
  };

  const loadFavoriteView = (view) => {
    setFilters(view.filters);
    setCurrentView(view.id);
  };

  const deleteFavoriteView = (viewId) => {
    const updatedViews = favoriteViews.filter(view => view.id !== viewId);
    setFavoriteViews(updatedViews);
    localStorage.setItem('favoriteViews', JSON.stringify(updatedViews));
  };

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
      color: '#4CAF50',
      trend: '+2 ce mois'
    },
    {
      title: 'Absences en cours',
      value: stats.activeLeaves,
      icon: '🏥',
      color: '#2196F3',
      trend: '-1 cette semaine'
    },
    {
      title: 'Congés en attente',
      value: stats.pendingLeaves,
      icon: '⏳',
      color: '#FF9800',
      trend: '+3 nouveaux'
    },
    {
      title: 'Congés approuvés',
      value: stats.approvedLeaves,
      icon: '✅',
      color: '#4CAF50',
      trend: '80% approuvés'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'leave_request':
        return '📝';
      case 'leave_approved':
        return '✅';
      case 'leave_rejected':
        return '❌';
      case 'new_employee':
        return '🎉';
      default:
        return '📌';
    }
  };

  const getActivityClass = (status) => {
    switch (status) {
      case 'approved':
        return 'activity-approved';
      case 'rejected':
        return 'activity-rejected';
      case 'pending':
        return 'activity-pending';
      default:
        return '';
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '📌';
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Tableau de Bord</h1>
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title="Changer le thème (Ctrl/Cmd + D)"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
              title="Filtres (Ctrl/Cmd + F)"
            >
              <span className="icon">🔍</span>
              Filtres
            </button>
            <div className="favorite-views">
              <button onClick={saveCurrentView} title="Sauvegarder la vue actuelle">
                <span className="icon">⭐</span>
              </button>
              {favoriteViews.length > 0 && (
                <div className="favorites-dropdown">
                  <h3>Vues enregistrées</h3>
                  {favoriteViews.map(view => (
                    <div key={view.id} className="favorite-item">
                      <button onClick={() => loadFavoriteView(view)}>
                        {view.name}
                      </button>
                      <button 
                        className="delete-view"
                        onClick={() => deleteFavoriteView(view.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <CSVLink 
              data={handleExport()}
              filename="statistiques_rh.csv"
              className="export-btn"
              title="Exporter les données (Ctrl/Cmd + S)"
            >
              <span className="icon">📊</span>
              Exporter
            </CSVLink>
          </div>
        </div>
        <div className="header-controls">
          <div className="date-filter">
            <select defaultValue="month">
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          <div className="notifications-center">
            <button 
              className="notifications-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="icon">🔔</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="notifications-dropdown">
                <h3>Notifications</h3>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <span className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <small>{format(notification.date, 'HH:mm - dd/MM/yyyy', { locale: fr })}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">Aucune notification</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Période :</label>
            <select 
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Département :</label>
            <select 
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="production">Production</option>
              <option value="administration">Administration</option>
              <option value="commercial">Commercial</option>
              <option value="logistique">Logistique</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Statut :</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="leave">En congé</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="apply-filters">
              Appliquer les filtres
            </button>
            <button 
              className="reset-filters"
              onClick={() => setFilters({
                dateRange: 'month',
                department: 'all',
                status: 'all'
              })}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
            <span className="stat-icon">{stat.icon}</span>
            <h3>{stat.title}</h3>
            <p className="stat-value" style={{ color: stat.color }}>{stat.value}</p>
            <small className="stat-trend">{stat.trend}</small>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="content-left">
          <div className="charts-container card">
            <h2>Évolution des Absences</h2>
            <div className="chart-wrapper">
              <Line 
                data={chartData.absences}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="department-stats card">
            <h2>Statistiques par Département</h2>
            <div className="chart-wrapper">
              <Bar 
                data={chartData.departments}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
            <div className="department-list">
              {departmentStats.map((dept, index) => (
                <div key={index} className="department-item">
                  <div className="department-info">
                    <h4>{dept.name}</h4>
                    <div className="department-details">
                      <span>{dept.employees} employés</span>
                      <span>{dept.absences} absences</span>
                    </div>
                  </div>
                  <div className="department-chart">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        width: `${(dept.absences / dept.employees) * 100}%`,
                        backgroundColor: dept.absences > 0 ? '#FF9800' : '#4CAF50'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions card">
            <h2>Actions Rapides</h2>
            <div className="action-buttons">
              <button className="action-btn">
                <span>➕</span>
                Nouvel Employé
              </button>
              <button className="action-btn">
                <span>📝</span>
                Demande Congé
              </button>
              <button className="action-btn">
                <span>📊</span>
                Rapport
              </button>
              <button className="action-btn">
                <span>📅</span>
                Planning
              </button>
            </div>
          </div>
        </div>

        <div className="content-right">
          <div className="recent-activity card">
            <h2>Activité Récente</h2>
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`activity-item ${getActivityClass(activity.status)}`}>
                  <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                  <div className="activity-content">
                    <p>
                      <strong>{activity.user}</strong> {activity.action}
                      {activity.approver && <span> par <strong>{activity.approver}</strong></span>}
                      {activity.department && <span> - {activity.department}</span>}
                    </p>
                    <small>{format(activity.date, 'dd MMMM yyyy', { locale: fr })}</small>
                  </div>
                  {activity.status && (
                    <span className={`activity-status status-${activity.status}`}>
                      {activity.status === 'approved' ? 'Approuvé' : 
                       activity.status === 'rejected' ? 'Refusé' : 'En attente'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="keyboard-shortcuts-info">
        <h3>Raccourcis clavier :</h3>
        <ul>
          <li>Ctrl/Cmd + D : Changer le thème</li>
          <li>Ctrl/Cmd + F : Afficher/masquer les filtres</li>
          <li>Ctrl/Cmd + N : Afficher/masquer les notifications</li>
          <li>Ctrl/Cmd + S : Exporter les données</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
