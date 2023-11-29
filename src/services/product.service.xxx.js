const { BadRequestError } = require('../core/error.response');
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const {
  queryProduct,
  publishProductByShop,
  unPublishProductByShop,
  searchProduct,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo');
const {
  removeUndefinedObject,
  updateNestedObjectParser,
  removeUndefinedAndNull,
} = require('../utils');

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

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError('Invalid Product Type', type);
    }

    return new productClass(payload).updateProduct(productId);
  }

  static async findAllDraftForShop({ productShop, limit = 50, skip = 0 }) {
    const query = { productShop, isDraft: true };
    return await queryProduct({ query, limit, skip });
  }

  static async findAllPublishForShop({ productShop, limit = 50, skip = 0 }) {
    const query = { productShop, isPublished: true };
    return await queryProduct({ query, limit, skip });
  }

  static async publishProductByShop({ productShop, productId }) {
    return await publishProductByShop({ productShop, productId });
  }

  static async unPublishProductByShop({ productShop, productId }) {
    return await unPublishProductByShop({ productShop, productId });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['productName', 'productPrice', 'productThumb'],
    });
  }

  static async findProduct({ productId }) {
    return await findProduct({ productId });
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

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
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
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError('Create new Product error');
    }

    return newProduct;
  }

  async updateProduct(productId) {
    // remove attributes null undefined
    const objectParams = updateNestedObjectParser(this);
    // console.log(objectParams);
    const validObjectParams = removeUndefinedAndNull(objectParams);
    console.log(validObjectParams);

    // check where to update
    if (this.productAttributes) {
      await updateProductById({
        productId: productId,
        bodyUpdate: this.productAttributes,
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      validObjectParams
    );
    return updateProduct;
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
