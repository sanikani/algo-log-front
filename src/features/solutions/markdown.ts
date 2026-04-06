import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight(code: string, language: string) {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value
    }

    return hljs.highlightAuto(code).value
  },
})

export function renderMarkdown(source: string) {
  return markdown.render(source)
}
