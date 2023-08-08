const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('products.json');

app.use(express.json());

// Endpoint para obtener todos los productos o un número limitado de productos
app.get('/products', async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();

  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    const limitedProducts = products.slice(0, parsedLimit);
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

// Endpoint para obtener un producto por su id (pid)
app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const product = await productManager.getProductById(productId);
  res.json(product);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
