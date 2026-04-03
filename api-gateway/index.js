process.noDeprecation = true;

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

const createServiceProxy = (target, basePath) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const prefix = basePath ?? req.baseUrl ?? '';
      if (!prefix) return path;
      if (path === '/' || path === '') return prefix;
      return `${prefix}${path}`;
    },
    on: {
      error: (err, req, res) => {
        if (!res.headersSent) {
          res.status(502).json({
            message: 'Upstream service unavailable',
            target,
            route: req.originalUrl,
            error: err.code || 'PROXY_ERROR'
          });
        }
      }
    }
  });

app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway is running',
    routes: ['/expenses', '/incomes', '/budgets', '/predictions']
  });
});

// Swagger UI for testing gateway endpoints.
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Microservices API Gateway',
      version: '1.0.0',
      description: 'Gateway proxy endpoints',
    },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: [],
});

// Manually define operations .
swaggerSpec.paths = {
  '/expenses': {
    get: {
      summary: 'Get all expenses',
      tags: ['expenses'],
      responses: { 200: { description: 'List of expenses' } },
    },
    post: {
      summary: 'Add an expense',
      tags: ['expenses'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string', example: 'Grocery' },
                amount: { type: 'number', example: 1500 },
                category: { type: 'string', example: 'Food' },
                date: { type: 'string', example: '2026-03-28' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Expense created' } },
    }
  },
  '/incomes': {
    get: {
      summary: 'Get all incomes',
      tags: ['incomes'],
      responses: { 200: { description: 'List of incomes' } },
    },
    post: {
      summary: 'Add an income',
      tags: ['incomes'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                source: { type: 'string', example: 'Salary' },
                amount: { type: 'number', example: 85000 },
                type: { type: 'string', example: 'Monthly' },
                date: { type: 'string', example: '2026-03-28' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Income created' } },
    }
  },
  '/budgets': {
    get: {
      summary: 'Get all budgets',
      tags: ['budgets'],
      responses: { 200: { description: 'List of budgets' } },
    },
    post: {
      summary: 'Create a budget',
      tags: ['budgets'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                category: { type: 'string', example: 'Food' },
                limit: { type: 'number', example: 10000 },
                month: { type: 'string', example: 'March 2026' },
                currency: { type: 'string', example: 'LKR' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Budget created' } },
    }
  },
  '/predictions': {
    get: {
      summary: 'Get all predictions',
      tags: ['predictions'],
      responses: { 200: { description: 'List of predictions' } },
    },
    post: {
      summary: 'Create a budget prediction',
      tags: ['predictions'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                month: { type: 'string', example: 'April 2026' },
                expectedIncome: { type: 'number', example: 85000 },
                expectedExpenses: { type: 'number', example: 45000 }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Prediction created' } },
    }
  }
};

// Swagger UI group headings per service.
swaggerSpec.tags = [
  { name: 'expenses' },
  { name: 'budgets' },
  { name: 'incomes' },
  { name: 'predictions' },
];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/expenses', createServiceProxy('http://localhost:3001', '/expenses'));
app.use('/incomes', createServiceProxy('http://localhost:3002', '/incomes'));
app.use('/budgets', createServiceProxy('http://localhost:3003', '/budgets'));
app.use('/predictions', createServiceProxy('http://localhost:3004', '/predictions'));

app.listen(3000, () => console.log('API Gateway running on port 3000'));