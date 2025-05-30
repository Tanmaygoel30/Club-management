// Admin credentials (in a real application, this would be handled server-side)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

// Storage keys
const STORAGE_KEY = "enrolledStudents";
const AUTH_KEY = "adminAuthenticated";

// DOM Elements
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const adminLoginForm = document.getElementById("adminLoginForm");
const logoutBtn = document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchEnrollments");
const clubFilter = document.getElementById("clubFilter");
const exportBtn = document.getElementById("exportBtn");
const enrollmentsTableBody = document.getElementById("enrollmentsTableBody");

// Check if admin is already logged in
function checkAuth() {
  const isAuthenticated = localStorage.getItem(AUTH_KEY) === "true";
  loginSection.classList.toggle("hidden", isAuthenticated);
  dashboardSection.classList.toggle("hidden", !isAuthenticated);
  if (isAuthenticated) {
    loadDashboard();
  }
}

// Login handler
adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    localStorage.setItem(AUTH_KEY, "true");
    checkAuth();
    adminLoginForm.reset();
  } else {
    alert("Invalid credentials. Please try again.");
  }
});

// Logout handler
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(AUTH_KEY);
  checkAuth();
});

// Load dashboard data
function loadDashboard() {
  const enrollments = getEnrollments();
  updateStats(enrollments);
  displayEnrollments(enrollments);
}

// Get enrollments from localStorage
function getEnrollments() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// Update dashboard statistics
function updateStats(enrollments) {
  const totalEnrollments = document.getElementById("totalEnrollments");
  const activeClubs = document.getElementById("activeClubs");

  totalEnrollments.textContent = enrollments.length;

  // Count unique clubs
  const uniqueClubs = new Set(enrollments.map((e) => e.club));
  activeClubs.textContent = uniqueClubs.size;
}

// Display enrollments in table
function displayEnrollments(enrollments) {
  enrollmentsTableBody.innerHTML = "";

  enrollments.forEach((enrollment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${enrollment.enrollmentId || "N/A"}</td>
            <td>${enrollment.fullName}</td>
            <td>${enrollment.studentId}</td>
            <td>${enrollment.email}</td>
            <td>${formatClubName(enrollment.club)}</td>
            <td>${enrollment.year}</td>
            <td>${formatDate(enrollment.enrollmentDate)}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editEnrollment('${
                  enrollment.enrollmentId
                }')">Edit</button>
                <button class="delete-btn" onclick="deleteEnrollment('${
                  enrollment.enrollmentId
                }')">Delete</button>
            </td>
        `;
    enrollmentsTableBody.appendChild(row);
  });
}

// Format club name
function formatClubName(club) {
  return club.charAt(0).toUpperCase() + club.slice(1) + " Club";
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
}

// Search functionality
searchInput.addEventListener("input", filterEnrollments);
clubFilter.addEventListener("change", filterEnrollments);

function filterEnrollments() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedClub = clubFilter.value;
  const enrollments = getEnrollments();

  const filtered = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.fullName.toLowerCase().includes(searchTerm) ||
      enrollment.studentId.toLowerCase().includes(searchTerm);

    const matchesClub = !selectedClub || enrollment.club === selectedClub;

    return matchesSearch && matchesClub;
  });

  displayEnrollments(filtered);
}

// Export to CSV
exportBtn.addEventListener("click", () => {
  const enrollments = getEnrollments();
  const csvContent = convertToCSV(enrollments);
  downloadCSV(csvContent);
});

function convertToCSV(enrollments) {
  const headers = [
    "Enrollment ID",
    "Name",
    "Student ID",
    "Email",
    "Club",
    "Year",
    "Enrollment Date",
  ];
  const rows = enrollments.map((e) => [
    e.enrollmentId,
    e.fullName,
    e.studentId,
    e.email,
    formatClubName(e.club),
    e.year,
    formatDate(e.enrollmentDate),
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

function downloadCSV(csvContent) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `club_enrollments_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.click();
}

// Edit enrollment
function editEnrollment(enrollmentId) {
  const enrollments = getEnrollments();
  const enrollment = enrollments.find((e) => e.enrollmentId === enrollmentId);

  if (!enrollment) return;

  // Create edit form
  const row = event.target.closest("tr");
  const oldContent = row.innerHTML;

  row.innerHTML = `
        <td>${enrollment.enrollmentId}</td>
        <td><input type="text" value="${
          enrollment.fullName
        }" id="edit-name"></td>
        <td><input type="text" value="${
          enrollment.studentId
        }" id="edit-studentId"></td>
        <td><input type="email" value="${
          enrollment.email
        }" id="edit-email"></td>
        <td>
            <select id="edit-club">
                ${clubFilter.innerHTML}
            </select>
        </td>
        <td>
            <select id="edit-year">
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
            </select>
        </td>
        <td>${formatDate(enrollment.enrollmentDate)}</td>
        <td class="action-buttons">
            <button onclick="saveEdit('${enrollmentId}', this)">Save</button>
            <button onclick="cancelEdit(this, '${oldContent}')">Cancel</button>
        </td>
    `;

  // Set current values
  document.getElementById("edit-club").value = enrollment.club;
  document.getElementById("edit-year").value = enrollment.year;
}

// Save edited enrollment
function saveEdit(enrollmentId, button) {
  const enrollments = getEnrollments();
  const index = enrollments.findIndex((e) => e.enrollmentId === enrollmentId);

  if (index === -1) return;

  // Get edited values
  const updatedEnrollment = {
    ...enrollments[index],
    fullName: document.getElementById("edit-name").value,
    studentId: document.getElementById("edit-studentId").value,
    email: document.getElementById("edit-email").value,
    club: document.getElementById("edit-club").value,
    year: document.getElementById("edit-year").value,
  };

  // Validate
  if (
    !updatedEnrollment.fullName ||
    !updatedEnrollment.studentId ||
    !updatedEnrollment.email
  ) {
    alert("All required fields must be filled out");
    return;
  }

  // Update storage
  enrollments[index] = updatedEnrollment;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments));

  // Refresh display
  loadDashboard();
}

// Cancel edit
function cancelEdit(button, oldContent) {
  const row = button.closest("tr");
  row.innerHTML = oldContent;
}

// Delete enrollment
function deleteEnrollment(enrollmentId) {
  if (!confirm("Are you sure you want to delete this enrollment?")) return;

  const enrollments = getEnrollments();
  const updatedEnrollments = enrollments.filter(
    (e) => e.enrollmentId !== enrollmentId
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEnrollments));
  loadDashboard();
}

// Initialize dashboard
checkAuth();
