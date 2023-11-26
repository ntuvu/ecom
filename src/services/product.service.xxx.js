const { BadRequestError } = require('../core/error.response');
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');

// define factory to create product
class ProductFactory {
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError('Invalid Product Type', type);
    }

    return new productClass(payload).createProduct();
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

// register product type
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Clothings', Clothing);
ProductFactory.registerProductType('Furnitures', Furniture);

module.exports = ProductFactory;
