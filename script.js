
/* =========================================
   SERVICEGROW - JAVASCRIPT
   Animations, Navigation & Interactions
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

        });

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");

            });

        });

        document.addEventListener("click", event => {

            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }

        });

    }


    // =====================================
    // HERO ENTRANCE ANIMATION
    // =====================================

    const heroContent = document.querySelector(".hero-content");

    if (heroContent) {

        const heroElements = heroContent.querySelectorAll(
            ".eyebrow, h1, .hero-description, .hero-buttons, .hero-highlights"
        );

        heroElements.forEach((element, index) => {

            element.style.opacity = "0";
            element.style.transform = "translateY(25px)";

            element.animate(
                [
                    {
                        opacity: 0,
                        transform: "translateY(25px)"
                    },
                    {
                        opacity: 1,
                        transform: "translateY(0)"
                    }
                ],
                {
                    duration: 800,
                    delay: 150 + index * 160,
                    easing: "cubic-bezier(.2,.7,.2,1)",
                    fill: "forwards"
                }
            );

        });

    }


    // =====================================
    // MOUSE FOLLOWING ORANGE GLOW
    // AND THREE-LINE MOUSE TRAIL
    // =====================================

    const hero = document.querySelector(".hero");
    const mouseTrail = document.querySelector(".mouse-trail");

    if (
        hero &&
        mouseTrail &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {

        // Create the orange glow
        const mouseLight = document.createElement("div");

        mouseLight.className = "hero-mouse-light";

        hero.appendChild(mouseLight);

        const trailLines = mouseTrail.querySelectorAll("span");

        // Three different trail positions
        const trailPositions = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ];

        let mouseX = 0;
        let mouseY = 0;

        let animationFrame = null;

        function animateMouseTrail() {

            trailPositions.forEach((position, index) => {

                const speed = 0.22 - (index * 0.045);

                position.x += (mouseX - position.x) * speed;
                position.y += (mouseY - position.y) * speed;

                const line = trailLines[index];

                if (line) {

                    line.style.left = `${position.x}px`;
                    line.style.top = `${position.y}px`;

                }

            });

            animationFrame = requestAnimationFrame(animateMouseTrail);

        }

        hero.addEventListener("mouseenter", event => {

            const rect = hero.getBoundingClientRect();

            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;

            trailPositions.forEach(position => {
                position.x = mouseX;
                position.y = mouseY;
            });

            hero.classList.add("mouse-active");

            if (!animationFrame) {
                animateMouseTrail();
            }

        });

        hero.addEventListener("mousemove", event => {

            const rect = hero.getBoundingClientRect();

            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;

            // Move the orange glow
            mouseLight.style.left = `${mouseX}px`;
            mouseLight.style.top = `${mouseY}px`;

            // Move the three-line trail
            mouseTrail.style.left = "0";
            mouseTrail.style.top = "0";

        });

        hero.addEventListener("mouseleave", () => {

            hero.classList.remove("mouse-active");

        });

    }


    // =====================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealTargets = document.querySelectorAll(
        ".section-heading, .service-card, .industry-card, .about-content, .about-visual, .pricing-card, .demo-content, .form-card, .contact-info, .contact-form"
    );

    revealTargets.forEach(element => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealTargets.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealTargets.forEach(element => {
            element.classList.add("visible");
        });

    }


    // =====================================
    // HOW IT WORKS - SEQUENTIAL ANIMATION
    // =====================================

    const howSection = document.querySelector(".how-section");

    if (howSection && "IntersectionObserver" in window) {

        const howObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        howSection.classList.add("process-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.25
            }
        );

        howObserver.observe(howSection);

    } else if (howSection) {

        howSection.classList.add("process-visible");

    }


    // =====================================
    // ACTIVE NAVIGATION LINK
    // =====================================

    const navLinksList = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    const pageSections = [...navLinksList]
        .map(link => {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        navLinksList.forEach(link => {

                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") === `#${entry.target.id}`
                            );

                        });

                    }

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );

        pageSections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    // =====================================
    // BACK TO TOP BUTTON
    // =====================================

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        window.addEventListener("scroll", () => {

            backToTop.classList.toggle(
                "show",
                window.scrollY > 450
            );

        });

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // =====================================
    // DEMO FORM
    // FRONTEND VALIDATION ONLY
    // =====================================

    const demoForm = document.getElementById("demoForm");
    const demoStatus = document.getElementById("demoStatus");

    if (demoForm) {

        demoForm.addEventListener("submit", event => {

            event.preventDefault();

            if (!demoForm.checkValidity()) {

                demoForm.reportValidity();
                return;

            }

            if (demoStatus) {

                demoStatus.textContent =
                    "Thank you! Your details are valid. This form is not connected to a server yet, so your information has not been sent.";

            }

            demoForm.reset();

        });

    }


    // =====================================
    // CONTACT FORM
    // FRONTEND VALIDATION ONLY
    // =====================================

    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();
                return;

            }

            if (contactStatus) {

                contactStatus.textContent =
                    "Thank you for contacting us! This form is not connected to email or a database yet, so your message has not been sent.";

            }

            contactForm.reset();

        });

    }


    // =====================================
    // AUTOMATIC COPYRIGHT YEAR
    // =====================================

    const copyrightYear = document.getElementById("copyrightYear");

    if (copyrightYear) {

        copyrightYear.textContent = new Date().getFullYear();

    }


    // =====================================
    // SERVICE CARD STAGGER EFFECT
    // =====================================

    const cardGroups = [
        ".services-grid",
        ".industries-grid",
        ".pricing-grid"
    ];

    cardGroups.forEach(groupSelector => {

        const group = document.querySelector(groupSelector);

        if (!group) return;

        const cards = group.querySelectorAll(
            ".service-card, .industry-card, .pricing-card"
        );

        cards.forEach((card, index) => {

            card.style.transitionDelay = `${(index % 3) * 100}ms`;

        });

    });


    // =====================================
    // BUTTON CLICK FEEDBACK
    // =====================================

    document.querySelectorAll(".btn, .nav-button").forEach(button => {

        button.addEventListener("mousedown", () => {
            button.style.transform = "scale(0.97)";
        });

        button.addEventListener("mouseup", () => {
            button.style.transform = "";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "";
        });

    });

});
