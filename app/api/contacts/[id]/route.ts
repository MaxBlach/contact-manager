export async function listAllContacts(limit = 10, offset = 0) {
  return []
}

export async function getContact(id: number) {
  console.log(id)
  return {id}
}

export async function addContact(contact) {
  return contact;
}

export async function updateContact(id, updatedContact) {
  console.log(id,updatedContact)
  return updatedContact
}

export async function deleteContact(id) {
console.log(id)
  return true;
}