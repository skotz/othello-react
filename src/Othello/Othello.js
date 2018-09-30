import React, { Component } from 'react';
import './Othello.css';

export default class Othello extends Component {
        
    constructor(props) {
        super(props);
        this.state = { 
            state: 1,
            player: 1,
            depth: 8, /* We can increase the AI search depth once it doesn't bog down the UI */
            score: {
                white: 2,
                black: 2
            },
            board: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ] };
    }
    
    render() {
        var moves = this.getAvailableMoves(this.state.board, this.state.player);
        var rows = [];
        for (var y = 0; y < 8; y++) {
            var squares = [];
            for (var x = 0; x < 8; x++) {
                squares.push(new this.Square(this.state.board[x][y], x, y, this.isAvailableMove(moves, x, y), this));
            }
            rows.push(squares);
        }
        var gameState = this.state.state === 1 ? (this.state.player === 1 ? "white-turn" : "black-turn") : "game-over";
        return (
            <div className={"othello " + gameState}>
                <div>
                    <div>
                        <div className="status-bar">
                            <div className="status">
                                Black Player
                            </div>
                            <div className="scores black-score clearfix">
                                {this.state.score.black}
                            </div>
                        </div>
                        <div className="board clearfix">
                            {rows}
                            <div className="menu">
                                <span className="menu-message">Game Over</span>
                            </div>
                        </div>
                        <div className="status-bar">
                            <div className="status">
                                White Player
                            </div>
                            <div className="scores white-score clearfix">
                                {this.state.score.white}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    Square(player, x, y, isMove, _this) {
        var cssPlayer = "";
        var cssAvailable = "";
        if (player === 1) {
            cssPlayer = "white";
        }
        else if (player === 2) {
            cssPlayer = "black";
        }
        if (isMove) {
            cssAvailable = "avail";
        }
        return (
            <div className={"square " + cssPlayer + " " + cssAvailable} onClick={e => _this.squareHandler(x, y, e)} data-x={x} data-y={y} key={x + "-" + y}>
            </div>
        );
    }
    
    squareHandler(x, y) {
        if (this.isValidMove(this.state.board, this.state.player, x, y)) {
            var newState = this.state.state;
            var newBoard = this.state.board;
            this.makeMove(newBoard, this.state.player, x, y);
            var newPlayer = this.state.player === 1 ? 2 : 1;
            if (this.getAvailableMoves(newBoard, newPlayer).length === 0) {
                // Opponent has no moves
                newPlayer = this.state.player;
                if (this.getAvailableMoves(newBoard, newPlayer).length === 0) {
                    // We also have no moves, so the game is over
                    newState = 0;
                }
            }
            this.setState({
               player: newPlayer,
               board: newBoard,
               state: newState,
               score: {
                   white: this.getScore(newBoard, 1),
                   black: this.getScore(newBoard, 2)
               }
            }, () => {
                // After updating the player's move
                if (newState === 1 && newPlayer === 2) {
                    // Have the computer play
                    var bestMove = this.findMove(newBoard, newPlayer, this.state.depth);
                    this.squareHandler(bestMove.x, bestMove.y);
                    console.log("Move Score: " + bestMove.score);
                }
            });
        }
    }
    
    getScore(board, player) {
        var score = 0;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (board[x][y] === player) {
                    score ++;
                }
            }
        }    
        return score;
    }
    
    isAvailableMove(availableMoves, x, y) {
        for (var i = 0; i < availableMoves.length; i++) {
            if (availableMoves[i].x === x && availableMoves[i].y === y) {
                return true;
            }
        }
        return false;
    }
        
    getAvailableMoves(board, player) {
        var moves = [];
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (this.isValidMove(board, player, x, y)) {
                    moves.push({ x: x, y: y});
                }
            }
        }    
        return moves;
    }
    
    isValidMove(board, player, x, y) {
        if (board[x][y] !== 0) {
            return false;
        }
    
        var enemy = player === 1 ? 2 : 1;
    
        // Left Direction
        if (x > 0) {
            if (board[x - 1][y] === enemy) {
                for (let i = x - 2; i >= 0; i--) {
                    if (board[i][y] === 0) {
                        break;
                    }
                    if (board[i][y] === player) {
                        return true;
                    }
                }
            }
        }
    
        // Right Direction
        if (x < 7) {
            if (board[x + 1][y] === enemy) {
                for (let i = x + 2; i < 8; i++) {
                    if (board[i][y] === 0) {
                        break;
                    }    
                    if (board[i][y] === player) {
                        return true;
                    }
                }
            }
        }
    
        // Up Direction
        if (y > 0) {
            if (board[x][y - 1] === enemy) {
                for (let i = y - 2; i >= 0; i--) {
                    if (board[x][i] === 0) {
                        break;
                    }                        
                    if (board[x][i] === player) {
                        return true;
                    }
                }
            }
        }
    
        // Down Direction
        if (y < 7) {
            if (board[x][y + 1] === enemy) {
                for (let i = y + 2; i < 8; i++) {
                    if (board[x][i] === 0) {
                        break;
                    }    
                    if (board[x][i] === player) {
                        return true;
                    }
                }
            }
        }
    
        // Up-Left Direction
        if (x > 0 && y > 0) {
            if (board[x - 1][y - 1] === enemy) {
                for (let i = 2; i < 8; i++) {
                    if (x - i < 0 || y - i < 0) {
                        break;
                    }    
                    if (board[x - i][y - i] === 0) {
                        break;
                    }    
                    if (board[x - i][y - i] === player) {
                        return true;
                    }
                }
            }
        }
    
        // Up-Right Direction
        if (x < 7 && y > 0) {
            if (board[x + 1][y - 1] === enemy) {
                for (let i = 2; i < 8; i++) {
                    if (x + i > 7 || y - i < 0) {
                        break;
                    }
                    if (board[x + i][y - i] === 0) {
                        break;
                    }    
                    if (board[x + i][y - i] === player) {
                        return true;
                    }
                }
            }
        }
    
        // Down-Right Direction
        if (x < 7 && y < 7) {
            if (board[x + 1][y + 1] === enemy) {
                for (let i = 2; i < 8; i++) {
                    if (x + i > 7 || y + i > 7) {
                        break;
                    }    
                    if (board[x + i][y + i] === 0) {
                        break;
                    }    
                    if (board[x + i][y + i] === player) {
                        return true;
                    }
                }
            }
        }
    
        // Down-Left Direction
        if (x > 0 && y < 7) {
            if (board[x - 1][y + 1] === enemy) {
                for (let i = 2; i < 8; i++) {
                    if (x - i < 0 || y + i > 7) {
                        break;
                    }    
                    if (board[x - i][y + i] === 0) {
                        break;
                    }    
                    if (board[x - i][y + i] === player) {
                        return true;
                    }
                }
            }
        }
    
        return false;
    }
    
    makeMove(board, player, x, y) {        
        var enemy = player === 1 ? 2 : 1;
        var done = false;
    
        // Left Direction
        let left = -1;
        if (x > 0) {
            if (board[x - 1][y] === enemy) {
                for (let i = x - 2; i >= 0; i--) {
                    if (board[i][y] === 0) {
                        break;
                    }    
                    if (board[i][y] === player) {
                        board[x][y] = player;
                        done = true;
                        left = i;
                        break;
                    }
                }
                if (left !== -1) {
                    for (let i = x - 1; i > left; i--) {
                        board[i][y] = player;
                    }
                }
            }
        }
    
        // Right Direction
        let right = -1;
        if (x < 7) {
            if (board[x + 1][y] === enemy) {
                for (let i = x + 2; i < 8; i++) {
                    if (board[i][y] === 0) {
                        break;
                    }    
                    if (board[i][y] === player) {
                        board[x][y] = player;
                        done = true;
                        right = i;
                        break;
                    }
                }
                if (right !== -1) {
                    for (let i = x + 1; i < right; i++) {
                        board[i][y] = player;
                    }
                }
            }
        }
    
        // Up Direction
        let up = -1;
        if (y > 0) {
            if (board[x][y - 1] === enemy) {
                for (let i = y - 2; i >= 0; i--) {
                    if (board[x][i] === 0) {
                        break;
                    }    
                    if (board[x][i] === player) {
                        board[x][y] = player;
                        done = true;
                        up = i;
                        break;
                    }
                }
                if (up !== -1) {
                    for (let i = y - 1; i > up; i--) {
                        board[x][i] = player;
                    }
                }
            }
        }
    
        // Down Direction
        let down = -1;
        if (y < 7) {
            if (board[x][y + 1] === enemy) {
                for (let i = y + 2; i < 8; i++) {
                    if (board[x][i] === 0) {
                        break;
                    }    
                    if (board[x][i] === player) {
                        board[x][y] = player;
                        done = true;
                        down = i;
                        break;
                    }
                }
                if (down !== -1) {
                    for (let i = y + 1; i < down; i++) {
                        board[x][i] = player;
                    }
                }
            }
        }
    
        // Up-Left Direction
        let ul = -1;
        if (x > 0 && y > 0) {
            if (board[x - 1][y - 1] === enemy) {
                for (let i = 2; i < 8; i++) {
                    if (x - i < 0 || y - i < 0) {
                        break;
                    }    
                    if (board[x - i][y - i] === 0) {
                        break;
                    }    
                    if (board[x - i][y - i] === player) {
                        board[x][y] = player;
                        done = true;
                        ul = i;
                        break;
                    }
                }
                if (ul !== -1) {
                    for (let i = 1; i < ul; i++) {
                        board[x - i][y - i] = player;
                    }
                }
            }
        }
    
        // Up-Right Direction
        let ur = -1;
        if (x < 7 && y > 0) {
            if (board[x + 1][y - 1] === enemy) {
                for (let i = 2; i < 8; i++) {
                    if (x + i > 7 || y - i < 0) {
                        break;
                    }    
                    if (board[x + i][y - i] === 0) {
                        break;
                    }    
                    if (board[x + i][y - i] === player) {
                        board[x][y] = player;
                        done = true;
                        ur = i;
                        break;
                    }
                }
                if (ur !== -1) {
                    for (let i = 1; i < ur; i++) {
                        board[x + i][y - i] = player;
                    }
                }
            }
        }
    
        // Down-Right Direction
        let dr = -1;
        if (x < 7 && y < 7) {
            if (board[x + 1][y + 1] === enemy) {
                for (let i = 2; i < 8; i++) {
                    if (x + i > 7 || y + i > 7) {
                        break;
                    }    
                    if (board[x + i][y + i] === 0) {
                        break;
                    }    
                    if (board[x + i][y + i] === player) {
                        board[x][y] = player;
                        done = true;
                        dr = i;
                        break;
                    }
                }
                if (dr !== -1) {
                    for (let i = 1; i < dr; i++) {
                        board[x + i][y + i] = player;
                    }
                }
            }
        }
    
        // Down-Left Direction
        let dl = -1;
        if (x > 0 && y < 7) {
            if (board[x - 1][y + 1] === enemy) {
                for (let i = 2; i < 8; i++) {
                    if (x - i < 0 || y + i > 7) {
                        break;
                    }    
                    if (board[x - i][y + i] === 0) {
                        break;
                    }    
                    if (board[x - i][y + i] === player) {
                        board[x][y] = player;
                        done = true;
                        dl = i;
                        break;
                    }
                }
                if (dl !== -1) {
                    for (let i = 1; i < dl; i++) {
                        board[x - i][y + i] = player;
                    }
                }
            }
        }
    
        return done;
    }

    getOtherPlayer(player) {
        return player === 1 ? 2 : 1;
    }
    
    evaluate(board) {
        // Evaluation is based solely on piece count
        return this.getScore(board, 1) - this.getScore(board, 2);
    }
    
    findMove(board, player, depth) {
        var opponent = this.getOtherPlayer(player);
        if (depth <= 0) {
            // Evaluation is based solely on piece count
            return { score: this.evaluate(board) };
        }
        
        var moves = this.getAvailableMoves(board, player);
        if (moves.length === 0) {
            // Player has no valid moves
            if (this.getAvailableMoves(board, opponent).length === 0) {
                // Opponent also has no valid moves, so the game is over
                return { score: this.evaluate(board) };
            }
            
            // Find moves for the opponent instead
            return this.findMove(board, opponent, depth - 1);
        }
        
        var best = { score: player === 1 ? -100000 : 100000, x: moves[0].x, y: moves[0].y };
        for (let i = 0; i < moves.length; i++) {
            // Make the move on a copy of the board
            var copy = this.copyBoard(board);
            this.makeMove(copy, player, moves[i].x, moves[i].y);
            
            // Recursively look for a good counter move
            var counter = this.findMove(copy, opponent, depth - 1);
            if (player === 1) {
                if (counter.score > best.score) {
                    best.score = counter.score;
                    best.x = moves[i].x;
                    best.y = moves[i].y;
                }
            }
            if (player === 2) {
                if (counter.score < best.score) {
                    best.score = counter.score;
                    best.x = moves[i].x;
                    best.y = moves[i].y;
                }
            }
        }
        
        return best;
    }
    
    copyBoard(board) {
        return board.map(function(a) {
            return a.slice();
        });
    }
}