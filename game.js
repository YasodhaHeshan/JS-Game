class Player {
    constructor(x, y, color, isPlayer1) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
        this.color = color;
        this.speed = 5;
        this.isJumping = false;
        this.health = 100;
        this.isPlayer1 = isPlayer1;
        this.isAttacking = false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 20, 50, 10);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 20, (this.health / 100) * 50, 10);
    }

    move(direction) {
        if (direction === 'left') {
            this.x -= this.speed;
        } else if (direction === 'right') {
            this.x += this.speed;
        }
        
        // Keep player within canvas bounds
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            let jumpHeight = 0;
            const jumpInterval = setInterval(() => {
                if (jumpHeight < 100) {
                    this.y -= 5;
                    jumpHeight += 5;
                } else if (jumpHeight < 200) {
                    this.y += 5;
                    jumpHeight += 5;
                } else {
                    this.isJumping = false;
                    clearInterval(jumpInterval);
                }
            }, 20);
        }
    }

    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            setTimeout(() => {
                this.isAttacking = false;
            }, 500);
        }
    }
}

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create players
const player1 = new Player(100, canvas.height - 150, 'blue', true);
const player2 = new Player(canvas.width - 150, canvas.height - 150, 'red', false);

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function handleInput() {
    // Player 1 controls (WASD + F)
    if (keys['a']) player1.move('left');
    if (keys['d']) player1.move('right');
    if (keys['w']) player1.jump();
    if (keys['f']) player1.attack();

    // Player 2 controls (Arrow keys + P)
    if (keys['ArrowLeft']) player2.move('left');
    if (keys['ArrowRight']) player2.move('right');
    if (keys['ArrowUp']) player2.jump();
    if (keys['p']) player2.attack();
}

function checkCollisions() {
    if (player1.isAttacking && 
        player1.x + player1.width >= player2.x && 
        player1.x <= player2.x + player2.width &&
        player1.y + player1.height >= player2.y &&
        player1.y <= player2.y + player2.height) {
        player2.health -= 10;
    }

    if (player2.isAttacking && 
        player2.x + player2.width >= player1.x && 
        player2.x <= player1.x + player1.width &&
        player2.y + player2.height >= player1.y &&
        player2.y <= player1.y + player1.height) {
        player1.health -= 10;
    }
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Handle input
    handleInput();

    // Check collisions
    checkCollisions();

    // Draw players
    player1.draw(ctx);
    player2.draw(ctx);

    // Check for game over
    if (player1.health <= 0 || player2.health <= 0) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText(
            `${player1.health <= 0 ? 'Player 2' : 'Player 1'} Wins!`,
            canvas.width / 2 - 100,
            canvas.height / 2
        );
        return;
    }

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 