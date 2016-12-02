
class Game {
	names: string[];
	scores: { [name: string]: number[] };
	drinks: { [name: string]: number};
	currentPlayer: string;
	currentScore: number;
	constructor(names: string[]) {
		this.names = names;
		this.scores = {};
		this.drinks = {};
		this.names.forEach(name => {
			this.scores[name] = [];
			this.drinks[name] = 0;
		}, this);
		this.currentPlayer = names[0];
		this.currentScore = 0;
	}
	private rollDice(): number {
		return Math.round(Math.random() * 5) + 1;
	}
	public resetScore() {
		this.scores = {};
		this.names.forEach(name => {
			this.scores[name] = [];
		}, this);
		this.currentScore = 0;
	}
	private nextPlayer(): void {
		for (let i = 0; i < this.names.length; i++) {
			let name = this.names[i];
			if (name === this.currentPlayer) {
				if (i === this.names.length - 1) {
					this.currentPlayer = this.names[0];
				} else {
					this.currentPlayer = this.names[i + 1];
				}
				break;
			}
		}
		let score = this.scores[this.currentPlayer];
		if (score.length > 0) {
			this.currentScore = score[score.length - 1];
		} else {
			this.currentScore = 0;
		}
	}
	public roll(): number {
		// let score = this.scores[this.currentPlayer];
		// let currentScore = score[score.length - 1];
		let diceValue = this.rollDice();
		if (diceValue === 6 || (this.currentScore < 50 && this.currentScore + diceValue > 50) || (this.currentScore < 100 && this.currentScore + diceValue > 100)) {
			this.drink(this.currentPlayer);
			this.nextPlayer();
		} else {
			this.currentScore += diceValue;
			if (this.currentScore === 50 || this.currentScore === 100) {
				this.stop();
				return diceValue;
			}
		}
		return diceValue;
	}
	public won(): boolean {
		for (let name in this.scores) {
			let score = this.scores[name];
			let value = score[score.length - 1];
			if (value === 100) {
				return true;
			}
		}
		return false;
	}
	public stop(): void {
		for (let name in this.scores) {
			let score = this.scores[name];
			for (let i = 0; i < score.length; i++) {
				if (score[i] === this.currentScore) {
					score.splice(i, 1);
					this.drink(name);
					if (this.checkSchnappsZahl()) {
						this.drinkAll(this.currentPlayer);
					}
					break;
				}
			}
		}
		this.scores[this.currentPlayer].push(this.currentScore);
		this.nextPlayer();
	}
	public checkCrossable(): boolean {
		for (let name in this.scores) {
			if (name !== this.currentPlayer) {
				let score = this.scores[name];
				for (let i = 0; i < score.length; i++) {
					if (score[i] === this.currentScore) {
						return true;
					}
				}
			}
		}
		return false;
	}
	private drink(name: string): void {
		// let score = this.scores[name];
		// let value = score[score.length - 1];
		// do drink twice
		this.drinks[name]++;
		this.printDrink();
	}
	private printDrink(): void {
		for (let i = 0; i < this.names.length; i++) {
			let name = this.names[i];
			console.log(name + " has to drink: " + this.drinks[name]);
		}
	}
	private drinkAll(but: string): void {
		for (let i = 0; i < this.names.length; i++) {
			let name = this.names[i];
			if (name !== but) {
				this.drink(name);
			}
		}
	}
	public toString(): string {
		let resultString: string = "";
		for (let i = 0; i < this.names.length; i++) {
			let name = this.names[i];
			let score = this.scores[name];
			let lineString = name + ":";
			for (let j = 0; j < score.length; j++) {
				lineString += " " + score[j];
			}
			resultString += lineString + "\n";
		}
		resultString += "--------------\n" ;
		resultString += " currentPlayer: " + this.currentPlayer + "\n";
		resultString += " currentScore: " + this.currentScore + "\n";
		if (this.checkCrossable()) {
			resultString += "option to cross!\n";
		}
		if (this.checkSchnappsZahl()) {
			resultString += "Schnappszahl!!!\n";
		}
		return resultString;
	}
	public checkSchnappsZahl(): boolean {
		let tmpStr = new String(this.currentScore);
		return (tmpStr.length > 1 && tmpStr[0] === tmpStr[1]);
	}
}

