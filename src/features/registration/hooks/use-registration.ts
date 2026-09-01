import { useEffect, useState } from 'react';

import { registrationService } from '@/src/features/registration/services/registration-service';
import type { KycQueueItem, RegistrationDraft } from '@/src/features/registration/types/registration';

export function useRegistrationDraft() {
  const [draft, setDraft] = useState<RegistrationDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function reload() {
    setIsLoading(true);
    try {
      const result = await registrationService.loadDraft();
      setDraft(result);
      setErrorMessage(undefined);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load registration draft.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      try {
        const result = await registrationService.loadDraft();
        if (!active) {
          return;
        }
        setDraft(result);
        setErrorMessage(undefined);
      } catch (error) {
        if (!active) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load registration draft.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function saveDraft(nextDraft: RegistrationDraft) {
    setIsSubmitting(true);
    try {
      const saved = await registrationService.saveDraft(nextDraft);
      setDraft(saved);
      setErrorMessage(undefined);
      return saved;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save registration draft.';
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    draft,
    isLoading,
    isFetching: isLoading,
    isSubmitting,
    errorMessage,
    reload,
    saveDraft,
  };
}

export function useKycQueue() {
  const [items, setItems] = useState<KycQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function reload() {
    setIsLoading(true);
    try {
      const result = await registrationService.loadKycQueue();
      setItems(result);
      setErrorMessage(undefined);
    } catch (error) {
      setItems([]);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load the KYC queue.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      try {
        const result = await registrationService.loadKycQueue();
        if (!active) {
          return;
        }
        setItems(result);
        setErrorMessage(undefined);
      } catch (error) {
        if (!active) {
          return;
        }
        setItems([]);
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load the KYC queue.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function approve(id: string) {
    setIsSubmitting(true);
    try {
      await registrationService.approveKyc(id);
      await reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to approve this KYC request.';
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    items,
    isLoading,
    isFetching: isLoading,
    isSubmitting,
    errorMessage,
    approve,
    reload,
  };
}
