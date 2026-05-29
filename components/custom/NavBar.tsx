"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { name: "upload", link: "#upload" },
  { name: "add job", link: "#add-job" },
  { name: "jobs", link: "#jobs" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="cm-nav">
        <div className="cm-nav__inner">
          <Link href="/" className="cm-brand">
            CoverMe<b>.</b>
          </Link>

          {/* Desktop links */}
          <div className="cm-nav__links">
            {links.map((link) => (
              <Link key={link.link} href={link.link} className="cm-navlink">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Menu toggle button - visible on small screens */}
          <button
            className="cm-navtoggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="cm-icon" strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {isOpen && (
        <div className="cm-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile drawer menu */}
      <div className={`cm-drawer${isOpen ? " is-open" : ""}`}>
        <button
          className="cm-drawer__close"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X className="cm-icon" strokeWidth={1.75} />
        </button>
        <div className="cm-drawer__links">
          {links.map((link) => (
            <Link
              key={link.link}
              href={link.link}
              className="cm-drawer__link"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
