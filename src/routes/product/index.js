const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProduct)
);

router.get('', asyncHandler(productController.findAllProducts));

router.get('/:productId', asyncHandler(productController.findProduct));

// authentication
router.use(authentication);
///////////////////////////
router.post('', asyncHandler(productController.createProduct));

router.patch('/:productId', asyncHandler(productController.updateProduct));

router.post('/publish/:id', asyncHandler(productController.publishProduct));

router.post('/unpublish/:id', asyncHandler(productController.unPublishProduct));

router.get('/draft/all', asyncHandler(productController.getAllDraftForShop));

router.get(
  '/published/all',
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
