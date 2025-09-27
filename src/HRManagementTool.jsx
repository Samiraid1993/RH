import React, { useState, useEffect } from 'react';
import { Calendar, Users, Calculator, FileText, Download, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

const HRManagementTool = () => {
  const [activeTab, setActiveTab] = useState('planning');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'NAWEL', role: 'OPH', hourlyRate: 25, phone: '0123456789', email: 'nawel@cabinet.fr' },
    { id: 2, name: 'BASMA', role: 'OPH', hourlyRate: 23, phone: '0123456790', email: 'basma@cabinet.fr' },
    { id: 3, name: 'INES', role: 'Orthos', hourlyRate: 28, phone: '0123456791', email: 'ines@cabinet.fr' },
    { id: 4, name: 'JOVANTHA', role: 'Secrétaire', hourlyRate: 18, phone: '0123456792', email: 'jovantha@cabinet.fr' },
    { id: 5, name: 'CAMELIA', role: 'Secrétaire', hourlyRate: 18, phone: '0123456793', email: 'camelia@cabinet.fr' },
    { id: 6, name: 'AMINA', role: 'Secrétaire', hourlyRate: 18, phone: '0123456794', email: 'amina@cabinet.fr' },
    { id: 7, name: 'ECOLE', role: 'Secrétaire', hourlyRate: 15, phone: '0123456795', email: 'ecole@cabinet.fr' },
    { id: 8, name: 'ANDREI', role: 'Dentiste', hourlyRate: 85, phone: '0123456796', email: 'andrei@cabinet.fr' },
    { id: 9, name: 'OLGA', role: 'Assistante Dentaire', hourlyRate: 22, phone: '0123456797', email: 'olga@cabinet.fr' },
    { id: 10, name: 'MANUEL', role: 'Assistante Dentaire', hourlyRate: 22, phone: '0123456798', email: 'manuel@cabinet.fr' },
    { id: 11, name: 'OLESEA', role: 'Assistante Dentaire', hourlyRate: 21, phone: '0123456799', email: 'olesea@cabinet.fr' },
    { id: 12, name: 'FLORIAN', role: 'OPH', hourlyRate: 26, phone: '0123456800', email: 'florian@cabinet.fr' },
    { id: 13, name: 'KARIMA/AUDE', role: 'Orthos', hourlyRate: 29, phone: '0123456801', email: 'karima@cabinet.fr' },
    { id: 14, name: 'KAMAL', role: 'OPH', hourlyRate: 24, phone: '0123456802', email: 'kamal@cabinet.fr' },
    { id: 15, name: 'SAMIA', role: 'Orthos', hourlyRate: 27, phone: '0123456803', email: 'samia@cabinet.fr' }
  ]);

  const [schedule, setSchedule] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', hourlyRate: 0, phone: '', email: '' });
  const [showAddForm, setShowAddForm] = useState(false);

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

  const calculateMonthlyHours = (employeeId) => {
    return schedule.reduce((total, day) => {
      const assignments = Object.values(day.assignments || {});
      const employeeAssignments = assignments.filter(a => a && a.employeeId === employeeId);
      return total + employeeAssignments.reduce((dayTotal, assignment) => dayTotal + assignment.hours, 0);
    }, 0);
  };

  const calculateMonthlySalary = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    const hours = calculateMonthlyHours(employeeId);
    return hours * employee.hourlyRate;
  };

  const generatePayrollReport = () => {
    const report = employees.map(employee => ({
      ...employee,
      monthlyHours: calculateMonthlyHours(employee.id),
      grossSalary: calculateMonthlySalary(employee.id),
      socialCharges: calculateMonthlySalary(employee.id) * 0.22,
      netSalary: calculateMonthlySalary(employee.id) * 0.78
    })).filter(emp => emp.monthlyHours > 0);

    const csvContent = [
      ['Nom', 'Fonction', 'Heures', 'Taux Horaire', 'Salaire Brut', 'Charges Sociales', 'Salaire Net'],
      ...report.map(emp => [
        emp.name,
        emp.role,
        emp.monthlyHours,
        emp.hourlyRate + '€',
        emp.grossSalary.toFixed(2) + '€',
        emp.socialCharges.toFixed(2) + '€',
        emp.netSalary.toFixed(2) + '€'
      ])
    ].map(row => row.join(';')).join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fiche_paie_${months[selectedMonth]}_${selectedYear}.csv`;
    link.click();
  };

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.hourlyRate > 0) {
      setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
      setNewEmployee({ name: '', role: '', hourlyRate: 0, phone: '', email: '' });
      setShowAddForm(false);
    }
  };

  const updateEmployee = () => {
    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id ? editingEmployee : emp
    ));
    setEditingEmployee(null);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
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
        <button
          onClick={generatePayrollReport}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={16} />
          Export Paie
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-semibold">Jour</th>
                <th className="p-3 text-center bg-blue-100">OPH</th>
                <th className="p-3 text-center bg-green-100">Orthos</th>
                <th className="p-3 text-center bg-purple-100">Secrétaires</th>
                <th className="p-3 text-center bg-red-100">Dentiste</th>
                <th className="p-3 text-center bg-orange-100">Ass. Dentaire</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((day, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 font-medium">
                    {day.dayName} {day.day}
                  </td>
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

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Employés</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Nouvel Employé</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <select
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
              className="border rounded px-3 py-2"
            >
              <option value="">Sélectionner un poste</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Taux horaire (€)"
              value={newEmployee.hourlyRate}
              onChange={(e) => setNewEmployee({...newEmployee, hourlyRate: parseFloat(e.target.value) || 0})}
              className="border rounded px-3 py-2"
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
              className="border rounded px-3 py-2"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={addEmployee} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
              <Save size={16} />
              Sauvegarder
            </button>
            <button onClick={() => setShowAddForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2">
              <X size={16} />
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 text-left">Poste</th>
              <th className="p-4 text-left">Taux/h</th>
              <th className="p-4 text-left">Téléphone</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={emp.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {editingEmployee?.id === emp.id ? (
                  <>
                    <td className="p-4">
                      <input
                        value={editingEmployee.name}
                        onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-4">
                      <select
                        value={editingEmployee.role}
                        onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
                        className="border rounded px-2 py-1 w-full"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={editingEmployee.hourlyRate}
                        onChange={(e) => setEditingEmployee({...editingEmployee, hourlyRate: parseFloat(e.target.value)})}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        value={editingEmployee.phone}
                        onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        value={editingEmployee.email}
                        onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <button onClick={updateEmployee} className="text-green-600 hover:bg-green-100 p-1 rounded">
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditingEmployee(null)} className="text-gray-600 hover:bg-gray-100 p-1 rounded">
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium">{emp.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        emp.role === 'OPH' ? 'bg-blue-100 text-blue-800' :
                        emp.role === 'Orthos' ? 'bg-green-100 text-green-800' :
                        emp.role === 'Secrétaire' ? 'bg-purple-100 text-purple-800' :
                        emp.role === 'Dentiste' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-4">{emp.hourlyRate}€</td>
                    <td className="p-4">{emp.phone}</td>
                    <td className="p-4">{emp.email}</td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => setEditingEmployee({...emp})}
                          className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteEmployee(emp.id)}
                          className="text-red-600 hover:bg-red-100 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayroll = () => {
    const payrollData = employees.map(employee => ({
      ...employee,
      monthlyHours: calculateMonthlyHours(employee.id),
      grossSalary: calculateMonthlySalary(employee.id),
      socialCharges: calculateMonthlySalary(employee.id) * 0.22,
      netSalary: calculateMonthlySalary(employee.id) * 0.78
    })).filter(emp => emp.monthlyHours > 0);

    const totalGross = payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0);
    const totalCharges = payrollData.reduce((sum, emp) => sum + emp.socialCharges, 0);
    const totalNet = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Fiche de Paie - {months[selectedMonth]} {selectedYear}
          </h2>
          <button
            onClick={generatePayrollReport}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          >
            <Download size={16} />
            Exporter CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Employé</th>
                <th className="p-4 text-left">Poste</th>
                <th className="p-4 text-center">Heures</th>
                <th className="p-4 text-center">Taux/h</th>
                <th className="p-4 text-right">Brut</th>
                <th className="p-4 text-right">Charges</th>
                <th className="p-4 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((emp, idx) => (
                <tr key={emp.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-4 font-medium">{emp.name}</td>
                  <td className="p-4">{emp.role}</td>
                  <td className="p-4 text-center">{emp.monthlyHours}h</td>
                  <td className="p-4 text-center">{emp.hourlyRate}€</td>
                  <td className="p-4 text-right font-semibold">{emp.grossSalary.toFixed(2)}€</td>
                  <td className="p-4 text-right text-red-600">{emp.socialCharges.toFixed(2)}€</td>
                  <td className="p-4 text-right font-bold text-green-600">{emp.netSalary.toFixed(2)}€</td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                <td className="p-4" colSpan="4">TOTAL</td>
                <td className="p-4 text-right">{totalGross.toFixed(2)}€</td>
                <td className="p-4 text-right text-red-600">{totalCharges.toFixed(2)}€</td>
                <td className="p-4 text-right text-green-600">{totalNet.toFixed(2)}€</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Masse Salariale Brute</h3>
            <p className="text-3xl font-bold text-blue-900">{totalGross.toFixed(2)}€</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800">Charges Sociales</h3>
            <p className="text-3xl font-bold text-red-900">{totalCharges.toFixed(2)}€</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Masse Salariale Nette</h3>
            <p className="text-3xl font-bold text-green-900">{totalNet.toFixed(2)}€</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">Gestion RH & Comptable</h1>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('planning')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === 'planning' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar size={20} />
                Planning
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === 'employees' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users size={20} />
                Employés
              </button>
              <button
                onClick={() => setActiveTab('payroll')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === 'payroll' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calculator size={20} />
                Paie
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'planning' && renderPlanning()}
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'payroll' && renderPayroll()}
      </div>
    </div>
  );
};

export default HRManagementTool;