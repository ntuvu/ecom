const { model, Schema, Types } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productThumb: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productSlug: {
      type: String,
    },
    productQuantity: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothings', 'Furnitures'],
    },
    productAttributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    productRatingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be under 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    productVariations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// create index for search
productSchema.index({ productName: 'text', productDescription: 'text' });

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.productSlug = slugify(this.productName, { lower: true });
  next();
});

// define product type = clothing
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'clothes',
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacture: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'electronics',
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'furnitures',
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothings', clothingSchema),
  furniture: model('Furnitures', furnitureSchema),
};
