// ========================================
// GET HTML ELEMENTS
// ========================================

const cells = document.querySelectorAll(".cell");

const twoPlayerBtn =
    document.getElementById("twoPlayerBtn");

const aiBtn =
    document.getElementById("aiBtn");

const turnMessage =
    document.getElementById("turnMessage");

const resultMessage =
    document.getElementById("resultMessage");

const resetBtn =
    document.getElementById("resetBtn");


// ========================================
// GAME VARIABLES
// ========================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "two-player";


// ========================================
// WINNING COMBINATIONS
// ========================================

const winningCombinations = [

    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6]

];


// ========================================
// CELL CLICK
// ========================================

cells.forEach(function (cell) {

    cell.addEventListener("click", function () {

        const index =
            Number(cell.dataset.index);


        // Don't allow moves if game is over

        if (!gameActive) {
            return;
        }


        // Don't allow clicking an occupied cell

        if (board[index] !== "") {
            return;
        }


        // In AI mode, don't allow
        // player to play when it is O's turn

        if (
            gameMode === "ai" &&
            currentPlayer === "O"
        ) {
            return;
        }


        // Make player's move

        makeMove(index, currentPlayer);


        // If game ended, stop

        if (!gameActive) {
            return;
        }


        // AI turn

        if (
            gameMode === "ai" &&
            currentPlayer === "O"
        ) {

            turnMessage.textContent =
                "AI is thinking...";


            setTimeout(function () {

                makeAIMove();

            }, 500);

        }

    });

});


// ========================================
// MAKE MOVE
// ========================================

function makeMove(index, player) {

    // Store move

    board[index] = player;


    // Display move

    cells[index].textContent = player;


    // Add class for styling

    if (player === "X") {

        cells[index].classList.add("x");

    } else {

        cells[index].classList.add("o");

    }


    // Check game

    checkGame();

}


// ========================================
// CHECK GAME
// ========================================

function checkGame() {

    // Check every winning combination

    for (
        let combination of winningCombinations
    ) {

        const a = combination[0];

        const b = combination[1];

        const c = combination[2];


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {

            // Game won

            gameActive = false;


            // Highlight winning cells

            cells[a].classList.add("winner");

            cells[b].classList.add("winner");

            cells[c].classList.add("winner");


            resultMessage.textContent =
                `${currentPlayer} Wins!`;

            turnMessage.textContent =
                "Game Over";

            return;
        }

    }


    // ====================================
    // CHECK DRAW
    // ====================================

    if (!board.includes("")) {

        gameActive = false;

        resultMessage.textContent =
            "It's a Draw!";

        turnMessage.textContent =
            "Game Over";

        return;
    }


    // ====================================
    // CHANGE PLAYER
    // ====================================

    if (currentPlayer === "X") {

        currentPlayer = "O";

    } else {

        currentPlayer = "X";

    }


    // Update message

    if (gameMode === "ai" &&
        currentPlayer === "O") {

        turnMessage.textContent =
            "AI's Turn";

    } else {

        turnMessage.textContent =
            `Player ${currentPlayer}'s Turn`;

    }

}


// ========================================
// AI MOVE
// ========================================

function makeAIMove() {

    if (!gameActive) {
        return;
    }


    // ------------------------------------
    // 1. Try to win
    // ------------------------------------

    const winningMove =
        findWinningMove("O");


    if (winningMove !== null) {

        makeMove(winningMove, "O");

        return;
    }


    // ------------------------------------
    // 2. Block player
    // ------------------------------------

    const blockingMove =
        findWinningMove("X");


    if (blockingMove !== null) {

        makeMove(blockingMove, "O");

        return;
    }


    // ------------------------------------
    // 3. Take center
    // ------------------------------------

    if (board[4] === "") {

        makeMove(4, "O");

        return;
    }


    // ------------------------------------
    // 4. Take a corner
    // ------------------------------------

    const corners = [
        0,
        2,
        6,
        8
    ];

    const availableCorners =
        corners.filter(function (index) {

            return board[index] === "";

        });


    if (availableCorners.length > 0) {

        const randomCorner =
            availableCorners[
            Math.floor(
                Math.random() *
                availableCorners.length
            )
            ];

        makeMove(randomCorner, "O");

        return;
    }


    // ------------------------------------
    // 5. Take any available cell
    // ------------------------------------

    const availableCells = [];

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {

            availableCells.push(i);

        }

    }


    if (availableCells.length > 0) {

        const randomCell =
            availableCells[
            Math.floor(
                Math.random() *
                availableCells.length
            )
            ];

        makeMove(randomCell, "O");

    }

}


// ========================================
// FIND WINNING MOVE
// ========================================

function findWinningMove(player) {

    for (
        let combination of winningCombinations
    ) {

        const a = combination[0];

        const b = combination[1];

        const c = combination[2];


        // Player has two cells and
        // one empty cell

        if (
            board[a] === player &&
            board[b] === player &&
            board[c] === ""
        ) {

            return c;

        }


        if (
            board[a] === player &&
            board[c] === player &&
            board[b] === ""
        ) {

            return b;

        }


        if (
            board[b] === player &&
            board[c] === player &&
            board[a] === ""
        ) {

            return a;

        }

    }


    return null;

}


// ========================================
// TWO PLAYER MODE
// ========================================

twoPlayerBtn.addEventListener(
    "click",
    function () {

        gameMode = "two-player";

        twoPlayerBtn.classList.add("active");

        aiBtn.classList.remove("active");

        resetGame();

    }
);


// ========================================
// AI MODE
// ========================================

aiBtn.addEventListener(
    "click",
    function () {

        gameMode = "ai";

        aiBtn.classList.add("active");

        twoPlayerBtn.classList.remove("active");

        resetGame();

    }
);


// ========================================
// RESET BUTTON
// ========================================

resetBtn.addEventListener(
    "click",
    function () {

        resetGame();

    }
);


// ========================================
// RESET GAME
// ========================================

function resetGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameActive = true;


    // Clear all cells

    cells.forEach(function (cell) {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });


    resultMessage.textContent = "";

    turnMessage.textContent =
        "Player X's Turn";

}