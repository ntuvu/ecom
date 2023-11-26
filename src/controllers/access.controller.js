const AccessService = require('../services/access.service');
const { OK, CREATED, SuccesResponse } = require('../core/success.response');

class AccessController {
  login = async (req, res, next) => {
    new SuccesResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Registered OK',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccesResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  handlerRefreshToken = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get token success!',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
