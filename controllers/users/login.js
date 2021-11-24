const {
  jwtConf,
} = require('../../config');

const {
  createToken,
} = require('../../libs/jwt');

const User = require('../../models/User');

module.exports = async (req, res, next) => {
  const {
    body: {
      name,
    },

    user,
  } = req;

  if (user) {
    return res.json({
      status: false,
      message: 'User is logged in',
    });
  }

  const userDoc = await User.findOne({
    name,
  }, { _id: 1 }).exec();

  if (!userDoc) {
    return res.json({
      status: false,
      message: 'No User with this name',
    });
  }

  const newToken = createToken({ _id: userDoc._id.toString() });

  res
    .cookie('token', newToken, {
      httpOnly: true,
      maxAge: jwtConf.lifetime,
    })
    .json({
      status: true,
      result: newToken,
    });
};
