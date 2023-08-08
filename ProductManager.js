const fs = require('fs');
const path = 'products.json'

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }


  addProduct = async (newProduct) => {
    
    if (this.products.length === 0) {
      newProduct.id = 1;
  } else {
      newProduct.id = this.products[this.products.length - 1].id + 1;
  }

    const products = await this.getProducts();
    products.push(newProduct);
    await fs.promises.writeFile(path, JSON.stringify(products))
  }

  getProducts = async () => {
      try {
        const data = await fs.readFileSync(path, 'utf-8');
        this.products = JSON.parse(data);
      } catch (error) {
        this.products = [];
      }
      return this.products;
  }


  getProductById = (id) => {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found.`);
    }
    return product;
  };

  updateProduct = async (id, updatedFields) => {
    const index = this.products.findIndex((p) => p.id == id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found.`);
    }
    this.products[index] = { ...this.products[index], ...updatedFields };
    await fs.promises.writeFile(path, JSON.stringify(this.products, null, 2));
    return this.products[index];
  };

  deleteProduct = async (id) => {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found.`);
    }
    this.products.splice(index, 1);
    await fs.promises.writeFile(path, JSON.stringify(this.products, null, 2));
  };

}


const manager = new ProductManager;
  

async function testProductManager() {
  try {
    console.log(await manager.getProducts()); 

    const firstProduct = {
      title: 'producto prueba',
      description: 'Este es un producto prueba',
      price: 200,
      thumbnail: 'Sin imagen',
      code: 'abc123',
      stock: 25,
    };

    await manager.addProduct(firstProduct);
    console.log(await manager.getProducts());

    const secondProduct = {
      title: 'Producto 2',
      description: 'Otro producto de prueba',
      price: 200,
      thumbnail: 'Sin imagen',
      code: 'abc123',
      stock: 25,
    };

    await manager.addProduct(secondProduct);


    const productById = manager.getProductById(2);
    console.log(productById); 

    const updatedProduct = await manager.updateProduct(1, { price: 250 });
    console.log(updatedProduct); 


    await manager.deleteProduct(2);
    console.log(await manager.getProducts()); 
  } catch (error) {
    console.error(error.message);
  }
}

testProductManager();

module.exports = ProductManager;




