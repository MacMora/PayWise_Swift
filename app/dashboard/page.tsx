"use client";
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { CiBank } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  const buyOrders = [
    {
      rate: "7.80 TTD / 1 USDB",
      amount: "100 USDB",
      cost: "$780 TTD (for full quantity)",
      partialAllowed: false,
      status: "Partial Purchase Not allowed",
    },
    {
      rate: "7.80 TTD / 1 USDB",
      amount: "200 USDB",
      cost: "$1560 TTD (for full quantity)",
      partialAllowed: true,
      status: "Partial Purchase allowed",
    },
  ];

  const sellOrders = [
    {
      rate: "1 USDB / 7.80 TTD",
      amount: "3000 TTD",
      cost: "$384 USDB (for full quantity)",
      partialAllowed: false,
      status: "Partial Sale Not allowed",
    },
    {
      rate: "1 USDB / 7.80 TTD",
      amount: "3200 TTD",
      cost: "$410 USDB (for full quantity)",
      partialAllowed: true,
      status: "Partial Sale allowed",
    },
  ];

  const currentOrders = activeTab === "buy" ? buyOrders : sellOrders;
  const buttonText = activeTab === "buy" ? "Buy" : "Sell";
  const buttonLink =
    activeTab === "buy"
      ? "/dashboard/buy-usdb/buy"
      : "/dashboard/sell-usdb/sell";

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#2F4050]">
            Welcome Back, {user.name}
          </h1>
        </div>

        {/* Account Balances */}
        <div className="flex flex-row gap-6">
          <Card className="px-2 py-[10px] rounded-md w-[350px] shadow-[#4E9FFF1F]">
            <CardContent className="px-2">
              <div className="flex items-center space-x-3">
                <CiBank className="h-10 w-10 text-[#353E5C]" />
                <div>
                  <p className="text-sm text-[#1E64A7]">USDB Account</p>
                  <p className="text-2xl font-bold text-[#2F4050]">
                    710.00 USDB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-2 py-[10px] rounded-md w-[350px] shadow-[#4E9FFF1F]">
            <CardContent className="px-2">
              <div className="flex items-center space-x-3">
                <IoWalletOutline className="h-8 w-8 text-[#353E5C]" />
                <div>
                  <p className="text-sm text-[#1E64A7]">
                    PayWise Account (Escrow)
                  </p>
                  <p className="text-2xl font-bold text-[#2F4050]">10.00 TTD</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Primera columna */}
          <div className="h-full">
            <Card className="p-2 h-full flex flex-col">
              <CardContent className="p-2 flex flex-col flex-grow">
                <div className="flex space-x-2 mb-4">
                  <Button
                    onClick={() => setActiveTab("buy")}
                    className={cn(
                      "cursor-pointer transition-colors px-6",
                      activeTab === "buy"
                        ? "bg-[#6FA43A] hover:bg-[#6FA43A] text-white"
                        : "bg-transparent hover:bg-transparent border border-[#64778A] text-[#64778A]"
                    )}
                  >
                    Buy
                  </Button>
                  <Button
                    onClick={() => setActiveTab("sell")}
                    className={cn(
                      "cursor-pointer transition-colors px-6",
                      activeTab === "sell"
                        ? "bg-[#6FA43A] hover:bg-[#6FA43A] text-white"
                        : "bg-transparent hover:bg-transparent border border-[#64778A] text-[#64778A]"
                    )}
                  >
                    Sell
                  </Button>
                </div>

                <div className="space-y-6 flex-grow">
                  {currentOrders.map((order, index) => (
                    <div
                      key={index}
                      className="flex justify-between content-between p-4 bg-white shadow rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="text-sm text-[#1E64A7]">
                          Rate: {order.rate}
                        </p>
                        <p className="text-xl font-bold">{order.amount}</p>
                        <p className="text-sm text-[#536374] italic">
                          Estimated Cost: {order.cost}
                        </p>
                      </div>
                      <div className="text-right place-content-between flex flex-col justify-between">
                        <div>
                          <p
                            className={cn(
                              "text-sm italic",
                              order.partialAllowed
                                ? "text-[#6FA43A]"
                                : "text-[#536374]"
                            )}
                          >
                            {order.status}
                          </p>
                        </div>
                        <div>
                          <Link href={buttonLink}>
                            <Button className="cursor-pointer px-10 bg-transparent border border-[#64778A] text-[#64778A]">
                              {buttonText}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-full">
            <Card className="py-2 h-full flex flex-col">
              <CardHeader className="py-2 px-4 border-b border-[#5995EE29]">
                <CardTitle className="text-sm">
                  USD Virtual Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Bank name</p>
                    <p className="font-medium">Citibank</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bank address</p>
                    <p className="font-medium">
                      111 Wall Street New York, NY 10043 USA
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Routing (ABA)</p>
                    <p className="font-medium">123456789O</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Beneficiary name</p>
                    <p className="font-medium">COMPANY NAME LTD.</p>
                  </div>
                  <div>
                    <p className="text-gray-600">SWIFT code</p>
                    <p className="font-medium">CITIUS33</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Account number</p>
                    <p className="font-medium">123456789O234567</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Account type</p>
                    <p className="font-medium">CHECKING</p>
                  </div>
                </div>
                <div className="place-self-end -mt-4">
                  <Button className="w-full bg-[#6FA43A] hover:bg-[#6FA43A]">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transactions Table */}
        <Card className="py-2">
          <CardHeader className="py-2 px-4 border-b border-[#5995EE29]">
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Select defaultValue="10">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Search..." className="max-w-sm" />
              <div className="flex space-x-2 ml-auto">
                <Input type="date" defaultValue="2025-02-15" className="w-40" />
                <Input type="date" defaultValue="2025-02-18" className="w-40" />
                <Select defaultValue="all-users">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-users">All Users</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-transactions">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-transactions">
                      All transactions
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
