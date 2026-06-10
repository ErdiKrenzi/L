from flask import Flask, jsonify
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Lipjan City Guide API"


def get_data(table_name):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)


@app.route("/attractions")
def attractions():
    return get_data("attractions")


@app.route("/restaurants")
def restaurants():
    return get_data("restaurants")


@app.route("/hotels")
def hotels():
    return get_data("hotels")


@app.route("/fitness")
def fitness():
    return get_data("fitness")


@app.route("/parks")
def parks():
    return get_data("parks")


@app.route("/pharmacies")
def pharmacies():
    return get_data("pharmacies")


@app.route("/supermarkets")
def supermarkets():
    return get_data("supermarkets")


@app.route("/atms")
def atms():
    return get_data("atms")


@app.route("/news")
def news():
    return get_data("news")


@app.route("/events")
def events():
    return get_data("events")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)