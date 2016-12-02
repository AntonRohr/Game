var Bot = (function () {
    function Bot(game, saveRate) {
        this.game = game;
        this.stateRolled = 0;
        this.stateLastPlayer = "";
        this.saveRate = saveRate;
    }
    Bot.prototype.setSaveRate = function (saveRate) {
        this.saveRate = saveRate;
    };
    Bot.prototype.step = function (output, diceOutput) {
        if (this.game.currentScore === 100) {
            this.game.stop();
            this.stop();
        }
        if (this.game.currentPlayer !== this.stateLastPlayer) {
            this.stateRolled = 0;
            this.stateLastPlayer = this.game.currentPlayer;
        }
        if (this.stateRolled === this.saveRate[this.game.currentPlayer] || this.game.checkCrossable() || (this.stateRolled > 0 && this.game.checkSchnappsZahl())) {
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
//# sourceMappingURL=Bot.js.map