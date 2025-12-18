from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import boto3
import os
from botocore.exceptions import ClientError

app = FastAPI()

# -----------------------------
# Serve Frontend (STATIC FILES)
# -----------------------------
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def serve_frontend():
    return FileResponse("static/index.html")

# -----------------------------
# AWS CONFIG (from ENV VARS)
# -----------------------------
S3_BUCKET = os.getenv("S3_BUCKET")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=AWS_REGION
)

# -----------------------------
# ALLOWED FILE TYPES
# -----------------------------
ALLOWED_EXTENSIONS = {".csv", ".xls", ".xlsx"}

# -----------------------------
# UPLOAD ENDPOINT
# -----------------------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only CSV, XLS, XLSX files are allowed"
        )

    try:
        s3.upload_fileobj(
            file.file,
            S3_BUCKET,
            file.filename,
            ExtraArgs={"ContentType": file.content_type}
        )
    except ClientError as e:
        print("🔥 S3 ERROR:", e)
        raise HTTPException(status_code=500, detail="S3 upload failed")

    return JSONResponse({
        "filename": file.filename,
        "message": "Upload successful"
    })
