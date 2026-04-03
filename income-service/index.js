const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Income Service API', version: '1.0.0', description: 'Manages income records' },
  },
  apis: ['./index.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let incomes = [];

/**
 * @swagger
 * /incomes:
 *   get:
 *     summary: Get all income records
 *     responses:
 *       200:
 *         description: List of all incomes
 */
app.get('/incomes', (req, res) => {
  res.json(incomes);
});

/**
 * @swagger
 * /incomes:
 *   post:
 *     summary: Add a new income record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               source:
 *                 type: string
 *                 example: Salary
 *               amount:
 *                 type: number
 *                 example: 85000
 *               type:
 *                 type: string
 *                 example: Monthly
 *               date:
 *                 type: string
 *                 example: 2026-03-28
 *     responses:
 *       201:
 *         description: Income record created successfully
 */
app.post('/incomes', (req, res) => {
  const income = { id: Date.now(), ...req.body };
  incomes.push(income);
  res.status(201).json(income);
});

app.listen(3002, () => console.log('✅ Income Service running on http://localhost:3002'));