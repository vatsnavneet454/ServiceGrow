
/* =========================================
   SERVICEGROW BUSINESS DASHBOARD
========================================= */

const API_BASE_URL = "http://localhost:5000/api";

// =========================================
// AUTHENTICATION
// =========================================

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
    console.error("Invalid user information:", error);
}

if (!token || !currentUser) {
    window.location.href = "login.html";
}

if (currentUser && currentUser.role !== "business_owner") {
    if (currentUser.role === "admin") {
        window.location.href = "admin-dashboard.html";
    } else {
        window.location.href = "login.html";
    }
}

// =========================================
// ELEMENTS
// =========================================

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

const customerModal = document.getElementById("customerModal");
const addCustomerButton = document.getElementById("addCustomerButton");
const closeCustomerModal = document.getElementById("closeCustomerModal");

const customerForm = document.getElementById("customerForm");
const customerFormMessage = document.getElementById("customerFormMessage");

const logoutButton = document.getElementById("logoutButton");

let customerActivityChart = null;
let followupChart = null;

let customerActivityData = [];
let followupData = {
    completed: 0,
    pending: 0
};

// =========================================
// PAGE INITIALIZATION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    setDashboardYear();
    loadUserProfile();
    initializeSidebar();
    initializeCustomerModal();
    initializeLogout();
    initializeNavigation();
    initializeCharts();
    initializeButtons();

    loadDashboardData();
    loadCustomers();
    loadFollowups();
    loadReviews();
    loadBusinessProfile();

});

// =========================================
// CURRENT YEAR
// =========================================

function setDashboardYear() {

    const yearElement = document.getElementById("dashboardYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

}

// =========================================
// USER PROFILE
// =========================================

function loadUserProfile() {

    if (!currentUser) return;

    const name =
        currentUser.name || "Business Owner";

    const email =
        currentUser.email || "";

    const nameElement =
        document.getElementById("businessOwnerName");

    const welcomeElement =
        document.getElementById("welcomeName");

    const emailElement =
        document.getElementById("businessOwnerEmail");

    const avatarElement =
        document.getElementById("profileAvatar");

    if (nameElement) {
        nameElement.textContent = name;
    }

    if (welcomeElement) {
        welcomeElement.textContent = name.split(" ")[0];
    }

    if (emailElement) {
        emailElement.textContent = email;
    }

    if (avatarElement) {
        avatarElement.textContent =
            name.charAt(0).toUpperCase();
    }

}

// =========================================
// API REQUEST HELPER
// =========================================

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...(options.headers || {})
            }
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }

    if (response.status === 401) {
        logout();
        throw new Error("Your session has expired. Please log in again.");
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong."
        );
    }

    return data;

}

// =========================================
// SIDEBAR
// =========================================

function initializeSidebar() {

    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {

        if (
            window.innerWidth <= 768 &&
            sidebar.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            sidebar.classList.remove("open");
        }

    });

}

// =========================================
// NAVIGATION
// =========================================

function initializeNavigation() {

    const navLinks =
        document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

            if (window.innerWidth <= 768) {
                sidebar.classList.remove("open");
            }

        });

    });

}

// =========================================
// CUSTOMER MODAL
// =========================================

function initializeCustomerModal() {

    if (addCustomerButton) {
        addCustomerButton.addEventListener("click", openCustomerModal);
    }

    if (closeCustomerModal) {
        closeCustomerModal.addEventListener("click", closeModal);
    }

    if (customerModal) {

        customerModal.addEventListener("click", (event) => {

            if (event.target === customerModal) {
                closeModal();
            }

        });

    }

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeModal();
        }

    });

}

function openCustomerModal() {

    if (!customerModal) return;

    customerModal.classList.add("show");

    if (customerForm) {
        customerForm.reset();
    }

    if (customerFormMessage) {
        customerFormMessage.textContent = "";
    }

}

function closeModal() {

    if (!customerModal) return;

    customerModal.classList.remove("show");

}

// =========================================
// ADD CUSTOMER
// =========================================

if (customerForm) {

    customerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("customerName").value.trim();

        const email =
            document.getElementById("customerEmail").value.trim();

        const phone =
            document.getElementById("customerPhone").value.trim();

        const notes =
            document.getElementById("customerNotes").value.trim();

        if (!name || !email) {
            showCustomerMessage("Please enter customer name and email.");
            return;
        }

        const submitButton =
            customerForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.textContent = "Saving...";

        try {

            const result = await apiRequest(
                "/business/customers",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        notes
                    })
                }
            );

            showCustomerMessage(
                result.message || "Customer added successfully."
            );

            customerForm.reset();

            await loadCustomers();
            await loadDashboardData();

            setTimeout(() => {
                closeModal();
            }, 900);

        } catch (error) {

            showCustomerMessage(error.message);

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Save Customer";

        }

    });

}

function showCustomerMessage(message) {

    if (customerFormMessage) {
        customerFormMessage.textContent = message;
    }

}

// =========================================
// LOAD DASHBOARD STATISTICS
// =========================================

async function loadDashboardData() {

    try {

        const data = await apiRequest("/business/dashboard");

        const stats = data.stats || data;

        setText("totalCustomers", stats.totalCustomers ?? 0);
        setText("reviewInvitations", stats.reviewInvitations ?? 0);
        setText("customerFeedback", stats.customerFeedback ?? 0);
        setText("pendingFollowups", stats.pendingFollowups ?? 0);

        followupData = {
            completed: Number(stats.completedFollowups || 0),
            pending: Number(stats.pendingFollowups || 0)
        };

        updateFollowupChart();

    } catch (error) {

        console.error("Dashboard loading error:", error.message);

    }

}

// =========================================
// LOAD CUSTOMERS
// =========================================

async function loadCustomers() {

    try {

        const result =
            await apiRequest("/business/customers");

        const customers =
            Array.isArray(result) ? result : result.customers || [];

        renderCustomers(customers);

    } catch (error) {

        console.error("Customer loading error:", error.message);

    }

}

// =========================================
// RENDER CUSTOMER TABLE
// =========================================

function renderCustomers(customers) {

    const tableBody =
        document.getElementById("customerTableBody");

    if (!tableBody) return;

    tableBody.replaceChildren();

    if (!customers.length) {

        showEmptyRow(
            tableBody,
            5,
            "No customers found. Add your first customer."
        );

        return;

    }

    customers.forEach(customer => {

        const row = document.createElement("tr");

        appendCell(row, customer.name || "—");
        appendCell(row, customer.email || "—");
        appendCell(row, customer.phone || "—");
        appendCell(
            row,
            customer.last_activity
                ? formatDate(customer.last_activity)
                : "—"
        );

        const statusCell = document.createElement("td");

        const status = document.createElement("span");
        status.textContent = customer.status || "Active";

        statusCell.appendChild(status);
        row.appendChild(statusCell);

        tableBody.appendChild(row);

    });

}

// =========================================
// LOAD FOLLOWUPS
// =========================================

async function loadFollowups() {

    try {

        const result =
            await apiRequest("/business/followups");

        const followups =
            Array.isArray(result) ? result : result.followups || [];

        renderFollowups(followups);

    } catch (error) {

        console.error("Follow-up loading error:", error.message);

    }

}

// =========================================
// RENDER FOLLOWUPS
// =========================================

function renderFollowups(followups) {

    const tableBody =
        document.getElementById("followupTableBody");

    if (!tableBody) return;

    tableBody.replaceChildren();

    if (!followups.length) {

        showEmptyRow(
            tableBody,
            4,
            "No follow-ups scheduled yet."
        );

        return;

    }

    followups.forEach(item => {

        const row = document.createElement("tr");

        appendCell(row, item.customer_name || "—");

        appendCell(
            row,
            item.followup_date
                ? formatDate(item.followup_date)
                : "—"
        );

        appendCell(row, item.purpose || "General follow-up");
        appendCell(row, item.status || "Pending");

        tableBody.appendChild(row);

    });

}

// =========================================
// LOAD REVIEWS
// =========================================

async function loadReviews() {

    try {

        const result =
            await apiRequest("/business/reviews");

        const reviews =
            Array.isArray(result) ? result : result.reviews || [];

        renderReviews(reviews);

        setText("totalReviews", reviews.length);

        const ratings = reviews
            .map(review => Number(review.rating))
            .filter(rating => rating >= 1 && rating <= 5);

        const average = ratings.length
            ? (
                ratings.reduce((total, rating) => total + rating, 0) /
                ratings.length
            ).toFixed(1)
            : "—";

        setText("averageRating", average);

    } catch (error) {

        console.error("Review loading error:", error.message);

    }

}

// =========================================
// RENDER REVIEWS
// =========================================

function renderReviews(reviews) {

    const tableBody =
        document.getElementById("reviewTableBody");

    if (!tableBody) return;

    tableBody.replaceChildren();

    if (!reviews.length) {

        showEmptyRow(
            tableBody,
            4,
            "No customer feedback available yet."
        );

        return;

    }

    reviews.forEach(review => {

        const row = document.createElement("tr");

        appendCell(row, review.customer_name || "—");
        appendCell(
            row,
            review.rating ? `${review.rating}/5` : "—"
        );
        appendCell(row, review.feedback || "—");
        appendCell(
            row,
            review.created_at
                ? formatDate(review.created_at)
                : "—"
        );

        tableBody.appendChild(row);

    });

}

// =========================================
// BUSINESS PROFILE
// =========================================

async function loadBusinessProfile() {

    try {

        const result =
            await apiRequest("/business/profile");

        const business = result.business || result;

        setText("businessName", business.business_name || "Not configured");
        setText("businessEmail", business.business_email || "Not configured");
        setText("businessIndustry", business.industry || "Not configured");
        setText("businessStatus", business.status || "Active");

    } catch (error) {

        console.error("Business profile loading error:", error.message);

    }

}

// =========================================
// CHARTS
// =========================================

function initializeCharts() {

    if (typeof Chart === "undefined") {
        console.error("Chart.js could not be loaded.");
        return;
    }

    const activityCanvas =
        document.getElementById("customerActivityChart");

    if (activityCanvas) {

        customerActivityChart = new Chart(activityCanvas, {
            type: "line",

            data: {
                labels: [],
                datasets: [
                    {
                        label: "Customers",
                        data: [],
                        borderColor: "#ff9f43",
                        backgroundColor: "rgba(255,159,67,0.12)",
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false
                    }
                },

                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: "#929db0"
                        }
                    },

                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(255,255,255,0.06)"
                        },
                        ticks: {
                            color: "#929db0",
                            precision: 0
                        }
                    }
                }
            }
        });

    }

    const followupCanvas =
        document.getElementById("followupChart");

    if (followupCanvas) {

        followupChart = new Chart(followupCanvas, {
            type: "doughnut",

            data: {
                labels: ["Completed", "Pending"],

                datasets: [{
                    data: [0, 0],
                    backgroundColor: ["#36c995", "#ff9f43"],
                    borderWidth: 0,
                    hoverOffset: 7
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "72%",

                plugins: {
                    legend: {
                        display: false
                    }
                }
            }

        });

    }

    loadActivityChart(7);

}

// =========================================
// CUSTOMER ACTIVITY CHART
// =========================================

async function loadActivityChart(days) {

    try {

        const result = await apiRequest(
            `/business/activity?days=${encodeURIComponent(days)}`
        );

        customerActivityData = result.activity || [];

        if (!customerActivityChart) return;

        customerActivityChart.data.labels =
            customerActivityData.map(item => item.date);

        customerActivityChart.data.datasets[0].data =
            customerActivityData.map(item => Number(item.count));

        customerActivityChart.update();

    } catch (error) {

        console.error("Activity chart loading error:", error.message);

    }

}

// =========================================
// FOLLOWUP CHART
// =========================================

function updateFollowupChart() {

    if (!followupChart) return;

    followupChart.data.datasets[0].data = [
        followupData.completed,
        followupData.pending
    ];

    followupChart.update();

}

// =========================================
// CHART FILTER
// =========================================

const activityFilter =
    document.getElementById("activityFilter");

if (activityFilter) {

    activityFilter.addEventListener("change", () => {

        loadActivityChart(activityFilter.value);

    });

}

// =========================================
// DASHBOARD BUTTONS
// =========================================

function initializeButtons() {

    const viewAllCustomers =
        document.getElementById("viewAllCustomers");

    if (viewAllCustomers) {

        viewAllCustomers.addEventListener("click", () => {

            document.getElementById("customers")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

    }

    const createCampaignButton =
        document.getElementById("createCampaignButton");

    if (createCampaignButton) {

        createCampaignButton.addEventListener("click", () => {

            alert("Campaign management will be available after backend setup.");

        });

    }

    const notificationButton =
        document.getElementById("notificationButton");

    if (notificationButton) {

        notificationButton.addEventListener("click", () => {

            alert("Your notifications will appear here when available.");

        });

    }

}

// =========================================
// LOGOUT
// =========================================

function initializeLogout() {

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            const confirmed = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmed) {
                logout();
            }

        });

    }

}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.href = "login.html";

}

// =========================================
// HELPER FUNCTIONS
// =========================================

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}

function appendCell(row, value) {

    const cell = document.createElement("td");

    cell.textContent = value ?? "—";

    row.appendChild(cell);

}

function showEmptyRow(tableBody, colspan, message) {

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = colspan;
    cell.className = "empty-state";
    cell.textContent = message;

    row.appendChild(cell);
    tableBody.appendChild(row);

}

function formatDate(dateValue) {

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}
