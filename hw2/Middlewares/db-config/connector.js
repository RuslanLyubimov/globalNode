const { Sequelize } = require("sequelize");

export const sequelize = new Sequelize(
  "postgres://sbpxwecv:7toJ_0ofFGm2sjVN9ktZftGqvasq9ohk@mouse.db.elephantsql.com/sbpxwecv"
);

export const runDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
