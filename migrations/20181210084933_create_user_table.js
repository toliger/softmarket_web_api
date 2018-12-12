exports.up = function(knex, Promise) {
  return knex.schema
    .raw("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
    .createTable("users", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("username").unique();
      table.string("name");
      table.string("email").unique();
      table.string("password");
      table.timestamps();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
