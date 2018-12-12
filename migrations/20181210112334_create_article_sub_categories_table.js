exports.up = function(knex, Promise) {
  return knex.schema.createTable("article_sub_categories", function(table) {
    table
      .uuid("id")
      .unique()
      .defaultTo(knex.raw("gen_random_uuid()"))
      .primary();
    table.string("name").unique();
    table.string("categorie").defaultTo("Others");
    table.string("description");
    table.boolean("active").defaultTo(true);
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("article_sub_categories");
};
