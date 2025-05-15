import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WarehousesFiltersProps {
  currentSearch: string
  currentStatus: string
  role: string

}

export function UsersFilters({ currentSearch, currentStatus, role }: WarehousesFiltersProps) {
  return (
    <form className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          placeholder="Search warehouses..."
          className="pl-8 w-full"
          defaultValue={currentSearch}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <Select name="roles" defaultValue={currentStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="store_manager">Store Manager</SelectItem>
            <SelectItem value="sales_rep">Sales Rep</SelectItem>

          </SelectContent>
        </Select>

        <Select name="status" defaultValue={currentStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <button type="submit" className="sr-only">
          Apply Filters
        </button>
      </div>
    </form>
  )
}
