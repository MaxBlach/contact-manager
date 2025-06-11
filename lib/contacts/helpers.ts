import { IContact } from "../types";

export async function listAllContacts() {
  return []
}

export async function getContact(id: number) {
  console.log(id)
  return {id}
}

export async function addContact(contact: IContact) {
  return contact;
}

export async function updateContact(id: number, updatedContact: IContact) {
  console.log(id,updatedContact)
  return updatedContact
}

export async function deleteContact(id: number) {
console.log(id)
  return true;
}