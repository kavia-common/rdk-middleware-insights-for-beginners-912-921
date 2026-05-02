import React from "react";

// PUBLIC_INTERFACE
export function Accordion({ items, expandedId, onToggle, onCopy }) {
  /** Accessible accordion for Q/A lists. */
  return (
    <div>
      {items.map((q) => {
        const isOpen = expandedId === q.id;
        const buttonId = `acc-btn-${q.id}`;
        const panelId = `acc-panel-${q.id}`;

        return (
          <div key={q.id} className="accItem">
            <button
              type="button"
              className="accHeader"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(isOpen ? null : q.id)}
            >
              <div className="accHeaderLeft">
                <div className="accQuestionRow">
                  <div className="accChevron" aria-hidden="true">
                    {isOpen ? "–" : "+"}
                  </div>
                  <p className="accQuestion">{q.question}</p>
                  {q.category ? <span className="badge">{q.category}</span> : null}
                </div>
                {q.shortAnswer ? <div className="accMeta">{q.shortAnswer}</div> : null}
              </div>
            </button>

            {isOpen ? (
              <div
                className="accBody"
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
              >
                <div className="accAnswer">{q.answer}</div>
                <div className="actionRow">
                  <button
                    type="button"
                    className="btn btnSecondary"
                    onClick={() => onCopy(q)}
                  >
                    Copy answer
                  </button>
                  {q.tags?.length ? (
                    <div className="actionRow" aria-label="Tags">
                      {q.tags.map((t) => (
                        <span key={t} className="badge">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
