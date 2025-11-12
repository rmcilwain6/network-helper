import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import { CREATE_CONTACTS_TABLE, CREATE_INDEXES } from './schema';

export class SQLiteDatabase {
  private db: Database.Database;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'network-helper.db');

    console.log('Database path:', dbPath);

    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize(): void {
    // Create tables
    this.db.exec(CREATE_CONTACTS_TABLE);

    // Create indexes
    CREATE_INDEXES.forEach((indexSQL) => {
      this.db.exec(indexSQL);
    });

    console.log('Database initialized');
  }

  close(): void {
    this.db.close();
  }
}
