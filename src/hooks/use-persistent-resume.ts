'use client';

import { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'internspark-resume';

interface StoredResume {
  dataUri: string;
  name: string;
}

export function usePersistentResume() {
  const [storedResume, setStoredResume] = useState<StoredResume | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setStoredResume(JSON.parse(item));
      }
    } catch (error) {
      console.error("Failed to read resume from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveResume = useCallback((resume: StoredResume | null) => {
    try {
      if (resume && resume.dataUri) {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resume));
        setStoredResume(resume);
      } else {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        setStoredResume(null);
      }
    } catch (error) {
      console.error("Failed to save resume to localStorage", error);
    }
  }, []);

  return { storedResume, saveResume, isLoaded };
}
