import type { Grade } from "@nand2web/srs";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLang } from "../i18n/lang";
import type { QuizCard } from "./deck";
import { useQuiz } from "./useQuiz";

const GRADE_BUTTONS: {
  grade: Grade;
  labelEn: string;
  labelJa: string;
  className: string;
}[] = [
  {
    grade: 1,
    labelEn: "Again",
    labelJa: "もう一度",
    className:
      "border-red-700/60 bg-red-950/40 text-red-300 hover:border-red-600",
  },
  {
    grade: 3,
    labelEn: "Hard",
    labelJa: "難しい",
    className:
      "border-amber-700/60 bg-amber-950/40 text-amber-300 hover:border-amber-600",
  },
  {
    grade: 4,
    labelEn: "Good",
    labelJa: "良い",
    className:
      "border-sky-700/60 bg-sky-950/40 text-sky-300 hover:border-sky-600",
  },
  {
    grade: 5,
    labelEn: "Easy",
    labelJa: "簡単",
    className:
      "border-emerald-700/60 bg-emerald-950/40 text-emerald-300 hover:border-emerald-600",
  },
];

function formatNextDue(nextDue: number): string {
  const diffMs = nextDue - Date.now();
  const diffMins = Math.round(diffMs / 60_000);
  if (diffMins < 1) return "< 1 min";
  if (diffMins < 60) return `${diffMins} min`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.round(diffHours / 24)}d`;
}

/** Mounted fresh per card (via key=card.id) so revealed state auto-resets. */
function CardPanel({
  card,
  onGrade,
}: {
  card: QuizCard;
  onGrade: (g: Grade) => void;
}) {
  const lang = useLang();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
      {/* Module badge + deep-link */}
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-zinc-700 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
          {card.module}
        </span>
        <Link
          to={card.route as "/"}
          className="text-xs text-sky-400 underline-offset-2 hover:underline"
        >
          {lang === "ja"
            ? `${card.module} シミュレーターで確認 →`
            : `Explore in the ${card.module} simulator →`}
        </Link>
      </div>

      {/* Question */}
      <div>
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
          {lang === "ja" ? "問題" : "Question"}
        </p>
        <p className="text-lg leading-relaxed">{card.question[lang]}</p>
      </div>

      {/* Answer reveal */}
      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/60 py-3 text-sm text-zinc-300 transition-colors hover:border-sky-700/60 hover:text-zinc-100"
        >
          {lang === "ja" ? "答えを見る" : "Show answer"}
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
              {lang === "ja" ? "答え" : "Answer"}
            </p>
            <p className="text-zinc-300 leading-relaxed">{card.answer[lang]}</p>
          </div>
          {/* Grade buttons */}
          <div className="grid grid-cols-4 gap-2">
            {GRADE_BUTTONS.map((btn) => (
              <button
                key={btn.grade}
                type="button"
                onClick={() => onGrade(btn.grade)}
                className={`rounded-lg border py-2 text-sm font-medium transition-colors ${btn.className}`}
              >
                {lang === "ja" ? btn.labelJa : btn.labelEn}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function QuizView() {
  const lang = useLang();
  const { session, grade } = useQuiz();

  const { queue, current, reviewed, nextDue, loading } = session;
  const card = queue[current];
  const totalDue = queue.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-500">
        {lang === "ja" ? "読み込み中…" : "Loading…"}
      </div>
    );
  }

  // All caught up
  if (!card) {
    return (
      <div className="mx-auto max-w-xl space-y-6 py-16 text-center">
        <div className="text-5xl" aria-hidden="true">
          🎉
        </div>
        <h2 className="font-semibold text-2xl">
          {lang === "ja" ? "全部完了しました！" : "You're all caught up!"}
        </h2>
        {reviewed > 0 && (
          <p className="text-zinc-400">
            {lang === "ja"
              ? `このセッションで ${reviewed} 枚レビューしました。`
              : `You reviewed ${reviewed} card${reviewed === 1 ? "" : "s"} this session.`}
          </p>
        )}
        {nextDue !== null && (
          <p className="text-sm text-zinc-500">
            {lang === "ja"
              ? `次のカードは ${formatNextDue(nextDue)} 後に期限が来ます`
              : `Next card due in ${formatNextDue(nextDue)}`}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress readout */}
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          {lang === "ja"
            ? `${totalDue} 枚期限 · ${reviewed} 枚レビュー済み`
            : `${totalDue} due · ${reviewed} reviewed this session`}
        </span>
        <span className="font-mono text-xs text-zinc-600">
          {current + 1} / {totalDue}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-800">
        <div
          className="h-1.5 rounded-full bg-sky-500 transition-all"
          style={{ width: `${(current / totalDue) * 100}%` }}
        />
      </div>

      {/* key=card.id forces remount on every new card, resetting revealed state */}
      <CardPanel key={card.id} card={card} onGrade={grade} />
    </div>
  );
}
