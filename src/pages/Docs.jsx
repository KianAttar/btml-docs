import { useEffect, useState, useRef } from 'react'

function CodeBlock({ children }) {
  const html = children
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;!DOCTYPE[^&]*&gt;)/g, '<span class="token-doctype">$1</span>')
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token-comment">$1</span>')
    .replace(/(&lt;\/[\w-]+&gt;)/g, '<span class="token-tag">$1</span>')
    .replace(/(&lt;[\w-]+)((\s[\w-]+=&quot;[^&quot;]*&quot;)*)(&gt;)/g, (_, open, attrs, _last, close) => {
      const styledAttrs = attrs
        ? attrs.replace(/([\w-]+)(=&quot;[^&quot;]*&quot;)/g,
            '<span class="token-attr">$1</span><span class="token-string">$2</span>')
        : ''
      return `<span class="token-tag">${open}${styledAttrs}${close}</span>`
    })

  return <pre className="code-block" dangerouslySetInnerHTML={{ __html: html }} />
}

function VersionBadge({ version }) {
  const map = { legacy: ['Legacy', 'legacy'], '1.0': ['Version 1.0', 'v1'], '2.0': ['Version 2.0', 'v2'] }
  const [label, cls] = map[version]
  return <span className={`version-badge ${cls}`}>{label}</span>
}

function Callout({ type = 'info', icon, children }) {
  return (
    <div className={`callout ${type}`}>
      <span className="callout-icon">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

// ─── Content per tab ───────────────────────────────────────────

const LEGACY_EXAMPLE = `<book-name>The Lighthouse Mystery</book-name>
<author>Hassan Attar</author>
<content>
Chapter 1: The Beginning

It was a dark and stormy night when our story begins...
</content>`

const V1_EXAMPLE = `<!DOCTYPE 1.0>
<book-name>The Lighthouse Mystery</book-name>
<author>
  <title>Dr.</title>
  <firstname>Hassan</firstname>
  <middlename>Ali</middlename>
  <lastname>Attar</lastname>
</author>
<content>
Chapter 1: The Beginning

It was a dark and stormy night when our story begins...
</content>`

const V2_EXAMPLE = `<!DOCTYPE 2.0>
<book-name>Advanced Programming Techniques</book-name>
<authors>
  <author>
    <title>Dr.</title>
    <firstname>Hassan</firstname>
    <lastname>Attar</lastname>
  </author>
  <author>
    <firstname>Marie</firstname>
    <lastname>Dubois</lastname>
  </author>
</authors>
<content language="english">
Chapter 1: Introduction

Programming is a collaborative art...
</content>`

// ─── Tab content components ────────────────────────────────────

function LegacyDocs({ onSwitchTab }) {
  return (
    <>
      <div className="docs-section" id="overview">
        <h1>BTML Documentation</h1>
        <p className="docs-lead">
          BTML (Book Text Markup Language) is a structured format for submitting book manuscripts
          to the publishing system. Tags give every piece of information an explicit label —
          so the system always knows what it's looking at without guessing.
        </p>
      </div>

      <div className="docs-section" id="legacy-format">
        <VersionBadge version="legacy" />
        <h2>Legacy Format</h2>
        <p>
          The original BTML format. No DOCTYPE required. Three tags, flat structure.
          The <code>&lt;author&gt;</code> tag contains a plain text name.
        </p>

        <Callout type="warning" icon="⚠">
          The legacy format is <strong>deprecated</strong>. Existing authors may continue
          using it during the transition period, but new submissions should use{' '}
          <button
            onClick={() => onSwitchTab('v1')}
            style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
          >
            Version 1.0
          </button>{' '}
          or later.
        </Callout>
      </div>

      <div className="docs-section" id="legacy-tags">
        <h2>Required Tags</h2>
        <ul>
          <li><code>&lt;book-name&gt;</code> — the full title of the book</li>
          <li><code>&lt;author&gt;</code> — the author's full name as plain text</li>
          <li><code>&lt;content&gt;</code> — the complete text of the book</li>
        </ul>
      </div>

      <div className="docs-section" id="legacy-example">
        <h2>Example</h2>
        <CodeBlock>{LEGACY_EXAMPLE}</CodeBlock>
      </div>

      <div className="docs-section" id="legacy-reference">
        <h2>Tag Reference</h2>
        <table className="tag-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt;book-name&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>The full title of the book.</td>
            </tr>
            <tr>
              <td>&lt;author&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>The author's full name as plain text. Example: <code>Hassan Attar</code></td>
            </tr>
            <tr>
              <td>&lt;content&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>The complete text of the book — all chapters and sections.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

function V1Docs({ onSwitchTab }) {
  return (
    <>
      <div className="docs-section" id="v1-overview">
        <h1>Version 1.0</h1>
        <p className="docs-lead">
          Version 1.0 solves the ambiguity of plain-text author names by introducing{' '}
          <strong>nested tags</strong> — tags living inside other tags. A DOCTYPE declaration
          at the top of every document tells the system which rules to apply.
        </p>
      </div>

      <div className="docs-section" id="v1-doctype">
        <h2>DOCTYPE Declaration</h2>
        <p>
          Every v1.0 document must begin with a DOCTYPE. It tells the system which version
          of the format rules to use when reading the rest of the document.
        </p>
        <CodeBlock>{`<!DOCTYPE 1.0>`}</CodeBlock>
      </div>

      <div className="docs-section" id="v1-nested-author">
        <h2>Nested Author Tags</h2>
        <p>
          In the legacy format, <code>&lt;author&gt;Dr. John Michael Smith&lt;/author&gt;</code>{' '}
          is ambiguous — there's no reliable way to separate title from first name or last name.
          Version 1.0 makes each part explicit with child tags.
        </p>
        <p>
          The <code>&lt;author&gt;</code> tag is the <strong>parent</strong>.{' '}
          <code>&lt;firstname&gt;</code>, <code>&lt;lastname&gt;</code>, and the optional fields
          are its <strong>children</strong>. All child tags belong inside their parent tag.
        </p>
        <CodeBlock>{`<author>
  <title>Dr.</title>        <!-- optional -->
  <firstname>Hassan</firstname>  <!-- required -->
  <middlename>Ali</middlename>  <!-- optional -->
  <lastname>Attar</lastname>    <!-- required -->
</author>`}</CodeBlock>
      </div>

      <div className="docs-section" id="v1-example">
        <h2>Complete Example</h2>
        <CodeBlock>{V1_EXAMPLE}</CodeBlock>
      </div>

      <div className="docs-section" id="v1-deprecated">
        <h2>Deprecated in this version</h2>
        <Callout type="deprecated" icon="✕">
          <strong>Plain-text &lt;author&gt;</strong> from the legacy format is deprecated.
          Using <code>&lt;author&gt;Full Name&lt;/author&gt;</code> without nested tags is
          no longer accepted in v1.0 submissions.{' '}
          <button
            onClick={() => onSwitchTab('legacy')}
            style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
          >
            View legacy docs →
          </button>
        </Callout>
      </div>

      <div className="docs-section" id="v1-reference">
        <h2>Tag Reference</h2>
        <p>All tags available in Version 1.0 submissions.</p>
        <table className="tag-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt;!DOCTYPE 1.0&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Must be the first line. Declares the document uses v1.0 rules.</td>
            </tr>
            <tr>
              <td>&lt;book-name&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>The full title of the book.</td>
            </tr>
            <tr>
              <td>&lt;author&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Parent container for author name fields. Must contain nested child tags.</td>
            </tr>
            <tr>
              <td>&lt;firstname&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Author's first name. Child of <code>&lt;author&gt;</code>.</td>
            </tr>
            <tr>
              <td>&lt;lastname&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Author's last name. Child of <code>&lt;author&gt;</code>.</td>
            </tr>
            <tr>
              <td>&lt;title&gt;</td>
              <td><span className="optional-badge">optional</span></td>
              <td>Author's title (Dr., Prof., etc.). Child of <code>&lt;author&gt;</code>.</td>
            </tr>
            <tr>
              <td>&lt;middlename&gt;</td>
              <td><span className="optional-badge">optional</span></td>
              <td>Author's middle name or initial. Child of <code>&lt;author&gt;</code>.</td>
            </tr>
            <tr>
              <td>&lt;content&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>The complete text of the book.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

function V2Docs({ onSwitchTab }) {
  return (
    <>
      <div className="docs-section" id="v2-overview">
        <h1>Version 2.0</h1>
        <p className="docs-lead">
          Version 2.0 introduces support for multiple authors and <strong>attributes</strong> —
          metadata about a tag that lives inside the opening tag itself, not as content.
        </p>
      </div>

      <div className="docs-section" id="v2-authors">
        <h2>Multiple Authors</h2>
        <p>
          The singular <code>&lt;author&gt;</code> is replaced by an <code>&lt;authors&gt;</code>{' '}
          container — a parent tag that holds one or more <code>&lt;author&gt;</code> children.
          This follows the standard list pattern: plural container, singular items.
        </p>
        <CodeBlock>{`<authors>
  <author>
    <firstname>Hassan</firstname>
    <lastname>Attar</lastname>
  </author>
  <author>
    <firstname>Marie</firstname>
    <lastname>Dubois</lastname>
  </author>
</authors>`}</CodeBlock>
        <p>
          A book with a single author still uses <code>&lt;authors&gt;</code> — the container
          tag is always required in v2.0.
        </p>
      </div>

      <div className="docs-section" id="v2-attributes">
        <h2>Attributes</h2>
        <p>
          An attribute is extra information about a tag — not part of the content, but metadata
          that describes it. Attributes are written inside the opening tag as{' '}
          <code>name="value"</code> pairs.
        </p>
        <p>
          In v2.0, <code>&lt;content&gt;</code> accepts an optional <code>language</code> attribute:
        </p>
        <CodeBlock>{`<content language="english">
Book text here...
</content>

<content language="french">
Le texte du livre ici...
</content>`}</CodeBlock>
        <p>
          The language attribute does not change the content — it describes it. The system uses
          it to route the submission to the correct processing pipeline.
        </p>
      </div>

      <div className="docs-section" id="v2-example">
        <h2>Complete Example</h2>
        <CodeBlock>{V2_EXAMPLE}</CodeBlock>
      </div>

      <div className="docs-section" id="v2-deprecated">
        <h2>Deprecated in this version</h2>
        <Callout type="deprecated" icon="✕">
          <strong>Plain-text &lt;author&gt;</strong> from the legacy format is not accepted in
          v2.0. The legacy format's flat structure has been fully superseded.{' '}
          <button
            onClick={() => onSwitchTab('legacy')}
            style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
          >
            View legacy docs →
          </button>
        </Callout>
        <Callout type="deprecated" icon="✕">
          <strong>Singular &lt;author&gt; at top level</strong> (v1.0 style) is not valid in
          v2.0. Authors must be wrapped in an <code>&lt;authors&gt;</code> container.
        </Callout>
      </div>

      <div className="docs-section" id="v2-reference">
        <h2>Tag Reference</h2>
        <p>All tags available in Version 2.0 submissions.</p>
        <table className="tag-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt;!DOCTYPE 2.0&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Must be the first line. Declares the document uses v2.0 rules.</td>
            </tr>
            <tr>
              <td>&lt;book-name&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>The full title of the book.</td>
            </tr>
            <tr>
              <td>&lt;authors&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Container holding one or more <code>&lt;author&gt;</code> tags.</td>
            </tr>
            <tr>
              <td>&lt;author&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Individual author entry. Must be inside <code>&lt;authors&gt;</code>. Contains nested name fields.</td>
            </tr>
            <tr>
              <td>&lt;firstname&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Author's first name. Child of <code>&lt;author&gt;</code>.</td>
            </tr>
            <tr>
              <td>&lt;lastname&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>Author's last name. Child of <code>&lt;author&gt;</code>.</td>
            </tr>
            <tr>
              <td>&lt;title&gt;</td>
              <td><span className="optional-badge">optional</span></td>
              <td>Author's title. Child of <code>&lt;author&gt;</code>.</td>
            </tr>
            <tr>
              <td>&lt;middlename&gt;</td>
              <td><span className="optional-badge">optional</span></td>
              <td>Author's middle name. Child of <code>&lt;author&gt;</code>.</td>
            </tr>
            <tr>
              <td>&lt;content&gt;</td>
              <td><span className="required-badge">required</span></td>
              <td>
                The complete text of the book. Accepts optional attribute:{' '}
                <code>language="english"</code>
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Attributes</h3>
        <table className="tag-table">
          <thead>
            <tr><th>Attribute</th><th>Tag</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>language</td>
              <td><code>&lt;content&gt;</code></td>
              <td><span className="optional-badge">optional</span></td>
              <td>Language of the book content. Example: <code>language="english"</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

// ─── Sidebar sections per tab ──────────────────────────────────

const SIDEBAR_SECTIONS = {
  legacy: [
    { id: 'overview', label: 'Overview' },
    { id: 'legacy-format', label: 'Legacy Format' },
    { id: 'legacy-tags', label: 'Required Tags' },
    { id: 'legacy-example', label: 'Example' },
    { id: 'legacy-reference', label: 'Tag Reference' },
  ],
  v1: [
    { id: 'v1-overview', label: 'Overview' },
    { id: 'v1-doctype', label: 'DOCTYPE Declaration' },
    { id: 'v1-nested-author', label: 'Nested Author Tags' },
    { id: 'v1-example', label: 'Complete Example' },
    { id: 'v1-deprecated', label: 'Deprecated' },
    { id: 'v1-reference', label: 'Tag Reference' },
  ],
  v2: [
    { id: 'v2-overview', label: 'Overview' },
    { id: 'v2-authors', label: 'Multiple Authors' },
    { id: 'v2-attributes', label: 'Attributes' },
    { id: 'v2-example', label: 'Complete Example' },
    { id: 'v2-deprecated', label: 'Deprecated' },
    { id: 'v2-reference', label: 'Tag Reference' },
  ],
}

// ─── Main Docs page ────────────────────────────────────────────

export default function Docs() {
  const [activeTab, setActiveTab] = useState('legacy')
  const [activeSection, setActiveSection] = useState(SIDEBAR_SECTIONS.legacy[0].id)
  const contentRef = useRef(null)

  // Re-observe sections when tab changes
  useEffect(() => {
    setActiveSection(SIDEBAR_SECTIONS[activeTab][0].id)
    contentRef.current?.scrollTo({ top: 0 })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { root: null, rootMargin: '-20% 0px -65% 0px' }
    )
    SIDEBAR_SECTIONS[activeTab].forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [activeTab])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const tabs = [
    { key: 'legacy', label: 'Legacy' },
    { key: 'v1', label: 'Version 1.0' },
    { key: 'v2', label: 'Version 2.0' },
  ]

  return (
    <div className="page-layout">
      <aside className="sidebar">
        <div className="sidebar-group">
          <div className="sidebar-group-label">On this page</div>
          {SIDEBAR_SECTIONS[activeTab].map(({ id, label }) => (
            <button
              key={id}
              className={`sidebar-link ${activeSection === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </aside>

      <main className="docs-content" ref={contentRef}>
        <div className="version-tabs">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              className={`version-tab ${key} ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'legacy' && <LegacyDocs onSwitchTab={setActiveTab} />}
        {activeTab === 'v1'     && <V1Docs     onSwitchTab={setActiveTab} />}
        {activeTab === 'v2'     && <V2Docs     onSwitchTab={setActiveTab} />}
      </main>
    </div>
  )
}
