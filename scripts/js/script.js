document.addEventListener("DOMContentLoaded", () => {
  const industryDropdown = document.getElementById("industry");
  const applicationDropdown = document.getElementById("application");
  const output = document.getElementById("output");
  const noresult = document.getElementById("noresult");
  const generateBtn = document.getElementById("generateBtn");

  // Fetch JSON data and initialize dropdowns
  fetch("projects.json")
      .then(response => response.json())
      .then(projects => {
          populateDropdown(industryDropdown, getUniqueValues(projects, "industry"));
          populateDropdown(applicationDropdown, getUniqueValues(projects, "application_type"));

          generateBtn.addEventListener("click", () => generateProject(projects));
      })
      .catch(error => console.error("Error loading JSON:", error));

  /**
   * Extract unique values from project data.
   */
  function getUniqueValues(data, key) {
      return [...new Set(data.map(item => item[key]))];
  }

  /**
   * Populate dropdown menu dynamically.
   */
  function populateDropdown(dropdown, values) {
      values.forEach(value => {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = value;
          dropdown.appendChild(option);
      });
  }

  /**
   * Generate a project based on selected filters.
   */
  function generateProject(projects) {
      const industry = industryDropdown.value;
      const application = applicationDropdown.value;

      if (!industry || !application) {
          Swal.fire({
              icon: "warning",
              title: "Missing Selection",
              text: "Please select both Industry and Application Type.",
          });
          return;
      }

      const filteredProjects = projects.filter(p => 
          p.industry === industry && p.application_type.includes(application)
      );

      if (filteredProjects.length > 0) {
          displayProject(filteredProjects[Math.floor(Math.random() * filteredProjects.length)]);
      } else {
          displayNoResults();
      }
  }

  /**
   * Display selected project details.
   */
  function displayProject(project) {
      noresult.classList.add("d-none");
      output.classList.remove("d-none");

      document.getElementById("generatedTitle").innerText = project.title;
      updateTechStack(project.tech_stack);
      updateRespondents(project.target_respondents);
      updateFeatures(project.features);
  }

  /**
   * Handle no matching project found.
   */
  function displayNoResults() {
      document.getElementById("generatedTitle").innerText = "No matching project found.";
      clearProjectDetails();
      output.classList.add("d-none");
      noresult.classList.remove("d-none");
  }

  /**
   * Update technology stack details.
   */
  function updateTechStack(techStack) {
      updateText("frontendTech", techStack.frontend);
      updateText("backendTech", techStack.backend);
      updateText("databaseTech", techStack.database);
      updateText("otherTech", techStack.other);
  }

  /**
   * Update target respondents section.
   */
  function updateRespondents(respondents) {
      updateText("targetRespondents", respondents);
  }

  /**
   * Update features as a numbered list.
   */
  function updateFeatures(features) {
      const featureList = document.getElementById("featureList");
      featureList.innerHTML = "";
      features.forEach((feature, index) => {
          const listItem = document.createElement("li");
          listItem.innerText = `${index + 1}. ${feature}`;
          listItem.classList.add("text-body-tertiary", "fw-semibold", "text-word-break");
          featureList.appendChild(listItem);
      });
  }

  /**
   * Clear project details if no selection is found.
   */
  function clearProjectDetails() {
      ["frontendTech", "backendTech", "databaseTech", "otherTech", "targetRespondents"].forEach(id => {
          document.getElementById(id).innerText = "";
      });
      document.getElementById("featureList").innerHTML = "";
  }

  /**
   * Utility function to update text content safely.
   */
  function updateText(elementId, values) {
      document.getElementById(elementId).innerText = values.length ? values.join(", ") : "N/A";
  }
});