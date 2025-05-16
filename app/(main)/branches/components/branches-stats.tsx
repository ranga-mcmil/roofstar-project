import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar } from "lucide-react"

interface WarehousesStatsProps {
  totalWarehouses: number
  activeWarehouses: number
  inactiveWarehouses: number
  totalUsers: number
  filteredCount?: number
}

export function WarehousesStats({
  totalWarehouses,
  activeWarehouses,
  inactiveWarehouses,
  totalUsers,
  filteredCount,
}: WarehousesStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{filteredCount ?? totalWarehouses}</div>
          <p className="text-xs text-muted-foreground">
            {filteredCount !== undefined && filteredCount !== totalWarehouses
              ? `Filtered from ${totalWarehouses} total`
              : "All warehouses"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeWarehouses}</div>
          <p className="text-xs text-muted-foreground">Ready for operations</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Warehouses</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveWarehouses}</div>
          <p className="text-xs text-muted-foreground">Not currently in use</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Total users assigned</p>
        </CardContent>
      </Card>
    </div>
  )
}
