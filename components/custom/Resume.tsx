import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, FileText } from "lucide-react";
import SectionCard from "./SectionCard";
import confetti from "canvas-confetti";
import {
  useResumeStore,
  inputStyle,
  textAreaStyle,
  staticTextAreaStyle,
} from "@/components/custom/useResumeStore";

type Props = {
  summarizedText: string;
  setSummarizedText: (value: string | null) => void;
  buttonStyle: string;
  sectionCard: string;
};

export default function Resume({
  summarizedText,
  setSummarizedText,
  buttonStyle,
  sectionCard,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fullName, setFullName } = useResumeStore();
  const [fullNameInput, setFullNameInput] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (selectedFile && selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setParsedText(null);
    setError(null);
    setFileName(selectedFile?.name || "");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    setResumeLoading(true);

    const formData = new FormData();
    formData.append("pdf", file);

    const res = await fetch("/api/extractText", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResumeLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to parse PDF");
      setParsedText(null);
      return;
    }

    const parsed = data.text || "";
    if (parsed.length > 8000) {
      setError("Parsed text exceeds 8000 characters limit");
      setParsedText(null);
      return;
    }

    setParsedText(parsed.trim() || "");
  };

  const handleSummarizeText = async () => {
    if (!parsedText) return alert("Please choose a resume first.");
    setSummarizeLoading(true);

    const res = await fetch("/api/summarizeText", {
      method: "POST",
      body: JSON.stringify({ text: parsedText }),
    });

    const data = await res.json();

    setSummarizeLoading(false);

    if (!res.ok) {
      setError("Failed to summarize resume text");
      setSummarizedText(null);
      return;
    }

    fireConfetti();
    setSummarizedText(data.text || "");
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    const saveParsedText = localStorage.getItem("parsed-text");
    if (saveParsedText) setParsedText(saveParsedText);

    const saveFileName = localStorage.getItem("file-name");
    if (saveFileName) setFileName(saveFileName);

    const saveSummary = localStorage.getItem("summary");
    if (saveSummary) setSummarizedText(saveSummary);

    const saveFullName = localStorage.getItem("name");
    if (saveFullName) setFullName(saveFullName);
  }, []);

  useEffect(() => {
    localStorage.setItem("file-name", fileName || "");
    localStorage.setItem("parsed-text", parsedText || "");
    localStorage.setItem("summary", summarizedText || "");
    localStorage.setItem("name", fullName || "");
  }, [fileName, parsedText, summarizedText, fullName]);

  return (
    <section id="upload" className={sectionCard}>
      <SectionCard title="Resume" index="01">
        <div className="cm-sub">
          <span className="cm-sub__name">Upload</span>
        </div>
        <p className="cm-step">
          Add your resume as a PDF — we&rsquo;ll extract the text so you can
          review it before summarizing.
        </p>

        <div className="cm-upload">
          <label className={buttonStyle}>
            Choose file
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button
            disabled={resumeLoading || !file}
            onClick={handleUpload}
            className={`${buttonStyle} cm-btn--primary`}
          >
            {resumeLoading ? (
              "Uploading…"
            ) : (
              <>
                Upload
                <ArrowRight className="cm-icon cm-icon--sm" strokeWidth={1.75} />
              </>
            )}
          </button>
        </div>

        {(file || parsedText) && (
          <div className="cm-file__meta" style={{ marginTop: 14 }}>
            <FileText className="cm-icon cm-icon--sm" strokeWidth={1.75} />
            {fileName || "Selected file"}
          </div>
        )}

        {error && <p className="cm-err">{error}</p>}

        {parsedText && (
          <div className="cm-parsed">
            <div className="cm-label">
              Parsed text · {parsedText.length} chars
            </div>
            <pre className={staticTextAreaStyle}>{parsedText}</pre>
          </div>
        )}

        {parsedText && (
          <div className="cm-parsed">
            <div className="cm-sub">
              <span className="cm-sub__name">Summarize</span>
            </div>
            <p className="cm-step">
              Condense your resume into a short profile the generator reuses for
              every cover letter.
            </p>
            <button
              disabled={summarizeLoading}
              onClick={handleSummarizeText}
              className={`${buttonStyle} cm-btn--primary`}
            >
              {summarizeLoading ? (
                "Summarizing…"
              ) : (
                <>
                  <Sparkles className="cm-icon cm-icon--sm" strokeWidth={1.75} />
                  Summarize resume
                </>
              )}
            </button>
          </div>
        )}

        {summarizedText && (
          <div className="cm-parsed">
            <h3 className="cm-h3">Resume summary</h3>
            <p className="cm-note" style={{ marginBottom: 8 }}>
              Edit if needed.
            </p>
            <textarea
              value={summarizedText}
              onChange={(e) => setSummarizedText(e.target.value)}
              maxLength={1000}
              rows={6}
              spellCheck="false"
              className={textAreaStyle}
            />
            <p className="cm-note" style={{ marginTop: 6 }}>
              {summarizedText.length} / 1000 characters
            </p>

            <div style={{ marginTop: 20 }}>
              <div className="cm-label">Optional — name for PDF header</div>
              <div className="cm-goal__set" style={{ marginBottom: 8 }}>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  placeholder="Name"
                  maxLength={100}
                  className={inputStyle}
                />
                <button
                  className={buttonStyle}
                  onClick={() => {
                    setFullName(fullNameInput);
                    setFullNameInput("");
                  }}
                >
                  Submit
                </button>
              </div>
              {fullName && <p className="cm-note">Name: {fullName}</p>}
            </div>
          </div>
        )}
      </SectionCard>
    </section>
  );
}
