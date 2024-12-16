import React, { useState } from 'react';

const Rapports = () => {
  const [selectedReport, setSelectedReport] = useState('absences');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const generateReport = () => {
    // Logique de génération de rapport à implémenter
    console.log('Génération du rapport:', selectedReport, dateDebut, dateFin);
  };

  return (
    <div className="rapports-page">
      <h1>Rapports RH</h1>

      <div className="report-filters">
        <div className="form-group">
          <label>Type de Rapport</label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="absences">Rapport d'Absences</option>
            <option value="conges">Rapport des Congés</option>
            <option value="effectifs">État des Effectifs</option>
            <option value="turnover">Turnover</option>
          </select>
        </div>

        <div className="form-group">
          <label>Période du</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>au</label>
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>

        <button onClick={generateReport} className="generate-btn">
          Générer le Rapport
        </button>
      </div>

      <div className="report-templates">
        <h2>Rapports Prédéfinis</h2>
        <div className="templates-grid">
          <div className="template-card">
            <h3>Bilan Social</h3>
            <p>Rapport annuel détaillé sur l'état social de l'entreprise</p>
            <button className="template-btn">Générer</button>
          </div>

          <div className="template-card">
            <h3>Analyse des Congés</h3>
            <p>Vue d'ensemble des congés par département</p>
            <button className="template-btn">Générer</button>
          </div>

          <div className="template-card">
            <h3>Absentéisme</h3>
            <p>Taux d'absentéisme par service et motif</p>
            <button className="template-btn">Générer</button>
          </div>

          <div className="template-card">
            <h3>Effectifs</h3>
            <p>État des effectifs et mouvements de personnel</p>
            <button className="template-btn">Générer</button>
          </div>
        </div>
      </div>

      <div className="export-options">
        <h2>Options d'Export</h2>
        <div className="export-buttons">
          <button className="export-btn pdf">
            <span className="icon">📄</span> Export PDF
          </button>
          <button className="export-btn excel">
            <span className="icon">📊</span> Export Excel
          </button>
          <button className="export-btn csv">
            <span className="icon">📑</span> Export CSV
          </button>
        </div>
      </div>

      <div className="report-preview">
        <h2>Aperçu du Rapport</h2>
        <div className="preview-container">
          <p className="placeholder-text">
            Sélectionnez un type de rapport et une période pour générer l'aperçu
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rapports;
