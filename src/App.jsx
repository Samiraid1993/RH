import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, Users, Calculator, Download, Upload, Plus, Edit, Trash2, FileSpreadsheet, Save } from 'lucide-react'
import * as XLSX from 'xlsx'
import './App.css'

// Données initiales des employés basées sur votre demande
const initialEmployees = [
  { id: 1, nom: 'MIGUEL', prenom: 'Miguel', categorie: 'OPH', statut: 'ARRIVÉ', tauxJournalier: 450 },
  { id: 2, nom: 'JONATHAN', prenom: 'Jonathan', categorie: 'Orthos', statut: 'ARRIVÉ', tauxJournalier: 280 },
  { id: 3, nom: 'JONATHAN', prenom: 'Jonathan B', categorie: 'Orthos', statut: 'ARRIVÉ', tauxJournalier: 280 },
  { id: 4, nom: 'DRIS', prenom: 'Dris', categorie: 'Secrétaires', statut: 'ARRIVÉ', tauxJournalier: 120 },
  { id: 5, nom: 'SAMIR', prenom: 'Samir', categorie: 'Secrétaires', statut: 'ARRIVÉ', tauxJournalier: 120 },
  { id: 6, nom: 'SAFIA', prenom: 'Safia', categorie: 'Secrétaires', statut: 'ARRIVÉ', tauxJournalier: 120 },
  { id: 7, nom: 'SAMIR', prenom: 'Samir B', categorie: 'Dentiste', statut: 'ARRIVÉ', tauxJournalier: 400 },
  { id: 8, nom: 'MARTIN', prenom: 'Dr Martin', categorie: 'Dentiste', statut: 'ARRIVÉ', tauxJournalier: 420 },
  { id: 9, nom: 'JONATHAN', prenom: 'Jonathan C', categorie: 'Ass. Dentaire', statut: 'ARRIVÉ', tauxJournalier: 150 },
  { id: 10, nom: 'MARIE', prenom: 'Marie', categorie: 'Ass. Dentaire', statut: 'ARRIVÉ', tauxJournalier: 150 }
]

// Nouvelles catégories avec colonnes séparées
const categories = [
  'OPH', 'Orthos', 
  'Secrétaire 1', 'Secrétaire 2', 'Secrétaire 3',
  'Dentiste 1', 'Dentiste 2',
  'Ass. Dentaire 1', 'Ass. Dentaire 2'
]

const mois = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

function App() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [selectedMonth, setSelectedMonth] = useState(8) // Septembre (index 8)
  const [selectedYear, setSelectedYear] = useState(2025)
  const [planning, setPlanning] = useState({})
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    nom: '',
    prenom: '',
    categorie: 'Secrétaires',
    statut: 'ARRIVÉ',
    tauxJournalier: 120
  })

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedEmployees = localStorage.getItem('rh-employees')
    const savedPlanning = localStorage.getItem('rh-planning')
    
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    }
    if (savedPlanning) {
      setPlanning(JSON.parse(savedPlanning))
    }
  }, [])

  // Sauvegarder automatiquement les données
  useEffect(() => {
    localStorage.setItem('rh-employees', JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem('rh-planning', JSON.stringify(planning))
  }, [planning])

  // Obtenir le nombre de jours dans le mois
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Obtenir le nom du jour
  const getDayName = (day, month, year) => {
    const date = new Date(year, month, day)
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    return days[date.getDay()]
  }

  // Assigner un employé à un jour
  const assignEmployee = (day, category, employeeId) => {
    const key = `${selectedYear}-${selectedMonth}-${day}`
    setPlanning(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [category]: employeeId
      }
    }))
  }

  // Calculer le coût total d'une journée
  const getDayCost = (day) => {
    const key = `${selectedYear}-${selectedMonth}-${day}`
    const dayPlanning = planning[key] || {}
    let total = 0
    
    Object.values(dayPlanning).forEach(employeeId => {
      const employee = employees.find(e => e.id === employeeId)
      if (employee) {
        total += employee.tauxJournalier
      }
    })
    
    return total
  }

  // Calculer le coût total du mois
  const getMonthCost = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    let total = 0
    
    for (let day = 1; day <= daysInMonth; day++) {
      total += getDayCost(day)
    }
    
    return total
  }

  // Obtenir les employés pour une catégorie
  const getEmployeesForCategory = (category) => {
    const baseCategory = category.replace(/\s\d+$/, '') // Enlever le numéro (ex: "Secrétaire 1" -> "Secrétaire")
    const categoryMap = {
      'OPH': 'OPH',
      'Orthos': 'Orthos',
      'Secrétaire': 'Secrétaires',
      'Dentiste': 'Dentiste',
      'Ass. Dentaire': 'Ass. Dentaire'
    }
    
    const targetCategory = categoryMap[baseCategory] || baseCategory
    return employees.filter(emp => emp.categorie === targetCategory)
  }

  // Ajouter un nouvel employé
  const addEmployee = () => {
    if (newEmployee.nom && newEmployee.prenom) {
      const id = Math.max(...employees.map(e => e.id)) + 1
      setEmployees([...employees, { ...newEmployee, id }])
      setNewEmployee({
        nom: '',
        prenom: '',
        categorie: 'Secrétaires',
        statut: 'ARRIVÉ',
        tauxJournalier: 120
      })
      setShowAddEmployee(false)
    }
  }

  // Modifier un employé
  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, ...updatedEmployee } : emp
    ))
    setEditingEmployee(null)
  }

  // Supprimer un employé
  const deleteEmployee = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      setEmployees(employees.filter(emp => emp.id !== id))
      // Nettoyer le planning
      const newPlanning = { ...planning }
      Object.keys(newPlanning).forEach(key => {
        Object.keys(newPlanning[key]).forEach(category => {
          if (newPlanning[key][category] === id) {
            delete newPlanning[key][category]
          }
        })
      })
      setPlanning(newPlanning)
    }
  }

  // Export Excel du planning
  const exportPlanningToExcel = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const data = []
    
    // En-têtes
    const headers = ['Jour', 'Date', 'Jour de la semaine', ...categories, 'Coût Total']
    data.push(headers)
    
    // Données pour chaque jour
    for (let day = 1; day <= daysInMonth; day++) {
      const dayName = getDayName(day, selectedMonth, selectedYear)
      const key = `${selectedYear}-${selectedMonth}-${day}`
      const dayPlanning = planning[key] || {}
      const dayCost = getDayCost(day)
      
      const row = [
        day,
        `${day}/${selectedMonth + 1}/${selectedYear}`,
        dayName
      ]
      
      // Ajouter les employés assignés pour chaque catégorie
      categories.forEach(category => {
        const employeeId = dayPlanning[category]
        const employee = employees.find(e => e.id === employeeId)
        row.push(employee ? `${employee.prenom} ${employee.nom} (${employee.tauxJournalier}€)` : '')
      })
      
      row.push(`${dayCost}€`)
      data.push(row)
    }
    
    // Ajouter une ligne de total
    const totalRow = ['', '', 'TOTAL MENSUEL', ...categories.map(() => ''), `${getMonthCost()}€`]
    data.push(totalRow)
    
    // Créer le workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(data)
    
    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 8 },  // Jour
      { wch: 12 }, // Date
      { wch: 15 }, // Jour de la semaine
      ...categories.map(() => ({ wch: 25 })), // Catégories
      { wch: 12 }  // Coût Total
    ]
    ws['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(wb, ws, `Planning ${mois[selectedMonth]} ${selectedYear}`)
    XLSX.writeFile(wb, `Planning_${mois[selectedMonth]}_${selectedYear}.xlsx`)
  }

  // Export Excel des employés
  const exportEmployeesToExcel = () => {
    const data = []
    
    // En-têtes
    data.push(['Prénom', 'Nom', 'Catégorie', 'Statut', 'Taux Journalier (€)'])
    
    // Données des employés
    employees.forEach(employee => {
      data.push([
        employee.prenom,
        employee.nom,
        employee.categorie,
        employee.statut,
        employee.tauxJournalier
      ])
    })
    
    // Créer le workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(data)
    
    // Ajuster la largeur des colonnes
    ws['!cols'] = [
      { wch: 15 }, // Prénom
      { wch: 15 }, // Nom
      { wch: 15 }, // Catégorie
      { wch: 10 }, // Statut
      { wch: 18 }  // Taux Journalier
    ]
    
    XLSX.utils.book_append_sheet(wb, ws, 'Liste des Employés')
    XLSX.writeFile(wb, `Employes_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Sauvegarde manuelle (JSON)
  const saveData = () => {
    const data = {
      employees,
      planning,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Sauvegarde_RH_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Importer les données
  const importData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.employees) setEmployees(data.employees)
          if (data.planning) setPlanning(data.planning)
          alert('Données importées avec succès !')
        } catch (error) {
          alert('Erreur lors de l\'importation du fichier')
        }
      }
      reader.readAsText(file)
    }
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Calendar className="text-blue-600" />
            Gestion RH & Planning
          </h1>
          <p className="text-gray-600">Outil de suivi du personnel et gestion comptable</p>
        </header>

        <Tabs defaultValue="planning" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar size={16} />
              Planning
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users size={16} />
              Employés
            </TabsTrigger>
            <TabsTrigger value="comptable" className="flex items-center gap-2">
              <Calculator size={16} />
              Comptable
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-2xl">Planning {mois[selectedMonth]} {selectedYear}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                    >
                      {mois.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                    >
                      {[2024, 2025, 2026].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <Button onClick={exportPlanningToExcel} variant="outline" size="sm" className="bg-green-50 hover:bg-green-100">
                      <FileSpreadsheet size={16} className="mr-2" />
                      Excel Planning
                    </Button>
                    <Button onClick={saveData} variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100">
                      <Save size={16} className="mr-2" />
                      Sauvegarder
                    </Button>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload size={16} className="mr-2" />
                          Importer
                        </span>
                      </Button>
                      <input type="file" accept=".json" onChange={importData} className="hidden" />
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 font-semibold text-left">Jour</th>
                        {categories.map(category => (
                          <th key={category} className="border border-gray-300 p-3 font-semibold text-left min-w-[160px]">
                            {category}
                          </th>
                        ))}
                        <th className="border border-gray-300 p-3 font-semibold text-center">Coût/Jour</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const dayName = getDayName(day, selectedMonth, selectedYear)
                        const isWeekend = dayName === 'Dimanche' || dayName === 'Samedi'
                        const key = `${selectedYear}-${selectedMonth}-${day}`
                        const dayPlanning = planning[key] || {}
                        const dayCost = getDayCost(day)
                        
                        return (
                          <tr key={day} className={isWeekend ? 'bg-red-50' : 'bg-white hover:bg-gray-50'}>
                            <td className="border border-gray-300 p-3 font-medium">
                              <div className="text-center">
                                <div className="text-lg font-bold">{day}</div>
                                <div className="text-xs text-gray-500">{dayName.substring(0, 3)}</div>
                              </div>
                            </td>
                            {categories.map(category => {
                              const assignedEmployeeId = dayPlanning[category]
                              const assignedEmployee = employees.find(e => e.id === assignedEmployeeId)
                              const availableEmployees = getEmployeesForCategory(category)
                              
                              return (
                                <td key={category} className="border border-gray-300 p-2">
                                  <select
                                    value={assignedEmployeeId || ''}
                                    onChange={(e) => assignEmployee(day, category, e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-sm"
                                  >
                                    <option value="">Sélectionner...</option>
                                    {availableEmployees.map(employee => (
                                      <option key={employee.id} value={employee.id}>
                                        {employee.prenom} {employee.nom}
                                      </option>
                                    ))}
                                  </select>
                                  {assignedEmployee && (
                                    <div className="mt-1 text-xs text-green-600 font-medium">
                                      {assignedEmployee.tauxJournalier}€/jour
                                    </div>
                                  )}
                                </td>
                              )
                            })}
                            <td className="border border-gray-300 p-3 text-center">
                              <Badge variant={dayCost > 0 ? 'default' : 'secondary'} className="font-bold">
                                {dayCost}€
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="text-xl font-bold text-blue-900">
                    💰 Coût total du mois : {getMonthCost().toLocaleString()}€
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">Gestion des Employés</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={exportEmployeesToExcel} variant="outline" className="bg-green-50 hover:bg-green-100">
                      <FileSpreadsheet size={16} className="mr-2" />
                      Excel Employés
                    </Button>
                    <Button onClick={() => setShowAddEmployee(true)} className="flex items-center gap-2">
                      <Plus size={16} />
                      Ajouter un employé
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showAddEmployee && (
                  <Card className="mb-6 p-4 border-2 border-blue-200 bg-blue-50">
                    <h3 className="font-bold text-lg mb-4">Nouvel Employé</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Prénom</label>
                        <input
                          type="text"
                          value={newEmployee.prenom}
                          onChange={(e) => setNewEmployee({...newEmployee, prenom: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Prénom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nom</label>
                        <input
                          type="text"
                          value={newEmployee.nom}
                          onChange={(e) => setNewEmployee({...newEmployee, nom: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Nom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Catégorie</label>
                        <select
                          value={newEmployee.categorie}
                          onChange={(e) => setNewEmployee({...newEmployee, categorie: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="OPH">OPH</option>
                          <option value="Orthos">Orthos</option>
                          <option value="Secrétaires">Secrétaires</option>
                          <option value="Dentiste">Dentiste</option>
                          <option value="Ass. Dentaire">Ass. Dentaire</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Taux Journalier (€)</label>
                        <input
                          type="number"
                          value={newEmployee.tauxJournalier}
                          onChange={(e) => setNewEmployee({...newEmployee, tauxJournalier: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="120"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={addEmployee} className="bg-green-600 hover:bg-green-700">
                        Ajouter
                      </Button>
                      <Button onClick={() => setShowAddEmployee(false)} variant="outline">
                        Annuler
                      </Button>
                    </div>
                  </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {employees.map(employee => (
                    <Card key={employee.id} className="p-4 border-2 hover:shadow-lg transition-shadow">
                      {editingEmployee === employee.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={employee.prenom}
                            onChange={(e) => setEmployees(employees.map(emp => 
                              emp.id === employee.id ? {...emp, prenom: e.target.value} : emp
                            ))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={employee.nom}
                            onChange={(e) => setEmployees(employees.map(emp => 
                              emp.id === employee.id ? {...emp, nom: e.target.value} : emp
                            ))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <select
                            value={employee.categorie}
                            onChange={(e) => setEmployees(employees.map(emp => 
                              emp.id === employee.id ? {...emp, categorie: e.target.value} : emp
                            ))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="OPH">OPH</option>
                            <option value="Orthos">Orthos</option>
                            <option value="Secrétaires">Secrétaires</option>
                            <option value="Dentiste">Dentiste</option>
                            <option value="Ass. Dentaire">Ass. Dentaire</option>
                          </select>
                          <input
                            type="number"
                            value={employee.tauxJournalier}
                            onChange={(e) => setEmployees(employees.map(emp => 
                              emp.id === employee.id ? {...emp, tauxJournalier: parseInt(e.target.value)} : emp
                            ))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => setEditingEmployee(null)} size="sm" className="bg-green-600 hover:bg-green-700">
                              Sauver
                            </Button>
                            <Button onClick={() => setEditingEmployee(null)} variant="outline" size="sm">
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-900">
                              {employee.prenom} {employee.nom}
                            </h3>
                            <div className="flex gap-1">
                              <Button 
                                onClick={() => setEditingEmployee(employee.id)} 
                                size="sm" 
                                variant="outline"
                                className="p-1 h-8 w-8"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                onClick={() => deleteEmployee(employee.id)} 
                                size="sm" 
                                variant="outline"
                                className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                          <Badge variant={employee.statut === 'ARRIVÉ' ? 'default' : 'secondary'}>
                            {employee.statut}
                          </Badge>
                          <p className="text-sm text-gray-600 font-medium">{employee.categorie}</p>
                          <div className="text-xl font-bold text-green-600">
                            {employee.tauxJournalier}€/jour
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comptable" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Analyse Comptable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="p-4 border-2">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Taux Journaliers par Catégorie</h3>
                    <div className="space-y-3">
                      {['OPH', 'Orthos', 'Secrétaires', 'Dentiste', 'Ass. Dentaire'].map(category => {
                        const categoryEmployees = employees.filter(emp => emp.categorie === category)
                        const avgRate = categoryEmployees.length > 0 
                          ? categoryEmployees.reduce((sum, emp) => sum + emp.tauxJournalier, 0) / categoryEmployees.length
                          : 0
                        
                        return (
                          <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                            <span className="font-medium text-gray-900">{category} ({categoryEmployees.length})</span>
                            <span className="text-green-600 font-bold text-lg">{Math.round(avgRate)}€/jour</span>
                          </div>
                        )
                      })}
                    </div>
                  </Card>

                  <Card className="p-4 border-2">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Résumé Mensuel</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border">
                        <span className="font-medium">Mois sélectionné</span>
                        <span className="font-bold text-blue-900">{mois[selectedMonth]} {selectedYear}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border">
                        <span className="font-medium">Coût total</span>
                        <span className="text-green-600 font-bold text-xl">
                          {getMonthCost().toLocaleString()}€
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                        <span className="font-medium">Coût moyen/jour</span>
                        <span className="font-bold text-gray-900 text-lg">
                          {Math.round(getMonthCost() / daysInMonth)}€
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                        <span className="font-medium">Nombre d'employés</span>
                        <span className="font-bold text-gray-900 text-lg">{employees.length}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
