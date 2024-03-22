import { DataTypes, Model, Sequelize } from 'sequelize';

class Bid extends Model {
  public id!: number;
  public item_id!: number;
  public user_id!: number;
  public price!: number;
  public created_at!: Date;
}

const initBidModel = (sequelize: Sequelize): void => {
  Bid.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'bids',
      timestamps: false,
    }
  );
}

export { Bid, initBidModel };
