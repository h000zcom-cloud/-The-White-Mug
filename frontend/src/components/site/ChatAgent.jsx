import { useEffect, useState } from "react";

const AGENT_ID = process.env.REACT_APP_ELEVENLABS_AGENT_ID;
const WIDGET_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";

/**
 * ElevenLabs conversational agent widget.
 *
 * Opt-in: renders nothing unless REACT_APP_ELEVENLABS_AGENT_ID is set. Three
 * reasons it works this way.
 *
 * Privacy. This loads and runs third-party JavaScript from a CDN. That should be
 * a deliberate decision, not something that ships because it was left switched
 * on. (The scaffolding this project came with had exactly that problem —
 * analytics with session recording, enabled by default.)
 *
 * Performance. The widget is a few hundred kilobytes the site does not otherwise
 * need. It loads only once the browser is idle, so it can never delay the hero
 * image or first paint, and a visitor who leaves in two seconds never downloads
 * it at all.
 *
 * Cost. ElevenLabs bills per conversation. Being able to switch this off with an
 * environment variable, without a code change, means you can pull it instantly
 * if usage runs away.
 *
 * ## Why this cannot affect the site's design
 *
 * The widget renders inside its own shadow DOM. Styles do not cross that
 * boundary in either direction: the widget cannot inherit or override any of the
 * site's CSS, and the site's Tailwind classes cannot reach inside it. The only
 * surface it shares with the page is the fixed wrapper below — one positioned
 * div, out of the document flow, so it cannot shift or resize a single existing
 * element.
 */
export default function ChatAgent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!AGENT_ID) return;

    // Already injected by a previous mount.
    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) {
      setReady(true);
      return;
    }

    let cancelled = false;

    const load = () => {
      if (cancelled) return;
      const script = document.createElement("script");
      script.src = WIDGET_SRC;
      script.async = true;
      script.type = "text/javascript";
      script.onload = () => !cancelled && setReady(true);
      script.onerror = () => {
        // The site is fully usable without it, so fail quietly.
        if (process.env.NODE_ENV !== "production") {
          console.warn("[ChatAgent] widget script failed to load");
        }
      };
      document.body.appendChild(script);
    };

    // Wait for idle so this can't compete with anything that matters.
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

  if (!AGENT_ID || !ready) return null;

  return (
    /*
     * z-998 sits below the mobile dock (999) and the nav drawer (1000), so the
     * launcher can never cover the site's own navigation. Lifted clear of the
     * dock on phones via --dock-h, and of the safe-area inset on notched
     * devices.
     */
    <div
      data-testid="chat-agent"
      className="fixed right-3 z-[998] lg:right-5"
      style={{ bottom: "calc(var(--dock-h) + env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <elevenlabs-convai agent-id={AGENT_ID} />
    </div>
  );
}
