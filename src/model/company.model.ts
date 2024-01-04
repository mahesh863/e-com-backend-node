import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';

export interface CompanyAttributes {
  id: number;
  name: string;
  isPublic: boolean;
  image: string;
}

export interface CompanyInput extends Optional<CompanyAttributes, 'id'> {}
export interface CompanyOutput extends Required<CompanyAttributes> {}

/**
 * The Company class is a TypeScript model representing a company with attributes such as id and name.
 */
class Company extends Model<CompanyAttributes, CompanyInput> implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public image!: string;
  public isPublic!: boolean;
}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'company',
  },
);

export default Company;
