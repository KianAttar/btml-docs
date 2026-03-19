import { useState } from 'react'
import { validate } from '../lib/validator.js'

const EXAMPLES = {
  legacy: `<book-name>The Lighthouse Mystery</book-name>
<author>Hassan Attar</author>
<content>
Chapter 1: The Beginning

It was a dark and stormy night when our story begins...
</content>`,

  v1: `<!DOCTYPE 1.0>
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
</content>`,

  v2: `<!DOCTYPE 2.0>
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
</content>`,
}

const VERSION_LABELS = {
  legacy: 'Legacy Format',
  '1.0': 'Version 1.0',
  '2.0': 'Version 2.0',
}

export default function Validator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)

  const handleValidate = () => {
    setResult(validate(input))
  }

  const handleExample = (key) => {
    setInput(EXAMPLES[key])
    setResult(null)
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
  }

  return (
    <div className="page-layout">
      <div className="validator-page">
        <h1>BTML Validator</h1>
        <p className="page-lead">
          Paste your BTML submission below to check it against the format rules.
          The validator automatically detects the version from your DOCTYPE declaration.
        </p>

        <div className="validator-input-area">
          <label htmlFor="btml-input">Your BTML submission</label>
          <textarea
            id="btml-input"
            className="validator-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your BTML here...\n\nExample:\n<book-name>My Book</book-name>\n<author>Jane Smith</author>\n<content>Book text...</content>`}
            spellCheck={false}
          />
        </div>

        <div className="validator-actions">
          <button className="btn-primary" onClick={handleValidate}>
            Validate
          </button>
          <button className="btn-ghost" onClick={handleClear}>
            Clear
          </button>
          <span className="examples-label">Try an example:</span>
          <button className="btn-ghost" onClick={() => handleExample('legacy')}>Legacy</button>
          <button className="btn-ghost" onClick={() => handleExample('v1')}>v1.0</button>
          <button className="btn-ghost" onClick={() => handleExample('v2')}>v2.0</button>
        </div>

        {result && (
          <div className={`validator-result ${result.valid ? 'valid' : 'invalid'}`}>
            <div className={`result-header ${result.valid ? 'valid' : 'invalid'}`}>
              {result.valid ? '✓ Valid submission' : '✗ Invalid submission'}
              {result.version && (
                <span className="result-version">
                  {VERSION_LABELS[result.version] ?? result.version}
                </span>
              )}
            </div>

            {result.valid && (
              <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--color-success)' }}>
                Your submission follows the{' '}
                {VERSION_LABELS[result.version]} rules and is ready to send.
              </p>
            )}

            {!result.valid && (
              <ul className="error-list">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
