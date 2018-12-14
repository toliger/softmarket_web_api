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

const Basket_Article = bookshelf.Model.extend({
  tableName: "basket_articles",
});

const Basket_Coupon = bookshelf.Model.extend({
  tableName: "basket_coupons",
});

const Coupon = bookshelf.Model.extend({
  tableName: "coupons",
});

const Command = bookshelf.Model.extend({
  tableName: "commands",
});

const Fdp = bookshelf.Model.extend({
  tableName: "basket_fdp",
});

module.exports = {
  User,
  Article,
  Sub_Category,
  Category,
  Basket_Article,
  Basket_Coupon,
  Coupon,
  Fdp,
  Command,
};
