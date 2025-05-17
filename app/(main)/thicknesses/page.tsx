import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { QuickCreateButton } from "./components/quick-create-button"
import ThicknessesClientContent from "./components/thicknesses-client-content"

export default async function ThicknessesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Thicknesses</h1>
            <p className="text-muted-foreground">Manage product material thicknesses</p>
          </div>
          <div className="flex gap-2">
            {/* Quick Create Button - client component */}
            <QuickCreateButton />
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <ThicknessesClientContent />
      </main>
    </div>
  )
}