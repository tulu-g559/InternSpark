// src/services/resumeService.ts
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Saves an interaction with an AI flow to Firestore.
 * This includes the flow name, input, and the generated output.
 */
export async function saveInteraction(
  flowName: string,
  input: any,
  output: any
): Promise<string> {
  try {
    // Check if Firebase is configured. If not, log a message and skip saving.
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log('Firebase is not configured. Skipping Firestore save. Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your .env file.');
      return '';
    }

    const sanitizedInput = { ...input };
    if (sanitizedInput.resumeDataUri && typeof sanitizedInput.resumeDataUri === 'string') {
      // To avoid exceeding Firestore's 1MB document limit with large file data URIs,
      // we store only a preview. In a production app, you'd upload the file to
      // Firebase Storage and save the URL here instead.
      sanitizedInput.resumeDataUri = sanitizedInput.resumeDataUri.substring(0, 100) + '...';
    }

    const docRef = await addDoc(collection(db, 'interactions'), {
      flowName,
      input: sanitizedInput,
      output,
      createdAt: serverTimestamp(),
    });

    console.log(`Interaction for flow '${flowName}' saved with ID: ${docRef.id}`);
    return docRef.id;

  } catch (error) {
    console.error(`Error saving interaction for flow '${flowName}' to Firestore:`, error);
    console.error('This error is likely caused by your Firestore security rules. By default, writes are not allowed. Please check the "Rules" tab in your Firebase Console and ensure that writes are permitted to the "interactions" collection. For example, for testing purposes, you could use: `rules_version = \'2\'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if true; } } }`');
    // We are not re-throwing the error to avoid blocking the main user flow.
    return '';
  }
}
