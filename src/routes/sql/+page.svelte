<script lang="ts">
	type UserData = {
		[key: string]: {
			name: string;
			email: string;
			role: string;
		};
	};

	type UserDB = {
		[key: string]: string;
	};

	let currentView = 'login';
	let username = '';
	let password = '';
	let loginMessage = '';

	const usersDb: UserDB = {
		admin: 'adminpassword',
		user: 'userpassword'
	};

	function handleLogin() {
		if (usersDb[username] === password) {
			loginMessage = 'Login successful!';
			currentView = 'main';
		} else if (!password) {
			loginMessage = 'Please enter a password!';
		} else if (username === "admin' OR '1'='1" || username === "admin' OR 1=1;--") {
			loginMessage = 'Login successful! (SQL Injection case)';
			currentView = 'main';
		} else {
			loginMessage = 'Invalid credentials!';
		}
	}

	let id = '001';
	let tab = 'login';
	let content =
		'<b>Welcome to the Learning Management System (LMS) at Shiv Nadar University, Chennai !!</b><br><br> Based in a sprawling campus of 250 acres, Shiv Nadar University, Chennai is committed to academic excellence. Each program is designed to help talented students become a successful, job-ready professional or a world-class academic. The University promotes a culture of academic rigour, supported by ample resources, including one of the best-equipped libraries in Southern India, and extensive, world-class research facilities. The University strongly believes that its role is not limited to disseminating knowledge but to act as a catalyst for research, discovery and creation of new forms of expression and aims to become a world-class centre for research. Driven by a belief in the need for all-round development, students are provided ample sports facilities and rich campus life.';
	let isAdmin = false;
	let selectedUserId = '';

	const userData: UserData = {
		'001': { name: 'Alice', email: 'alice@example.com', role: 'Student' },
		'002': { name: 'Bob', email: 'bob@example.com', role: 'Teacher' },
		'003': { name: 'Charlie', email: 'charlie@example.com', role: 'Student' },
		'004': { name: 'Diana', email: 'diana@example.com', role: 'Admin' },
		'005': { name: 'Edward', email: 'edward@example.com', role: 'Student' }
	};

	function handleButtonClick(buttonId) {
		if (tab === buttonId) {
			return;
		}
		if (buttonId === 'profile') {
			updateContent();
			tab = 'user/' + buttonId + '?id=' + id;
			content = userData[id]
				? `Name: ${userData[id].name}<br>Email: ${userData[id].email}<br>Role: ${userData[id].role}`
				: 'No user data available.';
		} else if (buttonId === 'home') {
			tab = buttonId;
			content = `<b>Welcome to the Learning Management System (LMS) at Shiv Nadar University, Chennai !!</b><br><br> Based in a sprawling campus of 250 acres, Shiv Nadar University, Chennai is committed to academic excellence. Each program is designed to help talented students become a successful, job-ready professional or a world-class academic. The University promotes a culture of academic rigour, supported by ample resources, including one of the best-equipped libraries in Southern India, and extensive, world-class research facilities. The University strongly believes that its role is not limited to disseminating knowledge but to act as a catalyst for research, discovery and creation of new forms of expression and aims to become a world-class centre for research. Driven by a belief in the need for all-round development, students are provided ample sports facilities and rich campus life.`;
		} else if (buttonId === 'settings') {
			tab = buttonId;
			content = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-5xl mx-auto">
  <div class="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
    <div class="font-semibold text-lg mb-2">User details</div>
    <p class="mb-2">
      <strong>Email address:</strong> 
      <a href="mailto:saran23110050@snuchennai.edu.in" class="text-blue-600 hover:underline">
        ${username.startsWith('admin') ? 'admin' : username}@snuchennai.edu.in
      </a> 
      (Visible to other course participants)
    </p>
    <a href="#" class="text-blue-600 hover:underline">Edit profile</a>
  </div>

  <div class="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
    <div class="font-semibold text-lg mb-2">Miscellaneous</div>
    <ul class="list-disc list-inside">
      <li><a href="#" class="text-blue-600 hover:underline">Blog entries</a></li>
      <li><a href="#" class="text-blue-600 hover:underline">Forum posts</a></li>
      <li><a href="#" class="text-blue-600 hover:underline">Forum discussions</a></li>
      <li><a href="#" class="text-blue-600 hover:underline">Learning plans</a></li>
    </ul>
  </div>

  <div class="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
    <div class="font-semibold text-lg mb-2">Privacy and policies</div>
    <a href="#" class="text-blue-600 hover:underline">Data retention summary</a>
  </div>

  <div class="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
    <div class="font-semibold text-lg mb-2">Reports</div>
    <ul class="list-disc list-inside">
      <li><a href="#" class="text-blue-600 hover:underline">Browser sessions</a></li>
      <li><a href="#" class="text-blue-600 hover:underline">Grades overview</a></li>
    </ul>
  </div>
</div>`;
		} else if (buttonId === 'admin') {
			tab = buttonId;
			content = `Admin Controls`;
		} else {
			tab = buttonId;
			content = `Content for ${buttonId}`;
		}
		console.log(`Button clicked: ${buttonId}`);
		document.getElementById('url').value = `lms.snuchennai.edu.in/${tab}`;
	}

	function handleInputChange(event) {
		let url = event.target.value;
		let slicedUrl = url.split('?id=')[1];
		if (slicedUrl && userData[slicedUrl]) {
			id = slicedUrl;
			content = `Name: ${userData[id].name}<br>Email: ${userData[id].email}<br>Role: ${userData[id].role}`;
			getRole();
		} else {
			content = 'No user data available.';
		}
		console.log(`ID extracted: ${id}`);
		console.log(`Input changed: ${url}`);
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			console.log(`Enter key pressed: ${event.target.value}`);
		}
	}

	function handleUserSelect(event) {
		id = event.target.value;
		updateContent();
	}
	let newRole = '';
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
		if (userRole === 'Admin') {
			isAdmin = true;
		} else {
			isAdmin = false;
		}
	}
</script>

<main class="min-h-screen w-screen border border-black bg-white">
	{#if currentView === 'login'}
		<div class="bg-gray-100 min-h-screen">
			<div class="bg-gray-200 border-b border-gray-300 p-4 flex items-center justify-between">
				<div class="flex space-x-2">
					<a href="/"><div class="w-3 h-3 rounded-full bg-red-500 cursor-pointer"></div></a>
					<div class="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"></div>
					<div class="w-3 h-3 rounded-full bg-green-500 cursor-pointer"></div>
				</div>
				<input
					id="url"
					type="text"
					value="lms.snuchennai.edu.in/login"
					class="border rounded-md p-2 w-full max-w-4xl mx-auto"
					on:change={handleInputChange}
					on:keydown={handleKeyPress}
				/>
			</div>

			<div class="bg-gray-100 border-b border-gray-300 p-6 flex items-center">
				<div>
					<div class="w-6 h-4 flex flex-col justify-between cursor-pointer">
						<span class="block h-0.5 bg-gray-800"></span>
						<span class="block h-0.5 bg-gray-800"></span>
						<span class="block h-0.5 bg-gray-800"></span>
					</div>
				</div>
				<div class="flex px-5">snulms</div>
			</div>

			<div class="flex items-center justify-center mt-20">
				<div class="bg-white p-8 rounded-lg shadow-md w-96">
					<h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
					<input
						id="username"
						type="text"
						placeholder="Username"
						bind:value={username}
						class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
					/>

					<input
						id="password"
						type="password"
						placeholder="Password"
						bind:value={password}
						class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
					/>

					<button
						on:click={handleLogin}
						class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
						>Login</button
					>

					{#if loginMessage}
						<p class="text-red-500 mt-4 text-center">{loginMessage}</p>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<main class="border bg-white">
			<div class="bg-gray-200 border-b border-gray-300 p-4 flex items-center justify-between">
				<div class="flex space-x-2">
					<a href="/"><div class="w-3 h-3 rounded-full bg-red-500 cursor-pointer"></div></a>
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

			<div class="bg-gray-100 border-b border-gray-300 p-6 flex items-center">
				<a href="/">
					<div class="w-6 h-4 flex flex-col justify-between cursor-pointer">
						<span class="block h-0.5 bg-gray-800"></span>
						<span class="block h-0.5 bg-gray-800"></span>
						<span class="block h-0.5 bg-gray-800"></span>
					</div>
				</a>
				<div class="flex px-5">snulms</div>
			</div>

			<div class="flex overflow-auto">
				<div class="p-4 w-64">
					<div class="flex flex-col mb-auto">
						<button
							id="home"
							class="flex items-center px-4 py-2 border hover:bg-blue-500 hover:text-white"
							on:click={() => handleButtonClick('home')}
						>
							<span class="ml-2">Home</span>
						</button>
						<button
							id="profile"
							class="flex items-center px-4 py-2 border hover:bg-blue-500 hover:text-white"
							on:click={() => handleButtonClick('profile')}
						>
							<span class="ml-2">Profile</span>
						</button>
						<button
							id="course"
							class="flex items-center px-4 py-2 border hover:bg-blue-500 hover:text-white"
							on:click={() => handleButtonClick('course')}
						>
							<span class="ml-2">Courses</span>
						</button>
						<button
							id="assignment"
							class="flex items-center px-4 py-2 border hover:bg-blue-500 hover:text-white"
							on:click={() => handleButtonClick('assignment')}
						>
							<span class="ml-2">Assignments</span>
						</button>
						<button
							id="grades"
							class="flex items-center px-4 py-2 border hover:bg-blue-500 hover:text-white"
							on:click={() => handleButtonClick('grades')}
						>
							<span class="ml-2">Grades</span>
						</button>
						<button
							id="resources"
							class="flex items-center px-4 py-2 border hover:bg-blue-500 hover:text-white"
							on:click={() => handleButtonClick('resources')}
						>
							<span class="ml-2">Resources</span>
						</button>
						<button
							id="settings"
							class="flex items-center px-4 py-2 border hover:bg-blue-500 hover:text-white"
							on:click={() => handleButtonClick('settings')}
						>
							<span class="ml-2">Settings</span>
						</button>
						{#if isAdmin}
							<button
								id="admin"
								class="flex items-center px-4 py-2 border hover:bg-blue-500 hover:text-white"
								on:click={() => handleButtonClick('admin')}
							>
								<span class="ml-2">Admin</span>
							</button>
						{/if}
					</div>
				</div>

				<div class="content pl-4 mb-6">
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

				<div></div>
			</div>
		</main>
	{/if}
</main>

<style>
	.content {
		border: 1px solid #ddd;
		padding: 16px;
		margin-top: 16px;
		background-color: #f9f9f9;
	}
</style>
