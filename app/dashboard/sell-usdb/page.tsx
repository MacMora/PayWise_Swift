import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CiBank } from "react-icons/ci";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout"
import Link from "next/link";

export default function SellUSDB() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1E64A7]">Sell USDB</h1>
        <div className="flex space-x-3">
          <Button className="bg-transparent hover:bg-transparent border border-[#536374] text-[#536374]">My Order</Button>
          <Button className="bg-[#6FA43A] hover:bg-[#6FA43A]">Create a New Order</Button>
        </div>
      </div>

      {/* USDB Account Balance */}
      <Card className="px-2 py-[10px] rounded-md w-[350px] shadow-[#4E9FFF1F]">
        <CardContent className="px-2">
          <div className="flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-3">
              <CiBank className="h-10 w-10 text-[#353E5C]" />
              <div>
                <p className="text-sm text-[#1E64A7]">USDB Account (Escrow)</p>
                <p className="text-2xl font-bold text-[#2F4050]">10.00 USDB</p>
              </div>
            </div>
            <Link href="/dashboard/sell-usdb/fund-escrow">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
            </Link>
            
          </div>
        </CardContent>
      </Card>

      {/* Active Orders */}
      <Card className="py-2">
        <CardHeader className="px-2 border-b border-[#5995EE29]">
          <CardTitle className="text-base">Active Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:w-[45%] mb-6">
          {/* Order 1 */}
          <div className="flex justify-between items-center p-4 shadow rounded-lg">
            <div>
              <p className="text-sm text-blue-600">Rate: 1 USDB / 7.80 TTD</p>
              <p className="text-xl font-bold">3000 TTD</p>
              <p className="text-sm text-gray-600 italic">Estimated Cost: $384 USDB (for full quantity)</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 italic">Partial Sale Not allowed</p>
              <Button className="mt-2 px-10 bg-transparent border border-[#64778A] text-[#64778A]">Sell</Button>
            </div>
          </div>

          {/* Order 2 */}
          <div className="flex justify-between items-center p-4 shadow rounded-lg">
            <div>
              <p className="text-sm text-blue-600">Rate: 1 USDB / 7.80 TTD</p>
              <p className="text-xl font-bold">3200 TTD</p>
              <p className="text-sm text-gray-600 italic">Estimated Cost: $410 USDB (for full quantity)</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 italic">Partial Sale allowed</p>
              <Button className="mt-2 px-10 bg-transparent border border-[#64778A] text-[#64778A]">Sell</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}
