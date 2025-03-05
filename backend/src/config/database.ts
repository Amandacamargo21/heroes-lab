import { Sequelize } from "sequelize";
import config from "../config/config.json";

const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment as keyof typeof config];

const sequelize = new Sequelize(
  environment === "test"
    ? "sqlite::memory:" // Usa SQLite em memória nos testes
    : dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: environment === "test" ? "sqlite" : (dbConfig.dialect as any),
    logging: false,
    ...(environment !== "test" && { timezone: "-03:00" }), // Define timezone apenas se **não** estiver em test
  }
);

// Apenas autentica se **não estiver nos testes**
if (environment !== "test") {
  sequelize.authenticate()
    .then(() => console.log("Conexão com o banco de dados foi bem-sucedida!"))
    .catch((err) => console.error("Erro ao conectar com o banco de dados:", err));
}

export default sequelize;
