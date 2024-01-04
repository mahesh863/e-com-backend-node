import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import Product from './product.model';
import OrderStatus from './orderStatus.model';

export interface OrderItemsAttributes {
  id: number;
  productId?: number;
  productQuantity: number;
  totalAmount: string;
  orderStatusId?: number;
}

export interface OrderItemsInput extends Optional<OrderItemsAttributes, 'id'> {}
export interface OrderItemsOutput extends Partial<OrderItemsAttributes> {}

/**
 * Represents a orderItems  entity in a database.
 * Inherits the functionality of the `Model` class from Sequelize.
 * Implements the `OrderItemsAttributes` interface.
 */
class OrderItems extends Model<OrderItemsAttributes, OrderItemsInput> implements OrderItemsAttributes {
  public id!: number;
  public productId!: number;
  public productQuantity!: number;
  public totalAmount!: string;
  public orderStatusId!: number;
}

OrderItems.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    totalAmount: {
      /* eslint-disable-next-line new-cap */
      type: DataTypes.STRING,
      allowNull: false,
    },
    productQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'order_items',
  },
);

OrderItems.belongsTo(Product, { foreignKey: 'productId', as: 'product ' });
Product.hasMany(OrderItems, { foreignKey: 'productId', as: 'product ' });

OrderItems.belongsTo(OrderStatus, { foreignKey: 'orderStatusId', as: 'orderStatus' });
OrderStatus.hasMany(OrderItems, { foreignKey: 'orderStatusId', as: 'orderStatus' });

export default OrderItems;
