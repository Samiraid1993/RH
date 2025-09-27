import React, { useState, useEffect } from "react";

function HRManagementTool() {
  const [date, setDate] = useState("");
  const [employee, setEmployee] = useState("");
  const [role, setRole] = useState("");
  const [salaire, setSalaire] = useState("");
  const [jour, setJour] = useState("");

  const [records, setRecords] = useState([]); // pour afficher les lignes Google Sheets
  const [loading, setLoading] = useState(false);

  // URL de ton Web App Google Apps Script
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz3THCrTl1Yijw4ST0wQYXpwWbzQLE63nHUZKqRBFdOGa77gOqPI-GbMmGXvPVuBXnQpw/exec";

  // Charger les données depuis Google Sheets
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sauvegarder une nouvelle ligne
  const handleSave = async () => {
    const payload = {
      date,
      employee,
      role,
      salaire,
      jour,
    };

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      alert("✅ Sauvegarde réussie !");
      console.log("Réponse Google Sheets :", result);

      // Recharger les données après sauvegarde
      fetchData();

      // Réinitialiser le formulaire
      setDate("");
      setEmployee("");
      setRole("");
      setSalaire("");
      setJour("");
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
      alert("❌ Erreur lors de la sauvegarde.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📊 Gestion RH</h2>

      {/* Formulaire */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          placeholder="Employé"
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Rôle"
        />
        <input
          type="number"
          value={salaire}
          onChange={(e) => setSalaire(e.target.value)}
          placeholder="Salaire"
        />
        <input
          type="text"
          value={jour}
          onChange={(e) => setJour(e.target.value)}
          placeholder="Jour"
        />
        <button onClick={handleSave}>💾 Sauvegarder</button>
      </div>

      {/* Tableau */}
      <h3>📑 Données enregistrées</h3>
      {loading ? (
        <p>⏳ Chargement...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employé</th>
              <th>Rôle</th>
              <th>Salaire</th>
              <th>Jour</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.employee}</td>
                  <td>{row.role}</td>
                  <td>{row.salaire}</td>
                  <td>{row.jour}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucune donnée disponible</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HRManagementTool;
