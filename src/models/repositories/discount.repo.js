const { convertToObjectIdMongodb } = require('../../utils');
const { discount } = require('../discount.model');

class DiscountRepo {
  static async findDiscountByCodeAndShopId({ discountCode, discountShopId }) {
    return discount
      .findOne({
        discountCode: discountCode,
        discountShopId: discountShopId,
      })
      .lean();
  }

  static async createDiscount(payload) {
    return await discount.create(payload);
  }

  static async findAllDiscounts({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await discount
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(select)
      .lean();

    return discounts;
  }

  static async findDiscountAndDelete({ shopId, codeId }) {
    return await discount.findOneAndDelete({
      discountCode: codeId,
      discountShopId: convertToObjectIdMongodb(shopId),
    });
  }

  static async findDiscountAndUpdate({ codeId, update }) {
    return await discount.findByIdAndUpdate(codeId, update);
  }
}

module.exports = DiscountRepo;
