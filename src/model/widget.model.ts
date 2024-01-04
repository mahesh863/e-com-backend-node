import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import { Json } from 'sequelize/types/utils';
import WidgetType from './widgetType.model';

export interface WidgetAttributes {
  id: number;
  type?: number;
  widgetData: Json;
  name: string;
}

export interface WidgetInput extends Optional<WidgetAttributes, 'id'> {}
export interface WidgetOutput extends Required<WidgetAttributes> {}

/**
 * The Widget class represents an Widget with attributes such as id, imageUrl, headline, cta, redirectType and redirectDataId.
 */
class Widget extends Model<WidgetAttributes, WidgetInput> implements WidgetAttributes {
  public id!: number;
  public type!: number;
  public widgetData!: Json;
  public name!: string;
}

Widget.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    widgetData: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'widget',
  },
);

WidgetType.hasMany(Widget, { foreignKey: 'type' });
Widget.belongsTo(WidgetType, { foreignKey: 'type' });

export default Widget;
