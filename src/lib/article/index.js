const { Article } = require("../../model");
const defaults = require("../../config/defaults");
const { notFound } = require("../../utils/error");
const updateArticleV2 = require("./updateArticleV2");

const findAll = async ({
  page = defaults.page,
  limit = defaults.limit,
  sortType = defaults.sortType,
  sortBy = defaults.sortBy,
  search = defaults.search,
}) => {
  const sortStr = `${sortType === "dsc" ? "-" : ""}${sortBy}`;
  const filter = { title: { $regex: search, $options: "i" } };

  const articles = await Article.find(filter)
    .populate({ path: "author", select: "name" })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return articles.map((article) => ({
    ...article._doc,
    id: article.id,
  }));
};

const count = ({ search = "" }) => {
  const filter = {
    title: { $regex: search, $options: "i" },
  };
  return Article.countDocuments(filter);
};

const create = async ({
  title,
  body = "",
  cover = "",
  status = "draft",
  author,
}) => {
  if (!title || !author) {
    const error = new Error("Invalid parameters");
    error.status = 400;
    throw error;
  }

  const article = new Article({
    title,
    body,
    cover,
    status,
    author: author.id,
  });
  await article.save();
  return {
    ...article._doc,
    id: article.id,
  };
};

const findSingle = async ({ id, expand = "" }) => {
  if (!id) throw new Error("Id is required");

  expand = expand.split(",").map((item) => item.trim());

  const article = await Article.findById(id);
  if (!article) {
    throw notFound();
  }

  if (expand.includes("author")) {
    await article.populate({
      path: "author",
      select: "name",
      strictPopulate: false,
    });
  }

  if (expand.includes("comment")) {
    await article.populate({
      path: "comment",
      strictPopulate: false,
    });
  }

  return {
    ...article._doc,
    id: article.id,
  };
};

const updateOrCreate = async (
  id,
  { title, body, author, cover = "", status = "draft" }
) => {
  const article = await Article.findById(id);
  if (!article) {
    const article = await create({ title, body, cover, status, author });
    return {
      article,
      statusCode: 201,
    };
  }

  const payload = { title, body, cover, status, author: author.id };

  article.overwrite(payload);
  await article.save();

  return { article: { ...article._doc, id: article.id }, statusCode: 200 };
};

const updateProperties = async (id, { title, body, cover, status }) => {
  const article = await Article.findById(id);
  if (!article) {
    throw notFound();
  }

  const payload = { title, body, cover, status };

  Object.keys(payload).forEach((key) => {
    article[key] = payload[key] ?? article[key];
  });

  await article.save();
  return { ...article._doc, id: article.id };
};

const removeItem = async (id) => {
  const article = await Article.findById(id);

  if (!article) {
    throw notFound();
  }

  // TODO:
  // asynchronously delete all associated comments

  return Article.findByIdAndDelete(id);
};

const checkOwnership = async ({ resourceId, userId }) => {
  const article = await Article.findById(resourceId);
  console.log(article._doc.author);

  if (!article) throw notFound();

  if (article._doc.author.toString() === userId) {
    return true;
  }
  return false;
};

module.exports = {
  findAll,
  create,
  count,
  findSingle,
  updateOrCreate,
  updateProperties,
  removeItem,
  updateArticleV2,
  checkOwnership,
};
