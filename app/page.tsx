"use client";

import { useRef, useState, useEffect } from "react";

export default function HomePage() {
  const bookingRef = useRef<HTMLDivElement | null>(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "booking">("phone");

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [slots, setSlots] = useState<string[]>([]);

  // Smooth scroll to booking section
  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load available slots when date changes
  useEffect(() => {
    if (!date) return;

    fetch(`/api/availability?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSlots(data.freeSlots);
        }
      });
  }, [date]);

  // Send OTP
  const sendOtp = async () => {
    await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    setStep("otp");
  };

  // Verify OTP
  const verifyOtp = async () => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    }).then((r) => r.json());

    if (res.success) {
      setVerified(true);
      setStep("booking");
    } else {
      alert(res.message);
    }
  };

  // Book appointment
  const book = async () => {
    const res = await fetch("/api/book", {
      method: "POST",
      body: JSON.stringify({ phone, date, timeSlot }),
    }).then((r) => r.json());

    if (res.success) {
      setSuccessMessage("Your appointment has been successfully booked!");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Reset form
      setPhone("");
      setOtp("");
      setDate("");
      setTimeSlot("");
      setVerified(false);
      setStep("phone");
    } else {
      setSuccessMessage("");
      alert(res.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {successMessage && (
        <div className="w-full bg-green-500 text-white text-center py-3 animate-fadeIn">
          {successMessage}
        </div>
      )}

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Barber Boutique</h1>
        <p className="text-lg text-gray-600 mb-8">
          Premium grooming experience. Book your appointment today.
        </p>

        <button
          onClick={scrollToBooking}
          className="px-8 py-4 bg-black text-white rounded-lg text-xl hover:bg-gray-800 transition"
        >
          Book Appointment Now
        </button>
      </section>

      {/* BOOKING SECTION */}
      <section
        ref={bookingRef}
        className="min-h-screen bg-white px-6 py-20 flex flex-col items-center"
      >
        <h2 className="text-3xl font-semibold mb-10">Book Your Appointment</h2>

        {/* STEP 1 — PHONE */}
        {step === "phone" && (
          <div className="flex flex-col gap-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Phone number"
              className="border p-3 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={sendOtp}
              className="bg-black text-white py-3 rounded hover:bg-gray-800"
            >
              Send Verification Code
            </button>
          </div>
        )}

        {/* STEP 2 — OTP */}
        {step === "otp" && (
          <div className="flex flex-col gap-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Enter OTP"
              className="border p-3 rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="bg-black text-white py-3 rounded hover:bg-gray-800"
            >
              Verify Code
            </button>
          </div>
        )}

        {/* STEP 3 — BOOKING */}
        {step === "booking" && verified && (
          <div className="flex flex-col gap-4 w-full max-w-md">
            <input
              type="date"
              className="border p-3 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <select
              className="border p-3 rounded"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              <option value="">Select a time</option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <button
              onClick={book}
              className="bg-black text-white py-3 rounded hover:bg-gray-800"
            >
              Confirm Appointment
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
