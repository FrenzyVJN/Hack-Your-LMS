<script>
    import { onMount } from "svelte";
    
    let showTutorial = true;
    let currentStep = 0;
    let tutorialFinished = false;
  
    let id = "001"; 
    let tab = "home";
    let content = "";
    let isAdmin = false; 
    let selectedUserId = "";
    let newRole = "";
  
    const userData = {
      "001": { name: "Alice", email: "alice@example.com", role: "Student" },
      "002": { name: "Bob", email: "bob@example.com", role: "Teacher" },
      "003": { name: "Charlie", email: "charlie@example.com", role: "Student" },
      "004": { name: "Diana", email: "diana@example.com", role: "Admin" },
      "005": { name: "Edward", email: "edward@example.com", role: "Student" }
    };
  
    function handleButtonClick(buttonId) {
      if (tab === buttonId) return;
      if (buttonId === "profile") {
        updateContent();
        tab = "user/" + buttonId + "?id=" + id;
        content = userData[id] 
          ? `Name: ${userData[id].name}<br>Email: ${userData[id].email}<br>Role: ${userData[id].role}` 
          : "No user data available.";
      } else if (buttonId === "admin") {
        tab = buttonId;
        content = `Admin Controls`;
      } else {
        tab = buttonId;
        content = `Content for ${buttonId}`;
      }
      document.getElementById("url").value = `lms.snuchennai.edu.in/${tab}`;
      if (showTutorial) {
        nextStep();
      }
    }
  
    function handleInputChange(event) {
      let url = event.target.value;
      let slicedUrl = url.split('?id=')[1];
      if (slicedUrl && userData[slicedUrl]) {
        id = slicedUrl;
        content = `Name: ${userData[id].name}<br>Email: ${userData[id].email}<br>Role: ${userData[id].role}`;
        getRole();
      } else {
        content = "No user data available.";
      }
      console.log(`ID extracted: ${id}`);
      console.log(`Input changed: ${url}`);
    }
  
    function handleKeyPress(event) {
      if (event.key === "Enter") {
        console.log(`Enter key pressed: ${event.target.value}`);
      }
    }
  
    function handleUserSelect(event) {
      id = event.target.value;
      updateContent();
      if (showTutorial && currentStep === 3) {
        nextStep();
      }
    }
  
    function handleRoleSelect(event) {
      newRole = event.target.value;
      if (showTutorial && currentStep === 4) {
        nextStep();
      }
    }
  
    function confirmRoleChange() {
      userData[id].role = newRole;
      if (selectedUserId === id) {
        updateContent();
      }
      console.log(`Role for user ${selectedUserId} changed to ${newRole}`);
      if (showTutorial && currentStep === 5) {
        nextStep();
      }
    }
  
    function updateContent() {
      console.log(`User selected: ${id}`);
    }
  
    function getRole() {
      const userRole = userData[id].role;
      isAdmin = userRole === "Admin";
    }
  
    function nextStep() {
      if (currentStep < tutorialSteps.length - 1) {
        currentStep += 1;
      } else {
        tutorialFinished = true;
        showTutorial = false;
      }
    }
  
    function prevStep() {
      if (currentStep > 0) {
        currentStep -= 1;
      }
    }
  
    const tutorialSteps = [
        "test",
      "Welcome to the IDOR simulation! This tutorial will guide you through understanding Insecure Direct Object Reference (IDOR) vulnerabilities.",
      "Navigate to profile tab",
      "First, try changing the 'id' in the URL to see different user profiles. For example, change the URL to 'profile?id=002' to view Bob's profile.",
      "Notice how the content changes when you manipulate the URL. This demonstrates how IDOR can expose user data.",
      "Next, access the Admin Controls by clicking on the 'Admin' button (if available). From there, you can change user roles.",
      "Select a user from the dropdown and choose a new role for them. Click 'Confirm' to apply the changes.",
      "In a real application, server-side checks are essential to prevent unauthorized access and modifications. You can now explore the simulation freely."
    ];
  
    onMount(() => {
      // Initiate the tutorial
      nextStep();
    });
  </script>
  
  <style>
    .tutorial-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      z-index: 1000;
    }
    .tutorial-content {
      background: #333;
      padding: 20px;
      border-radius: 8px;
      max-width: 600px;
      text-align: center;
    }
    .tutorial-button {
      margin: 10px;
      padding: 10px 20px;
      border: none;
      background: #0066ff;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
    .tutorial-button:hover {
      background: #0044cc;
    }
    .interactive-section {
      margin-top: 20px;
      border: 1px solid #ddd;
      padding: 16px;
      background-color: #f9f9f9;
    }
  </style>
  
  <main class="min-h-screen w-screen border border-black bg-white">
    {#if showTutorial}
      <div class="tutorial-modal">
        <div class="tutorial-content">
          <p>{tutorialSteps[currentStep]}</p>
          <div>
            <button class="tutorial-button" on:click={prevStep} disabled={currentStep === 0}>Previous</button>
            <button class="tutorial-button" on:click={nextStep} disabled={tutorialFinished}>Next</button>
            <button class="tutorial-button" on:click={() => showTutorial = false}>Close Tutorial</button>
          </div>
        </div>
      </div>
    {/if}
  
    <div class="bg-gray-100 border-b border-gray-300 p-4 flex items-center justify-between">
      <div class="flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-red-500 cursor-pointer"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"></div>
        <div class="w-3 h-3 rounded-full bg-green-500 cursor-pointer"></div>
      </div>
      <input
        id="url"
        type="text"
        value="lms.snuchennai.edu.in/home"
        class="border rounded-md p-2 w-full max-w-4xl mx-auto"
        on:change={handleInputChange}
        on:keydown={handleKeyPress}  
      />
    </div>
  
    <div class="flex-1 overflow-auto">
      <div class="border border-gray-300 p-4">
        <button id="home" class="underline px-2 py-1" on:click={() => handleButtonClick('home')}>Home</button>
        <button id="profile" class="ml-4 underline px-2 py-1" on:click={() => handleButtonClick('profile')}>Profile</button>
        <button id="course" class="ml-4 underline px-2 py-1" on:click={() => handleButtonClick('course')}>Courses</button>
        <button id="assignment" class="ml-4 underline px-2 py-1" on:click={() => handleButtonClick('assignment')}>Assignments</button>
        <button id="grades" class="ml-4 underline px-2 py-1" on:click={() => handleButtonClick('grades')}>Grades</button>
        <button id="resources" class="ml-4 underline px-2 py-1" on:click={() => handleButtonClick('resources')}>Resources</button>
        <button id="settings" class="ml-4 underline px-2 py-1" on:click={() => handleButtonClick('settings')}>Settings</button>
        {#if isAdmin}
          <button id="admin" class="ml-4 underline px-2 py-1" on:click={() => handleButtonClick('admin')}>Admin</button>
        {/if}
      </div>
  
      <div class="content interactive-section">
        {@html content}
      </div>
  
      {#if tab === 'admin'}
        <div class="content interactive-section">
          <h2>Admin Controls</h2>
          <label for="userSelect">Select User:</label>
          <select id="userSelect" on:change={handleUserSelect}>
            <option value="">Select User</option>
            {#each Object.keys(userData) as uid}
              <option value={uid}>{userData[uid].name}</option>
            {/each}
          </select>
          <label for="roleSelect">Change Role to:</label>
          <select id="roleSelect" on:change={handleRoleSelect}>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
          </select>
          <button on:click={confirmRoleChange}>Confirm</button>
        </div>
      {/if}
    </div>
  </main>
  