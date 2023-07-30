/*:
* @author erri120
* @plugindesc Always win coin tosses
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
        1,  // SUCCESS
        2   // FAILURE
    ];

    const toReplace = [
        14, // variable "coin_flip"
        14, // variable "coin_flip"
        0,  // SET the variable
        0,  // use a CONSTANT value
        1   // SUCCESS
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

        this._params = toReplace.slice();
        return __old_Game_Interpreter_command122.bind(this)();
    }
})();
