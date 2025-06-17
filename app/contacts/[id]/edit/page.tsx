import { ContactForm } from "@/components/ContactForm";
import { redirect } from "next/navigation";

const EditContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contacts/${id}`,
      { 
        cache: "no-store",
      }
    );

    if(!res.ok){
      const json = await res.json();

      //used to inform user with a toast on the contact page
      if(res.status === 404) redirect('/contacts?error=Contact introuvable');

      throw new Error(json.error || "Erreur inattendue")
    }

    const { data } = await res.json()

    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Modifier un contact</h1>
        <ContactForm initialValues={data} contactId={id} submitLabel="Modifier"/>
      </div>
    );
}

export default EditContactPage;