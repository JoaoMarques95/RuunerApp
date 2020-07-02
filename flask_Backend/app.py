from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DB_URL'] = 'sqlite:///test.db'
db = SQLAlchemy(app)


@app.route("/")
def index():
    return jsonify({
        "api_stuff": "values",
    })


if __name__ == "__main__":
    app.run(debug=True)
