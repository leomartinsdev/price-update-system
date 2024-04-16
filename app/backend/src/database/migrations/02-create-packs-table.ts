import { Model, QueryInterface, DataTypes } from 'sequelize';
import { IPack } from '../../interfaces/Packs/IPack';

export default {
    up(queryInterface: QueryInterface) {
        return queryInterface.createTable<Model<IPack>>('packs', {
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
            }
            });
    },
    down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('packs');
    },
}