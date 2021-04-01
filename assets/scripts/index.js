const canvas = document.getElementById("the-canvas");
const ctx = canvas.getContext("2d");
const difficulty = "hard";

class Component {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

class Game {
  constructor(player) {
    this.player = player;
    this.animationId;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
  }

  startGame = () => {
    this.updateGameArea();
  };

  // Usando arrow function para não criar um novo escopo dentro desse método e o this continuar apontando para a própria classe
  updateGameArea = () => {
    this.clear();

    this.player.newPos();
    this.player.update();

    this.updateObstacles();

    this.updateScore();

    this.animationId = requestAnimationFrame(this.updateGameArea);

    this.checkGameOver();
  };

  updateObstacles = () => {
    for (let i = 0; i < this.obstacles.length; i++) {
      if (difficulty === "easy") {
        this.obstacles[i].x -= 1;
      } else if (difficulty === "moderate") {
        this.obstacles[i].x -= 2;
      } else {
        this.obstacles[i].x -= 3;
      }

      this.obstacles[i].update();
    }

    this.frames += 1;
    if (this.frames % 120 === 0) {
      const originX = canvas.width;

      const minHeight = 20;
      const maxHeight = 200;
      const height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );

      let minGap = 50;
      let maxGap = 200;
      let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

      this.obstacles.push(new Component(originX, 0, 20, height, "green"));
      this.obstacles.push(
        new Component(
          originX,
          height + gap,
          20,
          originX - height - gap,
          "green"
        )
      );

      this.score++;
    }
  };

  clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  checkGameOver = () => {
    const crashed = this.obstacles.some((obstacle) => {
      return this.player.crashWith(obstacle);
    });

    if (crashed) {
      cancelAnimationFrame(this.animationId);
      this.gameOver();
    }
  };

  updateScore = () => {
    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${this.score}`, 50, 50);
  };

  gameOver() {
    this.clear();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "70px Verdana";
    ctx.fillText(`GAME OVER`, 200, 230);

    ctx.fillStyle = "white";
    ctx.font = "40px Verdana";
    ctx.fillText(`Final Score: ${this.score}`, 280, 290);
  }
}

window.addEventListener("load", () => {
  const player = new Component(0, 110, 30, 30, "red");

  const game = new Game(player);

  game.startGame();

  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowUp":
        if (difficulty !== "easy") {
          return (game.player.speedY -= 2);
        }
        return (game.player.speedY = -2);
      case "ArrowDown":
        if (difficulty !== "easy") {
          return (game.player.speedY += 2);
        }
        return (game.player.speedY = 2);
      case "ArrowRight":
        if (difficulty !== "easy") {
          return (game.player.speedX += 2);
        }
        return (game.player.speedX = 2);
      case "ArrowLeft":
        if (difficulty !== "easy") {
          return (game.player.speedX -= 2);
        }
        return (game.player.speedX = -2);
    }
  });

  document.addEventListener("keyup", () => {
    game.player.speedX = 0;
    game.player.speedY = 0;
  });
});
