"use client"

import { IContact } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { ActionsCell } from "@/components/ActionsCell"

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
    header: "Nationalité"
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