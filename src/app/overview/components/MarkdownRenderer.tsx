import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ ...props }) => (
            <h1 {...props} className="text-2xl font-bold mt-6 mb-3 text-white" />
          ),
          h2: ({ ...props }) => (
            <h2 {...props} className="text-xl font-bold mt-6 mb-3 text-white" />
          ),
          h3: ({ ...props }) => (
            <h3 {...props} className="text-lg font-bold mt-4 mb-2 text-white" />
          ),
          p: ({ ...props }) => (
            <p {...props} className="text-sm leading-7 mb-4 text-white" />
          ),
          code: ({ ...props }) => (
            <code {...props} className="bg-zinc-800 rounded-md px-2 py-0.5 text-sm font-mono" />
          ),
          pre: ({ ...props }) => (
            <pre {...props} className="bg-zinc-800 rounded-lg p-4 my-4 overflow-x-auto" />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-white/20 pl-4 py-1 my-4 italic text-white/80"
            />
          ),
          ul: ({ ...props }) => (
            <ul {...props} className="space-y-2 pl-4" />
          ),
          ol: ({ ...props }) => (
            <ol {...props} className="space-y-2 pl-4 list-decimal" />
          ),
          li: ({ children, ...props }) => (
            <li {...props} className="text-white/90 leading-7">
              <span className="inline-block">{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          a: ({ ...props }) => (
            <a {...props} className="text-white underline hover:text-white/80 transition-colors" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
