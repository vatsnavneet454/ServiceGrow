
const API_URL = "http://localhost:5000/api/auth";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");

// Show / Hide Password
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }
});

// Login Form
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginMessage.textContent = "";
    loginMessage.className = "message";

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Login failed");
        }

        // Save authentication details for this browser
        sessionStorage.setItem("servicegrow_token", data.token);
        sessionStorage.setItem(
            "servicegrow_user",
            JSON.stringify(data.user)
        );

        loginMessage.textContent = "Login successful! Redirecting...";
        loginMessage.classList.add("success");

        // Redirect according to role
        setTimeout(() => {
            if (data.user.role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else if (data.user.role === "business_owner") {
                window.location.href = "business-dashboard.html";
            } else {
                loginMessage.textContent = "Unknown account role.";
            }
        }, 800);

    } catch (error) {
        loginMessage.textContent =
            error.message === "Failed to fetch"
                ? "Cannot connect to server. Please start the backend."
                : error.message;

        loginMessage.classList.add("error");

    } finally {
        loginButton.disabled = false;
        loginButton.innerHTML = 'Sign In <span>→</span>';
    }
});

// Forgot Password - not implemented yet
document.getElementById("forgotPassword").addEventListener("click", (event) => {
    event.preventDefault();
    loginMessage.textContent =
        "Forgot password functionality will be added in the next phase.";
    loginMessage.className = "message";
});
