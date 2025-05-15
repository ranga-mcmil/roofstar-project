import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddWarehouseLoading() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
        <div className="h-9 w-48 rounded-md bg-muted animate-pulse" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-40 rounded-md bg-muted animate-pulse" />
          </CardTitle>
          <div className="h-4 w-96 rounded-md bg-muted animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
                <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
                <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-md bg-muted animate-pulse" />
              <div className="h-5 w-16 rounded-md bg-muted animate-pulse" />
            </div>
            <div className="flex justify-end space-x-4">
              <div className="h-10 w-24 rounded-md bg-muted animate-pulse" />
              <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
