const generateBtn = document.getElementById("generateBtn");

const subjectsInput = document.getElementById("subjects");
const hoursInput = document.getElementById("hours");
const examDateInput = document.getElementById("examDate");
const weakSubjectsInput = document.getElementById("weakSubjects");

const planOutput = document.getElementById("planOutput");
const progressOutput = document.getElementById("progressOutput");

generateBtn.addEventListener("click", function () {
  const subjects = subjectsInput.value
    .split(",")
    .map((subject) => subject.trim())
    .filter((subject) => subject !== "");

  const hours = Number(hoursInput.value);

  const examDate = examDateInput.value;

  const weakSubjects = weakSubjectsInput.value
    .split(",")
    .map((subject) => subject.trim())
    .filter((subject) => subject !== "");

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

  // Create study plan

  let planHTML = "";

  subjects.forEach((subject, index) => {
    let studyTime = Math.floor((hours * 60) / subjects.length);

    const isWeakSubject = weakSubjects.some(
      (weakSubject) => weakSubject.toLowerCase() === subject.toLowerCase(),
    );

    if (isWeakSubject) {
      studyTime += 15;
    }

    planHTML += `
            <div class="study-task">

                <div>
                    <h3>${subject}</h3>

                    <p>
                        Study for ${studyTime} minutes
                    </p>
                </div>

                <input
                    type="checkbox"
                    class="task-checkbox"
                >

            </div>
        `;
  });

  planOutput.innerHTML = `
        <div class="plan-result">

            <p class="exam-info">
                📅 Exam Date: ${examDate}
            </p>

            <p class="hours-info">
                ⏱️ Available Time: ${hours} hours/day
            </p>

            <h3>Today's Study Tasks</h3>

            ${planHTML}

        </div>
    `;

  updateProgress();
});

function updateProgress() {
  const checkboxes = document.querySelectorAll(".task-checkbox");

  progressOutput.innerHTML = `
        <div class="progress-container">

            <p>
                Completed:
                <span id="completedCount">0</span>
                /
                ${checkboxes.length}
            </p>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    id="progressFill"
                ></div>

            </div>

            <p id="progressText">
                0% completed
            </p>

        </div>
    `;

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateProgressBar);
  });
}

function updateProgressBar() {
  const checkboxes = document.querySelectorAll(".task-checkbox");

  const completed = document.querySelectorAll(".task-checkbox:checked").length;

  const total = checkboxes.length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("completedCount").textContent = completed;

  document.getElementById("progressFill").style.width = `${percentage}%`;

  document.getElementById("progressText").textContent =
    `${percentage}% completed`;
}
