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

export const GET = async (request: Request) => {
    try{
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || "";
        const contact = await listAllContacts(search);
        return Response.json({data: contact}, { status: 200 });
    }catch(e: unknown){
        return handleRouteError(e)
    }
}