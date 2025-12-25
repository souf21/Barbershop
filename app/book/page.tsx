// app/book/page.tsx
"use client";

import { useState, useEffect } from "react";

interface AvailabilityResponse {
  success: boolean;
  freeSlots: string[];
  bookedSlots: string[];
}

interface BookResponse {
  success: boolean;
  message?: string;
}

export default function BookPage() {
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!date) return;

    fetch(`/api/availability?date=${date}`)
      .then((r) => r.json())
      .then((data: AvailabilityResponse) => {
        if (data.success) {
          setSlots(data.freeSlots);
        }
      });
  }, [date]);

  const book = async () => {
    const res = await fetch("/api/book", {
      method: "POST",
      body: JSON.stringify({ phone, date, timeSlot }),
    }).then((r) => r.json() as Promise<BookResponse>);

    if (res.success) {
      alert("Booking confirmed!");
    } else {
      alert(res.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Book Appointment</h1>

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
        <option value="">Select a time</option>

        {slots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      <button onClick={book}>Book</button>
    </div>
  );
}
