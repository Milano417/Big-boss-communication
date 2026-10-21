# Guide de déploiement — BIG BOSS COMMUNICATION

Ce guide met le site en ligne sur **Vercel** à partir du dépôt GitHub `Milano417/Big-boss-communication`.
Durée : environ 15 minutes la première fois, puis quelques secondes à chaque mise à jour.

---

## 0. La règle d'or : la structure du dépôt

Vercel cherche `index.html` **à la racine du dépôt**. Si les fichiers sont rangés dans un sous-dossier, la page d'accueil affiche **404 « The page could not be found »**. C'était la cause de la panne.

Structure attendue à la racine du dépôt GitHub :

```
Big-boss-communication/        ← racine du dépôt
├── index.html                 ← page d'accueil (doit être ici)
├── style.css   app.js   store.js   data.js   catalogue.js
├── admin.html  admin.css  admin.js
├── vercel.json                ← réglages Vercel (en-têtes, adresse /admin)
├── .vercelignore              ← fichiers non publiés
├── robots.txt
├── api/                       ← serveur : catalogue, administration, photos
│   ├── _lib.js  admin.js  catalogue.js  img.js
└── images/
    ├── logo.png
    ├── brands/  produits/  vitrine/  paiements/
    └── …
```

✅ Sur GitHub, en ouvrant le dépôt, on doit voir `index.html` **directement** dans la liste, sans dossier à ouvrir avant.

---

## 1. Envoyer les fichiers sur GitHub

### Avec Git (recommandé)
Dans le dossier du projet (celui qui contient `index.html`) :

```bash
git add -A
git commit -m "Mise à jour du site"
git push
```

### Sans Git (par le site GitHub)
1. Ouvrir le dépôt sur github.com → **Add file → Upload files**.
2. Ouvrir le dossier du projet sur l'ordinateur, **sélectionner tout son contenu** (pas le dossier lui-même) et le glisser dans la page.
3. **Commit changes**.

> ⚠ Glisser le dossier entier recrée un sous-dossier et donne à nouveau une erreur 404.

---

## 2. Réglages du projet Vercel (à vérifier une fois)

Vercel → projet **big-boss-communication** → **Settings → Build and Deployment** :

| Réglage | Valeur |
|---|---|
| Framework Preset | **Other** |
| Root Directory | **vide** (ou `./`). Si `big-boss-site` est indiqué : l'effacer |
| Build Command | vide (aucune) |
| Output Directory | vide |
| Install Command | vide |

Enregistrer (**Save**).

---

## 3. Créer la base de données (1 minute)

Projet → onglet **Storage** → **Create Database** → **Upstash (Redis)** → offre **gratuite** → **Connect to Project**.
Vercel ajoute seul les variables `KV_REST_API_URL` et `KV_REST_API_TOKEN`.

> Sans base, le site s'affiche quand même avec le catalogue intégré. La base sert à ce que les changements de l'administration soient visibles par tous.

---

## 4. Mot de passe administrateur (rien à faire)

Le mot de passe de l'administration est **déjà intégré au site** : aucune variable à ajouter.
Le code ne contient que son empreinte chiffrée (le dépôt GitHub est public), jamais le mot de passe en clair. Ne l'écrivez donc dans aucun fichier du projet.

*Facultatif :* pour le **changer** sans toucher au code, ajoutez dans **Settings → Environment Variables** une variable `ADMIN_PASSWORD` (10 caractères minimum), puis Redeploy. Elle remplace le mot de passe intégré, et toutes les sessions ouvertes sont fermées.

---

## 5. Redéployer (obligatoire après les étapes 2 à 4)

Onglet **Deployments** → menu **⋯** du dernier déploiement → **Redeploy**.
Sans cela, les nouveaux réglages ne sont pas pris en compte.

---

## 6. Vérifier que tout fonctionne

Remplacer `big-boss-communication.vercel.app` par votre adresse si elle est différente.

| Ouvrir | Résultat attendu |
|---|---|
| `https://big-boss-communication.vercel.app/` | La page d'accueil Big Boss s'affiche |
| `https://big-boss-communication.vercel.app/api/catalogue` | Un texte qui commence par `{"ok":` (et non « NOT_FOUND ») |
| `https://big-boss-communication.vercel.app/admin` | La page de connexion de l'administration |

Puis, première mise en route :
1. Se connecter sur `/admin`.
2. Onglet **Sauvegarde** → **Remplacer tout le catalogue** (efface l'ancien électroménager et charge téléphones et accessoires).
3. Onglet **Coordonnées** : vérifier WhatsApp, adresse, horaires et **réglages du crédit** (apport, durées, frais, pièces).
4. Ouvrir le site sur un téléphone : les changements y sont.

---

## 7. Dépannage

| Symptôme | Cause | Solution |
|---|---|---|
| Accueil : **404 NOT_FOUND** | Les fichiers sont dans un sous-dossier, ou « Root Directory » est mal réglé | Étapes 0 et 2, puis Redeploy |
| Le site s'affiche à `/un-dossier/` mais pas à `/` | Même cause | Même solution |
| `/api/catalogue` : **NOT_FOUND** | Le dossier `api/` n'est pas à la racine | Étape 0 |
| `/api/catalogue` : `"code":"no-db"` | Base de données non connectée | Étape 3 puis Redeploy |
| Admin : « ADMIN_PASSWORD est trop court » | Une variable `ADMIN_PASSWORD` de moins de 10 caractères existe | La corriger ou la supprimer, puis Redeploy |
| Admin : « Mot de passe incorrect » alors qu'il est bon | Une variable `ADMIN_PASSWORD` remplace le mot de passe intégré, ou majuscules/minuscules | Vérifier les variables Vercel ; respecter les majuscules |
| Admin : « Mode démonstration » | Le dossier `api/` n'a pas été envoyé | Étape 1 |
| Photos ou mise en page absentes | Dossier `images/` ou fichier `.css` manquant, ou nom de fichier avec une majuscule différente | Renvoyer les fichiers ; les noms doivent correspondre exactement (`itel-a04.jpg` ≠ `Itel-A04.JPG`) |
| Ancienne version encore visible | Cache du navigateur | Recharger avec Ctrl + F5 ou en navigation privée |
| Vercel affiche « Build Failed » | Une commande de build est réglée | Étape 2 : tout laisser vide |

---

## 8. Mettre à jour le site plus tard

- **Prix, stocks, photos, produits, coordonnées, crédit** : uniquement depuis `/admin`. Pas besoin de redéployer.
- **Textes ou design du site** : modifier les fichiers, puis l'étape 1. Vercel republie tout seul en 30 secondes environ.

## 9. Tester sur l'ordinateur avant d'envoyer (facultatif)

Avec Node.js installé, dans le dossier du projet :

```bash
node dev-server.js
```

Puis ouvrir <http://localhost:3000> (administration : `/admin`, même mot de passe qu'en ligne).
