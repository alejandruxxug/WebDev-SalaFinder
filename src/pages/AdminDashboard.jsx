import { useState } from "react";
import reservationsData from "../data/reservations";
import StateMessage from "../components/ui/StateMessage";

export default function AdminDashboard() {
  const [reservations, setReservations] = useState(reservationsData);
  const handleApprove = (id) => {
    setReservations(
      reservations.map((r) =>
        r.id === id ? { ...r, status: "Approved" } : r
      )
    );
  };

  const handleReject = (id) => {
    setReservations(
      reservations.map((r) =>
        r.id === id ? { ...r, status: "Rejected" } : r
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
      <main className="mx-auto max-w-4xl px-6 py-6">
        <StateMessage
          type="empty"
          title="No reservations found"
          description="There are currently no reservations in the system."
        />
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-5xl px-6 py-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-gray-500">
        Manage reservation requests.
      </p>
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
        <tbody>
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

              <td className="py-3 space-x-2">

                {reservation.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(reservation.id)}
                      className="rounded bg-green-600 px-3 py-1 text-white"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(reservation.id)}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}