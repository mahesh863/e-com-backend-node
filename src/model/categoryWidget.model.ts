import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import Product from './product.model';
import Collection from './collection.model';

export interface CategoryWidgetAttributes {
  id: number;
  name: string;
  header: string;
  subHeader: string;
  cta: string;
  image: string;
  type: string;
  collection?: number;
  product?: number;
}

export interface CategoryWidgetInput extends Optional<CategoryWidgetAttributes, 'id'> {}
export interface CategoryWidgetOutput extends Required<CategoryWidgetAttributes> {}

/**
 * The CategoryWidget class represents a categoryWidget with attributes such as id, name, header, subHeader, image, type and CTA.
 */
class CategoryWidget extends Model<CategoryWidgetAttributes, CategoryWidgetInput> implements CategoryWidgetAttributes {
  public id!: number;
  public name!: string;
  public header!: string;
  public subHeader!: string;
  public cta!: string;
  public image!: string;
  public type!: string;
  public product!: number;
  public collection!: number;
}
CategoryWidget.init(
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
    header: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subHeader: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'category_widget',
  },
);

Product.hasMany(CategoryWidget, { foreignKey: 'product', as: 'productData' });
CategoryWidget.belongsTo(Product, { foreignKey: 'product', as: 'productData' });

Collection.hasMany(CategoryWidget, { foreignKey: 'collection', as: 'collectionData' });
CategoryWidget.belongsTo(Collection, { foreignKey: 'collection', as: 'collectionData' });

export default CategoryWidget;
