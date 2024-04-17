import { Model, QueryInterface, DataTypes } from 'sequelize';
import { IProduct } from '../../interfaces/Products/IProduct';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IProduct>>('products', {
      code: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: false,
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
    });
  },

  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('products');
  },
};
