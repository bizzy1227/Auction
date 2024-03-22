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

async function bidOnAuctions(userId) {
  let auctionsEnd = false;

  while (!auctionsEnd) {
    const sleepTime = Math.floor(Math.random() * 30000);

    try {
      const response = await axios.get('http://localhost:3000/items', {
        headers: {
          'X-User-ID': userId
        }
      });

      const items = response.data;

      auctionsEnd = items.length && items.every(item => item.status === 'Finished');

      const inProgressItems = items.filter(item => item.status === 'In progress' && item.owner_id !== userId);

      if (inProgressItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * inProgressItems.length);
        const randomItem = inProgressItems[randomIndex];

        const minBid = (randomItem.owner_id ? +randomItem.price : +randomItem.start_price) + 1;
        const maxBid = minBid + Math.floor(Math.random() * 100);

        const bidAmount = minBid + Math.floor(Math.random() * (maxBid - minBid + 1));

        await axios.post(`http://localhost:3000/bids`, {
          price: bidAmount,
          item_id: randomItem.id
        }, {
          headers: {
            'X-User-ID': userId
          }
        });
      }

      await new Promise(resolve => setTimeout(resolve, sleepTime));
    } catch (error) {
      console.error('Error bidding on auctions:', error.message);
      await new Promise(resolve => setTimeout(resolve, sleepTime));
      continue;
    }
  }
}

async function main() {
  try {
    const userId = await createUser();

    await bidOnAuctions(userId);

    const response = await axios.get('http://localhost:3000/items', {
      headers: {
        'X-User-ID': userId
      }
    });

    const items = response.data;
    console.log('Chaotic script wins:');
    if (items.length) {
      for (const item of items) {
        if (item.owner_id === userId) {
          console.log(`Item ID: ${item.id}, Price: ${item.price}`);
        }
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();