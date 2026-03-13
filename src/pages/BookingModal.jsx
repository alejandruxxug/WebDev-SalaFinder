import { useState } from "react";

export default function BookingModal({ spaceId, date, startTime, endTime }) {

  const [purpose, setPurpose] = useState("");
  const [attendeeCount, setAttendeeCount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReservation = {
      id: Date.now(),
      space: spaceId,
      date,
      time: `${startTime} - ${endTime}`,
      purpose,
      attendeeCount,
      status: "Pending"
    };
    console.log("Reservation created:", newReservation);
    setMessage("Reservation created successfully");
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-6">
      <section className="rounded-card border border-border bg-surface p-6 shadow-card">
        <h2 className="text-xl font-semibold">Create Reservation</h2>
        <div className="mt-4 text-sm">
          <p><strong>Space:</strong> {spaceId}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Time:</strong> {startTime} - {endTime}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Attendee Count</label>
            <input
              type="number"
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
          >
            Create Reservation
          </button>
        </form>
        {message && (
          <p className="mt-4 text-green-600">{message}</p>
        )}
      </section>
    </main>
  );
}