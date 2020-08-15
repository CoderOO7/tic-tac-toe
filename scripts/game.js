import {gameBoard} from './board.js';
import {displayController} from './display.js';

const playerFactory = (name, marker, isMyTurn) => {
    return {
        name,
        marker,
        isMyTurn
    };
};

const gameController = (function() {

    const boardElement = displayController.board;
    let computerOpponent = false;
    let playerOne;
    let playerTwo;
    let gameWinner;

    /**
     * Return true if it is currently a player's turn, else false.
     * @param {Object} player - Player object to check.
     */
    const _isPlayerTurn = (player) => player.isMyTurn;

    /**
     * Return the player object who just made their move.
     */
    function _getActivePlayer() {
        return _isPlayerTurn(playerOne) ? playerOne : playerTwo;
    }

    /**
     * Switch player's turns based on which player last played.
     */
    function _changeTurns() {
        if (_isPlayerTurn(playerOne)) {
            playerOne.isMyTurn = false;
            playerTwo.isMyTurn = true;
        } else {
            playerOne.isMyTurn = true;
            playerTwo.isMyTurn = false;
        }
    }

    /**
     * Return true if a gameboard row has a player's marker, else false.
     * @param {string} marker        - Player's marker, either 'X' or 'O'.
     * @param {Object} adjacentItems - Nested arrays of rows in gameboard.
     */
    function _containsMarker(marker, adjacentItems) {
        return adjacentItems.some(arr => arr.every(item => item === marker));
    }

    /**
     * Return true if a player has won by filling a row, else false.
     * @param {string} marker      - Player's marker, either 'X' or 'O'.
     * @param {Object} boardTuples - Object with board's rows/columns/diagonals.
     */
    function _isWinner(marker, boardTuples) {
        return (
            _containsMarker(marker, boardTuples.rows) ||
            _containsMarker(marker, boardTuples.columns) ||
            _containsMarker(marker, boardTuples.diagonals)
        );
    }

    /**
     * Return true if a game winner is found, else false.
     */
    function _winnerFound() {
        const boardTuples = {
            rows: gameBoard.getRows(),
            columns: gameBoard.getColumns(),
            diagonals: gameBoard.getDiagonals()
        };
        if (_isWinner(playerOne.marker, boardTuples)) {
            gameWinner = playerOne;
        } else if (_isWinner(playerTwo.marker, boardTuples)) {
            gameWinner = playerTwo;
        }
        return (!!gameWinner);
    }

    /**
     * Return true if a player has won or a tie occurred, else false.
     */
    function _isGameOver() {
        return (_winnerFound() || gameBoard.isFilled());
    }

    /**
     * Reset this module's variables to initial values.
     */
    function _resetPlayers() {
        playerOne = null;
        playerTwo = null;
        gameWinner = null;
        computerOpponent = false;
    }

    /**
     * Display the game winner and reset the game's settings.
     */
    function _endGame() {
        // Display message for game's result.
        let gameResult = (gameWinner) ? `${gameWinner.name} wins` : 'Tie Game';
        gameResult = gameResult.toUpperCase();
        displayController.showMessage(gameResult);
        // Reset gameController module variables.
        _resetPlayers();
        // Reset the gameSettings object.
        displayController.resetGameSettings();
        // Enable form inputs to start a new game.
        displayController.toggleActiveInputs();
        // Empty contents of the gameboard's array.
        gameBoard.clear();
    }

    /**
     * Generate a random play on the gameboard made by the computer.
     */
    function _executeComputerPlay() {
        const boardArrayLen = gameBoard.get().length;
        let randIndex;
        let isUpdated;
        do {
            randIndex = Math.floor(Math.random() * boardArrayLen);
            isUpdated = gameBoard.update(randIndex, playerTwo.marker);
        } while (!isUpdated);
        displayController.render();
    }

    /**
     * Update the gameboard after a player makes their move.
     * @param {Object} player       - Player object who just played.
     * @param {Object} cellIndex    - Cell's index number in the gameboard.
     */
    function _executePlay(player, cellIndex) {
        const wasUpdated = gameBoard.update(cellIndex, player.marker);
        if (wasUpdated) {
            displayController.render();
            if (_isGameOver()) {
                _endGame();
            } else if (!computerOpponent) {
                _changeTurns();
            } else if (computerOpponent) {
                _executeComputerPlay();
            }
        }
    }

    /**
     * Assign player objects if the game settings have been created.
     */
    function _assignPlayers() {
        const gameSettings = displayController.getGameSettings();
        if (Object.keys(gameSettings).length) {
            playerOne = playerFactory(gameSettings.playerOneName, 'X', true);
            playerTwo = playerFactory(gameSettings.playerTwoName, 'O', false);
            if (gameSettings.opponent === 'computer') {
                computerOpponent = true;
            }
        }
    }

    /**
     * Return true if player Objects have been created, else false.
     */
    function _hasGameSettings() {
        if (playerOne && playerTwo) {
            return true;
        } else {
            _assignPlayers();
            return (playerOne && playerTwo);
        }
    }

    /**
     * Callback for `click` events on the gameboard.
     * @param {Object} param0 - Contains target element clicked.
     */
    function _handleBoardClick({target}) {
        if (!_hasGameSettings()) return;
        const cellClicked = target.closest('.board__cell');
        if (cellClicked) {
            const cellIndex = parseInt(cellClicked.dataset.cellNumber) - 1;
            const activePlayer = _getActivePlayer();
            _executePlay(activePlayer, cellIndex);
        }
    }

    boardElement.addEventListener('click', _handleBoardClick, false);

    return { getGameBoard: () => gameBoard.get() };

})();

export {gameController};