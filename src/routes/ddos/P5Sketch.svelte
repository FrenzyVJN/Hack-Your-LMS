<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import p5Sketch from './sketch';
	import { processedPackets, queueLength, droppedPackets, serverStatus } from './stores';

	let sketchRef;
	let color = '#e84143';
	let latestTimeout;

	$: {
		console.log($serverStatus);
		if ($serverStatus === 0) {
			clearTimeout(latestTimeout);
			latestTimeout = setTimeout(() => {
				color = '#e84143';
			}, 1000);
		} else {
			clearTimeout(latestTimeout);
			color = '#139c69';
		}
	}

	onMount(() => {
		if (!browser) return;

		async () => {
			const p5 = await import('p5');
			const sketch = p5Sketch;
			const myP5 = new p5(sketch, sketchRef);

			return () => {
				myP5.remove();
			};
		};
	});
</script>

<main bind:this={sketchRef}></main>

<div class="status-box">
	<div class="status-header">
		<span class="status-title">Server Status</span>
		<div class="status-indicator" style="background-color: {color}"></div>
	</div>
	<div class="detail-row">
		<span>Processed Packets:</span>
		<span>{$processedPackets}</span>
	</div>
	<div class="detail-row">
		<span>Dropped Packets:</span>
		<span>{$droppedPackets}</span>
	</div>
	<div class="status-details">
		<div class="detail-row">
			<span>Queue Length:</span>
			<span>{$queueLength}</span>
		</div>
		<div class="detail-row">
			<span>Server Status:</span>
			<span>{$serverStatus == 0 ? 'Idle' : 'Processing'}</span>
		</div>
	</div>
</div>

<style>
	main {
		border: 3px solid black;
		box-shadow: 10px 10px 0px 0px #000;
	}

	.status-box {
		background-color: white;
		color: black;
		padding: 16px;
		width: 300px;
		margin: 40px auto;
		font-family: 'Inter', sans-serif;
		text-align: left;
		border: 2px solid black;
		box-shadow: 5px 5px 0px 0px #000;
	}

	.status-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		font-size: 30px;
	}

	.status-title {
		font-weight: bold;
		padding: 4px;
		border-radius: 4px;
	}

	.status-indicator {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		margin-right: 5px;
	}

	.status-details {
		display: flex;
		flex-direction: column;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-size: 1em;
	}

	.detail-row span {
		padding: 2px 4px;
		border-radius: 4px;
	}
</style>
