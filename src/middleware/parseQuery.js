module.exports = (req, res, next) => {
  
  req.filter = {};

  req.filter.owner = res.locals.user._id;

  req.numResults = +req.query.numResults || undefined;

  if (+req.query.page > 1) {
    req.skip = (+req.query.page - 1) * req.numResults;
  }

  next();
};