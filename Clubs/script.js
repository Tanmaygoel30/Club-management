document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "enrolledStudents"; // Same key as admin portal
  const form = document.getElementById("clubEnrollmentForm");
  const inputs = form.querySelectorAll("input, select, textarea");

  // Remove error styling on input
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error");
      const errorMessage = input.parentElement.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    });
  });

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateForm(form)) {
      handleFormSubmission(form);
    }
  });

  function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      // Get existing enrollments
      const existingEnrollments = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      // Create new enrollment object
      const formData = new FormData(form);
      const enrollmentData = {
        enrollmentId:
          "ENR-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        fullName: formData.get("fullName"),
        studentId: formData.get("studentId"),
        email: formData.get("email"),
        year: formData.get("year"),
        club: formData.get("club"),
        experience: formData.get("experience"),
        days: formData.getAll("days"),
        enrollmentDate: new Date().toISOString(),
      };

      // Add new enrollment to existing ones
      existingEnrollments.push(enrollmentData);

      // Save back to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEnrollments));

      // Show success message
      showSuccessMessage(form);

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error saving enrollment:", error);
      showError(
        form,
        "An error occurred while saving your enrollment. Please try again."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Application";
    }
  }

  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");

    // Clear all existing errors first
    clearAllErrors(form);

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        showError(field, "This field is required");
        isValid = false;
      }
    });

    // Validate email format
    const emailField = form.querySelector("#email");
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      showError(emailField, "Please enter a valid email address");
      isValid = false;
    }

    // Validate student ID format
    const studentIdField = form.querySelector("#studentId");
    if (
      studentIdField &&
      studentIdField.value &&
      !isValidStudentId(studentIdField.value)
    ) {
      showError(
        studentIdField,
        "Please enter a valid student ID (at least 5 characters)"
      );
      isValid = false;
    }

    // Validate at least one meeting day is selected
    const daysChecked = form.querySelectorAll('input[name="days"]:checked');
    if (daysChecked.length === 0) {
      const daysContainer = form.querySelector(".checkbox-group");
      if (daysContainer) {
        showError(
          daysContainer,
          "Please select at least one preferred meeting day"
        );
        isValid = false;
      }
    }

    return isValid;
  }

  function clearAllErrors(form) {
    const errorMessages = form.querySelectorAll(".error-message");
    const errorFields = form.querySelectorAll(".error");

    errorMessages.forEach((msg) => msg.remove());
    errorFields.forEach((field) => field.classList.remove("error"));
  }

  function showError(element, message) {
    if (!element || !element.parentElement) return;

    element.classList.add("error");

    // Remove existing error message if any
    const existingError = element.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    element.parentElement.appendChild(errorDiv);
  }

  function showSuccessMessage(form) {
    const existingSuccess = form.querySelector(".success-message");
    if (existingSuccess) {
      existingSuccess.remove();
    }

    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent =
      "Thank you for your application! We will contact you soon.";
    form.appendChild(successMessage);

    // Remove success message after 5 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 5000);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidStudentId(studentId) {
    return studentId.length >= 5 && /^[a-zA-Z0-9]+$/.test(studentId);
  }
});
