# 🗑️ Système de Suppression d'Artistes

Ce document explique le nouveau système de suppression intelligente d'artistes avec fonctions SQL Supabase.

## 🎯 Fonctions disponibles

### 1. **Suppression sécurisée (recommandée)**
```typescript
const { deleteArtist } = useSupabaseArtist()
await deleteArtist(artistId)
```
- ✅ Analyse le contenu avant suppression
- ✅ Préserve les collaborations avec d'autres artistes
- ✅ Rapport détaillé de ce qui est supprimé
- ✅ Transaction atomique

### 2. **Suppression rapide**
```typescript
const { deleteArtistSimple } = useSupabaseArtist()
await deleteArtistSimple(artistId)
```
- ⚡ Plus rapide
- ⚡ Supprime seulement les relations
- ⚡ Idéal pour le nettoyage/administration

### 3. **Suppression avec mode sélectionnable**
```typescript
const { deleteArtistWithMode } = useSupabaseArtist()
await deleteArtistWithMode(artistId, 'safe') // ou 'simple'
```

### 4. **Analyse d'impact**
```typescript
const { getArtistDeletionImpact } = useSupabaseArtist()
const impact = await getArtistDeletionImpact(artistId)
// Retourne : { exclusiveReleases, exclusiveMusics, exclusiveNews }
```

## 🧩 Composants UI

### Modal de confirmation standard
```vue
<ModalConfirmDeleteArtist
  :is-open="showModal"
  :artist-id="artistId"
  :artist-name="artistName"
  @close="closeModal"
  @confirm="onDeleted"
/>
```

### Modal avancé avec choix du mode
```vue
<ModalAdvancedDeleteArtist
  :is-open="showModal"
  :artist-id="artistId"
  :artist-name="artistName"
  @close="closeModal"
  @confirm="onDeleted"
/>
```

## 🔍 Exemple d'utilisation

```typescript
// Dans votre composant
const { deleteArtist, getArtistDeletionImpact } = useSupabaseArtist()

// Analyser avant de supprimer
const impact = await getArtistDeletionImpact('artist-uuid')
console.log(`${impact.exclusiveMusics.length} musiques seront supprimées`)

// Supprimer avec confirmation
const result = await deleteArtist('artist-uuid')
if (result.success) {
  console.log(result.message)
  // L'artiste est supprimé, mettre à jour l'UI
}
```

## 🛡️ Sécurité

### Contenu préservé automatiquement
- ✅ Musiques avec plusieurs artistes → **Conservées**
- ✅ Albums avec plusieurs artistes → **Conservés**
- ✅ News concernant plusieurs artistes → **Conservées**

### Contenu supprimé
- ❌ Musiques exclusives à l'artiste → **Supprimées**
- ❌ Albums exclusifs à l'artiste → **Supprimés**
- ❌ News exclusives à l'artiste → **Supprimées**
- ❌ Liens sociaux et plateformes → **Supprimés**
- ❌ Relations entre artistes → **Supprimées**

## 🔧 Fonctions SQL Supabase

Les fonctions suivantes sont disponibles directement en SQL :

```sql
-- Analyser l'impact
SELECT analyze_artist_deletion_impact('artist-uuid');

-- Suppression sécurisée
SELECT delete_artist_safely('artist-uuid');

-- Suppression rapide
SELECT delete_artist_simple('artist-uuid');
```

## 📊 Retour des fonctions

### `deleteArtist` (sécurisée)
```typescript
{
  success: true,
  message: "Artiste \"Taylor Swift\" supprimé avec succès",
  details: {
    artist_name: "Taylor Swift",
    exclusive_releases_deleted: 5,
    exclusive_musics_deleted: 12,
    exclusive_news_deleted: 3,
    impact_analysis: { ... }
  }
}
```

### `deleteArtistSimple` (rapide)
```typescript
{
  success: true,
  message: "Artiste \"Taylor Swift\" supprimé avec succès",
  artist_name: "Taylor Swift"
}
```

## 🚨 Gestion d'erreurs

Les fonctions gèrent automatiquement :
- ✅ Transactions atomiques (tout ou rien)
- ✅ Messages d'erreur explicites
- ✅ Toasts de notification
- ✅ Logging des erreurs

## 🎪 Cas d'usage recommandés

| Situation | Fonction recommandée | Raison |
|-----------|---------------------|--------|
| Interface utilisateur | `deleteArtist` | Sécurité maximale |
| Scripts d'administration | `deleteArtistSimple` | Performance |
| API publique | `deleteArtist` | Sécurité |
| Nettoyage de données test | `deleteArtistSimple` | Rapidité |
| Suppression en masse | `deleteArtistSimple` | Performance |