import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import Product from './product.model';
import User from './user.model';

export interface CartAttributes {
  id: number;
  productId?: number;
  userId?: number;
  totalQuantity: number;
}

export interface CartInput extends Optional<CartAttributes, 'id'> {}
export interface CartOutput extends Required<CartAttributes> {}

/**
 * The Cart class represents a Cart with attributes such as id, product Id and user id and quantity.
 */
class Cart extends Model<CartAttributes, CartInput> implements CartAttributes {
  public id!: number;
  public productId!: number;
  public userId!: number;
  public totalQuantity!: number;
}
Cart.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    totalQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'cart',
  },
);

Product.hasMany(Cart, { onDelete: 'CASCADE', foreignKey: 'productId' });
Cart.belongsTo(Product, { onDelete: 'CASCADE', foreignKey: 'productId' });

User.hasMany(Cart, { onDelete: 'CASCADE', foreignKey: 'userId' });
Cart.belongsTo(User, { onDelete: 'CASCADE', foreignKey: 'userId' });

export default Cart;
