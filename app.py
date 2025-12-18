from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, HTTPException
import boto3
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 🔴 CHANGE THIS TO YOUR REAL BUCKET NAME
S3_BUCKET = "my-fastapi-upload-bucket"

AWS_REGION = os.getenv("AWS_DEFAULT_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=AWS_REGION,
)

ALLOWED_EXTENSIONS = {".csv", ".xls", ".xlsx"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type")

    try:
        s3.upload_fileobj(
            file.file,
            S3_BUCKET,
            file.filename,
            ExtraArgs={"ContentType": file.content_type},
        )
    except Exception as e:
        print("🔥 S3 ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "filename": file.filename,
        "message": "Upload successful",
    }
