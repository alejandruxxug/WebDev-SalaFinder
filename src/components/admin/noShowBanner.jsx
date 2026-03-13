import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import StateMessage from "../components/ui/StateMessage";

export default function NoShowBanner() {
  const { user } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);

  if (!user || !user.blocked || dismissed) return null;

  const daysRemaining = user.blockedDaysRemaining ?? 0;

  return (
    <div className="w-full border-b bg-yellow-50 px-4 py-3">
      <StateMessage
        type="warning"
        title="Booking temporarily blocked"
        description={`You are blocked from booking spaces. ${daysRemaining} day(s) remaining.`}
        actionText="Dismiss"
        onAction={() => setDismissed(true)}
      />
    </div>
  );
}