import React, { Component } from 'react';
import './Othello.css';

export default class Othello extends Component {
        
    constructor(props) {
        super(props);
        this.state = { 
            state: 1,
            player: 1,
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
        var gameState = this.state.state == 1 ? (this.state.player === 1 ? "white-turn" : "black-turn") : "game-over";
        return (
            <div className={"othello " + gameState}>
                <div className="top-bar">
                    <div className="status">
                        {this.state.state == 1 ? (this.state.player == 1 ? "White to Move" : "Black to Move") : "Game Over"}
                    </div>
                    <div className="scores clearfix">
                        <div className="black-score">
                            {this.state.score.black}
                        </div>
                        <div className="white-score">
                            {this.state.score.white}
                        </div>
                    </div>
                </div>
                <div className="board clearfix">
                    {rows}
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
            <div className={"square " + cssPlayer + " " + cssAvailable} onClick={e => _this.squareHandler(x, y, e)} data-x={x} data-y={y}>
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
}