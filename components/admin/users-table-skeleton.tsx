import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function UsersTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead className="w-[250px]">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Skeleton className="h-4 w-32" />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="w-[100px]">
              <Skeleton className="h-4 w-16" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32 md:hidden" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}
