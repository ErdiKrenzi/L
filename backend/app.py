import json
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)

app.config['JSON_AS_ASCII'] = False

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        return super().default(obj)

@app.route("/")
def home():
    return "<h1>🏙️ myLipjan API Server është ONLINE!</h1>"

def get_data(table_name):
    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        data = cursor.fetchall()
        return app.response_class(
            response=json.dumps(data, ensure_ascii=False, cls=DateTimeEncoder),
            status=200,
            mimetype='application/json'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# --- ROUTES EKZISTUESE DHE TË REJA ---
@app.route("/attractions")
def attractions(): return get_data("attractions")

@app.route("/restaurants")
def restaurants(): return get_data("restaurants")

@app.route("/hotels")
def hotels(): return get_data("hotels")

@app.route("/fitness")
def fitness(): return get_data("fitness")

@app.route("/parks")
def parks(): return get_data("parks")

@app.route("/pharmacies")
def pharmacies(): return get_data("pharmacies")

@app.route("/supermarkets")
def supermarkets(): return get_data("supermarkets")

@app.route("/atms")
def atms(): return get_data("atms")

@app.route("/news")
def news(): return get_data("news")

@app.route("/events")
def events(): return get_data("events")

# Pikat e reja për Menunë e Shërbimeve të zgjeruara
@app.route("/healthcare")
def healthcare(): return jsonify([{"id":1, "name": "QKMF Lipjan", "description": "Qendra Kryesore e Mjekësisë Familjare", "location": "Rr. Komandant Kumanova"}])

@app.route("/banks")
def banks(): return jsonify([{"id":1, "name": "TEB Bank", "description": "Dega Lipjan", "location": "Qendër"}])

@app.route("/institutions")
def institutions(): return jsonify([{"id":1, "name": "Komuna e Lipjanit", "description": "Objekti i Administratës Komunale", "location": "Rr. Sheshi i Dëshmorëve"}])

@app.route("/sports")
def sports(): return jsonify([{"id":1, "name": "KV Ulpiana", "description": "Klubi i Volejbollit", "location": "Palestra Sportive Lipjan"}])

@app.route("/education")
def education(): return jsonify([{"id":1, "name": "Gjimnazi Ulpiana", "description": "Shkolla e Mesme e Lartë", "location": "Lipjan"}])

@app.route("/taxis")
def taxis(): return jsonify([{"id":1, "name": "Lipjani Taxi", "description": "Shërbim 24/7", "location": "044-XXX-XXX"}])

@app.route("/bus_lines")
def bus_lines():
    return jsonify([
        {"id": 1, "route": "Lipjan - Prishtinë", "schedule": "Çdo 15 minuta", "price": "1.00 €"},
        {"id": 2, "route": "Lipjan - Magure", "schedule": "Çdo 30 minuta", "price": "0.70 €"},
        {"id": 3, "route": "Lipjan - Janjevë", "schedule": "Katër herë në ditë", "price": "1.00 €"}
    ])

# --- ADMIN POST ENDPOINTS ---
@app.route("/api/add-news", methods=["POST"])
def add_news():
    data = request.json
    db = get_db_connection()
    try:
        cursor = db.cursor()
        sql = "INSERT INTO news (title, description, image) VALUES (%s, %s, %s)"
        cursor.execute(sql, (data['title'], data['description'], data.get('image', '')))
        db.commit()
        return jsonify({"message": "U shtua"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/add-place", methods=["POST"])
def add_place():
    data = request.json
    table_name = data['table']
    allowed_tables = ['restaurants', 'hotels', 'attractions', 'events', 'pharmacies', 'supermarkets', 'atms', 'parks']
    if table_name not in allowed_tables:
        return jsonify({"error": "Kategoria nuk ekziston!"}), 400

    db = get_db_connection()
    try:
        cursor = db.cursor()
        sql = f"INSERT INTO {table_name} (name, description, location, rating, image) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (data['name'], data['description'], data['location'], data.get('rating', '⭐ 5.0'), data.get('image', '')))
        db.commit()
        return jsonify({"message": "U shtua"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)