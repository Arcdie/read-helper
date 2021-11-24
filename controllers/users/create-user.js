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

  if (!name) {
    return res.json({
      status: false,
      message: 'No fullname',
    });
  }

  const doesExistUser = await User.exists({
    name,
  });

  if (doesExistUser) {
    return res.json({
      status: false,
      message: 'User with this name already exists',
    });
  }

  const newUser = new User({
    name,
  });

  await newUser.save();

  const newToken = createToken({ _id: newUser._id.toString() });

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
