import { Card, CardContent } from "@/components/ui/card"
import { ReactNode } from "react"
import { BackButton } from "@/components/BackButton";

export default function ContactsLayout({ children }: { children: ReactNode }) {


    return (
    <main className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6 pb-8">
          <div className="mb-6 flex items-center gap-2">
              <BackButton />
          </div>
          {children}
        </CardContent>
      </Card>
    </main>
  );
}