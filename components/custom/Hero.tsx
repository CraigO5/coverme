"use client";

type Props = {
  lettersGenerated: number;
  buttonStyle: string;
};

export default function Hero({ lettersGenerated }: Props) {
  return (
    <header className="cm-hero">
      <div className="cm-eyebrow">AI Cover Letter Generator · by Craig Ondevilla</div>
      <h1 className="cm-display">
        The right letter,
        <br />
        written in seconds.
      </h1>
      <p className="cm-lede">
        Upload a resume, point it at a job, and let CoverMe draft the first
        version.
        {lettersGenerated > 0 && (
          <>
            {" "}
            <b>{lettersGenerated}</b> letters generated so far.
          </>
        )}
      </p>
    </header>
  );
}
