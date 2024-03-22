import { Model, DataTypes, Sequelize } from 'sequelize';


class Item extends Model {
  public id!: number;
  public name!: string;
  public start_price!: number;
  public start_time!: Date;
  public end_time!: Date;
  public owner_id!: number | null;
  public status!: StatusEnum;
}

const initItemModel = (sequelize: Sequelize): void => {
  Item.init(
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
      start_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM(StatusEnum.NOT_STARTED, StatusEnum.IN_PROGRESS, StatusEnum.FINISHED),
        defaultValue: StatusEnum.NOT_STARTED,
      },
    },
    {
      sequelize,
      modelName: 'items',
      timestamps: false,
    }
  );
}


export { Item, initItemModel };
