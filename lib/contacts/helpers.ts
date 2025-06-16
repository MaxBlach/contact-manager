import fs from 'fs/promises';
import path from 'path';
import { validateContact, IContact } from "../validators/contact";

//setup default message for http code
const errorCodes: Record<number, string[]> = {
  400: ["invalid payload"],
  404: ["not found"]
};

//if a known message is passed with e, return the correspondant status
export const handleRouteError = (e: unknown) => {
  let message = "Internal server error";
  let status = 500;
  let errors: Record<string, string> | undefined;


  if (e instanceof ValidationError) {
    message = e.message;
    errors = e.errors;
    status = 400;
  } else if (e instanceof Error) {
    message = e.message;

    Object.entries(errorCodes).forEach(([errorCode, knownMessages]) => {
      if (knownMessages.some(err => message.includes(err))) {
        status = Number(errorCode);
      }
    });
  }

  return Response.json({ error: message, errors }, { status });
};

export class ValidationError extends Error {
  public errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string>) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}


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


export const listAllContacts = async () : Promise<IContact[]>=> {
    return readData()
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
    if (index === undefined) throw new Error("contact not found");

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