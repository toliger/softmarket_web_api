exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("basket_coupons", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("user");
      table.string("coupon");
      table.timestamps();
    })
    .then(() => {
      return knex("basket_coupons").insert([
        {
          user: "AAA",
          coupon: "Black Freeday",
        },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("basket_coupons");
};
