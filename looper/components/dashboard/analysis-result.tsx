import React from "react";
import { Award, AlertCircle, TrendingUp } from "lucide-react";

interface AnalysisResultsProps {
  data: {
    matches: number;
    strengths: string[];
    improvement_areas: string[];
    skills_gap: string[];
  };
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Analysis Results
          </h2>
          <p className="text-gray-500">CV and job description match analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-4xl font-bold text-green-600">
            {data.matches}%
          </div>
          <div className="text-sm text-gray-500">Match Rate</div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white">
          <div className="flex items-center gap-2 text-lg font-semibold mb-2">
            <Award className="w-5 h-5 text-green-600" />
            Strengths
          </div>
          <ul className="space-y-2">
            {data.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 mt-2 rounded-full bg-green-500" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Areas for Improvement Card */}
          <div className="border border-amber-300 rounded-lg shadow-sm p-4 bg-amber-50">
            <div className="flex items-center gap-2 text-lg font-semibold mb-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Areas for Improvement
            </div>
            <ul className="space-y-2">
              {data.improvement_areas.map((area, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-amber-500" />
                  <span className="text-sm">{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Gap Card */}
          <div className="border border-blue-300 rounded-lg shadow-sm p-4 bg-blue-50">
            <div className="flex items-center gap-2 text-lg font-semibold mb-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Skills Gap
            </div>
            {data.skills_gap.length > 0 ? (
              <ul className="space-y-2">
                {data.skills_gap.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500" />
                    <span className="text-sm">{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">
                No significant skills gaps identified
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
