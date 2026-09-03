"""
MongoDB Data Layer
---------------------
Uses Motor (async PyMongo) so it fits FastAPI's async endpoints natively.

Design choice — why Mongo over a relational DB here: every project record
is a flat, self-contained document (no real joins needed — cartel/dashboard
views are computed in-process over a small working set, not via SQL joins),
and the schema will keep growing new optional fields (ML scores, forensic
flags, dashboard metadata) as this project matures, which favors a
schemaless document store over migrating a fixed relational schema.

Falls back to the in-memory SAMPLE_PROJECTS_DATABASE automatically when
MONGODB_URI isn't set, so the app still runs standalone with zero setup —
same behaviour as before Mongo was added. Set MONGODB_URI to enable real
persistence.
"""
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("mplads.db")


class ProjectStore:
    """
    Thin async data-access layer. Two backends behind one interface:
    - Mongo (when MONGODB_URI is set and reachable)
    - In-memory list (fallback / zero-setup demo mode)
    """

    def __init__(self):
        self._client = None
        self._collection = None
        self._use_mongo = False
        self._memory_store: List[Dict[str, Any]] = []

    async def connect(self, seed_data: List[Dict[str, Any]]) -> None:
        self._memory_store = list(seed_data)  # always keep this ready as fallback

        if not settings.MONGODB_URI:
            logger.info("MONGODB_URI not set — running in in-memory mode.")
            return

        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            self._client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=3000)
            await self._client.admin.command("ping")
            db = self._client[settings.MONGODB_DB_NAME]
            self._collection = db["projects"]

            count = await self._collection.count_documents({})
            if count == 0:
                await self._collection.insert_many(seed_data)
                logger.info(f"Seeded Mongo with {len(seed_data)} sample projects.")

            self._use_mongo = True
            logger.info("Connected to MongoDB — running in persistent mode.")
        except Exception as e:
            logger.warning(f"MongoDB unavailable ({e}) — falling back to in-memory mode.")
            self._use_mongo = False

    async def list_projects(self) -> List[Dict[str, Any]]:
        if self._use_mongo:
            cursor = self._collection.find({}, {"_id": 0})
            return [doc async for doc in cursor]
        return list(self._memory_store)

    async def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:
        if self._use_mongo:
            return await self._collection.find_one({"project_id": project_id}, {"_id": 0})
        return next((p for p in self._memory_store if p["project_id"] == project_id), None)

    async def insert_projects(self, projects: List[Dict[str, Any]]) -> int:
        if self._use_mongo:
            if not projects:
                return 0
            result = await self._collection.insert_many(projects)
            return len(result.inserted_ids)
        existing_ids = {p["project_id"] for p in self._memory_store}
        new_ones = [p for p in projects if p["project_id"] not in existing_ids]
        self._memory_store.extend(new_ones)
        return len(new_ones)

    @property
    def is_persistent(self) -> bool:
        return self._use_mongo


project_store = ProjectStore()
