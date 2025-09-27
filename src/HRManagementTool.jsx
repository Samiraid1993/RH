import React, { useState } from "react";

export default function HRManagementTool() {
  const [date, setDate] = useState("");
  const [secretaire1, setSecretaire1] = useState("");
  const [secretaire2, setSecretaire2] = useState("");
  const [secretaire3, setSecretaire3] = useState("");
  const [dentiste1, setDentiste1] = useState("");
  const [dentiste2, setDentiste2] = useState("");
  const [assistante1, setAssistante1] = useState("");
  const [assistante2, setAssistante2] = useState("");
  const [salaire, setSalaire] = useState("");
  const [jour, setJour] = useState("");
  const [savedData, setSavedData] = useState([]);

  // Ton lien Google Apps Script déployé en Web App
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyk0LxHlV3lbwQWJ9wULc6xmlUzqrQphCuMfmCXPyuUX2nXqw/exec";

  const handleSave = async () => {
    const newEntry = {
      date,
      secretaire1,
      secretaire2,
      secretaire3,
      dentiste1,
      dentiste2,
      assistante1,
      assistante2,
      salaire,
      jour,
    };

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(newEntry),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("✅ Données sauvegardées !");
        setSavedData([...savedData, newEntry]);
        setDate("");
        setSecretaire1("");
        setSecretaire2("");
        setSecretaire3("");
        setDentiste1("");
        setDentiste2("");
        setAssistante1("");
        setAssistante2("");
        setSalaire("");
        setJour("");
      } else {
        alert("❌ Erreur lors de la sauvegarde.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("⚠️ Impossible de contacter Google Sheets");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📊 Gestion RH</h2>
      <div style={{ marginBottom: "10px" }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /> <br /><br />

        <input placeholder="Secrétaire 1" value={secretaire1} onChange={(e) => setSecretaire1(e.target.value)} /> <br />
        <input placeholder="Secrétaire 2" value={secretaire2} onChange={(e) => setSecretaire2(e.target.value)} /> <br />
        <input placeholder="Secrétaire 3" value={secretaire3} onChange={(e) => setSecretaire3(e.target.value)} /> <br /><br />

        <input placeholder="Dentiste 1" value={dentiste1} onChange={(e) => setDentiste1(e.target.value)} /> <br />
        <input placeholder="Dentiste 2" value={dentiste2} onChange={(e) => setDentiste2(e.target.value)} /> <br /><br />

        <input placeholder="Assistante 1" value={assistante1} onChange={(e) => setAssistante1(e.target.value)} /> <br />
        <input placeholder="Assistante 2" value={assistante2} onChange={(e) => setAssistante2(e.target.value)} /> <br /><br />

        <input placeholder="Salaire" value={salaire} onChange={(e) => setSalaire(e.target.value)} /> <br />
        <input placeholder="Jour" value={jour} onChange={(e) => setJour(e.target.value)} /> <br /><br />

        <button onClick={handleSave}>💾 Sauvegarder</button>
      </div>

      <h3>Données enregistrées</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Secrétaire 1</th>
            <th>Secrétaire 2</th>
            <th>Secrétaire 3</th>
            <th>Dentiste 1</th>
            <th>Dentiste 2</th>
            <th>Assistante 1</th>
            <th>Assistante 2</th>
            <th>Salaire</th>
            <th>Jour</th>
          </tr>
        </thead>
        <tbody>
          {savedData.length === 0 ? (
            <tr><td colSpan="10">Aucune donnée disponible</td></tr>
          ) : (
            savedData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.secretaire1}</td>
                <td>{entry.secretaire2}</td>
                <td>{entry.secretaire3}</td>
                <td>{entry.dentiste1}</td>
                <td>{entry.dentiste2}</td>
                <td>{entry.assistante1}</td>
                <td>{entry.assistante2}</td>
                <td>{entry.salaire}</td>
                <td>{entry.jour}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
