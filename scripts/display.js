import {gameController} from './game.js';

const displayController = (function(doc) {

    const board = doc.getElementById('board');
    const nameInputOne = doc.getElementById('p1-name');
    const nameInputTwo = doc.getElementById('p2-name');
    const opponentInputOne = doc.getElementById('player');
    const opponentInputTwo = doc.getElementById('computer');
    const form = doc.querySelector('.form');
    const gameOutput = doc.querySelector('.game-output');
    let gameSettings = {};

    /**
     * Remove all child elements from a node in the document.
     * @param {Object} node - A node on the webpage.
     */
    function _removeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    /**
     * Control the second player's name input based on opponent selection.
     */
    function _handleOpponentChange() {
        if (this.id === 'computer') {
            nameInputTwo.value = 'Computer';
            nameInputTwo.setAttribute('readonly', '');
        } else {
            nameInputTwo.value = 'Player 2';
            nameInputTwo.removeAttribute('readonly');
        }
    }

    /**
     * Add event listeners for when the selected opponent input changes.
     */
    function _detectOpponentChanges() {
        const opponentInputs = [opponentInputOne, opponentInputTwo];
        opponentInputs.forEach(opponent => {
            const func = _handleOpponentChange.bind(opponent);
            opponent.addEventListener('input', func, false);
        });
    }

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
     * Clear the current message displayed.
     */
    function _clearMessage() {
        _removeChildren(gameOutput);
        gameOutput.insertAdjacentHTML('beforeend', '&nbsp;');
    }

    /**
     * Start a new game clearing the previous game's output, disabling the form,
     * and saving the form's input values.
     * @param {Object} event - 'Submit' event causing the form's submission.
     */
    function _activateGame(event) {
        event.preventDefault();
        // Show the new gameboard after it's been cleared.
        render();
        // Clear game result of previous game.
        _clearMessage();
        // Disable the form's input values.
        toggleActiveInputs();
        // Save input values inside gameSettings object
        _setGameSettings();
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

    /**
     * Display messages for errors, or for end-of-game results (win/tie).
     * @param {string} outputString - String to display on screen.
     */
    function showMessage(outputString) {
        _removeChildren(gameOutput);
        gameOutput.insertAdjacentText('beforeend', outputString);
    }

    (function() {
        // Set initial values for player's names
        nameInputOne.value = 'Player 1';
        nameInputTwo.value = 'Player 2';
        // Change player 2's name based on opponent input changes.
        _detectOpponentChanges();
        // Function called when form submitted.
        form.addEventListener('submit', _activateGame, false);
    })();

    return {
        board,
        getGameSettings,
        resetGameSettings,
        toggleActiveInputs,
        render,
        showMessage
    };

})(document);

export {displayController};