import React, { useState } from 'react';

const Employes = () => {
  const [employes, setEmployes] = useState([
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@subliwear.fr',
      poste: 'Développeur',
      departement: 'IT',
      dateEntree: '2023-01-15',
      status: 'Actif'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartement, setFilterDepartement] = useState('');

  const departements = ['IT', 'RH', 'Commercial', 'Production', 'Marketing'];

  const filteredEmployes = employes.filter(employe => {
    const matchSearch = (
      employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchDepartement = !filterDepartement || employe.departement === filterDepartement;
    return matchSearch && matchDepartement;
  });

  return (
    <div className="employes-page">
      <h1>Gestion des Employés</h1>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un employé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <select
            value={filterDepartement}
            onChange={(e) => setFilterDepartement(e.target.value)}
          >
            <option value="">Tous les départements</option>
            {departements.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="employes-list">
        <table className="employes-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Poste</th>
              <th>Département</th>
              <th>Date d'entrée</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployes.map(employe => (
              <tr key={employe.id}>
                <td>{employe.nom}</td>
                <td>{employe.prenom}</td>
                <td>{employe.email}</td>
                <td>{employe.poste}</td>
                <td>{employe.departement}</td>
                <td>{new Date(employe.dateEntree).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${employe.status.toLowerCase()}`}>
                    {employe.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit">Modifier</button>
                  <button className="action-btn view">Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <h3>Total Employés</h3>
          <p>{employes.length}</p>
        </div>
        <div className="stat-box">
          <h3>Employés Actifs</h3>
          <p>{employes.filter(e => e.status === 'Actif').length}</p>
        </div>
        <div className="stat-box">
          <h3>Départements</h3>
          <p>{new Set(employes.map(e => e.departement)).size}</p>
        </div>
      </div>
    </div>
  );
};

export default Employes;
