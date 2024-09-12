<script>
	import DDOSAttack from './DDOSAttack.svelte';
	import DDOSProtection from './DDOSProtection.svelte';

	let inDDOSAttack = true;
</script>

<nav class="navbar">
	<div class="navbar-items">
		<button
			class="nav-item"
			on:click={() => {
				inDDOSAttack = true;
			}}
		>
			DDOS-Attack
		</button>
		<button
			on:click={() => {
				inDDOSAttack = false;
			}}
			class="nav-item">DDOS-Protection</button
		>
	</div>
</nav>

{#if inDDOSAttack}
	<main>
		<DDOSAttack />
	</main>
{:else}
	<main>
		<DDOSProtection />
	</main>
{/if}

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80vh;
	}

	.navbar {
		padding: 2rem;
		width: auto;
		margin: 0 auto;
	}

	.navbar-items {
		display: flex;
		gap: 2rem;
		justify-content: center;
	}

	.nav-item {
		background-color: #414868;
		padding: 1rem 2rem;
		border-radius: 5px;
		cursor: pointer;
		color: white;
		font-size: 1.2rem;
		font-weight: bold;
		transition: transform 0.2s;
		text-align: center;
	}

	.nav-item:hover {
		transform: scale(1.05);
		background-color: #e0af68;
	}
</style>
