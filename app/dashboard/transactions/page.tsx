import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/DashboardLayout"

export default function Transactions() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-600">Transactions</h1>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0 mb-4">
            <Select defaultValue="10">
              <SelectTrigger className="w-full md:w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search..." className="w-full md:max-w-sm" />
            <div className="flex flex-wrap space-x-2 md:ml-auto max-md:space-y-2">
              <Input type="date" defaultValue="2025-02-15" className="w-full md:w-40" />
              <Input type="date" defaultValue="2025-02-18" className="w-full md:w-40" />
              <Select defaultValue="all-users">
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-users">All Users</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-transactions">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-transactions">All transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transactions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Sender Phone</TableHead>
                <TableHead>Transaction Amount</TableHead>
                <TableHead>Total Fee</TableHead>
                <TableHead>Amount Credited</TableHead>
                <TableHead>Receiver Name</TableHead>
                <TableHead>Receiver Phone</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>10/10/2024</TableCell>
                <TableCell>01:47</TableCell>
                <TableCell>3YQCO1</TableCell>
                <TableCell>Request Transfer</TableCell>
                <TableCell>J Mays and Sons</TableCell>
                <TableCell>18686110000</TableCell>
                <TableCell>100.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>Ian Alleyne</TableCell>
                <TableCell>18687238394</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>test payment</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>07/10/2024</TableCell>
                <TableCell>06:42</TableCell>
                <TableCell>9KGJGF</TableCell>
                <TableCell>Request Transfer</TableCell>
                <TableCell>J Mays and Sons</TableCell>
                <TableCell>18686110000</TableCell>
                <TableCell>100.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>Ian Alleyne</TableCell>
                <TableCell>18687238394</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>test payment</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10/10/2024</TableCell>
                <TableCell>01:47</TableCell>
                <TableCell>3YQCO1</TableCell>
                <TableCell>Request Transfer</TableCell>
                <TableCell>J Mays and Sons</TableCell>
                <TableCell>18686110000</TableCell>
                <TableCell>100.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>Ian Alleyne</TableCell>
                <TableCell>18687238394</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>test payment</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>07/10/2024</TableCell>
                <TableCell>06:42</TableCell>
                <TableCell>9KGJGF</TableCell>
                <TableCell>Request Transfer</TableCell>
                <TableCell>J Mays and Sons</TableCell>
                <TableCell>18686110000</TableCell>
                <TableCell>100.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>Ian Alleyne</TableCell>
                <TableCell>18687238394</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>test payment</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10/10/2024</TableCell>
                <TableCell>01:47</TableCell>
                <TableCell>3YQCO1</TableCell>
                <TableCell>Request Transfer</TableCell>
                <TableCell>J Mays and Sons</TableCell>
                <TableCell>18686110000</TableCell>
                <TableCell>100.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>Ian Alleyne</TableCell>
                <TableCell>18687238394</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>test payment</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>07/10/2024</TableCell>
                <TableCell>06:42</TableCell>
                <TableCell>9KGJGF</TableCell>
                <TableCell>Request Transfer</TableCell>
                <TableCell>J Mays and Sons</TableCell>
                <TableCell>18686110000</TableCell>
                <TableCell>100.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>Ian Alleyne</TableCell>
                <TableCell>18687238394</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>test payment</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Showing 6 to 0 of 0 entries</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* Download Button */}
          <div className="flex justify-center w-full pb-6">
            <Button className="cursor-pointer bg-[#6FA43A] hover:bg-green-700">Download Transaction Report</Button>
          </div>
        </CardFooter>
      </Card>
    </DashboardLayout>
  )
}
