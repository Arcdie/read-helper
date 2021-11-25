const {
  getUserById,
} = require('../controllers/users/utils/get-user-by-id');

module.exports = async (req, res, next) => {
  const {
    user,
  } = req;

  if (!user) {
    return res.redirect('/auth/login');
  }

  const resultGetUser = await getUserById({
    userId: user._id,
  });

  if (!resultGetUser || !resultGetUser.status) {
    return res.json({
      status: false,
      message: resultGetUser.message || 'Cant getUserById',
    });
  }

  req.user = resultGetUser.result;
  res.locals.user = req.user;

  return next();
};
