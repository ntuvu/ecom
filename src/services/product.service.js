const { BadRequestError } = require('../core/error.response');
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');

// define factory to create product
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Electronics':
        return new Electronic(payload).createProduct();
      case 'Clothings':
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type: ${type}`);
    }
  }
}

class Product {
  constructor({
    productName,
    productThumb,
    productPrice,
    productDescription,
    productQuantity,
    productType,
    productAttributes,
    productShop,
  }) {
    this.productName = productName;
    this.productThumb = productThumb;
    this.productPrice = productPrice;
    this.productDescription = productDescription;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productAttributes = productAttributes;
    this.productShop = productShop;
  }

  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newClothing) {
      throw new BadRequestError('Create new Clothing error');
    }
    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError('Create new Product error');
    }

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newElectronic) {
      throw new BadRequestError('Create new Electronic error');
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError('Create new Product error');
    }

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError('create new Product error');
    }

    return newProduct;
  }
}

module.exports = ProductFactory;
