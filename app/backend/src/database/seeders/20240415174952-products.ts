import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('products', [
      {
        code: 16,
        name: 'AZEITE PORTUGUÊS EXTRA VIRGEM GALLO 500ML',
        cost_price: 18.44,
        sales_price: 20.49,
      },
      {
        code: 18,
        name: 'BEBIDA ENERGÉTICA VIBE 2L',
        cost_price: 8.09,
        sales_price: 8.99,
      },
      {
        code: 19,
        name: 'ENERGÉTICO RED BULL ENERGY DRINK 250ML',
        cost_price: 6.56,
        sales_price: 7.29,
      },
      {
        code: 20,
        name: 'ENERGÉTICO RED BULL ENERGY DRINK 355ML',
        cost_price: 9.71,
        sales_price: 10.79,
      },
      {
        code: 21,
        name: 'BEBIDA ENERGÉTICA RED BULL RED EDITION 250ML',
        cost_price: 10.71,
        sales_price: 11.71,
      },
      {
        code: 22,
        name: 'ENERGÉTICO RED BULL ENERGY DRINK SEM AÇÚCAR 250ML',
        cost_price: 6.74,
        sales_price: 7.49,
      },
      {
        code: 23,
        name: 'ÁGUA MINERAL BONAFONT SEM GÁS 1,5L',
        cost_price: 2.15,
        sales_price: 2.39,
      },
      {
        code: 24,
        name: 'FILME DE PVC WYDA 28CMX15M',
        cost_price: 3.59,
        sales_price: 3.99,
      },
      {
        code: 26,
        name: 'ROLO DE PAPEL ALUMÍNIO WYDA 30CMX7,5M',
        cost_price: 5.21,
        sales_price: 5.79,
      },
      {
        code: 1000,
        name: 'BEBIDA ENERGÉTICA VIBE 2L - 6 UNIDADES',
        cost_price: 48.54,
        sales_price: 53.94,
      },
      {
        code: 1010,
        name: 'KIT ROLO DE ALUMÍNIO + FILME PVC WYDA',
        cost_price: 8.8,
        sales_price: 9.78,
      },
      {
        code: 1020,
        name: 'SUPER PACK RED BULL VARIADOS - 6 UNIDADES',
        cost_price: 51.81,
        sales_price: 57.00,
      },
    ]);
  },
};
