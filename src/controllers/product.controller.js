const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');
const { OK, CREATED, SuccesResponse } = require('../core/success.response');

class ProductController {
  // createProduct = async (req, res, next) => {
  //   new SuccesResponse({
  //     message: 'Create new Product success',
  //     metadata: await ProductService.createProduct(req.body.productType, {
  //       ...req.body,
  //       productShop: req.user.userId,
  //     }),
  //   }).send(res);
  // };

  async createProduct(req, res, next) {
    new SuccesResponse({
      message: 'Create new Product success',
      metadata: await ProductServiceV2.createProduct(req.body.productType, {
        ...req.body,
        productShop: req.user.userId,
      }),
    }).send(res);
  }

  async publishProduct(req, res, next) {
    new SuccesResponse({
      message: 'Publish Product Success',
      metadata: await ProductServiceV2.publishProductByShop({
        productId: req.params.id,
        productShop: req.user.userId,
      }),
    }).send(res);
  }

  async unPublishProduct(req, res, next) {
    new SuccesResponse({
      message: 'Unpublish product Success',
      metadata: await ProductServiceV2.unPublishProductByShop({
        productId: req.params.id,
        productShop: req.user.userId,
      }),
    }).send(res);
  }

  async updateProduct(req, res, next) {
    new SuccesResponse({
      message: 'Update product success',
      metadata: await ProductServiceV2.updateProduct(
        req.body.productType,
        req.params.productId,
        {
          ...req.body,
          productShop: req.user.userId,
        }
      ),
    }).send(res);
  }

  // QUERY

  /**
   * @desc Get all draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllDraftForShop(req, res, next) {
    new SuccesResponse({
      message: 'Get list draft success!',
      metadata: await ProductServiceV2.findAllDraftForShop({
        productShop: req.user.userId,
      }),
    }).send(res);
  }

  /**
   * @desc Get all published for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllPublishedForShop(req, res, next) {
    new SuccesResponse({
      message: 'Get list draft success!',
      metadata: await ProductServiceV2.findAllPublishForShop({
        productShop: req.user.userId,
      }),
    }).send(res);
  }

  async getListSearchProduct(req, res, next) {
    console.log('param', req.params);
    new SuccesResponse({
      message: 'Get list search success!',
      metadata: await ProductServiceV2.searchProducts(req.params),
    }).send(res);
  }

  async findAllProducts(req, res, next) {
    console.log('param', req.params);
    new SuccesResponse({
      message: 'Get all list product success!',
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  }

  async findProduct(req, res, next) {
    console.log('param', req.params);
    new SuccesResponse({
      message: 'Get detail product success!',
      metadata: await ProductServiceV2.findProduct({
        productId: req.params.productId,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
