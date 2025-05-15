import { MongoClient, Db } from 'mongodb';

// Use non-null assertion (!) since you are sure the env vars exist
const uri = process.env.MONGODB_URI!;
const dbName = process.env.DB_NAME!;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

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
