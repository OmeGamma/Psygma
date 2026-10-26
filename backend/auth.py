import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory or project root
load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv()

import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Set
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "psygma_production_secure_jwt_secret_key_2026_omegamma_wellness_ai_64char"
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24)))

# Blacklist / Revoked token storage for logged out sessions
_revoked_tokens: Set[str] = set()

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Safely hash password using bcrypt with automatic salt."""
    # Bcrypt supports up to 72 bytes
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against bcrypt hash."""
    try:
        plain_bytes = plain_password.encode("utf-8")[:72]
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        return False


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate signed JWT token containing subject, expiration, and unique token ID."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({
        "exp": expire,
        "iat": now,
        "jti": str(uuid.uuid4())
    })
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def revoke_token(token: str) -> None:
    """Mark a token as revoked upon user logout."""
    _revoked_tokens.add(token)


def is_token_revoked(token: str) -> bool:
    """Check if token has been explicitly invalidated by logout."""
    return token in _revoked_tokens


def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate JWT token claims."""
    if is_token_revoked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has been revoked upon logout. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"}
        )
