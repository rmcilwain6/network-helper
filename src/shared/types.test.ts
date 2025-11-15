import { describe, it, expect } from 'vitest';
import type {
  Contact,
  CreateContactInput,
  UpdateContactInput,
  ContactFrequency,
} from './types.js';

describe('Contact Types', () => {
  describe('CreateContactInput', () => {
    it('should accept valid contact input with all fields', () => {
      const input: CreateContactInput = {
        name: 'John Doe',
        location: 'New York, NY',
        lastContact: '2025-01-15',
        contactFrequency: 'monthly',
        customFrequencyDays: 30,
        notes: 'Met at conference',
        tags: ['work', 'friend'],
      };

      expect(input.name).toBe('John Doe');
      expect(input.tags).toHaveLength(2);
    });

    it('should accept minimal contact input', () => {
      const input: CreateContactInput = {
        name: 'Jane Smith',
      };

      expect(input.name).toBe('Jane Smith');
      expect(input.location).toBeUndefined();
    });

    it('should validate contact frequency values', () => {
      const frequencies: ContactFrequency[] = [
        'weekly',
        'monthly',
        'quarterly',
        'yearly',
        'custom',
      ];

      frequencies.forEach((freq) => {
        const input: CreateContactInput = {
          name: 'Test',
          contactFrequency: freq,
        };
        expect(input.contactFrequency).toBe(freq);
      });
    });
  });

  describe('UpdateContactInput', () => {
    it('should require id field', () => {
      const update: UpdateContactInput = {
        id: '123',
        name: 'Updated Name',
      };

      expect(update.id).toBe('123');
      expect(update.name).toBe('Updated Name');
    });

    it('should allow partial updates', () => {
      const update: UpdateContactInput = {
        id: '456',
        location: 'San Francisco, CA',
      };

      expect(update.id).toBe('456');
      expect(update.location).toBe('San Francisco, CA');
      expect(update.name).toBeUndefined();
    });
  });

  describe('Contact', () => {
    it('should have all required fields', () => {
      const contact: Contact = {
        id: '789',
        name: 'Test Contact',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      expect(contact.id).toBeDefined();
      expect(contact.name).toBeDefined();
      expect(contact.createdAt).toBeDefined();
      expect(contact.updatedAt).toBeDefined();
    });
  });
});
