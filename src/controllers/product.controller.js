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
}

module.exports = new ProductController();
