const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Expense Service API', version: '1.0.0', description: 'Manages expenses' },
  },
  apis: ['./index.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/expense', (req, res) => res.redirect(302, '/api-docs'));

let expenses = [];

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses
 *     responses:
 *       200:
 *         description: List of all expenses
 */
app.get('/expenses', (req, res) => {
  res.json(expenses);
});

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Add a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery
 *               amount:
 *                 type: number
 *                 example: 1500
 *               category:
 *                 type: string
 *                 example: Food
 *               date:
 *                 type: string
 *                 example: 2026-03-28
 *     responses:
 *       201:
 *         description: Expense created successfully
 */
app.post('/expenses', (req, res) => {
  const expense = { id: Date.now(), ...req.body };
  expenses.push(expense);
  res.status(201).json(expense);
});

app.listen(3001, () => console.log('✅ Expense Service running on http://localhost:3001'));