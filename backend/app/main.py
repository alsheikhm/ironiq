from fastapi import FastAPI

app = FastAPI(title="IronIQ API")


@app.get("/health")
def health_check():
    return {"status": "ok"}