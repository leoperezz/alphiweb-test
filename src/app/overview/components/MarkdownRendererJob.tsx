import MarkdownRenderer from './MarkdownRenderer';
import { LuDownload } from "react-icons/lu";

interface JobSection {
  content: string;
  number: string;
  title: string;
}

interface MarkdownRendererJobProps {
  sections: JobSection[];
  jobName?: string;
  jobDescription?: string;
}

export default function MarkdownRendererJob({ 
  sections, 
  jobName = "document",
  jobDescription 
}: MarkdownRendererJobProps) {
  const generateContent = (sections: JobSection[]): string => {
    let content = "";
    
    for (const section of sections) {
      const headerLevel = section.number.split('.').length;
      content += `${'#'.repeat(headerLevel)} ${section.number} ${section.title}\n\n`;
      if (section.content) {
        content += `${section.content}\n\n`;
      }
    }
    
    return content;
  };

  const handleDownload = () => {
    const content = generateContent(sections);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobName.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-medium">{jobName}</h1>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-white hover:bg-white/90 rounded-lg transition-all flex items-center gap-2"
            title="Download Markdown"
          >
            <LuDownload className="text-black text-lg" />
            <span className="text-black font-medium">Download</span>
          </button>
        </div>
        {jobDescription && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-white/70 text-sm">{jobDescription}</p>
          </div>
        )}
      </div>
      <MarkdownRenderer content={generateContent(sections)} />
    </div>
  );
}
