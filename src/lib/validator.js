function extractTag(name, content) {
  const re = new RegExp(`<${name}(\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i')
  const match = content.match(re)
  if (!match) return { found: false }
  const openingTag = match[0].match(new RegExp(`<${name}([^>]*)>`, 'i'))
  const attrs = openingTag ? openingTag[1] : ''
  return { found: true, content: match[2], attrs }
}

function extractAllTags(name, content) {
  const re = new RegExp(`<${name}(\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'gi')
  const results = []
  let match
  while ((match = re.exec(content)) !== null) {
    const openingTag = match[0].match(new RegExp(`<${name}([^>]*)>`, 'i'))
    const attrs = openingTag ? openingTag[1] : ''
    results.push({ content: match[2], attrs })
  }
  return results
}

function extractAttr(attrs, name) {
  const re = new RegExp(`${name}="([^"]*)"`, 'i')
  const match = attrs.match(re)
  return match ? match[1] : null
}

function validateLegacy(content) {
  const errors = []

  const bookName = extractTag('book-name', content)
  const author = extractTag('author', content)
  const bookContent = extractTag('content', content)

  if (!bookName.found) errors.push('Missing required tag: <book-name>')
  if (!author.found) errors.push('Missing required tag: <author>')
  if (!bookContent.found) errors.push('Missing required tag: <content>')

  if (author.found && /<[a-z]/.test(author.content)) {
    errors.push(
      'In the legacy format, <author> should contain plain text — not nested tags. Use <!DOCTYPE 1.0> if you want nested author fields.'
    )
  }

  return errors
}

function validateV1(content) {
  const errors = []

  const bookName = extractTag('book-name', content)
  const author = extractTag('author', content)
  const bookContent = extractTag('content', content)

  if (!bookName.found) errors.push('Missing required tag: <book-name>')

  if (!author.found) {
    errors.push('Missing required tag: <author>')
  } else {
    const firstname = extractTag('firstname', author.content)
    const lastname = extractTag('lastname', author.content)
    if (!firstname.found) errors.push('<author> is missing required child tag: <firstname>')
    if (!lastname.found) errors.push('<author> is missing required child tag: <lastname>')
  }

  if (!bookContent.found) errors.push('Missing required tag: <content>')

  // In v1.0, author is singular — warn if they used authors
  const authors = extractTag('authors', content)
  if (authors.found) {
    errors.push(
      'Version 1.0 uses a single <author> tag, not <authors>. Use <!DOCTYPE 2.0> for multiple authors.'
    )
  }

  return errors
}

function validateV2(content) {
  const errors = []

  const bookName = extractTag('book-name', content)
  const authors = extractTag('authors', content)
  const bookContent = extractTag('content', content)

  if (!bookName.found) errors.push('Missing required tag: <book-name>')

  if (!authors.found) {
    // Check if they used singular <author> by mistake
    const author = extractTag('author', content)
    if (author.found) {
      errors.push(
        'Version 2.0 uses <authors> (plural) as a container — wrap your <author> tags inside <authors>...</authors>'
      )
    } else {
      errors.push('Missing required tag: <authors>')
    }
  } else {
    const authorList = extractAllTags('author', authors.content)
    if (authorList.length === 0) {
      errors.push('<authors> must contain at least one <author>')
    } else {
      authorList.forEach((author, i) => {
        const label = authorList.length > 1 ? `Author ${i + 1}` : 'Author'
        const firstname = extractTag('firstname', author.content)
        const lastname = extractTag('lastname', author.content)
        if (!firstname.found) errors.push(`${label}: missing required tag <firstname>`)
        if (!lastname.found) errors.push(`${label}: missing required tag <lastname>`)
      })
    }
  }

  if (!bookContent.found) {
    errors.push('Missing required tag: <content>')
  }

  return errors
}

export function validate(input) {
  const trimmed = input.trim()
  if (!trimmed) return { version: null, errors: ['Input is empty'], valid: false }

  let version = 'legacy'
  let content = trimmed

  if (trimmed.startsWith('<!DOCTYPE 2.0>')) {
    version = '2.0'
    content = trimmed.slice('<!DOCTYPE 2.0>'.length).trim()
  } else if (trimmed.startsWith('<!DOCTYPE 1.0>')) {
    version = '1.0'
    content = trimmed.slice('<!DOCTYPE 1.0>'.length).trim()
  }

  let errors = []
  if (version === 'legacy') errors = validateLegacy(content)
  else if (version === '1.0') errors = validateV1(content)
  else if (version === '2.0') errors = validateV2(content)

  return { version, errors, valid: errors.length === 0 }
}
