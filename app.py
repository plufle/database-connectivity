from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="plufle@123",
    database="student_db"
)
cursor = conn.cursor(dictionary=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/students", methods=["GET"])
def get_students():
    cursor.execute("SELECT * FROM students")
    return jsonify(cursor.fetchall())

@app.route("/students", methods=["POST"])
def add_student():
    data = request.json
    cursor.execute("INSERT INTO students (name, age, grade) VALUES (%s, %s, %s)",
                   (data["name"], data["age"], data["grade"]))
    conn.commit()
    return jsonify({"message": "Student added"}), 201

@app.route("/students/<int:id>", methods=["PUT"])
def update_student(id):
    data = request.json
    cursor.execute("UPDATE students SET name=%s, age=%s, grade=%s WHERE id=%s",
                   (data["name"], data["age"], data["grade"], id))
    conn.commit()
    return jsonify({"message": "Student updated"})

@app.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    cursor.execute("DELETE FROM students WHERE id=%s", (id,))
    conn.commit()
    return jsonify({"message": "Student deleted"})

if __name__ == "__main__":
    app.run(debug=True)
