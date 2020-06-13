/*eslint-disable no-unused-vars*/
import { Sequelize, DataTypes, Model, Utils } from 'sequelize';

class Example extends Model {}
export default (sequelize: Sequelize) => {
  Example.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      aa: {
        type: DataTypes.STRING,
      },
      bb: {
        type: DataTypes.STRING,
        field: 'bb_bb',
      },
      createdAt: {
        type: DataTypes.TIME,
        field: 'created_at',
        defaultValue: new Utils.Fn('NOW', []),
      },
      updatedAt: {
        type: DataTypes.TIME,
        field: 'updated_at',
        defaultValue: new Utils.Fn('NOW', []),
      },
    },
    {
      sequelize,
      modelName: 'script_example',
    }
  );
};
