const Player = (currentPlayer, sign) => {
    const getPlayer = () => currentPlayer;
    const getSign = () => sign;
    let roundWinCount = 0;
    const incrementWin = () => roundWinCount++;
    const getWinCount = () => roundWinCount;
    return { getPlayer, getSign, incrementWin, getWinCount };
}

const gameBoard = (() => {
    const board = document.querySelector('.gameboard');
    const boardSpots = Array.from(document.querySelectorAll('.gameboard div'))
    const playerX = Player('playerX', 'X');
    const playerO = Player('playerO', 'O');
    let roundWinner;
    let signCounter = 0;
    let counter = 0;
    let roundStatus;
    let roundCount = 0;
    let xSigns = [];
    let oSigns = [];

    const winCombos = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['1', '4', '7'],
        ['2', '5', '8'],
        ['3', '6', '9'],
        ['1', '5', '9'],
        ['3', '5', '7'],
    ]

    const resetSignArray = () => {
        xSigns = [];
        oSigns = [];
    }

    const getRoundWinner = () => roundWinner;

    const getSpotCounter = () => counter;

    const resetSpotCounter = () => counter = 0;

    const incrementSpotCounter = () => counter++;

    const getGameWinner = () => {
        let gameWinner;
        if (playerX.getWinCount() > playerO.getWinCount()) {
            gameWinner = playerX.getPlayer();
        }
        else if (playerX.getWinCount() < playerO.getWinCount()) {
            gameWinner = playerO.getPlayer();
        }
        else {
            gameWinner = 'DRAW';
        }
        return gameWinner;
    }

    const getRound = () => roundCount;

    const incrementRoundCount = () => roundCount++;

    const getRoundStatus = () => roundStatus;

    const determineWinner = (signCounter) => {
        winCombos.forEach(winCombo => {
            if (winCombo.every(x => xSigns.includes(x))) {
                playerX.incrementWin();
                roundWinner = playerX.getPlayer();
                roundStatus = 'over';
            }
            else if (winCombo.every(o => oSigns.includes(o))) {
                playerO.incrementWin();
                roundWinner = playerO.getPlayer();
                roundStatus = 'over';
            }
        })
        if (signCounter === 9) {
            roundWinner = 'DRAW';
            roundStatus = 'over';
        }
    }

    const populateBoard = (e) => {
        incrementSpotCounter();
        roundStatus = 'started';
        if (!(playerX.getWinCount() === 3 || playerO.getWinCount() === 3)) {
            signCounter++;
            console.log(signCounter);
            boardSpots.forEach(spot => {
                if ((spot.getAttribute('class') === e.target.getAttribute('class')) && (spot.textContent === '')) {
                    if (getSpotCounter() % 2 !== 0) {
                        spot.textContent = playerX.getSign();
                        xSigns.push(spot.getAttribute('class'));
                    }
                    else {
                        spot.textContent = playerO.getSign();
                        oSigns.push(spot.getAttribute('class'));
                    }
                    if ((xSigns.length >= 3) || (oSigns.length >= 3)) {
                        determineWinner(signCounter);
                    }
                }
            })
        }
        if (gameBoard.getRoundStatus() === 'over') {
            alert(`The winner is ${getRoundWinner()}`)
            displayController.showRoundButton();
            resetSignArray();
            resetSpotCounter();
            signCounter = 0;
            board.removeEventListener('click', populateBoard);
        }
    }

    const playRound = () => {
        incrementRoundCount();
        displayController.setRoundTitle(`Round: ${getRound()}`)
        board.addEventListener('click', populateBoard);
    }

    return {
        playRound,
        getRound,
        getRoundWinner,
        getGameWinner,
        getRoundStatus,
        board,
        boardSpots,
        xSigns,
        oSigns,
    };

})();

const displayController = (() => {
    const roundButton = document.querySelector('.button');
    const roundTitle = document.querySelector('.round-text')

    const showRoundButton = () => {
        roundButton.style.visibility = 'visible';
    }

    const clearBoard = () => {
        roundButton.addEventListener('click', (e) => {
            gameBoard.boardSpots.forEach(spot => spot.textContent = '');
            gameBoard.playRound();
        });
    }

    const setRoundTitle = (title) => {
        roundTitle.textContent = title;
    }

    const playGame = () => {
        gameBoard.playRound();
        clearBoard();
    }

    return {
        playGame,
        showRoundButton,
        clearBoard,
        setRoundTitle
    }

})();

displayController.playGame();