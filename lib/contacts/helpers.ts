import { IContact } from "../types";
import fs from 'fs/promises';
import path from 'path';

interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof IContact, string>>;
}

//variables and functions to read and write json

const dataPath = path.join(process.cwd(), 'lib/contacts/data.json');

const readData = async () => {
    const json = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(json);
}

const writeData = async (data: IContact[]) => {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}


export const validateContact = (contact: IContact): ValidationResult => {
    const errors: Partial<Record<keyof IContact, string>> = {};

    // Civility check
    if (contact.civility !== "M." && contact.civility !== "Mme.") {
        errors.civility = "Civility must be 'M.' or 'Mme.'";
    }

    // Name and firstname: letters, accented characters, and optional hyphens
    const nameRegex = /^[A-Za-zÀ-ÿ\-'\s]+$/;
    if (!nameRegex.test(contact.name)) {
        errors.name = "Name contains invalid characters";
    }
    if (!nameRegex.test(contact.firstName)) {
        errors.firstName = "Firstname contains invalid characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
        errors.email = "Invalid email format";
    }

    // Phone number: accept various formats, but digits only and length 10–15
    const phoneRegex = /^\+?[0-9\s\-().]{10,20}$/;
    if (!phoneRegex.test(contact.phoneNumber)) {
        errors.phoneNumber = "Invalid phone number format";
    }

    // Nationality: allow letters, spaces, and accented characters
    const nationalityRegex = /^[A-Za-zÀ-ÿ\s\-']+$/;
    if (!nationalityRegex.test(contact.nationality)) {
        errors.nationality = "Nationality contains invalid characters";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export const listAllContacts = async () => {
    return await readData()
}

export const getContact = async (id: string) => {
    const data = await readData();
    return data.find((c: IContact) => c.id === id);
}

const insertContact = async (contact: IContact) => {
    const data = await readData();
    data.push(contact);
    await writeData(data);
    return contact;
}

//add the timestamp as id to a contact, validate data and write it into json
export const createContact = async (contact: IContact) => {
    if(validateContact(contact).isValid){
        const newContact = { id: Date.now().toString(), ...contact }; 
        return insertContact(newContact)
    }else{
        console.log("Contact not created: ", Object.values(validateContact(contact).errors))
        return validateContact(contact).errors
    }
}

export const updateContact = async (id: string, updatedContact: IContact) => {
    const data = await readData();
    const index = data.findIndex((c: IContact)=> c.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updatedContact };
    await writeData(data);
    return data[index];
}

export const deleteContact = async (id: string) => {
    const data = await readData();
    const newData = data.filter((c: IContact) => c.id !== id);
    await writeData(newData);
    return true;
}