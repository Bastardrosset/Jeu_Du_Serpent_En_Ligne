window.onload = function(){
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlock = canvasWidth/blockSize;
    var heightInBlock = canvasHeight/blockSize;
    var score;
    var timeOut;

    init();

   function init(){
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border ="1.5rem solid #6A9113"; 
    canvas.style.margin = "5rem auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    snakee = new Snake([[6,4], [5,4], [4,4],[3,4],[2,4]],"right");
    applee = new Apple([10, 10]);
    score = 0;
    refreshCanvas();
   }
   function refreshCanvas(){
        snakee.advance();
        if(snakee.checkCollision()){
            gameOver();
        } else {
            if(snakee.isEatingApple(applee)){   
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                } while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas,delay);
        }
   }
   function gameOver(){
    ctx.save();
    ctx.font = "bold 4rem sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight /2;
    ctx.strokeText("Game Over",centreX, centreY - 180);
    ctx.fillText("Game Over",centreX, centreY - 180);
    ctx.font = "bold 2rem sans-serif";
    ctx.strokeText("Enter pour rejouer",centreX, centreY - 120 )
    ctx.fillText("Enter pour rejouer",centreX, centreY - 120 )
    ctx.restore();
   }
   function restart(){
    snakee = new Snake([[6,4], [5,4], [4,4]],"right");
    applee = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeOut);
    refreshCanvas();
   }
   function drawScore(){
    ctx.save();
    ctx.font = "bold 20rem sans-serif";
    ctx.fillStyle = "#424242";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centreX = canvasWidth / 2;
    var centerY = canvasHeight /2;
    ctx.fillText(score.toString(),centreX, centerY);
    ctx.restore();
   }
   function drawBlock(ctx,position){
       var x = position[0] * blockSize;
       var y = position[1] * blockSize;
       ctx.fillRect(x, y, blockSize, blockSize);
   }
   function Snake(body,direction){
       this.body = body;
       this.direction = direction;
       this.ateApple = false;
       this.draw = function()
       {
           ctx.save();
           ctx.fillStyle = "#684400";
           for(var i = 0; i < this.body.length; i ++){
               drawBlock(ctx, this.body[i]);
           }
           ctx.restore();
       };
       this.advance = function()  {
           var nextPosition = this.body[0].slice();
           switch(this.direction) {
               case "left":
                nextPosition[0] -= 1;
                    break;
               case "right":
                nextPosition[0] += 1;
                    break;
               case "down":
                nextPosition[1] += 1;
                    break;
               case "up":
                nextPosition[1] -= 1;
                    break;
               default:
                   throw("invalid Direction");
           }
           this.body.unshift(nextPosition);
           if(!this.ateApple)
                this.body.pop();
           else
                this.ateApple = false; 
       };
       this.setDirection = function(newDirection){
           var allowedDirections;
           switch(this.direction) {
            case "left":  
            case "right":
                allowedDirections =["up","down"];
                    break;
            case "down":
            case "up":
                allowedDirections =["left","right"];
                    break;
            default:
                   throw("invalid Direction");
           }
           if(allowedDirections.indexOf(newDirection) > -1){
            this.direction = newDirection;
           }
       };
       this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock - 1;
            var maxY = heightInBlock - 1;
            var inNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var inNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(inNotBetweenHorizontalWalls || inNotBetweenVerticalWalls){
                wallCollision = true;
            } for(var i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true; 
                    }
            }
            return wallCollision || snakeCollision;
       };
       this.isEatingApple = function(appleToEat){
           var head = this.body[0];
                if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                    return true;
                }
                else
                return false;
       };
    }
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] *blockSize + radius;
            var y = this.position[1] *blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlock - 1));
            var newY = Math.round(Math.random() * (heightInBlock - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            for(var i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }


    document.onkeydown = function handleKeyDown(e) {
        var key = e.key;
        var newDirection;
        switch (key) {
          case "ArrowLeft":
            newDirection = "left";
            break;
          case "ArrowUp":
            newDirection = "up";
            break;
          case "ArrowRight":
            newDirection = "right";
            break;
          case "ArrowDown":
            newDirection = "down";
            break;
          case "Enter":
            restart();
            return;
          default:
            return;
        }
        snakee.setDirection(newDirection);
      };
}