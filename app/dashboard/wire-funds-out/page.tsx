import { CiBank } from "react-icons/ci";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardLayout from "@/components/DashboardLayout"

export default function WireFundsOut() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E64A7]">Wire Funds Out</h1>
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

      {/* Wire Out Form */}
      <Card className="py-2">
        <CardHeader className="px-2 border-b border-[#5995EE29]">
          <CardTitle className="text-sm">Wire Out</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient-name" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>Recipient Name
                  </Label>
                  <Input id="recipient-name" placeholder="Full Name" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="bank-account" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>Bank Account Number
                  </Label>
                  <Input id="bank-account" placeholder="0" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="swift-code" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>SWIFT/BIC Code
                  </Label>
                  <Input id="swift-code" placeholder="SWIFT" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="amount" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>Amount to Send
                  </Label>
                  <Input id="amount" placeholder="$0" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>Email of Recipient
                  </Label>
                  <Input id="email" type="email" placeholder="Email" className="mt-1" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bank-name" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>Recipient Bank Name
                  </Label>
                  <Input id="bank-name" placeholder="Bank Name" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="bank-branch" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>Bank Branch (optional for local)
                  </Label>
                  <Input id="bank-branch" placeholder="Branch" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="bank-country" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>Bank Country
                  </Label>
                  <Input id="bank-country" placeholder="TT" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="reference" className="text-sm font-medium">
                    <span className="text-[#FF3A67]">*</span>Transfer Purpose/Reference
                  </Label>
                  <Input id="reference" placeholder="Note" className="mt-1" />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button className="bg-[#6FA43A] hover:bg-[#6FA43A] w-fit">Send Wire</Button>
              <p className="text-sm text-black">Transfers may take 1-3 business days</p>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}
