# SPARK.CO — Guide de déploiement (Multi-page)

Ce guide explique comment déployer et personnaliser la nouvelle plateforme multi-pages de SPARK.CO.

## Architecture
- **Frontend** : HTML/CSS/JS (Vanilla) situé dans `/home/team/shared/frontend/`.
- **Backend** : API Express située dans `/home/team/shared/api/`.
- **Base de données** : SQLite (via Turso).

## Déploiement (2 min)

### 1. Backend
Le backend doit être déployé sur un service supportant Node.js (Vercel, Render, Railway).
Assurez-vous de configurer les variables d'environnement nécessaires (`DATABASE_URL`, `JWT_SECRET`).

### 2. Frontend
Le frontend peut être hébergé sur n'importe quel service de fichiers statiques (Vercel, GitHub Pages, Netlify).
L'URL de l'API est configurée dans `app.js` via la constante `API_BASE_URL`. Par défaut, elle pointe vers `http://localhost:3001/api`.

## Personnalisation

### Modifier les textes
Tous les textes sont directement dans les fichiers HTML (`index.html`, `tarifs.html`, etc.). Recherchez les balises `h1`, `p`, et `li` pour les mettre à jour.

### Modifier les couleurs
Les couleurs sont gérées par des variables CSS dans `style.css` sous `:root`.
- `--c-charbon` : Fond principal sombre.
- `--c-etincelle` : Couleur d'accent orange.
- `--c-flash` : Couleur d'accent jaune (utilisée pour les badges).

### Lier votre formulaire Tally
Le bouton "Je lance mon site →" pointe vers `https://tally.so/r/spark`. Remplacez ce lien dans `index.html`, `tarifs.html` et `dashboard.html` par votre propre URL de formulaire.

## Gestion des Commandes
- **Dashboard Client** : Les clients peuvent voir leurs commandes et modifier leur brief après connexion.
- **Panel Admin** : Accessible uniquement aux utilisateurs avec le rôle `admin`. Permet de changer le statut des commandes (Pending -> Live).

## Renouvellement Annuel
Le système prévoit un renouvellement à 99€/an. Cette logique doit être gérée côté backend ou via une automatisation Stripe (liens de paiement).

---
© 2025 SPARK.CO — Propulsé par l'efficacité.
