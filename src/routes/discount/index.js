const express = require('express');
const DiscountController = require('../../controllers/discount.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// authentication
router.use(authentication);
///////////////////////////

router.post('', asyncHandler(DiscountController.createDiscount));
router.get(
  '/products-discount',
  asyncHandler(DiscountController.getAllProductsWithDiscount)
);

router.get('', asyncHandler(DiscountController.getAllDiscountsByShop));

module.exports = router;
