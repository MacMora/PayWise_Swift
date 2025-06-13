"use client";

import { CiBank } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoCloseOutline } from "react-icons/io5";

export default function WireFundsOut() {
  const [showSendFundsConfirmModal, setShowSendFundsConfirmModal] =
    useState(false);
  const [showSendFundsSuccessModal, setShowSendFundsSuccessModal] =
    useState(false);
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] =
    useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ttd = parseFloat((formData.get("ttd") as string) || "0");

    if (ttd > 1000) {
      setShowInsufficientFundsModal(true);
    } else {
      setShowSendFundsConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    setShowSendFundsConfirmModal(false);
    setShowSendFundsSuccessModal(true);
  };

  const handleCancelModal = () => {
    setShowSendFundsConfirmModal(false);
  };

  const handleCloseSuccess = () => {
    setShowSendFundsSuccessModal(false);
  };

  const handleCloseInsufficientFunds = () => {
    setShowInsufficientFundsModal(false);
  };

  const renderConfirmModal = () => {
    if (!showSendFundsConfirmModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-8 md:w-[500px] shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">Order Confirmation</h2>
          <p className="text-sm mb-4">
            Please review the details below before submitting your transfer.
          </p>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left Column */}
            <div className="space-y-2 text-left">
              <div>
                <p>
                  <span className="font-bold">Recipient Name:</span> John Doe
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Bank Name:</span> Bank of America
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Account Number:</span> 1234567890
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">SWIFT/BIC Code:</span> FBCDTEFGBR
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Country:</span> Trinidad and
                  Tobago
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2 text-left">
              <div>
                <p>
                  <span className="font-bold">Amount</span> 100.00 USD
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Transfer Fee:</span> 5.00 USD
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Total Deducted:</span> 205.00 USD
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Reference:</span> Invoice #4435
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 justify-center pt-4">
            <Button
              className="cursor-pointer rounded-full bg-[#336799] text-white hover:bg-[#336799]"
              onClick={handleConfirm}
            >
              CONFIRM
            </Button>
            <Button
              className="cursor-pointer rounded-full bg-[#5B5C5D] text-white hover:bg-[#5B5C5D]"
              onClick={handleCancelModal}
            >
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccessModal = () => {
    if (!showSendFundsSuccessModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-4 md:w-[500px] shadow-lg text-center relative">
          <IoCloseOutline
            className="justify-self-end h-6 w-6 cursor-pointer"
            onClick={handleCloseSuccess}
          />
          <Image
            src="/images/check-circle.png"
            alt="check-circle"
            width={110}
            height={110}
            className="my-4 mx-auto"
          />
          <h2 className="text-[#6FA43A] text-xl font-bold pb-6">
          Transfer Submitted
          </h2>
          <div className="border-t border-b border-[#CACACA] py-6 w-[85%] mx-auto mb-4 flex justify-center">
            <p className="text-sm italic font-400">
              Your wire transfer has been successfully submitted. <br/>We&apos;ll notify you once it&apos;s processed.
            </p>
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
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="recipient-name"
                      className="text-sm font-medium"
                    >
                      <span className="text-[#FF3A67]">*</span>Recipient Name
                    </Label>
                    <Input
                      id="recipient-name"
                      placeholder="Full Name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="bank-account"
                      className="text-sm font-medium"
                    >
                      <span className="text-[#FF3A67]">*</span>Bank Account
                      Number
                    </Label>
                    <Input id="bank-account" placeholder="0" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="swift-code" className="text-sm font-medium">
                      <span className="text-[#FF3A67]">*</span>SWIFT/BIC Code
                    </Label>
                    <Input
                      id="swift-code"
                      placeholder="SWIFT"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium">
                      <span className="text-[#FF3A67]">*</span>Amount to Send
                    </Label>
                    <Input id="amount" placeholder="$0" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      <span className="text-[#FF3A67]">*</span>Email of
                      Recipient
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bank-name" className="text-sm font-medium">
                      <span className="text-[#FF3A67]">*</span>Recipient Bank
                      Name
                    </Label>
                    <Input
                      id="bank-name"
                      placeholder="Bank Name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="bank-branch"
                      className="text-sm font-medium"
                    >
                      <span className="text-[#FF3A67]">*</span>Bank Branch
                      (optional for local)
                    </Label>
                    <Input
                      id="bank-branch"
                      placeholder="Branch"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="bank-country"
                      className="text-sm font-medium"
                    >
                      <span className="text-[#FF3A67]">*</span>Bank Country
                    </Label>
                    <Input
                      id="bank-country"
                      placeholder="TT"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reference" className="text-sm font-medium">
                      <span className="text-[#FF3A67]">*</span>Transfer
                      Purpose/Reference
                    </Label>
                    <Input id="reference" placeholder="Note" className="mt-1" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="bg-[#6FA43A] hover:bg-[#6FA43A] w-fit"
                >
                  Send Wire
                </Button>
                <p className="text-sm text-black">
                  Transfers may take 1-3 business days
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {renderInsufficientFundsModal()}
      {renderConfirmModal()}
      {renderSuccessModal()}
    </DashboardLayout>
  );
}
