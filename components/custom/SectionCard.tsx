// components/SectionCard.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  index?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  plain?: boolean;
};

export default function SectionCard({
  title,
  index,
  children,
  defaultOpen = true,
  plain = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className={`cm-panel${plain ? " cm-panel--plain" : ""}${
        isOpen ? " is-open" : ""
      }`}
    >
      <button
        type="button"
        className="cm-panel__header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="cm-panel__title">
          {index && <span className="cm-panel__idx">{index}</span>}
          <span className="cm-panel__name">{title}</span>
        </span>
        <span className="cm-panel__chev">
          <ChevronDown className="cm-icon" strokeWidth={1.75} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="cm-panel__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
