# 🚀 Guide de Déploiement - Outil RH Planning

## 📋 Votre Application

Félicitations ! Vous avez maintenant un outil RH complet avec :
- ✅ Planning interactif avec 9 colonnes (OPH, Orthos, 3 Secrétaires, 2 Dentistes, 2 Assistantes Dentaires)
- ✅ Gestion complète du personnel (ajout, modification, suppression)
- ✅ Export Excel du planning et des employés
- ✅ Sauvegarde automatique et manuelle
- ✅ Calculs automatiques des coûts

## 🎯 Options de Déploiement

### Option 1 : Vercel (Recommandé - Le plus simple)

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter avec GitHub** (utilisez votre compte existant)
3. **Cliquer sur "New Project"**
4. **Importer depuis GitHub :**
   - Créer un nouveau repository sur GitHub
   - Uploader tous les fichiers de ce dossier
   - Sélectionner le repository dans Vercel
5. **Configuration automatique :**
   - Framework Preset : `React`
   - Build Command : `pnpm run build`
   - Output Directory : `dist`
6. **Cliquer sur "Deploy"**

**Résultat :** Lien permanent type `https://votre-planning.vercel.app`

### Option 2 : Netlify (Alternative gratuite)

1. **Aller sur [netlify.com](https://netlify.com)**
2. **Se connecter avec GitHub**
3. **Glisser-déposer le dossier `dist`** directement sur Netlify
4. **Ou connecter un repository GitHub** (même processus que Vercel)

**Résultat :** Lien permanent type `https://votre-planning.netlify.app`

### Option 3 : GitHub Pages (Gratuit)

1. **Créer un repository sur GitHub**
2. **Uploader tous les fichiers**
3. **Aller dans Settings > Pages**
4. **Sélectionner "GitHub Actions"**
5. **Utiliser le workflow fourni dans `.github/workflows/deploy.yml`**

## 📁 Structure des Fichiers

```
planning-rh-deploy/
├── src/                    # Code source React
├── dist/                   # Version construite (prête pour déploiement)
├── package.json           # Dépendances
├── vite.config.js         # Configuration
├── .github/workflows/     # Workflow GitHub Actions
└── GUIDE_DEPLOIEMENT.md   # Ce guide
```

## 🔧 Déploiement Manuel (Hébergeur Web Classique)

Si vous avez un hébergeur web classique (OVH, 1&1, etc.) :

1. **Utiliser le dossier `dist/`**
2. **Uploader tout le contenu** via FTP
3. **Pointer votre domaine** vers le dossier uploadé

## 🆘 En Cas de Problème

### Erreur de Build
```bash
cd planning-rh-deploy
npm install
npm run build
```

### Problème d'Export Excel
- Vérifiez que la bibliothèque `xlsx` est installée
- Les exports se téléchargent automatiquement

### Données Perdues
- Les données sont sauvegardées dans le navigateur (localStorage)
- Utilisez "Sauvegarder" pour créer des backups JSON
- Utilisez "Excel Planning" et "Excel Employés" pour les exports

## 📞 Support

- **GitHub Issues :** Créez un issue sur votre repository
- **Documentation React :** [reactjs.org](https://reactjs.org)
- **Documentation Vite :** [vitejs.dev](https://vitejs.dev)

## 🔐 Sécurité

- ✅ Aucune donnée n'est envoyée sur internet
- ✅ Tout fonctionne dans votre navigateur
- ✅ Vous contrôlez vos données à 100%
- ✅ Sauvegarde locale automatique

---

**Créé avec ❤️ par Manus AI**
**Version 1.0 - Septembre 2025**
