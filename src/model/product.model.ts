import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import Image from './image.mode';
import Category from './category.model';
import Company from './company.model';

interface ImageAttributes {
  url: string;
}

export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  isPublic: boolean;
  sold: number;
  companyId?: number;
  categoryId?: number;
  Images?: ImageAttributes[];
}

export interface ProductInput extends Optional<ProductAttributes, 'id'> {}
export interface ProductOutput extends Partial<ProductAttributes> {}

/**
 * Represents a product entity in a database.
 * Inherits the functionality of the `Model` class from Sequelize.
 * Implements the `ProductAttributes` interface.
 */
class Product extends Model<ProductAttributes, ProductInput> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public stock!: number;
  public sold!: number;
  public price!: number;
  public isPublic!: boolean;
  public Images!: ImageAttributes[];
}

Product.init(
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
    description: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    sold: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
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
    tableName: 'product',
  },
);

Product.hasMany(Image, { onDelete: 'CASCADE', foreignKey: 'productId' });
Image.belongsTo(Product, { onDelete: 'CASCADE', foreignKey: 'productId' });

Category.hasMany(Product, { onDelete: 'CASCADE', foreignKey: 'categoryId' });
Product.belongsTo(Category, { onDelete: 'CASCADE', foreignKey: 'categoryId' });

Company.hasMany(Product, { onDelete: 'CASCADE', foreignKey: 'companyId' });
Product.belongsTo(Company, { onDelete: 'CASCADE', foreignKey: 'companyId' });

export default Product;
