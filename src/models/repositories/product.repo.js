'use strict';

const {
  product,
  electronic,
  clothing,
  furniture,
} = require('..//../models/product.model');
const { Types } = require('mongoose');

async function publishProductByShop({ productShop, productId }) {
  const foundShop = await product.findOne({
    productShop: new Types.ObjectId(productShop),
    _id: new Types.ObjectId(productId),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
}

async function unPublishProductByShop({ productShop, productId }) {
  const foundShop = await product.findOne({
    productShop: new Types.ObjectId(productShop),
    _id: new Types.ObjectId(productId),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
}

async function queryProduct({ query, limit, skip }) {
  return await product
    .find(query)
    .populate('productShop', 'name email _id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

async function searchProductByUser({ keySearch }) {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      { isPublished: true, $text: { $search: regexSearch } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return results;
}

async function findAllProducts({ limit, sort, page, filter, select }) {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();

  return products;
}

async function findProduct({ productId }) {
  return await product.findById(productId).lean();
}

async function updateProductById({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
}

module.exports = {
  queryProduct,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
