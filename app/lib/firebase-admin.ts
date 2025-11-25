// // lib/firebase-admin.ts
// import admin from "firebase-admin";

// function initializeFirebaseAdmin() {
//   if (admin.apps.length > 0) {
//     return admin.apps[0]!;
//   }

//   const projectId = process.env.FIREBASE_PROJECT_ID;
//   const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
//   const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

//   if (projectId && clientEmail && privateKey) {
//     try {
//       console.log("Initializing Firebase Admin with service account");
//       return admin.initializeApp({
//         credential: admin.credential.cert({
//           projectId,
//           clientEmail,
//           privateKey,
//         }),
//       });
//     } catch (error) {
//       console.error("Firebase Admin initialization error:", error);
//       return null;
//     }
//   } else {
//     console.warn("Firebase Admin environment variables missing:", {
//       hasProjectId: !!projectId,
//       hasClientEmail: !!clientEmail,
//       hasPrivateKey: !!privateKey,
//     });
//     return null;
//   }
// }

// const app = initializeFirebaseAdmin();
// export const adminAuth = app ? admin.auth(app) : null;

// lib/firebase-admin.ts
import admin from "firebase-admin";

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Missing Firebase Admin environment variables");
    return null;
  }

  try {
    console.log("Initializing Firebase Admin...");
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    return null;
  }
}

const app = initializeFirebaseAdmin();
export const adminAuth = app ? admin.auth(app) : null;
export default app;
