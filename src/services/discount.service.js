'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { discount } = require('../models/discount.model');
const DiscountRepo = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      startDate,
      endDate,
      isActive,
      shopId,
      minOrderValue,
      productIds,
      appliesTo,
      name,
      description,
      type,
      value,
      maxValue,
      maxUsers,
      usersCount,
      maxUsersPerUser,
    } = payload;

    const currentDate = new Date();
    const startDateCheck = new Date(startDate);
    const endDateCheck = new Date(endDate);
    console.log('currentDate', currentDate);
    console.log('startDateCheck', startDateCheck);
    console.log('endDateCheck', endDateCheck);

    if (currentDate > startDateCheck || currentDate > endDateCheck) {
      throw new BadRequestError('Discount code has expired');
    }

    if (startDateCheck >= endDateCheck) {
      throw new BadRequestError('Start date must be before end date');
    }

    const foundDiscount = await DiscountRepo.findDiscountByCodeAndShopId({
      discountCode: code,
      discountShopId: convertToObjectIdMongodb(shopId),
    });

    if (foundDiscount && foundDiscount.discountIsActive) {
      throw new BadRequestError('Discount exists');
    }
    console.log(payload);
    const createDiscountPayload = {
      discountName: name,
      discountDescription: description,
      discountType: type,
      discountCode: code,
      discountValue: value,
      discountMinOrderValue: minOrderValue || 0,
      discountMaxValue: maxValue,
      discountStartDate: startDate,
      discountEndDate: endDate,
      discountMaxUsers: maxUsers,
      discountUsersCount: usersCount,
      discountShopId: shopId,
      discountMaxUsersPerUser: maxUsersPerUser,
      discountIsActive: isActive,
      discountAppliesTo: appliesTo,
      discountProductIds: appliesTo === 'all' ? [] : productIds,
    };
    console.log(createDiscountPayload);
    const newDiscount = DiscountRepo.createDiscount(createDiscountPayload);

    return newDiscount;
  }

  static async updateDiscount() {
    //...
  }

  static async getAllProductsWithDiscount({
    code,
    shopId,
    limit = 50,
    page = 1,
  }) {
    const foundDiscount = await DiscountRepo.findDiscountByCodeAndShopId({
      discountCode: code,
      discountShopId: convertToObjectIdMongodb(shopId),
    });
    console.log('foundDiscount', foundDiscount);
    if (!foundDiscount || !foundDiscount.discountIsActive) {
      throw new BadRequestError('Discount not exist');
    }

    const { discountAppliesTo, discountProductIds } = foundDiscount;
    let products;
    const selectFields = [
      'productName',
      'productId',
      'productPrice',
      'productQuantity',
    ];
    if (discountAppliesTo === 'all') {
      products = await findAllProducts({
        filter: {
          productShop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: selectFields,
      });
      return products;
    }

    if (discountAppliesTo === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discountProductIds },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: selectFields,
      });

      return products;
    }
  }

  static async getAllDiscountByShop({ limit = 50, page = 1, shopId }) {
    const selectFields = [
      '_id',
      'discountName',
      'discountType',
      'discountValue',
      'discountCode',
      'discountMaxUsers',
      'discountMinOrderValue',
      'discountMaxValue',
    ];
    const discounts = await DiscountRepo.findAllDiscounts({
      limit: +limit,
      page: +page,
      filter: {
        discountShopId: convertToObjectIdMongodb(shopId),
        discountIsActive: true,
      },
      select: selectFields,
    });

    return discounts;
  }

  static async getDiscountAmount({ discountCode, userId, shopId, products }) {
    const foundDiscount = await DiscountRepo.findDiscountByCodeAndShopId({
      discountCode: discountCode,
      discountShopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount) {
      throw new NotFoundError('Discount not exist');
    }

    const {
      discountIsActive,
      discountMaxUsers,
      discountStartDate,
      discountEndDate,
      discountMinOrderValue,
      discountMaxUsersPerUser,
      discountUsersUsed,
      discountType,
      discountValue,
    } = foundDiscount;

    if (!discountIsActive) {
      throw new NotFoundError('Discount Expired');
    }
    if (!discountMaxUsers) {
      throw new NotFoundError('Discount are out');
    }
    if (
      new Date() < new Date(discountStartDate) ||
      new Date() > new Date(discountEndDate)
    ) {
      throw new NotFoundError('Discount expired');
    }
    let totalOrder = 0;
    if (discountMinOrderValue > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discountMinOrderValue) {
        throw new NotFoundError(
          `Discount require a minimun order value of ${discountMinOrderValue}`
        );
      }
    }

    const amount =
      discountType === 'fixedAmont'
        ? discountValue
        : totalOrder * (discountValue / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscount({ shopId, codeId }) {
    const deleted = await DiscountRepo.findDiscountAndDelete({
      shopId: shopId,
      codeId: codeId,
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await DiscountRepo.findDiscountByCodeAndShopId({
      discountCode: codeId,
      discountShopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount) {
      throw new NotFoundError('Discount not exist');
    }

    const result = await DiscountRepo.findDiscountAndUpdate({
      codeId: codeId,
      update: {
        $pull: {
          discountUsersUsed: userId,
        },
        $inc: {
          discountMaxUsers: 1,
          discountUsersCount: -1,
        },
      },
    });

    return result;
  }
}

module.exports = DiscountService;
