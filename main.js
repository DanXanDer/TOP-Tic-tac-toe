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

    const getRoundWinner = () => roundWinner;

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

    const getRoundStatus = () => roundStatus;

    const determineWinner = () => {
        winCombos.forEach(winCombo => {
            if (winCombo.every(x => xSigns.includes(x))) {
                playerX.incrementWin();
                roundWinner = playerX.getPlayer();
                roundStatus = 'over';
                xSigns = [];
                counter = 0;
            }
            else if (winCombo.every(o => oSigns.includes(o))) {
                playerO.incrementWin();
                roundWinner = playerO.getPlayer();
                roundStatus = 'over';
                oSigns = [];
                counter = 0;
            }
        })
    }

    const populateBoard = (counter, spot) => {
        if (counter % 2 !== 0) {
            spot.textContent = playerX.getSign();
            xSigns.push(spot.getAttribute('class'));
        }
        else {
            spot.textContent = playerO.getSign();
            oSigns.push(spot.getAttribute('class'));
        }
        if ((xSigns.length >= 3) || (oSigns.length >= 3)) {
            determineWinner();
        }
    }

    const playRound = () => {
        let counter = 0;
        board.addEventListener('click', (e) => {
            counter++;
            console.log(counter);
            if (!(playerX.getWinCount() === 1 || playerO.getWinCount() === 1)) {
                boardSpots.forEach(spot => {
                    if ((spot.getAttribute('class') === e.target.getAttribute('class')) && (spot.textContent === '')) {
                        populateBoard(counter, spot);
                    }
                })
            }
            if (gameBoard.getRoundStatus() === 'over') {
                displayController.showRoundButton();
                console.log(roundStatus);
            }
        })

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

    const showRoundButton = () => {
        roundButton.style.visibility = 'visible';
    }

    const clearBoard = () => {
        roundButton.addEventListener('click', (e) => {
            gameBoard.boardSpots.forEach(spot => spot.textContent = '');
        });
    }
    //roundButton.addEventListener('click', clearBoard);

    const playGame = () => {
        gameBoard.playRound();
    }
    return {
        playGame,
        showRoundButton,
        clearBoard,
    }
})();

displayController.playGame();
displayController.clearBoard();