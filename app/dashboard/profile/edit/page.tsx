// app/dashboard/profile/edit/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkUserRoleAndRedirect = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          const role = result.data.user.role.toLowerCase();

          // Redirect to role-specific edit page
          router.push(`/dashboard/profile/edit/${role}`);
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };

    checkUserRoleAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );
}
