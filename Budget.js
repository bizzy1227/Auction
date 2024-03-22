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
    try {
      const response = await axios.get('http://localhost:3000/items', {
        headers: {
          'X-User-ID': userId
        }
      });

      const items = response.data;

      auctionsEnd = items.length && items.every(item => item.status === 'Finished');

      for (const item of items) {
        if (item.status === 'In progress' && item?.owner_id !== userId) {
          const bidAmount = (item.owner_id ? +item.price : +item.start_price) + 1;

          if (bidAmount > +item.start_price * 1.5) {
            continue;
          }

          await axios.post(`http://localhost:3000/bids`, {
            price: bidAmount,
            item_id: item.id
          }, {
            headers: {
              'X-User-ID': userId
            }
          });
        }
      }

      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
      console.error('Error bidding on auctions:', error.message);
      await new Promise(resolve => setTimeout(resolve, 10000));
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
    console.log('Budget script wins:');
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