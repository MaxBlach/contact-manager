import { ContactCard } from '@/components/ContactCard';
import { redirect } from 'next/navigation';
import React from 'react'

const GetContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contacts/${id}`,
      { 
        cache: "no-store",
      }
    );

    if(!res.ok){
          const json = await res.json();
    
          //used to inform user with a toast on the contact page
          if(res.status === 404) redirect('/contacts?error=Contact introuvable');
    
          throw new Error(json.error || "Erreur inattendue")
        }

        const { data } = await res.json()
  
    return (
    <ContactCard contact={data}/>
  )
}

export default GetContactPage