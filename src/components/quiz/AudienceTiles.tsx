// The quiz's first question as big tiles. Sits in the phone hero as well as inside the quiz.
import { AUDIENCES, type Audience } from "@/content/quiz";
import { ICON } from "./icons";

const SHORT: Record<Audience, string> = { local: "Local service", artist: "Artist or creator", store: "Online store", other: "Other business" };

export function AudienceTiles({ selected, onPick }: { selected?: Audience; onPick: (a: Audience) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {AUDIENCES.map((o) => {
        const Icon = ICON[o.icon];
        return (
          <button key={o.id} type="button" aria-pressed={selected === o.id} onClick={() => onPick(o.id)} className="quiz-opt quiz-tap !flex-col !justify-center !gap-1.5 !px-2 !py-3 text-center">
            <span className="quiz-ico grid h-9 w-9 shrink-0 place-items-center rounded-xl">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm font-semibold leading-snug">{SHORT[o.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
