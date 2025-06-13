"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Copy, Check } from "lucide-react";
import { CiBank } from "react-icons/ci";
import { BsInfoCircle } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const accountDetails = [
  { label: "Bank name", value: "Citibank" },
  { label: "Bank address", value: "111 Wall Street New York, NY 10043 USA" },
  { label: "Routing (ABA)", value: "123456789O" },
  { label: "Beneficiary name", value: "COMPANY NAME LTD." },
  { label: "SWIFT code", value: "CITIUS33" },
  { label: "Account number", value: "123456789O234567" },
  { label: "Account type", value: "CHECKING", fullWidth: true },
];

export default function WireFundsIn() {
  const [copiedMap, setCopiedMap] = useState<{ [key: number]: boolean }>({});
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text).then(() => {
      if (index !== undefined) {
        setCopiedMap((prev) => ({ ...prev, [index]: true }));
        setTimeout(() => {
          setCopiedMap((prev) => ({ ...prev, [index]: false }));
        }, 2000);
      } else {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    });
  };

  const copyAllDetails = () => {
    const allText = accountDetails
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n");
    copyToClipboard(allText);
  };

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
            <div className="flex flex-col md:grid md:grid-cols-2 gap-y-4 text-sm">
              {accountDetails.map((item, index) => (
                <div key={index} className={item.fullWidth ? "col-span-2" : ""}>
                  <p className="text-gray-600">{item.label}</p>
                  <div className="flex items-center justify-start">
                    <p className="font-medium">{item.value}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.value, index)}
                      className="text-gray-500 hover:text-[#6FA43A] ml-2 cursor-pointer"
                      aria-label={`Copy ${item.label}`}
                    >
                      {copiedMap[index] ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex md:justify-end md:-mt-4 w-full">
              <Button
                className="cursor-pointer bg-[#6FA43A] hover:bg-[#6FA43A]"
                onClick={copyAllDetails}
              >
                {copiedAll ? (
                  <Check className="w-4 h-4 mr-2 text-white" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                Copy Details
              </Button>
            </div>

            {/* Information Notice */}
            <Card className="md:w-3/4 border-[#4E9FFF1F] mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BsInfoCircle className="h-5 w-5 text-[#64778A] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-black">
                    <p className="italic">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation.
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
