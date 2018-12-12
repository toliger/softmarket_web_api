exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("article_categories", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("name").unique();
      table.string("description");
      table.boolean("active").defaultTo(true);
      table.timestamps();
    })
    .then(() => {
      return knex("article_categories").insert([
        { name: "Office", description: "A" },
        { name: "Multimedia", description: "BB" },
        { name: "Design", description: "CCC" },
        { name: "Developer", description: "DDDD" },
        { name: "Utilities", description: "DDDD" },
        { name: "Games", description: "DDDD" },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("article_categories");
};
