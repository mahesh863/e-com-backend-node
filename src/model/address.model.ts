import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import User from './user.model';
import Order from './order.model';

export interface AddressAttributes {
  id: number;
  name: string;
  address1: string;
  address2: string;
  pinCode: string;
  city: string;
  state: string;
  email: string;
  phoneNumber: string;
  userId?: number;
  orderId?: number;
}

export interface AddressInput extends Optional<AddressAttributes, 'id'> {}
export interface AddressOutput extends Required<AddressAttributes> {}

/**
 * The Banner class represents an Address with attributes such as id, name, address1, address2, pinCode, city, state, email, phoneNumber.
 */
class Address extends Model<AddressAttributes, AddressInput> implements AddressAttributes {
  public id!: number;
  public name!: string;
  public address1!: string;
  public address2!: string;
  public pinCode!: string;
  public city!: string;
  public state!: string;
  public email!: string;
  public phoneNumber!: string;
  public userId!: number;
  public orderId!: number;
}

Address.init(
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
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'address',
  },
);

export default Address;

User.hasMany(Address, { onDelete: 'CASCADE', foreignKey: 'userId', as: 'user' });
Address.belongsTo(User, { onDelete: 'CASCADE', foreignKey: 'userId', as: 'user' });

Order.hasMany(Address, { onDelete: 'CASCADE', foreignKey: 'orderId', as: 'order' });
Address.belongsTo(Order, { onDelete: 'CASCADE', foreignKey: 'orderId', as: 'order' });
