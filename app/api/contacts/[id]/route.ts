import { deleteContact, getContact, handleRouteError, updateContact } from "@/lib/contacts/helpers";

//Dynamic api's are asynchronous. Need to use await to get params.
export const GET = async (_: Request, {params}: {params: Promise<{ id: string }>}) => {
    try{
        const { id } = await params;
        const contact = await getContact(id);
        return Response.json({data: contact}, {status: 200});
    }catch(e){
        return handleRouteError(e);
    }
}

export const PUT = async (request: Request, {params}: {params: Promise<{ id: string }>}) => {
    const { id } = await params;
    const body = await request.json();
    try{
        const updated = await updateContact(id, body);
        return updated ? Response.json(updated) : Response.json({ error: 'Not Found' }, { status: 404 });
    }catch(e){
        return handleRouteError(e)
    }
}

export const DELETE = async (_: Request, {params}: {params: Promise<{ id: string }>}) => {
    const { id } = await params;
    try{
        await deleteContact(id);
        return new Response(null, { status: 204 });
    }catch(e){
        return handleRouteError(e);
    }
}