"use client"
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const ContactListPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const router = useRouter();
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
      <div className="flex justify-between items-center">
        <Input className="w-1/2" type="text" placeholder="Rechercher (nom, prénom, email, téléphone)" value={search} onChange={(e) => setSearch(e.target.value)}/>
        <Button onClick={() => router.push("/contacts/new")}>
          <PlusIcon className="w-4 h-4" />
          Ajouter un contact
        </Button>
      </div>
      <DataTable columns={columns} data={data}/>
    </div>
  );
}

export default ContactListPage;