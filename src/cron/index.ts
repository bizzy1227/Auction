import cron from 'node-cron';
import { Op } from 'sequelize';
import { Item } from '../models/item.model';

async function checkItemStatus() {
  try {
    const items = await Item.findAll({
      where: {
        status: {
          [Op.ne]: StatusEnum.FINISHED
        }
      }
    });
    const currentTime = new Date();

    for (const item of items) {
      let statusChanged = false;

      if (currentTime >= item.start_time && currentTime < item.end_time && item.status != StatusEnum.IN_PROGRESS) {
        item.status = StatusEnum.IN_PROGRESS;
        statusChanged = true;
      } 
      else if (currentTime >= item.end_time && item.status != StatusEnum.FINISHED) {
        item.status = StatusEnum.FINISHED;
        statusChanged = true;
      }

      if (statusChanged) {
        await item.save();
      }
    }
  } catch (error) {
    console.error('Error while updating item status:', error);
  }
}

cron.schedule('*/5 * * * * *', checkItemStatus);