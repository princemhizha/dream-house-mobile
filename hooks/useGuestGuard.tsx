import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export type GuestPromptType = 'save' | 'contact' | 'premium';

export function useGuestGuard() {
  const isGuest = useAuthStore((s) => s.isGuest);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState<GuestPromptType>('save');

  const showSignUpPrompt = (type: GuestPromptType = 'save') => {
    if (!isGuest) return false;
    setPromptType(type);
    setShowPrompt(true);
    return true;
  };

  const hidePrompt = () => setShowPrompt(false);

  return { isGuest, showSignUpPrompt, showPrompt, hidePrompt, promptType };
}
