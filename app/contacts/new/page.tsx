"use client";

import { ContactForm } from "@/components/ContactForm";
import { ContactFormValues } from "@/lib/validators/contact";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    router.push("/contacts");
  };

  return (
    <ContactForm onSubmit={handleSubmit} loading={loading} submitLabel="Créer le contact" />
  );
}
