import React, { useState, useEffect } from 'react';
import { Calendar, Users, Calculator, Download, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

const HRManagementTool = () => {
  const [activeTab, setActiveTab] = useState('planning');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'NAWEL', role: 'OPH', hourlyRate: 25 },
    { id: 2, name: 'BASMA', role: 'OPH', hourlyRate: 23 },
    { id: 3, name: 'INES', role: 'Orthos', hourlyRate: 28 },
    { id: 4, name: 'JOVANTHA', role: 'Secrétaire', hourlyRate: 18 },
    { id: 5, name: 'CAMELIA', role: 'Secrétaire', hourlyRate: 18 },
    { id: 6, name: 'AMINA', role: 'Secrétaire', hourlyRate: 18 },
    { id: 7, name: 'ECOLE', role: 'Secrétaire', hourlyRate: 15 },
    { id: 8, name: 'ANDREI', role: 'Dentiste', hourlyRate: 85 },
    { id: 9, name: 'OLGA', role: 'Assistante Dentaire', hourlyRate: 22 },
    { id: 10, name: 'MANUEL', role: 'Assistante Dentaire', hourlyRate: 22 },
    { id: 11, name: 'OLESEA', role: 'Assistante Dentaire', hourlyRate: 21 },
    { id: 12, name: 'FLORIAN', role: 'OPH', hourlyRate: 26 },
    { id: 13, name: 'KARIMA/AUDE', role: 'Orthos', hourlyRate: 29 },
    { id: 14, name: 'KAMAL', role: 'OPH', hourlyRate: 24 },
    { id: 15, name: 'SAMIA', role: 'Orthos', hourlyRate: 27 }
  ]);

  const [schedule, setSchedule] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const roles = ['OPH', 'Orthos', 'Secrétaire', 'Dentiste', 'Assistante Dentaire'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    generateSchedule();
  }, [selectedMonth, selectedYear]);

  const generateSchedule = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const scheduleData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (adjustedFirstDay + day - 1) % 7;
      scheduleData.push({
        day,
        dayName: days[dayOfWeek],
        assignments: {}
      });
    }
    setSchedule(scheduleData);
  };

  const updateAssignment = (day, role, employeeId, hours = 8) => {
    setSchedule(prev => prev.map(scheduleDay => {
      if (scheduleDay.day === day) {
        return {
          ...scheduleDay,
          assignments: {
            ...scheduleDay.assignments,
            [role]: employeeId ? { employeeId, hours } : null
          }
        };
      }
      return scheduleDay;
    }));
  };

  const calculateDailySalary = (employeeId, hours = 8) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.hourlyRate * hours : 0;
  };

  // === Sauvegarde vers Google Sheets ===
  const saveToGoogleSheets = async () => {
    const API_KEY = "AIzaSyAE0-wIF_9PMImV86ZX2aullehrYmO71bY"; // <-- Remplace ici
    const SHEET_ID = "1fnpWA_P1uUE0SbhiIfwj1hmlraZBFMIrv5MxSX0Qzno"; // <-- Remplace ici
    const RANGE = "Feuille1!A:D";

    const rows = schedule.flatMap(day => {
      return Object.entries(day.assignments).map(([role, assignment]) => {
        if (assignment?.employeeId) {
          const employee = employees.find(e => e.id === assignment.employeeId);
          return [
            `${day.dayName} ${day.day}`, // Date
            employee.name,              // Employé
            role,                       // Rôle
            calculateDailySalary(employee.id, assignment.hours).toFixed(2) + "€" // Salaire/Jour
          ];
        }
        return null;
      }).filter(Boolean);
    });

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: rows })
        }
      );

      if (response.ok) {
        alert("✅ Données sauvegardées dans Google Sheets !");
      } else {
        const error = await response.json();
        console.error(error);
        alert("❌ Erreur lors de la sauvegarde (voir console)");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Impossible de contacter Google Sheets");
    }
  };

  const renderPlanning = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {months.map((month, idx) => (
              <option key={idx} value={idx}>{month}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveToGoogleSheets}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sauvegarder sur Google Sheets
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-semibold">Jour</th>
                {roles.map(role => (
                  <th key={role} className="p-3 text-center">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((day, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 font-medium">{day.dayName} {day.day}</td>
                  {roles.map(role => (
                    <td key={role} className="p-2">
                      <select
                        value={day.assignments[role]?.employeeId || ''}
                        onChange={(e) => updateAssignment(day.day, role, parseInt(e.target.value) || null)}
                        className="w-full border rounded px-2 py-1 text-xs"
                      >
                        <option value="">-</option>
                        {employees.filter(emp => emp.role === role).map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">Gestion RH & Comptable</h1>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('planning')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'planning' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Calendar size={20} /> Planning
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'employees' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Users size={20} /> Employés
              </button>
              <button
                onClick={() => setActiveTab('payroll')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'payroll' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Calculator size={20} /> Paie
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'planning' && renderPlanning()}
      </div>
    </div>
  );
};

export default HRManagementTool;
