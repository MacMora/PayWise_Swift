import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaArrowRight } from "react-icons/fa6";

export default function FundEscrow_Sell() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-[#1E64A7]">Fund Escrow</h1>
        </div>

        {/* Transfer Funds Card */}
        <Card className="py-2">
          <CardHeader className="px-2 border-b border-[#5995EE29]">
            <CardTitle className="text-base">Transfer Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:w-[35%] mb-6">
            {/* Transfer Funds Form */}
            <div className="flex flex-col justify-between items-start p-2 space-y-4">
              <div className="flex flex-row space-x-6 items-center w-full justify-between">
                <div>
                  <Label
                    htmlFor="recipient-name"
                    className="text-sm font-medium"
                  >
                    USDB Account:
                  </Label>
                  <Input
                    id="recipient-name"
                    placeholder="$700 TTD"
                    className="mt-1"
                  />
                </div>
                <FaArrowRight className="w-4 h-4 text-[#536374] mt-6" />
                <div>
                  <Label
                    htmlFor="recipient-name"
                    className="text-sm font-medium"
                  >
                    Escrow Wallet:
                  </Label>
                  <Input
                    id="recipient-name"
                    placeholder="$10 TTD"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="w-full">
                <Label htmlFor="amount" className="text-sm font-medium">
                  <span className="text-[#FF3A67]">*</span>Amount
                </Label>
                <Input
                  id="amount"
                  placeholder="$200 TTD"
                  className="mt-1 w-full"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Input
                  id="message"
                  placeholder="Add a note"
                  className="mt-1 w-full"
                />
              </div>
              <div className="flex space-x-3">
                <Button className="bg-transparent hover:bg-transparent border border-[#536374] text-[#536374]">
                  Cancel
                </Button>
                <Button className="bg-[#6FA43A] hover:bg-[#6FA43A]">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
