import { CreditCard } from "lucide-react";
import { CiCirclePlus } from "react-icons/ci";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

export default function Cards() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-600">Cards</h1>
      </div>

      {/* Virtual Debit Card */}
      <Card className="py-2 w-[25%] border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
              <div className="text-start">
                <p className="text-sm text-[#1E64A7]">Virtual debit card</p>
                <p className="font-bold text-[#2F4050]">Request a new card</p>
              </div>
            </div>
              <CiCirclePlus  className="h-10 w-10 text-[#64778A]" />
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
