import React, { useState } from 'react';

const Absences = () => {
  const [absences, setAbsences] = useState([]);
  const [newAbsence, setNewAbsence] = useState({
    dateDebut: '',
    dateFin: '',
    motif: '',
    commentaire: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAbsences([...absences, { ...newAbsence, status: 'En attente', id: Date.now() }]);
    setNewAbsence({ dateDebut: '', dateFin: '', motif: '', commentaire: '' });
  };

  return (
    <div className="absences-page">
      <h1>Gestion des Absences</h1>
      
      <div className="absence-form-container">
        <h2>Nouvelle Demande d'Absence</h2>
        <form onSubmit={handleSubmit} className="absence-form">
          <div className="form-group">
            <label>Date de début</label>
            <input
              type="date"
              value={newAbsence.dateDebut}
              onChange={(e) => setNewAbsence({...newAbsence, dateDebut: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Date de fin</label>
            <input
              type="date"
              value={newAbsence.dateFin}
              onChange={(e) => setNewAbsence({...newAbsence, dateFin: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Motif</label>
            <select
              value={newAbsence.motif}
              onChange={(e) => setNewAbsence({...newAbsence, motif: e.target.value})}
              required
            >
              <option value="">Sélectionnez un motif</option>
              <option value="maladie">Maladie</option>
              <option value="familial">Événement familial</option>
              <option value="formation">Formation</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Commentaire</label>
            <textarea
              value={newAbsence.commentaire}
              onChange={(e) => setNewAbsence({...newAbsence, commentaire: e.target.value})}
              rows="3"
            />
          </div>
          
          <button type="submit" className="submit-btn">Soumettre la demande</button>
        </form>
      </div>

      <div className="absences-list">
        <h2>Mes Demandes d'Absence</h2>
        {absences.length === 0 ? (
          <p>Aucune demande d'absence</p>
        ) : (
          <table className="absences-table">
            <thead>
              <tr>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Motif</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence) => (
                <tr key={absence.id}>
                  <td>{absence.dateDebut}</td>
                  <td>{absence.dateFin}</td>
                  <td>{absence.motif}</td>
                  <td>{absence.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Absences;
