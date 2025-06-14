import React from 'react'
import { columns } from "./columns"
import { DataTable } from "@/components/DataTable"


const contactsPage = async () => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contacts`);
  const { data } = await res.json()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default contactsPage;