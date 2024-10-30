
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = { x: 50, y: 50, size: 20, speed: 2 };
const guards = [
  { x: 200, y: 100, width: 20, height: 20, speed: 0.5, direction: 1, asleep: false, sleepTimer: 0 },
  { x: 400, y: 300, width: 20, height: 20, speed: 0.75, direction: -1, asleep: false, sleepTimer: 0 }
];
const finish = { x: 550, y: 350, width: 30, height: 30 };

let keys = {};
let gunCooldown = 0;

document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

function initGame() {
  alert("Objective: Reach the yellow zone, avoid or disable guards! Use arrow keys to move. Press Space to use the sleeping gun (cooldown applies).");
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  update();
  draw();
  if (checkWin()) {
    alert("Mission Complete! CV Section Unlocked!");
    document.getElementById("minigame-section").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
  } else if (!checkLoss()) {
    requestAnimationFrame(gameLoop);
  } else {
    alert("You’ve been spotted! Try using your sleeping gun wisely!");
    resetGame();
  }
}

function update() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  if (keys[" "] && gunCooldown <= 0) {
    activateSleepingGun();
    gunCooldown = 300; // 5-second cooldown (assuming 60fps)
  }
  if (gunCooldown > 0) gunCooldown--;

  guards.forEach(guard => {
    if (guard.asleep) {
      guard.sleepTimer--;
      if (guard.sleepTimer <= 0) guard.asleep = false;
    } else {
      guard.x += guard.speed * guard.direction;
      if (guard.x > canvas.width - guard.width || guard.x < 0) guard.direction *= -1;
    }
  });
}

function activateSleepingGun() {
  guards.forEach(guard => {
    if (!guard.asleep && Math.abs(player.x - guard.x) < 100 && Math.abs(player.y - guard.y) < 100) {
      guard.asleep = true;
      guard.sleepTimer = 180; // Guard sleeps for 3 seconds (180 frames at 60fps)
    }
  });
}

function checkWin() {
  return (player.x < finish.x + finish.width && player.x + player.size > finish.x &&
          player.y < finish.y + finish.height && player.y + player.size > finish.y);
}

function checkLoss() {
  return guards.some(guard =>
    !guard.asleep && // Guard is only dangerous when awake
    player.x < guard.x + guard.width &&
    player.x + player.size > guard.x &&
    player.y < guard.y + guard.height &&
    player.y + player.size > guard.y
  );
}

function resetGame() {
  player.x = 50;
  player.y = 50;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Draw guards with visual indicators for sleep
  guards.forEach(guard => {
    if (guard.asleep) {
      ctx.fillStyle = "blue"; // Sleeping guards appear blue
    } else {
      ctx.fillStyle = "red"; // Active guards appear red
    }
    ctx.fillRect(guard.x, guard.y, guard.width, guard.height);
  });

  // Draw finish area
  ctx.fillStyle = "yellow";
  ctx.fillRect(finish.x, finish.y, finish.width, finish.height);

  // Display cooldown message
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  if (gunCooldown > 0) {
    ctx.fillText(`Sleeping Gun Cooldown: ${(gunCooldown / 60).toFixed(1)}s`, 10, 20);
  } else {
    ctx.fillText("Sleeping Gun Ready!", 10, 20);
  }
}
