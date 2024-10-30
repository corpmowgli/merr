const questions = [
  {
    question: "Where did I work as an IT Infrastructure Engineer?",
    choices: ["INTRUM", "UNITED SOLUTIONS", "Amazon Web Services", "All of the above"],
    answer: "All of the above",
    cvContent: `<h4>Professional Experience</h4><p><strong>ITM:</strong> IT Infrastructure Engineer, Network Engineer</p>`,
    timer: true,
  },
  {
    question: "Box Joke: What do you do when you’ve been spotted?",
    choices: ["Run away", "Hide in a box", "Fight back", "Call for backup"],
    answer: "Hide in a box",
    cvContent: `<p>Hiding in a box might actually work in some situations!</p>`,
    joke: true
  },
  {
    question: "What are my language skills?",
    choices: ["French, English, Italian", "Arabic", "Both A and B", "None"],
    answer: "Both A and B",
    cvContent: `<h4>Languages</h4><p>French, English, Italian (Fluent); Arabic (Conversational)</p>`
  }
];

let currentQuestionIndex = 0;

function startGame() {
  document.getElementById("game").classList.remove("hidden");
  document.querySelector("header").classList.add("hidden");
  loadQuestion();
}

function loadQuestion() {
  const questionObj = questions[currentQuestionIndex];
  document.getElementById("question").innerText = questionObj.question;
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  
  questionObj.choices.forEach(choice => {
    const button = document.createElement("button");
    button.innerText = choice;
    button.onclick = () => checkAnswer(choice);
    choicesContainer.appendChild(button);
  });
  if (questionObj.timer) {
    startPitStopTimer();
  }
}

function startPitStopTimer() {
  let timeLeft = 5;
  const timer = setInterval(() => {
    document.getElementById("question").innerText = `Hurry! You have ${timeLeft} seconds left!`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
      alert("Pit stop time's up! Quick thinking is key in F1!");
      checkAnswer(null);
    }
  }, 1000);
}

function checkAnswer(choice) {
  const questionObj = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");
  
  if (choice === questionObj.answer) {
    feedback.innerText = "Success! You've infiltrated further!";
    document.getElementById("cv-content").innerHTML += questionObj.cvContent;
    document.getElementById("cv-sections").classList.remove("hidden");
    currentQuestionIndex++;

    if (currentQuestionIndex === 2) {
      startMiniGame();
    } else {
      loadQuestion();
    }
  } else {
    feedback.innerText = "Alert! Spotted by the guards! Try again.";
  }
}

function startMiniGame() {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("minigame-section").classList.remove("hidden");
  initGame();
}
