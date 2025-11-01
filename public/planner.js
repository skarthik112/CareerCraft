document.getElementById("planner-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const idea = document.getElementById("idea").value.trim();
  const domain = document.getElementById("domain").value;
  const duration = document.getElementById("duration").value;
  const teamSize = document.getElementById("teamSize").value;
  const complexity = document.getElementById("complexity").value;

  if (!idea) {
    alert("Please enter your project idea!");
    return;
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Generating Plan...";
  }

  try {
    const res = await fetch("/api/project-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, domain, duration, teamSize, complexity }),
    });

    const data = await res.json();
    console.log("Planner response:", data);

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    // Show results section
    document.getElementById("results").style.display = "block";

    document.getElementById("overview").textContent = data.overview || "—";

    // Requirements
    const reqList = document.getElementById("requirements");
    reqList.innerHTML = "";
    (data.requirements || []).forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      reqList.appendChild(li);
    });

    // Roadmap
    const roadmapList = document.getElementById("roadmap");
    roadmapList.innerHTML = "";
    (data.roadmap || []).forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      roadmapList.appendChild(li);
    });

    // Roles
    const rolesDiv = document.getElementById("roles");
    rolesDiv.innerHTML = "";
    (data.roles || []).forEach(role => {
      const div = document.createElement("div");
      div.className = "role-card";
      div.innerHTML = `<strong>${role.role}</strong>: ${role.responsibilities.join(", ")}`;
      rolesDiv.appendChild(div);
    });

    // Timeline
    const timelineList = document.getElementById("timeline");
    timelineList.innerHTML = "";
    (data.timeline || []).forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.milestone} → ${t.time}`;
      timelineList.appendChild(li);
    });

    // Deliverables
    const deliverablesList = document.getElementById("deliverables");
    deliverablesList.innerHTML = "";
    (data.deliverables || []).forEach(d => {
      const li = document.createElement("li");
      li.textContent = d;
      deliverablesList.appendChild(li);
    });

    // Risks
    const risksList = document.getElementById("risks");
    risksList.innerHTML = "";
    (data.risks || []).forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      risksList.appendChild(li);
    });

    document.getElementById("suggestions").textContent = data.suggestions || "—";

    // Scroll to results
    document.getElementById("results").scrollIntoView({ behavior: "smooth" });

  } catch (err) {
    console.error("Planner fetch error:", err);
    alert("Failed to generate project plan. Check console for details.");
  } finally {
    // Reset button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Generate Plan";
    }
  }
});

// PDF download (enhanced to include all sections)
document.getElementById("download-plan").addEventListener("click", () => {
  const resultsDiv = document.getElementById("results");
  
  if (resultsDiv.style.display === "none") {
    alert("Please generate a project plan first!");
    return;
  }

  const content = document.getElementById("results").innerText;
  const timestamp = new Date().toISOString().split('T')[0];
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `project_plan_${timestamp}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
