"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ImportContactsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;

        // Send csv to the API
        const response = await fetch('/api/contacts/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ csv:text }),
        });

        if (!response.ok) {
          throw new Error('Failed to import contacts');
        }

        const { imported, errors: importErrors } = await response.json();
        console.log(imported, importErrors);
        //  10 [] but the toast is not showing
        if(importErrors.length > 0) toast.error(`${importErrors.length} contacts non importés !`);
        if(imported === 0 && importErrors.length === 0) toast.error('Aucun contact importé');
        if(imported > 0) toast.success(`${imported} contacts importés avec succès !`);
        router.push('/contacts');
      } catch (error) {
        console.error('Error processing CSV:', error);
        toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'importation des contacts');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Erreur lors de la lecture du fichier');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Importer des contacts</h1>
        <p className="text-gray-500">
          Sélectionnez un fichier CSV avec les colonnes suivantes :<br />
          civility, name, firstName, email, phoneNumber, nationality<br />
          <span className="text-sm">(Tous les champs sont obligatoires)</span>
        </p>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          <Button
            variant="outline"
            onClick={() => router.push('/contacts')}
            disabled={isLoading}
          >
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
} 