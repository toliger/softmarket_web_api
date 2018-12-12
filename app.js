const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const resolvers = require("./resolvers");
const models = require("./models");

const typeDefs = gql`
  type Article {
    id: String
    name: String
    description: String
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

  type Query {
    articles: [Article]
    sub_categories: [Sub_category]
    categories: [Category]
  }

  type Mutation {
    login(email: String!, password: String!): String
    register(email: String!, password: String!): String
    addArticle(name: String!, description: String!): Boolean
    addCategory(name: String!, description: String!): Boolean
    addSub_Category(name: String!, description: String!): Boolean
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
