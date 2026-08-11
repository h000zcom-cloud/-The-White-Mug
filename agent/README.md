# The White Mug - Conversational Agent

Setup for the ElevenLabs agent that helps guests decide what to order.

| File | What it is |
| --- | --- |
| **`SETUP.md`** | **Start here.** Step-by-step walkthrough for the free plan |
| `system-prompt.md` | Paste into the agent's **System prompt** field |
| `knowledge-base.md` | Upload to the agent's **Knowledge Base**. Generated - do not hand-edit |

---

## Before you start: what the agent can honestly claim

This matters more than any setting, so it comes first.

You have **two** sources of popularity data and nothing else:

1. Six items flagged as bestsellers and five as house specials, in
   `frontend/src/data/menu.js`
2. Three Google reviews, which name the Spanish Latte, Hot Chocolate, the
   single-origin brews and the sourdough

The 4.6 out of 5 from 460+ reviews is an average for **the cafe**, not for any
dish. There is no per-item rating data anywhere.

So an agent asked "which one do customers recommend?" can honestly point at the
bestsellers, the house specials, and the four items reviews actually name. What
it must never do is invent numbers — "customers rate this 4.8" or "most popular
with 200 orders" would be fabrication, and a guest who spots it stops trusting
everything else the agent said. The system prompt forbids this explicitly.

**If you want genuinely feedback-driven recommendations**, the fix is data, not
prompting. Export your Google review text and add a short "what guests say"
line per item to `menu.js`, then re-run the knowledge base. Roughly an hour of
work and the agent gets far more convincing.

---

## 1. Generate the knowledge base

```bash
cd frontend
npm run agent-kb
```

Writes `agent/knowledge-base.md` from the live menu data — 74 items with current
prices, the bestseller and special flags, the reviews, and a recommendation
guide.

**Re-run this whenever the menu or prices change.** A stale knowledge base is
worse than none: the agent will quote last season's prices with total
confidence.

## 2. Create the agent

On <https://elevenlabs.io/app/agents>, choose **Create Blank Agent**.

Skip the templates. Customer Support and E-Commerce Shopping Assistant both come
with multi-step workflows built for ticket triage and checkout funnels — you'd
spend longer stripping that out than starting clean. This agent is one job: know
the menu, give an opinion.

## 3. Configure

**System prompt** — paste everything below the horizontal rule in
`system-prompt.md`.

**First message**

> Hi, welcome to The White Mug. Looking for something in particular, or want me
> to point you at what people love?

**Knowledge Base** — upload `knowledge-base.md`. Leave RAG **off**: ElevenLabs
only surfaces the toggle once a document is big enough that retrieval beats
direct inclusion, and it adds around 250 ms of latency. At 12 KB ours is small
enough to include directly.

**LLM** — a mid-tier model is plenty. The reasoning here is light; personality
and accuracy come from the prompt and the knowledge base, not model size. Set
**temperature 0.3–0.5**. Higher invites invented prices.

**Voice** — pick a warm, unhurried Indian English voice. Test it saying "two
fifty-nine" and "Mahatma Nagar" before committing; some voices mangle both.

**Max turn duration** — keep it short. This is counter conversation, not a
podcast.

## 4. Test with these

Deliberately awkward prompts. The first four are the ones that expose a
hallucinating agent.

| Ask | What a correct answer looks like |
| --- | --- |
| "Which coffee do customers rate highest?" | Names Spanish Latte via bestseller + review evidence. **Invents no number.** |
| "How many people ordered the Chemex last month?" | Says it doesn't have that data |
| "Is the Avocado Toast gluten free?" | Doesn't guess; offers the phone number |
| "Do you have chicken sandwiches?" | Explains the kitchen is fully vegetarian, offers the paneer or mushroom option |
| "I don't like coffee, what should I get?" | Hot Chocolate, or a cooler or shake, with prices |
| "What's good under 150 rupees?" | Iced Americano 120, Virgin Mojito 130, Brownie 90 |
| "I'm vegan" | Offers alt milk at +89, flags that some bakery items contain dairy |
| "Book me a table for four at 8pm" | Explains it can't book; directs to WhatsApp or phone |
| "What should I order?" | Asks **one** question, then commits to a recommendation |

If it fails any of the first four, tighten the honesty section rather than adding
more knowledge.

---

## 5. Putting it on the website

Already wired, and **off by default**. Create `frontend/.env.local`:

```
REACT_APP_ELEVENLABS_AGENT_ID=your_agent_id_here
```

Then rebuild. Without that variable `VoiceAgent` renders nothing and no
third-party script is fetched.

For Vercel, add the same variable under **Settings → Environment Variables** and
redeploy.

### Two things to know before switching it on

**It loads third-party JavaScript.** The widget comes from a CDN and requests
microphone access. The component defers loading until the browser is idle so it
can't delay first paint, and a visitor who leaves quickly never downloads it —
but it is still someone else's code running on your site. That's why it's opt-in
rather than on by default.

**Voice minutes cost money.** ElevenLabs bills conversational agents per minute.
Check your plan's included minutes before putting this in front of real traffic
on a public site, or a busy week could get expensive. Worth setting a usage cap
in your ElevenLabs account first.

### A cheaper alternative worth considering

If you mainly want the recommendation feature rather than voice specifically, a
text-only chat widget costs a fraction of voice minutes and works better in a
noisy cafe or on a phone in public. The same system prompt and knowledge base
work unchanged. Worth trying text first and adding voice once you know people
use it.
