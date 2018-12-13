exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("basket_articles", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("user");
      table.string("article");
      table.integer("amount").defaultTo(1);
      table.timestamps();
    })
    .then(() => {
      return knex("basket_articles").insert([
        {
          user: "AAA",
          article: "Carl of dirty",
          amount: 4,
        },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("basket_articles");
};
