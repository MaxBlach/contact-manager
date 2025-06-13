import { createContact, handleRouteError, listAllContacts } from "@/lib/contacts/helpers";

export const POST = async (request : Request) => {
    try{
        const body = await request.json();
        const newContact = await createContact(body);
        return Response.json({data: newContact}, { status: 201 });
    }catch(e: unknown){
        return handleRouteError(e)
    }
}

export const GET = async () => {
    try{
        const contact = await listAllContacts();
        return Response.json({data: contact}, { status: 200 });
    }catch(e: unknown){
        return handleRouteError(e)
    }
}