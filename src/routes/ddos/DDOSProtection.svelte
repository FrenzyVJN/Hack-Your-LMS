<script>
	import P5 from 'p5-svelte';

	let processedPackets = 0;
	let serverStatus = 0;
	let droppedPackets = 0;
	let queueLength = 0;
	let color = '#e84143';
	let latestTimeout;

	$: {
		console.log(serverStatus);
		if (serverStatus === 0) {
			clearTimeout(latestTimeout);
			latestTimeout = setTimeout(() => {
				color = '#e84143';
			}, 1000);
		} else {
			clearTimeout(latestTimeout);
			color = '#139c69';
		}
	}

	/** @param {import("p5-svelte").p5} p5 */
	const sketch = (p5) => {
		/**
		 * @typedef {Object} Circle
		 * @property {number} x
		 * @property {number} y
		 * @property {number} diameter
		 * @property {number} angle
		 * @property {string} state
		 * @property {number} queuePos
		 * @property {import("p5").Color} color
		 * @property {import("p5").Color} targetColor
		 * @property {number} colorTransitionSpeed
		 * @property {number} vx
		 * @property {number} vy
		 * @property {number} gravity
		 * @property {number} startTransitionTime
		 */

		/** @type {{ x: number, y: number }} */
		let buttonPos;
		/** @type {{ x: number, y: number }} */
		let pillPos;
		/** @type {{ x: number, y: number }} */
		let roundedBoxPos;
		/** @type {{ x: number, y: number }} */
		let blackCirclePos;
		/** @type {Array<Circle>} */
		let circles = [];
		/** @type {Array<Circle>} */
		let droppedCircles = [];
		let isAnimating = false;

		/** @type {{ x: number, y: number }} */
		let queuePos1;
		/** @type {{ x: number, y: number }} */
		let queuePos2;
		/** @type {{ x: number, y: number }} */
		let queuePos3;

		p5.setup = () => {
			p5.createCanvas(1200, 200);

			buttonPos = { x: p5.width * 0.1, y: p5.height / 2 };
			pillPos = { x: p5.width / 2, y: p5.height / 2 };
			roundedBoxPos = { x: p5.width * 0.9, y: p5.height / 2 };

			blackCirclePos = { x: buttonPos.x + 4, y: buttonPos.y + 4 };

			queuePos1 = { x: pillPos.x + 80, y: pillPos.y };
			queuePos2 = { x: pillPos.x, y: pillPos.y };
			queuePos3 = { x: pillPos.x - 80, y: pillPos.y };
		};

		p5.draw = () => {
			p5.background('#ffffff');

			updateQueueLength();
			drawElements();

			let toRemove = [];

			for (let i = 0; i < circles.length; i++) {
				let circle = circles[i];

				switch (circle.state) {
					case 'startToQueue':
					case 'queueToQueue':
						let targetX;
						if (circle.queuePos === 1) targetX = queuePos1.x;
						if (circle.queuePos === 2) targetX = queuePos2.x;
						if (circle.queuePos === 3) targetX = queuePos3.x;

						let dx = targetX - circle.x;
						let speedv =
							40 - 39 * (Math.pow((circle.x - buttonPos.x) / (targetX - buttonPos.x) - 0.5, 2) * 4);

						if (circle.x < targetX) {
							circle.x += p5.min(speedv, dx);
						} else {
							circle.state = circle.state === 'startToQueue' ? 'inQueue' : 'inQueue';
						}
						break;

					case 'inQueue':
						if (!isAnimating && !isAnyCircleMoving() && circle.queuePos === 1) {
							circle.state = 'queueToRoundBox';
							isAnimating = true;
							moveQueueForward();
						}
						break;

					case 'queueToRoundBox':
						let dxBox = roundedBoxPos.x - circle.x;
						let speedBox =
							40 -
							30 *
								(Math.pow((circle.x - queuePos1.x) / (roundedBoxPos.x - queuePos1.x) - 0.5, 2) * 4);

						if (circle.x < roundedBoxPos.x) {
							circle.x += p5.min(speedBox, dxBox);

							if (p5.millis() >= circle.startTransitionTime) {
								circle.color = p5.lerpColor(
									circle.color,
									circle.targetColor,
									circle.colorTransitionSpeed
								);
							}
						} else {
							circle.state = 'executingInRoundBox';
						}
						break;

					case 'executingInRoundBox':
						serverStatus = 1;
						circle.angle = (circle.angle || 360) - 5;
						if (circle.angle <= 5) {
							processedPackets += 1;
							serverStatus = 0;
							isAnimating = false;
							toRemove.push(i);
						}
						break;

					case 'moveRightThenProjectile':
						let speedProjectile = 45 - 30 * (Math.pow((circle.x - buttonPos.x) / 300 - 0.5, 2) * 4);

						if (circle.x < buttonPos.x + 320) {
							circle.x += speedProjectile;
						} else {
							droppedPackets += 1;
							circle.state = 'projectileAnimation';
						}
						break;

					case 'projectileAnimation':
						circle.x += circle.vx;
						circle.y += circle.vy;
						circle.vy += circle.gravity;

						if (p5.millis() >= circle.startTransitionTime) {
							circle.color = p5.lerpColor(
								circle.color,
								circle.targetColor,
								circle.colorTransitionSpeed
							);
						}

						if (circle.y - circle.diameter / 2 > p5.height) {
							toRemove.push(i);
						}
						break;
				}

				p5.fill(circle.color);
				p5.noStroke();
				let startAngle = p5.radians(-90);
				let endAngle = startAngle + p5.radians(circle.angle || 360);

				p5.arc(circle.x, circle.y, circle.diameter, circle.diameter, startAngle, endAngle, p5.PIE);
			}

			if (toRemove.length > 0) {
				for (let i = toRemove.length - 1; i >= 0; i--) {
					circles.splice(toRemove[i], 1);
				}
			}

			for (let i = droppedCircles.length - 1; i >= 0; i--) {
				let circle = droppedCircles[i];
				circle.x += circle.vx;
				circle.y += circle.vy;
				circle.vy += circle.gravity;

				if (circle.y - circle.diameter / 2 > p5.height) {
					droppedCircles.splice(i, 1);
				}

				p5.fill(circle.color);
				p5.noStroke();
				p5.ellipse(circle.x, circle.y, circle.diameter);
			}
		};

		function moveQueueForward() {
			for (let circle of circles) {
				if (circle.queuePos === 2) {
					circle.queuePos = 1;
					circle.state = 'queueToQueue';
				} else if (circle.queuePos === 3) {
					circle.queuePos = 2;
					circle.state = 'queueToQueue';
				}
			}
		}

		function isAnyCircleMoving() {
			return circles.some(
				(circle) => circle.state === 'queueToRoundBox' || circle.state === 'queueToQueue'
			);
		}

		function drawElements() {
			p5.fill('#e6e6e6');
			p5.noStroke();
			p5.rectMode(p5.CENTER);
			p5.rect(pillPos.x, pillPos.y, 250, 90, 100);

			p5.fill('#0b0b0b');
			p5.noStroke();
			p5.rect(roundedBoxPos.x, roundedBoxPos.y, 90, 90, 20);

			p5.fill('#000000');
			p5.noStroke();
			p5.ellipse(blackCirclePos.x, blackCirclePos.y, 80, 80);

			let buttonOffset = 0;
			if (p5.dist(p5.mouseX, p5.mouseY, buttonPos.x, buttonPos.y) < 40) {
				buttonOffset = 1;
				if (p5.mouseIsPressed) {
					buttonOffset = 3;
				}
			}
			p5.fill('#e79f00');
			p5.noStroke();
			p5.ellipse(buttonPos.x + buttonOffset, buttonPos.y + buttonOffset, 80, 80);
		}

		p5.mousePressed = () => {
			let d = p5.dist(p5.mouseX, p5.mouseY, buttonPos.x, buttonPos.y);

			if (d < 40) {
				if (countCirclesInQueue() < 3) {
					let queuePos = getAvailableQueuePos();
					if (queuePos !== -1) {
						circles.push({
							x: buttonPos.x,
							y: buttonPos.y,
							diameter: 70,
							angle: 360,
							state: 'startToQueue',
							queuePos: queuePos,
							color: p5.color('#e79f00'),
							targetColor: p5.color('#139c69'),
							colorTransitionSpeed: 0.25,
							startTransitionTime: p5.millis() + 200
						});
					}
				} else {
					circles.push({
						x: buttonPos.x,
						y: buttonPos.y,
						state: 'moveRightThenProjectile',
						vx: p5.random(-7, -3),
						vy: p5.random(-5, 0),
						gravity: 0.5,
						diameter: 70,
						color: p5.color('#e79f00'),
						targetColor: p5.color('#fe0100'),
						colorTransitionSpeed: 0.5,
						startTransitionTime: p5.millis()
					});
				}
			}
		};

		function getAvailableQueuePos() {
			let usedPositions = circles
				.filter(
					(circle) =>
						circle.state === 'startToQueue' ||
						circle.state === 'inQueue' ||
						circle.state === 'queueToQueue'
				)
				.map((circle) => circle.queuePos);
			if (!usedPositions.includes(1)) return 1;
			if (!usedPositions.includes(2)) return 2;
			if (!usedPositions.includes(3)) return 3;
			return -1;
		}

		function countCirclesInQueue() {
			return circles.filter(
				(circle) =>
					circle.state === 'startToQueue' ||
					circle.state === 'inQueue' ||
					circle.state === 'queueToQueue'
			).length;
		}

		function updateQueueLength() {
			let length = countCirclesInQueue();
			queueLength = length;
		}
	};
</script>

<div>
	<main>
		<P5 {sketch} />
	</main>

	<div class="status-box">
		<div class="status-header">
			<span class="status-title">Server Status</span>
			<div class="status-indicator" style="background-color: {color}"></div>
		</div>
		<div class="detail-row">
			<span>Processed Packets:</span>
			<span>{processedPackets}</span>
		</div>
		<div class="detail-row">
			<span>Dropped Packets:</span>
			<span>{droppedPackets}</span>
		</div>
		<div class="status-details">
			<div class="detail-row">
				<span>Queue Length:</span>
				<span>{queueLength}</span>
			</div>
			<div class="detail-row">
				<span>Server Status:</span>
				<span>{serverStatus == 0 ? 'Idle' : 'Processing'}</span>
			</div>
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
