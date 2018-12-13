exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("basket_fdp", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("country");
	table.string("state");
	table.integer("price");
      table.timestamps();
    }).then(() => {
      return knex("basket_fdp").insert([
        {
          country: "France",
	  state: "Alsace",
          price: 20,
        },
        {
          country: "Allemagnes",
          state: "Berlins",
          price: 400
        },
      ]);
    });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("basket_fdp");
};
