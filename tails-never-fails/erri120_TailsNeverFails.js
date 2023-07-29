/*:
* @author erri120
* @plugindesc Force coin toss to always land on tails.
*/

// GitHub: https://github.com/erri120/fear-and-hunger-mods
// License: https://github.com/erri120/fear-and-hunger-mods/blob/main/LICENSE

(function() {
    const __old_Game_Interpreter_command122 = Game_Interpreter.prototype.command122;

    const toSearch = [
        14, // variable "coin_flip"
        14, // variable "coin_flip"
        0,  // SET the variable
        2,  // set the variable to a RANDOM value
        1,  // HEADS
        2   // TAILS
    ];

    const toReplace = [
        14, // variable "coin_flip"
        14, // variable "coin_flip"
        0,  // SET the variable
        0,  // use a CONSTANT value
        2   // TAILS
    ];

    // partial replacement
    Game_Interpreter.prototype.command122 = function() {
        if (this._params.length !== toSearch.length) {
            return __old_Game_Interpreter_command122.bind(this)();
        }

        for (let i = 0; i < toSearch.length; i++) {
            if (this._params[i] !== toSearch[i]) {
                return __old_Game_Interpreter_command122.bind(this)();
            }
        }

        this._params = toReplace;
        return __old_Game_Interpreter_command122.bind(this)();
    }
})();
