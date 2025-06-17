import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, request, jsonify, send_from_directory
import csv

# Use environment variable for port, default to 8080 for common deployment platforms
port = int(os.environ.get("PORT", 8080))

# Define static folder relative to the location of main.py
static_folder_path = os.path.join(os.path.dirname(__file__), 'static')
app = Flask(__name__, static_folder=static_folder_path, static_url_path="")

# Define the path for the CSV file relative to main.py
CSV_FILE = os.path.join(os.path.dirname(__file__), "submissions.csv")

@app.route("/")
def index():
    # Serve the main index.html file from the static folder
    return send_from_directory(app.static_folder, "index.html")

@app.route("/submit", methods=["POST"])
def submit_data():
    try:
        data = request.get_json()
        name = data.get("name")
        mobile = data.get("mobile")
        email = data.get("email")
        reaction_time = data.get("reactionTime") # Also capture reaction time

        if not name or not mobile or not email:
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        # Prepare data row
        row = [name, mobile, email, reaction_time]

        # Check if file exists to write header
        file_exists = os.path.isfile(CSV_FILE)

        # Append data to CSV file
        with open(CSV_FILE, mode="a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["Name", "Mobile", "Email", "ReactionTime(s)"]) # Write header
            writer.writerow(row)

        return jsonify({"success": True, "message": "Data saved successfully"})

    except Exception as e:
        print(f"Error saving data: {e}")
        return jsonify({"success": False, "message": "An error occurred"}), 500

# Remove the app.run() block as it's typically handled by the deployment platform (e.g., Gunicorn)

