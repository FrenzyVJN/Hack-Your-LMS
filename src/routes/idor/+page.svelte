<script lang="ts">
	import { onMount } from 'svelte';

	type UserData = {
		[key: string]: {
			name: string;
			email: string;
			role: string;
		};
	};

	onMount(() => {
		const buttons = document.querySelectorAll('.browser-frame button');
		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				button.classList.toggle('active');
				console.log(button.classList.contains('active'));
			});
		});
		tab = 'home';
		content = `<b>Welcome to the Learning Management System (LMS) at Shiv Nadar University, Chennai !!</b><br><br> Based in a sprawling campus of 250 acres, Shiv Nadar University, Chennai is committed to academic excellence. Each program is designed to help talented students become a successful, job-ready professional or a world-class academic. The University promotes a culture of academic rigour, supported by ample resources, including one of the best-equipped libraries in Southern India, and extensive, world-class research facilities. The University strongly believes that its role is not limited to disseminating knowledge but to act as a catalyst for research, discovery and creation of new forms of expression and aims to become a world-class centre for research. Driven by a belief in the need for all-round development, students are provided ample sports facilities and rich campus life.`;
	});

	let id = '001';
	let tab = 'home';
	let content = '';
	let isAdmin = false;
	let selectedUserId = '';

	const userData: UserData = {
		'001': { name: 'Alice', email: 'alice@example.com', role: 'Student' },
		'002': { name: 'Bob', email: 'bob@example.com', role: 'Teacher' },
		'003': { name: 'Charlie', email: 'charlie@example.com', role: 'Student' },
		'004': { name: 'Diana', email: 'diana@example.com', role: 'Admin' },
		'005': { name: 'Edward', email: 'edward@example.com', role: 'Student' }
	};

	function handleButtonClick(buttonId: string) {
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
			content = `<b>Welcome to the Learning Management System (LMS) at Shiv Nadar University, Chennai !!</b><br><br>Based in a sprawling campus of 250 acres, Shiv Nadar University, Chennai is committed to academic excellence. Each program is designed to help talented students become a successful, job-ready professional or a world-class academic. The University promotes a culture of academic rigour, supported by ample resources, including one of the best-equipped libraries in Southern India, and extensive, world-class research facilities. The University strongly believes that its role is not limited to disseminating knowledge but to act as a catalyst for research, discovery and creation of new forms of expression and aims to become a world-class centre for research. Driven by a belief in the need for all-round development, students are provided ample sports facilities and rich campus life.`;
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

<main class="border bg-white">
	<div class="bg-gray-200 border-b border-gray-300 p-4 flex items-center justify-between">
		<div class="flex space-x-2">
			<a href="/"><div class="w-3 h-3 rounded-full bg-red-500"></div></a>
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

<style>
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
