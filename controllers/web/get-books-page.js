module.exports = async (req, res, next) => {
  const {
    user,
  } = req;

  if (!user) {
    return res.redirect('/auth/login');
  }

  res.render('web/books-page');
};
