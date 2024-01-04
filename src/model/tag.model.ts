import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import Product from './product.model';

export interface TagAttributes {
  id: number;
  name: string;
}

export interface TagInput extends Optional<TagAttributes, 'id'> {}
export interface TagOutput extends Required<TagAttributes> {}

/**
 * Represents a tag entity in a database.
 * Defines the structure and attributes of a tag, such as its id and name.
 */
class Tag extends Model<TagAttributes, TagInput> implements TagAttributes {
  public id!: number;
  public name!: string;
}

Tag.init(
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
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'tag',
  },
);

Product.belongsToMany(Tag, { through: 'product_tag' });
Tag.belongsToMany(Product, { through: 'product_tag' });

export default Tag;
