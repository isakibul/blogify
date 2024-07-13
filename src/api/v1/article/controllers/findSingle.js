const articleService = require("../../../../lib/article");

const findSingle = async (req, res, next) => {
  const id = req.params.id;
  const expand = req.query.expand || "";

  try {
    const article = await articleService.findSingle({ id, expand });

    const response = {
      data: article,
      links: {
        self: `/articles/${article.id}`,
        author: `/articles/${article.id}/author`,
        comments: `articles/${article.id}/comments`,
      },
    };

    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = findSingle;
