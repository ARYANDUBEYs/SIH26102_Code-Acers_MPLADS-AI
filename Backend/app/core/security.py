"""
Cryptographic Security & Authentication Engine
---------------------------------------------
Implements NIST SP 800-63B standard password protection:
- Algorithm: PBKDF2-HMAC-SHA256
- Iteration count: 100,000 rounds
- Salt: 16-byte cryptographically secure random salt (secrets.token_hex(16))
- Timing-attack mitigation: hmac.compare_digest
- Ephemeral password reset tokens with time-bound expiration
"""
import hashlib
import hmac
import secrets
import time
from typing import Dict, Optional, Tuple

PBKDF2_ITERATIONS = 100000
RESET_TOKEN_EXPIRY_SECONDS = 3600  # 1 hour


def hash_password(password: str) -> str:
    """Hashes a password using PBKDF2-HMAC-SHA256 with a unique random salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS
    )
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored hash in constant time."""
    try:
        parts = hashed_password.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt = parts[2]
        expected_hex = parts[3]

        key = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            iterations
        )
        return hmac.compare_digest(key.hex(), expected_hex)
    except Exception:
        return False


# Token storage with timestamp tracking
class TokenSecurityStore:
    def __init__(self):
        # reset_token -> {"email": str, "expires_at": float}
        self._reset_tokens: Dict[str, Dict[str, float]] = {}
        # session_token -> {"email": str, "role": str, "expires_at": float}
        self._sessions: Dict[str, Dict[str, any]] = {}

    def generate_reset_token(self, email: str) -> str:
        """Generates a high-entropy URL-safe password reset token."""
        token = f"rst_{secrets.token_urlsafe(32)}"
        self._reset_tokens[token] = {
            "email": email.strip().lower(),
            "expires_at": time.time() + RESET_TOKEN_EXPIRY_SECONDS
        }
        return token

    def verify_reset_token(self, token: str) -> Optional[str]:
        """Validates token presence and expiration, returning the associated email."""
        record = self._reset_tokens.get(token)
        if not record:
            return None
        if time.time() > record["expires_at"]:
            del self._reset_tokens[token]
            return None
        return record["email"]

    def consume_reset_token(self, token: str) -> bool:
        """Invalidates a reset token after single-use."""
        if token in self._reset_tokens:
            del self._reset_tokens[token]
            return True
        return False

    def create_session(self, email: str, role: str) -> str:
        """Issues an authenticated session token."""
        token = f"mplads_auth_{secrets.token_urlsafe(24)}"
        self._sessions[token] = {
            "email": email,
            "role": role,
            "expires_at": time.time() + 86400  # 24 hours
        }
        return token


token_store = TokenSecurityStore()

# Seed default government officer accounts with PBKDF2-hashed credentials
SEED_CREDENTIALS: Dict[str, Dict[str, any]] = {
    "admin.mospi@gov.in": {
        "name": "Dr. Rajeshwar Sharma",
        "role": "MOSPI_ADMIN",
        "badge": "Central MoSPI Director",
        "hashed_password": hash_password("Admin@MPLADS2026"),
        "department": "Ministry of Statistics and Programme Implementation"
    },
    "collector.varanasi@gov.in": {
        "name": "Priyanka Verma, IAS",
        "role": "DISTRICT_OFFICER",
        "badge": "District Magistrate (Varanasi)",
        "hashed_password": hash_password("Varanasi@DM2026"),
        "department": "District Collectorate, Varanasi"
    },
    "citizen.patel@gmail.com": {
        "name": "Amit Patel",
        "role": "CITIZEN",
        "badge": "Verified Citizen Auditor",
        "hashed_password": hash_password("Citizen@Gov2026"),
        "department": "Public Vigilance Cell"
    }
}
