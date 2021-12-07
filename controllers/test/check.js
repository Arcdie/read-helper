module.exports = async (req, res, next) => {
  console.log('req.query', req.query);
  console.log('req.body', req.body);

  return res.json({
    status: true,
  });
};
