import { Db } from 'mongodb';
import { User } from '../types/types';

export class UserModel {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAllUsers(): Promise<User[]> {
  return this.db.collection('users').find<User>({}).toArray();
}


  async createUser(user: User): Promise<void> {
    await this.db.collection('users').insertOne(user);
  }

  async getUser(userId: number): Promise<User | null> {
    return this.db.collection('users').findOne<User>({ id: userId });
  }

  async deleteUser(userId: number): Promise<boolean> {
    const result = await this.db.collection('users').deleteOne({ id: userId });
    return result.deletedCount === 1;
  }

  async deleteAllUsers(): Promise<void> {
    await this.db.collection('users').deleteMany({});
  }

  async userExists(userId: number): Promise<boolean> {
    const count = await this.db.collection('users').countDocuments({ id: userId });
    return count > 0;
  }

  async getMaxUserId(): Promise<number> {
    const result = await this.db.collection('users')
      .find<{ id: number }>({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    return result.length > 0 ? result[0].id : 0;
  }
}