"use client"

import { IContact } from "@/lib/types"
import { useState } from "react"
import { toast } from "sonner"
import { MoreHorizontal } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export const ActionsCell = ({ contact }: { contact: IContact }) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || "Erreur inconnue")
      }

      toast.success("Contact supprimé avec succès")
      router.refresh();
    } catch (error) {
      toast.error("Échec de la suppression")
      console.error(error)
    } finally {
      setOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => redirect(`contacts/${contact.id}`)}>Voir détail</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => redirect(`contacts/${contact.id}/edit`)}>Modifier</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>Supprimer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement ce contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
