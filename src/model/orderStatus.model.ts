import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';

export interface OrderStatusAttributes {
  id: number;
  name: string;
}

export interface OrderStatusInput extends Optional<OrderStatusAttributes, 'id'> {}
export interface OrderStatusOutput extends Partial<OrderStatusAttributes> {}

/**
 * Represents a order status entity in a database.
 * Inherits the functionality of the `Model` class from Sequelize.
 * Implements the `OrderStatusAttributes` interface.
 */
class OrderStatus extends Model<OrderStatusAttributes, OrderStatusInput> implements OrderStatusAttributes {
  public id!: number;
  public name!: string;
}

OrderStatus.init(
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
    tableName: 'order_status',
  },
);

export default OrderStatus;
