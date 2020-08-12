
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

    return {
        get,
        hasCell,
        update
    };

})();


const displayController = (function(doc) {

    const board = doc.getElementById('board');
    const boardCells = Array.from(board.children);

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
        const gameBoardArray = gameBoard.get();
        boardCells.forEach((cell, index) => {
            // Check that index is in range of the board's array.
            if (gameBoard.hasCell(index)) {
                _removeChildren(cell);
                cell.insertAdjacentHTML('beforeend', gameBoardArray[index]);
            }
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

    /**
     * Return true if it is currently a player's turn, else false.
     * @param {Object} player - Player object to check.
     */
    function _isPlayerTurn(player) {
        return player.isMyTurn;
    }

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

    function _isGameOver() {
        const gameBoardArray = gameBoard.get();
        // Gameboard must contain 3-in-a-row or be a tie.
            // TODO: 1. Check 3-in-a-row.
            // Any column/row/diagonal only contains one marker.
            // TODO: 2. Check if game is tied.
            // Gameboard contains no empty spots.
    }

    /**
     * Update the gameboard after a player makes their move.
     * @param {Object} player       - Player object who just played.
     * @param {Object} cellNumber   - Cell's index number in the gameboard.
     */
    function _executePlay(player, cellIndex) {
        const wasUpdated = gameBoard.update(cellIndex, player.marker);
        if (!wasUpdated) {
            return;
        } else if (_isGameOver()) {
            // TODO: 1. Remove event listener for click events from board.
            // TODO: 2. Enable 'Play Again' button.
            // TODO: 3. Display congratulations message to winner.
        } else {
            _changeTurns();
            displayController.render();
        }
    }

    /**
     * Callback for `click` events on the gameboard.
     * @param {Object} param0 - Contains target element clicked.
     */
    function _handleBoardClick({target}) {
        const cellClicked = target.closest('board__cell');
        if (cellClicked) {
            const cellIndex = parseInt(cellClicked.dataset.cellNumber) - 1;
            const activePlayer = _getActivePlayer();
            _executePlay(activePlayer, cellIndex);
        }
    }

    boardElement.addEventListener('click', _handleBoardClick, false);

})();