document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("student-form");
  const tableBody = document.querySelector("#student-table tbody");

  function loadStudents() {
    fetch("/students")
      .then((res) => res.json())
      .then((data) => {
        tableBody.innerHTML = "";
        data.forEach((student) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${student.id}</td>
              <td><input value="${student.name}" data-id="${student.id}" data-field="name"/></td>
              <td><input value="${student.age}" data-id="${student.id}" data-field="age"/></td>
              <td><input value="${student.grade}" data-id="${student.id}" data-field="grade"/></td>
              <td>
                <button onclick="updateStudent(${student.id})">Update</button>
                <button onclick="deleteStudent(${student.id})" style="background-color:red;">Delete</button>
              </td>
            `;
          tableBody.appendChild(row);
        });
      });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const grade = document.getElementById("grade").value;

    fetch("/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age, grade }),
    }).then(() => {
      form.reset();
      loadStudents();
    });
  });

  window.updateStudent = (id) => {
    const name = document.querySelector(
      `input[data-id="${id}"][data-field="name"]`
    ).value;
    const age = document.querySelector(
      `input[data-id="${id}"][data-field="age"]`
    ).value;
    const grade = document.querySelector(
      `input[data-id="${id}"][data-field="grade"]`
    ).value;

    fetch(`/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age, grade }),
    }).then(loadStudents);
  };

  window.deleteStudent = (id) => {
    fetch(`/students/${id}`, {
      method: "DELETE",
    }).then(loadStudents);
  };

  loadStudents();
});

document.getElementById("refresh-btn").addEventListener("click", () => {
  loadStudents();
});
