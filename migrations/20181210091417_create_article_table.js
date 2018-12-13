exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("articles", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("name");
      table.string("description");
      table.string("categorie");
      table.string("sub_categorie");
      table.integer("price").defaultTo(0);
      table.boolean("active").defaultTo(true);

      table.timestamps();
    })
    .then(() => {
      return knex("articles").insert([
        {
          name: "Carl of dirty",
          categorie: "Games",
          sub_categorie: "Jeux vidéos",
          price: 80,
          description: "A",
        },
        {
          name: "Ligo légende",
          categorie: "Games",
          sub_categorie: "Jeux vidéos",
          price: 0,
          description: "BB",
        },
        {
          name: "CSGros",
          categorie: "Games",
          sub_categorie: "Jeux vidéos",
          price: 15,
          description: "CCC",
        },
        {
          name: "Echecs",
          categorie: "Games",
          sub_categorie: "Jeux de plateau",
          price: 20,
          description: "DDDD",
        },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("articles");
};
