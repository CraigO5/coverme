import { useState, useEffect } from "react";
import SectionCard from "./SectionCard";
import { Minus, Plus, Trash2, Clock } from "lucide-react";

type Props = {
  buttonStyle: string;
  sectionCard: string;
  lettersGenerated: number;
};
export default function Stats({ buttonStyle, lettersGenerated }: Props) {
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastLoginTime, setLastLoginTime] = useState(0);
  const [dailyJobs, setDailyJobs] = useState(0);
  const [weeklyJobs, setWeeklyJobs] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [dailyGoalInput, setDailyGoalInput] = useState(10);

  function formatTimeAgo(timestamp: number) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    return "just now";
  }

  useEffect(() => {
    const currentLogin = Date.now();
    const previousLogin = parseInt(
      localStorage.getItem("last-login") || "0",
      10
    );
    const previousStreak = parseInt(
      localStorage.getItem("daily-streak") || "0",
      10
    );

    const ONE_DAY = 1000 * 60 * 60 * 24;
    const daysPassed = Math.floor((currentLogin - previousLogin) / ONE_DAY);

    if (daysPassed === 1) {
      setDailyStreak(previousStreak + 1);
      localStorage.setItem("daily-streak", (previousStreak + 1).toString());
    } else if (daysPassed > 1 || isNaN(previousLogin)) {
      setDailyStreak(1);
      localStorage.setItem("daily-streak", "1");
    } else {
      setDailyStreak(previousStreak);
    }

    setLastLoginTime(previousLogin);
    localStorage.setItem("last-login", currentLogin.toString());

    const storedDailyJobs = parseInt(
      localStorage.getItem("daily-jobs") || "0",
      10
    );
    const storedDailyGoal = parseInt(
      localStorage.getItem("daily-goal") || "0",
      10
    );
    const storedWeeklyJobs = parseInt(
      localStorage.getItem("weekly-jobs") || "0",
      10
    );

    setDailyJobs(storedDailyJobs);
    setDailyGoal(storedDailyGoal);
    setWeeklyJobs(storedWeeklyJobs);
  }, []);

  useEffect(() => {
    localStorage.setItem("daily-jobs", dailyJobs.toString());
    localStorage.setItem("daily-goal", dailyGoal.toString());
    localStorage.setItem("weekly-jobs", weeklyJobs.toString());
  }, [dailyJobs, dailyGoal, weeklyJobs]);

  // ---- derived display values (no logic change) ----
  const goalNum = Number.isFinite(dailyGoal) && dailyGoal > 0 ? dailyGoal : 0;
  const cellCount = Math.min(goalNum, 30);
  const goalMet = goalNum > 0 && dailyJobs >= goalNum;

  const minutesSaved = lettersGenerated * 15;
  const savedValue =
    minutesSaved >= 60
      ? (Math.round((minutesSaved / 60) * 10) / 10).toString()
      : minutesSaved.toString();
  const savedUnit = minutesSaved >= 60 ? "hrs" : "min";

  return (
    <section className="w-full">
      <SectionCard title="Statistics" defaultOpen={false} plain>
        {/* set daily goal */}
        <div className="cm-goal__set">
          <span className="cm-label" style={{ margin: 0 }}>
            Daily goal
          </span>
          <input
            type="text"
            value={Number.isNaN(dailyGoalInput) ? "" : dailyGoalInput}
            onChange={(e) => setDailyGoalInput(parseInt(e.target.value))}
            aria-label="Daily goal"
            maxLength={3}
            className="cm-input cm-input--sm"
          />
          <button
            className={buttonStyle}
            onClick={() => setDailyGoal(dailyGoalInput)}
          >
            Set
          </button>
        </div>

        {/* progress */}
        <div className="cm-goal__row">
          <span className="cm-goal__label">
            Applied today
            <span className={`cm-goal__count${goalMet ? " is-done" : ""}`}>
              {dailyJobs} of <b>{goalNum}</b>
            </span>
          </span>
          <div className="cm-stepper">
            <button
              onClick={() => {
                setWeeklyJobs((e) => e - dailyJobs);
                setDailyJobs(0);
              }}
              aria-label="Clear applied count"
              title="Clear"
            >
              <Trash2 className="cm-icon cm-icon--sm" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => {
                setDailyJobs((count) => Math.max(count - 1, 0));
                setWeeklyJobs((count) => Math.max(count - 1, 0));
              }}
              aria-label="Decrease applied count"
            >
              <Minus className="cm-icon cm-icon--sm" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => {
                setDailyJobs((count) => count + 1);
                setWeeklyJobs((count) => Math.max(count + 1, 0));
              }}
              aria-label="Increase applied count"
            >
              <Plus className="cm-icon cm-icon--sm" strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <div className="cm-cells">
          {Array.from({ length: cellCount }).map((_, i) => (
            <div
              key={i}
              className={`cm-cell${i < dailyJobs ? " is-on" : ""}`}
            />
          ))}
        </div>

        {/* figure stats */}
        <div className="cm-figures">
          <div className="cm-figure">
            <div className="cm-figure__top">
              <span className="cm-figure__num is-accent">
                {lettersGenerated}
              </span>
            </div>
            <div className="cm-figure__label">Letters generated</div>
          </div>
          <div className="cm-figure">
            <div className="cm-figure__top">
              <span className="cm-figure__num">{savedValue}</span>
              <span className="cm-figure__unit">{savedUnit}</span>
            </div>
            <div className="cm-figure__label">Time saved</div>
          </div>
          <div className="cm-figure">
            <div className="cm-figure__top">
              <span className="cm-figure__num">{dailyStreak}</span>
              <span className="cm-figure__unit">
                {dailyStreak === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="cm-figure__label">Active streak</div>
          </div>
        </div>

        <div className="cm-meta">
          <Clock className="cm-icon cm-icon--sm" strokeWidth={1.75} />
          Last active <b>{lastLoginTime ? formatTimeAgo(lastLoginTime) : "unknown"}</b>
        </div>
      </SectionCard>
    </section>
  );
}
