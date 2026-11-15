
const API_BASE_URL = "http://localhost:5000/api";

// Get logged-in customer session
const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

let currentUser = null;

try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
    currentUser = null;
}

// Redirect if session is missing or role is incorrect
if (!token || !currentUser) {
    window.location.href = "login.html";
} else if (currentUser.role !== "customer") {
    window.location.href =
        currentUser.role === "admin"
            ? "admin-dashboard.html"
            : "business-dashboard.html";
}

// DOM helper
const getElement = (id) => document.getElementById(id);

// API request helper
async function customerAPI(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            logoutCustomer();
        }

        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}

// Customer information
function loadCustomerInfo() {
    if (!currentUser) return;

    const name = currentUser.name || "Customer";
    const email = currentUser.email || "";

    if (getElement("customerName")) {
        getElement("customerName").textContent = name;
    }

    if (getElement("welcomeCustomerName")) {
        getElement("welcomeCustomerName").textContent = name;
    }

    if (getElement("customerEmail")) {
        getElement("customerEmail").textContent = email;
    }

    if (getElement("customerAvatar")) {
        getElement("customerAvatar").textContent =
            name.charAt(0).toUpperCase();
    }

    if (getElement("profileFullName")) {
        getElement("profileFullName").textContent = name;
    }

    if (getElement("profileEmail")) {
        getElement("profileEmail").textContent = email;
    }

    if (getElement("profilePhone")) {
        getElement("profilePhone").textContent =
            currentUser.phone || "Not available";
    }

    if (getElement("memberSince")) {
        getElement("memberSince").textContent =
            currentUser.created_at
                ? new Date(currentUser.created_at).toLocaleDateString()
                : "Not available";
    }

    if (getElement("customerYear")) {
        getElement("customerYear").textContent =
            new Date().getFullYear();
    }
}

// Sidebar navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll(".customer-nav-link");
    const sections = document.querySelectorAll(".customer-section");
    const menuToggle = getElement("customerMenuToggle");
    const sidebar = getElement("customerSidebar");

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const target = link.getAttribute("href");

            if (!target || !target.startsWith("#")) return;

            navLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");

            sections.forEach(section => {
                section.classList.remove("active");
            });

            const targetSection = document.querySelector(target);

            if (targetSection) {
                targetSection.classList.add("active");
            }

            if (sidebar) {
                sidebar.classList.remove("open");
            }
        });
    });

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
}

// Logout
function logoutCustomer() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.href = "login.html";
}

if (getElement("customerLogout")) {
    getElement("customerLogout").addEventListener(
        "click",
        logoutCustomer
    );
}

// Update dashboard statistics
function updateStatistics(data) {
    const stats = {
        totalServices: data.totalServices ?? 0,
        reviewsSubmitted: data.reviewsSubmitted ?? 0,
        pendingInvitations: data.pendingInvitations ?? 0,
        connectedBusinesses: data.connectedBusinesses ?? 0
    };

    Object.entries(stats).forEach(([id, value]) => {
        const element = getElement(id);

        if (element) {
            element.textContent = value;
        }
    });
}

// Display table rows safely
function renderTableRows(tableId, rows, columns, emptyMessage) {
    const tbody = getElement(tableId);

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!Array.isArray(rows) || rows.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");

        td.colSpan = columns.length;
        td.className = "customer-empty-state";
        td.textContent = emptyMessage;

        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    rows.forEach(row => {
        const tr = document.createElement("tr");

        columns.forEach(column => {
            const td = document.createElement("td");
            const value = column.value(row);

            if (column.html) {
                td.innerHTML = column.html(row);
            } else {
                td.textContent = value ?? "-";
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// Load dashboard summary
async function loadCustomerDashboard() {
    try {
        const data = await customerAPI("/customer/dashboard");

        updateStatistics(data.stats || data);

        renderTableRows(
            "recentServicesBody",
            data.recentServices || [],
            [
                { value: row => row.business_name },
                { value: row => row.service_name },
                { value: row => row.service_date },
                { value: row => row.status }
            ],
            "No recent services found."
        );

    } catch (error) {
        console.error("Dashboard loading error:", error.message);
    }
}

// Load all customer services
async function loadCustomerServices() {
    try {
        const data = await customerAPI("/customer/services");

        renderTableRows(
            "allServicesBody",
            data.services || [],
            [
                { value: row => row.business_name },
                { value: row => row.service_name },
                { value: row => row.service_date },
                { value: row => row.status }
            ],
            "No services available."
        );

    } catch (error) {
        console.error("Services loading error:", error.message);
    }
}

// Load customer reviews
async function loadCustomerReviews() {
    try {
        const data = await customerAPI("/customer/reviews");

        renderTableRows(
            "myReviewsBody",
            data.reviews || [],
            [
                { value: row => row.business_name },
                { value: row => row.rating },
                { value: row => row.feedback },
                { value: row => row.created_at }
            ],
            "You have not submitted any reviews yet."
        );

    } catch (error) {
        console.error("Reviews loading error:", error.message);
    }
}

// Load review invitations
async function loadCustomerInvitations() {
    try {
        const data = await customerAPI("/customer/invitations");

        renderTableRows(
            "invitationsBody",
            data.invitations || [],
            [
                { value: row => row.business_name },
                { value: row => row.service_name },
                { value: row => row.invitation_date },
                {
                    html: row => {
                        const button = document.createElement("button");
                        button.className = "customer-action-btn";
                        button.textContent = "Write Review";
                        button.type = "button";
                        button.addEventListener("click", () => {
                            openReviewModal(row);
                        });

                        // Return a safe text placeholder; action buttons
                        // are attached separately below.
                        return "";
                    },
                    value: () => "-"
                }
            ],
            "No pending invitations found."
        );

        // Add review buttons without inserting untrusted HTML.
        const tbody = getElement("invitationsBody");

        if (tbody && Array.isArray(data.invitations)) {
            [...tbody.rows].forEach((tr, index) => {
                const invitation = data.invitations[index];

                if (!invitation) return;

                const actionCell = document.createElement("td");
                const button = document.createElement("button");

                button.className = "customer-action-btn";
                button.type = "button";
                button.textContent = "Write Review";
                button.addEventListener("click", () => {
                    openReviewModal(invitation);
                });

                actionCell.appendChild(button);
                tr.appendChild(actionCell);
            });
        }

    } catch (error) {
        console.error("Invitations loading error:", error.message);
    }
}

// Load notifications
async function loadCustomerNotifications() {
    try {
        const data = await customerAPI("/customer/notifications");
        const container = getElement("notificationList");

        if (!container) return;

        container.innerHTML = "";

        const notifications = data.notifications || [];

        if (!notifications.length) {
            container.textContent = "No notifications available.";
            return;
        }

        notifications.forEach(notification => {
            const item = document.createElement("div");
            item.className = "customer-notification-item";

            const icon = document.createElement("div");
            icon.className = "customer-notification-icon";
            icon.innerHTML = '<i class="fas fa-bell"></i>';

            const content = document.createElement("div");
            const heading = document.createElement("h4");
            const message = document.createElement("p");

            heading.textContent = notification.title || "Notification";
            message.textContent = notification.message || "";

            content.append(heading, message);
            item.append(icon, content);
            container.appendChild(item);
        });

    } catch (error) {
        console.error("Notifications loading error:", error.message);
    }
}

// Review modal
function openReviewModal(invitation) {
    const modal = getElement("reviewModal");

    if (!modal) return;

    if (getElement("reviewInvitationId")) {
        getElement("reviewInvitationId").value =
            invitation.id || invitation.invitation_id || "";
    }

    if (getElement("reviewBusiness")) {
        getElement("reviewBusiness").textContent =
            invitation.business_name || "Business";
    }

    if (getElement("reviewFormMessage")) {
        getElement("reviewFormMessage").textContent = "";
    }

    modal.classList.add("show");
}

function closeReviewModal() {
    const modal = getElement("reviewModal");

    if (modal) {
        modal.classList.remove("show");
    }
}

if (getElement("closeReviewModal")) {
    getElement("closeReviewModal").addEventListener(
        "click",
        closeReviewModal
    );
}

// Close modal when clicking outside
if (getElement("reviewModal")) {
    getElement("reviewModal").addEventListener("click", event => {
        if (event.target.id === "reviewModal") {
            closeReviewModal();
        }
    });
}

// Submit review
if (getElement("reviewForm")) {
    getElement("reviewForm").addEventListener("submit", async event => {
        event.preventDefault();

        const form = event.currentTarget;
        const message = getElement("reviewFormMessage");
        const submitButton = form.querySelector('button[type="submit"]');

        const invitationId = getElement("reviewInvitationId")?.value;
        const rating = getElement("reviewRating")?.value;
        const feedback = getElement("reviewFeedback")?.value.trim();

        if (!rating || !feedback) {
            if (message) {
                message.textContent = "Please select a rating and write feedback.";
                message.className = "customer-form-message error";
            }
            return;
        }

        try {
            if (submitButton) submitButton.disabled = true;

            const result = await customerAPI("/customer/reviews", {
                method: "POST",
                body: JSON.stringify({
                    invitationId,
                    rating: Number(rating),
                    feedback
                })
            });

            if (message) {
                message.textContent =
                    result.message || "Review submitted successfully!";
                message.className = "customer-form-message success";
            }

            form.reset();

            await Promise.all([
                loadCustomerReviews(),
                loadCustomerInvitations(),
                loadCustomerDashboard()
            ]);

            setTimeout(closeReviewModal, 1200);

        } catch (error) {
            if (message) {
                message.textContent = error.message;
                message.className = "customer-form-message error";
            }
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}

// Notification button
if (getElement("notificationButton")) {
    getElement("notificationButton").addEventListener("click", () => {
        const notificationLink = document.querySelector(
            '.customer-nav-link[href="#notifications"]'
        );

        if (notificationLink) {
            notificationLink.click();
        }
    });
}

// Load all dashboard data
async function initializeCustomerDashboard() {
    if (!token || !currentUser || currentUser.role !== "customer") {
        return;
    }

    loadCustomerInfo();
    initializeNavigation();

    await Promise.all([
        loadCustomerDashboard(),
        loadCustomerServices(),
        loadCustomerReviews(),
        loadCustomerInvitations(),
        loadCustomerNotifications()
    ]);
}

document.addEventListener(
    "DOMContentLoaded",
    initializeCustomerDashboard
);
