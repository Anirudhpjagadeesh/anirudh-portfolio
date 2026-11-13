const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const terminalForm = document.querySelector("#terminal-form");
const terminalInput = document.querySelector("#terminal-input");
const terminalOutput = document.querySelector("#terminal-output");
const toast = document.querySelector("#toast");

function filterProjects(filter) {
  projectCards.forEach((card) => {
    const visible = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !visible);
  });

  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProjects(button.dataset.filter));
});

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  siteNav.classList.toggle("is-open", !expanded);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  });
});

const commandResponses = {
  help: [
    "Available commands: whoami, skills, projects, contact, clear",
    "Tip: use the buttons above, or type a command here."
  ],
  whoami: [
    "Anirudh P J — B.Tech Information Technology graduate.",
    "Full-stack developer based in Kozhikode, Kerala.",
    "I build useful web applications and software tools."
  ],
  skills: [
    "Frontend: React, JavaScript, HTML, CSS, Tailwind",
    "Backend: Python, Django, Flask, FastAPI, Node.js",
    "Data & delivery: PostgreSQL, Supabase, MongoDB, Docker, Azure"
  ],
  projects: [
    "Student Management Portal · Dottu.AI · Stock Price Visualizer",
    "Field Operations Dashboard · SDN Intrusion Detection",
    "Location Tracker · ESP32 Wi-Fi Human Detection",
    "Customer Relationship Management Software"
  ],
  contact: [
    "Email: Anirudhpjagadeesh@gmail.com",
    "LinkedIn: linkedin.com/in/anirudh-p-jagadeesh/",
    "X: x.com/Anirudh94584172",
    "Kozhikode, Kerala, India"
  ]
};

function appendTerminalLine(text, className = "") {
  const line = document.createElement("p");
  if (className) line.className = className;
  line.textContent = text;
  terminalOutput.append(line);
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;

  appendTerminalLine(`$ ${rawCommand.trim()}`, "terminal-command");

  if (command === "clear") {
    terminalOutput.replaceChildren();
    appendTerminalLine("Terminal cleared. Type help to see available commands.", "terminal-welcome");
  } else if (commandResponses[command]) {
    commandResponses[command].forEach((line) => appendTerminalLine(line));
  } else {
    appendTerminalLine(`Command not found: ${rawCommand.trim()}. Try help.`);
  }

  while (terminalOutput.children.length > 18) {
    terminalOutput.firstElementChild.remove();
  }
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(terminalInput.value);
  terminalInput.value = "";
});

document.querySelectorAll(".terminal-shortcuts button").forEach((button) => {
  button.addEventListener("click", () => runCommand(button.dataset.command));
});

document.querySelector("#clear-terminal").addEventListener("click", () => {
  terminalOutput.replaceChildren();
  appendTerminalLine("Terminal cleared. Type help to see available commands.", "terminal-welcome");
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyEmail() {
  const email = "Anirudhpjagadeesh@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email copied to clipboard");
  } catch {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = email;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.append(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand("copy");
    temporaryInput.remove();
    showToast(copied ? "Email copied to clipboard" : email);
  }
}

document.querySelector("#copy-email").addEventListener("click", copyEmail);

const revealTargets = document.querySelectorAll(
  ".section-heading, .project-card, .timeline-item, .stack-group, .terminal-window, .about-layout, .contact-inner"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
