<script>
    import { onMount } from "svelte";
  
    onMount(() => {
      // Adding event listeners to buttons
      const buttons = document.querySelectorAll(".browser-frame button");
      buttons.forEach(button => {
        button.addEventListener("click", () => {
          button.classList.toggle("active");
          console.log(button.classList.contains("active"));
        });
      });
    });
    let id = "001";
    let tab = "profile";
    function handleButtonClick(buttonId) {
        if (tab === buttonId) {
            return;
        }
        if(buttonId=== "profile"){
            console.log("test")
            tab = "user/" + buttonId + "?id=" + id;
        }
        else{
            tab = buttonId;
        }
    console.log(`Button clicked: ${buttonId}`);
    document.getElementById("url").value = `lms.snuchennai.edu.in/${tab}`;

    
  }
  function handleInputChange(event) {
    let url = event.target.value;
    let slicedUrl = url.slice(-3, url.length);
    console.log(`id: ${slicedUrl}`);
    console.log(`Input changed: ${url}`);
  }
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      console.log(`Enter key pressed: ${event.target.value}`);
    }
  }
  </script>
  
  <style>
    .browser-button.active {
      background-color: #0066ff;
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
        value="lms.snuchennai.edu.in/user/profile?id={id}"
        class="border rounded-md p-2 w-full max-w-4xl mx-auto"
        on:change={handleInputChange}
        on:keydown={handleKeyPress}  
      />
    </div>
  
    <div class="flex-1 overflow-auto">
      <div class="border border-gray-300 p-4">
        <button id="profile" class="ml-4 underline px-2 py-1" on:click={()=>handleButtonClick('profile')}>Profile</button>
        <button id="course" class="ml-4 underline px-2 py-1" on:click={()=>handleButtonClick('course')}>Courses</button>
        <button id="assignment" class="ml-4 underline px-2 py-1" on:click={()=>handleButtonClick('assignment')}>Assignments</button>
        <button id="grades" class="ml-4 underline px-2 py-1" on:click={()=>handleButtonClick('grades')}>Grades</button>
        <button id="resources" class="ml-4 underline px-2 py-1" on:click={()=>handleButtonClick('resources')}>Resources</button>
        <button id="settings" class="ml-4 underline px-2 py-1" on:click={()=>handleButtonClick('settings')}>Settings</button>
      </div>
    </div>
  </main>
  