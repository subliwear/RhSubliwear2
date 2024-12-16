import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import '../styles/Conge.css';

const Conge = () => {
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({
    type: 'congé payé',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comment, setComment] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem('user'));

  // Charger les congés
  const loadLeaves = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}/api/leaves?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLeaves(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des congés: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [filters]);

  // Créer une nouvelle demande de congé
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/leaves`, newLeave, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Demande de congé créée avec succès');
      setNewLeave({
        type: 'congé payé',
        startDate: '',
        endDate: '',
        reason: ''
      });
      loadLeaves();
    } catch (err) {
      setError('Erreur lors de la création de la demande: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'une demande
  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/api/leaves/${leaveId}/status`,
        { status: newStatus, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSuccess('Statut mis à jour avec succès');
      setSelectedLeave(null);
      setComment('');
      loadLeaves();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut: ' + (err.response?.data?.message || err.message));
    }
  };

  // Ajouter un commentaire
  const handleAddComment = async (leaveId) => {
    if (!comment.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/leaves/${leaveId}/comments`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSuccess('Commentaire ajouté avec succès');
      setComment('');
      loadLeaves();
    } catch (err) {
      setError('Erreur lors de l\'ajout du commentaire: ' + (err.response?.data?.message || err.message));
    }
  };

  // Supprimer une demande
  const handleDelete = async (leaveId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;
    try {
      await axios.delete(`${API_URL}/api/leaves/${leaveId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Demande supprimée avec succès');
      loadLeaves();
    } catch (err) {
      setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="conge-container">
      <h1>Gestion des Congés</h1>

      {/* Formulaire de demande de congé */}
      <div className="leave-form card">
        <h2>Nouvelle Demande de Congé</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Type de congé</label>
              <select
                value={newLeave.type}
                onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                required
              >
                <option value="congé payé">Congé payé</option>
                <option value="congé maladie">Congé maladie</option>
                <option value="congé sans solde">Congé sans solde</option>
                <option value="RTT">RTT</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date de début</label>
              <input
                type="date"
                value={newLeave.startDate}
                onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Date de fin</label>
              <input
                type="date"
                value={newLeave.endDate}
                onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Motif</label>
            <textarea
              value={newLeave.reason}
              onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
              required
              rows="3"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Envoi...' : 'Soumettre la demande'}
          </button>
        </form>
      </div>

      {/* Filtres */}
      <div className="filters card">
        <h2>Filtres</h2>
        <div className="filters-form">
          <div className="form-row">
            <div className="form-group">
              <label>Statut</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Tous</option>
                <option value="en attente">En attente</option>
                <option value="approuvé">Approuvé</option>
                <option value="refusé">Refusé</option>
              </select>
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">Tous</option>
                <option value="congé payé">Congé payé</option>
                <option value="congé maladie">Congé maladie</option>
                <option value="congé sans solde">Congé sans solde</option>
                <option value="RTT">RTT</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date début</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Date fin</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des congés */}
      <div className="leaves-list card">
        <h2>Liste des Demandes</h2>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employé</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Durée</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave._id} className={selectedLeave?._id === leave._id ? 'selected' : ''}>
                  <td>{`${leave.user.firstName} ${leave.user.lastName}`}</td>
                  <td>{leave.type}</td>
                  <td>
                    {format(new Date(leave.startDate), 'dd/MM/yyyy', { locale: fr })} -
                    {format(new Date(leave.endDate), 'dd/MM/yyyy', { locale: fr })}
                  </td>
                  <td>{leave.duration} jours</td>
                  <td>
                    <span className={`status-badge ${leave.status}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="view-btn"
                      >
                        Détails
                      </button>
                      {(user.role === 'admin' || user.role === 'manager') && leave.status === 'en attente' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(leave._id, 'approuvé')}
                            className="approve-btn"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(leave._id, 'refusé')}
                            className="reject-btn"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      {(user.role === 'admin' || leave.user._id === user._id) && leave.status === 'en attente' && (
                        <button
                          onClick={() => handleDelete(leave._id)}
                          className="delete-btn"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de détails */}
      {selectedLeave && (
        <div className="modal">
          <div className="modal-content">
            <h2>Détails de la demande</h2>
            <div className="leave-details">
              <p><strong>Employé:</strong> {`${selectedLeave.user.firstName} ${selectedLeave.user.lastName}`}</p>
              <p><strong>Type:</strong> {selectedLeave.type}</p>
              <p><strong>Dates:</strong> {format(new Date(selectedLeave.startDate), 'dd/MM/yyyy', { locale: fr })} - {format(new Date(selectedLeave.endDate), 'dd/MM/yyyy', { locale: fr })}</p>
              <p><strong>Durée:</strong> {selectedLeave.duration} jours</p>
              <p><strong>Motif:</strong> {selectedLeave.reason}</p>
              <p><strong>Statut:</strong> {selectedLeave.status}</p>
              {selectedLeave.approvedBy && (
                <p><strong>Approuvé par:</strong> {`${selectedLeave.approvedBy.firstName} ${selectedLeave.approvedBy.lastName}`}</p>
              )}
            </div>

            <div className="comments-section">
              <h3>Commentaires</h3>
              <div className="comments-list">
                {selectedLeave.comments?.map((comment, index) => (
                  <div key={index} className="comment">
                    <p className="comment-author">{`${comment.user.firstName} ${comment.user.lastName}`}</p>
                    <p className="comment-text">{comment.text}</p>
                    <p className="comment-date">{format(new Date(comment.date), 'dd/MM/yyyy HH:mm', { locale: fr })}</p>
                  </div>
                ))}
              </div>
              <div className="add-comment">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                />
                <button onClick={() => handleAddComment(selectedLeave._id)}>
                  Ajouter
                </button>
              </div>
            </div>

            <button className="close-btn" onClick={() => setSelectedLeave(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conge;
