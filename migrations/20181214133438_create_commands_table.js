exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("commands", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("user");
      table.string("name").defaultTo("No name");
      table.string("articles");
      table.string("payment");
      table.string("adress").defaultTo("1 rue du pré 67000 Strasbourg");
      table.integer("fdp").defaultTo(0);
      table.integer("total");
      table.timestamps(true, true);
    })
    .then(() => {
      return knex("commands").insert([
        {
          name: "La fameuse",
          user: "AAA",
          total: 10000,
          payment: "Paypal",
        },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("commands");
};
