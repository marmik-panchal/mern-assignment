const { MongoClient } = require('mongodb');

// MongoDB connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'Learning';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
async function getData() {
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db(dbName);
        const collection = db.collection('sales');

        const data = [
            {
                $addFields: {
                    date: { $toDate: "$date" }
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: {
                        store: "$store",
                        month: {
                            $dateToString: { format: "%Y-%m", date: "$date" }
                        }
                    },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                    averagePrice: { $avg: "$items.price" }
                }
            },
            {
                $project: {
                    _id: 0,
                    store: "$_id.store",
                    month: "$_id.month",
                    totalRevenue: 1,
                    averagePrice: { $round: ["$averagePrice", 2] }
                }
            },
            { $sort: { store: 1, month: 1 } }
        ];

        const result = await collection.aggregate(data).toArray();
        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error running aggregation:', err);
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
}

getData();
