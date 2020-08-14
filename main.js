
const playerFactory = (name, marker, isMyTurn) => {
    return {
        name,
        marker,
        isMyTurn
    };
};

const gameBoard = (function() {

    // 3x3 tic-tac-toe board.
    const DIMENSION = 3;
    const NUM_CELLS = Math.pow(DIMENSION, 2);
    const boardArray = Array(NUM_CELLS).fill('');
    const get = () => boardArray;

    /**
     * Return true if an empty string occurs at index, else false.
     * @param {number} index - Index of board array to check.
     */
    function _isEmptyCell(index) {
        return (!boardArray[index]);
    }

    /**
     * Return true if the gameboard has no empty spots left, else false.
     */
    function isFilled() {
        return boardArray.every((cell, index) => !_isEmptyCell(index));
    }

    /**
     * Return an array with subarrays for each row in the gameboard.
     */
    function getRows() {
        const boardArrayCopy = Array.from(boardArray);
        const rowsArray = [];
        while (boardArrayCopy.length) {
            rowsArray.push(boardArrayCopy.splice(0, DIMENSION));
        }
        return rowsArray;
    }

    /**
     * Return an array with subarrays for each column in the gameboard.
     */
    function getColumns() {
        // Adds n empty arrays inside array.
        const columnsArray = Array.from({length: DIMENSION}, () => []);
        for (let i = 0; i < NUM_CELLS; i++) {
            columnsArray[i % DIMENSION].push(boardArray[i]);
        }
        return columnsArray;
    }

    /**
     * Return an array with subarrays for each diagonal in the gameboard.
     */
    function getDiagonals() {
        const diagonalsArray = Array.from({length: 2}, () => []);
        const rowsArray = getRows();
        rowsArray.forEach((row, index) => {
            // index gets bigger
            diagonalsArray[0].push(row[index]);
            // index gets smaller 
            diagonalsArray[1].push(row[DIMENSION - 1 - index]);
        });
        return diagonalsArray;
    }

    /**
     * Return true if index is in range of this board, else false.
     * @param   {number}  cellIndex - Board cell index to validate.
     */
    function hasCell(cellIndex) {
        return (cellIndex >= 0 && cellIndex < boardArray.length);
    }

    /**
     * Update the gameboard if a player makes a valid move.
     * Return true if the board was changed, else false.
     * 
     * @param {number} index  - Index of board array to change.
     * @param {string} marker - Player's move, either 'X' or 'O'.
     */
    function update(index, marker) {
        if (!hasCell(index) || !_isEmptyCell(index)) return false;
        boardArray[index] = marker;
        return true;
    }

    /**
     * Reset each of the board's items to empty strings.
     */
    function clear() {
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = '';
        }
    }

    return {
        get,
        getRows,
        getColumns,
        getDiagonals,
        isFilled,
        hasCell,
        update,
        clear
    };

})();


const displayController = (function(doc) {

    const board = doc.getElementById('board');
    const nameInputOne = doc.getElementById('p1-name');
    const nameInputTwo = doc.getElementById('p2-name');
    const opponentInputOne = doc.getElementById('player');
    const opponentInputTwo = doc.getElementById('computer');
    const form = doc.querySelector('.form');
    let gameSettings = {};

    /**
     * Assign the gameSettings object based on form submitted inputs.
     */
    function _setGameSettings() {
        const opponent = (opponentInputOne.checked) ? 'player' : 'computer';
        gameSettings.opponent = opponent;
        gameSettings.playerOneName = nameInputOne.value;
        gameSettings.playerTwoName = nameInputTwo.value;
    }

    /**
     * Start a new game by resetting the gameboard, disabling the form and
     * saving the form's input values.
     * @param {Object} event - 'Submit' event causing the form's submission.
     */
    function _activateGame(event) {
        event.preventDefault();
        // Show the new gameboard
        render();
        // Disable the form's input values.
        toggleActiveInputs();
        // Save input values inside gameSettings object
        _setGameSettings();
    }

    /**
     * Remove all child nodes from a gameboard cell element.
     * @param {Object} cell - A gameboard cell element on the webpage.
     */
    function _removeChildren(cell) {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
    }

    const getGameSettings = () => gameSettings;
    const resetGameSettings = () => {gameSettings = {};};

    /**
     * Toggle the disabled state for each input in the form.
     */
    function toggleActiveInputs() {
        const formInputs = Array.from(form.getElementsByTagName('input'));
        formInputs.forEach(input => {
            input.disabled = !(input.disabled);
        });
    }

    /**
     * Display the game board's contents on the webpage.
     */
    function render() {
        const gameBoardArray = gameController.getGameBoard();
        const boardCells = Array.from(board.children);
        boardCells.forEach((cell, index) => {
            _removeChildren(cell);
            cell.insertAdjacentHTML('beforeend', gameBoardArray[index]);
        });
    }

    (function() {
        // Set initial values for player's names
        nameInputOne.value = 'Player 1';
        nameInputTwo.value = 'Player 2';
        // Function called when form submitted.
        form.addEventListener('submit', _activateGame, false);
    })();

    return {
        board,
        getGameSettings,
        resetGameSettings,
        toggleActiveInputs,
        render
    };

})(document);


const gameController = (function() {

    const boardElement = displayController.board;
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
     * Display the game winner and reset the game's settings.
     */
    function _endGame() {
        // Assign playerOne and playerTwo variables 'null'.
        playerOne = null;
        playerTwo = null;
        gameWinner = null;
        // TODO: Display congratulations message to winner.

        // Reset the gameSettings object.
        displayController.resetGameSettings();
        // Enable form inputs to start a new game.
        displayController.toggleActiveInputs();
        // Empty contents of the gameboard's array.
        gameBoard.clear();
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
            } else {
                _changeTurns();
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