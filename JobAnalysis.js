// Job class to encapsulate job details
class Job {
  constructor(title, posted, type, level, skill, detail) {
    this.title = title;
    this.posted = posted;
    this.type = type;
    this.level = level;
    this.skill = skill;
    this.detail = detail;
  }

  // Return job details as HTML
  getDetails() {
    return `
      <strong>${this.title}</strong>
      <p><strong>Posted:</strong> ${this.posted}</p>
      <p><strong>Type:</strong> ${this.type}</p>
      <p><strong>Level:</strong> ${this.level}</p>
      <p><strong>Skill:</strong> ${this.skill}</p>
      <p><strong>Detail:</strong> ${this.detail}</p>
    `;
  }
}

// DOM elements
const fileInput = document.getElementById("fileInput");
const errorMessage = document.getElementById("error-message");
const jobsContainer = document.getElementById("jobsContainer");
const levelFilter = document.getElementById("levelFilter");
const typeFilter = document.getElementById("typeFilter");
const skillFilter = document.getElementById("skillFilter");
const detailsSection = document.getElementById("job-details");

// Arrays to store job data
let jobs = []; // The full list of jobs
let filteredJobs = []; // The filtered list of jobs (initially the same as jobs)

// File upload handler
fileInput.addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        jobs = data.map(
          (job) =>
            new Job(
              job.Title,
              job.Posted,
              job.Type,
              job.Level,
              job.Skill,
              job.Detail
            )
        );
        filteredJobs = [...jobs]; // Initialize filteredJobs to include all jobs
        populateFilters(); // Populate filter dropdowns
        displayJobs(filteredJobs); // Display all jobs initially
        errorMessage.classList.add("hidden");
      } catch (error) {
        errorMessage.textContent = "Invalid JSON file.";
        errorMessage.classList.remove("hidden");
      }
    };
    reader.readAsText(file);
  }
}

// Populate filter dropdowns dynamically
function populateFilters() {
  const levels = [...new Set(jobs.map((job) => job.level))];
  const types = [...new Set(jobs.map((job) => job.type))];
  const skills = [...new Set(jobs.map((job) => job.skill))];
  populateDropdown(levelFilter, levels);
  populateDropdown(typeFilter, types);
  populateDropdown(skillFilter, skills);
}

function populateDropdown(dropdown, options) {
  dropdown.innerHTML = '<option value="">All</option>';
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    dropdown.appendChild(opt);
  });
}

// Display jobs in the job list
function displayJobs(jobsToDisplay) {
  jobsContainer.innerHTML = ""; // Clear the container
  jobsToDisplay.forEach((job) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${job.title}</strong> <br> <small>${job.posted}</small>`;
    li.addEventListener("click", () => showJobDetails(job)); // Add click event to show details
    jobsContainer.appendChild(li);
  });
}

// Show job details near the filters and sorting area
function showJobDetails(job) {
  detailsSection.innerHTML = `
    <h3>${job.title}</h3>
    <p><strong>Posted:</strong> ${job.posted}</p>
    <p><strong>Type:</strong> ${job.type}</p>
    <p><strong>Level:</strong> ${job.level}</p>
    <p><strong>Skill:</strong> ${job.skill}</p>
    <p><strong>Detail:</strong> ${job.detail}</p>
  `;
  detailsSection.scrollIntoView({ behavior: "smooth" }); // Scroll to details section
}

// Filter jobs based on selected criteria
function filterJobs() {
  const level = levelFilter.value;
  const type = typeFilter.value;
  const skill = skillFilter.value;

  // Filter jobs based on the selected filters
  filteredJobs = jobs.filter((job) => {
    return (
      (level === "" || job.level === level) &&
      (type === "" || job.type === type) &&
      (skill === "" || job.skill === skill)
    );
  });

  displayJobs(filteredJobs); // Display the filtered jobs
}

// Add event listeners for filters
levelFilter.addEventListener("change", filterJobs);
typeFilter.addEventListener("change", filterJobs);
skillFilter.addEventListener("change", filterJobs);

// Sorting functions
document.getElementById("sortTitle").addEventListener("click", () => {
  filteredJobs.sort((a, b) => a.title.localeCompare(b.title)); // Sort filtered jobs by title
  displayJobs(filteredJobs); // Redisplay sorted jobs
});

document.getElementById("sortMostRecent").addEventListener("click", () => {
  filteredJobs.sort((a, b) => parsePostedTime(a.posted) - parsePostedTime(b.posted)); // Sort filtered jobs by most recent
  displayJobs(filteredJobs); // Redisplay sorted jobs
});

document.getElementById("sortOldest").addEventListener("click", () => {
  filteredJobs.sort((a, b) => parsePostedTime(b.posted) - parsePostedTime(a.posted)); // Sort filtered jobs by oldest
  displayJobs(filteredJobs); // Redisplay sorted jobs
});

// Helper function to parse "Posted" time strings into minutes
function parsePostedTime(postedTime) {
  const timeParts = postedTime.split(" ");
  const number = parseInt(timeParts[0], 10);
  const unit = timeParts[1];
  if (unit.startsWith("minute")) return number;
  if (unit.startsWith("hour")) return number * 60;
  if (unit.startsWith("day")) return number * 1440;
  if (unit.startsWith("week")) return number * 10080;
  return Number.MAX_SAFE_INTEGER;
}
