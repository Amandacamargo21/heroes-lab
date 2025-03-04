import sequelize from "../config/database";
import Hero from "./hero.model";

const db = {
  sequelize,
  Hero,
};

export default db;
