const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Budget Service API', version: '1.0.0', description: 'Manages budgets' },
  },
  apis: ['./index.js'],
});


app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: '/api-docs.json',
    },
  }),
);
app.get('/Budget-Service', (req, res) => res.redirect(302, '/api-docs'));
app.get('/Budget-Service/', (req, res) => res.redirect(302, '/api-docs'));

let budgets = [];

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Get all budgets
 *     responses:
 *       200:
 *         description: List of all budgets
 */
app.get('/budgets', (req, res) => {
  res.json(budgets);
});

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Food
 *               limit:
 *                 type: number
 *                 example: 10000
 *               month:
 *                 type: string
 *                 example: March 2026
 *               currency:
 *                 type: string
 *                 example: LKR
 *     responses:
 *       201:
 *         description: Budget created successfully
 */
app.post('/budgets', (req, res) => {
  const budget = { id: Date.now(), ...req.body };
  budgets.push(budget);
  res.status(201).json(budget);
});

app.listen(3003, () => console.log('✅ Budget Service running on http://localhost:3003'));