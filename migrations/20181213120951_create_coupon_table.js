exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("coupons", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("name");
      table.string("description");
      table.integer("price").defaultTo(0);

      table.timestamps();
    })
    .then(() => {
      return knex("coupons").insert([
        {
          name: "Black Freeday",
          description: "La bonne reduction",
          price: 10,
        },
        {
          name: "Le coupon du bonheur",
          description: "Le coupon qui rend heureux",
          price: 30,
        },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("coupons");
};
