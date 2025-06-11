import { getContact, updateContact } from "@/lib/contacts/helpers";

//Dynamic api's are asynchronous. Need to use await to get params.
export const GET = async (_: Request, {params}: {params: Promise<{ id: string }>}) => {
    const { id } = await params;
    const contact = await getContact(id);
    return contact ? Response.json(contact) : new Response('Not Found', { status: 404 });
}

export const PUT = async (request: Request, {params}: {params: Promise<{ id: string }>}) => {
    const { id } = await params
    const body = await request.json();
    const updated = await updateContact(id, body);
    return updated ? Response.json(updated) : new Response('Not Found', { status: 404 });
}