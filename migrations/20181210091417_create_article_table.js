exports.up = function(knex, Promise) {
  return knex.schema.createTable("articles", function(table) {
    table
      .uuid("id")
      .unique()
      .defaultTo(knex.raw("gen_random_uuid()"))
      .primary();
    table.string("name");
    table.string("description");
    table.boolean("active").defaultTo(true);

    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("articles");
};
