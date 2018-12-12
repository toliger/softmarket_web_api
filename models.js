const pg = require("knex")(require("./knexfile").development);
const bookshelf = require("bookshelf")(pg);

const User = bookshelf.Model.extend({
  tableName: "users",
});

const Article = bookshelf.Model.extend({
  tableName: "articles",
});

const Sub_Category = bookshelf.Model.extend({
  tableName: "article_sub_categories",
});

const Category = bookshelf.Model.extend({
  tableName: "article_categories",
});

module.exports = {
  User,
  Article,
  Sub_Category,
  Category,
};
