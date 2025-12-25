// app/verify/page.tsx
"use client";

import { useState } from "react";

interface VerifyResponse {
  success: boolean;
  message?: string;
}

export default function VerifyPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const sendOtp = async () => {
    await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    setStep("otp");
  };

  const verifyOtp = async () => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    }).then((r) => r.json() as Promise<VerifyResponse>);

    if (res.success) {
      alert("Phone verified!");
      window.location.href = "/book";
    } else {
      alert(res.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Phone Verification</h1>

      {step === "phone" && (
        <>
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            type="text"
            placeholder="Enter code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify</button>
        </>
      )}
    </div>
  );
}
