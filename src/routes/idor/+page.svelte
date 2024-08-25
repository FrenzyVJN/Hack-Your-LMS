<script>
    import { onMount } from "svelte";
  
    onMount(() => {
      const buttons = document.querySelectorAll(".browser-frame button");
      buttons.forEach(button => {
        button.addEventListener("click", () => {
          button.classList.toggle("active");
          console.log(button.classList.contains("active"));
        });
      });
    });
  
    let id = "001"; 
    let tab = "home";
    let content = "";
    let isAdmin = false; 
    let selectedUserId = "";
    // Sample data for users
    const userData = {
      "001": { name: "Alice", email: "alice@example.com", role: "Student" },
      "002": { name: "Bob", email: "bob@example.com", role: "Teacher" },
      "003": { name: "Charlie", email: "charlie@example.com", role: "Student" },
      "004": { name: "Diana", email: "diana@example.com", role: "Admin" },
      "005": { name: "Edward", email: "edward@example.com", role: "Student" }
    };
  
    function handleButtonClick(buttonId) {
      if (tab === buttonId) {
        return;
      }
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
      console.log(`Button clicked: ${buttonId}`);
      document.getElementById("url").value = `lms.snuchennai.edu.in/${tab}`;
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
    }
    let newRole = "";
    function handleRoleSelect(event) {
        newRole = event.target.value;
        updateContent();
        console.log(`Role for user ${id} changed to ${newRole}`);
    }
  function confirmRoleChange() {
      userData[id].role = newRole;
      if (selectedUserId === id) {
        updateContent();
      }
      console.log(`Role for user ${selectedUserId} changed to ${newRole}`);
    } 
  
    function updateContent() {
      console.log(`User selected: ${id}`);
    }
  
    function getRole() {
      const userRole = userData[id].role;
      if (userRole === "Admin") {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
    }
  </script>
  
  <style>
    .browser-button.active {
      background-color: #0066ff;
    }
    .content {
      border: 1px solid #ddd;
      padding: 16px;
      margin-top: 16px;
      background-color: #f9f9f9;
    }
    select {
      display: block;
      margin-bottom: 10px;
    }
  </style>
  
  <main class="min-h-screen w-screen border border-black bg-white">
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
      <div class="content">
        {@html content}
      </div>
      {#if tab === 'admin'}
    <div class="content">
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
  
      <div>
  
      </div>
    </div>
  </main>
  