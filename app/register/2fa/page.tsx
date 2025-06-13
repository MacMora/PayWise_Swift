"use client";
import React, { useState } from "react";
import { TextField } from "@mui/material";

const Register2FA: React.FC = () => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías validar el código
    // Redirigir o mostrar mensaje de éxito
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff]">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-center text-[#22314f]">Enable Two Factor<br />Authentication</h2>
        <p className="mb-2 text-center text-[#22314f]">You will need a <a href="https://support.google.com/accounts/answer/1066447?hl=en" className="text-[#1e5fa6] underline" target="_blank">Google Authenticator</a> to complete this process</p>
        <p className="mb-2 text-center text-[#22314f]">Scan the qr code into your app</p>
        <div className="flex justify-center mb-4">
          {/* Aquí deberías renderizar el QR real, por ahora un placeholder */}
          <div className="bg-gray-200 rounded p-4 flex items-center justify-center">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=paywise-swift" alt="QR Code" width={120} height={120} />
          </div>
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <TextField
            label="Enter the 6-digit authentication code:"
            name="code"
            value={code}
            onChange={e => setCode(e.target.value)}
            fullWidth
            required
            margin="normal"
            placeholder="Description"
            InputLabelProps={{ shrink: true }}
          />
          <button type="submit" className="cursor-pointer button-primary w-full mt-6">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default Register2FA; 