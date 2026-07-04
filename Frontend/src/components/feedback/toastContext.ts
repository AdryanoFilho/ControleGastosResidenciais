import { createContext } from 'react';

export interface ToastContextValue {
  mostrarSucesso: (mensagem: string) => void;
  mostrarErro: (mensagem: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
