export type ContactFrequency =
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'custom';

export interface Contact {
  id: string;
  name: string;
  location?: string;
  lastContact?: string; // ISO date string
  contactFrequency?: ContactFrequency;
  customFrequencyDays?: number;
  notes?: string;
  tags?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateContactInput {
  name: string;
  location: string | undefined;
  lastContact: string | undefined;
  contactFrequency: ContactFrequency | undefined;
  customFrequencyDays: number | undefined;
  notes: string | undefined;
  tags: string[] | undefined;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {
  id: string;
}

// IPC Channel names
export const IPC_CHANNELS = {
  CONTACTS_GET_ALL: 'contacts:getAll',
  CONTACTS_GET_BY_ID: 'contacts:getById',
  CONTACTS_CREATE: 'contacts:create',
  CONTACTS_UPDATE: 'contacts:update',
  CONTACTS_DELETE: 'contacts:delete',
} as const;
