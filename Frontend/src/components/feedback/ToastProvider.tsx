import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastContext } from './toastContext';

const DURACAO_TOAST_MS = 4000;

interface Toast {
  id: number;
  tipo: 'sucesso' | 'erro';
  mensagem: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const proximoId = useRef(0);

  const adicionarToast = useCallback((tipo: Toast['tipo'], mensagem: string) => {
    const id = ++proximoId.current;
    setToasts((atuais) => [...atuais, { id, tipo, mensagem }]);
    setTimeout(() => {
      setToasts((atuais) => atuais.filter((toast) => toast.id !== id));
    }, DURACAO_TOAST_MS);
  }, []);

  const value = useMemo(
    () => ({
      mostrarSucesso: (mensagem: string) => adicionarToast('sucesso', mensagem),
      mostrarErro: (mensagem: string) => adicionarToast('erro', mensagem),
    }),
    [adicionarToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.tipo}`}>
            {toast.mensagem}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
