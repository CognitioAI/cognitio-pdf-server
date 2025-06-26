# Cognitio PDF Server

Un microservice Node.js utilisant Playwright pour générer des PDF à partir de contenu HTML.

## Installation

```
npm install
```

## Démarrage

```
npm start
```

## Utilisation

POST sur `/` avec un body JSON :

```json
{
  "html": "<html><body><h1>Exemple</h1><p>Contenu</p></body></html>"
}
```

Réponse : PDF généré.