"use client"
// import React from 'react';
import './board.css';

const generateZigzag = (size: number): number[] => {
    let total = size * size;
    let matrix: number[] = [];
    let leftToRight = true;

    for (let row = 0; row < size; row++) {
        let currentRow: number[] = new Array(size);
        for (let col = 0; col < size; col++) {
            let index = leftToRight ? col : (size - 1 - col);
            currentRow[index] = total--;
        }
        matrix.push(...currentRow);
        leftToRight = !leftToRight; // Toggle direction
    }

    return matrix;
};


const Board = () => {
    const size = 10;
    const zigzagNumbers = generateZigzag(size);
    let board = [];

    // Create board squares
    for (let i = 0; i < zigzagNumbers.length; i++) {
        const number = zigzagNumbers[i];
        board.push(
            <div className={`square`} key={i}>
                {number}
                
            </div>
        );
    }

    return (
        <div className="board bg-black" style={{ gridTemplateColumns: `repeat(${size}, 40px)`, gridTemplateRows: `repeat(${size}, 40px)` }}>
            {board}
        </div>
    );
};

export default Board;
