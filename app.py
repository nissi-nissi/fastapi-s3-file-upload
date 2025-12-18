from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import boto3, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

S3_BUCKET = "your-bucket-name"
AWS_REGION = os.getenv("AWS_DEFAULT_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=AWS_REGION,
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    s3.upload_fileobj(file.file, S3_BUCKET, file.filename)
    return {"message": "Upload successful"}
