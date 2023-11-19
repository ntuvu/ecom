const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const KeyTokenService = require('../services/keyToken.service');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { keys } = require('lodash');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  // check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError('Invalid requet');
  }

  // get accessToken
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore');
  }

  // verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError('Invalid request');
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid userId');
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }

  // check user in db

  // check keyStore with this userId

  // return next
});

module.exports = {
  createTokenPair,
  authentication,
};
