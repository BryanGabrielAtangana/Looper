"use client";
import {
  Plus,
  UploadCloud,
  Check,
  Play,
  X,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import AnalysisResults from "./analysis-result";

const Uploads: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [hasDescription, setHasDescription] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showUploadSection, setShowUploadSection] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent background scrolling when modal is open.
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  // When analysis results are available, auto-collapse the upload section.
  useEffect(() => {
    if (analysisResults) {
      setShowUploadSection(false);
    }
  }, [analysisResults]);

  const handleFileChange = async (file: File | null) => {
    setError("");
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFile(file);
    } catch (err) {
      setError("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleStartLoop = async () => {
    if (!file || !description.trim()) {
      setError("Both CV and job description are required");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("job_description", description.trim());

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      setAnalysisResults(data);
      console.log("Analysis results:", data);
    } catch (err: any) {
      console.error("Error details:", err);
      setError(err?.message || "Failed to analyze. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const canStartLoop = file && hasDescription;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Toggle button appears when analysis results are available */}
      {analysisResults && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowUploadSection(!showUploadSection)}
            className="flex items-center text-sm text-looperBlack hover:underline focus:outline-none"
          >
            {showUploadSection ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                <span>Hide Upload Options</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                <span>Show Upload Options</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Upload Section with smooth toggle */}
      {showUploadSection && (
        <div className="transition-all duration-300 ease-in-out">
          <div className="bg-looper1 w-full p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl text-looperBlack font-semibold mb-2">
                  Upload your CV and add a job description
                </h2>
                <p className="text-sm text-black/50">
                  Supported formats: PDF (max 10MB)
                </p>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div
                className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
                  isDragging
                    ? "border-looperBlack bg-gray-50"
                    : "border-black/20"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileChange(file);
                  }}
                  accept=".pdf"
                  className="hidden"
                />
                <div className="text-center">
                  <UploadCloud
                    size={32}
                    className="mx-auto mb-4 text-gray-50"
                  />
                  <p className="mb-2 text-sm text-gray-600">
                    Drag and drop your CV here, or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-looperBlack hover:underline focus:outline-none"
                    >
                      browse
                    </button>
                  </p>
                  {file && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <p className="font-medium">{file.name}</p>
                      <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full p-4 rounded-xl text-white transition-colors ${
                    hasDescription
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#6F6652] hover:bg-[#5d5544]"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {hasDescription ? (
                      <>
                        <Check size={20} />
                        <span>Description Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span>Add Job Description</span>
                      </>
                    )}
                  </div>
                </button>

                <button
                  onClick={handleStartLoop}
                  disabled={!canStartLoop || isUploading}
                  className={`w-full p-4 rounded-xl text-white transition-colors ${
                    canStartLoop
                      ? "bg-looperBlack hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isUploading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Play size={20} />
                        <span>Start the Loop</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Job Description */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-2xl transform transition-transform duration-300"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Job Description</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-64 p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-looperBlack"
                placeholder="Enter the job description here..."
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (description.trim()) {
                      setHasDescription(true);
                      setIsModalOpen(false);
                    }
                  }}
                  disabled={!description.trim()}
                  className={`px-6 py-2 rounded-lg focus:outline-none ${
                    description.trim()
                      ? "bg-looperBlack text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Container with overflow handling */}
      <div className="transition-opacity duration-300 max-h-[70vh] overflow-y-auto">
        {analysisResults && <AnalysisResults data={analysisResults} />}
      </div>
    </div>
  );
};

export default Uploads;
