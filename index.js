class Render{
	constructor() {
		this.container = document.querySelector(".main-container");
		this.elemClass = ["blue", "green", "gray"];
	}

	createsTimer() {
		this.elemClass.forEach(color => {
			const timerWrapper = document.createElement("div");
			timerWrapper.classList.add(`${color}-time-wrapper`);
			timerWrapper.innerHTML = 
			`
				<div class="timer-container__${color}-timer">
				  <span class="${color}-timer time"></span>
				</div>
				<button class="timer-container-button ${color}-button">stop</button>
				<div class="timer-container__line ${color}-time-line"></div>
			`;
			this.container.append(timerWrapper);
		});
		return this.container;
	}
}
const renderedElements = new Render();
renderedElements.createsTimer();

// ==========================================================================================

class TimeSetup extends Render {
	constructor(minutes, seconds, timerColor, delay, updateInterval, autoStart) {
		super();
		this.minutes = minutes;
		this.seconds = seconds;
		this.timerColor = timerColor;
		this.delay = delay;
		this.updateInterval = updateInterval;
		this.autoStart = autoStart;
		this.lunchTimer;
		this.memoryMins = this.minutes;
		this.memorySecs = this.seconds;
		this.startTime = this.minutes * 60 + this.seconds;
		this.myTimer = new Date();
		this.buttonHandler = this.buttonHandler.bind(this);
		this.elementSec = document.querySelector(`.${this.timerColor}-timer`);
		this.timeLine = document.querySelector(`.${this.timerColor}-time-line`);
		this.initialLineWidth = this.timeLine.offsetWidth;
		this.currentButton = document.querySelector(`.${this.timerColor}-button`);
		this.clickedButton = this.currentButton.addEventListener("click", this.buttonHandler);
	}

	changeButtonText() {
		if (this.currentButton.textContent === "start") {
			this.currentButton.textContent = "stop";
			return this.currentButton;
		} else if (this.currentButton.textContent === "stop") {
			this.currentButton.textContent = "start";
			return this.currentButton;
		}
	}

	stopTimer() {
		if (this.launchTimer) {
			clearInterval(this.launchTimer);
		}
		return this.launchTimer;
	}

	timerReset() {
		this.timeLine.style.width = "100%";
		this.timerSetup(this.minutes = this.memoryMins, this.seconds = this.memorySecs);
	}

	timeInterval() {
		const currentLineWidth = this.timeLine.offsetWidth;
		const interval = this.delay / 1000;
		if (this.updateInterval === true) {
			this.seconds = this.seconds - interval;
			this.timeLine.style.width = `${currentLineWidth - this.initialLineWidth / (this.startTime / interval)}px`;
		} else {
			this.seconds--;
			this.timeLine.style.width = `${currentLineWidth - this.initialLineWidth / this.startTime}px`;
		}
		return this.seconds;
	}

	timerSetup(mins, secs) {
		this.myTimer.setMinutes(mins, secs);
		this.elementSec.textContent = `${this.myTimer.getMinutes()}:${this.myTimer.getSeconds()}`;
	}

	timerCondition() {
		if (this.autoStart === false) {
			this.changeButtonText();
			this.timerSetup(this.minutes, this.seconds);
		} else {
			this.startTimer();
		}
	}

	startTimer() {
		this.launchTimer = setInterval(() => {
			this.timeInterval();
			if (`${this.myTimer.getMinutes()}:${this.myTimer.getSeconds()}` !== "0:0") {
				this.timerSetup(this.minutes, this.seconds);
			} else {
				this.timeLine.style.width = 0;
				this.changeButtonText();
				this.stopTimer();
			}
		}, this.delay);
	}

	buttonHandler(event) {
		if (this.timeLine.style.width === "0px") {
			this.timeLine.style.width = "100%";
			this.timerSetup(this.minutes = this.memoryMins, this.seconds = this.memorySecs);
		} else if (event.target.textContent === "stop") {
			this.autoStart = true;
			this.stopTimer();
			this.changeButtonText();
			return;
		} else if (event.target.textContent === "start") {
			this.startTimer(this.minutes, this.seconds);
			this.changeButtonText();
			return;
		}
	}
}

const startBlueTimer = new TimeSetup(0, 10, "blue", 500);
startBlueTimer.timerCondition();

const startGreenTimer = new TimeSetup(1, 10, "green", 200, false, false);
startGreenTimer.timerCondition();

const startGrayTimer = new TimeSetup(2, 50, "gray", 2000, true);
startGrayTimer.timerCondition();
