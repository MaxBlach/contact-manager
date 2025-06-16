"use client"
import { useEffect, useRef, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleFileUpload } from "@/lib/utils";

const ContactListPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="flex gap-2">
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <UploadIcon className="w-4 h-4" />
          Importer un CSV
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, getContacts)}
            className="hidden"
          />
        </Button>
        <Button onClick={() => router.push("/contacts/new")}>
          <PlusIcon className="w-4 h-4" />
          Ajouter un contact
        </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data}/>
    </div>
  );
}

export default ContactListPage;