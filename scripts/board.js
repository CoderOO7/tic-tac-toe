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

export {gameBoard};