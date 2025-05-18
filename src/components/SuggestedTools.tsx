'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  handle: string;
  icon: string;
  url: string;
}

// Mock data for suggested tools
const suggestedTools: Tool[] = [
  {
    id: '1',
    name: 'AI Image Generator',
    handle: '@aiimages',
    icon: '/tool-icons/ai-image.jpg',
    url: 'https://example.com/ai-image-generator'
  },
  {
    id: '2',
    name: 'Code Assistant',
    handle: '@codehelper',
    icon: '/tool-icons/code-assistant.jpg',
    url: 'https://example.com/code-assistant'
  },
  {
    id: '3',
    name: 'Text Analyzer',
    handle: '@textai',
    icon: '/tool-icons/text-analyzer.jpg',
    url: 'https://example.com/text-analyzer'
  },
  {
    id: '4',
    name: 'Voice Generator',
    handle: '@voiceai',
    icon: '/tool-icons/voice-generator.jpg',
    url: 'https://example.com/voice-generator'
  },
  {
    id: '5',
    name: 'Data Visualizer',
    handle: '@datavis',
    icon: '/tool-icons/data-visualizer.jpg',
    url: 'https://example.com/data-visualizer'
  }
];

export default function SuggestedTools() {
  const [showAll, setShowAll] = useState(false);
  const displayedTools = showAll ? suggestedTools : suggestedTools.slice(0, 3);

  return (
    <div className="bg-[#1B2730] rounded-xl border border-gray sticky top-16 z-10 max-h-[calc(100vh-5rem)] flex flex-col transition-all duration-200">
      <div className="p-4 border-b border-gray">
        <h2 className="text-xl font-bold text-white">Tools to explore</h2>
      </div>

      <div className="py-2 overflow-y-auto">
        {displayedTools.map((tool) => (
          <div key={tool.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                {/* Use a fallback div with the first letter if image fails to load */}
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white font-bold">
                  {tool.name.charAt(0)}
                </div>
              </div>
              <div>
                <div className="font-semibold text-white">{tool.name}</div>
                <div className="text-gray-500 text-sm">{tool.handle}</div>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-white hover:bg-gray-200 text-black font-semibold px-4"
              onClick={() => window.open(tool.url, '_blank')}
            >
              <span className="mr-1">Visit</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {!showAll && suggestedTools.length > 3 && (
        <button
          className="text-[#1d9bf0] hover:text-[#1a8cd8] p-4 w-full text-left text-sm font-medium mt-auto"
          onClick={() => setShowAll(true)}
        >
          Show more
        </button>
      )}
    </div>
  );
}
