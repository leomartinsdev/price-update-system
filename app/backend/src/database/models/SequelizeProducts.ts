import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import SequelizePacks from './SequelizePacks';

class SequelizeProducts extends Model<
  InferAttributes<SequelizeProducts>,
  InferCreationAttributes<SequelizeProducts>
> {
  declare code: CreationOptional<number>;
  declare name: string;
  declare cost_price: number;
  declare sales_price: number;
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
    sales_price: {
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

// SequelizeProducts.hasMany(SequelizePacks, {
//   foreignKey: 'pack_id',
//   as: 'packs',
// });

// SequelizeProducts.hasMany(SequelizePacks, {
//   foreignKey: 'product_id',
//   as: 'includedInPacks',
// });

export default SequelizeProducts;
