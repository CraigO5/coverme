import { useState } from "react";
import SectionCard from "./SectionCard";
import { inputStyle, textAreaStyle } from "@/components/custom/useResumeStore";

type Job = {
  title: string;
  description: string;
  company: string;
};

type Props = {
  setAddNew: (value: boolean) => void;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  summarizedText: string;
  buttonStyle: string;
  sectionCard: string;
};

export default function JobInput({
  setAddNew,
  setJobs,
  summarizedText,
  buttonStyle,
  sectionCard,
}: Props) {
  const [jobTitleInput, setJobTitleInput] = useState<string>("");
  const [jobDescriptionInput, setJobDescriptionInput] = useState<string>("");
  const [companyNameInput, setCompanyNameInput] = useState<string>("");

  const handleSubmitJob = () => {
    const trimmedTitle = jobTitleInput.trim();
    const trimmedDescription = jobDescriptionInput.trim();
    const trimmedCompany = companyNameInput.trim();
    if (trimmedDescription !== "") {
      setJobs((prev) => [
        ...prev,
        {
          title: trimmedTitle,
          description: trimmedDescription,
          company: trimmedCompany,
        },
      ]);
      setJobTitleInput("");
      setJobDescriptionInput("");
      setCompanyNameInput("");
    }

    setAddNew(true);
  };

  return (
    <>
      {summarizedText && (
        <section id="add-job" className={sectionCard}>
          <SectionCard title="Job Description" index="02">
            <p className="cm-step">
              Paste a job posting you&rsquo;re applying to — from LinkedIn,
              Indeed, or a company page. Add as many as you like.
            </p>
            <div className="cm-goal__set" style={{ marginBottom: 12 }}>
              <input
                type="text"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                placeholder="Job title (optional)"
                maxLength={100}
                className={inputStyle}
              />
              <input
                type="text"
                value={companyNameInput}
                onChange={(e) => setCompanyNameInput(e.target.value)}
                placeholder="Company name (optional)"
                maxLength={100}
                className={inputStyle}
              />
            </div>
            <textarea
              value={jobDescriptionInput}
              onChange={(e) => setJobDescriptionInput(e.target.value)}
              placeholder="Paste full job description…"
              maxLength={4000}
              rows={6}
              className={textAreaStyle}
            />

            <p className="cm-note" style={{ marginTop: 6 }}>
              {jobDescriptionInput.length} / 4000 characters
            </p>
            <button
              onClick={handleSubmitJob}
              className={`${buttonStyle} cm-btn--primary`}
              style={{ marginTop: 14 }}
            >
              Add job
            </button>
          </SectionCard>
        </section>
      )}
    </>
  );
}
