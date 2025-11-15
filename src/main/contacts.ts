import { ipcMain } from 'electron';
import {
  CreateContactInput,
  IPC_CHANNELS,
  UpdateContactInput,
} from '../shared/types';
import { SQLiteDatabase } from './database/sqlite.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface IPCResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function setupContactIPC(db: SQLiteDatabase): void {
  ipcMain.handle(
    IPC_CHANNELS.CONTACTS_GET_ALL,
    async (): Promise<IPCResponse> => {
      try {
        const contacts = db.getAllContacts();
        return { success: true, data: contacts };
      } catch (error) {
        console.error('Error getting contacts:', error);
        return { success: false, error: (error as Error).message };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.CONTACTS_GET_BY_ID,
    async (_event, id: string): Promise<IPCResponse> => {
      try {
        const contact = db.getContactById(id);
        if (!contact) {
          return { success: false, error: 'Contact not found' };
        }
        return { success: true, data: contact };
      } catch (error) {
        console.error('Error getting contact:', error);
        return { success: false, error: (error as Error).message };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.CONTACTS_CREATE,
    async (_event, input: CreateContactInput): Promise<IPCResponse> => {
      try {
        const contact = db.createContact(input);
        return { success: true, data: contact };
      } catch (error) {
        console.error('Error creating contact:', error);
        return { success: false, error: (error as Error).message };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.CONTACTS_UPDATE,
    async (_event, input: UpdateContactInput): Promise<IPCResponse> => {
      try {
        const contact = db.updateContact(input);
        if (!contact) {
          return { success: false, error: 'Contact not found' };
        }
        return { success: true, data: contact };
      } catch (error) {
        console.error('Error updating contact:', error);
        return { success: false, error: (error as Error).message };
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.CONTACTS_DELETE,
    async (_event, id: string): Promise<IPCResponse> => {
      try {
        const deleted = db.deleteContact(id);
        if (!deleted) {
          return { success: false, error: 'Contact not found' };
        }
        return { success: true };
      } catch (error) {
        console.error('Error deleting contact:', error);
        return { success: false, error: (error as Error).message };
      }
    }
  );
}
