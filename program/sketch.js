var cols, rows;
var w = 10;
var grid = [];
var current;
var stack = [];
var canvas;

function setup() {
    canvas = createCanvas(400,400);
    canvas.mousePressed(finishAlg);
    cols = floor(width / w);
    rows = floor(height/w);

    for (var j = 0; j < rows ; j++) {
       for (var i = 0;i<cols;i++) {
           var cell = new Cell(i,j);
           grid.push(cell);
       }
    }

    current = grid[0];
}

function finishAlg() {
    while (stack.length > 0) {
        doAlg();
    }
}

function draw() {
    background(51);
    for (var i = 0; i < grid.length;i++) {
        grid[i].show();
    }

    doAlg();
}

function doAlg() {
    current.visited = true;
    current.highlight();
    current.checkNeighbors();
    var next = current.checkNeighbors();
    if (next) {
        nextvisited = true;
        stack.push(current);
        removeWalls(current,next);

        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }
}



function removeWalls(a,b) {
    var x = a.i - b.i;
    var y = a.j - b.j;
    if (x == 1) {
        a.setWall('left', false);
        b.setWall('right', false);
    } else if (x == -1) {
        a.setWall('right', false);
        b.setWall('left', false);
    }
    if (y == 1) {
        a.setWall('top' ,false);
        b.setWall('bottom' ,false);
    } else if (y == -1) {
        a.setWall('bottom', false);
        b.setWall('top', false);
    }
}

function Cell(i,j) {
    this.i = i;
    this.j = j;
    this.walls = [true,true,true,true];
    this.visited = false;

    this.highlight = function() {
        var x = this.i * w;
        var y = this.j * w;
        noStroke();
        fill(0,0,255,100);
        rect(x,y,w,w);
    }

    this.getWall = function(x) {
        if (x == 'top') return this.walls[0];
        if (x == 'right') return this.walls[1];
        if (x == 'bottom') return this.walls[2];
        if (x == 'left') return this.walls[3];
    };

    this.setWall = function(x,val) {
        if (x == 'top')  this.walls[0] = val;
        if (x == 'right')  this.walls[1] = val;
        if (x == 'bottom')  this.walls[2] = val;
        if (x == 'left')  this.walls[3] = val;
    };

    this.index = function(i,j) {
        if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
            return -1;
        }

        return i + j * cols;
    };

    this.show = function() {
        var x = this.i * w;
        var y = this.j * w;
        
        noStroke();
        if (this.visited) {
            fill(255,0,255,100);
        } else {
            noFill();
        }

        rect(x,y,w,w);

        stroke(255);
        if (this.getWall('top'))
            line(x  ,y  ,   x+w,    y);
        if (this.getWall('right'))
            line(x+w    ,y  ,x+w    ,y+w);
        if (this.getWall('bottom'))
            line(x+w    ,y+w    ,x  ,y+w);
        if (this.getWall('left'))
            line(x  ,y+w    ,x  ,y);
    };

    this.checkNeighbors = function() {
        var neighbors = [];

        var right = grid[this.index(i + 1, j)];
        var top = grid[this.index(i, j - 1)];
        var bottom = grid[this.index(i, j + 1)];
        var left = grid[this.index(i - 1, j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }
        if (neighbors.length > 0) {
            var r = floor(random(0,neighbors.length));
            return neighbors[r];
        } else {
            return undefined;
        }
    };
}

