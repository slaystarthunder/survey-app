// [S02] Added: Dev tools page with "export src snapshot" button (src/** -> JSON download).
// [SEED] Extended: Manual seed button for client survey JSON.
// [V2.4] Added: Quick links to key dev routes.

import { seedPerspectiveCircleSurvey } from "@core/seed/seedPerspectiveCircle";


function downloadJson(filename: string, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export function DevToolsPage() {
  const exportSnapshot = async () => {
    const files = import.meta.glob("/src/**/*", { eager: true, as: "raw" }) as Record<string, string>;

    const snapshot = {
      snapshotVersion: 1,
      generatedAt: new Date().toISOString(),
      files,
    };

    const stamp = snapshot.generatedAt.replace(/[:.]/g, "-");
    downloadJson(`survey-app-src-snapshot-${stamp}.json`, snapshot);
  };

  const seedPerspectiveCircle = () => {
    const surveyId = seedPerspectiveCircleSurvey();
    alert(`Seeded survey: ${surveyId}`);
  };

  const linkStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    textDecoration: "none",
  };

  const codeStyle: React.CSSProperties = {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 12,
    opacity: 0.85,
  };

  const buttonStyle: React.CSSProperties = { padding: "8px 12px", cursor: "pointer" };

  return (
    <div style={{ padding: 16 }}>
      <h1>Dev Tools</h1>

      {/* Quick links */}
      <section style={{ marginTop: 16 }}>
        <h2 style={{ margin: "0 0 8px" }}>Quick links</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <a href="/admin/surveys" style={linkStyle}>
            Admin surveys
          </a>

          <a href="/dev/storage" style={linkStyle}>
            Dev storage
          </a>

          <a href="/result/RUN_ID/finished" style={linkStyle}>
            Result / PDF page
          </a>
        </div>

        <p style={{ marginTop: 10, opacity: 0.75 }}>
          Tip: Replace <span style={codeStyle}>RUN_ID</span> in the URL (example:{" "}
          <span style={codeStyle}>/result/r_abc123/finished</span>).
        </p>
      </section>

      <hr style={{ margin: "24px 0" }} />

      {/* Export */}
      <section>
        <h2 style={{ margin: "0 0 8px" }}>Export</h2>
        <p>
          Export a JSON snapshot of <code>src/**</code>.
        </p>

        <button onClick={exportSnapshot} style={buttonStyle}>
          Export src snapshot (JSON)
        </button>

        <p style={{ marginTop: 12, opacity: 0.75 }}>
          Note: this snapshot includes files under <code>src/</code> that Vite can import as raw text.
        </p>
      </section>

      <hr style={{ margin: "24px 0" }} />

      {/* Seed data */}
      <section>
        <h2 style={{ margin: "0 0 8px" }}>Seed data</h2>

        <p>
          Manually write client survey JSON into localStorage via <code>surveyRepo</code>.
        </p>

        <button onClick={seedPerspectiveCircle} style={buttonStyle}>
          Seed “Perspective Circle” survey
        </button>
      </section>
    </div>
  );
}
