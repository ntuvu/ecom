const { SuccesResponse } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
  static async createDiscount(req, res, next) {
    const body = req.body;
    body.shopId = req.user.userId;
    new SuccesResponse({
      message: 'Create new Discount success',
      metadata: await DiscountService.createDiscountCode(body),
    }).send(res);
  }

  static async getAllProductsWithDiscount(req, res, next) {
    new SuccesResponse({
      message: 'Get products with discount success',
      metadata: await DiscountService.getAllProductsWithDiscount({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  static async getAllDiscountsByShop(req, res, next) {
    new SuccesResponse({
      message: 'Get discounts with shop success',
      metadata: await DiscountService.getAllDiscountByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  static async deleteDiscount(req, res, next) {
    
  }
}

module.exports = DiscountController;
