import { contextBridge, ipcRenderer } from 'electron';
import {
  IPC_CHANNELS,
  Contact,
  CreateContactInput,
  UpdateContactInput,
} from '../shared/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface IPCResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    contacts: {
      getAll: (): Promise<IPCResponse<Contact[]>> =>
        ipcRenderer.invoke(IPC_CHANNELS.CONTACTS_GET_ALL),

      getById: (id: string): Promise<IPCResponse<Contact>> =>
        ipcRenderer.invoke(IPC_CHANNELS.CONTACTS_GET_BY_ID, id),

      create: (input: CreateContactInput): Promise<IPCResponse<Contact>> =>
        ipcRenderer.invoke(IPC_CHANNELS.CONTACTS_CREATE, input),

      update: (input: UpdateContactInput): Promise<IPCResponse<Contact>> =>
        ipcRenderer.invoke(IPC_CHANNELS.CONTACTS_UPDATE, input),

      delete: (id: string): Promise<IPCResponse<void>> =>
        ipcRenderer.invoke(IPC_CHANNELS.CONTACTS_DELETE, id),
    },
  });
} catch (error) {
  console.error('=== ERROR EXPOSING API ===', error);
}
