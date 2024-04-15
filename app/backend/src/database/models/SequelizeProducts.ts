import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';

class SequelizeProducts extends Model<
  InferAttributes<SequelizeProducts>,
  InferCreationAttributes<SequelizeProducts>
> {
  declare code: CreationOptional<number>;
  declare name: string;
  declare cost_price: number;
  declare sale_price: number;
}

SequelizeProducts.init(
  {
    code: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cost_price: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'products',
    timestamps: false,
    underscored: true,
  }
);

export default SequelizeProducts;
