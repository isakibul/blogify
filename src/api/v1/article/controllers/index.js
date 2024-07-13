const findAll = require("./findAll");
const create = require("./create");
const findSingle = require("./findSingle");
const updateItem = require("./updateItem");
const updateItemByPatch = require("./updateItemByPatch");
const removeItem = require("./removeItem");

module.exports = {
  create,
  findAll,
  findSingle,
  updateItem,
  updateItemByPatch,
  removeItem,
};
