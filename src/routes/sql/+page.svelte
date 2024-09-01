<script>
	import { onMount } from 'svelte';

	let currentView = 'login'; // To switch between login and main app
	let username = '';
	let password = '';
	let loginMessage = '';
	let id = '001';
	let tab = 'home';
	let content = '';
	let isAdmin = false;
	let selectedUserId = '';
	let newRole = '';

	// Simulated database for login
	const usersDb = {
		admin: 'adminpassword',
		user: 'userpassword'
	};

	function handleLogin() {
		// Simulate a vulnerable query
		const injectedUsername = username.replace(/'/g, "\\'"); // Escape single quotes for simulation
		const simulatedQuery = `SELECT * FROM users WHERE username = '${injectedUsername}' AND password = '${password}'`;

		// Simulated vulnerable check (should be done on the server-side in real applications)
		if (usersDb[username] === password) {
			loginMessage = 'Login successful!';
			currentView = 'main';
		} else if (
			username === "admin' OR '1'='1" ||
			(username === "admin' OR 1=1;--" && password != '')
		) {
			loginMessage = 'Login successful! (SQL Injection case)';
			currentView = 'main';
		} else {
			loginMessage = 'Invalid credentials!';
		}
	}
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
		<div class="flex items-center justify-center h-screen bg-gray-100">
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
	{:else}
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
				class="border rounded-md p-2 w-full max-w-4xl mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
				on:change={handleInputChange}
				on:keydown={handleKeyPress}
			/>
		</div>

		<div class="flex-1 overflow-auto">
			<div class="border border-gray-300 p-4 flex flex-wrap space-x-4">
				<button
					id="home"
					class="underline px-2 py-1 text-blue-600 hover:text-blue-800"
					on:click={() => handleButtonClick('home')}>Home</button
				>
				<button
					id="profile"
					class="underline px-2 py-1 text-blue-600 hover:text-blue-800"
					on:click={() => handleButtonClick('profile')}>Profile</button
				>
				<button
					id="course"
					class="underline px-2 py-1 text-blue-600 hover:text-blue-800"
					on:click={() => handleButtonClick('course')}>Courses</button
				>
				<button
					id="assignment"
					class="underline px-2 py-1 text-blue-600 hover:text-blue-800"
					on:click={() => handleButtonClick('assignment')}>Assignments</button
				>
				<button
					id="grades"
					class="underline px-2 py-1 text-blue-600 hover:text-blue-800"
					on:click={() => handleButtonClick('grades')}>Grades</button
				>
				<button
					id="resources"
					class="underline px-2 py-1 text-blue-600 hover:text-blue-800"
					on:click={() => handleButtonClick('resources')}>Resources</button
				>
				<button
					id="settings"
					class="underline px-2 py-1 text-blue-600 hover:text-blue-800"
					on:click={() => handleButtonClick('settings')}>Settings</button
				>
				{#if isAdmin}
					<button
						id="admin"
						class="underline px-2 py-1 text-blue-600 hover:text-blue-800"
						on:click={() => handleButtonClick('admin')}>Admin</button
					>
				{/if}
			</div>
			<div class="content border border-gray-300 p-4 bg-white rounded-lg mt-4">
				{@html content}
			</div>
			{#if tab === 'admin'}
				<div class="content border border-gray-300 p-4 bg-white rounded-lg mt-4">
					<h2 class="text-xl font-bold mb-4">Admin Controls</h2>
					<label for="userSelect" class="block text-gray-700 font-medium mb-2">Select User:</label>
					<select
						id="userSelect"
						on:change={handleUserSelect}
						class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
					>
						<option value="">Select User</option>
						{#each Object.keys(userData) as uid}
							<option value={uid}>{userData[uid].name}</option>
						{/each}
					</select>

					<label for="roleSelect" class="block text-gray-700 font-medium mb-2"
						>Change Role to:</label
					>
					<select
						id="roleSelect"
						on:change={handleRoleSelect}
						class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
					>
						<option value="Student">Student</option>
						<option value="Teacher">Teacher</option>
						<option value="Admin">Admin</option>
					</select>

					<button
						on:click={confirmRoleChange}
						class="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
						>Confirm</button
					>
				</div>
			{/if}
		</div>
	{/if}
</main>
