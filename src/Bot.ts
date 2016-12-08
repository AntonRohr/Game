class Bot {
	game: Game;
	// outputDomElement: HTMLTextAreaElement;
	stateRolled: number;
	stateLastPlayer: string;
	interval: number;
	saveRate: { [name: string]: number };
	constructor(game: Game, saveRate: { [name: string]: number }) {
		// this.outputDomElement = outputDomElement;
		this.game = game;
		this.stateRolled = 0;
		this.stateLastPlayer = "";
		// this.interval = setInterval(() => {this.step(outputDomElement); }, 100);
		this.saveRate = saveRate;
	}
	public setSaveRate(saveRate: { [name: string]: number }) {
		this.saveRate = saveRate;
	}
	private step(output: HTMLTextAreaElement, diceOutput: HTMLTextAreaElement): void {
		if (this.game.currentScore === 100) {
			this.game.stop();
			this.stop();
			return;
		}
		if (this.game.currentPlayer !== this.stateLastPlayer) {
			this.stateRolled = 0;
			this.stateLastPlayer = this.game.currentPlayer;
		}
		if (this.stateRolled === this.saveRate[this.game.currentPlayer] || this.game.checkCrossable() || (this.stateRolled > 0 && this.game.checkSchnappsZahl())) {
			if (this.game.won()) {
				this.stop();
				return;
			}
			this.game.stop();

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
