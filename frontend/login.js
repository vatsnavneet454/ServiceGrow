
/* =========================================
   SERVICEGROW LOGIN SYSTEM
   Business Owner / Customer / Admin
========================================= */

const API_URL = "http://localhost:5000/api/auth/login";

// =========================================
// ELEMENTS
// =========================================

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const togglePassword = document.getElementById("togglePassword");

const rememberMe = document.getElementById("rememberMe");

const accountTypeInput = document.getElementById("accountType");

const businessOption = document.getElementById("businessOption");
const customerOption = document.getElementById("customerOption");

const accountTypeRadios = document.querySelectorAll(
    'input[name="accountType"]'
);

// =========================================
// CURRENT YEAR
// =========================================

const yearElement = document.getElementById("loginYear");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// =========================================
// ACCOUNT TYPE SELECTION
// =========================================

function updateAccountType() {

    const selectedRadio = document.querySelector(
        'input[name="accountType"]:checked'
    );

    if (!selectedRadio) return;

    const selectedRole = selectedRadio.value;

    // Update hidden input
    if (accountTypeInput) {
        accountTypeInput.value = selectedRole;
    }

    // Update selected card
    businessOption?.classList.toggle(
        "selected",
        selectedRole === "business_owner"
    );

    customerOption?.classList.toggle(
        "selected",
        selectedRole === "customer"
    );

    // Update login button text
    if (loginButton) {
        loginButton.innerHTML = "Sign In <span>→</span>";
    }

    clearMessage();
}

accountTypeRadios.forEach(radio => {

    radio.addEventListener("change", updateAccountType);

});

// Set initial selected option
updateAccountType();

// =========================================
// SHOW / HIDE PASSWORD
// =========================================

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        togglePassword.textContent =
            isPassword ? "Hide" : "Show";

        togglePassword.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

    });

}

// =========================================
// MESSAGE FUNCTION
// =========================================

function showMessage(message, type = "error") {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.style.color =
        type === "success" ? "#36c995" : "#ff8585";

}

function clearMessage() {

    if (loginMessage) {
        loginMessage.textContent = "";
    }

}

// =========================================
// LOGIN FORM SUBMISSION
// =========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();

        const password = passwordInput.value;

        const selectedRole =
            document.querySelector(
                'input[name="accountType"]:checked'
            )?.value;

        // =====================================
        // VALIDATION
        // =====================================

        if (!email || !password) {

            showMessage("Please enter your email and password.");
            return;

        }

        if (!selectedRole) {

            showMessage("Please select your account type.");
            return;

        }

        if (!["business_owner", "customer"].includes(selectedRole)) {

            showMessage("Invalid account type selected.");
            return;

        }

        // =====================================
        // LOADING
        // =====================================

        loginButton.disabled = true;
        loginButton.textContent = "Signing In...";

        showMessage("Checking your account...", "success");

        try {

            // =================================
            // SEND LOGIN REQUEST
            // =================================

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password,
                    role: selectedRole
                })

            });

            const result = await response.json();

            // =================================
            // HANDLE LOGIN ERROR
            // =================================

            if (!response.ok) {

                throw new Error(
                    result.message || "Invalid email or password."
                );

            }

            // =================================
            // VERIFY RESPONSE
            // =================================

            if (!result.token || !result.user) {

                throw new Error(
                    "Invalid server response. Please contact support."
                );

            }

            const user = result.user;

            // Server-confirmed role must match selected account type
            if (user.role !== selectedRole) {

                throw new Error(
                    "This account does not match the selected account type."
                );

            }

            const allowedRoles = [
                "admin",
                "business_owner",
                "customer"
            ];

            if (!allowedRoles.includes(user.role)) {

                throw new Error("This account does not have dashboard access.");

            }

            // =================================
            // SAVE LOGIN SESSION
            // =================================

            // Clear old sessions first
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            const storage = rememberMe.checked
                ? localStorage
                : sessionStorage;

            storage.setItem("token", result.token);

            storage.setItem(
                "user",
                JSON.stringify(user)
            );

            // =================================
            // SUCCESS MESSAGE
            // =================================

            showMessage(
                "Login successful! Redirecting...",
                "success"
            );

            // =================================
            // ROLE-BASED REDIRECTION
            // =================================

            const dashboardRoutes = {
                admin: "admin-dashboard.html",
                business_owner: "business-dashboard.html",
                customer: "customer-dashboard.html"
            };

            const destination = dashboardRoutes[user.role];

            setTimeout(() => {

                window.location.href = destination;

            }, 800);

        } catch (error) {

            console.error("Login Error:", error);

            showMessage(
                error.message || "Unable to connect to the server."
            );

        } finally {

            loginButton.disabled = false;
            loginButton.innerHTML = 'Sign In <span>→</span>';

        }

    });

}

// =========================================
// FORGOT PASSWORD
// =========================================

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();

        showMessage(
            "Password recovery will be available after backend setup."
        );

    });

}
