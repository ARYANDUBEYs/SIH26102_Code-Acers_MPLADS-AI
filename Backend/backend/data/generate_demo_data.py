"""
generate_demo_data.py
----------------------
Generates a synthetic MPLADS-style dataset for the MPLAD Sentinel demo.

*** THIS DATA IS 100% SYNTHETIC. IT DOES NOT REPRESENT REAL MPLADS PROJECTS,
    REAL MPs, REAL CONTRACTORS, OR REAL GOVERNMENT RECORDS. ***

The generator intentionally injects several categories of anomalies so the
ML pipeline in ml/ has real signal to detect:

1. Financial anomalies   - expenditure far above/below sanctioned amount
2. Timeline anomalies    - implausibly short or long project durations
3. Duplicate projects    - near-identical descriptions, some geographically
                           close together (potential overlap/double-billing)
4. Contractor concentration - a handful of contractors awarded an unusually
                           high number of projects, sometimes clustered in
                           one district

A fixed random seed (DEFAULT_SEED) makes the output fully reproducible so
demo results are consistent across runs and across teammates' machines.

Run directly to (re)generate data/projects.csv:

    python data/generate_demo_data.py
"""

import os
import random
import string
import datetime as dt
import csv

DEFAULT_SEED = 42

STATES_DISTRICTS = {
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
    "Maharashtra": ["Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
}

# Approximate district centroids (lat, lon) - illustrative, not survey-accurate.
DISTRICT_COORDS = {
    "Lucknow": (26.8467, 80.9462), "Kanpur": (26.4499, 80.3319),
    "Varanasi": (25.3176, 82.9739), "Agra": (27.1767, 78.0081),
    "Meerut": (28.9845, 77.7064),
    "Pune": (18.5204, 73.8567), "Nagpur": (21.1458, 79.0882),
    "Nashik": (19.9975, 73.7898), "Thane": (19.2183, 72.9781),
    "Aurangabad": (19.8762, 75.3433),
    "Chennai": (13.0827, 80.2707), "Coimbatore": (11.0168, 76.9558),
    "Madurai": (9.9252, 78.1198), "Salem": (11.6643, 78.1460),
    "Trichy": (10.7905, 78.7047),
    "Kolkata": (22.5726, 88.3639), "Howrah": (22.5958, 88.2636),
    "Durgapur": (23.5204, 87.3119), "Asansol": (23.6739, 86.9524),
    "Siliguri": (26.7271, 88.3953),
    "Bengaluru": (12.9716, 77.5946), "Mysuru": (12.2958, 76.6394),
    "Hubli": (15.3647, 75.1240), "Mangaluru": (12.9141, 74.8560),
    "Belagavi": (15.8497, 74.4977),
    "Jaipur": (26.9124, 75.7873), "Jodhpur": (26.2389, 73.0243),
    "Udaipur": (24.5854, 73.7125), "Kota": (25.2138, 75.8648),
    "Ajmer": (26.4499, 74.6399),
    "Patna": (25.5941, 85.1376), "Gaya": (24.7955, 85.0002),
    "Bhagalpur": (25.2425, 86.9842), "Muzaffarpur": (26.1225, 85.3906),
    "Darbhanga": (26.1542, 85.8918),
    "Kochi": (9.9312, 76.2673), "Thiruvananthapuram": (8.5241, 76.9366),
    "Kozhikode": (11.2588, 75.7804), "Thrissur": (10.5276, 76.2144),
    "Kollam": (8.8932, 76.6141),
}

CATEGORIES = [
    "Drinking Water", "Road Construction", "Community Hall",
    "School Infrastructure", "Healthcare Facility", "Electrification",
    "Sanitation", "Irrigation", "Sports Infrastructure", "Library",
]

CATEGORY_TEMPLATES = {
    "Drinking Water": [
        "Installation of drinking water supply system in {village}",
        "Borewell and handpump installation for {village}",
        "Overhead water tank construction in {village}",
    ],
    "Road Construction": [
        "Construction of concrete road from {village} to main highway",
        "Repair and widening of village road in {village}",
        "Construction of link road connecting {village}",
    ],
    "Community Hall": [
        "Construction of Community Hall in {village}",
        "Construction of Community Centre in {village}",
        "Building of village community hall at {village}",
    ],
    "School Infrastructure": [
        "Construction of additional classrooms at Government School, {village}",
        "Renovation of primary school building in {village}",
        "Construction of school boundary wall in {village}",
    ],
    "Healthcare Facility": [
        "Construction of Primary Health Sub-Centre in {village}",
        "Upgradation of health centre facilities in {village}",
        "Construction of dispensary building in {village}",
    ],
    "Electrification": [
        "Installation of solar street lights in {village}",
        "Rural electrification work in {village}",
        "Installation of high-mast lighting in {village}",
    ],
    "Sanitation": [
        "Construction of public toilet complex in {village}",
        "Construction of community sanitation block in {village}",
        "Drainage system construction in {village}",
    ],
    "Irrigation": [
        "Construction of irrigation canal near {village}",
        "Check dam construction for irrigation in {village}",
        "Installation of irrigation pump sets in {village}",
    ],
    "Sports Infrastructure": [
        "Construction of village playground in {village}",
        "Development of sports ground with boundary wall in {village}",
        "Construction of open gymnasium in {village}",
    ],
    "Library": [
        "Construction of village public library in {village}",
        "Setting up of reading room and library in {village}",
        "Renovation of panchayat library building in {village}",
    ],
}

VILLAGE_PREFIXES = [
    "Rampur", "Sundarpur", "Krishnapur", "Shivnagar", "Ganeshpur", "Lakshmipur",
    "Bhagwanpur", "Devipur", "Narayanpur", "Ramganj", "Chandpur", "Vijaynagar",
    "Anandpur", "Gopalpur", "Mahadevpur", "Saraswatipur", "Indranagar", "Balrampur",
    "Fatehpur", "Nehrunagar", "Ashoknagar", "Subhaspur", "Gandhinagar", "Tagorepur",
]

CONTRACTOR_POOL_NORMAL = [
    f"{name} {suffix}"
    for name in ["Shree", "Om", "National", "United", "Bharat", "Sundar", "Prime",
                 "Rajdhani", "Vishwakarma", "Ganga", "Metro", "Skyline", "Apex",
                 "Reliable", "Cityscape", "Modern", "Highway", "Progressive"]
    for suffix in ["Construction Co.", "Builders", "Infra Ltd.", "Engineering Works"]
]

# Base cost per unit "size" for each category (used to make expenditure realistic)
CATEGORY_BASE_COST = {
    "Drinking Water": 800_000,
    "Road Construction": 2_200_000,
    "Community Hall": 1_500_000,
    "School Infrastructure": 1_800_000,
    "Healthcare Facility": 2_500_000,
    "Electrification": 600_000,
    "Sanitation": 700_000,
    "Irrigation": 1_900_000,
    "Sports Infrastructure": 1_100_000,
    "Library": 900_000,
}

CATEGORY_TYPICAL_DURATION_DAYS = {
    "Drinking Water": 120,
    "Road Construction": 210,
    "Community Hall": 180,
    "School Infrastructure": 150,
    "Healthcare Facility": 240,
    "Electrification": 90,
    "Sanitation": 100,
    "Irrigation": 200,
    "Sports Infrastructure": 130,
    "Library": 110,
}


def _random_date(rng, start_year=2019, end_year=2024):
    start = dt.date(start_year, 1, 1)
    end = dt.date(end_year, 12, 31)
    delta_days = (end - start).days
    return start + dt.timedelta(days=rng.randint(0, delta_days))


def _jitter_coords(rng, lat, lon, spread=0.15):
    return (
        round(lat + rng.uniform(-spread, spread), 6),
        round(lon + rng.uniform(-spread, spread), 6),
    )


def generate_projects(n_projects=800, seed=DEFAULT_SEED):
    """
    Generate a list of dict rows representing MPLADS-style projects,
    with deterministic injected anomalies.

    Returns: list[dict]
    """
    rng = random.Random(seed)
    rows = []

    # Build a pool of (state, district) pairs
    state_district_pairs = [
        (state, district)
        for state, districts in STATES_DISTRICTS.items()
        for district in districts
    ]

    # Pick a small set of contractors who will be "over-concentrated" (anomalous)
    suspicious_contractors = [
        "Shree Balaji Infra Pvt Ltd",
        "Rapid Nation Builders",
        "SuperFast Construction Co.",
    ]
    all_contractors = CONTRACTOR_POOL_NORMAL + suspicious_contractors

    project_counter = 1

    def next_project_id():
        nonlocal project_counter
        pid = f"MPL-{project_counter:05d}"
        project_counter += 1
        return pid

    # ---- helper to build one base (non-anomalous) project row -----------
    def make_base_project(state=None, district=None, category=None,
                           contractor=None, village=None):
        state, district = (state, district) if state and district else rng.choice(state_district_pairs)
        category = category or rng.choice(CATEGORIES)
        village = village or f"{rng.choice(VILLAGE_PREFIXES)}"
        template = rng.choice(CATEGORY_TEMPLATES[category])
        description = template.format(village=village)
        project_name = description

        base_lat, base_lon = DISTRICT_COORDS[district]
        lat, lon = _jitter_coords(rng, base_lat, base_lon)

        base_cost = CATEGORY_BASE_COST[category]
        size_factor = rng.uniform(0.6, 1.6)
        sanctioned = round(base_cost * size_factor, 2)

        # Normal expenditure ratio: 0.85 - 1.05 of sanctioned amount
        expenditure_ratio = rng.uniform(0.85, 1.05)
        actual_expenditure = round(sanctioned * expenditure_ratio, 2)

        typical_duration = CATEGORY_TYPICAL_DURATION_DAYS[category]
        duration_days = int(rng.gauss(typical_duration, typical_duration * 0.15))
        duration_days = max(30, duration_days)

        start_date = _random_date(rng)
        completion_date = start_date + dt.timedelta(days=duration_days)

        contractor = contractor or rng.choice(all_contractors)
        reported_progress = round(rng.uniform(85, 100), 1)

        return {
            "project_id": next_project_id(),
            "project_name": project_name,
            "description": description,
            "state": state,
            "district": district,
            "latitude": lat,
            "longitude": lon,
            "category": category,
            "sanctioned_amount": sanctioned,
            "actual_expenditure": actual_expenditure,
            "start_date": start_date.isoformat(),
            "completion_date": completion_date.isoformat(),
            "contractor": contractor,
            "reported_progress": reported_progress,
            "image_path": f"/static/demo_images/{category.lower().replace(' ', '_')}_placeholder.jpg",
        }

    # ---- 1. Generate the bulk of NORMAL projects -------------------------
    n_normal = int(n_projects * 0.82)
    for _ in range(n_normal):
        rows.append(make_base_project())

    # ---- 2. Inject FINANCIAL anomalies (over/under spend) -----------------
    n_financial_anomalies = int(n_projects * 0.05)
    for _ in range(n_financial_anomalies):
        row = make_base_project()
        if rng.random() < 0.7:
            # Massive overspend vs sanctioned amount
            row["actual_expenditure"] = round(row["sanctioned_amount"] * rng.uniform(1.6, 2.8), 2)
        else:
            # Suspiciously low spend despite being marked "complete"
            row["actual_expenditure"] = round(row["sanctioned_amount"] * rng.uniform(0.25, 0.45), 2)
        rows.append(row)

    # ---- 3. Inject TIMELINE anomalies (too fast / too slow) ---------------
    n_timeline_anomalies = int(n_projects * 0.05)
    for _ in range(n_timeline_anomalies):
        row = make_base_project()
        start = dt.date.fromisoformat(row["start_date"])
        if rng.random() < 0.6:
            # Implausibly fast completion (e.g., a health centre in 10 days)
            fast_days = rng.randint(5, 20)
            row["completion_date"] = (start + dt.timedelta(days=fast_days)).isoformat()
        else:
            # Excessively delayed project
            slow_days = rng.randint(900, 1600)
            row["completion_date"] = (start + dt.timedelta(days=slow_days)).isoformat()
        rows.append(row)

    # ---- 4. Inject DUPLICATE / overlapping projects -----------------------
    n_duplicate_pairs = int(n_projects * 0.04)
    for _ in range(n_duplicate_pairs):
        state, district = rng.choice(state_district_pairs)
        category = rng.choice(list(CATEGORY_TEMPLATES.keys()))
        village = rng.choice(VILLAGE_PREFIXES)

        templates = CATEGORY_TEMPLATES[category]
        template_a = templates[0]
        template_b = templates[1] if len(templates) > 1 else templates[0]

        original = make_base_project(state=state, district=district, category=category, village=village)
        original["project_name"] = template_a.format(village=village)
        original["description"] = original["project_name"]
        rows.append(original)

        duplicate = make_base_project(state=state, district=district, category=category, village=village)
        duplicate["project_name"] = template_b.format(village=village)
        duplicate["description"] = duplicate["project_name"]
        # Place the duplicate geographically very close to the original (within ~1km)
        duplicate["latitude"], duplicate["longitude"] = _jitter_coords(
            rng, original["latitude"], original["longitude"], spread=0.008
        )
        # Often a different contractor claiming an overlapping scope of work
        duplicate["contractor"] = rng.choice(all_contractors)
        rows.append(duplicate)

    # ---- 5. Inject CONTRACTOR CONCENTRATION anomalies ----------------------
    # A few contractors get an unusually large share of projects,
    # sometimes concentrated in a single district.
    concentrated_district = rng.choice(state_district_pairs)
    for i, contractor in enumerate(suspicious_contractors):
        n_awarded = rng.randint(35, 70)
        for _ in range(n_awarded):
            if i == 0:
                # This contractor is concentrated in ONE specific district
                row = make_base_project(state=concentrated_district[0],
                                         district=concentrated_district[1],
                                         contractor=contractor)
            else:
                row = make_base_project(contractor=contractor)
            rows.append(row)

    rng.shuffle(rows)
    return rows


def save_to_csv(rows, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fieldnames = list(rows[0].keys())
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


if __name__ == "__main__":
    OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "projects.csv")
    data = generate_projects(n_projects=800, seed=DEFAULT_SEED)
    save_to_csv(data, OUTPUT_PATH)
    print(f"[generate_demo_data] Generated {len(data)} SYNTHETIC projects -> {OUTPUT_PATH}")
    print("[generate_demo_data] Reminder: this dataset is entirely synthetic demo data.")
