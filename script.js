const Gameboard = (() => {
    let board = Array(9).fill(null);
    
    const getBoard = () => [...board];

    const placeMarker = (position, marker) => {
        if (position < 0 || position > 8 || board[position] != null) {
            return false;
        }
        board[position] = marker;
        return true;
    };

    const reset = () => {
        board = Array(9).fill(null);
        console.log("Board reset");
    };

    const printBoard = () => {
        // Create a clearer representation of the board
        console.log('Current board state:');
        for (let i = 0; i < 9; i += 3) {
            // Convert null values to spaces for better visibility
            const row = board.slice(i, i + 3).map(cell => cell || ' ');
            console.log(' ' + row.join(' | '));
            if (i < 6) console.log('-----------');
        }
    };

    return {getBoard, placeMarker, reset, printBoard}
    
})();


const Player = (name,  marker) => {
    return {name, marker};
    
}

const Game = (() => {
    let playerX = Player("Player 1", "X");
    let playerO = Player("Player 2", "O");
    let currentPlayer = playerX;
    let gameOver = false;

    const getCurrentPlayer = () => currentPlayer;

    const getPlayerX = () => playerX;
    const getPlayerO = () => playerO;

    const switchPlayer = () => {
        if (currentPlayer == playerX) {
            currentPlayer = playerO;
        }
        else { currentPlayer = playerX}
        
        DisplayController.setMessage(currentPlayer.name + "'s turn " + currentPlayer.marker)
        console.log("Current player: " + currentPlayer.name)
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winLines = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
            ];
        
        let winner = null;

        winLines.forEach(pattern => {
            const[a,b,c] = pattern;
            if (board[a] && board[a] == board[b] && board[a] == board[c]) {
                winner = board[a] == playerX.marker ? playerX : playerO;
            }
        });

        return winner;

    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell != null);
    }

    const playTurn = (position) => {
        if (gameOver) {
            console.log("Game is over! Reset to play again.");
            return;
        }

        if (Gameboard.placeMarker(position, currentPlayer.marker)) {

            DisplayController.updateBoard();
            console.log(currentPlayer.name + " placed " + currentPlayer.marker + " at position " + position);
            Gameboard.printBoard();

            const winner = checkWin();
            if (winner) {
                console.log(winner.name + " has won!");
                DisplayController.setMessage(winner.name + " wins!")
                gameOver = true;
                return;
            }

            if(checkTie()) {
                DisplayController.setMessage("It's a tie!")
                console.log("It's a tie!");
                gameOver = true;
                return;
            }

            switchPlayer();
        } else {
            console.log("Invalid move, try again.");
        }
    };

    const reset = () => {
        Gameboard.reset();
        currentPlayer = playerX;
        gameOver = false;
        DisplayController.updateBoard();
        DisplayController.setMessage(currentPlayer.name + "'s turn " + currentPlayer.marker)
        console.log("Game has been reset " + playerX.name + " starts with marker " + playerX.marker);
        Gameboard.printBoard();
    };

    const setPlayerNames = (name1, name2) => {
        playerX = Player(name1, "X");
        playerO = Player(name2, "O");
    }

    return { playTurn, reset, getCurrentPlayer, getPlayerX, getPlayerO, setPlayerNames }

})();

const DisplayController = (() => {
    const gameboardElement = document.getElementById('gameboard');
    const messageElement = document.getElementById('message');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');

    const updateBoard = () => {
        gameboardElement.innerHTML = '';
        const board = Gameboard.getBoard();

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.textContent = board[i] || '';
            cell.addEventListener('click', () => Game.playTurn(i));
            gameboardElement.appendChild(cell);
        }
    };

    const setMessage = (text) => {
        messageElement.textContent = text;
    }

    const bindEvents = () => {
        startButton.addEventListener('click', () => {
            const player1Name = player1Input.value.trim() || 'Player 1';
            const player2Name = player2Input.value.trim() || 'Player 2';
            Game.setPlayerNames(player1Name, player2Name);
            Game.reset();
        });

        restartButton.addEventListener('click', () => {
            Game.reset();
        });
    };

    return { updateBoard, setMessage, bindEvents };


})();

document.addEventListener('DOMContentLoaded', () => {
    DisplayController.bindEvents();
    Game.reset();
});