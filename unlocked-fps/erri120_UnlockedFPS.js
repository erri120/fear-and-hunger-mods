/*:
* @author erri120
* @plugindesc Fixes issues related to time and FPS.
*/

// GitHub: https://github.com/erri120/fear-and-hunger-mods
// License: https://github.com/erri120/fear-and-hunger-mods/blob/main/LICENSE

// Playtime Fix
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

// Game Timer Fix
(function() {
    const __old_Game_Character_initMembers = Game_Character.prototype.initMembers;
    const __old_Game_Character_forceMoveRoute = Game_Character.prototype.forceMoveRoute;
    const __old_Game_Interpreter_clear = Game_Interpreter.prototype.clear;
    const __old_Game_Interpreter_wait = Game_Interpreter.prototype.wait;
    const __old_Game_Interpreter_updateWaitCount = Game_Interpreter.prototype.updateWaitCount;

    // The amount of milliseconds that need to pass before
    // an update is triggered.
    const threshold = (1 / 60) * 1000;

    // partial replacement
    Game_Character.prototype.initMembers = function() {
        __old_Game_Character_initMembers.bind(this)();
        this._lastUpdateTimestamp = 0;
    }

    // partial replacement
    Game_Character.prototype.forceMoveRoute = function(moveRoute) {
        __old_Game_Character_forceMoveRoute.bind(this)(moveRoute);
        this._lastUpdateTimestamp = 0;
    }

    // partial replacement
    Game_Interpreter.prototype.clear = function() {
        __old_Game_Interpreter_clear.bind(this)();
        this._lastUpdateTimestamp = 0;
    }

    // partial replacement
    Game_Interpreter.prototype.wait = function(duration) {
        __old_Game_Interpreter_wait.bind(this)(duration);
        this._lastUpdateTimestamp = performance.now();
    }

    // complete replacement
    Game_Interpreter.prototype.updateWaitCount = function() {
        if (this._waitCount <= 0) return false;

        const now = performance.now();
        const diff = now - this._lastUpdateTimestamp;

        if (diff < threshold) return true;

        this._lastUpdateTimestamp = now;
        this._waitCount -= diff / threshold;
        return true;
    }
})();
