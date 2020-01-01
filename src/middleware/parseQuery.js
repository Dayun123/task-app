module.exports = (req, res, next) => {
  
  req.numResults = +req.query.numResults || undefined;

  if (+req.query.page > 1) {
    req.skip = (+req.query.page - 1) * req.numResults;
  }

  next();
};