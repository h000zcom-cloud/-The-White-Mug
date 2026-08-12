import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { MugMark } from "@/components/brand/Logo";

const AGENT_ID = process.env.REACT_APP_ELEVENLABS_AGENT_ID;
const WIDGET_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";

/**
 * ElevenLabs chat agent, behind our own launcher.
 *
 * The widget's stock launcher is a pale card that vanished against the cream
 * background, and because it renders inside shadow DOM there is no way to
 * restyle it from here. So we use the documented custom-trigger pattern: keep
 * the widget mounted but visually out of the way, present our own button, and
 * call `startConversation()` on it.
 *
 * The host is hidden with opacity and pointer-events rather than `display: none`
 * — a display-none custom element can't lay out its own panel, so the chat would
 * have nowhere to open. This way it is fully rendered, just invisible until a
 * conversation begins.
 *
 * If `startConversation` is ever missing (the widget's API changing under us),
 * `fallback` reveals the stock launcher instead of leaving a dead button.
 *
 * Still opt-in: renders nothing unless REACT_APP_ELEVENLABS_AGENT_ID is set, so
 * no third-party script is fetched and no conversation minutes can be spent.
 */
export default function ChatAgent() {
  const [scriptReady, setScriptReady] = useState(false);
  const [active, setActive] = useState(false);
  const [fallback, setFallback] = useState(false);
  const hostRef = useRef(null);

  // ---- load the widget script once the browser is idle ---------------------
  useEffect(() => {
    if (!AGENT_ID) return;

    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) {
      setScriptReady(true);
      return;
    }

    let cancelled = false;

    const load = () => {
      if (cancelled) return;
      const script = document.createElement("script");
      script.src = WIDGET_SRC;
      script.async = true;
      script.type = "text/javascript";
      script.onload = () => !cancelled && setScriptReady(true);
      script.onerror = () => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[ChatAgent] widget script failed to load");
        }
      };
      document.body.appendChild(script);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }
    const t = setTimeout(load, 2500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  // ---- track conversation state so the launcher gets out of the way --------
  useEffect(() => {
    const el = hostRef.current;
    if (!el || !scriptReady) return;

    const start = () => setActive(true);
    const end = () => setActive(false);

    el.addEventListener("conversationStarted", start);
    el.addEventListener("conversationEnded", end);
    return () => {
      el.removeEventListener("conversationStarted", start);
      el.removeEventListener("conversationEnded", end);
    };
  }, [scriptReady]);

  const open = useCallback(() => {
    const el = hostRef.current;
    if (el && typeof el.startConversation === "function") {
      setActive(true);
      el.startConversation();
      return;
    }
    // API not available: show the widget's own launcher rather than nothing.
    setFallback(true);
    setActive(true);
  }, []);

  const close = useCallback(() => {
    const el = hostRef.current;
    if (el && typeof el.endConversation === "function") el.endConversation();
    setActive(false);
  }, []);

  if (!AGENT_ID) return null;

  const showHost = active || fallback;

  return (
    <div
      data-testid="chat-agent"
      className="tw-agent pointer-events-none fixed inset-0 z-[998]"
      aria-live="polite"
    >
      {/* The widget itself. Invisible and inert until a conversation starts. */}
      <div
        className={
          showHost
            ? "tw-agent__host tw-agent__host--on pointer-events-auto"
            : "tw-agent__host pointer-events-none"
        }
      >
        {/* eslint-disable-next-line react/no-unknown-property */}
        <elevenlabs-convai
          ref={hostRef}
          agent-id={AGENT_ID}
          variant="expanded"
          disable-banner="true"
          avatar-orb-color-1="#C1873F"
          avatar-orb-color-2="#F0DFC2"
          action-text="Ask about the menu"
          start-call-text="Start chat"
          end-call-text="End chat"
          expand-text="Open"
          collapse-text="Close"
        />
      </div>

      {/* Our launcher */}
      {scriptReady && !active && (
        <div className="tw-agent__launcher pointer-events-auto">
          <span aria-hidden="true" className="tw-agent__halo" />
          <button
            type="button"
            onClick={open}
            data-testid="chat-agent-open"
            aria-label="Ask about the menu"
            className="tw-agent__btn group"
          >
            <MugMark
              strokeWidth={5}
              className="tw-agent__mark h-[26px] w-[26px] text-cream transition-transform duration-500 ease-brand group-hover:-translate-y-px"
            />
            <MessageCircle aria-hidden="true" className="tw-agent__chat h-[15px] w-[15px]" />
          </button>
          <span className="tw-agent__label" aria-hidden="true">
            Ask about the menu
          </span>
        </div>
      )}

      {/* Close affordance while the panel is open, in case the widget's own is
          hard to find on a small screen. */}
      {active && !fallback && (
        <button
          type="button"
          onClick={close}
          aria-label="Close chat"
          className="tw-agent__close pointer-events-auto"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
