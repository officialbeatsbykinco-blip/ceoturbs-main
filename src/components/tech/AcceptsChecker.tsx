// "Can you take my…?" Tap an item, see the answer right away, then text or call about it with the item already filled in.
import { useState } from "react";
import { Camera, Check, MessageSquare, X } from "lucide-react";
import { CallLink } from "@/components/site/CallLink";
import { SITE } from "@/config/site";
import type { InstallPage } from "@/content/install-pages";
import { smsHref } from "@/lib/sms";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const ANSWER = {
  yes: { icon: Check, tone: "bg-emerald-500/10 ring-emerald-500/30", title: "Yes, free pickup.", line: "Text us what you have and your city. We'll text back a pickup time." },
  photo: { icon: Camera, tone: "bg-turbo/[0.08] ring-turbo/25", title: "Yes, text a photo first.", line: "Send a quick photo and your city so we bring the right truck and confirm before we come." },
  no: { icon: X, tone: "bg-muted ring-border", title: "Sorry, not that one.", line: "We don't take large appliances. Have computers, phones or TVs too? Text us and we'll grab those." },
} as const;

export function AcceptsChecker({ page, className }: { page: InstallPage; className?: string }) {
  const [pick, setPick] = useState<number | null>(null);
  const items = page.accepts ?? [];
  const chosen = pick === null ? null : items[pick];
  const answer = chosen ? ANSWER[chosen.ok] : null;
  const sms = chosen ? `Hi Chris, I have old tech to recycle: ${chosen.item}. My city/ZIP: ` : page.textFirst?.sms ?? "";

  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-2.5">
        {items.map((it, i) => (
          <li key={it.item}>
            <button
              type="button"
              aria-pressed={pick === i}
              onClick={() => {
                setPick(i);
                track("recycle_check", { item: it.item, answer: it.ok, source: page.slug });
              }}
              className={cn("rounded-full border px-4 py-2.5 text-[15px] font-semibold transition-colors", pick === i ? "border-2 border-turbo bg-turbo/10 text-foreground" : "border-border bg-card hover:border-turbo/60")}
            >
              {it.item}
            </button>
          </li>
        ))}
      </ul>
      <div aria-live="polite">
        {chosen && answer && (
          <div className={cn("mt-5 rounded-2xl p-5 ring-1", answer.tone)}>
            <p className="flex items-center gap-2 font-display text-xl font-bold">
              <answer.icon className="h-5 w-5 shrink-0 text-turbo" aria-hidden /> {chosen.item}: {answer.title}
            </p>
            <p className="mt-1.5 text-[15px] text-muted-foreground">{answer.line}</p>
            <div className="mt-4 grid gap-3 sm:flex">
              <a href={smsHref(sms)} data-call-location={`${page.slug} checker text`} className="btn-ignite inline-flex items-center justify-center gap-2 !py-3.5 !text-base">
                <MessageSquare className="h-5 w-5" aria-hidden /> Text {SITE.phone.display}
              </a>
              <CallLink location={`${page.slug} checker call`} icon className="btn-blue justify-center !py-3.5 !text-base">
                Call now
              </CallLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
