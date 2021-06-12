// sets variable to the canvas html object
var canvas = document.querySelector('#board');

// canvas object context
var g = canvas.getContext('2d');

// controls when game is opened for first time
var justOpened = true;

// possible directions using x and y coordinates
const right = {x: 1, y: 0};
const down = {x: 0, y: 1};
const left = {x: -1, y: 0};

// current shape going down
var currentShape;

// next shape that will appear
var nextShape;

// grid dimensions
var gridRows = 18;
var gridCols = 12;

// font information for messages
var mainFont = 'bold 47px monospace';
var smallFont = 'bold 17px monospace';

// color list for the shapes
var colors = ['red', 'blue', 'green', 'purple', 'orange', 'brown', 'pink'];

// rect object that contains the grid
var gridRect = { x: 46, y: 47, w: 308, h: 516 };

// rect object that contains the preview square
var previewRect = { x: 400, y: 55, w: 175, h: 175 };

// position of falling shape
var currentRow;
var currentCol;

// tells if user is holding a key down
var keyDown = false;
var holdDown = false;

// this represents the tetris board as an array
var grid = [];

// new board object that represents the game
var board = new Board();

// turns before key combo changes
var rotationTurns = 5;

// 1 is standard key combo, 2 is reverse, 3 is rotate clockwise, 4 is rotate counterclockwise
var keyCombo = 1;

// all possible shapes represented as array of arrays
// -1s are empty spaces, 1 or 2 represents possible squares for rotation,
//  0 represents a block
const Shapes = 
{
    LShape: [[-1, -1], [0, -1], [0, 0], [0, 1]],
    SShape: [[0, -1], [0, 0], [1, 0], [1, 1]],
    IShape: [[0, -1], [0, 0], [0, 1], [0, 2]],
    Square: [[0, 0], [1, 0], [0, 1], [1, 1]],
    ZShape: [[0, -1], [0, 0], [-1, 0], [-1, 1]],
    JShape: [[1, -1], [0, -1], [0, 0], [0, 1]],
    TShape: [[-1, 0], [0, 0], [1, 0], [0, 1]]
};

// initiates the game when windown is open
function init() 
{
    keyCombo = 1;
    createGrid();
    selectShape();
    draw();
    setControlDisplay();
}

// start game button
document.getElementById("startButton").addEventListener('click', function () 
{
    startNewGame();
});

// starts new game when start button is pressed
function startNewGame() 
{
    // sets default arrow key combo
    keyCombo = 1;
    setControlDisplay();
    board.reset();
    createGrid();
    selectShape(); 
    animate(-1);
}

// creates the grid on the canvas
function createGrid() 
{
    // goes thru each row in the grid and sets the number of columns
    for (var r = 0; r < gridRows; r++) 
    {
        grid[r] = new Array(gridCols);

        // fills the grid with -1s to represent that they are empty
        fill(grid[r], -1);

        // finds the grid borders and sets them to -2
        for (var c = 0; c < gridCols; c++) 
        {
            if (c === 0 || c === gridCols - 1 || r === gridRows - 1)
                grid[r][c] = -2;
        }
    }
}

// fills an array with a value
function fill(arr, value) 
{
    for (var i = 0; i < arr.length; i++) 
    {
        arr[i] = value;
    }
}

function selectShape() 
{
    // sets starting location of shape
    currentRow = 1;
    currentCol = 5;

    // sets the current shape and then readies the next shape
    currentShape = nextShape;
    nextShape = getRandomShape();
}


// event listeners for arrow presses
addEventListener('keydown', function (e) 
{
    // each arrow key will do something different depending on
    // the keyCombo variable
    if (!keyDown) 
    {
        keyDown = true;
        if (board.isGameOver())
            return;

        switch (e.key) 
        {
            case 'ArrowUp':
                if (keyCombo === 1)
                {
                    if (canFlip(currentShape))
                    {
                        rotate(currentShape);
                    }
                }
                else if (keyCombo === 2)
                {
                    holdDown = true;
                    while (canMove(currentShape, down)) 
                    {
                        move(down);
                        draw();
                    }
                    lockShape();
                }
                else if (keyCombo === 3)
                {
                    if (canMove(currentShape, right))
                    {
                        move(right);
                    }
                }
                else if (keyCombo === 4)
                {
                    if (canMove(currentShape, left))
                    {
                        move(left);
                    }
                }
                break;
            case 'ArrowLeft':
                if (keyCombo === 1)
                {
                    if (canMove(currentShape, left))
                    {
                        move(left);
                    }
                }
                else if (keyCombo === 2)
                {
                    if (canMove(currentShape, right))
                    {
                        move(right);
                    }
                }
                else if (keyCombo === 3)
                {
                    if (canFlip(currentShape))
                    {
                        rotate(currentShape);
                    }
                }
                else if (keyCombo === 4)
                {
                    holdDown = true;
                    while (canMove(currentShape, down)) 
                    {
                        move(down);
                        draw();
                    }
                    lockShape();
                }
                break;
            case 'ArrowRight':
                if (keyCombo === 1)
                {
                    if (canMove(currentShape, right))
                    {
                        move(right);
                    }
                }
                else if (keyCombo === 2)
                {
                    if (canMove(currentShape, left))
                    {
                        move(left);
                    }
                }
                else if (keyCombo === 3)
                {
                    holdDown = true;
                    while (canMove(currentShape, down)) 
                    {
                        move(down);
                        draw();
                    }
                    lockShape();
                }
                else if (keyCombo === 4)
                {
                    if (canFlip(currentShape))
                    {
                        rotate(currentShape);
                    }
                }
                break;
            case 'ArrowDown':
                if (keyCombo === 1)
                {
                    if (!holdDown) 
                    {
                        holdDown = true;
                        while (canMove(currentShape, down)) 
                        {
                            move(down);
                            draw();
                        }
                        lockShape();
                    }
                }
                else if (keyCombo === 2)
                {
                    if (canFlip(currentShape))
                    {
                        rotate(currentShape);
                    }
                }
                else if (keyCombo === 3)
                {
                    if (canMove(currentShape, left))
                    {
                        move(left);
                    }
                }
                else if (keyCombo === 4)
                {
                    if (canMove(currentShape, right))
                    {
                        move(right);
                    }
                }
        }
        draw();
    }
});

// event listener for when the user lets go of the keys
addEventListener('keyup', function () 
{
    keyDown = false;
    holdDown = false;
});

// tests if the shape can rotate
function canFlip(shape) 
{
    // shape cannot rotate if it's a square
    if (shape === Shapes.Square)
        return false;

    // temp array
    var pos = new Array(4);

    // copies the shape into the temp array
    for (var i = 0; i < pos.length; i++) 
    {
        pos[i] = shape.pos[i].slice();
    }

    // tries to rotate the shape even if it doesnt work
    pos.forEach(function (row) 
    {
        var temp = row[0];
        row[0] = row[1];
        row[1] = -temp;
    });

    // 
    return pos.every(function (p) 
    {
        var newCol = currentCol + p[0];
        var newRow = currentRow + p[1];
        return grid[newRow][newCol] === -1;
    });
}

// rotates the current shape
function rotate(shape) 
{
    // cannot rotate a square
    if (shape === Shapes.Square)
        return;

    shape.pos.forEach(function (row) 
    {
        var temp = row[0];
        row[0] = row[1];
        row[1] = -temp;
    });
}

// moves the current shape in a certain direction
function move(direction) 
{
    currentRow += direction.y;
    currentCol += direction.x;
}

// checks if the current shape can move by checking if it hits the border or another shape
function canMove(currentShape, direction) 
{
    return currentShape.pos.every(function (p) 
    {
        var newCol = currentCol + direction.x + p[0];
        var newRow = currentRow + direction.y + p[1];
        return grid[newRow][newCol] === -1;
    });
}

// sets the shape in place when it reaches bottom, ends the turn
function lockShape() 
{
    // adds shape to the grid
    addShape(currentShape);

    // if the shape exceeds the grid, then game is over
    if (currentRow < 2) 
    {
        board.endGame();
    } 
    else 
    {
        // adds a new line to the grid
        board.addLines(removeLines());
    }

    // decreases turn timer to next arrow key rotation
    rotationTurns--;

    // mixes up the arrow keys and resets arrow key timer
    if (rotationTurns == 0)
    {
        rotationTurns = 5;
        reassignButtons();
        setControlDisplay();
    }

    // calls next shape 
    selectShape();
}

// removes a line and increases the score
function removeLines() 
{
    var count = 0;

    for (var r = 0; r < gridRows - 1; r++) 
    {
        for (var c = 1; c < gridCols - 1; c++) 
        {
            if (grid[r][c] === -1)
            {
                break;
            }
            if (c === gridCols - 2) 
            {
                count++;
                removeLine(r);
            }
        }
    }
    return count;
}

// removes a line when it's formed
function removeLine(line) 
{
    for (var c = 0; c < gridCols; c++)
    {
        grid[line][c] = -1;
    }
    for (var c = 0; c < gridCols; c++) 
    {
        for (var r = line; r > 0; r--)
        {
            grid[r][c] = grid[r - 1][c];
        }
    }
}

function addShape(s) 
{
    s.pos.forEach(function (p) 
    {
        grid[currentRow + p[1]][currentCol + p[0]] = s.ordinal;
    });
}


function getRandomShape() 
{
    // set keys equal to the shape names
    var keys = Object.keys(Shapes);

    // returns random number to pick random shape
    var ord = Math.floor(Math.random() * keys.length);
    var shape = Shapes[keys[ord]];

    return new Shape(shape, ord);
}

// shape object
function Shape(shape, ord) 
{
    this.shape = shape;
    this.pos = setPos(shape)
    this.ordinal = ord;
}

// sets shape position in the grid
function setPos(shape)
{
    var pos = new Array(4);
    for (var i = 0; i < pos.length; i++) 
    {
        pos[i] = shape[i].slice();
    }
    return pos;
}

// this object controls the whole game
function Board() 
{
    // number of lines created
    var lines = 0;

    // player score
    var score = 0;

    // game over bool variable
    var gameOver = true;
    // var rotationTurns = 5;

    this.reset = function () 
    {
        lines = score = 0;
        gameOver = false;
        rotationTurns = 5;
    }
    this.endGame = function () 
    {
        gameOver = true;
    }
    this.isGameOver = function ()
    {
        return gameOver;
    }

    this.addScore = function (sc) 
    {
        score += sc;
    }

    this.addLines = function (line) 
    {
        switch (line) 
        {
            case 1:
                this.addScore(10);
                break;
            case 2:
                this.addScore(20);
                break;
            case 3:
                this.addScore(30);
                break;
            case 4:
                this.addScore(40);
                break;
            default:
                return;
        }
        lines += line;
    }

    this.getLines = function () 
    {
        return lines;
    }

    this.getScore = function () 
    {
        return score;
    }
}

// function to redraw canvas
function draw() 
{
    // clears the rect
    g.clearRect(0, 0, canvas.width, canvas.height);

    // redraws the board
    drawBoard();

    // draws start screen if game is over
    if (board.isGameOver()) 
    {
        drawStartScreen();
    } 

    // draws the current shape if game is not over
    else 
    {
        drawCurrentShape();
    }
}

// draws start screen to canvas
function drawStartScreen() 
{
    if (board.isGameOver())
    {
        // if game has just loaded
        if (justOpened === true)
        {
            g.font = mainFont;
            g.fillStyle = "white";
            g.fillText('Tetris', 130, 160);
            g.fillText('Hard', 130, 210);
            g.fillText('Edition', 130, 260);
            g.font = smallFont;
            justOpened = false;
        }

        // if game is over
        else
        {
            g.font = mainFont;
            g.fillStyle = "white";
            g.fillText('Game Over', 130, 160);
            g.font = smallFont;
        }
    }
    else
    {
        g.font = mainFont;
        g.fillStyle = "white";
        g.fillText('Tetris', 130, 160);
        g.font = smallFont;
    }
}

function fillRect(r, color) 
{
    g.fillStyle = color;
    g.fillRect(r.x, r.y, r.w, r.h);
}

// calls canvas to draw a rectangle based on the rect passed in and color
function drawRect(rect, color) 
{
    g.strokeStyle = color;
    g.strokeRect(rect.x, rect.y, rect.w, rect.h);
}

// draws the inidividual squares of the shape
function drawSquare(colorIndex, r, c) 
{
    var blockSize = 30;
    g.fillStyle = colors[colorIndex];
    g.fillRect(20 + c * blockSize, 50 + r * blockSize, blockSize, blockSize);
    g.lineWidth = 2;
    g.strokeStyle = "white";
    g.strokeRect(20 + c * blockSize, 50 + r * blockSize, blockSize, blockSize);
}

function drawBoard() 
{
    // background
    fillRect(gridRect, "black");

    // the blocks dropped in the grid
    for (var r = 0; r < gridRows; r++) 
    {
        for (var c = 0; c < gridCols; c++) 
        {
            var idx = grid[r][c];
            if (idx > -1)
                drawSquare(idx, r, c);
        }
    }

    // the borders of grid and preview panel
    drawRect(gridRect, "blue");
    drawRect(previewRect, "blue");
    
    // scoreboard
    g.fillStyle = "white";
    g.font = smallFont;
    g.fillText('lines               ' + board.getLines(), 400, 330);
    g.fillText('score               ' + board.getScore(), 400, 360);
    g.fillText('turns before change ' + rotationTurns, 400, 390);
    
    // draws preview square and the shape inside
    var minX = 5; 
    var minY = 5; 
    var maxX = 0; 
    var maxY = 0;

    nextShape.pos.forEach(function (p) 
    {
        minX = Math.min(minX, p[0]);
        minY = Math.min(minY, p[1]);
        maxX = Math.max(maxX, p[0]);
        maxY = Math.max(maxY, p[1]);
    });

    var cx = 467 - ((minX + maxX + 1) / 2.0 * 30);
    var cy = 97 - ((minY + maxY + 1) / 2.0 * 30);
    g.translate(cx, cy);
    nextShape.shape.forEach(function (p) 
    {
        drawSquare(nextShape.ordinal, p[1], p[0]);
    });
    g.translate(-cx, -cy);
}


function drawCurrentShape() 
{
    var index = currentShape.ordinal;

    currentShape.pos.forEach(function (p) 
    {
        drawSquare(index, currentRow + p[1], currentCol + p[0]);
    });
}

// animates the falling motion
function animate(lastFrameTime) 
{
    var request = requestAnimationFrame(function () 
    {
        animate(lastFrameTime);
    });


    var time = new Date().getTime();
    
    // controls the speed of the game, lower means faster
    var delay = 1000;

    // keeps animation going
    if (lastFrameTime + delay < time) 
    {
        if (!board.isGameOver()) 
        
        // if shape can move down, then it will move down, else it will
        // lock in place
        {
            if (canMove(currentShape, down)) 
            {
                move(down);
            } 
            else 
            {
                lockShape();
            }
            draw();
            lastFrameTime = time;
        } 

        // cancels animation if game over
        else 
        {
            cancelAnimationFrame(request);
        }
    }
}

// generates a random key combination for the arrows
function reassignButtons()
{
    keyCombo = Math.floor(Math.random() * 4) + 1;
    console.log(keyCombo);
}

// sets the display that shows the action of each arrow
function setControlDisplay()
{
    if (keyCombo === 1)
    {
        document.getElementById("upText").innerHTML = "Change Shape";
        document.getElementById("downText").innerHTML = "Drop Shape";
        document.getElementById("leftText").innerHTML = "Move Left";
        document.getElementById("rightText").innerHTML = "Move Right";
    }
    if (keyCombo === 2)
    {
        document.getElementById("upText").innerHTML = "Drop Shape";
        document.getElementById("downText").innerHTML = "Change Shape";
        document.getElementById("leftText").innerHTML = "Move Right";
        document.getElementById("rightText").innerHTML = "Move Left";
    }
    if (keyCombo === 3)
    {
        document.getElementById("upText").innerHTML = "Move Right";
        document.getElementById("downText").innerHTML = "Move Left";
        document.getElementById("leftText").innerHTML = "Change Shape";
        document.getElementById("rightText").innerHTML = "Drop Shape";
    }
    if (keyCombo === 4)
    {
        document.getElementById("upText").innerHTML = "Move Left";
        document.getElementById("downText").innerHTML = "Move Right";
        document.getElementById("leftText").innerHTML = "Drop Shape";
        document.getElementById("rightText").innerHTML = "Change Shape";
    }
}

// initiates game when window is open
init();