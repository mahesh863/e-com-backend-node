import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import Widget from './widget.model';

export interface HomeAttributes {
  id: number;
  position: number;
  widget?: number;
}

export interface HomeInput extends Optional<HomeAttributes, 'id'> {}
export interface HomeOutput extends Required<HomeAttributes> {}

/**
 * Represents a Home entity in a database.
 * Defines the structure and attributes of a Home, such as its id and name.
 */
class Home extends Model<HomeAttributes, HomeInput> implements HomeAttributes {
  public id!: number;
  public position!: number;
  public widget!: number;
}

Home.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    position: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: false,
    sequelize: sequelizeConnection,
    tableName: 'home',
  },
);

Widget.hasMany(Home, { foreignKey: 'widget' });
Home.belongsTo(Widget, { foreignKey: 'widget' });

export default Home;
