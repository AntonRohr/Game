class Bot {
	game: Game;
	// outputDomElement: HTMLTextAreaElement;
	stateRolled: number;
	stateLastPlayer: string;
	interval: number;
	constructor(game: Game) {
		// this.outputDomElement = outputDomElement;
		this.game = game;
		this.stateRolled = 0;
		this.stateLastPlayer = "";
		// this.interval = setInterval(() => {this.step(outputDomElement); }, 100);
	}
	private step(output: HTMLTextAreaElement, diceOutput: HTMLTextAreaElement): void {
		if (this.game.currentScore === 100) {
			this.stop();
		}
		if (this.game.currentPlayer !== this.stateLastPlayer) {
			this.stateRolled = 0;
			this.stateLastPlayer = this.game.currentPlayer;
		}
		if (this.stateRolled === 1 || this.game.checkCrossable() || (this.stateRolled > 0 && this.game.checkSchnappsZahl())) {
			this.game.stop();
			if (this.game.won()) {
				this.stop();
			}
		} else {
			let diceValue = this.game.roll();
			diceOutput.innerHTML = diceValue + "\n" + diceOutput.innerHTML;
			this.stateRolled++;
		}
		// console.log(this.outputDomElement);
		output.innerHTML = this.game.toString();
	}
	public start(ms: number, output: HTMLTextAreaElement, diceOutput: HTMLTextAreaElement): void {
		if (!this.interval) {
			this.interval = setInterval(() => {this.step(output, diceOutput); }, ms);
		}
	}
	public stop(): void {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = undefined;
		}
	}
}
