
/* ==========================================
   SERVICEGROW - COMPLETE JAVASCRIPT
   Homepage + Login + Register Popup
   Formspree Demo + Contact Forms
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // CONFIGURATION
    // ======================================

    const API_URL = "http://localhost:5000/api/auth";

    const DEMO_FORM_URL =
        "https://formspree.io/f/mjywpepj";

    const CONTACT_FORM_URL =
        "https://formspree.io/f/mbgopapz";


    // ======================================
    // MOBILE NAVIGATION
    // ======================================

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen =
                navLinks.classList.toggle("show");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("show");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    // ======================================
    // FOOTER YEAR
    // ======================================

    const copyrightYear =
        document.getElementById("copyrightYear");

    if (copyrightYear) {

        copyrightYear.textContent =
            new Date().getFullYear();

    }


    // ======================================
    // SCROLL REVEAL ANIMATION
    // ======================================

    const revealGroups = [
        ".services-grid",
        ".steps-grid",
        ".industries-grid",
        ".pricing-grid"
    ];

    revealGroups.forEach(function (selector) {

        document.querySelectorAll(selector).forEach(function (group) {

            Array.from(group.children).forEach(function (item, index) {

                item.classList.add("reveal");

                item.style.setProperty(
                    "--reveal-delay",
                    index * 100 + "ms"
                );

            });

        });

    });

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, obs) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        obs.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(function (element) {

            observer.observe(element);

        });

    } else {

        revealElements.forEach(function (element) {

            element.classList.add("visible");

        });

    }


    // ======================================
    // BACK TO TOP
    // ======================================

    const backToTop =
        document.getElementById("backToTop");

    if (backToTop) {

        window.addEventListener("scroll", function () {

            backToTop.classList.toggle(
                "show",
                window.scrollY > 400
            );

        });

        backToTop.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // ======================================
    // ACTIVE NAVIGATION
    // ======================================

    const sections =
        document.querySelectorAll("main section[id]");

    const navItems =
        document.querySelectorAll(".nav-links a");

    function updateActiveLink() {

        let currentSection = "";

        sections.forEach(function (section) {

            if (
                window.scrollY >=
                section.offsetTop - 150
            ) {

                currentSection = section.id;

            }

        });

        navItems.forEach(function (link) {

            link.classList.toggle(
                "active",
                link.getAttribute("href") ===
                    "#" + currentSection
            );

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveLink
    );

    updateActiveLink();


    // ======================================
    // HERO MOUSE GLOW
    // ======================================

    const hero =
        document.querySelector(".hero");

    if (
        hero &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        hero.addEventListener("mousemove", function (event) {

            const rect =
                hero.getBoundingClientRect();

            hero.style.setProperty(
                "--mouse-x",
                event.clientX - rect.left + "px"
            );

            hero.style.setProperty(
                "--mouse-y",
                event.clientY - rect.top + "px"
            );

        });

    }


    // ======================================
    // DASHBOARD PARALLAX
    // ======================================

    const heroVisual =
        document.querySelector(".hero-visual");

    const dashboard =
        document.querySelector(".dashboard-card");

    if (
        heroVisual &&
        dashboard &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        heroVisual.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    heroVisual.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width - 0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height - 0.5;

                dashboard.style.transform =
                    "rotateY(" + (-5 + x * 8) + "deg) " +
                    "rotateX(" + (2 - y * 5) + "deg)";

            }
        );

        heroVisual.addEventListener(
            "mouseleave",
            function () {

                dashboard.style.transform = "";

            }
        );

    }


    // ======================================
    // CHART ANIMATION
    // ======================================

    const chartPath = document.querySelector(
        ".chart svg path:nth-of-type(2)"
    );

    if (chartPath) {

        const length =
            chartPath.getTotalLength();

        chartPath.style.strokeDasharray = length;

        chartPath.style.strokeDashoffset = length;

        if ("IntersectionObserver" in window) {

            const chartObserver =
                new IntersectionObserver(
                    function (entries) {

                        entries.forEach(function (entry) {

                            if (entry.isIntersecting) {

                                chartPath.classList.add(
                                    "chart-draw"
                                );

                                chartObserver.unobserve(
                                    entry.target
                                );

                            }

                        });

                    },
                    {
                        threshold: 0.4
                    }
                );

            chartObserver.observe(chartPath);

        } else {

            chartPath.classList.add("chart-draw");

        }

    }


    // ======================================
    // FORM MESSAGE HELPER
    // ======================================

    function setFormMessage(
        element,
        message,
        success = false
    ) {

        if (!element) return;

        element.textContent = message;

        element.style.color = success
            ? "#36d399"
            : "#ff7777";

    }


    // ======================================
    // FORMSPREE FORM SUBMISSION
    // ======================================

    function setupFormspree(
        formId,
        statusId,
        endpoint
    ) {

        const form =
            document.getElementById(formId);

        const status =
            document.getElementById(statusId);

        if (!form) return;

        form.action = endpoint;
        form.method = "POST";

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                if (!form.reportValidity()) {
                    return;
                }

                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );

                const originalButtonHTML =
                    submitButton
                        ? submitButton.innerHTML
                        : "";

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Sending...";

                }

                setFormMessage(status, "");

                try {

                    const formData =
                        new FormData(form);

                    const response = await fetch(
                        endpoint,
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                Accept: "application/json"
                            }
                        }
                    );

                    if (!response.ok) {

                        const result =
                            await response.json()
                                .catch(function () {
                                    return {};
                                });

                        let errorMessage =
                            "Unable to send your message.";

                        if (
                            result.errors &&
                            Array.isArray(result.errors)
                        ) {

                            errorMessage =
                                result.errors
                                    .map(function (error) {
                                        return error.message;
                                    })
                                    .join(", ");

                        } else if (result.error) {

                            errorMessage = result.error;

                        }

                        throw new Error(errorMessage);

                    }

                    setFormMessage(
                        status,
                        "Thank you! Your message has been sent successfully. Our team will get back to you.",
                        true
                    );

                    form.reset();

                } catch (error) {

                    console.error(
                        "Formspree submission error:",
                        error
                    );

                    setFormMessage(
                        status,
                        error.message ||
                        "Something went wrong. Please try again."
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.innerHTML =
                            originalButtonHTML;

                    }

                }

            }
        );

    }


    // ======================================
    // BOOK YOUR FREE CALL FORM
    // ======================================

    setupFormspree(
        "demoForm",
        "demoStatus",
        DEMO_FORM_URL
    );


    // ======================================
    // CONTACT US FORM
    // ======================================

    setupFormspree(
        "contactForm",
        "contactStatus",
        CONTACT_FORM_URL
    );


    // ======================================
    // TRIM FORM INPUTS
    // ======================================

    document.querySelectorAll(
        "input[type='text'], input[type='email'], textarea"
    ).forEach(function (input) {

        input.addEventListener(
            "blur",
            function () {

                input.value = input.value.trim();

            }
        );

    });


    // ======================================
    // LOGIN AND REGISTER POPUPS
    // ======================================

    const loginPopup =
        document.getElementById("loginPopup");

    const registerPopup =
        document.getElementById("registerPopup");

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    const loginMessage =
        document.getElementById("loginMessage");

    const registerMessage =
        document.getElementById("registerMessage");

    const loginButton =
        document.getElementById("loginButton");

    const registerButton =
        document.getElementById("registerButton");

    if (!loginPopup || !registerPopup) {

        console.error(
            "Login or Register popup is missing in index.html"
        );

        return;

    }

    let previousFocus = null;


    // ======================================
    // GET ACTIVE MODAL
    // ======================================

    function getActiveModal() {

        if (!loginPopup.hidden) {
            return loginPopup;
        }

        if (!registerPopup.hidden) {
            return registerPopup;
        }

        return null;

    }


    // ======================================
    // OPEN MODAL
    // ======================================

    function openModal(modal) {

        if (!getActiveModal()) {

            previousFocus =
                document.activeElement;

        }

        loginPopup.hidden = true;
        registerPopup.hidden = true;

        modal.hidden = false;

        document.body.classList.add(
            "sg-modal-open"
        );

        const firstInput =
            modal.querySelector(
                "input:not([type='checkbox'])"
            );

        if (firstInput) {
            firstInput.focus();
        }

    }


    // ======================================
    // OPEN LOGIN
    // ======================================

    function openLogin() {

        openModal(loginPopup);

    }


    // ======================================
    // OPEN REGISTER
    // ======================================

    function openRegister() {

        openModal(registerPopup);

    }


    // ======================================
    // CLOSE MODAL
    // ======================================

    function closeModal() {

        loginPopup.hidden = true;
        registerPopup.hidden = true;

        document.body.classList.remove(
            "sg-modal-open"
        );

        if (
            previousFocus &&
            previousFocus.isConnected
        ) {

            previousFocus.focus();

        }

        previousFocus = null;

    }


    // ======================================
    // OPEN LOGIN FROM HOMEPAGE
    // ======================================

    document.querySelectorAll(
        '.nav-login-btn, [data-open-login], a[href="login.html"], a[href="#login"]'
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openLogin();

            }
        );

    });


    // ======================================
    // OPEN REGISTER FROM LINKS
    // ======================================

    document.querySelectorAll(
        '[data-open-register], a[href="register.html"]'
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openRegister();

            }
        );

    });


    // ======================================
    // LOGIN TO REGISTER
    // ======================================

    const openRegisterPopup =
        document.getElementById(
            "openRegisterPopup"
        );

    if (openRegisterPopup) {

        openRegisterPopup.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openRegister();

            }
        );

    }


    // ======================================
    // REGISTER TO LOGIN
    // ======================================

    const backToLoginPopup =
        document.getElementById(
            "backToLoginPopup"
        );

    if (backToLoginPopup) {

        backToLoginPopup.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openLogin();

            }
        );

    }


    // ======================================
    // CLOSE LOGIN POPUP
    // ======================================

    const closeLoginPopup =
        document.getElementById(
            "closeLoginPopup"
        );

    if (closeLoginPopup) {

        closeLoginPopup.addEventListener(
            "click",
            closeModal
        );

    }


    // ======================================
    // CLOSE REGISTER POPUP
    // ======================================

    const closeRegisterPopup =
        document.getElementById(
            "closeRegisterPopup"
        );

    if (closeRegisterPopup) {

        closeRegisterPopup.addEventListener(
            "click",
            closeModal
        );

    }


    // ======================================
    // CLOSE POPUP ON OUTSIDE CLICK
    // ======================================

    [loginPopup, registerPopup].forEach(
        function (popup) {

            popup.addEventListener(
                "click",
                function (event) {

                    if (event.target === popup) {

                        closeModal();

                    }

                }
            );

        }
    );


    // ======================================
    // ESCAPE AND KEYBOARD NAVIGATION
    // ======================================

    document.addEventListener(
        "keydown",
        function (event) {

            const modal = getActiveModal();

            if (!modal) return;

            if (event.key === "Escape") {

                closeModal();

                return;

            }

            if (event.key !== "Tab") {
                return;
            }

            const focusable = Array.from(
                modal.querySelectorAll(
                    'button:not([disabled]), ' +
                    'input:not([disabled]), ' +
                    'select:not([disabled]), ' +
                    'a[href]'
                )
            ).filter(function (element) {

                return (
                    element.getClientRects().length > 0
                );

            });

            if (!focusable.length) {
                return;
            }

            const first = focusable[0];

            const last =
                focusable[focusable.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {

                event.preventDefault();

                last.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {

                event.preventDefault();

                first.focus();

            }

        }
    );


    // ======================================
    // PASSWORD VISIBILITY
    // ======================================

    function setupPasswordToggle(
        inputId,
        buttonId
    ) {

        const input =
            document.getElementById(inputId);

        const button =
            document.getElementById(buttonId);

        if (!input || !button) {
            return;
        }

        button.addEventListener(
            "click",
            function () {

                const visible =
                    input.type === "password";

                input.type = visible
                    ? "text"
                    : "password";

                button.textContent = visible
                    ? "Hide"
                    : "Show";

                button.setAttribute(
                    "aria-pressed",
                    String(visible)
                );

            }
        );

    }

    setupPasswordToggle(
        "loginPassword",
        "toggleLoginPassword"
    );

    setupPasswordToggle(
        "registerPassword",
        "toggleRegisterPassword"
    );


    // ======================================
    // AUTHENTICATION API
    // ======================================

    async function apiRequest(
        endpoint,
        payload
    ) {

        let response;

        try {

            response = await fetch(
                API_URL + endpoint,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

        } catch (error) {

            throw new Error(
                "Cannot connect to the backend. Check that the server is running on port 5000."
            );

        }

        let result;

        try {

            result = await response.json();

        } catch (error) {

            throw new Error(
                "Invalid response from the server."
            );

        }

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Request failed. Please try again."
            );

        }

        return result;

    }


    // ======================================
    // LOGIN FORM
    // ======================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                if (!loginForm.reportValidity()) {
                    return;
                }

                const email =
                    document.getElementById(
                        "loginEmail"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "loginPassword"
                    ).value;

                const rememberMe =
                    document.getElementById(
                        "rememberMe"
                    ).checked;

                setFormMessage(
                    loginMessage,
                    ""
                );

                if (loginButton) {

                    loginButton.disabled = true;

                    loginButton.textContent =
                        "Signing in...";

                }

                try {

                    const result =
                        await apiRequest(
                            "/login",
                            {
                                email,
                                password
                            }
                        );

                    if (
                        !result.token ||
                        !result.user
                    ) {

                        throw new Error(
                            "Invalid login response."
                        );

                    }

                    const role =
                        result.user.role;

                    if (
                        ![
                            "admin",
                            "business_owner"
                        ].includes(role)
                    ) {

                        throw new Error(
                            "Account role is not supported."
                        );

                    }

                    // Remove previous login data

                    ["token", "user"].forEach(
                        function (key) {

                            localStorage.removeItem(
                                key
                            );

                            sessionStorage.removeItem(
                                key
                            );

                        }
                    );

                    // Remember Me storage

                    const storage = rememberMe
                        ? localStorage
                        : sessionStorage;

                    storage.setItem(
                        "token",
                        result.token
                    );

                    storage.setItem(
                        "user",
                        JSON.stringify(
                            result.user
                        )
                    );

                    setFormMessage(
                        loginMessage,
                        "Login successful! Redirecting...",
                        true
                    );

                    // Dashboard redirect

                    window.location.href =
                        role === "admin"
                            ? "admin-dashboard.html"
                            : "business-dashboard.html";

                } catch (error) {

                    setFormMessage(
                        loginMessage,
                        error.message ||
                        "Unable to sign in."
                    );

                } finally {

                    if (loginButton) {

                        loginButton.disabled = false;

                        loginButton.innerHTML =
                            "Sign In <span>→</span>";

                    }

                }

            }
        );

    }


    // ======================================
    // BUSINESS REGISTRATION FORM
    // ======================================

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                if (!registerForm.reportValidity()) {
                    return;
                }

                const name =
                    document.getElementById(
                        "registerName"
                    ).value.trim();

                const businessName =
                    document.getElementById(
                        "registerBusiness"
                    ).value.trim();

                const industry =
                    document.getElementById(
                        "registerIndustry"
                    ).value;

                const email =
                    document.getElementById(
                        "registerEmail"
                    ).value.trim();

                const phone =
                    document.getElementById(
                        "registerPhone"
                    ).value.trim();

                const country =
                    document.getElementById(
                        "registerCountry"
                    ).value;

                const password =
                    document.getElementById(
                        "registerPassword"
                    ).value;

                const confirmPassword =
                    document.getElementById(
                        "registerConfirmPassword"
                    ).value;

                const acceptedTerms =
                    document.getElementById(
                        "registerTerms"
                    ).checked;

                setFormMessage(
                    registerMessage,
                    ""
                );


                // ==================================
                // REQUIRED FIELDS VALIDATION
                // ==================================

                if (
                    !name ||
                    !businessName ||
                    !industry ||
                    !email ||
                    !country
                ) {

                    setFormMessage(
                        registerMessage,
                        "Please fill in all required fields."
                    );

                    return;

                }


                // ==================================
                // PHONE NUMBER VALIDATION
                // ==================================

                const phoneDigits =
                    phone.replace(/\D/g, "");

                if (
                    phoneDigits.length < 10 ||
                    phoneDigits.length > 15
                ) {

                    setFormMessage(
                        registerMessage,
                        "Enter a valid phone number (10-15 digits)."
                    );

                    return;

                }


                // ==================================
                // PASSWORD VALIDATION
                // ==================================

                const passwordPattern =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

                if (
                    !passwordPattern.test(password)
                ) {

                    setFormMessage(
                        registerMessage,
                        "Password needs 8 characters, uppercase, lowercase and a number."
                    );

                    return;

                }


                // ==================================
                // CONFIRM PASSWORD
                // ==================================

                if (
                    password !== confirmPassword
                ) {

                    setFormMessage(
                        registerMessage,
                        "Password and Confirm Password do not match."
                    );

                    return;

                }


                // ==================================
                // TERMS ACCEPTANCE
                // ==================================

                if (!acceptedTerms) {

                    setFormMessage(
                        registerMessage,
                        "Please accept the Terms and Privacy Policy."
                    );

                    return;

                }


                // ==================================
                // REGISTRATION DATA
                // ==================================

                // Only business owners register publicly.
                // Backend must enforce role permissions.

                const registrationData = {
                    name,
                    businessName,
                    industry,
                    email,
                    phone,
                    country,
                    password
                };


                // ==================================
                // SUBMIT REGISTRATION
                // ==================================

                if (registerButton) {

                    registerButton.disabled = true;

                    registerButton.textContent =
                        "Creating account...";

                }

                try {

                    const result =
                        await apiRequest(
                            "/register",
                            registrationData
                        );

                    registerForm.reset();

                    openLogin();

                    const loginEmail =
                        document.getElementById(
                            "loginEmail"
                        );

                    if (loginEmail) {

                        loginEmail.value = email;

                    }

                    setFormMessage(
                        loginMessage,
                        result.message ||
                        "Account created! Please sign in.",
                        true
                    );

                } catch (error) {

                    setFormMessage(
                        registerMessage,
                        error.message ||
                        "Registration failed."
                    );

                } finally {

                    if (registerButton) {

                        registerButton.disabled = false;

                        registerButton.innerHTML =
                            "Create Business Account <span>→</span>";

                    }

                }

            }
        );

    }


    // ======================================
    // FORGOT PASSWORD
    // ======================================

    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                setFormMessage(
                    loginMessage,
                    "Password reset is not configured yet."
                );

            }
        );

    }


    // ======================================
    // URL HASH SUPPORT
    // ======================================

    function handleHash() {

        if (
            window.location.hash === "#login"
        ) {

            openLogin();

        } else if (
            window.location.hash === "#register"
        ) {

            openRegister();

        }

    }

    handleHash();

    window.addEventListener(
        "hashchange",
        handleHash
    );


    // ======================================
    // INITIALIZATION COMPLETE
    // ======================================

    console.log(
        "ServiceGrow loaded successfully."
    );

});
