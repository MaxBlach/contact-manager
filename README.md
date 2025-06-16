# Contact Manager

Mini-Application de gestion de contacts construite avec Next.js + Shadcn

## Technologies Utilisées

### Frontend
- **Next.js** 
- **TypeScript**
- **Shadcn**
- **Tailwind CSS**
- **Zod**

### Tests
- **Jest** - Framework de test
## Installation

1. Clonez le repository :
```bash
git clone https://github.com/MaxBlach/contact-manager
cd contact-manager
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## Scripts Disponibles

- `npm run dev` - Lance le serveur de développement avec Turbopack
- `npm run build` - Compile l'application pour la production
- `npm run start` - Démarre l'application en mode production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run test` - Lance les tests
- `npm run test:watch` - Lance les tests en mode watch
- `npm run test:coverage` - Génère un rapport de couverture des tests

## Architecture
- `/app` - Routes et pages de l'application
- `/components` - Composants React
- `/lib` - Utilitaires et configurations
- `/__tests__` - Tests unitaires
- `/lib/contact/data.json` - Simulation de base de données avec un fichier JSON pour le stockage des contacts

## Fonctionnalités

- Gestion complète des contacts (CRUD)
- Table de données interactive
- Import CSV
- Fichiers de test disponibles dans `/csv/` pour tester la fonctionnalité d'import

## Tests

Les tests sont écrits avec Jest et React Testing Library. Pour exécuter les tests :

```bash
npm run test
```

Pour voir la couverture des tests :

```bash
npm run test:coverage
```

## Déploiement

L'application peut être déployée sur n'importe quelle plateforme supportant Next.js (Vercel, Netlify, etc.).

Pour construire l'application pour la production :

```bash
npm run build
```