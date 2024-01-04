import { BelongsToManyAddAssociationMixin, DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import Product from './product.model';

export interface CollectionAttributes {
  id: number;
  name: string;
  bannerImage?: string;
  addProducts?: BelongsToManyAddAssociationMixin<Product, number[]>;
}

export interface CollectionInput extends Optional<CollectionAttributes, 'id'> {}
export interface CollectionOutput extends Required<CollectionAttributes> {}

/**
 * The Collection class represents a Collection with attributes such as id, name, products, and banner image.
 */
class Collection extends Model<CollectionAttributes, CollectionInput> implements CollectionAttributes {
  public id!: number;
  public name!: string;
  public bannerImage!: string;
  public addProducts!: BelongsToManyAddAssociationMixin<Product, number[]>;
}
Collection.init(
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
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'collection',
  },
);

Collection.belongsToMany(Product, { through: 'collection_product' });
Product.belongsToMany(Collection, { through: 'collection_product' });

export default Collection;
