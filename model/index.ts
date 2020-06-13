/*eslint-disable no-unused-vars*/
import { Sequelize } from 'sequelize';
import example from './example';

export default (sequelize: Sequelize) => {
  example(sequelize);
};
