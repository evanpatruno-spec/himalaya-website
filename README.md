# 🏔️ Immobilier Himalaya Real Estate Corp — Portail Web Officiel 2.0

Reproduction structurée et modernisation haute performance du site officiel **[himalayacorp.com](https://www.himalayacorp.com/)**, connectée à l'écosystème interne **Himalaya Prospection & CRM IA**.

---

## ✨ Fonctionnalités Principales

1. **Architecture Officielle Complète (`himalayacorp.com`)** :
   - **Accueil (`#homeVideo`)** : Vidéo officielle en arrière-plan, moteur de recherche multicritères (Catégorie, Vente/Location, Région, Pays, Mot-clé/MLS), 4 spécialités majeures (*Commercial & Industriel*, *Auberge/Camping/Pourvoirie*, *Résidentiel Prestige*, *International*).
   - **Catalogue des Propriétés (`/fr/proprietes.html`)** : Synchronisé avec les mandats réels actifs des courtiers d'Himalaya (`himalayaLiveDeals.json`), galeries photos Centris/MLS, fiches techniques complètes et filtres dynamiques.
   - **Équipe & Courtiers (`/fr/courtiers-immobiliers.html`)** : Les 16 courtiers et directeurs officiels (Roger Rhéaume, Geniev Mondoux, Mike Ainajian, Evan Patruno, etc.) avec filtrage direct de leurs mandats respectifs.
   - **Agences (`/fr/agences-immobilieres.html`)** : Siège social de Montréal, Saint-Sauveur (Laurentides), Québec, Paris (Salon de la Franchise) et Las Terrenas (République Dominicaine).
   - **Événements, Actualités & Balados** : Salon de la Franchise à Paris 2027, Cocktail CQF, ICSC Las Vegas, Forum APCIQ et capsules Balados.
   - **Multilingue (5 langues)** : Français, English, Español, العربى, 中国.

2. **Pont Exclusif avec `Himalaya Prospection & CRM`** :
   - **Portail NDA & Salle de Données Acheteur** : Signature électronique d'entente de confidentialité et qualification de la mise de fonds directement depuis chaque fiche propriété.
   - **Zone Exclusive - Équipe** : Passerelle vers le logiciel interne de prospection et de gestion des `1 115+ actifs récréotouristiques`.

---

## 🚀 Démarrage en Local (1 Clic)

Double-cliquez sur :
```cmd
LANCER_SITE_HIMALAYA.bat
```
Le site s'ouvre automatiquement sur `http://localhost:5178`.

---

## 🌐 Déploiement GitHub & Vercel

Ce projet est préconfiguré avec `vercel.json` et `.gitignore` pour un déploiement instantané sur **Vercel** :
- **Dépôt GitHub dédié** : `https://github.com/evanpatruno-spec/himalaya-website.git`
- **Framework Preset Vercel** : `Vite`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
