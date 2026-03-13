import { useState } from "react";
import reservationsData from "../data/reservations";

export default function ReservationList() {
  const [reservations, setReservations] = useState(reservationsData);
  const handleCancel = (id) => {
    setReservations(
      reservations.map((r) =>
        r.id === id ? { ...r, status: "Cancelled" } : r
      )
    );
  };

  const getStatusColor = (status) => {
    if (status === "Pending") return "orange";
    if (status === "Approved") return "green";
    if (status === "Rejected") return "red";
    if (status === "Cancelled") return "gray";
    return "black";
  };

  if (reservations.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-6">
        <h2>No reservations yet</h2>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">

      <h2 className="text-xl font-semibold">My Reservations</h2>

      <table className="mt-6 w-full border-collapse">

        <thead>
          <tr>
            <th className="border-b py-2 text-left">Space</th>
            <th className="border-b py-2 text-left">Date</th>
            <th className="border-b py-2 text-left">Time</th>
            <th className="border-b py-2 text-left">Status</th>
            <th className="border-b py-2 text-left">Actions</th>
          </tr>
        </thead>

        <body>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td className="py-3">{reservation.space}</td>
              <td className="py-3">{reservation.date}</td>
              <td className="py-3">{reservation.time}</td>
              <td className="py-3">
                <span style={{ color: getStatusColor(reservation.status) }}>
                  {reservation.status}
                </span>
              </td>
              <td className="py-3">
                {(reservation.status === "Pending" ||
                  reservation.status === "Approved") && (
                  <button
                    onClick={() => handleCancel(reservation.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </body>
      </table>
    </main>
  );
}