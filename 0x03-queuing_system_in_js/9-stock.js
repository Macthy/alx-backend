import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;
const client = redis.createClient();

// Promisify Redis methods
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Data: List of products
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Function to reserve stock by item ID
const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

// Function to get the current reserved stock by item ID
const getCurrentReservedStockById = async (itemId) => {
  const reservedStock = await getAsync(`item.${itemId}`);
  return parseInt(reservedStock) || 0;
};

// Middleware to parse JSON responses
app.use(express.json());

// Route: GET /list_products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route: GET /list_products/:itemId
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);

  const product = listProducts.find((item) => item.itemId === itemId);
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentQuantity = product.initialAvailableQuantity - (await getCurrentReservedStockById(itemId));
  res.json({ ...product, currentQuantity });
});

// Route: GET /reserve_product/:itemId
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);

  const product = listProducts.find((item) => item.itemId === itemId);
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentQuantity = product.initialAvailableQuantity - (await getCurrentReservedStockById(itemId));
  if (currentQuantity <= 0) {
    return res.json({ status: 'Not enough stock available', itemId });
  }

  await reserveStockById(itemId, currentQuantity - 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

