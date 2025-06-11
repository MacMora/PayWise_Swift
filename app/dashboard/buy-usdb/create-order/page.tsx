"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";

export default function CreateOrder_Buy() {

  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);

  const router = useRouter();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ttd = parseFloat((formData.get("ttd") as string) || "0");

    if (ttd > 1000) {
      setShowInsufficientFundsModal(true);
    } else {
      setShowOrderConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    setShowOrderConfirmModal(false);
    setShowOrderSuccessModal(true);
  };

  const handleCancelModal = () => {
    setShowOrderConfirmModal(false);
  };

  const handleCloseSuccess = () => {
    setShowOrderSuccessModal(false);
    router.push("/dashboard/buy-usdb");
  };

  const handleCloseInsufficientFunds = () => {
    setShowInsufficientFundsModal(false);
  };

  const renderOrderConfirmModal = () => {
    if (!showOrderConfirmModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-8 md:w-[450px] shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">Order Confirmation</h2>
          <div className="mb-4">
            <div>Buying: -- USDB</div>
            <div>At Rate: --</div>
            <div>Fee: 1%</div>
            <div>Total Cost: -- TTD</div>
            <div>Net USDB you&apos;ll receive: -- USDB</div>
          </div>
          <div className="grid grid-cols-2 gap-2 justify-center pt-4">
            <Button className="cursor-pointer rounded-full bg-[#336799] text-white hover:bg-[#336799]" onClick={handleConfirm}>
              CONFIRM
            </Button>
            <Button className="cursor-pointer rounded-full bg-[#5B5C5D] text-white hover:bg-[#5B5C5D]" onClick={handleCancelModal}>
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderSuccessModal = () => {
    if (!showOrderSuccessModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-4 md:w-[500px] shadow-lg text-center relative">
          <IoCloseOutline className="justify-self-end h-6 w-6 cursor-pointer" onClick={handleCloseSuccess} />
          <Image src="/images/check-circle.png" alt="check-circle" width={110} height={110} className="my-4 mx-auto" />
          <h2 className="text-[#6FA43A] text-xl font-bold pb-6">Order Created</h2>
          <div className="border-t border-b border-[#CACACA] py-6 w-[85%] mx-auto mb-4 flex justify-center">
            <p className="text-sm italic font-400">Your order was created successfully.</p>
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
          <h1 className="font-bold text-[#1E64A7]">Create Buy USDB Order</h1>
        </div>

        {/* Order Card */}
        <Card className="py-2">
          <CardHeader className="px-2 border-b border-[#5995EE29]">
            <CardTitle className="text-base">Create Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:w-[35%] mb-6">
            {/* Order Form */}
            <form onSubmit={handleFormSubmit} className="flex flex-col justify-between items-start p-2 space-y-4">
              <div className="w-full">
                <Label htmlFor="ttd_amount" className="text-sm font-medium">
                  <span className="text-[#FF3A67]">*</span>Enter TTD Amount
                </Label>
                <Input
                  name="ttd_amount"
                  placeholder="$780"
                  className="mt-1 w-full"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="rate" className="text-sm font-medium">
                  <span className="text-[#FF3A67]">*</span>Enter Rate
                </Label>
                <Input name="rate" placeholder="7.8" className="mt-1 w-full" />
              </div>
              <div className="w-full">
                <Label
                  htmlFor="equivalent_in_usd"
                  className="text-sm font-medium"
                >
                  <span className="text-[#FF3A67]">*</span>Equivalent in USD
                </Label>
                <Input
                  name="equivalent_in_usd"
                  placeholder="$100"
                  className="mt-1 w-full"
                />
              </div>
              <div className="w-full">
                <Label
                  htmlFor="partial_purchase"
                  className="text-sm font-medium"
                >
                  <span className="text-[#FF3A67]">*</span>Allow Partial
                  Purchase?
                </Label>
                <Select name="partial_purchase">
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="minimum_amount_to_buy"
                  className="text-sm font-medium"
                >
                  <span className="text-[#FF3A67]">*</span>Minimum Amount that
                  can be Bought (TTD)
                </Label>
                <Input
                  name="minimum_amount_to_buy"
                  placeholder="0"
                  className="mt-1 w-full"
                />
              </div>
              <div className="flex space-x-3">
                <Link href="/dashboard/buy-usdb">
                  <Button className="cursor-pointer bg-transparent hover:bg-transparent border border-[#536374] text-[#536374]">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="cursor-pointer bg-[#6FA43A] hover:bg-[#6FA43A]">
                  Next
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {renderOrderConfirmModal()}
      {renderOrderSuccessModal()}
      {renderInsufficientFundsModal()}
    </DashboardLayout>
  );
}
