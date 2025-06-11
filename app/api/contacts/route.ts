import { createContact, listAllContacts } from "@/lib/contacts/helpers";

export const POST = async (request : Request) => {
    const body = await request.json();
    const newContact = await createContact(body);
    return Response.json(newContact, { status: 201 });
}

export const GET = async () => {
    const contact = await listAllContacts();
    return Response.json(contact);
}