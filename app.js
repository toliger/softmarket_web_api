const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const resolvers = require("./resolvers");
const models = require("./models");

const typeDefs = gql`
  type Article {
    id: String
    name: String
    amount: Int
    description: String
    price: Int
  }

  type Sub_category {
    id: String
    name: String
    description: String
  }

  type Category {
    id: String
    name: String
    description: String
    sub_categories: [Sub_category]
  }

  type Card {
    name: String
    available: Boolean
    amount: Int
  }

  type Coupon {
    id: String
    name: String
    price: Int
    description: String
  }

  type Basket {
    coupons: [Coupon]
    articles: [Article]
    articles_price: Int
    coupons_reduc: Int
    total: Int
    fdp: Int
  }

  type Command {
    id: String
    name: String
    total: Int
    fdp: Int
    created_at: String
    update_at: String
    adress: String
    payment: String
  }

  type Query {
    articles(categorie: String!, subCategorie: String!): [Article]
    article(uuid: String!, amount: Int!): Article
    sub_categories(categorie: String!): [Sub_category]
    categories: [Category]
    basket: Basket
    estimate(country: String!, state: String!): Int
    commands: [Command]
  }

  type Mutation {
    login(email: String!, password: String!): String
    register(email: String!, password: String!): String
    addArticle(name: String!, description: String!): Boolean
    addCategory(name: String!, description: String!): Boolean
    addSub_Category(name: String!, description: String!): Boolean
    addarticle_basket(uuid: String!): Boolean
    addcoupon_basket(uuid: String!): Boolean
    rmarticle_basket(uuid: String!): Boolean
    rmcoupon_basket(uuid: String!): Boolean
    addadress(
      country: String!
      state: String!
      zipcode: Int!
      ville: String!
      num: String!
      rue: String!
    ): Boolean
    command(adress: String!, payment: String!): Boolean
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const header = req.headers.authorization || "";

    if (header) {
      const s = header.split(" ");
      if (s.length == 2 && s[0] == "Bearer") {
        const token = s[1];
        if (!jwt.verify(token, process.env.JWT_SECRET))
          throw new Error("Invalid token");

        const content = jwt.decode(token);
        const user = await models.User.where("id", content.uid).fetch();
        return {
          authenticated: true,
          user,
          headers: req.headers,
        };
      }
    }

    return { authenticated: false, headers: req.headers };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
