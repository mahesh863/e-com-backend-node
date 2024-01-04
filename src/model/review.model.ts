import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import User from './user.model';

export interface ReviewAttributes {
  id: number;
  rating: number;
  comment: string;
  user?: number;
  isPublic: number;
}

export interface ReviewInput extends Optional<ReviewAttributes, 'id'> {}
export interface ReviewOutput extends Required<ReviewAttributes> {}

/**
 * Represents a review entity in the database.
 * Defines the attributes of a review, such as id, rating, comment, and user.
 * Implements the interfaces `ReviewAttributes` and `ReviewInput`.
 */
class Review extends Model<ReviewAttributes, ReviewInput> implements ReviewAttributes {
  public id!: number;
  public rating!: number;
  public comment!: string;
  public user!: number;
  public isPublic!: number;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    comment: {
      type: DataTypes.STRING,
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
    tableName: 'review',
  },
);

User.hasMany(Review, { onDelete: 'CASCADE', foreignKey: 'userId' });
Review.belongsTo(User, { onDelete: 'CASCADE', foreignKey: 'userId' });

export default Review;
