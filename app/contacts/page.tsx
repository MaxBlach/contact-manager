import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";

const ContactListPage = async ({ searchParams }: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

  let notFound = false;
  const { error } = await searchParams;

  if(error === "notfound"){
    notFound = true;
  }


  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contacts`, {
    cache: 'no-store',
  });
  const { data } = await res.json()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} showNotFoundToast={notFound}/>
    </div>
  );
}

export default ContactListPage;