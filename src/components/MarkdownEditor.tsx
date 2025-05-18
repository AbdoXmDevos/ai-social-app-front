import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Code, Link as LinkIcon, Eye, Edit2, HelpCircle, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tooltip } from '@/components/ui/tooltip';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  editorRef?: React.RefObject<{ resetHeight: () => void } | null>;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "What's happening?",
  className = "",
  minHeight = "48px",
  editorRef
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Expose the resetHeight method through the ref
  useEffect(() => {
    if (editorRef) {
      editorRef.current = {
        resetHeight: () => {
          if (textareaRef.current) {
            textareaRef.current.style.height = minHeight;
          }
        }
      };
    }
  }, [editorRef, minHeight]);

  const insertMarkdown = (markdownSyntax: string, selectionOffset = 0) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText;
    if (markdownSyntax === '[]()') {
      // Special case for links
      newText = value.substring(0, start) +
                '[' + selectedText + ']()' +
                value.substring(end);
      onChange(newText);
      // Position cursor inside the parentheses
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + selectedText.length + 3;
        textarea.selectionEnd = start + selectedText.length + 3;
      }, 0);
    } else {
      newText = value.substring(0, start) +
                markdownSyntax + selectedText + markdownSyntax +
                value.substring(end);
      onChange(newText);
      // Position cursor after the inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = end + markdownSyntax.length * 2 + selectionOffset;
        textarea.selectionEnd = end + markdownSyntax.length * 2 + selectionOffset;
      }, 0);
    }
  };

  const insertList = (ordered: boolean) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const prefix = ordered ? '1. ' : '- ';
    const newText = value.substring(0, start) + prefix + value.substring(start);

    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length;
    }, 0);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-1 mb-2 bg-[#1a2730] p-2 rounded-md">
        {!isPreview ? (
          <>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-gray-700"
                onClick={() => insertMarkdown('**')}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-gray-700"
                onClick={() => insertMarkdown('*')}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-gray-700"
                onClick={() => insertList(false)}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-gray-700"
                onClick={() => insertList(true)}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-gray-700"
                onClick={() => insertMarkdown('`')}
                title="Code"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-gray-700"
                onClick={() => insertMarkdown('[]()')}
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : null}
        <div className="ml-auto flex items-center gap-1">
          <Tooltip
            content={
              <div className="p-1">
                <p className="font-medium mb-1">Markdown Formatting Tips:</p>
                <p>Highlight text and click a style button for better formatting, or use markdown like:</p>
                <ul className="list-disc pl-4 mt-1">
                  <li><code className="bg-gray-700 px-1 rounded">**bold**</code> for <strong>bold</strong></li>
                  <li><code className="bg-gray-700 px-1 rounded">*italic*</code> for <em>italic</em></li>
                  <li><code className="bg-gray-700 px-1 rounded">`code`</code> for <code className="bg-gray-700 px-1 rounded">code</code></li>
                  <li><code className="bg-gray-700 px-1 rounded">[link text](url)</code> for <a href="#" className="text-blue-400">link text</a></li>
                </ul>
                <p className="mt-2 text-xs text-gray-400">Note: Images in markdown will show as text links for security reasons.</p>
              </div>
            }
            position="bottom"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-blue-400 border border-gray-700"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 border border-gray-700"
            onClick={() => setIsPreview(!isPreview)}
            title={isPreview ? "Edit" : "Preview"}
          >
            {isPreview ? <Edit2 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isPreview ? (
        <div className="min-h-[100px] p-3 border border-gray-700 rounded-md bg-[#1a2730] prose prose-invert max-w-none">
          {value ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Disable image rendering but keep the alt text
                img: ({node, ...props}) => <span className="text-blue-400">[Image: {props.alt || 'Embedded image'}]</span>,
                // Allow links to work normally
                a: ({node, children, ...props}) => (
                  <a
                    href={props.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {children}
                  </a>
                )
              }}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500">Nothing to preview</p>
          )}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none text-white placeholder:text-gray-500 resize-none min-h-[48px] max-h-[300px] overflow-y-auto focus:ring-0 focus:outline-none"
          style={{ minHeight }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(300, Math.max(parseInt(minHeight), target.scrollHeight))}px`;
          }}
        />
      )}
    </div>
  );
}
