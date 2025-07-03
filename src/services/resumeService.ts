// src/services/resumeService.ts
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function saveResume(resumeDataUri: string): Promise<string> {
  try {
    if (!resumeDataUri || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log('Firebase not configured, skipping save.');
      return '';
    }
    
    // For now, we'll store resumes without associating them with a specific user.
    // In a real application, you would include a userId here.
    const docRef = await addDoc(collection(db, 'resumes'), {
      resumeDataUri: resumeDataUri,
      createdAt: serverTimestamp(),
    });
    console.log('Resume saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving resume to Firestore: ', error);
    // We don't want to block the user's main action if Firestore fails,
    // so we'll log the error but not re-throw it.
    // In a production app, you might want to handle this more robustly (e.g., with a monitoring service).
    return '';
  }
}
