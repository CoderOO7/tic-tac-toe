
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

    /**
     * Remove all child nodes from a gameboard cell element.
     * @param {Object} cell - A gameboard cell element on the webpage.
     */
    function _removeChildren(cell) {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
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

    return {
        board,
        render
    };

})(document);


const gameController = (function() {

    const playerOne = playerFactory('Player 1', 'X', true);
    const playerTwo = playerFactory('Player 2', 'O', false);
    const boardElement = displayController.board;
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
     * Update the gameboard after a player makes their move.
     * @param {Object} player       - Player object who just played.
     * @param {Object} cellIndex    - Cell's index number in the gameboard.
     */
    function _executePlay(player, cellIndex) {
        const wasUpdated = gameBoard.update(cellIndex, player.marker);
        if (wasUpdated) {
            displayController.render();
            if (_isGameOver()) {
                // TODO: 1. Remove event listener for click events from board.
                // TODO: 2. Enable 'Play Again' button.
                // TODO: 3. Display congratulations message to winner.
            } else {
                _changeTurns();
            }
        }
    }

    /**
     * Callback for `click` events on the gameboard.
     * @param {Object} param0 - Contains target element clicked.
     */
    function _handleBoardClick({target}) {
        const cellClicked = target.closest('.board__cell');
        if (cellClicked) {
            const cellIndex = parseInt(cellClicked.dataset.cellNumber) - 1;
            const activePlayer = _getActivePlayer();
            _executePlay(activePlayer, cellIndex);
        }
    }

    const emptyGameBoard = () => {gameBoard.clear();};
    const getGameBoard = () => gameBoard.get();

    boardElement.addEventListener('click', _handleBoardClick, false);

    return {
        emptyGameBoard,
        getGameBoard
    };

})();