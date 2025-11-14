// app/debug/firebase/page.tsx
"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";

export default function FirebaseDebug() {
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    const checkFirebase = async () => {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const authInfo = {
        appName: auth?.app?.name,
        config: auth?.app?.options,
        authDomain: auth?.app?.options?.authDomain,
      };

      setStatus({
        environmentVariables: config,
        authInstance: authInfo,
        hasMinimalConfig: config.apiKey && config.authDomain && config.projectId && config.appId,
      });
    };

    checkFirebase();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Environment Variables Status</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {Object.entries(status.environmentVariables || {}).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4 mb-2">
              <code className="bg-white px-2 py-1 rounded">{key}:</code>
              <span className={value ? "text-green-600" : "text-red-600"}>
                {value ? `✓ ${String(value).slice(0, 20)}...` : "✗ MISSING"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Firebase Auth Instance</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify(status.authInstance, null, 2)}
        </pre>
      </div>

      {status.hasMinimalConfig ? (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg">
          <p className="font-semibold">✅ Firebase configuration looks good!</p>
          <p className="mt-2">The issue might be in Firebase Console settings.</p>
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-800 p-4 rounded-lg">
          <p className="font-semibold">❌ Firebase configuration is incomplete</p>
          <p>Please check your .env.local file</p>
        </div>
      )}
    </div>
  );
}