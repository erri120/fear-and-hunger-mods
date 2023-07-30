(function() {
    const __old_Game_System_initialize = Game_System.prototype.initialize;
    const __old_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    const __old_Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;

    // partial replacement
    Game_System.prototype.initialize = function() {
        __old_Game_System_initialize.bind(this)();

        this._startTime = Date.now();
        this._playtime = 0;
    };

    // partial replacement
    Game_System.prototype.onAfterLoad = function() {
        __old_Game_System_onAfterLoad.bind(this)();

        this._startTime = Date.now();
    };

    // partial replacement
    Game_System.prototype.onBeforeSave = function() {
        __old_Game_System_onBeforeSave.bind(this)();

        this._playtime += Date.now() - this._startTime;
        this._startTime = Date.now();
    };

    // complete replacement
    Game_System.prototype.playtime = function() {
        // playtime is in milliseconds so we convert it to seconds
        // in case some other functiosn rely on the original one
        return Math.floor(this._playtime / 1000);
    };

    // complete replacement
    Game_System.prototype.playtimeText = function() {
        const secondsPassed = this.playtime();
        const minutesPassed = Math.floor(secondsPassed / 60);
        const hoursPassed = Math.floor(minutesPassed / 60);

        const sec = secondsPassed % 60;
        const min = minutesPassed % 60;
        const hour = hoursPassed;

        return String(hour).padStart(2, '0') + ':' +
            String(min).padStart(2, '0') + ':' +
            String(sec).padStart(2, '0');
    };
})();
