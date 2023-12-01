'use strict';

const { BadRequestError } = require('../core/error.response');
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
}

module.exports = DiscountService;
