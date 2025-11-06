# Create a Blog Website

A simple Express.js application using Nunjucks templating engine with Typescript

# Description

This project demonstrates how to set up and use Nunjucks templating engine.

#### Install dependencies

```
npm init -y
npm i express
npm install cors
npm install --save @types/cors
npm install dotenv --save
npm install nodemon --save-dev
npm install --save-dev typescript @types/node @types/express
npm install -D ts-node
npm install nunjucks
npm install --save @types/nunjucks
```

## Template System

### Configure Nunjucks

Add this configuration to your `index.ts`:

```
import nunjucks from "nunjucks";

nunjucks.configure("src/templates", {
  autoescape: true,
  express: app,
});
```

**Note**: This is a learning project for understanding Nunjucks templating with Express.js and TypeScript.
