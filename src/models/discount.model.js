const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
  {
    discountName: {
      type: String,
      required: true,
    },
    discountDescription: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ['fixedAmont', 'percentage'],
    },
    discountValue: {
      // loại giảm giá %, số tiền
      type: Number,
      required: true, // 10.000, 10
    },
    discountCode: {
      type: String,
      required: true,
    },
    discountStartDate: {
      type: Date,
      required: true,
    },
    discountEndDate: {
      type: Date,
      required: true,
    },
    discountMaxUsers: {
      // so luong discount
      type: Number,
      required: true,
    },
    discountUsersCount: {
      // so discount da su dung
      type: Number,
      required: true,
    },
    discountUsersUsed: {
      // ai da dung
      type: Array,
      default: [],
    },
    discountMaxUsersPerUser: {
      // so luong cho phep toi da duoc su dung moi user
      type: Number,
      required: true,
    },
    discountMinOrderValue: {
      type: Number,
      required: true,
    },
    discountMaxValue: {
      type: Number,
      required: true,
    },
    discountShopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    discountIsActive: {
      type: Boolean,
      default: true,
    },
    discountAppliesTo: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discountProductIds: {
      // so san pham duoc ap dung
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { discount: model(DOCUMENT_NAME, discountSchema) };
