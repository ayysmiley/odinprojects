const Player = (color) => {
	const getColor = () => color;

	return {
		getColor,
	};
};

const gameBoard = (() => {
	let board = new Array(9).fill(null);

	const getBoard = (pos) => {
		if (pos > board.length) return;
		if (!pos) return board;
		return board[pos];
	};

	const setBoard = (pos, player) => {
		if (pos > board.length) return;
		board[pos] = player;
	};

	const resetBoard = () => {
		board.fill(null);
	};

	return {
		getBoard,
		setBoard,
		resetBoard,
	};
})();

const gameController = (() => {
	const p1 = Player("red");
	const p2 = Player("blue");

	const newGame = () => {
		gameOver = false;
		winDisplay.classList.add("d-none");
		turn = randomTurn();
		gameBoard.resetBoard();
		displayController.render();
	};

	const playRound = (index) => {
		gameBoard.setBoard(index, turn);
		//Winner
		if (checkWinner(gameBoard.getBoard(), index)) {
			gameOver = true;
			displayController.winRender("W", turn);
			turn = null;
			return;
		}
		//Tie
		if (!gameBoard.getBoard().includes(null)) {
			gameOver = true;
			displayController.winRender("T");
			turn = null;
			return;
		}
		turn == p1.getColor() ? (turn = p2.getColor()) : (turn = p1.getColor());
	};

	const checkWinner = (board, index) => {
		const winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		return winConditions
			.filter((combo) => combo.includes(index))
			.some((newCombo) => newCombo.every((i) => board[i] === turn));
	};

	const randomTurn = () => {
		let roll = Math.floor(Math.random() * 2);
		if (roll === 0) {
			return p1.getColor();
		} else {
			return p2.getColor();
		}
	};

	let turn = randomTurn();
	const getTurn = () => turn;

	let gameOver = false;
	const getGameOver = () => gameOver;

	return {
		newGame,
		playRound,
		getTurn,
		getGameOver,
		p1,
		p2,
	};
})();

const displayController = (() => {
	const tiles = document.querySelectorAll("td");
	const p1 = gameController.p1;
	const p2 = gameController.p2;
	const p1Display = document.querySelector("#p1Display");
	const p2Display = document.querySelector("#p2Display");
	const winDisplay = document.querySelector("#winDisplay");

	//Check if tile is selected OR if game is over
	//Then play round + render
	tiles.forEach((tile) => {
		tile.addEventListener("click", () => {
			if (gameBoard.getBoard(tile.dataset.index) != null || gameController.getGameOver() === true)
				return;
			gameController.playRound(parseInt(tile.dataset.index));
			render();
		});
	});

	const render = () => {
		//Compare to gameBoard array and fill tiles if selected
		tiles.forEach((tile) => {
			if (gameBoard.getBoard(tile.dataset.index) === p1.getColor()) {
				tile.classList.add(p1.getColor());
			} else if (gameBoard.getBoard(tile.dataset.index) === p2.getColor()) {
				tile.classList.add(p2.getColor());
			} else {
				tile.classList = [];
			}
		});

		//Show player turn
		if (gameController.getTurn() === p1.getColor()) {
			p1Display.classList = [];
			p1Display.querySelector("h1").innerHTML = p1.getColor().toUpperCase();
			p2Display.classList.add("d-none");
		} else if (gameController.getTurn() === p2.getColor()) {
			p2Display.classList = [];
			p2Display.querySelector("h1").innerHTML = p2.getColor().toUpperCase();
			p1Display.classList.add("d-none");
		} else {
			p2Display.classList.add("d-none");
			p1Display.classList.add("d-none");
		}
	};

	//Show winner or tie div
	const winRender = (result, winner) => {
		winDisplay.classList = [];

		if (result === "W") {
			winDisplay.querySelector("h1").innerHTML = winner.toUpperCase() + " wins the game!";
		}
		if (result === "T") {
			winDisplay.querySelector("h1").innerHTML = "TIE!";
		}
	};

	render();

	return {
		render,
		winRender,
	};
})();
