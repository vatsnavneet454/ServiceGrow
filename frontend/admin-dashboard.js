
/* =========================================
   SERVICEGROW - ADMIN DASHBOARD JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "http://localhost:5000/api";

    // 1. CHECK ADMIN AUTHENTICATION

    const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

    const storedUser =
        sessionStorage.getItem("user") ||
        localStorage.getItem("user");

    if (!token || !storedUser) {
        window.location.replace("login.html");
        return;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch (error) {
        clearLoginData();
        window.location.replace("login.html");
        return;
    }

    // Only admin can access this dashboard

    if (!user || user.role !== "admin") {
        alert("Access denied. Admin account required.");
        window.location.replace("login.html");
        return;
    }


    // 2. DISPLAY ADMIN INFORMATION

    const adminName = user.name || "Administrator";
    const adminEmail = user.email || "Not available";

    setText("adminName", adminName);
    setText("welcomeAdminName", adminName);
    setText("settingsAdminName", adminName);
    setText("settingsAdminEmail", adminEmail);


    // 3. CURRENT DATE

    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }

    setText("adminYear", new Date().getFullYear());


    // 4. SIDEBAR TOGGLE

    const sidebar = document.getElementById("adminSidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (sidebar && sidebarToggle) {

        sidebarToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });

        document.addEventListener("click", function (event) {

            const clickedInsideSidebar = sidebar.contains(event.target);
            const clickedToggle = sidebarToggle.contains(event.target);

            if (
                window.innerWidth <= 850 &&
                !clickedInsideSidebar &&
                !clickedToggle
            ) {
                sidebar.classList.remove("open");
            }

        });

    }


    // 5. SIDEBAR NAVIGATION

    const sidebarLinks = document.querySelectorAll(".sidebar-link");

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            sidebarLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");

            if (window.innerWidth <= 850 && sidebar) {
                sidebar.classList.remove("open");
            }

        });

    });


    // 6. LOGOUT FUNCTIONALITY

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {

                clearLoginData();

                window.location.replace("login.html");

            }

        });

    }


    // 7. VIEW BUSINESSES BUTTON

    const viewBusinessesButton =
        document.getElementById("viewBusinessesButton");

    if (viewBusinessesButton) {

        viewBusinessesButton.addEventListener("click", function () {

            document.getElementById("businesses").scrollIntoView({
                behavior: "smooth"
            });

        });

    }


    // 8. LOAD DASHBOARD STATISTICS

    async function loadDashboardStats() {

        try {

            const response = await fetch(
                `${API_URL}/admin/dashboard`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                clearLoginData();
                window.location.replace("login.html");
                return;
            }

            if (!response.ok) {
                throw new Error("Unable to load dashboard statistics.");
            }

            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error("Invalid dashboard response.");
            }

            const stats = result.data;

            setText("totalBusinesses", stats.totalBusinesses ?? 0);
            setText("totalCustomers", stats.totalCustomers ?? 0);
            setText("totalReviews", stats.totalReviews ?? 0);
            setText("totalFollowups", stats.totalFollowups ?? 0);

            setText("customerOverview", stats.totalCustomers ?? 0);
            setText("activeBusinesses", stats.activeBusinesses ?? 0);
            setText("feedbackOverview", stats.totalReviews ?? 0);

            setText("reviewCount", stats.totalReviews ?? 0);
            setText("reviewInvitations", stats.reviewInvitations ?? 0);

            setText("followupTotal", stats.totalFollowups ?? 0);
            setText("followupCompleted", stats.completedFollowups ?? 0);
            setText("followupPending", stats.pendingFollowups ?? 0);

        } catch (error) {

            console.error("Dashboard Statistics Error:", error);

            showDashboardNotice(
                "Dashboard statistics are not available. Check your backend connection."
            );

        }

    }


    // 9. LOAD BUSINESS RECORDS

    async function loadBusinesses() {

        try {

            const response = await fetch(
                `${API_URL}/admin/businesses`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                clearLoginData();
                window.location.replace("login.html");
                return;
            }

            if (!response.ok) {
                throw new Error("Unable to load businesses.");
            }

            const result = await response.json();

            if (!result.success || !Array.isArray(result.data)) {
                throw new Error("Invalid business records response.");
            }

            renderBusinesses(result.data);

        } catch (error) {

            console.error("Business Loading Error:", error);

            const tableBody =
                document.getElementById("businessTableBody");

            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty-table">
                            Business records are not available yet.
                        </td>
                    </tr>
                `;
            }

        }

    }


    // 10. DISPLAY BUSINESS RECORDS

    function renderBusinesses(businesses) {

        const tableBody =
            document.getElementById("businessTableBody");

        if (!tableBody) return;

        if (!businesses.length) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-table">
                        No business accounts found.
                    </td>
                </tr>
            `;

            return;

        }

        tableBody.innerHTML = "";

        businesses.forEach(function (business) {

            const row = document.createElement("tr");

            const businessCell = document.createElement("td");
            businessCell.textContent = business.business_name || "Unnamed";

            const ownerCell = document.createElement("td");
            ownerCell.textContent = business.owner_name || "Not available";

            const industryCell = document.createElement("td");
            industryCell.textContent = business.industry || "Not specified";

            const statusCell = document.createElement("td");
            statusCell.textContent = business.status || "Unknown";

            const joinedCell = document.createElement("td");

            joinedCell.textContent = business.created_at
                ? new Date(business.created_at).toLocaleDateString("en-IN")
                : "Not available";

            row.append(
                businessCell,
                ownerCell,
                industryCell,
                statusCell,
                joinedCell
            );

            tableBody.appendChild(row);

        });

    }


    // 11. LOAD RECENT ACTIVITY

    async function loadRecentActivity() {

        try {

            const response = await fetch(
                `${API_URL}/admin/activity`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                clearLoginData();
                window.location.replace("login.html");
                return;
            }

            if (!response.ok) {
                throw new Error("Unable to load activity.");
            }

            const result = await response.json();

            if (!result.success || !Array.isArray(result.data)) {
                throw new Error("Invalid activity response.");
            }

            renderActivity(result.data);

        } catch (error) {

            console.error("Activity Loading Error:", error);

        }

    }


    // 12. DISPLAY RECENT ACTIVITY

    function renderActivity(activities) {

        const activityList =
            document.getElementById("activityList");

        if (!activityList) return;

        if (!activities.length) {

            activityList.textContent = "No recent activity available.";

            return;

        }

        activityList.innerHTML = "";

        activities.forEach(function (activity) {

            const entry = document.createElement("div");
            entry.className = "activity-entry";

            const dot = document.createElement("span");
            dot.className = "activity-dot";

            const details = document.createElement("div");

            const title = document.createElement("strong");
            title.textContent = activity.title || "Platform Activity";

            const description = document.createElement("small");
            description.textContent =
                activity.description || "Activity recorded.";

            details.append(title, description);
            entry.append(dot, details);

            activityList.appendChild(entry);

        });

    }


    // 13. COMMON HELPER FUNCTIONS

    function setText(elementId, value) {

        const element = document.getElementById(elementId);

        if (element) {
            element.textContent = value;
        }

    }


    function clearLoginData() {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

    }


    function showDashboardNotice(message) {

        console.warn(message);

    }


    // 14. INITIALIZE DASHBOARD

    loadDashboardStats();
    loadBusinesses();
    loadRecentActivity();

    console.log("ServiceGrow Admin Dashboard Loaded Successfully!");

});
