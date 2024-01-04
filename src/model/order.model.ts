import { BelongsToManyAddAssociationMixin, DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import User from './user.model';
import OrderStatus from './orderStatus.model';
import OrderItems from './orderItems.model';

export interface OrderAttributes {
  id: number;
  userId?: number;
  statusId?: number;
  transactionId?: string;
  orderItems?: OrderItems[];
  addOrderItems?: BelongsToManyAddAssociationMixin<OrderItems, number[]>;
}

export interface OrderInput extends Optional<OrderAttributes, 'id'> {}
export interface OrderOutput extends Partial<OrderAttributes> {}

/**
 * Represents a order  entity in a database.
 * Inherits the functionality of the `Model` class from Sequelize.
 * Implements the `OrderAttributes` interface.
 */
class Order extends Model<OrderAttributes, OrderInput> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public statusId!: number;
  public transactionId!: string;
  public orderItems!: OrderItems[];
  public addOrderItems!: BelongsToManyAddAssociationMixin<OrderItems, number[]>;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    transactionId: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'order',
  },
);

Order.belongsToMany(OrderItems, {
  through: 'order_items_order',
  as: 'orderItems',
});
OrderItems.belongsToMany(Order, {
  through: 'order_items_order',
  as: 'orderItems',
});

Order.hasMany(User, { onDelete: 'CASCADE', foreignKey: 'userId' });
User.belongsTo(Order, { onDelete: 'CASCADE', foreignKey: 'userId' });

OrderStatus.hasMany(Order, { onDelete: 'CASCADE', foreignKey: 'statusId' });
Order.belongsTo(OrderStatus, { onDelete: 'CASCADE', foreignKey: 'statusId' });
export default Order;
