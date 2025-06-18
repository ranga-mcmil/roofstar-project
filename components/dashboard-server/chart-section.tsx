// components/dashboard-server/chart-section.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardChart } from "@/components/dashboard-chart"
import { getChartData } from "@/lib/actions/dashboard-actions"

export async function ChartSection() {
  const chartData = await getChartData()

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <DashboardChart data={chartData} />
      </CardContent>
    </Card>
  )
}
