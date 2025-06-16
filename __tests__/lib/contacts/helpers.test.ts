import fs from 'fs/promises';

import { 
  listAllContacts, 
  getContact, 
  createContact, 
  updateContact, 
  deleteContact 
} from '../../../lib/contacts/helpers';
import { ValidationError } from '../../../lib/utils';
import { IContact } from '../../../lib/validators/contact';

jest.mock('fs/promises');

// Mock data
const mockContacts: IContact[] = [
  {
    id: '1',
    civility: 'M.',
    name: 'Dubois',
    firstName: 'Hugo',
    email: 'hugo.dubois@example.com',
    phoneNumber: '+33 (0)3 38 59 81 24',
    nationality: 'EE'
  },
  {
    id: '2',
    civility: 'Mme.',
    name: 'Petit',
    firstName: 'Emma',
    email: 'emma.petit@example.com',
    phoneNumber: '+33 (0)2 42 92 26 00',
    nationality: 'IN'
  }
];

describe('Contact Helpers', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Mock readFile to return mock data
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockContacts));
    // Mock writeFile to do nothing
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
  });

  describe('listAllContacts', () => {
    it('should return all contacts when no search term is provided', async () => {
      const result = await listAllContacts('');
      expect(result).toEqual(mockContacts);
    });

    it('should filter contacts by search term', async () => {
      const result = await listAllContacts('dubois');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Dubois');
    });

    it('should handle case-insensitive search', async () => {
      const result = await listAllContacts('DUBOIS');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Dubois');
    });

    it('should filter contacts by first name', async () => {
      const result = await listAllContacts('Hugo');
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('Hugo');
    });

    it('should filter contacts by partial first name', async () => {
      const result = await listAllContacts('Hu');
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('Hugo');
    });

    it('should filter contacts by email', async () => {
      const result = await listAllContacts('hugo.dubois@example.com');
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('hugo.dubois@example.com');
    });

    it('should filter contacts by partial email', async () => {
      const result = await listAllContacts('example.com');
      expect(result).toHaveLength(2);
    });

    it('should filter contacts by phone number', async () => {
      const result = await listAllContacts('+33 (0)3 38 59 81 24');
      expect(result).toHaveLength(1);
      expect(result[0].phoneNumber).toBe('+33 (0)3 38 59 81 24');
    });

    it('should filter contacts by partial phone number', async () => {
      const result = await listAllContacts('+33');
      expect(result).toHaveLength(2);
    });
  });

  describe('getContact', () => {
    it('should return a contact by id', async () => {
      const result = await getContact('1');
      expect(result).toEqual(mockContacts[0]);
    });

    it('should throw error when contact is not found', async () => {
      await expect(getContact('999')).rejects.toThrow('contact not found');
    });
  });

  describe('createContact', () => {
    const newContact: IContact = {
      id: '3',
      civility: 'M.',
      name: 'Martin',
      firstName: 'Jean',
      email: 'jean.martin@example.com',
      phoneNumber: '0123456789',
      nationality: 'FR'
    };

    it('should create a new contact', async () => {
      const result = await createContact(newContact);
      expect(result).toBeDefined();
      expect(result?.id).toBeDefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid contact data', async () => {
      const invalidContact = { ...newContact, email: 'invalid-email' };
      await expect(createContact(invalidContact)).rejects.toThrow(ValidationError);
    });
  });

  describe('updateContact', () => {
    const updatedData: IContact = {
      id: '1',
      civility: 'M.',
      name: 'Dubois',
      firstName: 'Hugo',
      email: 'hugo.dubois.updated@example.com',
      phoneNumber: '+33 (0)3 38 59 81 24',
      nationality: 'EE'
    };

    it('should update an existing contact', async () => {
      const result = await updateContact('1', updatedData);
      expect(result).toBeDefined();
      expect(result?.email).toBe(updatedData.email);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should throw error when contact to update is not found', async () => {
      await expect(updateContact('999', updatedData)).rejects.toThrow('contact not found');
    });

    it('should throw ValidationError for invalid update data', async () => {
      const invalidUpdate = { ...updatedData, email: 'invalid-email' };
      await expect(updateContact('1', invalidUpdate)).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteContact', () => {
    it('should delete a contact', async () => {
      const result = await deleteContact('1');
      expect(result).toBe(true);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should throw error when contact to delete is not found', async () => {
      await expect(deleteContact('999')).rejects.toThrow('contact not found');
    });
  });
}); 