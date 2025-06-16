"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"

export const BackButton = () => {

  const pathname = usePathname()

  let href = "/"
  if (pathname?.startsWith("/contacts/")) {
    href = "/contacts"
  }

  return (
    <Link href={href}>
      <Button variant="ghost" size="sm" className="flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>
    </Link>
  )
}
