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
      table.boolean("active").defaultTo(true);

      table.timestamps();
    })
    .then(() => {
      return knex("articles").insert([
        {
          name: "Carl of dirty",
          categorie: "Games",
          sub_categorie: "Jeux vidéos",
          description: "A",
        },
        {
          name: "Ligo légende",
          categorie: "Games",
          sub_categorie: "Jeux vidéos",
          description: "BB",
        },
        {
          name: "CSGros",
          categorie: "Games",
          sub_categorie: "Jeux vidéos",
          description: "CCC",
        },
        {
          name: "Echecs",
          categorie: "Games",
          sub_categorie: "Jeux de plateau",
          description: "DDDD",
        },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("articles");
};
