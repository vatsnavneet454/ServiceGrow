
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("loginPopup");
    const closeButton = document.getElementById("closeLoginPopup");
    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");
    const submitButton = document.getElementById("loginButton");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (!popup || !form) return;

    let previousFocus = null;

    function openPopup() {
        previousFocus = document.activeElement;
        popup.hidden = false;
        document.body.style.overflow = "hidden";
        document.getElementById("email").focus();
    }

    function closePopup() {
        popup.hidden = true;
        document.body.style.overflow = "";
        message.textContent = "";
        previousFocus?.focus();
    }

    document.querySelectorAll("[data-open-login]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            openPopup();
        });
    });

    closeButton.addEventListener("click", closePopup);

    popup.addEventListener("click", event => {
        if (event.target === popup) closePopup();
    });

    document.addEventListener("keydown", event => {
        if (popup.hidden) return;

        if (event.key === "Escape") {
            closePopup();
        }

        if (event.key === "Tab") {
            const focusable = [...popup.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled])'
            )];

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey &&
                       document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    togglePassword.addEventListener("click", () => {
        const visible = passwordInput.type === "password";
        passwordInput.type = visible ? "text" : "password";
        togglePassword.textContent = visible ? "Hide" : "Show";
    });

    document.getElementById("forgotPassword")
        .addEventListener("click", event => {
            event.preventDefault();
            message.style.color = "#ffb06d";
            message.textContent =
                "Password reset will be available after backend setup.";
        });

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value;
        const remember = document.getElementById("rememberMe").checked;

        message.textContent = "";
        submitButton.disabled = true;
        submitButton.textContent = "Signing in...";

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }

            if (!data.token || !data.user) {
                throw new Error("Invalid server response.");
            }

            const role = data.user.role;

            if (role !== "admin" && role !== "business_owner") {
                throw new Error("This account cannot access the dashboard.");
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            const storage = remember ? localStorage : sessionStorage;

            storage.setItem("token", data.token);
            storage.setItem("user", JSON.stringify(data.user));

            window.location.href =
                role === "admin"
                    ? "admin-dashboard.html"
                    : "business-dashboard.html";

        } catch (error) {
            message.style.color = "#f87171";
            message.textContent =
                error.message || "Unable to sign in.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Sign In →";
        }
    });
});
