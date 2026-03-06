import sys
import os
sys.path.append(os.path.dirname(__file__))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("Creating User Alice...")
response = client.post("/api/users", json={"name": "Alice"})
print("  Status:", response.status_code)
print("  Response:", response.json())
user_id = response.json().get("id")

print("\nCreating Reading (no user)...")
response = client.post("/api/data", json={"pulses": 10, "m3": 1.5})
print("  Status:", response.status_code)
print("  Response:", response.json())

if user_id:
    print(f"\nCreating Reading (with user_id={user_id})...")
    response = client.post("/api/data", json={"user_id": user_id, "pulses": 20, "m3": 3.0})
    print("  Status:", response.status_code)
    print("  Response:", response.json())

print("\nCreating another User (Bob) and Reading...")
response = client.post("/api/users", json={"name": "Bob"})
if "id" in response.json():
    bob_id = response.json()["id"]
    client.post("/api/data", json={"user_id": bob_id, "pulses": 5, "m3": 0.5})

print("\nGetting users usage...")
response = client.get("/api/users/usage")
print("  Status:", response.status_code)
print("  Response:", response.json())
