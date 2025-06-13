"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, MenuItem } from "@mui/material";

const steps = [
  "Company Info",
  "Revenue & Payments",
  "Ownership & Funds",
  "Finish"
];

const initialData = {
  companyWebsite: "",
  accountPurpose: "",
  serviceUsage: "",
  complianceExplanation: "",
  estimatedRevenue: "",
  expectedPayments: "",
  prohibitedCountries: "",
  intermediaryOwnership: "",
  sourceFunds: "",
  sourceFundsDesc: "",
};

const MultistepRegister: React.FC = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialData);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goToStep = (idx: number) => {
    if (idx <= step) setStep(idx);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
    else router.push("/register/2fa");
  };

  // Opciones de ejemplo
  const accountPurposeOptions = ["Personal", "Business", "Other"];
  const revenueOptions = ["< $10,000", "$10,000 - $100,000", "> $100,000"];
  const prohibitedOptions = ["Yes", "No"];
  const intermediaryOptions = ["Yes", "No"];
  const sourceFundsOptions = ["Salary", "Business", "Investment", "Other"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff]">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-8 text-[#22314f] text-center">We need some<br />additional information</h2>
        {/* Barra de progreso */}
        <div className="flex items-center justify-center mb-8 w-full">
          {steps.map((label, idx) => (
            <React.Fragment key={label}>
              <button
                type="button"
                className={`cursor-pointer w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors duration-200
                  ${idx === step ? "bg-green-500 border-green-500 text-white" : idx < step ? "bg-green-400 border-green-400 text-white" : "bg-gray-200 border-gray-300 text-gray-400"}
                `}
                onClick={() => goToStep(idx)}
                disabled={idx > step}
                aria-label={`Step ${idx + 1}`}
              >
                {/* idx + 1 */}
                {/*label*/}
              </button>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-8 ${idx < step ? "bg-green-400" : "bg-gray-200"}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <form className="w-full" onSubmit={handleNext}>
          {step === 0 && (
            <>
              <TextField
                label="Company Website"
                name="companyWebsite"
                value={form.companyWebsite}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                placeholder="URL"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Account Purpose"
                name="accountPurpose"
                value={form.accountPurpose}
                onChange={handleSelect}
                fullWidth
                required
                margin="normal"
                placeholder="Select an option"
                InputLabelProps={{ shrink: true }}
              >
                {accountPurposeOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Service Usage Description"
                name="serviceUsage"
                value={form.serviceUsage}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                placeholder="Description"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Compliance Screening Explanation"
                name="complianceExplanation"
                value={form.complianceExplanation}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                placeholder="Explanation"
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
          {step === 1 && (
            <>
              <TextField
                select
                label="Estimated Annual Revenue"
                name="estimatedRevenue"
                value={form.estimatedRevenue}
                onChange={handleSelect}
                fullWidth
                required
                margin="normal"
                placeholder="Select an option"
                InputLabelProps={{ shrink: true }}
              >
                {revenueOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Expected Monthly Payments"
                name="expectedPayments"
                value={form.expectedPayments}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                placeholder="0"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
              <TextField
                select
                label="Do you operate in Prohibited Countries"
                name="prohibitedCountries"
                value={form.prohibitedCountries}
                onChange={handleSelect}
                fullWidth
                required
                margin="normal"
                placeholder="Select an option"
                InputLabelProps={{ shrink: true }}
              >
                {prohibitedOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            </>
          )}
          {step === 2 && (
            <>
              <TextField
                select
                label="Do you have Material Intermediary Ownership"
                name="intermediaryOwnership"
                value={form.intermediaryOwnership}
                onChange={handleSelect}
                fullWidth
                required
                margin="normal"
                placeholder="Select an option"
                InputLabelProps={{ shrink: true }}
              >
                {intermediaryOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Source of Funds"
                name="sourceFunds"
                value={form.sourceFunds}
                onChange={handleSelect}
                fullWidth
                required
                margin="normal"
                placeholder="Select an option"
                InputLabelProps={{ shrink: true }}
              >
                {sourceFundsOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Source of Funds Description"
                name="sourceFundsDesc"
                value={form.sourceFundsDesc}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                placeholder="Description"
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
          <button
            type="submit"
            className="button-primary w-full mt-6"
          >
            {step < 2 ? "Continue" : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MultistepRegister; 