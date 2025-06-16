"use client"
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";

const ContactListPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const getContacts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contacts?search=${search}`, {
      cache: 'no-store',
    });
    const { data } = await res.json()
    setData(data);
  }

  useEffect(() => {
    getContacts()
  }, [search]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Input className="w-1/2" type="text" placeholder="Rechercher (nom, prénom, email, téléphone)" value={search} onChange={(e) => setSearch(e.target.value)}/>
      <DataTable columns={columns} data={data}/>
    </div>
  );
}

export default ContactListPage;