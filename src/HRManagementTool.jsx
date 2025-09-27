import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

/**
 * 👉 CONSEIL IMPORTANT :
 * Renomme ta table Supabase sans espace pour éviter les soucis de quoting, ex.:
 *   "planning_rh"
 * (Si tu gardes "Planning RH", ça marche parfois, mais c’est source d’erreurs.
 * Si besoin : ALTER TABLE "Planning RH" RENAME TO planning_rh; )
 *
 * Colonnes attendues (toutes en minuscules, sans accents) :
 *   id (serial PK)
 *   date (text ou date)
 *   fonction (text)
 *   employe (text)
 *   taux_horaire (numeric)
 *   salaire_j (numeric)
 */
const TABLE = "planning_rh";

// Les colonnes (rôles “colonnes” dans ton planning)
const roles = [
  "OPH",
  "Orthos",
  "Secrétaire 1",
  "Secrétaire 2",
  "Secrétaire 3",
  "Dentiste 1",
  "Dentiste 2",
  "Assistante Dentaire 1",
  "Assistante Dentaire 2",
];

// Les jours (même format que ton tableau)
const days = [
  "Lundi 1","Mardi 2","Mercredi 3","Jeudi 4","Vendredi 5","Samedi 6","Dimanche 7",
  "Lundi 8","Mardi 9","Mercredi 10","Jeudi 11","Vendredi 12","Samedi 13","Dimanche 14",
  "Lundi 15","Mardi 16","Mercredi 17","Jeudi 18","Vendredi 19","Samedi 20","Dimanche 21",
  "Lundi 22","Mardi 23","Mercredi 24","Jeudi 25","Vendredi 26","Samedi 27","Dimanche 28",
  "Lundi 29","Mardi 30"
];

// (Optionnel) des choix d’employés par rôle.
// Mets-y tes vrais noms si tu veux des listes déroulantes plus précises.
const optionsByRole = {
  "OPH": ["", "KAMAL", "NAWEL", "FLORIAN"],
  "Orthos": ["", "KARIMA/AUDE", "INES", "SAMIA"],
  "Secrétaire 1": ["", "JOVANTHA", "CAMELIA", "AMINA", "ECOLE"],
  "Secrétaire 2": ["", "JOVANTHA", "CAMELIA", "AMINA", "ECOLE"],
  "Secrétaire 3": ["", "JOVANTHA", "CAMELIA", "AMINA", "ECOLE"],
  "Dentiste 1": ["", "ANDREI"],
  "Dentiste 2": ["", "—"],
  "Assistante Dentaire 1": ["", "OLGA", "MANUEL", "OLESEA"],
  "Assistante Dentaire 2": ["", "OLGA", "MANUEL", "OLESEA"],
};

export default function HRManagementTool() {
  const [planning, setPlanning] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Chargement initial (GET)
  useEffect(() => {
    (async () => {
      setLoading(true);
      // on récupère tout le planning
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("❌ Supabase SELECT error:", error.message);
        setLoading(false);
        return;
      }

      // On reconstruit un objet { [day]: { [role]: employe } }
      const plg = {};
      data.forEach((row) => {
        const d = row.date;      // "Lundi 1", etc.
        const r = row.fonction;  // "OPH", etc.
        const e = row.employe ?? "";
        if (!plg[d]) plg[d] = {};
        plg[d][r] = e;
      });
      setPlanning(plg);
      setLoading(false);
    })();
  }, []);

  // Mise à jour locale
  const onChangeCell = (day, role, value) => {
    setPlanning((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] ?? {}),
        [role]: value,
      },
    }));
  };

  // Sauvegarde (INSERT/UPSERT)
  const onSave = async () => {
    setSaving(true);

    // Transforme l’état du planning => lignes pour la BDD
    const rows = [];
    for (const day of days) {
      const line = planning[day] ?? {};
      for (const role of roles) {
        const employe = line[role] ?? "";
        if (employe) {
          rows.push({
            date: day,           // text (ou date si tu convertis)
            fonction: role,      // text
            employe,             // text
            taux_horaire: null,  // à calculer plus tard si tu veux
            salaire_j: null,     // idem
          });
        }
      }
    }

    if (rows.length === 0) {
      setSaving(false);
      alert("Aucune donnée à sauvegarder.");
      return;
    }

    // 1) Essaye en UPSERT (il faut une contrainte UNIQUE sur (date, fonction))
    //    SQL à faire UNE FOIS dans Supabase :
    //    ALTER TABLE planning_rh ADD CONSTRAINT uniq_date_fonction UNIQUE (date, fonction);
    let upsertOk = true;
    let errMsg = "";

    try {
      const { error: upsertError } = await supabase
        .from(TABLE)
        .upsert(rows, { onConflict: "date,fonction" });

      if (upsertError) {
        upsertOk = false;
        errMsg = upsertError.message;
      }
    } catch (e) {
      upsertOk = false;
      errMsg = e.message;
    }

    // 2) Si pas de contrainte UNIQUE, fallback : on purge & on réinsère
    if (!upsertOk) {
      console.warn("⚠️ UPSERT impossible (pas d'index unique ?). Fallback delete+insert.", errMsg);
      const { error: delErr } = await supabase.from(TABLE).delete().neq("id", 0);
      if (delErr) {
        console.error("❌ Delete error:", delErr.message);
        setSaving(false);
        alert("Erreur pendant la purge : " + delErr.message);
        return;
      }
      const { error: insErr } = await supabase.from(TABLE).insert(rows);
      if (insErr) {
        console.error("❌ Insert error:", insErr.message);
        setSaving(false);
        alert("Erreur d'insertion : " + insErr.message);
        return;
      }
    }

    setSaving(false);
    alert("✅ Planning sauvegardé dans Supabase.");
  };

  return (
    <div className="p-4">
      <h1 style={{ marginBottom: 8 }}>Gestion RH & Comptable</h1>

      {loading ? (
        <p>⏳ Chargement depuis Supabase…</p>
      ) : (
        <>
          <table width="100%" border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th align="left">Jour</th>
                {roles.map((r) => (
                  <th key={r} align="left">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td><strong>{day}</strong></td>
                  {roles.map((role) => {
                    const opts = optionsByRole[role] ?? ["", "Présent", "Absent", "Repos"];
                    const val = planning[day]?.[role] ?? "";
                    return (
                      <td key={`${day}-${role}`}>
                        <select
                          value={val}
                          onChange={(e) => onChangeCell(day, role, e.target.value)}
                          style={{ width: "100%" }}
                        >
                          {opts.map((opt) => (
                            <option key={opt} value={opt}>{opt || "-"}</option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <button onClick={onSave} disabled={saving}>
              {saving ? "Sauvegarde…" : "💾 Sauvegarder dans Supabase"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
