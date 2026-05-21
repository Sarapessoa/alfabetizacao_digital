import { useCallback, useRef } from "react";

type SpeakOptions = {
  file: string;
  text: string;
};

type UseAudioTtsOptions = {
  setSpeaking: (speaking: boolean) => void;
};

const AUDIO_BASE = "/audio/tts/";

export function useAudioTts({ setSpeaking }: UseAudioTtsOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  }, [setSpeaking]);

  const speakWithBrowserFallback = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "pt-BR";
      utter.rate = 0.9;
      utter.pitch = 1;

      const ptVoice = window.speechSynthesis
        .getVoices()
        .find((v) => v.lang.toLowerCase().startsWith("pt-br")) ??
        window.speechSynthesis
          .getVoices()
          .find((v) => v.lang.toLowerCase().startsWith("pt"));

      if (ptVoice) utter.voice = ptVoice;
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);

      setSpeaking(true);
      window.speechSynthesis.speak(utter);
    },
    [setSpeaking],
  );

  const speak = useCallback(
    ({ file, text }: SpeakOptions) => {
      stopSpeaking();

      if (typeof Audio === "undefined") {
        speakWithBrowserFallback(text);
        return;
      }

      const audio = new Audio(`${AUDIO_BASE}${file}`);
      audioRef.current = audio;
      audio.onended = () => {
        if (audioRef.current === audio) audioRef.current = null;
        setSpeaking(false);
      };
      audio.onerror = () => {
        if (audioRef.current === audio) audioRef.current = null;
        speakWithBrowserFallback(text);
      };

      setSpeaking(true);
      audio.play().catch(() => {
        if (audioRef.current === audio) audioRef.current = null;
        speakWithBrowserFallback(text);
      });
    },
    [setSpeaking, speakWithBrowserFallback, stopSpeaking],
  );

  return { speak, stopSpeaking };
}
