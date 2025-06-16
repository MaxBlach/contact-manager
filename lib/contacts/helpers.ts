import fs from 'fs/promises';
import path from 'path';
import { validateContact, IContact } from "../validators/contact";
import { ValidationError } from "../utils";

//fields that will be searched in the contact list
const searchFields: (keyof IContact)[] = ['name', 'firstName', 'email', 'phoneNumber'];

const dataPath = path.join(process.cwd(), 'lib/contacts/data.json');

//read data.json file and return it as an object
const readData = async () => {
    try{
        const json = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(json);
    }catch(e){
        console.error('readData: failed', e);
        throw new Error("Error read data file");
    }
}

//write object to data.json file
const writeData = async (data: IContact[]) => {
    try{
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    }catch(e){
        console.error('writeData: failed', e)
        throw new Error("Error write data file")
    }
}


export const listAllContacts = async (
  search: string, 
): Promise<IContact[]> => {
  const data = await readData();
  const searchLower = search.toLowerCase();
  const filteredData = data.filter((c: IContact) => 
    searchFields.some(field => 
      String(c[field]).toLowerCase().includes(searchLower)
    )
  );
  return filteredData;
}

export const getContact = async (id: string): Promise<IContact> => {
    const data = await readData();
    const contact = data.find((c: IContact) => c.id === id);
    if(contact === undefined) throw new Error("contact not found")
    return contact
}

const insertContact = async (contact: IContact): Promise<IContact> => {
    const data = await readData();
    data.push(contact);
    await writeData(data);
    return contact;
}

//add the timestamp as id to a contact, validate data and write it into json
export const createContact = async (contact: IContact): Promise<IContact | undefined> => {
    const formValid = validateContact(contact);

    if(!formValid.isValid) throw new ValidationError("invalid payload", formValid.errors);

    const newContact = { id: Date.now().toString(), ...contact }; 
    return insertContact(newContact)
}

export const updateContact = async (contactId: string, contactData: IContact): Promise<IContact | undefined> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id: _id, ...sanitizedData} = contactData //avoid changing contact id
    const formValid = validateContact(contactData);
    
    if(!formValid.isValid) throw new ValidationError("invalid payload", formValid.errors);

    const data = await readData();
    const index = data.findIndex((c: IContact)=> c.id === contactId);
    if (index === -1) throw new Error("contact not found");

    const updatedContact = { ...data[index], ...sanitizedData };
    data[index] = updatedContact;
    await writeData(data);
    return updatedContact;
}

export const deleteContact = async (id: string) : Promise<boolean> => {
        const data = await readData();
        if(data.find((c: IContact) => c.id === id) === undefined) throw new Error("contact not found")
        const newData = data.filter((c: IContact) => c.id !== id);
        await writeData(newData);
        return true;
}