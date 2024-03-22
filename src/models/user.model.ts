import { DataTypes, Model, Sequelize } from 'sequelize';

class User extends Model {
  public id!: number;
  public name!: string;
}

const initUserModel = (sequelize: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'users',
      timestamps: false,
    }
  );
}

export { User, initUserModel };
