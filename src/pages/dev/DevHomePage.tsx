// Minimal /dev landing page (dev-only navigation)

export function DevHomePage() {
    return (
      <div style={{ padding: 16 }}>
        <h1>Dev</h1>
        <p>Developer tools and admin links:</p>
  
        <ul style={{ lineHeight: 1.7 }}>
          <li>
            <a href="/dev/tools">/dev/tools</a> (Dev tools / seeding)
          </li>
          <li>
            <a href="/dev/storage">/dev/storage</a> (Storage viewer)
          </li>
          <li>
            <a href="/admin/surveys">/admin/surveys</a> (Admin)
          </li>
          <li>
            <a href="/ui-demo">/ui-demo</a> (UI demo)
          </li>
          <li>
            <a href="/dev/db">/dev/db</a> (Firebase DB + Auth)
          </li>
          <li>
            <a href="/">/</a> (Back to user entry)
          </li>
        </ul>
      </div>
    );
  }
  