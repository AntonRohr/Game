var Game = (function () {
    function Game(names) {
        var _this = this;
        this.names = names;
        this.scores = {};
        this.drinks = {};
        names.forEach(function (name) {
            _this.scores[name] = [];
            _this.drinks[name] = 0;
        }, this);
        this.currentPlayer = names[0];
        this.currentScore = 0;
    }
    Game.prototype.rollDice = function () {
        return Math.round(Math.random() * 5) + 1;
    };
    Game.prototype.nextPlayer = function () {
        for (var i = 0; i < this.names.length; i++) {
            var name_1 = this.names[i];
            if (name_1 === this.currentPlayer) {
                if (i === this.names.length - 1) {
                    this.currentPlayer = this.names[0];
                }
                else {
                    this.currentPlayer = this.names[i + 1];
                }
                break;
            }
        }
        var score = this.scores[this.currentPlayer];
        if (score.length > 0) {
            this.currentScore = score[score.length - 1];
        }
        else {
            this.currentScore = 0;
        }
    };
    Game.prototype.roll = function () {
        var diceValue = this.rollDice();
        if (diceValue === 6 || (this.currentScore < 50 && this.currentScore + diceValue > 50) || (this.currentScore < 100 && this.currentScore + diceValue > 100)) {
            this.drink(this.currentPlayer);
            this.nextPlayer();
        }
        else {
            this.currentScore += diceValue;
            if (this.currentScore === 50 || this.currentScore === 100) {
                this.stop();
                return diceValue;
            }
        }
        return diceValue;
    };
    Game.prototype.won = function () {
        for (var name_2 in this.scores) {
            var score = this.scores[name_2];
            var value = score[score.length - 1];
            if (value === 100) {
                return true;
            }
        }
        return false;
    };
    Game.prototype.stop = function () {
        for (var name_3 in this.scores) {
            var score = this.scores[name_3];
            for (var i = 0; i < score.length; i++) {
                if (score[i] === this.currentScore) {
                    score.splice(i, 1);
                    this.drink(name_3);
                    if (this.checkSchnappsZahl()) {
                        this.drinkAll(this.currentPlayer);
                    }
                    break;
                }
            }
        }
        this.scores[this.currentPlayer].push(this.currentScore);
        this.nextPlayer();
    };
    Game.prototype.checkCrossable = function () {
        for (var name_4 in this.scores) {
            if (name_4 !== this.currentPlayer) {
                var score = this.scores[name_4];
                for (var i = 0; i < score.length; i++) {
                    if (score[i] === this.currentScore) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Game.prototype.drink = function (name) {
        this.drinks[name]++;
        this.printDrink();
    };
    Game.prototype.printDrink = function () {
        for (var i = 0; i < this.names.length; i++) {
            var name_5 = this.names[i];
            console.log(name_5 + " has to drink: " + this.drinks[name_5]);
        }
    };
    Game.prototype.drinkAll = function (but) {
        for (var i = 0; i < this.names.length; i++) {
            var name_6 = this.names[i];
            if (name_6 !== but) {
                this.drink(name_6);
            }
        }
    };
    Game.prototype.toString = function () {
        var resultString = "";
        for (var i = 0; i < this.names.length; i++) {
            var name_7 = this.names[i];
            var score = this.scores[name_7];
            var lineString = name_7 + ":";
            for (var j = 0; j < score.length; j++) {
                lineString += " " + score[j];
            }
            resultString += lineString + "\n";
        }
        resultString += "--------------\n";
        resultString += " currentPlayer: " + this.currentPlayer + "\n";
        resultString += " currentScore: " + this.currentScore + "\n";
        if (this.checkCrossable()) {
            resultString += "option to cross!\n";
        }
        if (this.checkSchnappsZahl()) {
            resultString += "Schnappszahl!!!\n";
        }
        return resultString;
    };
    Game.prototype.checkSchnappsZahl = function () {
        var tmpStr = new String(this.currentScore);
        return (tmpStr.length > 1 && tmpStr[0] === tmpStr[1]);
    };
    return Game;
}());
var Bot = (function () {
    function Bot(game) {
        this.game = game;
        this.stateRolled = 0;
        this.stateLastPlayer = "";
    }
    Bot.prototype.step = function (output, diceOutput) {
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
        }
        else {
            var diceValue = this.game.roll();
            diceOutput.innerHTML = diceValue + "\n" + diceOutput.innerHTML;
            this.stateRolled++;
        }
        output.innerHTML = this.game.toString();
    };
    Bot.prototype.start = function (ms, output, diceOutput) {
        var _this = this;
        if (!this.interval) {
            this.interval = setInterval(function () { _this.step(output, diceOutput); }, ms);
        }
    };
    Bot.prototype.stop = function () {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    };
    return Bot;
}());
//# sourceMappingURL=Game.js.map