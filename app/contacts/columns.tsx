"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ActionsCell } from "@/components/ActionsCell"
import { IContact } from "@/lib/validators/contact"
import { countryList } from "@/lib/countries"


export const columns: ColumnDef<IContact>[] = [
  {
    accessorKey: "civility",
    header: "Civilité",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "firstName",
    header: "Prénom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Téléphone"
  },
  {
    accessorKey: "nationality",
    header: "Nationalité",
    cell: ({ row }) => {
      const code = row.getValue("nationality") as string;
      return countryList[code as keyof typeof countryList] || code;
    }
  }, 
  {
    id: "actions",
    cell: ({ row }) => {
 
      return (
        <ActionsCell contact={row.original} />
      )
    },
  },
]