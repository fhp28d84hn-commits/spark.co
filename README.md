# SPARK.CO — Guide de déploiement

Ce dépôt contient les fichiers sources du site vitrine SPARK.CO. Le site est conçu pour être ultra-performant, sans framework et prêt pour la production.

## 🚀 Déploiement Rapide (Vercel)

1. Connectez-vous à votre compte [Vercel](https://vercel.com).
2. Cliquez sur **Add New > Project**.
3. Importez votre dépôt ou glissez-déposez le dossier contenant les fichiers.
4. Vercel détectera automatiquement qu'il s'agit d'un site statique.
5. Cliquez sur **Deploy**.

Le site est maintenant en ligne !

## 📝 Personnalisation

### Modifier les textes
Tous les textes sont directement modifiables dans le fichier `index.html`. Cherchez les balises `h1`, `h2`, `p` ou les classes `.quote` pour les témoignages.

### Modifier les couleurs
Les couleurs sont définies via des variables CSS au début du fichier `style.css` dans le bloc `:root` :
- `--c-etincelle` : Couleur orange d'accent.
- `--c-charbon` : Couleur de fond sombre.
- `--c-papier` : Couleur de fond claire.

### Lier le formulaire (Tally)
Les boutons d'appel à l'action (CTA) pointent vers `https://tally.so/r/spark`. 
Pour utiliser votre propre formulaire :
1. Créez un formulaire sur [Tally.so](https://tally.so).
2. Copiez l'URL de votre formulaire.
3. Remplacez toutes les occurrences de l'URL Tally dans `index.html`.

## ⚙️ Maintenance & Renouvellement

- **Hébergement & Domaine** : À renouveler chaque année (99€/an conseillé pour le client).
- **Contact** : Pour toute question technique, contactez `contact@spark.co`.
- **Google Analytics** : Pour activer le suivi, remplacez le code de suivi générique (si ajouté) par votre propre ID de mesure dans le `<head>` de `index.html`.
- **Animations** : Les animations utilisent la bibliothèque [GSAP](https://greensock.com/gsap/). Elles sont configurées dans `main.js`.

## 🛠 Contraintes Techniques Respectées
- Zero framework (JS Vanille).
- Mobile-first & Responsive.
- Accessibilité (WCAG AA).
- Performance maximale (chargement quasi-instantané).
