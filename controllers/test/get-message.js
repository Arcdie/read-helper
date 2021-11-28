module.exports = async (req, res, next) => {
  const {
    body: {
      message
    },
  } = req;

  console.log('message', message);

  return res.json({
    status: true,
  });
};
