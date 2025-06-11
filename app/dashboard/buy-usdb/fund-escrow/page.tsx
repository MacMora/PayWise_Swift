"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FundEscrow_Buy() {
  const router = useRouter();
  const [showTransferSuccessModal, setShowTransferSuccessModal] = useState(false);
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ttd = parseFloat((formData.get("ttd") as string) || "0");

    if (ttd > 1000) {
      setShowInsufficientFundsModal(true);
    } else {
      setShowTransferSuccessModal(true);
    }
  };


  const handleCloseSuccess = () => {
    setShowTransferSuccessModal(false);
    router.push("/dashboard/buy-usdb");
  };

  const handleCloseInsufficientFunds = () => {
    setShowInsufficientFundsModal(false);
  };

  const renderTransferSuccessModal = () => {
    if (!showTransferSuccessModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-4 md:w-[550px] shadow-lg text-center relative">
          <IoCloseOutline className="justify-self-end h-6 w-6 cursor-pointer" onClick={handleCloseSuccess} />
          <Image src="/images/check-circle.png" alt="check-circle" width={110} height={110} className="my-4 mx-auto" />
          <h2 className="text-[#6FA43A] text-xl font-bold pb-6">Transfer Successful</h2>
          <div className="border-t border-b border-[#CACACA] py-6 w-[85%] mx-auto mb-4 flex justify-center">
            <p className="text-sm italic font-400">Your funds have been transfered to your escrow account.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderInsufficientFundsModal = () => {
    if (!showInsufficientFundsModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-8 md:w-[450px] shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">
            Order can&apos;t be processed
          </h2>
          <div className="mb-4">
            You don&apos;t have enough TTD in escrow, please try a partial
            purchase or fund your account.
          </div>
          <div className="flex gap-2 justify-center">
            <Link href="/dashboard/buy-usdb/fund-escrow">
              <Button className="bg-[#1E64A7] text-white px-8">
                FUND ESCROW
              </Button>
            </Link>
            <Button variant="outline" onClick={handleCloseInsufficientFunds}>
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
            <form onSubmit={handleFormSubmit} className="flex flex-col justify-between items-start p-2 space-y-4">
              <div className="flex flex-row space-x-6 items-center w-full justify-between"> 
                <div>
                  <Label
                    htmlFor="paywise_wallet"
                    className="text-sm font-medium"
                  >
                    PayWise Wallet:
                  </Label>
                  <Input
                    name="paywise_wallet"
                    placeholder="$4500 TTD"
                    className="mt-1"
                  />
                </div>
                <FaArrowRight className="w-4 h-4 text-[#536374] mt-6" />
                <div>
                  <Label
                    htmlFor="escrow_wallet"
                    className="text-sm font-medium"
                  >
                    Escrow Wallet:
                  </Label>
                  <Input
                    name="escrow_wallet"
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
                  name="amount"
                  placeholder="$2000 TTD"
                  className="mt-1 w-full"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Input
                  name="message"
                  placeholder="Add a note"
                  className="mt-1 w-full"
                />
              </div>
              <div className="flex space-x-3">
                <Link href="/dashboard/buy-usdb">
                <Button className="bg-transparent hover:bg-transparent border border-[#536374] text-[#536374] cursor-pointer">
                  Cancel
                </Button>
                </Link>
                <Button type="submit" className="bg-[#6FA43A] hover:bg-[#6FA43A] cursor-pointer">
                  Next
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {renderTransferSuccessModal()}
      {renderInsufficientFundsModal()}
    </DashboardLayout>
  );
}
