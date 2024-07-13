const articleService = require("../../../../lib/article");
const { query } = require("../../../../utils");
const defaults = require("../../../../config/defaults");

const findAll = async (req, res, next) => {
  const page = req.query.page || defaults.page;
  const limit = req.query.limit || defaults.limit;
  const sortType = req.query.sort_type || defaults.sortType;
  const shortBy = req.query.sort_by || defaults.sortBy;
  const search = req.query.search || "";

  try {
    // data
    const articles = await articleService.findAll({
      page,
      limit,
      sortType,
      shortBy,
      search,
    });

    const data = query.getTransformedItems({
      items: articles,
      path: "./article",
      selection: ["id", "title", "cover", "author", "updatedAt", "createdAt"],
    });

    // pagination
    const totalItems = await articleService.count({ search });
    const pagination = query.getPagination({ totalItems, limit, page });

    // HATEOAS links
    const links = query.getHATEOASforAllItems({
      url: req.url,
      path: req.path,
      query: req.query,
      hasNext: !!pagination.next,
      hasPrev: !!pagination.prev,
      page,
    });

    res.status(200).json({
      data,
      pagination,
      links,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = findAll;
