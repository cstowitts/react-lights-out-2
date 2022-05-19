import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = .25 }) { 
  //don't forget to add default values for everything!
  const [board, setBoard] = useState(createBoard());
  

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    // TODO: create array-of-arrays of true/false values
    //need to make nrows number of subarrays containing ncol number of trues
      //loop i <= nrows (for number of subarrays)
      //create an array of nrow # elements, .fill(true) to populate 
    //push to initialBoard
    let initialBoard = [];
    for(let i = 0; i < nrows; i++){
      const row = Array(ncols);
      row.fill(true);   
      initialBoard.push(row); 
      console.log("line 46 initialBoard: ", initialBoard);
    }
    return initialBoard;
  } 

    // TODO: randomly flip cells to finish initial board
    //iterate over initialBoard
    //tap into each element of a subarray
    //if math.random is > chanceLightStartsOn, flip and pass coord into flipCellsAround()
    useEffect(function flipRandomCellsOnRender(){
      for(let row = 0; row < nrows; row++){
        for(let col = 0; col < ncols; col++){
          if(Math.random() > chanceLightStartsOn){
            flipCellsAround(`${row}-${col}`);
          }
        }
      } 
      // console.log("line 64 inside useEffect, board: ", board);
    }, [])

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    for(let row of board){
      if(row.includes(false)){
        return false;
      }
    }
    return true;
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number); //coord like y-x

      const flipCell = (y, x, boardCopy) => {
        //this is just a function expression; an anon arrow fn saved to a variable
        //can be called like: flipCell(y, x, boardCopy)
        //if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x]; //evaluates to a boolean, reverses w/e it is
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
      //deep copy: new identity 
        //in React you need to create a new identity to update state with
        //this is why we use spread 
      //shallow copy: a reference 
        //(ex: if oldBoard exists, assigning a new variable to oldBoard will only
        //make that new variable refer to the oldBoard, won't update bc identity is the same)

      // const newBoard = [...oldBoard];  
      //this wouldn't work alone bc you'd have a new arr 
      //of references to the old subarrs

      const newBoard = oldBoard.map(row => [...row]);

      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, newBoard);
      flipCell(y, (x + 1), newBoard);
      flipCell(y, (x - 1), newBoard);
      flipCell((y + 1), x, newBoard);
      flipCell((y - 1), x, newBoard);

      // TODO: return the copy
      return newBoard;
    });
  }

  // TODO: if the game is won, just show a winning msg & render nothing else


  // TODO:  make table board
  //can't do a nested map bc you need to loop for unique keys 
  //(the coords for each cell, that's where the coord arg comes from)

  /** Rithm Solution
  const tableBoard = [];

  for(let row = 0; row < nrows; row++){
    //don't forget you need 
    let tableRow = [];

    for(let col = 0; col < ncols; col++){
      let coord = `${row}-${col}`;
      tableRow.push(
        <Cell 
          key={coord}
          classname="Cell" 
          flipCellsAroundMe={evt => flipCellsAround(coord)}
          isLit={board[row][col]}
        />
        //we don't actually do anything with the evt arg (which is being passed into the => fn)
        //this seems more semantic, to indicate that the Cell component
        //is going to listen for an event and the result of it
        //will be a call to the flipCellsAround with coord as the arg 
      )
    }
    tableBoard.push(<tr key={row}>{tableRow}</tr>);
    //very important to include a key, each row will have its own unique row #
  } 
  */

  /**
   * remember, map is for arrays!
   * the arrays we have are:
   *  -the board (an arr of subarrs)
   *  -and each row (subarr of bools)
   * 
   * the plan for the return:
   * if hasWon is false
   * we will create the table board to render
   * 
   * need to map over each subarr(row) in board to make each row
   * and within each tablerow element
   * we'll need to map again over the specific subarr(row)
   * to populate each tablerow with Cell components
   */
  return (
    <div className="Board">
      { hasWon() === false &&
      <table className="Board board-table">
        <tbody>
          {board.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {
                row.map((col, colIdx) => (
                  <Cell 
                    key={`${rowIdx}-${colIdx}`}
                    flipCellsAroundMe={evt => flipCellsAround(`${rowIdx}-${colIdx}`)}
                    isLit={board[rowIdx][colIdx]}
                  />
                ))
              }
            </tr>
          ))
          } 
        </tbody>
      
      </table>
      }
      { hasWon() === true &&
        <div className="Board win-msg container">
          <span className="Board win-msg">
            "you win, you champion!!! you turn them lights on!!"
          </span>
        </div>
        
      }
    </div>
   
  )
}

export default Board;
