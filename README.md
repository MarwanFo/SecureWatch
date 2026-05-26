# SecureWatch — Plateforme SaaS Intelligente de Cybersécurité

**SecureWatch** est une plateforme SaaS B2B multi-tenant conçue pour la détection proactive d'anomalies de sécurité, l'analyse comportementale via apprentissage automatique (Machine Learning), et la gestion centralisée des incidents.

---

## 🚀 Fonctionnalités Clés

- **Multi-Tenancy :** Isolation logique stricte des données par entreprise (`tenant_id`).
- **Détection comportementale (ML) :** Modèle _Isolation Forest_ (Smile ML) embarqué pour évaluer le score de risque des sessions.
- **Audit Trail Cryptographique :** Table de logs sécurisée par chaînage de blocs de hashs (Hash-Chain), rendant toute altération détectable.
- **Double Authentification (MFA) :** Authentification sécurisée par mot de passe (BCrypt) + TOTP (Google Authenticator) chiffré.
- **Alertes en Temps Réel :** Diffusion immédiate des anomalies critiques via WebSockets (STOMP).
- **Interface Executive :** UI professionnelle en mode clair (style Figma B2B / Stripe), épurée et sans artifice.

---

## 🛠️ Stack Technique

- **Backend :** Java 17 / Spring Boot 3.4.0 (Spring Security, Spring Data JPA, WebSockets STOMP, Redis Cache)
- **Frontend :** React 18 / Vite / Tailwind CSS v3 (Zustand, Axios)
- **Bases de Données :** PostgreSQL 18 (Supabase) + Redis 7 (Upstash)
- **Migrations de Schéma :** Flyway
- **Machine Learning :** Smile ML (Statistical Machine Intelligence and Learning Engine)

---

## 📂 Structure du Monorepo

- `/securewatch-backend` : Serveur Spring Boot (Monolithe Modulaire).
- `/securewatch-frontend` : Application React Client.
- `/docker-compose.yml` : Configuration des conteneurs locaux (Postgres 18 & Redis 7).
- `/.gitignore` : Règles d'exclusion Git (les images de maquettes et les fichiers de planification `.md` sont ignorés pour garder le dépôt propre).

---

## ⚙️ Démarrage Rapide

### Prérequis

Assurez-vous d'avoir installé sur votre machine :

- **Docker & Docker Compose**
- **JDK 17** ou supérieur
- **Maven** (ou utiliser `mvnw` fourni)
- **Node.js** (v18+) & **npm**

---

### Étape 1 : Lancer les bases de données locales

Démarrez les conteneurs PostgreSQL 18 et Redis en arrière-plan :

```bash
docker compose up -d
```

_La base de données sera disponible sur le port `5432` et Redis sur le port `6379`._

---

### Étape 2 : Lancer le Backend

1. Naviguez dans le dossier backend :
   ```bash
   cd securewatch-backend
   ```
2. Lancez l'application avec le profil local (le schéma se créera automatiquement via Flyway) :
   ```bash
   ./mvnw spring-boot:run
   ```
   _Le serveur démarrera sur `http://localhost:8080`._

---

### Étape 3 : Lancer le Frontend

1. Naviguez dans le dossier frontend :
   ```bash
   cd ../securewatch-frontend
   ```
2. Installez les dépendances npm (si ce n'est pas déjà fait) :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement Vite :
   ```bash
   npm run dev
   ```
   _L'application sera accessible sur `http://localhost:5173`._

---

## 🔒 Sécurité & Conformité

- Le code TOTP est chiffré en base via l'algorithme **AES-GCM (256-bit)** avec clé tournante.
- Les sessions à risque d'IP suspectes ou de "voyage impossible" (ex: Maroc -> Russie en 2min) déclenchent automatiquement des alertes de sévérité critique.
