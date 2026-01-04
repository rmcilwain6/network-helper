import type {
  Contact,
  CreateContactInput,
  UpdateContactInput,
} from '../shared/types';

declare global {
  interface Window {
    electronAPI: {
      contacts: {
        getAll: () => Promise<{
          success: boolean;
          data?: Contact[];
          error?: string;
        }>;
        getById: (id: string) => Promise<{
          success: boolean;
          data?: Contact;
          error?: string;
        }>;
        create: (input: CreateContactInput) => Promise<{
          success: boolean;
          data?: Contact;
          error?: string;
        }>;
        update: (input: UpdateContactInput) => Promise<{
          success: boolean;
          data?: Contact;
          error?: string;
        }>;
        delete: (id: string) => Promise<{
          success: boolean;
          data?: void;
          error?: string;
        }>;
      };
    };
  }
}

export {};
