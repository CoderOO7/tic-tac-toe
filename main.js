const gameBoard = (function() {

    const NUM_CELLS = 9;
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
        if (!hasCell(index)) return false;
        if (!_isEmptyCell(index)) return false;
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
