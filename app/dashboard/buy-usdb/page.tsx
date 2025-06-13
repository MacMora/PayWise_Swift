"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { IoCloseOutline, IoWalletOutline } from "react-icons/io5";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

// Tipos para las órdenes
interface Order {
  id: number;
  rate: number;
  amount: number;
  ttd: number;
  partialAllowed: boolean;
}

// Mock de órdenes (puedes reemplazar por datos reales)
const ORDERS: Order[] = [
  {
    id: 1,
    rate: 7.8,
    amount: 100,
    ttd: 780,
    partialAllowed: false,
  },
  {
    id: 2,
    rate: 7.8,
    amount: 200,
    ttd: 1560,
    partialAllowed: true,
  },
];

export default function BuyUSDB() {
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false);
  const [showDeleteOrderSuccessModal, setShowDeleteOrderSuccessModal] = useState(false);

  const handleToggleOrders = () => {
    setShowMyOrders((prev) => !prev);
  };

  const handleConfirm = () => {
    setShowDeleteOrderModal(false);
    setShowDeleteOrderSuccessModal(true);
  };

  const handleCancelModal = () => {
    setShowDeleteOrderModal(false);
  };

  const handleCloseSuccess = () => {
    setShowDeleteOrderSuccessModal(false);
  };

  const renderOrders = (orders: Order[], isMyOrders = false) => (
    <Card className="py-2">
      <CardHeader className="px-2 border-b border-[#5995EE29]">
        <CardTitle className="text-base">
          {isMyOrders ? "My Orders" : "Active Orders"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:w-[45%] mb-6">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            className="flex justify-between items-center p-4 shadow rounded-lg"
          >
            <div>
              <p className="text-sm text-blue-600">
                Rate: {order.rate.toFixed(2)} TTD / 1 USDB
              </p>
              <p className="text-xl font-bold">{order.amount} USDB</p>
              <p className="text-sm text-gray-600 italic">
                Estimated Cost: ${order.ttd} TTD (for full quantity)
              </p>
            </div>
            <div className="text-right place-content-between flex flex-col justify-between">
              <div>
                <p
                  className={`text-sm italic ${order.partialAllowed ? "text-green-600" : "text-gray-600"}`}
                >
                  {order.partialAllowed
                    ? "Partial Purchase allowed"
                    : "Partial Purchase Not allowed"}
                </p>
              </div>
              <div>
                {isMyOrders ? (
                  <Button className="mt-2 px-10 bg-red-500 text-white" onClick={() => {setShowDeleteOrderModal(true)}}>
                    Delete
                  </Button>
                ) : (
                  <Link href="/dashboard/buy-usdb/buy">
                  <Button
                    className="mt-2 px-10 bg-transparent border border-[#64778A] text-[#64778A] cursor-pointer"
                  >
                    Buy
                  </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderDeleteOrderModal = () => {
    if (!showDeleteOrderModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-8 w-[300px] md:w-[400px] shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">Delete order</h2>
          <div className="mb-4">
            <p>Are you sure you want to delete this order?</p>
          </div>
          <div className="grid grid-cols-2 gap-2 justify-center pt-4">
            <Button className="cursor-pointer rounded-full bg-[#336799] text-white hover:bg-[#336799]" onClick={handleConfirm}>
              DELETE
            </Button>
            <Button className="cursor-pointer rounded-full bg-[#5B5C5D] text-white hover:bg-[#5B5C5D]" onClick={handleCancelModal}>
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteOrderSuccessModal = () => {
    if (!showDeleteOrderSuccessModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
        <div className="bg-white rounded-xl p-4 w-[300px] md:w-[400px] shadow-lg text-center relative">
          <IoCloseOutline className="justify-self-end h-6 w-6 cursor-pointer" onClick={handleCloseSuccess} />
          <Image src="/images/check-circle.png" alt="check-circle" width={110} height={110} className="my-4 mx-auto" />
          <h2 className="text-[#6FA43A] text-xl font-bold pb-6">Order Deleted</h2>
          <div className="border-t border-b border-[#CACACA] py-6 w-[85%] mx-auto mb-4 flex justify-center">
            <p className="text-sm italic font-400">Your order was deleted.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="md:flex items-center justify-between">
          <h1 className="font-bold text-[#1E64A7]">Buy USDB</h1>
          <div className="grid grid-cols-2 md:flex space-x-3">
            <Button
              className="cursor-pointer bg-transparent hover:bg-transparent border border-[#536374] text-[#536374]"
              onClick={handleToggleOrders}
            >
              {showMyOrders ? "See Order" : "My Order"}
            </Button>
            <Link href="/dashboard/buy-usdb/create-order">
              <Button className="bg-[#6FA43A] hover:bg-[#6FA43A] cursor-pointer">
                Create a New Order
              </Button>
            </Link>
          </div>
        </div>
        {/* PayWise Account Balance */}
        <Card className="px-2 py-[10px] rounded-md md:w-[350px] shadow-[#4E9FFF1F]">
          <CardContent className="px-2">
            <div className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <IoWalletOutline className="h-8 w-8 text-[#353E5C]" />
                <div>
                  <p className="text-sm text-[#1E64A7]">
                    PayWise Account (Escrow)
                  </p>
                  <p className="text-2xl font-bold text-[#2F4050]">
                    1000.00 TTD
                  </p>
                </div>
              </div>
              <Link href="/dashboard/buy-usdb/fund-escrow">
                <Button className="cursor-pointer" variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        {/* Orders Card */}
        {showMyOrders
          ? renderOrders(ORDERS, true)
          : renderOrders(ORDERS, false)}

        {/* Modals */}
        {renderDeleteOrderModal()}
        {renderDeleteOrderSuccessModal()}
      </div>
    </DashboardLayout>
  );
}
