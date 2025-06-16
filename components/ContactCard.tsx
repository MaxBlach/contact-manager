import { CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IContact } from "@/lib/validators/contact"
import { countryList } from "@/lib/countries"
type Props = {
  contact: IContact;
};

export const ContactCard = ({ contact }: Props) => {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {contact.civility} {contact.firstName} {contact.name}
        </CardTitle>
        <Link href={`/contacts/${contact.id}/edit`}>
          <Button variant="outline" size="sm">Modifier</Button>
        </Link>
      </CardHeader>
      <div className="space-y-2 px-6">
        <p><strong>Email :</strong> {contact.email}</p>
        <p><strong>Téléphone :</strong> {contact.phoneNumber}</p>
        <p><strong>Nationalité :</strong> {countryList[contact.nationality as keyof typeof countryList] || contact.nationality}</p>
      </div>
    </>
  );
}
