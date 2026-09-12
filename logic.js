document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const newRegistrationButton = document.getElementById(
    "newRegistrationButton",
  );
  const editRegistrationButton = document.getElementById(
    "editRegistrationButton",
  );

  form.addEventListener("submit", handleFormSubmit);
  newRegistrationButton.addEventListener("click", startNewRegistration);
  editRegistrationButton.addEventListener("click", editLastRegistration);

  initThemeToggle();
});

function handleFormSubmit(event) {
  event.preventDefault(); // نمنع الصفحة من عمل reload

  const formData = collectFormData();
  const errors = validateFormData(formData);

  clearAllFieldErrors();

  if (errors.length > 0) {
    showFieldErrors(errors);
    focusFirstInvalidField(errors);
    return;
  }

  console.log("بيانات التسجيل:");
  console.log(JSON.stringify(formData, null, 2));

  showSuccessView(event.target, formData);
}

function collectFormData() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const genderInput = document.querySelector('input[name="gender"]:checked');
  const gender = genderInput ? genderInput.value : null;

  const sessionCheckboxes = document.querySelectorAll(
    'input[name="sessions"]:checked',
  );
  const sessions = Array.from(sessionCheckboxes).map(
    (checkbox) => checkbox.value,
  );

  return {
    fullName,
    email,
    phone,
    gender,
    sessions,
    submittedAt: new Date().toISOString(),
  };
}

function validateFormData(data) {
  const errors = [];

  if (!data.fullName) {
    errors.push(buildError("fullName", "الاسم مطلوب"));
  }

  if (!isValidEmail(data.email)) {
    errors.push(buildError("email", "البريد الإلكتروني غير صحيح"));
  }

  if (!isValidPhone(data.phone)) {
    errors.push(
      buildError("phone", "رقم الهاتف لازم يكون أرقام فقط (10 إلى 15 رقم)"),
    );
  }

  if (!data.gender) {
    errors.push(buildError("gender", "اختر النوع", 'input[name="gender"]'));
  }

  if (data.sessions.length === 0) {
    errors.push(
      buildError(
        "sessions",
        "اختر جلسة واحدة على الأقل",
        'input[name="sessions"]',
      ),
    );
  }

  return errors;
}

function buildError(fieldKey, message, selectorOverride) {
  const input = selectorOverride
    ? document.querySelector(selectorOverride)
    : document.getElementById(fieldKey);

  const fieldContainer = input.closest(".field");

  return { input, fieldContainer, message };
}

function showFieldErrors(errors) {
  errors.forEach(({ fieldContainer, message }) => {
    fieldContainer.classList.add("has-error");

    const errorText = document.createElement("p");
    errorText.className = "field-error";
    errorText.textContent = message;
    fieldContainer.appendChild(errorText);
  });
}

function clearAllFieldErrors() {
  document.querySelectorAll(".field.has-error").forEach((fieldContainer) => {
    fieldContainer.classList.remove("has-error");
  });
  document.querySelectorAll(".field-error").forEach((errorText) => {
    errorText.remove();
  });
}

function focusFirstInvalidField(errors) {
  const firstError = errors[0];
  firstError.input.focus();
  firstError.fieldContainer.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  const phonePattern = /^[0-9]{10,15}$/;
  return phonePattern.test(phone);
}

function showSuccessView(formElement, formData) {
  const successView = document.getElementById("successView");
  const successName = document.getElementById("successName");

  successName.textContent = formData.fullName;
  formElement.hidden = true;
  successView.hidden = false;
  successView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startNewRegistration() {
  const form = document.getElementById("registrationForm");
  form.reset();
  clearAllFieldErrors();
  backToForm();
}

function editLastRegistration() {
  backToForm();
}

function backToForm() {
  const form = document.getElementById("registrationForm");
  const successView = document.getElementById("successView");

  successView.hidden = true;
  form.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initThemeToggle() {
  const themeToggleButton = document.getElementById("themeToggle");
  const themeIcon = themeToggleButton.querySelector(".theme-icon");

  applySavedTheme();
  themeToggleButton.addEventListener("click", toggleTheme);

  function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme === "dark";

    document.body.classList.toggle("dark-mode", isDarkMode);
    updateIcon(isDarkMode);
  }

  function toggleTheme() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    updateIcon(isDarkMode);
  }

  function updateIcon(isDarkMode) {
    themeIcon.textContent = isDarkMode ? "☀️" : "🌙";

    const label = isDarkMode
      ? "التبديل إلى الوضع الفاتح"
      : "التبديل إلى الوضع الداكن";
    themeToggleButton.setAttribute("aria-label", label);
    themeToggleButton.setAttribute("title", label);
  }
}
