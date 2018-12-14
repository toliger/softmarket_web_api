const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v1");
const models = require("./models");

const secret = process.env.JWT_SECRET;

const expose = item => Object.assign(item, item.serialize({ shallow: true }));

async function getbasket() {
  let u_coupons = JSON.parse(
    JSON.stringify(await models.Basket_Coupon.where("user", "AAA").fetchAll()),
  );

  let coupons = [];
  let coupons_reduc = 0;
  for (i in u_coupons) {
    let c = JSON.parse(
      JSON.stringify(
        await models.Coupon.where("name", u_coupons[i].coupon).fetch(),
      ),
    );
    coupons_reduc += c.price;
    coupons.push(c);
  }

  let u_articles = JSON.parse(
    JSON.stringify(await models.Basket_Article.where("user", "AAA").fetchAll()),
  );

  let articles = [];
  for (i in u_articles) {
    let a = await models.Article.where("name", u_articles[i].article).fetch();

    if (a) {
      a = JSON.parse(JSON.stringify(a));
      a.amount = u_articles[i].amount;
      articles.push(a);
    }
  }

  let articles_price = 0;

  for (let i in articles) {
    articles_price += articles[i].price * articles[i].amount;
  }

  let total = articles_price - coupons_reduc;
  return { coupons, articles, articles_price, coupons_reduc, total };
}
module.exports = {
  Query: {
    articles: async (_, { categorie, subCategorie }, { dataSources }) => {
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
      return JSON.parse(
        JSON.stringify(
          await models.Sub_Category.where("categorie", categorie).fetchAll(),
        ),
      );
    },
    article: async (_, { uuid, amount }, { dataSources }) => {
      let res = await models.Article.where("id", uuid).fetch();
      if (res.amount < amount) res.amount = -1;
      else res.amount = amount;

      return JSON.parse(JSON.stringify(res));
    },
    basket: async (_, {}, { dataSources }) => {
      return getbasket();
    },
    estimate: async (_, { country, state }, { dataSources }) => {
      let fdp = JSON.parse(
        JSON.stringify(await models.Fdp.where("country", country).fetch()),
      );
      console.log(fdp);
      return fdp.price;
    },
    commands: async (_, {}, { dataSources }) => {
      let commands = JSON.parse(
        JSON.stringify(await models.Command.where("user", "AAA").fetchAll()),
      );

      return commands;
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
    addarticle_basket: async (_, { uuid }, { dataSources }) => {
      console.log(uuid);
      models.Basket_Article.where("user", "AAA")
        .where("article", uuid)
        .fetch()
        .then(async model => {
          console.log(model);
          if (model) {
            let amount = JSON.parse(JSON.stringify(model)).amount + 1;
            await model.set("amount", amount).save();
            return true;
          } else {
            try {
              const user = await new models.Basket_Article({
                user: "AAA",
                article: uuid,
              }).save();
              return true;
            } catch (e) {
              throw new Error("could not create sub categorie", e);
            }
          }
        });
    },
    rmarticle_basket: async (_, { uuid }, { dataSources }) => {
      console.log(uuid);
      models.Basket_Article.where("user", "AAA")
        .where("article", uuid)
        .destroy()
        .then(async model => {
          return true;
        });
    },
    addcoupon_basket: async (_, { uuid }, { dataSources }) => {
      try {
        const user = await new models.Basket_Coupon({
          user: "AAA",
          coupon: uuid,
        }).save();
        return true;
      } catch (e) {
        throw new Error("could not create sub categorie", e);
      }
    },
    rmcoupon_basket: async (_, { uuid }, { dataSources }) => {
      models.Basket_Coupon.where("user", "AAA")
        .where("coupon", uuid)
        .destroy()
        .then(async model => {
          return true;
        });
    },
    command: async (_, { adress, payment }, { dataSources }) => {
      const basket = await getbasket();
      const user = await new models.Command({
        name: "La bonne commande",
        user: "AAA",
        articles: basket.articles,
        total: basket.total,
        fdp: basket.fdp,
        adress,
        payment,
      }).save();
    },
  },
};
