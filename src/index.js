import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={ this.props.squares[i] }
                onClick={ () => this.props.onClick(i) }
            />
        );
    }
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordinates: Array(9).fill(null),
            }],
            stepNumber: 0,
            dollarIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        const coordinates = calculateCoordinates(i);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.dollarIsNext ? '$' : '€';
        this.setState({
            history: history.concat([{
                squares: squares,
                coordinates: coordinates
            }]),
            stepNumber: history.length,
            dollarIsNext: !this.state.dollarIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            dollarIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move}| [${step.coordinates}]` :
                'Go to start of game';
            return (
                <li key={ move }>
                    <button onClick={ () => this.jumpTo(move) } > {desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `${winner} won!`;
        }
        else {
            status = `Waiting fo the ${this.state.dollarIsNext ? '$' : '€'} to move`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={ current.squares }
                        coordinates = { current.coordinates }
                        onClick={ (i) => this.handleClick(i) }
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calculateCoordinates(value) {
    if (value === 0) { return [1,1] }
    else if (value === 1) { return [1,2] }
    else if (value === 2) { return [1,3] }
    else if (value === 3) { return [2,1] }
    else if (value === 4) { return [2,2] }
    else if (value === 5) { return [2,3] }
    else if (value === 6) { return [3,1] }
    else if (value === 7) { return [3,2] }
    else { return [3,3] }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
