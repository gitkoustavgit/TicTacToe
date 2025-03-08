document.addEventListener('DOMContentLoaded', () => {
    const statusDisplay = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    const restartBtn = document.getElementById('restart-btn');
    const resetScoreBtn = document.getElementById('reset-score-btn');
    const xScoreDisplay = document.getElementById('x-score');
    const oScoreDisplay = document.getElementById('o-score');
    const drawsDisplay = document.getElementById('draws');
    
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = {
      X: 0,
      O: 0,
      draws: 0
    };

    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]             
    ];

    function handleCellClick(clickedCellEvent) {
      const clickedCell = clickedCellEvent.target;
      const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

      if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
      }

      gameState[clickedCellIndex] = currentPlayer;
      clickedCell.textContent = currentPlayer;
      clickedCell.classList.add(currentPlayer.toLowerCase());
      clickedCell.style.transform = 'scale(0.9)';

      setTimeout(() => {
        clickedCell.style.transform = 'scale(1)';
      }, 100);

      checkResult();
    }

    function checkResult() {
      let roundWon = false;
      let winningLine = null;

      for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
          continue;
        }
        
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
          roundWon = true;
          winningLine = [a, b, c];
          break;
        }
      }

      if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        scores[currentPlayer]++;
        updateScoreDisplay();
        highlightWinningCells(winningLine);
        return;
      }

      const roundDraw = !gameState.includes('');
      if (roundDraw) {
        statusDisplay.textContent = 'Game ended in a draw!';
        gameActive = false;
        scores.draws++;
        updateScoreDisplay();
        return;
      }

      changePlayer();
    }

    function highlightWinningCells(line) {
      line.forEach(index => {
        document.querySelector(`.cell[data-index="${index}"]`).classList.add('winner');
      });
    }

    function changePlayer() {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }

    function restartGame() {
      gameActive = true;
      currentPlayer = 'X';
      gameState = ['', '', '', '', '', '', '', '', ''];
      statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
      
      cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
      });
    }

    function resetScore() {
      scores = { X: 0, O: 0, draws: 0 };
      updateScoreDisplay();
      restartGame();
    }

    function updateScoreDisplay() {
      xScoreDisplay.textContent = scores.X;
      oScoreDisplay.textContent = scores.O;
      drawsDisplay.textContent = scores.draws;
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);
    resetScoreBtn.addEventListener('click', resetScore);
  });