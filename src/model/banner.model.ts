import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';

export interface BannerAttributes {
  id: number;
  imageUrl: string;
  headline: string;
  cta: string;
  redirectType: string;
  redirectDataId: number;
}

export interface BannerInput extends Optional<BannerAttributes, 'id'> {}
export interface BannerOutput extends Required<BannerAttributes> {}

/**
 * The Banner class represents an Banner with attributes such as id, imageUrl, headline, cta, redirectType and redirectDataId.
 */
class Banner extends Model<BannerAttributes, BannerInput> implements BannerAttributes {
  public id!: number;
  public imageUrl!: string;
  public headline!: string;
  public cta!: string;
  public redirectType!: string;
  public redirectDataId!: number;
}

Banner.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    headline: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    redirectType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    redirectDataId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'banner',
  },
);

export default Banner;
