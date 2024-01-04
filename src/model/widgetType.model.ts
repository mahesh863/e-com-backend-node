import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';

export interface WidgetTypeAttributes {
  id: number;
  name: string;
}

export interface WidgetTypeInput extends Optional<WidgetTypeAttributes, 'id'> {}
export interface WidgetTypeOutput extends Required<WidgetTypeAttributes> {}

/**
 * The WidgetType class represents an WidgetType with attributes such as id, imageUrl, headline, cta, redirectType and redirectDataId.
 */
class WidgetType extends Model<WidgetTypeAttributes, WidgetTypeInput> implements WidgetTypeAttributes {
  public id!: number;
  public name!: string;
}

WidgetType.init(
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
    tableName: 'widget_type',
  },
);

export default WidgetType;
