import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Accordion } from "./components/Accordion";
import { Toast } from "./components/Toast";
import { buildSearchIndex, getRdkTopics } from "./content/rdkContent";
import { copyToClipboard } from "./utils/clipboard";

/**
 * App goals:
 * - Single page UI (no routing dependency) with top nav + sidebar + main content.
 * - Local content model for RDK middleware learning + interview prep.
 * - Lightweight styling (no UI framework) using Ocean Professional variables.
 */

// PUBLIC_INTERFACE
function App() {
  /** Main application entry component. */
  const [theme, setTheme] = useState("light");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("what-is-rdk-middleware");
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const toastIdRef = useRef(0);

  const topics = useMemo(() => getRdkTopics(), []);
  const searchIndex = useMemo(() => buildSearchIndex(topics), [topics]);

  const selectedTopic = useMemo(
    () => topics.find((t) => t.id === selectedTopicId) || topics[0],
    [topics, selectedTopicId]
  );

  // Apply theme to document root.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Keyboard shortcut for focusing search (Cmd/Ctrl + K).
  useEffect(() => {
    const onKeyDown = (e) => {
      const isK = e.key?.toLowerCase() === "k";
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        const el = document.getElementById("globalSearch");
        el?.focus();
      }
      if (e.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const visibleTopicIds = useMemo(() => {
    if (!normalizedQuery) return topics.map((t) => t.id);
    const matches = searchIndex
      .filter((x) => x.haystack.includes(normalizedQuery))
      .map((x) => x.id);
    return matches;
  }, [normalizedQuery, searchIndex, topics]);

  const visibleTopics = useMemo(
    () => topics.filter((t) => visibleTopicIds.includes(t.id)),
    [topics, visibleTopicIds]
  );

  const filteredQuestions = useMemo(() => {
    const qs = selectedTopic?.questions || [];
    if (!normalizedQuery) return qs;

    return qs.filter((q) => {
      const hay = [
        q.category,
        q.question,
        q.shortAnswer,
        q.answer,
        ...(q.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(normalizedQuery);
    });
  }, [selectedTopic, normalizedQuery]);

  // If search hides currently selected topic, select first visible match.
  useEffect(() => {
    if (!visibleTopicIds.includes(selectedTopicId)) {
      const fallback = visibleTopicIds[0];
      if (fallback) setSelectedTopicId(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTopicIds.join("|")]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggles the app between light and dark theme. */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const pushToast = (title, message) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, title, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  };

  const onSelectTopic = (id) => {
    setSelectedTopicId(id);
    setExpandedQuestionId(null);
    setMobileSidebarOpen(false);
  };

  const onCopyAnswer = async (q) => {
    const text = `${q.question}\n\n${q.answer}`;
    const ok = await copyToClipboard(text);
    if (ok) pushToast("Copied", "Answer copied to clipboard.");
    else pushToast("Copy failed", "Clipboard not available in this environment.");
  };

  const topicCountLabel = `${visibleTopics.length}/${topics.length}`;

  return (
    <div className="appRoot">
      <header className="topNav">
        <div className="topNavInner">
          <button
            type="button"
            className="iconBtn mobileMenuBtn"
            onClick={() => setMobileSidebarOpen((v) => !v)}
            aria-expanded={mobileSidebarOpen}
            aria-controls="sidebar"
          >
            Menu
          </button>

          <div className="brand" aria-label="App brand">
            <div className="brandMark" aria-hidden="true" />
            <div className="brandTitle">
              <strong>RDK Middleware Insights</strong>
              <span>Beginners + interview prep</span>
            </div>
          </div>

          <div className="searchWrap">
            <input
              id="globalSearch"
              className="input"
              placeholder="Search topics & interview questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search topics and questions"
            />
          </div>

          <div className="navActions">
            <span className="badge" title="Keyboard shortcut">
              <kbd className="kbd">Ctrl</kbd>+<kbd className="kbd">K</kbd>
            </span>
            <button
              type="button"
              className="iconBtn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </header>

      <div
        className={[
          "mobileOverlay",
          mobileSidebarOpen ? "mobileOverlayOpen" : "",
        ].join(" ")}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden={!mobileSidebarOpen}
      />

      <div className="layout">
        <aside
          id="sidebar"
          className={["sidebar", mobileSidebarOpen ? "sidebarOpen" : ""].join(" ")}
          aria-label="Topic navigation"
        >
          <div className="sidebarHeader">
            <h2>Topics</h2>
            <span>{topicCountLabel}</span>
          </div>

          <ul className="topicList">
            {visibleTopics.map((t) => {
              const active = t.id === selectedTopicId;
              const count =
                t.type === "Interview"
                  ? (t.questions?.length || 0)
                  : t.questions?.length
                    ? t.questions.length
                    : t.glossary?.length
                      ? t.glossary.length
                      : t.sections?.length || 0;

              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={[
                      "topicBtn",
                      active ? "topicBtnActive" : "",
                    ].join(" ")}
                    onClick={() => onSelectTopic(t.id)}
                    aria-current={active ? "page" : undefined}
                  >
                    <div className="topicBtnTopRow">
                      <div className="topicBtnTitle">{t.title}</div>
                      <span className="badge">{count}</span>
                    </div>
                    <div className="topicBtnDesc">{t.description}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="main" aria-label="Content">
          <div className="mainHeader">
            <h1>{selectedTopic?.title}</h1>
            <p>{selectedTopic?.description}</p>
          </div>

          <div className="mainBody">
            {selectedTopic?.sections?.length ? (
              <div className="section">
                <div className="sectionTitleRow">
                  <h3>Explanation</h3>
                  <span>{selectedTopic.sections.length} modules</span>
                </div>

                {selectedTopic.sections.map((s) => (
                  <div key={s.title} className="card">
                    <div className="richText">
                      <strong>{s.title}</strong>
                      <ul>
                        {s.body.map((line, idx) => (
                          <li key={`${s.title}-${idx}`}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {selectedTopic?.glossary?.length ? (
              <div className="section">
                <div className="sectionTitleRow">
                  <h3>Glossary</h3>
                  <span>{selectedTopic.glossary.length} terms</span>
                </div>

                <div className="card">
                  <div className="richText">
                    <ul>
                      {selectedTopic.glossary
                        .filter((g) => {
                          if (!normalizedQuery) return true;
                          const hay = `${g.term} ${g.definition}`.toLowerCase();
                          return hay.includes(normalizedQuery);
                        })
                        .map((g) => (
                          <li key={g.term}>
                            <strong>{g.term}</strong> — {g.definition}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {(selectedTopic?.questions?.length || 0) > 0 ? (
              <div className="section">
                <div className="sectionTitleRow">
                  <h3>Questions & Answers</h3>
                  <span>
                    {filteredQuestions.length}/{selectedTopic.questions.length}
                  </span>
                </div>

                {filteredQuestions.length ? (
                  <Accordion
                    items={filteredQuestions}
                    expandedId={expandedQuestionId}
                    onToggle={setExpandedQuestionId}
                    onCopy={onCopyAnswer}
                  />
                ) : (
                  <div className="card">
                    <div className="richText">
                      No questions match your search. Try clearing the search box.
                    </div>
                    <div className="actionRow">
                      <button type="button" className="btn btnPrimary" onClick={() => setQuery("")}>
                        Clear search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="hr" />

            <div className="card">
              <div className="richText">
                <strong>Tip for interview prep</strong>
                <ul>
                  <li>
                    Start with a definition (what middleware is), then a boundary (where it sits),
                    then examples (services, IPC, plugins), and finish with reliability/security.
                  </li>
                  <li>
                    Use search for quick drills: try keywords like <span className="badge">IPC</span>{" "}
                    or <span className="badge">lifecycle</span>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Toast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}

export default App;
