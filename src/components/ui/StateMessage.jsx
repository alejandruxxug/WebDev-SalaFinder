import { FiLoader, FiAlertTriangle, FiInbox } from "react-icons/fi";

export default function StateMessage({
  title,
  type,
  description,
  actionText,
  onAction,
}) {
  const Icon =
    type === "loading"
      ? FiLoader
      : type === "error"
      ? FiAlertTriangle
      : FiInbox;

  const ring =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-600"
      : type === "loading"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-gray-200 bg-white text-gray-500";

  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center shadow-sm">
      <div
        className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border ${ring}`}
      >
        <Icon className={type === "loading" ? "animate-spin" : ""} />
      </div>

      <h2 className="text-base font-semibold text-gray-800">{title}</h2>

      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}

      {actionText && onAction && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onAction}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
}