
/* =========================================
   SERVICEGROW - ANIMATED JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // MOBILE NAVIGATION
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("show");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("show");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // FOOTER YEAR
    const copyrightYear = document.getElementById("copyrightYear");
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // SCROLL REVEAL WITH STAGGERED ANIMATION
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
                item.style.setProperty("--reveal-delay", (index * 100) + "ms");
            });
        });
    });

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        revealElements.forEach(function (element) {
            observer.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });
    }

    // BACK TO TOP
    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        window.addEventListener("scroll", function () {
            backToTop.classList.toggle("show", window.scrollY > 400);
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ACTIVE NAVIGATION LINK
    const sections = document.querySelectorAll("main section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    function updateActiveLink() {
        let currentSection = "";

        sections.forEach(function (section) {
            if (window.scrollY >= section.offsetTop - 150) {
                currentSection = section.id;
            }
        });

        navItems.forEach(function (link) {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + currentSection
            );
        });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();

    // HERO MOUSE GLOW
    const hero = document.querySelector(".hero");

    if (hero && window.matchMedia("(pointer: fine)").matches) {
        hero.addEventListener("mousemove", function (event) {
            const rect = hero.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            hero.style.setProperty("--mouse-x", x + "px");
            hero.style.setProperty("--mouse-y", y + "px");
        });
    }

    // DASHBOARD PARALLAX
    const heroVisual = document.querySelector(".hero-visual");
    const dashboard = document.querySelector(".dashboard-card");

    if (heroVisual && dashboard && window.matchMedia("(pointer: fine)").matches) {
        heroVisual.addEventListener("mousemove", function (event) {
            const rect = heroVisual.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            dashboard.style.transform =
                "rotateY(" + (-5 + x * 8) + "deg) rotateX(" + (2 - y * 5) + "deg)";
        });

        heroVisual.addEventListener("mouseleave", function () {
            dashboard.style.transform = "";
        });
    }

    // CHART ANIMATION
    const chartPath = document.querySelector(".chart svg path:nth-of-type(2)");

    if (chartPath) {
        const length = chartPath.getTotalLength();

        chartPath.style.strokeDasharray = length;
        chartPath.style.strokeDashoffset = length;

        if ("IntersectionObserver" in window) {
            const chartObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        chartPath.classList.add("chart-draw");
                        chartObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });

            chartObserver.observe(chartPath);
        } else {
            chartPath.classList.add("chart-draw");
        }
    }

    // DEMO FORM VALIDATION
    const demoForm = document.getElementById("demoForm");
    const demoStatus = document.getElementById("demoStatus");

    if (demoForm) {
        demoForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!demoForm.checkValidity()) {
                demoForm.reportValidity();
                return;
            }

            const formData = {
                name: document.getElementById("demoName").value.trim(),
                email: document.getElementById("demoEmail").value.trim(),
                business: document.getElementById("demoBusiness").value.trim(),
                industry: document.getElementById("demoIndustry").value,
                country: document.getElementById("demoCountry").value,
                monthlyCustomers: document.getElementById("monthlyCustomers").value,
                message: document.getElementById("demoMessage").value.trim()
            };

            console.log("Demo Form Data:", formData);

            showMessage(
                demoStatus,
                "Form validated successfully. Backend connection is not configured yet.",
                "success"
            );
        });
    }

    // CONTACT FORM VALIDATION
    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const contactData = {
                name: document.getElementById("contactName").value.trim(),
                email: document.getElementById("contactEmail").value.trim(),
                subject: document.getElementById("contactSubject").value.trim(),
                message: document.getElementById("contactMessage").value.trim()
            };

            console.log("Contact Form Data:", contactData);

            showMessage(
                contactStatus,
                "Form validated successfully. Backend connection is not configured yet.",
                "success"
            );
        });
    }

    // COMMON FORM MESSAGE
    function showMessage(element, message, type) {
        if (!element) return;

        element.textContent = message;
        element.style.color =
            type === "success" ? "#36d399" : "#ff6464";
    }

    // REMOVE EXTRA SPACES FROM INPUTS
    document.querySelectorAll(
        "input[type='text'], input[type='email'], textarea"
    ).forEach(function (input) {
        input.addEventListener("blur", function () {
            input.value = input.value.trim();
        });
    });

    console.log("ServiceGrow animations and JavaScript loaded!");
});
