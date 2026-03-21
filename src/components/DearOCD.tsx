import { useState, useCallback } from "react";

interface Session {
  date: string;
  letterContent: string;
  timestamp: number;
}

const PROMPT_TEXT = `Dear OCD,

You've taken up too much of my time. You've made me question everything — my thoughts, my character, my worth. But today I'm writing back.

I want you to know that…`;

const DearOCD = () => {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4>(1);
  const [letterContent, setLetterContent] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [animKey, setAnimKey] = useState(0);

  const goTo = useCallback((s: 1 | 2 | 3 | 4) => {
    setAnimKey((k) => k + 1);
    setScreen(s);
  }, []);

  const handleDoneWriting = () => {
    if (!letterContent.trim()) return;
    const newSession: Session = {
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      letterContent: letterContent.trim(),
      timestamp: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    goTo(3);
  };

  const handleWriteAnother = () => {
    setLetterContent("");
    goTo(2);
  };

  const isToday = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  return (
    <div className="min-h-screen max-w-md mx-auto" style={{ backgroundColor: "#f2f0e8" }}>
      <div key={animKey} className="screen-transition">
        {screen === 1 && <Screen1 onStart={() => goTo(2)} onPastEntries={() => goTo(4)} />}
        {screen === 2 && (
          <Screen2
            letterContent={letterContent}
            setLetterContent={setLetterContent}
            onDone={handleDoneWriting}
          />
        )}
        {screen === 3 && (
          <Screen3
            letterContent={letterContent}
            onWriteAnother={handleWriteAnother}
            onPastEntries={() => goTo(4)}
          />
        )}
        {screen === 4 && (
          <Screen4
            sessions={sessions}
            onBack={() => goTo(1)}
            isToday={isToday}
          />
        )}
      </div>
    </div>
  );
};

/* ─── Screen 1: Intro ─── */
const Screen1 = ({
  onStart,
  onPastEntries,
}: {
  onStart: () => void;
  onPastEntries: () => void;
}) => (
  <div className="px-5 py-6 flex flex-col min-h-screen">
    <div className="flex justify-between items-center mb-6">
      <button className="font-sans text-sm" style={{ color: "#7a8a60" }}>
        ←
      </button>
      <button
        onClick={onPastEntries}
        className="font-sans underline"
        style={{ fontSize: 12, color: "#8a9a68" }}
      >
        past entries
      </button>
    </div>

    {/* Journal cover */}
    <div
      className="relative p-5 mb-5"
      style={{
        backgroundColor: "#4a5e38",
        borderLeft: "6px solid #7a9850",
        borderRadius: 4,
      }}
    >
      {/* Spine line */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: 12,
          width: 1,
          backgroundColor: "#f0ecd8",
          opacity: 0.15,
        }}
      />
      <div style={{ fontSize: 38 }}>📓</div>
      <h1
        className="font-serif mt-2"
        style={{ fontSize: 26, fontWeight: 700, color: "#f0ecd8" }}
      >
        Dear OCD,
      </h1>
      <p
        className="font-serif italic mt-1"
        style={{ fontSize: 12, color: "#b8c898", lineHeight: 1.7 }}
      >
        You've been living in my head for too long. Today I'm writing back.
      </p>
    </div>

    <p
      className="font-sans mb-5"
      style={{ fontSize: 12, color: "#8a8068", lineHeight: 1.7 }}
    >
      This is your space. Write whatever you need to say — no rules, no
      structure. Just you and the page.
    </p>

    {/* Feature rows */}
    <div className="flex flex-col gap-3 mb-6">
      <div
        className="flex items-center gap-3 p-3"
        style={{
          backgroundColor: "#dfe8d0",
          border: "1px solid #c8d0b0",
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>✍️</span>
        <span className="font-sans" style={{ fontSize: 11, color: "#4a5838" }}>
          One free letter — write anything
        </span>
      </div>
      <div
        className="flex items-center gap-3 p-3"
        style={{
          backgroundColor: "#ede8d8",
          border: "1px solid #d8d0b8",
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>📖</span>
        <span className="font-sans" style={{ fontSize: 11, color: "#5a5030" }}>
          Saved to your journal automatically
        </span>
      </div>
    </div>

    <div className="mt-auto">
      <button
        onClick={onStart}
        className="w-full py-3 font-sans"
        style={{
          backgroundColor: "#4a5e38",
          color: "#f0ecd8",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Open My Journal
      </button>
    </div>
  </div>
);

/* ─── Screen 2: Write ─── */
const Screen2 = ({
  letterContent,
  setLetterContent,
  onDone,
}: {
  letterContent: string;
  setLetterContent: (v: string) => void;
  onDone: () => void;
}) => (
  <div className="relative min-h-screen lined-paper flex flex-col">
    {/* Margin line */}
    <div
      className="absolute top-0 bottom-0"
      style={{
        left: 20,
        width: 1.5,
        backgroundColor: "#c8a090",
        opacity: 0.45,
      }}
    />

    <div className="flex flex-col flex-1 px-5 py-6" style={{ paddingLeft: 28 }}>
      <span
        className="font-sans uppercase mb-4"
        style={{ fontSize: 10, letterSpacing: 2, color: "#a8a080" }}
      >
        Your Letter
      </span>

      {/* Prompt text */}
      <div
        className="font-serif italic whitespace-pre-line"
        style={{
          fontSize: 16,
          color: "#c0b890",
          lineHeight: 1.95,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {PROMPT_TEXT}
      </div>

      {/* Textarea */}
      <textarea
        value={letterContent}
        onChange={(e) => setLetterContent(e.target.value)}
        placeholder="continue writing here…"
        className="font-serif italic flex-1 w-full resize-none outline-none"
        style={{
          fontSize: 16,
          color: "#2e2a18",
          backgroundColor: "transparent",
          border: "none",
          lineHeight: 1.95,
          minHeight: 150,
        }}
      />

      <div style={{ borderTop: "1px dashed #c8c0a0" }} className="pt-4 mt-4">
        <button
          onClick={onDone}
          className="w-full py-3 font-sans"
          style={{
            backgroundColor: "#4a5e38",
            color: "#f0ecd8",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Done Writing →
        </button>
      </div>
    </div>
  </div>
);

/* ─── Screen 3: Read + Save ─── */
const Screen3 = ({
  letterContent,
  onWriteAnother,
  onPastEntries,
}: {
  letterContent: string;
  onWriteAnother: () => void;
  onPastEntries: () => void;
}) => (
  <div className="px-5 py-6 flex flex-col min-h-screen" style={{ backgroundColor: "#f2f0e8" }}>
    <span
      className="font-sans uppercase mb-2"
      style={{ fontSize: 10, letterSpacing: 2, color: "#a8a080" }}
    >
      Your Letter
    </span>
    <h2
      className="font-serif mb-4"
      style={{ fontSize: 22, fontWeight: 700, color: "#2e2a18" }}
    >
      Your letter 💌
    </h2>

    {/* Letter card */}
    <div
      className="relative lined-paper p-4 mb-4"
      style={{
        backgroundColor: "#faf8ec",
        border: "1px solid #d0c8a8",
        borderLeft: "5px solid #7a9850",
        borderRadius: 4,
      }}
    >
      {/* Faint red margin line */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: 16,
          width: 1,
          backgroundColor: "#c8a090",
          opacity: 0.25,
        }}
      />

      <div style={{ paddingLeft: 12 }}>
        <p
          className="font-serif mb-2"
          style={{ fontSize: 15, fontWeight: 700, color: "#4a5e38" }}
        >
          Dear OCD,
        </p>
        <p
          className="font-serif italic"
          style={{ fontSize: 14, color: "#8a8068", lineHeight: 2.0 }}
        >
          {PROMPT_TEXT.replace("Dear OCD,\n\n", "")}
        </p>
        <p
          className="font-serif italic"
          style={{ fontSize: 14, color: "#5a7840", lineHeight: 2.0 }}
        >
          {letterContent}
        </p>

        <div style={{ borderTop: "1px dashed #d0c8a8" }} className="my-3" />

        <p className="font-serif" style={{ fontSize: 14, color: "#4a5838" }}>
          You don't get to run my life.
        </p>
        <p
          className="font-serif italic mt-1"
          style={{ fontSize: 13, color: "#a8a080" }}
        >
          — Me
        </p>
      </div>
    </div>

    {/* Positive statement */}
    <div
      className="p-3 mb-5"
      style={{
        backgroundColor: "#dfe8d0",
        borderLeft: "3px solid #6a8848",
        borderRadius: "0 8px 8px 0",
      }}
    >
      <p
        className="font-serif italic"
        style={{ fontSize: 12, color: "#3a4828", lineHeight: 1.8 }}
      >
        Writing this took courage. Every word you wrote back to OCD is a step
        toward reclaiming your life. 🌿
      </p>
    </div>

    <div className="mt-auto flex flex-col gap-3">
      <button
        onClick={onPastEntries}
        className="w-full py-3 font-sans"
        style={{
          backgroundColor: "#ede8d8",
          color: "#4a5e38",
          border: "1px solid #c8c0a0",
          borderRadius: 10,
          fontSize: 13,
        }}
      >
        📖 View past letters
      </button>
      <button
        onClick={onWriteAnother}
        className="w-full py-3 font-sans"
        style={{
          backgroundColor: "#4a5e38",
          color: "#f0ecd8",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Write Another Letter
      </button>
    </div>
  </div>
);

/* ─── Screen 4: Past Entries ─── */
const Screen4 = ({
  sessions,
  onBack,
  isToday,
}: {
  sessions: Session[];
  onBack: () => void;
  isToday: (ts: number) => boolean;
}) => (
  <div className="px-5 py-6 flex flex-col min-h-screen" style={{ backgroundColor: "#f2f0e8" }}>
    <button
      onClick={onBack}
      className="font-sans text-sm mb-4 self-start"
      style={{ color: "#7a8a60" }}
    >
      ← back
    </button>

    <h2
      className="font-serif mb-1"
      style={{ fontSize: 22, fontWeight: 700, color: "#2e2a18" }}
    >
      Past Letters 📖
    </h2>
    <p className="font-sans mb-5" style={{ fontSize: 11, color: "#8a8068" }}>
      Every time you wrote back to OCD.
    </p>

    {sessions.length === 0 && (
      <p
        className="font-serif italic text-center mt-10"
        style={{ color: "#a8a080", fontSize: 14 }}
      >
        No letters yet. Write your first one!
      </p>
    )}

    <div className="flex flex-col gap-3 flex-1">
      {sessions.map((s, i) => {
        const today = isToday(s.timestamp);
        return (
          <div
            key={s.timestamp}
            className="p-3"
            style={{
              backgroundColor: "#faf8ec",
              border: "1px solid #d0c8a8",
              borderLeft: `4px solid ${i === 0 ? "#7a9850" : "#c8c0a0"}`,
              borderRadius: 8,
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className="font-sans"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: today ? "#6a8848" : "#8a9870",
                }}
              >
                {today ? "Today" : "Past entry"}
              </span>
              <span
                className="font-sans"
                style={{ fontSize: 11, color: "#b0a880" }}
              >
                {s.date}
              </span>
            </div>
            <p
              className="font-serif italic truncate"
              style={{ fontSize: 13, color: "#2e2a18", lineHeight: 1.7 }}
            >
              {s.letterContent}…
            </p>
          </div>
        );
      })}
    </div>

    {sessions.length > 0 && (
      <p
        className="font-serif italic text-center mt-6"
        style={{ fontSize: 14, color: "#7a9870" }}
      >
        💌 {sessions.length} letter{sessions.length !== 1 ? "s" : ""} written
      </p>
    )}
  </div>
);

export default DearOCD;
