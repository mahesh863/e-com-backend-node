import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';

export interface ImageAttributes {
  id: number;
  url: string;
  productId?: number;
}

export interface ImageInput extends Optional<ImageAttributes, 'id'> {}
export interface ImageOutput extends Required<ImageAttributes> {}

/**
 * The Image class represents an image with attributes such as id, url, and productId.
 */
class Image extends Model<ImageAttributes, ImageInput> implements ImageAttributes {
  public id!: number;
  public url!: string;
  public productId!: number;
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'image',
  },
);

export default Image;
