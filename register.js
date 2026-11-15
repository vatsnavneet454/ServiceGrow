
const API_URL = "http://localhost:5000/api/auth/register";

document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    const businessFields = document.getElementById("businessFields");

    const businessOwnerRadio = document.getElementById("businessOwner");
    const customerRadio = document.getElementById("customer");

    const businessNameInput = document.getElementById("businessName");
    const industryInput = document.getElementById("industry");

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const togglePassword = document.getElementById("togglePassword");

    const registerButton = document.getElementById("registerButton");
    const registerMessage = document.getElementById("registerMessage");


    // Show success/error messages
    function showMessage(message, type) {
        registerMessage.textContent = message;
        registerMessage.className = `register-message ${type}`;
    }


    // Get selected account type
    function getSelectedAccountType() {
        return customerRadio.checked
            ? "customer"
            : "business_owner";
    }


    // Update account type UI
    function updateAccountType() {

        const accountType = getSelectedAccountType();

        const businessCard = businessOwnerRadio.closest(".account-type-card");
        const customerCard = customerRadio.closest(".account-type-card");

        if (accountType === "business_owner") {

            businessFields.hidden = false;

            businessNameInput.required = true;
            industryInput.required = true;

            businessCard.classList.add("selected");
            customerCard.classList.remove("selected");

        } else {

            businessFields.hidden = true;

            businessNameInput.required = false;
            industryInput.required = false;

            businessCard.classList.remove("selected");
            customerCard.classList.add("selected");
        }

        showMessage("", "");

    }


    // Account type selection
    businessOwnerRadio.addEventListener("change", updateAccountType);
    customerRadio.addEventListener("change", updateAccountType);


    // Show / hide password
    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type = isPassword
                ? "text"
                : "password";

            const icon = togglePassword.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-eye");
                icon.classList.toggle("fa-eye-slash");
            }

        });

    }


    // Password validation
    function validatePassword(password) {

        const hasMinimumLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        return (
            hasMinimumLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber
        );

    }


    // Phone validation
    function validatePhone(phone) {

        const cleanedPhone = phone.replace(/[\s()+-]/g, "");

        return /^\d{10,15}$/.test(cleanedPhone);

    }


    // Initial account type setup
    updateAccountType();


    // Registration form submission
    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        showMessage("", "");

        const accountType = getSelectedAccountType();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        const businessName = businessNameInput.value.trim();
        const industry = industryInput.value;

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const agreeTerms = document.getElementById("agreeTerms").checked;


        // Common field validation
        if (!name || !email || !phone || !password || !confirmPassword) {

            showMessage(
                "Please fill in all required fields.",
                "error"
            );

            return;

        }


        // Business field validation
        if (
            accountType === "business_owner" &&
            (!businessName || !industry)
        ) {

            showMessage(
                "Please enter your business name and select an industry.",
                "error"
            );

            return;

        }


        // Phone validation
        if (!validatePhone(phone)) {

            showMessage(
                "Please enter a valid phone number (10-15 digits).",
                "error"
            );

            return;

        }


        // Password validation
        if (!validatePassword(password)) {

            showMessage(
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number.",
                "error"
            );

            return;

        }


        // Confirm password
        if (password !== confirmPassword) {

            showMessage(
                "Password and Confirm Password do not match.",
                "error"
            );

            return;

        }


        // Terms validation
        if (!agreeTerms) {

            showMessage(
                "Please accept the Terms and Conditions.",
                "error"
            );

            return;

        }


        // Prepare registration data
        const registrationData = {
            name,
            email,
            phone,
            password,
            role: accountType
        };


        // Add business fields only for business owners
        if (accountType === "business_owner") {

            registrationData.businessName = businessName;
            registrationData.industry = industry;

        }


        try {

            registerButton.disabled = true;
            registerButton.innerHTML =
                'Creating Account <i class="fas fa-spinner fa-spin"></i>';

            showMessage(
                "Creating your account. Please wait...",
                ""
            );


            // Send registration request to backend
            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(registrationData)

            });


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message || "Registration failed."
                );

            }


            showMessage(
                result.message || "Account created successfully! Redirecting to login...",
                "success"
            );


            registerForm.reset();

            businessOwnerRadio.checked = true;
            updateAccountType();


            setTimeout(() => {

                window.location.href = "login.html";

            }, 1800);


        } catch (error) {

            console.error("Registration error:", error);

            showMessage(
                error.message || "Unable to connect to the server. Please try again.",
                "error"
            );

        } finally {

            registerButton.disabled = false;

            registerButton.innerHTML =
                'Create Account <i class="fas fa-arrow-right"></i>';

        }

    });

});
