# Unlocked FPS

Fixes issues related to time and FPS.

## Installation

TODO

## Technical Details

RPG Maker MV/MZ uses the amount of rendered frames to calculate time ellapsed. You can read more
about this on my blog post [Dont' count frames to calculate time](https://erri120.github.io/posts/2021-09-29/).
In essence, RPG Maker MV/MZ assume that the game is always running at 60 FPS and that frame rendering
is consistend. However, the real world looks very different.

### Playtime

Playtime is calculated as follows:

```javascript
Game_System.prototype.playtime = function() {
    return Math.floor(Graphics.frameCount / 60);
};

Game_System.prototype.playtimeText = function() {
    var hour = Math.floor(this.playtime() / 60 / 60);
    var min = Math.floor(this.playtime() / 60) % 60;
    var sec = this.playtime() % 60;
    return hour.padZero(2) + ':' + min.padZero(2) + ':' + sec.padZero(2);
};
```

The function `Game_System.prototype.playtime` returns the playtime in seconds by dividing the amount
of rendered frames by `60`. The function `Game_System.prototype.playtimeText` is called by the saves
menu to display the current playtime for that particular save.

Fixing this is done by simply using dates instead of frames. See [`erri120_UnlockedFPS.js`](./erri120_UnlockedFPS.js)
for the details.

### Game Timer Fix

The game has a timer that also uses frame counts. Similar with playtime, the timer
is also broken when you run the game at something other than locked 60 FPS. If you run the game at 144 FPS,
the timer will ellapse x2.4 times faster. If you play at 30 FPS, the timer will take twice as long.

Fear & Hunger uses a Common Event for the timer:

![Screnshot of the editor](./assets/screenshot-editor.png)

Each Common Event has its own instance of `Game_CommonEvent`, which has a field `_interpreter` that
is a new instance of `Game_Interpreter`. The `Wait` command gets executed in this interpreter instance:

```javascript
Game_Interpreter.prototype.command230 = function() {
    this.wait(this._params[0]);
    return true;
};

Game_Interpreter.prototype.wait = function(duration) {
    this._waitCount = duration;
};
```

It sets `_waitCount` to the amount specified. This field is initially set to `0` and updated in the
`Game_Interpreter.prototype.update` function:

```javascript
Game_Interpreter.prototype.update = function() {
    while (this.isRunning()) {
        if (this.updateChild() || this.updateWait()) {
            break;
        }
        // rest omitted
    }
};

Game_Interpreter.prototype.updateWait = function() {
    return this.updateWaitCount() || this.updateWaitMode();
};

Game_Interpreter.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};
```

This `update` function gets called every frame, meaning every frame we're decreasing the `_waitCount`
field by 1 until it reaches `0`. Once it has reached `0`, `executeCommand` gets called which will
run through the list of commands and increase the game timer variable.

