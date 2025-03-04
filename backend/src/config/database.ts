import { Sequelize } from "sequelize";
import config from "../config/config.json";

const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment as keyof typeof config];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect as any,
  timezone: "-03:00",
  logging: false, // Remover logs SQL do console
});

sequelize.authenticate()
  .then(() => console.log("Conexão com o banco de dados foi bem-sucedida!"))
  .catch((err) => console.error("Erro ao conectar com o banco de dados:", err));

export default sequelize;
