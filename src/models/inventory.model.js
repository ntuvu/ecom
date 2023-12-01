const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
  {
    invenProductId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    invenLocation: {
      type: String,
      default: 'unKnow',
    },
    invenStock: {
      type: Number,
      required: true,
    },
    invenShopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    invenReservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { inventory: model(DOCUMENT_NAME, inventorySchema) };
