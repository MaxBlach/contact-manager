import { ReactNode } from "react"
import { BackButton } from "@/components/BackButton";

export default function ContactsLayout({ children }: { children: ReactNode }) {
    return (
    <main className="p-4">
          <div className="mb-6 flex items-center gap-2">
              <BackButton />
          </div>
          {children}
    </main>
  );
}