// Get elements
const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('studentName');
const idInput = document.getElementById('studentId');
const emailInput = document.getElementById('email');
const contactInput = document.getElementById('contact');
const errorMsg = document.getElementById('errorMsg');
const studentsBody = document.getElementById('studentsBody');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const tableWrapper = document.getElementById('tableWrapper');

let students = [];
let editIndex = null;

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('students');
  if (stored) {
    students = JSON.parse(stored);
    renderTable();
  }
});

// Form submit (Add)
studentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateInputs()) return;

  const newStudent = {
    name: nameInput.value.trim(),
    id: idInput.value.trim(),
    email: emailInput.value.trim(),
    contact: contactInput.value.trim()
  };

  students.push(newStudent);
  saveAndRender();
  studentForm.reset();
});

// Update button (Edit existing)
updateBtn.addEventListener('click', () => {
  if (editIndex === null) return;
  if (!validateInputs()) return;

  students[editIndex] = {
    name: nameInput.value.trim(),
    id: idInput.value.trim(),
    email: emailInput.value.trim(),
    contact: contactInput.value.trim()
  };

  saveAndRender();
  resetEditState();
});

// Cancel edit
cancelEditBtn.addEventListener('click', resetEditState);

// Validation function
function validateInputs() {
  const nameVal = nameInput.value.trim();
  const idVal = idInput.value.trim();
  const emailVal = emailInput.value.trim();
  const contactVal = contactInput.value.trim();

  // Make sure nothing is empty
  if (!nameVal || !idVal || !emailVal || !contactVal) {
    errorMsg.textContent = 'All fields are required.';
    return false;
  }

  // Name: only characters and spaces
  const namePattern = /^[A-Za-z\s]+$/;
  if (!namePattern.test(nameVal)) {
    errorMsg.textContent = 'Student name must contain only letters and spaces.';
    return false;
  }

  // ID: only digits
  const idPattern = /^[0-9]+$/;
  if (!idPattern.test(idVal)) {
    errorMsg.textContent = 'Student ID must contain only numbers.';
    return false;
  }

  // Email: simple pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailVal)) {
    errorMsg.textContent = 'Please enter a valid email address.';
    return false;
  }

  // Contact: digits only, at least 10 digits
  const contactPattern = /^[0-9]{10,}$/;
  if (!contactPattern.test(contactVal)) {
    errorMsg.textContent = 'Contact number must be at least 10 digits and numeric.';
    return false;
  }

  errorMsg.textContent = '';
  return true;
}

// Save to localStorage and render table
function saveAndRender() {
  localStorage.setItem('students', JSON.stringify(students));
  renderTable();
}

// Render table rows
function renderTable() {
  studentsBody.innerHTML = '';

  students.forEach((student, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.id}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td>
        <div class="actions-btn">
          <button type="button" onclick="editStudent(${index})">Edit</button>
          <button type="button" class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
        </div>
      </td>
    `;

    studentsBody.appendChild(tr);
  });

  // Add vertical scrollbar dynamically (already set via CSS max-height + overflow-y)
  // You can also adjust height based on number of rows dynamically here if needed.
}

// Edit student (called from inline onclick)
window.editStudent = function(index) {
  const student = students[index];
  nameInput.value = student.name;
  idInput.value = student.id;
  emailInput.value = student.email;
  contactInput.value = student.contact;

  editIndex = index;
  submitBtn.classList.add('hidden');
  updateBtn.classList.remove('hidden');
  cancelEditBtn.classList.remove('hidden');
};

// Delete student (called from inline onclick)
window.deleteStudent = function(index) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  students.splice(index, 1);
  saveAndRender();
};

// Reset edit state
function resetEditState() {
  editIndex = null;
  studentForm.reset();
  errorMsg.textContent = '';
  submitBtn.classList.remove('hidden');
  updateBtn.classList.add('hidden');
  cancelEditBtn.classList.add('hidden');
}