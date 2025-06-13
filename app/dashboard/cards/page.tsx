"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { CiCirclePlus } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { FaRegCopy } from "react-icons/fa";
import Image from "next/image";

// Function to generate a card
function generateCard() {
  return {
    id: Date.now(),
    number: "1234 5678 9102 1234",
    holder: "Max Power",
    validFrom: "12/23",
    validThru: "12/29",
    activeSince: "May 1st, 2025",
  };
}

// Card type
interface CardType {
  id: number;
  number: string;
  holder: string;
  validFrom: string;
  validThru: string;
  activeSince: string;
}

export default function Cards() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [copied, setCopied] = useState(false);

  // Modal para crear tarjeta
  const handleCreateCard = () => {
    setCards([...cards, generateCard()]);
    setShowCreateModal(false);
  };

  // Modal para ver detalles (PIN)
  const handleShowPinModal = (card: CardType) => {
    setSelectedCard(card);
    setShowPinModal(true);
    setPin("");
    setPinError("");
  };

  const handlePinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPinModal(false);
    setShowDetailsModal(true);
    setPinError("");
  };

  // Modal to show card details
  const handleCopy = () => {
    if (selectedCard) {
      const text = `Card Number: ${selectedCard.number}\nCardholder: ${selectedCard.holder}\nValid From: ${selectedCard.validFrom}\nValid Thru: ${selectedCard.validThru}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-600">Cards</h1>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="py-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-xs text-[#1E64A7]">
                      Active since {card.activeSince}
                    </p>
                    <p className="font-bold text-[#2F4050] mt-1">
                      XXXX-{card.number.slice(-4)}
                    </p>
                  </div>
                </div>
                <button
                  className="cursor-pointer border-2 border-[#64778A] rounded-full p-2 hover:bg-gray-100"
                  title="Show card details"
                  onClick={() => handleShowPinModal(card)}
                >
                  <IoEyeOutline className="h-4 w-4 text-[#64778A]" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Request new card */}
        <Card
          onClick={() => setShowCreateModal(true)}
          className="py-2 border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center gap-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <div className="text-start">
                  <p className="text-sm text-[#1E64A7]">Virtual debit card</p>
                  <p className="font-bold text-[#2F4050]">Request a new card</p>
                </div>
              </div>
              <CiCirclePlus className="h-10 w-10 text-[#64778A]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Card Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <div className="flex flex-col items-center p-6">
            <h2 className="font-bold mb-4">Request a New Card</h2>
            <p className="mb-6 text-center text-base">
              To request a new card, make sure you have at least X USDB
              available in your account.
              <br />
              This amount will be deducted automatically once your request is
              confirmed.{" "}
              <span className="font-bold">
                You can request more than one card if needed.
              </span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 w-full">
              <button
                type="button"
                className="cursor-pointer rounded-full py-2 px-4 bg-[#336799] text-white text-lg font-bold "
                onClick={handleCreateCard}
              >
                REQUEST
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-full py-2 px-4 bg-[#5B5C5D] text-white text-lg font-bold"
                onClick={() => setShowCreateModal(false)}
              >
                CANCEL
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <Modal onClose={() => setShowPinModal(false)}>
          <div className="flex flex-col items-center p-8 w-[85%]">
            <h2 className="text-2xl font-bold mb-4">Card Details</h2>
            <p className="mb-4 text-center">
              To complete your request, enter the verification code we sent to
              your email
            </p>
            <form
              onSubmit={handlePinSubmit}
              className="flex flex-col justify-center items-center w-full"
            >
              <input
                type="password"
                maxLength={6}
                className="border border-[#00000026] rounded py-2 text-center text-lg mb-2"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="******"
                autoFocus
              />
              {pinError && (
                <span className="text-red-500 text-sm mb-2">{pinError}</span>
              )}
              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  className="cursor-pointer w-[65%] mt-2 px-10 py-2 rounded-full bg-[#336799] text-white font-semibold"
                >
                  SUBMIT
                </button>
              </div>
            </form>
            <p className="mt-4 text-sm text-center">
              Didn&#39;t get the email?{" "}
              <span className="underline cursor-pointer text-black font-bold">
                Send again.
              </span>
            </p>
          </div>
        </Modal>
      )}

      {/* Card Details Modal */}
      {showDetailsModal && selectedCard && (
        <Modal onClose={() => setShowDetailsModal(false)}>
          <div className="flex flex-col items-center p-8 w-full">
            <h2 className="text-2xl font-bold mb-4">Card Details</h2>
            {/* Card visual */}
            <div className="mb-4">
              <Image
                src="/images/card-example.jpg"
                alt="Card"
                width={300}
                height={200}
              />
            </div>
            <button
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 font-semibold mb-4 hover:bg-gray-200"
              onClick={handleCopy}
            >
              Copy card details
              <FaRegCopy />
              {copied && <span className="ml-2 text-green-600">Copied!</span>}
            </button>
            <div className="w-full flex justify-center">
              <button
                className="w-[45%] py-2 rounded-full bg-[#336799] text-white font-bold cursor-pointer"
                onClick={() => setShowDetailsModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

// Modal genérico reutilizable
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9B2] bg-opacity-30">
      <div className="flex flex-col items-center bg-white rounded-xl shadow-xl w-[300px] md:w-[450px] relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
