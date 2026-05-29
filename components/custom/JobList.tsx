import { useState } from "react";
import { jsPDF } from "jspdf";
import SectionCard from "./SectionCard";
import { Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useResumeStore } from "@/components/custom/useResumeStore";

type Job = {
  title: string;
  description: string;
  company: string;
};

type Props = {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  summarizedText: string;
  setSummarizedText: (value: string | null) => void;
  addNew: boolean;
  setAddNew: (value: boolean) => void;
  setLettersGenerated: React.Dispatch<React.SetStateAction<number>>;
  buttonStyle: string;
  sectionCard: string;
};

export default function JobList({
  jobs,
  setJobs,
  setLettersGenerated,
  summarizedText,
  setSummarizedText,
  addNew,
  setAddNew,
  buttonStyle,
  sectionCard,
}: Props) {
  const [coverLetterLoading, setCoverLetterLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [coverLettersLoading, setCoverLettersLoading] =
    useState<boolean>(false);
  const [coverLetters, setCoverLetters] = useState<{ [key: number]: string }>(
    {}
  );
  const [copyTexts, setCopyTexts] = useState<{ [key: number]: boolean }>({});
  const { fullName } = useResumeStore();

  const handleGenerateCoverLetter = async (job: Job, index: number) => {
    if (!summarizedText) return alert("Please summarize your resume first.");

    setCoverLetterLoading((prev) => ({ ...prev, [index]: true }));
    setLettersGenerated((num) => num + 1);
    const res = await fetch("/api/generateCoverLetter", {
      method: "POST",
      body: JSON.stringify({
        company: job.company,
        title: job.title,
        description: job.description,
        summary: summarizedText,
      }),
    });

    const data = await res.json();

    setCoverLetterLoading((prev) => ({ ...prev, [index]: false }));

    if (!res.ok) {
      setSummarizedText(null);
      return;
    }

    setCoverLetters((prev) => ({ ...prev, [index]: data.text || "" }));
  };

  const handleGenerateCoverLetters = async () => {
    if (jobs.length === 0) return alert("Please add a job first.");
    setCoverLettersLoading(true);

    const jobsToGenerate = jobs
      .map((job, index) => ({ job, index }))
      .filter(({ index }) => !coverLetters[index]); // Reliable indexing

    await Promise.all(
      jobsToGenerate.map(({ job, index }) =>
        handleGenerateCoverLetter(job, index)
      )
    );

    fireConfetti();

    setCoverLettersLoading(false);
    setAddNew(false);
  };

  const handleDownloadPDF = async (i: number, job: Job) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "letter",
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();

    // === Name Header ===
    const name = fullName;
    const nameFontSize = 24;

    doc.setFont("Times", "Normal");
    doc.setFontSize(nameFontSize);
    doc.text(name, margin, 60);

    // === Horizontal Line Underneath ===
    const lineY = 70;
    doc.setLineWidth(1);
    doc.line(margin, lineY, pageWidth - margin, lineY);

    // === Body Text ===
    const fontSize = 11;
    doc.setFont("Times", "Normal");
    doc.setFontSize(fontSize);

    const paragraphY = lineY + 30; // space below the line
    const textWidth = pageWidth - margin * 2;

    const lines = doc.splitTextToSize(coverLetters[i], textWidth);
    doc.text(lines, margin, paragraphY, {
      maxWidth: textWidth,
      lineHeightFactor: 1.6,
    });

    doc.save(`${job.title || "Untitled"}_${job.company || "Company"}.pdf`);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearJobs = () => {
    setJobs([]);
    setCoverLetters([]);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <>
      {jobs.length != 0 && (
        <section id="jobs" className={sectionCard}>
          <SectionCard title="Generated Letters" index="03">
            <p className="cm-step">
              Generate a tailored cover letter for every job you&rsquo;ve added,
              then copy it or download a formatted PDF.
            </p>

            <div className="cm-actions" style={{ marginBottom: 22 }}>
              <button
                className={`${buttonStyle} cm-btn--primary`}
                onClick={handleGenerateCoverLetters}
                disabled={coverLettersLoading || !addNew || !summarizedText}
              >
                <Sparkles className="cm-icon cm-icon--sm" strokeWidth={1.75} />
                {coverLettersLoading
                  ? "Generating…"
                  : "Generate cover letters"}
              </button>
              <button className={buttonStyle} onClick={clearJobs}>
                Clear all
              </button>
            </div>

            <div className="cm-jobs scrollbar-always">
              {jobs.map((job, i) => (
                <div key={i} className="cm-jobcard">
                  <h3 className="cm-jobcard__title">
                    {job.title || "Untitled Role"} @{" "}
                    {job.company || "Unknown Company"}
                  </h3>
                  <pre className="cm-pre">{job.description}</pre>

                  {coverLetterLoading[i] ? (
                    <p className="cm-jobcard__status">
                      Generating cover letter…
                    </p>
                  ) : (
                    <p
                      className={`cm-jobcard__status${
                        coverLetters[i] ? " is-done" : ""
                      }`}
                    >
                      {coverLetters[i]
                        ? "Cover letter generated."
                        : "Click “Generate cover letters” to create."}
                    </p>
                  )}

                  {coverLetters[i] && (
                    <>
                      <textarea
                        defaultValue={coverLetters[i]}
                        className="cm-textarea"
                        style={{ marginTop: 14, minHeight: 280 }}
                      ></textarea>
                      <div className="cm-actions">
                        <button
                          onClick={() => {
                            copyText(coverLetters[i]);
                            setCopyTexts((prev) => ({ ...prev, [i]: true }));
                          }}
                          className={buttonStyle}
                        >
                          {copyTexts[i] ? "Copied!" : "Copy to clipboard"}
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(i, job)}
                          className={buttonStyle}
                        >
                          {copyTexts[i] ? "Downloaded!" : "Download PDF"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </section>
      )}
    </>
  );
}
