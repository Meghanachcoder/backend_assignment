import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  if (!dbName) {
    throw new Error('DB_NAME is not defined in environment variables');
  }

  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  console.log('Connecting to MongoDB with URI:', uri);
  console.log('Using DB:', dbName);

  const client = await MongoClient.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 50,
    wtimeoutMS: 2500,
  });

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return db;
}

process.on('SIGINT', async () => {
  if (cachedClient) {
    await cachedClient.close();
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  }
});
