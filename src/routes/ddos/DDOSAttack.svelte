<script>
	import P5 from 'p5-svelte';

	let processedPackets = 0;
	let droppedCount = 0;
	let serverStatus = 0;
	let burning = false;
	let dead = false;
	let slowdown = false;

	/** @param {import("p5-svelte").p5} p5 */
	const sketch = (p5) => {
		/**
		 * @typedef {Object} Circle
		 * @property {number} x
		 * @property {number} y
		 * @property {number} diameter
		 * @property {number} angle
		 * @property {string} state
		 * @property {import("p5").Color} color
		 * @property {import("p5").Color} targetColor
		 * @property {number} colorTransitionSpeed
		 * @property {number} vx
		 * @property {number} vy
		 * @property {number} gravity
		 */

		/** @type {{ x: number, y: number }} */
		let buttonPos;
		/** @type {{ x: number, y: number }} */
		let roundedBoxPos;
		/** @type {Array<Circle>} */
		let circles = [];
		let buttonPressed = false;
		let boxOccupied = false;
		/** @type {Array<number>} */
		let droppedTimestamps = [];

		/** @type {Array<Bug>} */
		let bugs = [];
		let roastLevel = 'Light';

		p5.setup = () => {
			p5.createCanvas(800, 200);
			p5.textSize(24);
			p5.textAlign(p5.CENTER, p5.CENTER);
			buttonPos = { x: p5.width * 0.1, y: p5.height / 2 };
			roundedBoxPos = { x: p5.width * 0.9, y: p5.height / 2 };
		};

		p5.draw = () => {
			if (droppedCount >= 25) {
				dead = true;
				p5.fill(255);
				p5.textSize(48);
				p5.textAlign(p5.CENTER, p5.CENTER);
				p5.text('💀', p5.width / 2, p5.height / 2);
				p5.text('System Overheated! Critical Failure', p5.width / 2, p5.height / 2 + 50);
				return;
			}

			p5.background('#fff');

			let buttonOffset = 0;
			if (p5.dist(p5.mouseX, p5.mouseY, buttonPos.x, buttonPos.y) < 40) {
				buttonOffset = 1;
				if (p5.mouseIsPressed) {
					buttonOffset = 3;
				}
				if (p5.mouseIsPressed && !buttonPressed) {
					buttonOffset = 3;
					buttonPressed = true;
					createCircle();
				}
			}

			if (!p5.mouseIsPressed) {
				buttonPressed = false;
			}

			drawButton(buttonOffset);
			drawRoundedBox();

			handleCircles();

			let currentMillis = p5.millis();
			droppedTimestamps = droppedTimestamps.filter(
				(timestamp) => currentMillis - timestamp <= 2000
			);

			if (droppedCount >= 10) {
				burning = true;
				triggerFireAnimation();
			}
		};

		/** @param {number} offset */
		function drawButton(offset) {
			p5.fill('#000000');
			p5.noStroke();
			p5.ellipse(buttonPos.x + 4, buttonPos.y + 4, 80, 80);
			p5.fill('#e79f00');
			p5.noStroke();
			p5.ellipse(buttonPos.x + offset, buttonPos.y + offset, 80, 80);
		}

		function drawRoundedBox() {
			p5.fill('#0b0b0b');
			p5.noStroke();
			p5.rect(roundedBoxPos.x - 45, roundedBoxPos.y - 45, 90, 90, 20);
		}

		function createCircle() {
			circles.push({
				x: buttonPos.x,
				y: buttonPos.y,
				diameter: 70,
				angle: 360,
				state: 'moving',
				color: p5.color('#e79f00'),
				targetColor: p5.color('#139c69'),
				colorTransitionSpeed: 0.1,
				vx: 0,
				vy: 0,
				gravity: 0.5
			});
		}

		function handleCircles() {
			for (let i = circles.length - 1; i >= 0; i--) {
				let circle = circles[i];
				switch (circle.state) {
					case 'moving':
						moveCircle(circle);
						break;
					case 'executing':
						executeCircle(circle);
						break;
					case 'rejected':
						rejectCircle(circle);
						break;
				}

				p5.fill(circle.color);
				p5.noStroke();
				let startAngle = p5.radians(-90);
				let endAngle = startAngle + p5.radians(circle.angle);
				p5.arc(circle.x, circle.y, circle.diameter, circle.diameter, startAngle, endAngle, p5.PIE);
			}
		}

		/** @param {Circle} circle */
		function moveCircle(circle) {
			let dx = roundedBoxPos.x - circle.x;

			let baseSpeed =
				60 - 57 * Math.pow((circle.x - buttonPos.x) / (roundedBoxPos.x - buttonPos.x) - 0.5, 2) * 4;

			let speed = baseSpeed;

			if (circle.x < roundedBoxPos.x - 100) {
				circle.x += p5.min(speed, dx);
			} else if (circle.x < roundedBoxPos.x) {
				if (!boxOccupied) {
					circle.x += p5.min(speed, dx);
					if (circle.x >= roundedBoxPos.x) {
						boxOccupied = true;
						circle.state = 'executing';
					}
				} else {
					circle.state = 'rejected';
					circle.color = p5.color('#ff0000');
					circle.vx = p5.random(-7, -3);
					circle.vy = p5.random(-5, 0);
					droppedCount++;
					droppedTimestamps.push(p5.millis());
				}
			}
		}

		/** @param {Circle} circle */
		function executeCircle(circle) {
			serverStatus = 1;

			let recentDropCount = droppedTimestamps.length;
			let slowdownFactor = 1 / (1 + Math.pow(recentDropCount, 2));
			if (recentDropCount > 2) {
				slowdown = true;
			} else {
				slowdown = false;
			}

			let baseReductionSpeed = 1;
			let reductionSpeed = 5 * slowdownFactor + baseReductionSpeed;

			circle.angle = p5.max(0, circle.angle - reductionSpeed);

			if (circle.angle <= 0) {
				serverStatus = 0;
				circles.splice(circles.indexOf(circle), 1);
				boxOccupied = false;
				processedPackets++;
			}
			circle.color = p5.lerpColor(circle.color, circle.targetColor, circle.colorTransitionSpeed);
		}

		/** @param {Circle} circle */
		function rejectCircle(circle) {
			circle.x += circle.vx;
			circle.y += circle.vy;
			circle.vy += circle.gravity;

			if (circle.y > p5.height + circle.diameter) {
				circles.splice(circles.indexOf(circle), 1);
			}
		}

		function triggerFireAnimation() {
			roastLevel = droppedCount >= 20 ? 'Dark' : droppedCount >= 10 ? 'Medium' : 'Light';

			let x = roundedBoxPos.x;
			let y = roundedBoxPos.y;
			let radius;

			if (roastLevel == 'Light') {
				radius = p5.random(10, 30);
			} else if (roastLevel == 'Medium') {
				radius = p5.random(20, 40);
			} else {
				radius = p5.random(30, 50);
			}

			let b = new Bug(x, y, radius);
			bugs.push(b);

			for (let i = bugs.length - 1; i >= 0; i--) {
				bugs[i].move();
				bugs[i].show();
				bugs[i].shrink();

				if (bugs[i].radius <= 0) {
					bugs.splice(i, 1);
				}
			}
		}

		class Bug {
			/**
			 * @param {number} tempX
			 * @param {number} tempY
			 * @param {number} tempR
			 */
			constructor(tempX, tempY, tempR) {
				this.x = tempX;
				this.y = tempY;
				this.radius = tempR;

				this.color = p5.color(255);
				let r = p5.random(3);
				if (r < 1) {
					this.color = p5.color(255, 100, 20, 50);
				} else if (r >= 1 && r < 2) {
					this.color = p5.color(255, 200, 10, 50);
				} else if (r >= 2) {
					this.color = p5.color(255, 80, 5, 50);
				}
			}

			show() {
				p5.noStroke();
				p5.fill(this.color);
				p5.ellipse(this.x, this.y, this.radius);
			}

			move() {
				this.x += p5.random(-5, 5);
				this.y -= p5.random(1, 3);
			}

			shrink() {
				this.radius -= 0.4;
			}
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
			<div
				class="status-indicator"
				style="background-color: {dead
					? '#000'
					: burning
						? '#844'
						: serverStatus == 1
							? '#139c69'
							: '#e84143'}"
			></div>
		</div>
		<div class="detail-row">
			<span>Processed Packets:</span>
			<span>{processedPackets}</span>
		</div>
		<div class="detail-row">
			<span>Dropped Packets:</span>
			<span>{droppedCount == 25 ? '-' : droppedCount}</span>
		</div>
		<div class="status-details">
			<div class="detail-row">
				<span>Server Status:</span>
				<span
					>{dead
						? 'Dead'
						: burning
							? 'Warning'
							: slowdown
								? 'Slowing down'
								: serverStatus == 0
									? 'Idle'
									: 'Executing'}</span
				>
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
