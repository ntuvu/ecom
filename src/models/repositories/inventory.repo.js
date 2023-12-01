const { inventory } = require('../inventory.model');
const { Types } = require('mongoose');

class InventoryRepo {
  static async insertInventory({
    productId,
    shopId,
    stock,
    location = 'unKnow',
  }) {
    return await inventory.create({
      invenProductId: productId,
      invenStock: stock,
      invenLocation: location,
      invenShopId: shopId,
    });
  }
}

module.exports = {
  InventoryRepo,
};
