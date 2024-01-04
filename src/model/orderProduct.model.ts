import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';

export interface OrderProductAttributes {
  id: number;
  productId?: number;
  orderId?: number;
  quantity?: number;
}

export interface OrderProductInput extends Optional<OrderProductAttributes, 'id'> {}
export interface OrderProductOutput extends Partial<OrderProductAttributes> {}

/**
 * Represents a orderProduct  entity in a database.
 * Inherits the functionality of the `Model` class from Sequelize.
 * Implements the `OrderProductAttributes` interface.
 */
class OrderProduct extends Model<OrderProductAttributes, OrderProductInput> implements OrderProductAttributes {
  public id!: number;
  public name!: string;
}

OrderProduct.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      /* eslint-disable-next-line new-cap */
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'order_product',
  },
);

export default OrderProduct;
