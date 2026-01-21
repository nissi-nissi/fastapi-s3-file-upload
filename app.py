from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import boto3
import os

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS client
s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_DEFAULT_REGION")  # ✅ FIXED
)

BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

@app.get("/")
def root():
    return {"status": "API running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=file.filename,
            Body=await file.read(),
            ContentType=file.content_type
        )
        return {
            "message": "Upload successful",
            "filename": file.filename
        }
    except Exception as e:
        print("🔥 S3 ERROR:", e)
        return {"error": "Upload failed"}
