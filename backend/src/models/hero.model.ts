import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Hero extends Model {
  public id!: string;
  public name!: string;
  public nickname!: string;
  public date_of_birth!: Date;
  public universe!: string;
  public main_power!: string;
  public avatar_url!: string;
  public is_active!: boolean;
}

Hero.init(
  {
    id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    universe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    main_power: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Hero",
    tableName: "heroes",
  }
);

export default Hero;
