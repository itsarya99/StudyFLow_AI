const generateBtn = document.getElementById("generateBtn");

const subjectsInput = document.getElementById("subjects");
const hoursInput = document.getElementById("hours");
const examDateInput = document.getElementById("examDate");
const weakSubjectsInput = document.getElementById("weakSubjects");

const planOutput = document.getElementById("planOutput");
const progressOutput = document.getElementById("progressOutput");


generateBtn.addEventListener("click", async function () {

    const subjects = subjectsInput.value
        .split(",")
        .map(subject => subject.trim())
        .filter(subject => subject !== "");

    const hours = Number(hoursInput.value);
    const examDate = examDateInput.value;

    const weakSubjects = weakSubjectsInput.value
        .split(",")
        .map(subject => subject.trim())
        .filter(subject => subject !== "");


    // Validation

    if (subjects.length === 0) {
        alert("Please enter at least one subject.");
        return;
    }

    if (!hours || hours <= 0) {
        alert("Please enter your available study hours.");
        return;
    }

    if (!examDate) {
        alert("Please select your exam date.");
        return;
    }


    // Loading state

    planOutput.innerHTML = `
        <p class="placeholder">
            🤖 AI is creating your personalized study plan...
        </p>
    `;


    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";


    try {

        const response = await fetch(
            "http://localhost:3000/api/study-plan",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    subjects,
                    hours,
                    examDate,
                    weakSubjects
                })
            }
        );


        const result = await response.json();


        if (!result.success) {
            throw new Error(result.message);
        }


        // Display AI response

        planOutput.innerHTML = `

            <div class="plan-result">

                <p class="exam-info">
                    📅 Exam Date: ${examDate}
                </p>

                <p class="hours-info">
                    ⏱️ Study Time: ${hours} hours/day
                </p>

                <div class="ai-plan">

                    ${formatAIResponse(result.studyPlan)}

                </div>

            </div>

        `;


        createProgressTracker();


    } catch (error) {

        console.error(error);

        planOutput.innerHTML = `
            <p>
                ❌ Unable to generate the study plan.
            </p>
        `;

    } finally {

        generateBtn.disabled = false;
        generateBtn.textContent = "✨ Generate Study Plan";

    }

});


function formatAIResponse(text) {

    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
}


function createProgressTracker() {

    progressOutput.innerHTML = `

        <div class="progress-container">

            <p>
                Start completing your AI-generated study tasks!
            </p>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: 0%"
                ></div>

            </div>

            <p id="progressText">
                0% completed
            </p>

        </div>

    `;

}