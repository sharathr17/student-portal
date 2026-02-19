/********************************************************************
 STUDENT LEARNING PORTAL
 COMPLETE FRONT-END JAVASCRIPT (PART 1)
 ---------------------------------------------------
 PART 1: Core System, Utilities, State, Mock Services
********************************************************************/

/* ==================================================
   1. GLOBAL BOOTSTRAP
================================================== */
(function () {
    "use strict";
    console.log("Student Learning Portal - Script Loaded");
})();

/* ==================================================
   2. APPLICATION CONFIG
================================================== */
const AppConfig = {
    appName: "Student Learning Portal",
    version: "1.0.0",
    debug: true,
    storageKeys: {
        enrolled: "enrolledCourses",
        bookmarks: "bookmarkedResources",
        ratings: "courseRatings",
        visits: "pageVisits"
    }
};

/* ==================================================
   3. GLOBAL STATE
================================================== */
const AppState = {
    user: {
        id: null,
        name: "Guest Student",
        role: "student"
    },
    enrolledCourses: [],
    bookmarkedResources: [],
    courseRatings: {},
    pageVisits: {}
};

/* ==================================================
   4. STORAGE UTILITIES
================================================== */
const Storage = {
    get(key, defaultValue) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("Storage error:", e);
        }
    }
};

/* ==================================================
   5. LOAD STATE FROM STORAGE
================================================== */
(function loadStoredState() {
    AppState.enrolledCourses = Storage.get(
        AppConfig.storageKeys.enrolled,
        []
    );

    AppState.bookmarkedResources = Storage.get(
        AppConfig.storageKeys.bookmarks,
        []
    );

    AppState.courseRatings = Storage.get(
        AppConfig.storageKeys.ratings,
        {}
    );

    AppState.pageVisits = Storage.get(
        AppConfig.storageKeys.visits,
        {}
    );
})();

/* ==================================================
   6. PAGE VISIT TRACKING
================================================== */
(function trackPageVisit() {
    const page = location.pathname.split("/").pop() || "index.html";
    AppState.pageVisits[page] =
        (AppState.pageVisits[page] || 0) + 1;

    Storage.set(
        AppConfig.storageKeys.visits,
        AppState.pageVisits
    );
})();

/* ==================================================
   7. DOM HELPERS
================================================== */
const DOM = {
    get(id) {
        return document.getElementById(id);
    },
    create(tag, className) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    },
    clear(el) {
        if (el) el.innerHTML = "";
    }
};

/* ==================================================
   8. EVENT HELPERS
================================================== */
const Events = {
    on(el, event, handler) {
        if (el) el.addEventListener(event, handler);
    }
};

/* ==================================================
   9. NOTIFICATION SYSTEM
================================================== */
const Notify = {
    info(msg) {
        alert(msg);
    },
    success(msg) {
        alert("✔ " + msg);
    },
    error(msg) {
        alert("✖ " + msg);
    }
};

/* ==================================================
   10. DATE & FORMAT UTILITIES
================================================== */
const Utils = {
    formatDate(date = new Date()) {
        return date.toISOString().split("T")[0];
    },
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },
    generateId() {
        return Math.floor(Math.random() * 1000000);
    }
};

/* ==================================================
   11. APPLICATION INITIALIZER
================================================== */
document.addEventListener("DOMContentLoaded", () => {
    if (AppConfig.debug) {
        console.log("AppState:", AppState);
    }
});

/* ==================================================
/********************************************************************
 PART 2: COURSE MODULE
 - 25 Courses
 - Course Rendering
 - Filtering
 - Course Statistics
********************************************************************/

/* ==================================================
   12. COURSE DATA (25 COURSES)
================================================== */
const CourseData = [
    // ---------- TECHNICAL COURSES ----------
    { id: 1, title: "Web Development", category: "technical", duration: "8 Weeks", level: "Beginner",
      description: "HTML, CSS, JavaScript and responsive design." },

    { id: 2, title: "Python Programming", category: "technical", duration: "7 Weeks", level: "Beginner",
      description: "Python basics, OOP and problem solving." },

    { id: 3, title: "Java Programming", category: "technical", duration: "8 Weeks", level: "Intermediate",
      description: "Core Java and object-oriented concepts." },

    { id: 4, title: "C Programming", category: "technical", duration: "6 Weeks", level: "Beginner",
      description: "Structured programming using C." },

    { id: 5, title: "Data Science Basics", category: "technical", duration: "10 Weeks", level: "Beginner",
      description: "Introduction to data analysis and visualization." },

    { id: 6, title: "Machine Learning", category: "technical", duration: "9 Weeks", level: "Intermediate",
      description: "Supervised and unsupervised learning techniques." },

    { id: 7, title: "Artificial Intelligence", category: "technical", duration: "8 Weeks", level: "Intermediate",
      description: "AI concepts and intelligent systems." },

    { id: 8, title: "Cyber Security", category: "technical", duration: "6 Weeks", level: "Beginner",
      description: "Cyber threats and security fundamentals." },

    { id: 9, title: "Cloud Computing", category: "technical", duration: "7 Weeks", level: "Beginner",
      description: "Cloud models and services." },

    { id: 10, title: "Mobile App Development", category: "technical", duration: "8 Weeks", level: "Intermediate",
      description: "Android application development basics." },

    // ---------- ACADEMIC COURSES ----------
    { id: 11, title: "Data Structures", category: "academic", duration: "10 Weeks", level: "Intermediate",
      description: "Arrays, stacks, queues, trees and graphs." },

    { id: 12, title: "Database Management Systems", category: "academic", duration: "6 Weeks", level: "Beginner",
      description: "SQL, normalization and transactions." },

    { id: 13, title: "Operating Systems", category: "academic", duration: "8 Weeks", level: "Intermediate",
      description: "Process management and memory management." },

    { id: 14, title: "Computer Networks", category: "academic", duration: "7 Weeks", level: "Intermediate",
      description: "OSI, TCP/IP and networking protocols." },

    { id: 15, title: "Software Engineering", category: "academic", duration: "6 Weeks", level: "Beginner",
      description: "SDLC models and testing techniques." },

    { id: 16, title: "Discrete Mathematics", category: "academic", duration: "7 Weeks", level: "Intermediate",
      description: "Logic, relations and graph theory." },

    { id: 17, title: "Compiler Design", category: "academic", duration: "8 Weeks", level: "Advanced",
      description: "Lexical analysis and parsing." },

    { id: 18, title: "Theory of Computation", category: "academic", duration: "6 Weeks", level: "Advanced",
      description: "Automata and formal languages." },

    { id: 19, title: "Object Oriented Analysis & Design", category: "academic", duration: "5 Weeks", level: "Intermediate",
      description: "UML and software design principles." },

    { id: 20, title: "Big Data Analytics", category: "academic", duration: "9 Weeks", level: "Intermediate",
      description: "Big data tools and analytics." },

    // ---------- SKILL DEVELOPMENT ----------
    { id: 21, title: "Communication Skills", category: "skill", duration: "4 Weeks", level: "All",
      description: "Improve speaking and presentation skills." },

    { id: 22, title: "Aptitude & Logical Reasoning", category: "skill", duration: "5 Weeks", level: "All",
      description: "Quantitative aptitude and logic." },

    { id: 23, title: "Professional Ethics", category: "skill", duration: "3 Weeks", level: "All",
      description: "Ethics in professional life." },

    { id: 24, title: "Resume & Interview Skills", category: "skill", duration: "3 Weeks", level: "All",
      description: "Resume building and interview preparation." },

    { id: 25, title: "Time Management", category: "skill", duration: "2 Weeks", level: "All",
      description: "Productivity and planning techniques." }
];

/* ==================================================
   13. COURSE STATE INIT
================================================== */
AppState.courses = CourseData;

/* ==================================================
   14. COURSE RENDERING
================================================== */
function renderCourseList(list) {
    const container = DOM.get("course-list");
    if (!container) return;

    DOM.clear(container);

    list.forEach(course => {
        const card = DOM.create("div", "course-card");

        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <p><strong>Level:</strong> ${course.level}</p>
            <button class="enroll-btn" data-id="${course.id}">
                View Details
            </button>
        `;

        container.appendChild(card);
    });

    const total = DOM.get("totalCourses");
    if (total) total.textContent = list.length;
}

/* ==================================================
   15. COURSE FILTERING
================================================== */
function initCourseFilter() {
    const filter = DOM.get("categoryFilter");
    if (!filter) return;

    Events.on(filter, "change", () => {
        const value = filter.value;
        if (value === "all") {
            renderCourseList(AppState.courses);
        } else {
            const filtered = AppState.courses.filter(
                c => c.category === value
            );
            renderCourseList(filtered);
        }
    });
}

/* ==================================================
   16. COURSE BUTTON HANDLING
================================================== */
document.addEventListener("click", event => {
    if (event.target.classList.contains("enroll-btn")) {
        const id = event.target.getAttribute("data-id");
        window.location.href = `course.html?id=${id}`;
    }
});

/* ==================================================
   17. COURSE PAGE INIT
================================================== */
document.addEventListener("DOMContentLoaded", () => {
    if (DOM.get("course-list")) {
        renderCourseList(AppState.courses);
        initCourseFilter();
    }
});

/* ==================================================
/********************************************************************
 PART 3: RESOURCES MODULE
 - 10 Resources
 - Search
 - Filter
 - Bookmarking
 - Download Simulation
********************************************************************/

/* ==================================================
   18. RESOURCE DATA (10 RESOURCES)
================================================== */
const ResourceData = [
    { id: 1, title: "HTML Lecture Notes", type: "notes", subject: "Web" },
    { id: 2, title: "CSS Flexbox Tutorial", type: "video", subject: "Web" },
    { id: 3, title: "JavaScript Assignment", type: "assignment", subject: "Web" },
    { id: 4, title: "DBMS Question Paper", type: "paper", subject: "DBMS" },
    { id: 5, title: "Operating Systems Notes", type: "notes", subject: "OS" },
    { id: 6, title: "Python Video Tutorial", type: "video", subject: "Python" },
    { id: 7, title: "Data Structures Lab Manual", type: "notes", subject: "DS" },
    { id: 8, title: "Aptitude Practice Set", type: "assignment", subject: "Aptitude" },
    { id: 9, title: "Computer Networks Notes", type: "notes", subject: "CN" },
    { id: 10, title: "Software Engineering Question Bank", type: "paper", subject: "SE" }
];

/* ==================================================
   19. RESOURCE STATE INIT
================================================== */
AppState.resources = ResourceData;

/* ==================================================
   20. RESOURCE RENDERING
================================================== */
function renderResourceList(list) {
    const container = DOM.get("resourceList");
    if (!container) return;

    DOM.clear(container);

    list.forEach(resource => {
        const card = DOM.create("div", "resource-card");

        const bookmarked =
            AppState.bookmarkedResources.includes(resource.id);

        card.innerHTML = `
            <h3>${resource.title}</h3>
            <p><strong>Type:</strong> ${resource.type}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>

            <button class="download-btn" data-id="${resource.id}">
                Download
            </button>

            <button class="bookmark-btn" data-id="${resource.id}">
                ${bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
        `;

        container.appendChild(card);
    });

    const count = DOM.get("resourceCount");
    if (count) count.textContent = list.length;
}

/* ==================================================
   21. RESOURCE SEARCH & FILTER
================================================== */
function applyResourceFilters() {
    let filtered = [...AppState.resources];

    const search = DOM.get("searchResource");
    const filter = DOM.get("typeFilter");

    if (search && search.value.trim() !== "") {
        const text = search.value.toLowerCase();
        filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(text)
        );
    }

    if (filter && filter.value !== "all") {
        filtered = filtered.filter(
            r => r.type === filter.value
        );
    }

    renderResourceList(filtered);
}

/* ==================================================
   22. RESOURCE EVENT HANDLERS
================================================== */
document.addEventListener("click", event => {
    const target = event.target;

    // Download simulation
    if (target.classList.contains("download-btn")) {
        const id = target.getAttribute("data-id");
        Notify.info("Downloading resource ID: " + id);
    }

    // Bookmark toggle
    if (target.classList.contains("bookmark-btn")) {
        const id = parseInt(target.getAttribute("data-id"));
        toggleBookmark(id);
    }
});

/* ==================================================
   23. BOOKMARK LOGIC
================================================== */
function toggleBookmark(resourceId) {
    const index = AppState.bookmarkedResources.indexOf(resourceId);

    if (index === -1) {
        AppState.bookmarkedResources.push(resourceId);
        Notify.success("Resource bookmarked");
    } else {
        AppState.bookmarkedResources.splice(index, 1);
        Notify.info("Bookmark removed");
    }

    Storage.set(
        AppConfig.storageKeys.bookmarks,
        AppState.bookmarkedResources
    );

    applyResourceFilters();
}

/* ==================================================
   24. RESOURCE PAGE INIT
================================================== */
document.addEventListener("DOMContentLoaded", () => {
    if (DOM.get("resourceList")) {
        renderResourceList(AppState.resources);

        const search = DOM.get("searchResource");
        const filter = DOM.get("typeFilter");

        Events.on(search, "input", applyResourceFilters);
        Events.on(filter, "change", applyResourceFilters);
    }
});

/* ==================================================
   /********************************************************************
 PART 4: COURSE DETAILS + ENROLLMENT + DASHBOARD + ANALYTICS
********************************************************************/

/* ==================================================
   25. COURSE DETAILS PAGE LOGIC
================================================== */
/********************************************************************
 ENHANCED COURSE DETAILS PAGE
********************************************************************/
/* ==================================================
   COURSE DETAILS INITIALIZER
================================================== */
function initCourseDetailsPage() {
    const container = document.getElementById("courseDetails");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const courseId = parseInt(params.get("id"));

    const course = AppState.courses.find(c => c.id === courseId);
    if (!course) {
        container.innerHTML = "<p>Course not found.</p>";
        return;
    }

    const enrolled = AppState.enrolledCourses.includes(courseId);
    const rating =
        AppState.courseRatings[courseId]
            ? AppState.courseRatings[courseId] + " ⭐"
            : "No rating yet";

    container.innerHTML = `
        <h2>${course.title}</h2>

        <p><strong>Overview:</strong> ${course.overview}</p>

        <h3>👨‍🏫 Instructor</h3>
        <p>${course.instructorBio}</p>

        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Level:</strong> ${course.level}</p>
        <p><strong>Category:</strong> ${course.category}</p>

        <h3>📅 Weekly Course Plan</h3>
        <ul>
            ${course.weekPlan.map(w => `<li>${w}</li>`).join("")}
        </ul>

        <h3>🛠 Tools & Technologies</h3>
        <ul>
            ${course.tools.map(t => `<li>${t}</li>`).join("")}
        </ul>

        <h3>🧪 Assessment Pattern</h3>
        <ul>
            <li>Assignments: ${course.assessment.assignments}</li>
            <li>Quiz: ${course.assessment.quiz}</li>
            <li>Project: ${course.assessment.project}</li>
        </ul>

        <h3>🎓 Certification</h3>
        <p>${course.certificate}</p>

        <h3>🚀 Career Outcomes</h3>
        <ul>
            ${course.careerOutcomes.map(o => `<li>${o}</li>`).join("")}
        </ul>

        <h3>⭐ Course Rating</h3>
        <p>Current Rating: <strong>${rating}</strong></p>

        <select id="courseRating">
            <option value="">Rate this course</option>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Very Good</option>
            <option value="3">⭐⭐⭐ Good</option>
            <option value="2">⭐⭐ Average</option>
            <option value="1">⭐ Poor</option>
        </select>

        <br><br>

        <button class="enroll-btn" id="enrollCourseBtn">
            ${enrolled ? "Already Enrolled" : "Enroll Now"}
        </button>
    `;

    /* -------- ENROLL BUTTON -------- */
    document
        .getElementById("enrollCourseBtn")
        .addEventListener("click", () => handleEnrollment(courseId));

    /* -------- RATING SELECT -------- */
    document
        .getElementById("courseRating")
        .addEventListener("change", function (e) {
            saveCourseRating(courseId, e.target.value);
        });
}

/* ==================================================
   ENROLLMENT HANDLING
================================================== */
function handleEnrollment(courseId) {
    if (AppState.enrolledCourses.includes(courseId)) {
        Notify.info("You are already enrolled in this course.");
        return;
    }

    AppState.enrolledCourses.push(courseId);

    Storage.set(
        AppConfig.storageKeys.enrolled,
        AppState.enrolledCourses
    );

    Notify.success("Enrollment successful! Redirecting to My Learning...");

    setTimeout(() => {
        window.location.href = "my-learning.html";
    }, 1000);
}

/* ==================================================
   COURSE RATING SYSTEM
================================================== */
function saveCourseRating(courseId, rating) {
    if (!rating) return;

    AppState.courseRatings[courseId] = rating;

    Storage.set(
        AppConfig.storageKeys.ratings,
        AppState.courseRatings
    );

    Notify.success("Thank you for rating this course!");
    initCourseDetailsPage(); // refresh UI
}

/* ==================================================
   AUTO INITIALIZE ON PAGE LOAD
================================================== */
document.addEventListener("DOMContentLoaded", initCourseDetailsPage);

/* ==================================================
   28. STUDENT DASHBOARD DATA
================================================== */
function getDashboardStats() {
    return {
        totalCourses: AppState.courses.length,
        enrolledCourses: AppState.enrolledCourses.length,
        totalResources: AppState.resources.length,
        bookmarkedResources: AppState.bookmarkedResources.length,
        visits: AppState.pageVisits
    };
}

/* ==================================================
   29. DASHBOARD RENDERING (OPTIONAL PAGE)
================================================== */
function renderDashboard() {
    const dashboard = DOM.get("dashboard");
    if (!dashboard) return;

    const stats = getDashboardStats();

    dashboard.innerHTML = `
        <h2>📊 Student Dashboard</h2>

        <p><strong>Total Courses:</strong> ${stats.totalCourses}</p>
        <p><strong>Enrolled Courses:</strong> ${stats.enrolledCourses}</p>
        <p><strong>Total Resources:</strong> ${stats.totalResources}</p>
        <p><strong>Bookmarked Resources:</strong> ${stats.bookmarkedResources}</p>

        <h3>📈 Page Visits</h3>
        <ul>
            ${Object.keys(stats.visits).map(
                page => `<li>${page}: ${stats.visits[page]}</li>`
            ).join("")}
        </ul>
    `;
}

/* ==================================================
   30. GLOBAL PAGE INITIALIZER
================================================== */
document.addEventListener("DOMContentLoaded", () => {
    initCourseDetailsPage();
    renderDashboard();
});


/********************************************************************
  31. CONTACT FORM – SUBMIT SUCCESS MESSAGE
********************************************************************/

(function () {
    const contactForm = document.getElementById("contactForm");
    const successMsg = document.getElementById("contactSuccessMsg");

    if (!contactForm || !successMsg) {
        console.warn("Contact form elements not found");
        return;
    }

    contactForm.onsubmit = function (event) {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        if (name === "" || email === "" || message === "") {
            successMsg.style.color = "red";
            successMsg.innerText = "Please fill all the fields.";
            return;
        }

        // SUCCESS MESSAGE
        successMsg.style.color = "green";
        successMsg.innerText = "✔ Message sent successfully!";

        // Reset form
        contactForm.reset();

        // Auto hide after 3 seconds
        setTimeout(() => {
            successMsg.innerText = "";
        }, 3000);
    };
})();

/********************************************************************
 EXTENDED COURSE DETAILS (ADDITIONAL INFO)
********************************************************************/
AppState.courses.forEach(course => {

    course.overview = course.description + 
        " This course is designed with practical examples, real-world use cases, and hands-on activities.";

    course.instructorBio =
        "The instructor has more than 10 years of academic and industry experience in this subject.";

    course.weekPlan = [
        "Week 1: Introduction & Fundamentals",
        "Week 2: Core Concepts",
        "Week 3: Hands-on Practice",
        "Week 4: Advanced Topics",
        "Week 5: Case Studies",
        "Week 6: Mini Project",
        "Week 7: Revision & Assessment",
        "Week 8: Final Evaluation"
    ];

    course.tools = [
        "Visual Studio Code",
        "Git & GitHub",
        "Online IDE",
        "Learning Management System"
    ];

    course.assessment = {
        assignments: "30%",
        quiz: "20%",
        project: "50%"
    };

    course.certificate =
        "Yes, a course completion certificate will be provided.";

    course.careerOutcomes = [
        "Improve subject knowledge",
        "Enhance practical skills",
        "Placement readiness",
        "Industry exposure"
    ];
});
/********************************************************************
 MY LEARNING DASHBOARD PAGE
********************************************************************/
(function () {

    const enrolledList = document.getElementById("enrolledCoursesList");
    const bookmarkedList = document.getElementById("bookmarkedResourcesList");
    const ratedList = document.getElementById("ratedCoursesList");

    // If not dashboard page, exit
    if (!enrolledList && !bookmarkedList && !ratedList) return;

    /* ---------------- ENROLLED COURSES ---------------- */
    if (enrolledList) {
        if (AppState.enrolledCourses.length === 0) {
            enrolledList.innerHTML = "<li>No enrolled courses yet</li>";
        } else {
            AppState.enrolledCourses.forEach(id => {
                const course = AppState.courses.find(c => c.id === id);
                if (course) {
                    const li = document.createElement("li");
                    li.textContent = course.title;
                    enrolledList.appendChild(li);
                }
            });
        }
    }

    /* ---------------- BOOKMARKED RESOURCES ---------------- */
    if (bookmarkedList) {
        if (AppState.bookmarkedResources.length === 0) {
            bookmarkedList.innerHTML = "<li>No bookmarked resources</li>";
        } else {
            AppState.bookmarkedResources.forEach(id => {
                const res = AppState.resources.find(r => r.id === id);
                if (res) {
                    const li = document.createElement("li");
                    li.textContent = `${res.title} (${res.type})`;
                    bookmarkedList.appendChild(li);
                }
            });
        }
    }

    /* ---------------- RATED COURSES ---------------- */
    if (ratedList) {
        const ratings = AppState.courseRatings;
        const keys = Object.keys(ratings);

        if (keys.length === 0) {
            ratedList.innerHTML = "<li>No courses rated yet</li>";
        } else {
            keys.forEach(courseId => {
                const course = AppState.courses.find(
                    c => c.id === parseInt(courseId)
                );
                if (course) {
                    const li = document.createElement("li");
                    li.textContent = `${course.title} — Rating: ${ratings[courseId]} ⭐`;
                    ratedList.appendChild(li);
                }
            });
        }
    }

})();
/********************************************************************
 FORCE REDIRECT AFTER ENROLL (FINAL OVERRIDE)
********************************************************************/

(function () {

    document.addEventListener("click", function (event) {

        // Check enroll button click
        if (event.target && event.target.id === "enrollCourseBtn") {

            event.preventDefault();

            const params = new URLSearchParams(window.location.search);
            const courseId = parseInt(params.get("id"));

            if (!courseId) return;

            // Read enrolled courses
            let enrolled =
                JSON.parse(localStorage.getItem("enrolledCourses")) || [];

            // Enroll only if not already enrolled
            if (!enrolled.includes(courseId)) {
                enrolled.push(courseId);
                localStorage.setItem(
                    "enrolledCourses",
                    JSON.stringify(enrolled)
                );
            }

            // SUCCESS + REDIRECT
            alert("Enrollment successful! Redirecting to My Learning…");

            setTimeout(function () {
                window.location.assign("my-learning.html");
            }, 800);
        }

    });

})();

