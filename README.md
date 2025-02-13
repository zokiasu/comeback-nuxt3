# Comeback

## Description

**Comeback** est une plateforme de suivis de nouveautés musicale développée avec Nuxt 3. Elle permet aux utilisateurs de découvrir de la musique, suivre les actualités des artistes, et gérer les sorties musicales. Les utilisateurs peuvent ajouter des artistes, des informations sur les comebacks et les actualités, et interagir via des commentaires. La partie tableau de bord est réservée aux administrateurs pour la gestion avancée.

## Stack

VueJS 3 - NuxtJS 3 - Pinia - TailwindCSS - Firebase (Firestore, Realtime Database, Authentification)

## Fonctionnalités

### Pour les Utilisateurs

- **Découverte de musique** : Parcourez et découvrez de nouvelles musiques et artistes.
- **Suivi des actualités des artistes** : Restez informé des derniers comebacks et actualités de vos artistes préférés.
- **Ajout d'artistes et d'informations** : Ajoutez de nouveaux artistes et des informations sur leurs comebacks et actualités.
- **Interaction** : Prochainement, commentez les fiches artistes et les sorties musicales.

### Pour les Administrateurs

- **Tableau de bord** : Gérez les artistes, les actualités et les sorties musicales.
- **Gestion des utilisateurs** : Supervisez les contributions des utilisateurs et modérez les contenus.

### Autres Fonctionnalités

- **Authentification** : Connectez-vous avec Google ou Microsoft.
- **Lecteur YouTube** : Intégrez des vidéos YouTube pour les artistes et les sorties.
- **Recherche Algolia** : Utilisez la recherche Algolia pour trouver rapidement de la musique et des artistes.
- **Notifications Toast** : Recevez des notifications utilisateur via `vue-toastification`.
- **Styling** : Utilisation de Tailwind CSS pour une interface utilisateur moderne et réactive.

## Projet Backend | cb-artist-generator

Le projet **cb-artist-generator** est utilisé pour remplir et mettre à jour la base de données de Comeback. Il s'agit d'un script exécuté quotidiennement via une CRON.

### Fonctionnalités

- **Récupération des informations d'artistes et de sorties musicales** : Utilisation de l'API YouTube Music pour obtenir des données à jour.
- **Mise à jour de la base de données Firebase** : Stocke les informations récupérées dans Firebase.
- **Gestion des actualités** : Mise à jour des actualités des artistes dans la base de données.

### Dépendances principales

- **ytmusic-api** : Récupération des données de YouTube Music.
- **axios** : Requêtes HTTP.
- **firebase-admin** : Interaction avec Firebase.
- **dotenv** : Gestion des variables d'environnement.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
