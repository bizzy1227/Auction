#!/bin/bash

SQL_FILE="init.sql"
echo "Initializing database..."
mysql -h 127.0.0.1 -P 3306 -u root -p"root" auction_db < "$SQL_FILE"

echo "Cleaning up the database..."
mysql -h 127.0.0.1 -P 3306 -u root -p"root" auction_db -e "DELETE FROM bids;"
mysql -h 127.0.0.1 -P 3306 -u root -p"root" auction_db -e "DELETE FROM users;"
mysql -h 127.0.0.1 -P 3306 -u root -p"root" auction_db -e "DELETE FROM items"

if [ $? -eq 0 ]; then
    echo "Database initialized successfully."

    echo "Installing Node.js dependencies..."
    npm install

    echo "Starting Node.js application..."
    npm run start &

    API_PID=$!
    echo "API server PID: $API_PID"

    sleep 5

    echo "Running Node.js test scripts..."
    node Creator.js &
    CREATOR_PID=$!

    node Greedy.js &
    GREEDY_PID=$!

    node Budget.js &
    BUDGET_PID=$!

    node Chaotic.js &
    CHAOTIC_PID=$!

    wait $CREATOR_PID
    wait $GREEDY_PID
    wait $BUDGET_PID
    wait $CHAOTIC_PID

    echo "All test scripts have completed execution."

    echo "Stopping Node.js application..."
    pkill -P $API_PID

    NODE_PID=$(pgrep -f "node dist/index.js")

    if [ -z "$NODE_PID" ]; then
        echo "Failed to find PID of node dist/index.js process."
    else
        kill -TERM $NODE_PID
        sleep 5
        kill -KILL $NODE_PID
    fi
else
    echo "Failed to initialize database."
    exit 1
fi
