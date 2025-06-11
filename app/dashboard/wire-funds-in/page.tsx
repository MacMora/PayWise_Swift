import DashboardLayout from "@/components/DashboardLayout";
import { Copy } from "lucide-react";
import { CiBank } from "react-icons/ci";
import { BsInfoCircle } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WireFundsIn() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Page Header */}
        <div>
          <h1 className="font-bold text-[#1E64A7]">Wire Funds In</h1>
        </div>

        {/* USDB Balance */}
        <Card className="px-2 py-[10px] rounded-md w-[350px] shadow-[#4E9FFF1F]">
          <CardContent className="px-2">
            <div className="flex items-center space-x-3">
              <CiBank className="h-10 w-10 text-[#353E5C]" />
              <div>
                <p className="text-sm text-[#1E64A7]">USDB Balance</p>
                <p className="text-2xl font-bold text-[#2F4050]">700.00 USDB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wire In Details */}
        <Card className="py-2">
          <CardHeader className="px-2 border-b border-[#5995EE29]">
            <CardTitle className="text-sm">Wire In Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[#000000] ">
                    Bank name
                  </p>
                  <p className="text-[#000000C7]">Citibank</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#000000]">
                    Routing (ABA)
                  </p>
                  <p className="text-[#000000C7]">123456789O</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#000000]">
                    SWIFT code
                  </p>
                  <p className="text-[#000000C7]">CITIUS33</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#000000]">
                    Account number
                  </p>
                  <p className="text-[#000000C7]">123456789O234567</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#000000]">
                    Account type
                  </p>
                  <p className="text-[#000000C7]">CHECKING</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[#000000]">
                    Bank address
                  </p>
                  <p className="text-[#000000C7]">
                    111 Wall Street New York, NY 10043 USA
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#000000]">
                    Beneficiary name
                  </p>
                  <p className="text-[#000000C7]">COMPANY NAME LTD.</p>
                </div>
              </div>
            </div>

            <Button className="bg-[#6FA43A] hover:bg-[#6FA43A]">
              Copy Details
              <Copy className="w-4 h-4 mr-2" />
            </Button>

            {/* Information Notice */}
          <Card className="md:w-3/4 border-[#4E9FFF1F] mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <BsInfoCircle className="h-5 w-5 text-[#64778A] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-black">
                  <p className="italic">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
