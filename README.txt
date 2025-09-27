# Outil RH (React + Vite)

Ce dossier contient un projet **Vite + React** prêt à déployer, avec votre composant `HRManagementTool.jsx`.

## Lancer en local (facultatif)
1. Installez Node.js LTS (si ce n'est pas déjà fait).
2. Dans un terminal ouvert dans ce dossier :
   ```bash
   npm install
   npm run dev
   ```
3. Ouvrez l'URL affichée (en général http://localhost:5173).

## Déployer sur Vercel (sans installer Node en local)
1. Créez un dépôt GitHub vide (nom: `hr-management` par exemple).
2. Uploadez tout le contenu de ce dossier dans le dépôt GitHub (via "Add file" > "Upload files").
3. Sur vercel.com : "Add New..." > "Project" > Importez votre dépôt GitHub.
4. Laissez la détection Vite par défaut (Build: `vite build`, Output: `dist`), cliquez **Deploy**.
5. Récupérez l'URL publique.

## Déployer sur OVH (hébergement mutualisé)
1. En local dans ce dossier :
   ```bash
   npm install
   npm run build
   ```
2. Le dossier `dist/` sera généré. Transférez **le contenu de `dist/`** via FTP dans `www/` (ou un sous-dossier) de votre hébergement OVH.
3. Accédez à l'URL de votre domaine pour voir l'application.

---

Si vous souhaitez **ajouter Tailwind** pour un rendu identique aux classes utilitaires, je peux fournir une version déjà configurée.
