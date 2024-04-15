import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from 'sequelize';
import db from '.';
import SequelizeProducts from './SequelizeProducts';

class SequelizePacks extends Model<
  InferAttributes<SequelizePacks>,
  InferCreationAttributes<SequelizePacks>
> {
  declare id: CreationOptional<number>;
  declare pack_id: number;
  declare product_id: number;
  declare qty: number;
}

SequelizePacks.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    pack_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    qty: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'packs',
    timestamps: false,
    underscored: true,
  }
);

SequelizePacks.belongsToMany(SequelizeProducts, {
  through: 'packs',
  foreignKey: 'pack_id',
  otherKey: 'product_id',
});

SequelizeProducts.belongsToMany(SequelizePacks, {
  through: 'packs',
  foreignKey: 'product_id',
  otherKey: 'pack_id',
});

export default SequelizePacks;
