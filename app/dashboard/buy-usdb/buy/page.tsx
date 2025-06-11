"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";

export default function BuyUSDB_Form() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [active, setActive] = useState("FULL");

  const baseClasses = "px-4 py-2 border text-sm";
  const activeClasses = "bg-[#6FA43A] text-white";
  const inactiveClasses = "bg-white text-[#6FA43A]";

  const [showInsufficientFundsModal, setShowInsufficientFundsModal] =
    useState(false);

  const router = useRouter();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ttd = parseFloat((formData.get("ttd") as string) || "0");

    if (ttd > 1000) {
      setShowInsufficientFundsModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    router.push("/dashboard/buy-usdb");
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    router.push("/dashboard/buy-usdb");
  };

  const handleCloseInsufficientFunds = () => {
    setShowInsufficientFundsModal(false);
  };

  const renderBuyForm = () => (
    <div className="space-y-6">
      <h1 className="font-bold text-[#1E64A7]">Buy USDB</h1>
      <Card className="py-2">
        <CardHeader className="px-2 border-b border-[#5995EE29]">
          <CardTitle className="text-base">Buy USDB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:w-[35%] mb-6">
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 mb-4 gap-2 md:w-[70%] rounded-full bg-[#F8F8F8] p-1">
              <button
                type="button"
                onClick={() => setActive("FULL")}
                className={`rounded-full border-[#6FA43A] ${baseClasses} ${
                  active === "FULL" ? activeClasses : inactiveClasses
                }`}
              >
                FULL
              </button>
              <button
                type="button"
                onClick={() => setActive("PARTIAL")}
                className={`rounded-full border-[#6FA43A] ${baseClasses} ${
                  active === "PARTIAL" ? activeClasses : inactiveClasses
                }`}
              >
                PARTIAL
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                className="w-full border rounded px-3 py-2"
                required
                min={1}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                TTD Equivalent
              </label>
              <input
                type="number"
                name="ttd"
                className="w-full border rounded px-3 py-2"
                required
                min={1}
              />
            </div>
            <div className="mb-4 text-gray-700">Rate: 7.8 TTD</div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/buy-usdb")}
                className="cursor-pointer bg-transparent hover:bg-transparent border border-[#536374] text-[#536374]"
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer bg-[#6FA43A] hover:bg-[#6FA43A]">
                Next
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmModal = () => {
    if (!showConfirmModal) return null;
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

  const renderSuccessModal = () => {
    if (!showSuccessModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-4 md:w-[500px] shadow-lg text-center relative">
          <IoCloseOutline className="justify-self-end h-6 w-6 cursor-pointer" onClick={handleCloseSuccess} />
          <Image src="/images/check-circle.png" alt="check-circle" width={110} height={110} className="my-4 mx-auto" />
          <h2 className="text-[#6FA43A] text-xl font-bold pb-6">Order Processed Successfully</h2>
          <div className="border-t border-b border-[#CACACA] py-6 w-[85%] mx-auto mb-4 flex justify-center">
            <p className="text-sm italic font-400">Your order was accepted and proceeded. <br /> --USDB were credited to your account.</p>
          </div>
        </div>
      </div>    
    );
  };

  const renderInsufficientFundsModal = () => {
    if (!showInsufficientFundsModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-lg p-8 w-[400px] shadow-lg text-center">
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
      {renderBuyForm()}
      {renderConfirmModal()}
      {renderSuccessModal()}
      {renderInsufficientFundsModal()}
    </DashboardLayout>
  );
}
