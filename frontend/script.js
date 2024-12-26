const baseURL = "https://coherent-sassy-flute.glitch.me/questions";

// Common Navbar
document.getElementById("navbar").innerHTML = `
    <nav>
        <a href="index.html">Home</a>
        <a href="quiz.html">Quiz</a>
        <a href="questions.html">Questions</a>
    </nav>
`;

// Login Page
if (window.location.pathname.endsWith("index.html")) {
    document.getElementById("login-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email === "empher@gmail.com" && password === "empher@123") {
            alert("Login Success, you are redirecting to quiz page");
            window.location.href = "quiz.html";
        } else {
            document.getElementById("error-message").textContent = "Invalid credentials!";
        }
    });
}

// Quiz Management Page
if (window.location.pathname.endsWith("quiz.html")) {
    const quizForm = document.getElementById("quiz-form");
    const quizQuestions = document.getElementById("quiz-questions");

    quizForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const question = {
            title: document.getElementById("question").value,
            optionA: document.getElementById("optionA").value,
            optionB: document.getElementById("optionB").value,
            optionC: document.getElementById("optionC").value,
            optionD: document.getElementById("optionD").value,
            correctOption: document.getElementById("correctOption").value,
            reviewStatus: false
        };

        await fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(question)
        });

        alert("Question Created");
        renderQuestions();
    });

    async function renderQuestions() {
        const res = await fetch(baseURL);
        const questions = await res.json();
        quizQuestions.innerHTML = questions
            .map(q => `
                <div class="card ${q.reviewStatus ? "reviewed" : ""}">
                    <h3>${q.title}</h3>
                    <p>A: ${q.optionA}</p>
                    <p>B: ${q.optionB}</p>
                    <p>C: ${q.optionC}</p>
                    <p>D: ${q.optionD}</p>
                    <button onclick="reviewQuestion(${q.id})">Review</button>
                    <button onclick="deleteQuestion(${q.id})">Delete</button>
                </div>
            `).join("");
    }

    renderQuestions();
}

async function reviewQuestion(id) {
    const confirmation = confirm("Are you sure to review the question?");
    if (confirmation) {
        try {
            await fetch(`${baseURL}${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewStatus: true }),
            });
            alert("Question reviewed");
            renderQuestions(); // Re-render questions to update the border color
        } catch (error) {
            console.error("Error reviewing the question:", error);
        }
    }
}

async function deleteQuestion(id) {
    if (confirm("Are you sure to delete?")) {
        await fetch(`${baseURL}${id}`, { method: "DELETE" });
        alert("Question deleted");
        window.location.reload();
    }
}

// Reviewed Questions Page
if (window.location.pathname.endsWith("questions.html")) {
    async function renderReviewedQuestions() {
        const res = await fetch(baseURL);
        const questions = await res.json();
        document.getElementById("reviewed-questions").innerHTML = questions
            .filter(q => q.reviewStatus)
            .map(q => `
                <div class="card reviewed">
                    <h3>${q.title}</h3>
                    <p>A: ${q.optionA}</p>
                    <p>B: ${q.optionB}</p>
                    <p>C: ${q.optionC}</p>
                    <p>D: ${q.optionD}</p>
                </div>
            `).join("");
    }

    renderReviewedQuestions();
}