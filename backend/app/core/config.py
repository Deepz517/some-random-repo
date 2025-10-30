from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    MONGODB_URL: str
    MONGODB_DATABASE: str
    SECRET_KEY: str

    model_config = SettingsConfigDict(env_file=Path(__file__).parent.parent.parent / ".env")

settings = Settings()
