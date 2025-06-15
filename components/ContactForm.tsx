"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormValues } from "@/lib/validators/contact";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";

type ContactFormProps = {
  initialValues?: ContactFormValues | undefined;
  contactId?: string
  submitLabel?: string;
};

export const ContactForm = ({
  initialValues,
  contactId,
  submitLabel = "Submit",
}: ContactFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      civility: "M.",
      name: "",
      firstName: "",
      email: "",
      phoneNumber: "",
      nationality: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const onSubmit = async (data: ContactFormValues) => {
  setLoading(true);

  try {
    //If editing an existing contact: use PUT and include the contact ID. If creating a new contact: use POST
    const method = contactId ? "PUT" : "POST";
    const url = contactId ? `/api/contacts/${contactId}` : "/api/contacts";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

     if (!res.ok) {
       // If the backend returned field-specific validation errors
       if (json.errors && typeof json.errors === "object") {
        //  Loop through the errors and bind them to the corresponding form fields
         for (const [field, message] of Object.entries(json.errors)) {
           form.setError(field as keyof ContactFormValues, {
             message: message as string,
           });
         }

         toast.error("Certains champs sont invalides. Veuillez les corriger avant de continuer.");
       } else {
         toast.error(json.error || "Une erreur inconnue est survenue");
       }

       return;
     }

    toast.success("Contact enregistré !");
    router.push("/contacts");

  } catch {
    toast.error("Erreur serveur ou réseau. Veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <FormField
          control={form.control}
          name="civility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Civilité</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une civilité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="M.">M.</SelectItem>
                  <SelectItem value="Mme.">Mme.</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Jean" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jean@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="0601020304" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationalité</FormLabel>
              <FormControl>
                <Input placeholder="Française" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
