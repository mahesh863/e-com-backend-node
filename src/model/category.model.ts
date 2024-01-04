import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';

export interface CategoryAttributes {
  id: number;
  name: string;
  tax: number;
  isPublic: boolean;
  image: string;
}

export interface CategoryInput extends Optional<CategoryAttributes, 'id'> {}
export interface CategoryOutput extends Required<CategoryAttributes> {}

/**
 * The Category class represents a category with attributes such as id, name, tax, and image.
 */
class Category extends Model<CategoryAttributes, CategoryInput> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public tax!: number;
  public image!: string;
  public isPublic!: boolean;
}
Category.init(
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
    tax: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 18,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'category',
  },
);

export default Category;
