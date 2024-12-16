import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
    position: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // Charger la liste des utilisateurs
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Ajouter ou modifier un utilisateur
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        // Mode édition
        await axios.put(`${API_URL}/api/users/${editingUser._id}`, 
          { ...newUser, password: newUser.password || undefined },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setSuccess('Utilisateur modifié avec succès');
        setEditingUser(null);
      } else {
        // Mode création
        await axios.post(`${API_URL}/api/users`, newUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccess('Utilisateur créé avec succès');
      }
      
      setNewUser({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        department: '',
        position: '',
        role: 'user'
      });
      setError('');
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  // Activer/Désactiver un utilisateur
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(
        `${API_URL}/api/users/${userId}/status`,
        {
          status: currentStatus === 'active' ? 'inactive' : 'active'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSuccess('Statut modifié avec succès');
      loadUsers();
    } catch (err) {
      setError('Erreur lors de la modification du statut: ' + (err.response?.data?.message || err.message));
    }
  };

  // Éditer un utilisateur
  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      password: '', // Le mot de passe n'est pas pré-rempli pour des raisons de sécurité
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.department,
      position: user.position,
      role: user.role
    });
  };

  // Annuler l'édition
  const handleCancel = () => {
    setEditingUser(null);
    setNewUser({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      department: '',
      position: '',
      role: 'user'
    });
  };

  return (
    <div className="user-management">
      <h1>Gestion des Utilisateurs</h1>

      {/* Formulaire d'ajout/modification d'utilisateur */}
      <div className="add-user-form card">
        <h2>{editingUser ? 'Modifier un Utilisateur' : 'Ajouter un Utilisateur'}</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Département</label>
              <input
                type="text"
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Poste</label>
              <input
                type="text"
                value={newUser.position}
                onChange={(e) => setNewUser({...newUser, position: e.target.value})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required={!editingUser}
              />
            </div>
            <div className="form-group">
              <label>Rôle</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="user">Utilisateur</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Chargement...' : (editingUser ? 'Modifier' : 'Ajouter')}
            </button>
            {editingUser && (
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste des utilisateurs */}
      <div className="users-list card">
        <h2>Liste des Utilisateurs</h2>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom d'utilisateur</th>
                <th>Email</th>
                <th>Nom complet</th>
                <th>Département</th>
                <th>Poste</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.department}</td>
                  <td>{user.position}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(user)}
                        className="edit-btn"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user._id, user.status)}
                        className={`status-btn ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                      >
                        {user.status === 'active' ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 