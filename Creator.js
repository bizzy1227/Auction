const axios = require('axios');

function generateRandomName() {
  const names = ['Ivan', 'John', 'Kate', 'Michael', 'Sophia', 'David', 'Emma', 'Oliver', 'Olivia', 'Alexander'];
  return names[Math.floor(Math.random() * names.length)];
}

async function createUser() {
  try {
    const response = await axios.post('http://localhost:3000/users', {
      name: generateRandomName(),
    });
    return response.data.id;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
}

async function createRandomItem(userId) {
  try {
    const now = Date.now();
    const startTime = now + Math.floor(Math.random() * 60000);
    const endTime = startTime + Math.floor(Math.random() * 180000); 

    const response = await axios.post('http://localhost:3000/items', {
      name: 'Item ' + Math.floor(Math.random() * 1000),
      start_price: Math.floor(Math.random() * 100),
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString()
    }, {
      headers: {
        'X-User-ID': userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating item:', error.message);
    throw error;
  }
}

async function waitForAuctionsToEnd(userId) {
  try {
    let allAuctionsFinished = false;
    let items = [];
    while (!allAuctionsFinished) {
      const response = await axios.get('http://localhost:3000/items', {
        headers: {
          'X-User-ID': userId
        }
      });
      items = response.data;

      allAuctionsFinished = items.every(item => item.status === 'Finished');

      if (!allAuctionsFinished) {
        console.log('Some auctions are not finished yet. Waiting...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    const totalProfit = items.reduce((total, item) => {
      if (item.price !== null) {
        return total + Number(item.price);
      } else {
        return total;
      }
    }, 0);

    console.log(`All auctions have ended with total profit: ${totalProfit}`);

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function main() {
  try {
    const userId = await createUser();
    const itemsCount = Math.floor(Math.random() * 6) + 5;

    for (let i = 0; i < itemsCount; i++) {
      await createRandomItem(userId);
    }

    await waitForAuctionsToEnd(userId);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();