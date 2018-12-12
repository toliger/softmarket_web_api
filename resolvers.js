const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v1");
const models = require("./models");

const secret = process.env.JWT_SECRET;

const expose = item => Object.assign(item, item.serialize({ shallow: true }));

module.exports = {
  Query: {
    articles: async (_, { categorie, subCategorie }, { dataSources }) => {
      console.log(subCategorie);
      return JSON.parse(
        JSON.stringify(
          await models.Article.where("sub_categorie", subCategorie).fetchAll(),
        ),
      );
    },
    categories: async (_, {}, { dataSources }) => {
      return JSON.parse(
        JSON.stringify(await models.Category.where("active", true).fetchAll()),
      );
    },
    sub_categories: async (_, { categorie }, { dataSources }) => {
      console.log("oui", categorie);
      return JSON.parse(
        JSON.stringify(
          await models.Sub_Category.where("categorie", categorie).fetchAll(),
        ),
      );
    },
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      try {
        const user = await models.User.where({
          email,
        }).fetch();

        if (!(await bcrypt.compare(password, user.get("password")))) {
          throw new Error("bad credentials");
        }

        return jwt.sign({ uid: user.get("id") }, secret, { expiresIn: "2h" });
      } catch (e) {
        throw new Error("login failed");
      }
    },
    register: async (_, { email, password }, { dataSources }) => {
      const hash = bcrypt.hashSync(password, 8);

      try {
        const user = await new models.User({
          username: email,
          name: email,
          email,
          password: hash,
        }).save();
        return jwt.sign({ uid: user.get("id") }, secret, { expiresIn: "2h" });
      } catch (e) {
        throw new Error("could not create user: it may already exists");
      }
    },
    addArticle: async (_, { name, description }, { dataSources }) => {
      try {
        const user = await new models.Article({
          name,
          description,
        }).save();
        return true;
      } catch (e) {
        throw new Error("could not create article");
      }
    },
    addCategory: async (_, { name, description }, { dataSources }) => {
      try {
        const user = await new models.Category({
          name,
          description,
        }).save();
        return true;
      } catch (e) {
        throw new Error("could not create categorie", e);
      }
    },
    addSub_Category: async (_, { name, description }, { dataSources }) => {
      try {
        const user = await new models.Sub_Category({
          name,
          description,
        }).save();
        return true;
      } catch (e) {
        throw new Error("could not create sub categorie", e);
      }
    },
  },
};
