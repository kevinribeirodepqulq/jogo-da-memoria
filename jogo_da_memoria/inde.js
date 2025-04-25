document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const resetButton = document.getElementById('reset-btn');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;
    let timer = 0;
    let timerInterval;
    
    // Emojis para os pares (pode substituir por imagens ou outros caracteres)
    const emojis = ['🇧🇷', '🇦🇷', '🇵🇾', '🇲🇫', '🇺🇾', '🇪🇦', '🇵🇹', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'];
    
    // Inicia o jogo
    function initGame() {
        // Duplica os emojis para criar pares
        const gameCards = [...emojis, ...emojis];
        
        // Embaralha as cartas
        gameCards.sort(() => 0.5 - Math.random());
        
        // Cria o tabuleiro
        gameBoard.innerHTML = '';
        gameCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
        
        // Reseta as variáveis do jogo
        cards = document.querySelectorAll('.card');
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = `Movimentos: ${moves}`;
        clearInterval(timerInterval);
        timer = 0;
        timerDisplay.textContent = `Tempo: ${timer}s`;
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Vira a carta
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        this.textContent = this.dataset.emoji;
        
        if (!hasFlippedCard) {
            // Primeira carta virada
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Segunda carta virada
        secondCard = this;
        moves++;
        movesDisplay.textContent = `Movimentos: ${moves}`;
        checkForMatch();
    }
    
    // Verifica se as cartas são iguais
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === emojis.length) {
                endGame();
            }
        } else {
            unflipCards();
        }
    }
    
    // Desabilita as cartas quando formam um par
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    // Desvira as cartas se não forem iguais
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            
            resetBoard();
        }, 1000);
    }
    
    // Reseta o tabuleiro após cada jogada
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // Atualiza o timer
    function updateTimer() {
        timer++;
        timerDisplay.textContent = `Tempo: ${timer}s`;
    }
    
    // Finaliza o jogo quando todos os pares são encontrados
    function endGame() {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`Parabéns! Você completou o jogo em ${moves} movimentos e ${timer} segundos!`);
        }, 500);
    }
    
    // Evento para reiniciar o jogo
    resetButton.addEventListener('click', initGame);
    
    // Inicia o jogo quando a página carrega
    initGame();
});