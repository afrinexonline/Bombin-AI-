"use client";

import { Camera, Sparkles, Copy, Check, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useCallback } from "react";

export default function InstantCloser() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      // Simulate AI response generation
      setIsGenerating(true);
      setTimeout(() => {
        setAiResponse(
          "Hey! Thanks for reaching out 😊 I see you're interested in our Premium plan — great choice! Based on what you've shared, I think the annual option gives you the best value. Want me to set that up for you? I can have everything ready in under 5 minutes. 🚀"
        );
        setIsGenerating(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleCopy = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setAiResponse(null);
    setIsGenerating(false);
  };

  return (
    <div className="glass-card p-5 animate-fade-up delay-5 flex flex-col" id="instant-closer">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 border border-white/5 flex items-center justify-center">
            <Camera className="w-4.5 h-4.5 text-cyan" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/90">
              Instant Closer
            </h2>
            <p className="text-xs text-white/40">Screenshot → AI Response</p>
          </div>
        </div>
        {imagePreview && (
          <button
            onClick={reset}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Drop Zone or Preview */}
      {!imagePreview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`drop-zone flex-1 min-h-[140px] flex flex-col items-center justify-center gap-3 ${
            isDragOver ? "drag-over" : ""
          }`}
          id="screenshot-drop-zone"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-white/20" />
          </div>
          <div className="text-center">
            <p className="text-sm text-white/40">
              Drop a screenshot here
            </p>
            <p className="text-[11px] text-white/20 mt-1">
              or click to browse • PNG, JPG
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {/* Screenshot Preview */}
          <div className="rounded-xl overflow-hidden border border-white/5 max-h-[120px]">
            <img
              src={imagePreview}
              alt="Screenshot preview"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* AI Response */}
          {isGenerating ? (
            <div className="chat-bubble p-4 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-cyan animate-spin" />
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-cyan/40 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 bg-cyan/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 bg-cyan/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
              <span className="text-xs text-white/40">Generating response...</span>
            </div>
          ) : (
            aiResponse && (
              <div className="chat-bubble p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan mt-0.5 shrink-0" />
                  <span className="text-[10px] text-cyan/60 font-medium uppercase tracking-wider">
                    AI Suggested Response
                  </span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {aiResponse}
                </p>
                <button
                  onClick={handleCopy}
                  className="mt-3 glass-pill px-3 py-1.5 flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/80 transition-colors"
                  id="copy-response-btn"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Response
                    </>
                  )}
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
