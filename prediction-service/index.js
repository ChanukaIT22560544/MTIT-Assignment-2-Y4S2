const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Prediction Service API', version: '1.0.0', description: 'Predicts future budgets based on income and expenses' },
  },
  apis: ['./index.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let predictions = [];

/**
 * @swagger
 * /predictions:
 *   get:
 *     summary: Get all budget predictions
 *     responses:
 *       200:
 *         description: List of all predictions
 */
app.get('/predictions', (req, res) => {
  res.json(predictions);
});

/**
 * @swagger
 * /predictions:
 *   post:
 *     summary: Generate a budget prediction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *                 example: April 2026
 *               expectedIncome:
 *                 type: number
 *                 example: 85000
 *               expectedExpenses:
 *                 type: number
 *                 example: 45000
 *     responses:
 *       201:
 *         description: Prediction generated successfully
 */
app.post('/predictions', (req, res) => {
  const { month, expectedIncome, expectedExpenses } = req.body;
  const predictedSavings = expectedIncome - expectedExpenses;
  const prediction = {
    id: Date.now(),
    month,
    expectedIncome,
    expectedExpenses,
    predictedSavings,
    status: predictedSavings >= 0 ? 'Surplus' : 'Deficit'
  };
  predictions.push(prediction);
  res.status(201).json(prediction);
});

app.listen(3004, () => console.log('✅ Prediction Service running on http://localhost:3004'));