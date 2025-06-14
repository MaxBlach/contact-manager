import { ContactForm } from "@/components/ContactForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contacts/${id}`);
  const { data } = await res.json()

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Modifier un contact</h1>
      <ContactForm initialValues={data} contactId={id} submitLabel="Modifier"/>
    </div>
  );
}
