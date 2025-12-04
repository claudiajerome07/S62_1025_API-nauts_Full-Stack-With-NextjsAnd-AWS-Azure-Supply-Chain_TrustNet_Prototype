// src/components/reviews/ReplyForm.tsx
"use client";

import { useState } from "react";

interface ReplyFormProps {
  onSubmit: (reply: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ReplyForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: ReplyFormProps) {
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!reply.trim()) {
      setError("Please enter a reply");
      return;
    }

    if (reply.length > 500) {
      setError("Reply must be less than 500 characters");
      return;
    }

    await onSubmit(reply);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="reply"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Response
          <span className="text-gray-500 text-xs ml-2">
            ({reply.length}/500 characters)
          </span>
        </label>
        <textarea
          id="reply"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Thank you for your feedback. We appreciate your review and will use it to improve our service..."
          disabled={isSubmitting}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Response"
          )}
        </button>
      </div>
    </form>
  );
}
