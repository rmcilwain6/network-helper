import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import { CREATE_CONTACTS_TABLE, CREATE_INDEXES } from './schema';
import {
  Contact,
  CreateContactInput,
  UpdateContactInput,
} from '../../shared/types';
import { randomUUID } from 'crypto';

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

  // Convert database row to Contact object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToContact(row: any): Contact {
    return {
      id: row.id,
      name: row.name,
      location: row.location || undefined,
      lastContact: row.last_contact || undefined,
      contactFrequency: row.contact_frequency || undefined,
      customFrequencyDays: row.custom_frequency_days || undefined,
      notes: row.notes || undefined,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // READ - Get all contacts
  getAllContacts(): Contact[] {
    const stmt = this.db.prepare('SELECT * FROM contacts ORDER BY name');
    const rows = stmt.all();
    return rows.map((row) => this.rowToContact(row));
  }

  // READ - Get contact by ID
  getContactById(id: string): Contact | null {
    const stmt = this.db.prepare('SELECT * FROM contacts WHERE id = ?');
    const row = stmt.get(id);
    return row ? this.rowToContact(row) : null;
  }

  // CREATE - Add new contact
  createContact(input: CreateContactInput): Contact {
    const id = randomUUID();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO contacts (
        id, name, location, last_contact, contact_frequency, 
        custom_frequency_days, notes, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.name,
      input.location || null,
      input.lastContact || null,
      input.contactFrequency || null,
      input.customFrequencyDays || null,
      input.notes || null,
      input.tags ? JSON.stringify(input.tags) : null,
      now,
      now
    );

    return this.getContactById(id)!;
  }

  // UPDATE - Modify existing contact
  updateContact(input: UpdateContactInput): Contact | null {
    const existing = this.getContactById(input.id);
    if (!existing) return null;

    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      UPDATE contacts SET
        name = ?,
        location = ?,
        last_contact = ?,
        contact_frequency = ?,
        custom_frequency_days = ?,
        notes = ?,
        tags = ?,
        updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      input.name ?? existing.name,
      input.location ?? existing.location ?? null,
      input.lastContact ?? existing.lastContact ?? null,
      input.contactFrequency ?? existing.contactFrequency ?? null,
      input.customFrequencyDays ?? existing.customFrequencyDays ?? null,
      input.notes ?? existing.notes ?? null,
      input.tags
        ? JSON.stringify(input.tags)
        : existing.tags
          ? JSON.stringify(existing.tags)
          : null,
      now,
      input.id
    );

    return this.getContactById(input.id);
  }

  // DELETE - Remove contact
  deleteContact(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM contacts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  close(): void {
    this.db.close();
  }
}
