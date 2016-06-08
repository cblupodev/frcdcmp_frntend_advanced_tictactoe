var app = angular.module('app', ['ngMaterial'])
    .run(function($rootScope, $log) {
        $rootScope.$log = $log;
    })
app.controller('MainCtrl', ['$scope', function($scope) {

    var p = "num"; // box number prefix
    var S = $scope;
    // S.boxes = lp_initfillArray(-1, 9);
    S.box = new Array(9);
    S.thisPersonWon;

    // select first box    
    var selectFirstBox = function() {
        var sel = Math.floor(Math.random() * 9);
        if (S.box[sel] === undefined) {
            S.box[sel] = "O";
        }
    }; selectFirstBox(); // instantly call it

    S.checkWinners = function() {
        var allCombos = [
            [S.box[0], S.box[1], S.box[2]],
            [S.box[3], S.box[4], S.box[5]],
            [S.box[6], S.box[7], S.box[8]],
            [S.box[0], S.box[3], S.box[6]],
            [S.box[1], S.box[4], S.box[7]],
            [S.box[2], S.box[5], S.box[8]],
            [S.box[0], S.box[4], S.box[8]],
            [S.box[2], S.box[4], S.box[6]]
        ];

        allCombos.forEach(function(combo, i) {
            var won = null;
            if (combo.lp_allEqualTo('X')) won = 'X';
            else if (combo.lp_allEqualTo('O')) won = 'O'
            if (won) {
                S.thisPersonWon = won;
                return true;
            }
        });
        return false;
    }

    S.boxClick = function(e) {
        console.dir(e);
        e = e.srcElement;
        if (S.thisPersonWon === undefined || S.thisPersonWon === '') { // don't do anything if someone won
            if (e.textContent === '') {
                S.box[Number(e.name)] = 'X';
            }
    
            if (!S.checkWinners()) { // if someone has't won, then let the computer choose, randomly
                while (true) {
                    var sel = Math.floor(Math.random() * 9);
                    if (S.box[sel] === '' || S.box[sel] === undefined) {
                        S.box[sel] = 'O';
                        break;
                    }
                }
                S.checkWinners();
            }
        }
    }

    S.reset = function() {
        S.box = new Array(9);
        S.thisPersonWon = '';
        selectFirstBox();
    }

}]);

function l(message) {
    console.log(message);
}

// '{0}{1}'.lp_format('asdf', 1 + 2);
if (!String.prototype.lp_format) {
    String.prototype.lp_format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function lp_initfillArray(obj, length) {
    var rtn = new Array(length);
    for (var i = 0; i < length; i++) {
        rtn[i] = obj;
    }
    return rtn;
}

if (!Array.lp_allEqualTo) {
    Array.prototype.lp_allEqualTo = function(elem, comparator) {
        var rtn = true;
        this.forEach(function(e) {
            if (e !== elem) {
                rtn = false;
            }
        });
        return rtn;
    }
}