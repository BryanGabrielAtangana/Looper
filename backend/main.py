from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import pdfplumber
import json
import httpx
import io
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobDescription(BaseModel):
    text: str

class ProcessingResponse(BaseModel):
    matches: float
    skills_gap: list[str]
    strengths: list[str]
    improvement_areas: list[str]

async def extract_text_from_pdf(file: bytes) -> str:
    pdf_file = io.BytesIO(file)
    try:
        text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    page_text = re.sub(r'[^\x00-\x7F]+', '', page_text)
                    text += page_text + " "
        
        text = text.strip()
        if not text:
            raise ValueError("PDF file contains no extractable text")
        return text
    except Exception as e:
        raise ValueError(f"Error extracting text from PDF: {str(e)}")

async def analyze_with_ollama(cv_text: str, job_desc: str) -> Dict:
    cv_text = re.sub(r'\s+', ' ', cv_text).strip()
    job_desc = re.sub(r'\s+', ' ', job_desc).strip()
    
    prompt = prompt = """
    Analyze the following CV against the provided job description with absolute objectivity and candor. Evaluate all hard and soft skills, experience, and qualifications without any sugarcoating. Be direct and unambiguous in your assessment.

    Your analysis must include:
    1. **match_percentage**: A clear numeric rating (0–100) reflecting the overall fit of the CV to the job description.
    2. **skills_gap**: A list of specific skills or qualifications that the candidate is missing or underdeveloped relative to the job requirements.
    3. **strengths**: A list of areas where the candidate’s experience, skills, or qualifications stand out as a strong match for the role.
    4. **improvement_areas**: A list of critical areas where the candidate falls short compared to the job description.

    Return your analysis as a single JSON object in the following format:

    {
        "match_percentage": number,
        "skills_gap": [ "string1", "string2" ],
        "strengths": [ "string1", "string2" ],
        "improvement_areas": [ "string1", "string2" ]
    }

    CV: %s

    Job Description: %s
    """% (cv_text, job_desc)
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "gemma2:2b",
                    "prompt": prompt,
                    "format": "json",
                    "stream": False
                },
                timeout=30.0
            )
            
            raw_response = response.json()["response"]
            
            # Find the first valid JSON object in the response
            json_start = raw_response.find('{')
            json_end = raw_response.rfind('}') + 1
            if json_start == -1 or json_end == 0:
                raise ValueError("No JSON object found in response")
                
            json_str = raw_response[json_start:json_end]
            parsed_result = json.loads(json_str)
            
            # Validate and sanitize the response
            return {
                "match_percentage": float(parsed_result.get("match_percentage", 0)),
                "skills_gap": list(parsed_result.get("skills_gap", [])),
                "strengths": list(parsed_result.get("strengths", [])),
                "improvement_areas": list(parsed_result.get("improvement_areas", []))
            }
            
        except (json.JSONDecodeError, KeyError) as e:
            raise ValueError(f"Invalid response format: {str(e)}")
        except httpx.TimeoutException:
            raise ValueError("Analysis service timed out")

@app.post("/analyze", response_model=ProcessingResponse)
async def analyze_documents(
    cv: UploadFile,
    job_description: str = Form(...)
):
    try:
        if cv.content_type != "application/pdf":
            raise HTTPException(status_code=422, detail="Uploaded file must be a PDF")

        cv_content = await cv.read()
        if not cv_content:
            raise HTTPException(status_code=422, detail="Uploaded PDF file is empty")

        cv_text = await extract_text_from_pdf(cv_content)
        if not job_description.strip():
            raise HTTPException(status_code=422, detail="Job description cannot be empty")

        analysis = await analyze_with_ollama(cv_text, job_description)

        return ProcessingResponse(
            matches=analysis["match_percentage"],
            skills_gap=analysis["skills_gap"],
            strengths=analysis["strengths"],
            improvement_areas=analysis["improvement_areas"]
        )

    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")