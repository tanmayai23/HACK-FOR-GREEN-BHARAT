import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm
                    bg-white border border-green-200 rounded-2xl shadow-lg px-4 py-3
                    flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-tight">Install SwachhVan</p>
        <p className="text-xs text-gray-500 mt-0.5">Add to home screen for quick access</p>
      </div>
      <Button
        size="sm"
        className="shrink-0 bg-green-600 hover:bg-green-700 text-white text-xs px-3 h-8 rounded-xl"
        onClick={handleInstall}
      >
        <Download className="w-3 h-3 mr-1" />
        Install
      </Button>
      <button
        aria-label="Dismiss install prompt"
        className="shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
        onClick={() => setVisible(false)}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
