"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import Hero from "@/components/custom/Hero";
import Resume from "@/components/custom/Resume";
import JobInput from "@/components/custom/JobInput";
import JobList from "@/components/custom/JobList";
import NavBar from "@/components/custom/NavBar";
import Footer from "@/components/custom/Footer";
import Stats from "@/components/custom/Stats";

export default function Home() {
  type Job = {
    title: string;
    description: string;
    company: string;
  };

  const [lettersGenerated, setLettersGenerated] = useState<number>(0);
  const [summarizedText, setSummarizedText] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [addNew, setAddNew] = useState<boolean>(false);

  // shared presentation classes (editorial theme)
  const buttonStyle = "cm-btn";
  const sectionCard = "w-full";

  useEffect(() => {
    const savedLettersGenerated = localStorage.getItem("letters-generated");
    if (savedLettersGenerated)
      setLettersGenerated(parseInt(savedLettersGenerated));
  }, []);

  useEffect(() => {
    localStorage.setItem("letters-generated", lettersGenerated.toString());
  }, [lettersGenerated]);

  return (
    <>
      <Analytics />
      <NavBar />
      <main className="cm-main">
        <div className="cm-container">
          <Hero lettersGenerated={lettersGenerated} buttonStyle={buttonStyle} />
          <Resume
            summarizedText={summarizedText ?? ""}
            setSummarizedText={setSummarizedText}
            buttonStyle={buttonStyle}
            sectionCard={sectionCard}
          />
          <JobInput
            setAddNew={setAddNew}
            setJobs={setJobs}
            summarizedText={summarizedText ?? ""}
            buttonStyle={buttonStyle}
            sectionCard={sectionCard}
          />
          <JobList
            jobs={jobs}
            setJobs={setJobs}
            setLettersGenerated={setLettersGenerated}
            summarizedText={summarizedText ?? ""}
            setSummarizedText={setSummarizedText}
            addNew={addNew}
            setAddNew={setAddNew}
            buttonStyle={buttonStyle}
            sectionCard={sectionCard}
          />
          <Stats
            buttonStyle={buttonStyle}
            sectionCard={sectionCard}
            lettersGenerated={lettersGenerated}
          />
          <Footer />
        </div>
      </main>
    </>
  );
}
