import { createContact } from "@/lib/contacts/helpers";

export async function POST(request : Request) {
    const body = await request.json();
    const newContact = await createContact(body);
    return Response.json(newContact, { status: 201 });
}