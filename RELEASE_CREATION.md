# 🎵 Création Manuelle de Releases

Cette fonctionnalité permet de créer des releases manuellement via une interface web intuitive, complétant le système automatique existant.

## 📍 Accès

- **URL** : `/release/create`
- **Accès** : Via le dashboard releases (bouton "Créer une release")
- **Permissions** : Utilisateurs connectés uniquement

## ✨ Fonctionnalités

### 🎯 Création de Release

1. **Informations de base**
   - Nom de la release (requis)
   - Type : Single, EP, Album, Mixtape, Compilation
   - Date de sortie (optionnel)
   - Année (optionnel)

2. **Artiste principal**
   - Recherche d'artiste avec autocomplete
   - Possibilité de créer un nouvel artiste si introuvable
   - Sélection automatique après création

3. **Informations avancées** (optionnelles)
   - ID YouTube Music
   - ID Spotify  
   - Description
   - Statut de vérification

### 🎵 Gestion des Musiques

Après création de la release, deux options sont disponibles :

#### 🔍 Recherche de Musiques Existantes
- Recherche en temps réel avec autocomplete
- Affichage des détails : titre, artistes, durée, type
- Prévention des doublons
- Ajout avec numérotation automatique des pistes

#### ➕ Création de Nouvelles Musiques
- Formulaire complet avec validation
- Champs disponibles :
  - Titre (requis)
  - Type : Track, Instrumental, Remix, Live, Acoustique
  - Durée en secondes
  - Langue (KO par défaut)
  - IDs externes (YouTube Music, Spotify)
  - Lien YouTube
  - Description
  - Marquage MV (Music Video)
  - Statut de vérification

## 🔧 Composants Techniques

### Pages
- `pages/release/create.vue` - Page principale de création

### Composants
- `components/ArtistSearchSelect.vue` - Recherche et sélection d'artiste
- `components/MusicSearchAndAdd.vue` - Recherche et ajout de musiques

### Composables Étendus
- `useSupabaseRelease.createReleaseWithDetails()` - Création avec relations
- `useSupabaseMusic.createMusic()` - Création de musique avec artistes
- `useSupabaseMusic.addMusicToRelease()` - Liaison musique-release
- `useSupabaseMusic.removeMusicFromRelease()` - Suppression de liaison

## 🎨 Interface Utilisateur

### Design System
- Utilisation de Nuxt UI pour la cohérence
- Formulaires avec validation Zod
- Notifications toast pour les retours utilisateur
- Interface responsive (mobile-first)

### UX Features
- **Workflow progressif** : Release → Musiques
- **Recherche intelligente** avec debounce
- **Validation en temps réel**
- **Gestion d'erreurs** avec rollback automatique
- **États de chargement** visuels

## 🔄 Intégration avec l'Existant

### Base de Données
- Utilise les mêmes tables que le système automatique
- Relations cohérentes : `artist_releases`, `music_releases`, `music_artists`
- Respect des contraintes et index existants

### Workflow
1. **Création release** → Relations artistes automatiques
2. **Ajout musiques** → Relations musique-release + musique-artiste
3. **Navigation** → Vers la release créée ou retour dashboard

## 🚀 Cas d'Usage

### Releases Manquées par l'Automatisation
- Releases non détectées par YouTube Music API
- Corrections d'attributions d'artistes incorrectes
- Ajout de releases anciennes ou rares

### Gestion de Contenu
- Pré-création avant sortie officielle
- Ajout de métadonnées spécifiques
- Curation manuelle de contenu

## 🛡️ Sécurité & Validation

### Validation Frontend
- Schémas Zod pour tous les formulaires
- Validation en temps réel des champs
- Prévention des soumissions multiples

### Validation Backend
- Contraintes de base de données respectées
- Gestion des erreurs avec rollback
- Logs détaillés pour debugging

## 📊 Avantages

1. **Complétude** : Couvre les cas non gérés par l'automatisation
2. **Flexibilité** : Permet la curation manuelle
3. **Efficacité** : Interface optimisée pour la rapidité
4. **Cohérence** : Intégration parfaite avec l'existant
5. **Évolutivité** : Architecture extensible

## 🔮 Évolutions Futures

- Import en lot via CSV/JSON
- Templates de releases
- Workflow de validation collaborative
- Intégration avec APIs externes (Spotify, Apple Music)
- Historique des modifications 