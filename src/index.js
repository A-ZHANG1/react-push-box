import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 函数组件
function Square(props) {
  return (
    <button
      className="cell"
      id={props.rowIndex*6+props.colIndex}
      rowIndex={props.rowIndex}// 需要传rowIndex, colIndex参数表示点击的不同位置
      colIndex={props.colIndex}
      onClick={props.onClick} // state改变放在父组件中
    >
      {props.value === "." ? "." : props.value} 
    </button>
  );
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      board: null,
      steps: null,
      totalMoves: null,
      gameOver: false,
      win: null,
      manPos: null,
      targetPos: null,
      boxPos: null,
    }
  }

  handleReset(){
    let eles = document.getElementsByClassName("cellPath");
    console.log(eles);
    if(eles.length===0) return;
    for(let i=eles.length-1;i>=0;i--) {
      console.log(eles[i]);
      // eles[i].setAttribute("class","cell");
      eles[i].setAttribute("class","cell");
    }
  }

  handleClick(i,j) {
    this.handleReset();
    let manPos = this.state.manPos;
    let boxPos = this.state.boxPos;
    let targetPos = this.state.targetPos;
    let board = this.state.board;

    if(this.state.board[i][j] === "#") {
      alert("invalid position"); return;
    }else if(this.state.board[i][j] === "B"){
      // 根据人的位置推箱子
      let dirs=[1,0,-1,0,1];
      let neighbor = false;
      for(let i=0;i<4;i++) {
        if(boxPos[0]+dirs[i] === manPos[0] && boxPos[1]+dirs[i+1] === manPos[1]){
          neighbor=true;
          // alert("push");
          if(manPos[0] === boxPos[0]){// same row
            if(manPos[1] === boxPos[1] + 1){ // moveLeft
              console.log("moveLeft");
              while(board[boxPos[0]][boxPos[1]-1] !== "#" && board[boxPos[0]][boxPos[1]-1] !== "T" && boxPos[1]>0){
                boxPos[1] --;
              }
              if(board[boxPos[0]][boxPos[1]-1] === "T") {
                this.setState({win: true});
                return;
              }
              break;
            }else{ // moveRight
              console.log("moveRight");
              while(board[boxPos[0]][boxPos[1]+1] !== "#" && board[boxPos[0]][boxPos[1]+1] !== "T" && boxPos[0]<board[0].length-1){
                boxPos[1] ++;
                console.log(boxPos);
              }
              if(board[boxPos[0]][boxPos[1]+1] === "T") {
                this.setState({win: true});
                return;
              }
              break;
            }
          }else{ // same col
            if(manPos[0] === boxPos[0] + 1){ // moveUp
              console.log("moveUp");
              while(board[boxPos[0]-1][boxPos[1]] !== "#" && board[boxPos[0]-1][boxPos[1]] !== "T" && boxPos[0]>0){
                boxPos[0] --;
              }
              if(board[boxPos[0]-1][boxPos[1]] === "T") {
                this.setState({win: true});
                return;
              }
              break;
            }else{ // moveDown
              console.log("moveDown");
              while(board[boxPos[0]+1][boxPos[1]] !== "#" && board[boxPos[0]+1][boxPos[1]] !== "T" && boxPos[0]<board.length-1){
                boxPos[0] ++;
              }
              if(board[boxPos[0]+1][boxPos[1]] === "T") {
                this.setState({win: true});
                return;
              }
              break;
            }
          }
        }
      }
      if(!neighbor) {
        alert("move to neighbor blocks first!");
        return;
      }
      this.setState({steps: this.state.steps+1});
      // 修改棋盘
      if(i !==boxPos[0] || j !== boxPos[1]){
        board[boxPos[0]][boxPos[1]] = "B";
        board[i][j] = ".";
      }      
      // debugger;
      this.setState({
        board: board,
        boxPos: boxPos,
      });
    }else{
      let squares2 = this.state.board;
      // 最短路径
      debugger
      let path=this.shortestPath(manPos[0],manPos[1],i,j);
      console.log(path);
      // 动效
      this.step(path);
      // 复制出一份，保持不可变性
      squares2[manPos[0]][manPos[1]] = ".";
      squares2[i][j] = "S";
      if(manPos[0] === targetPos[0] && manPos[1] === targetPos[1]) squares2[manPos[0]][manPos[1]] = "T";
      this.setState({
        board: squares2,
        manPos: [i,j],
      });
    }
    
    // console.log(this.state.board);
  }

  step(path) {
    let idx=0;
    let timer=setInterval(frame,100);
    function frame(){
      if(idx===path.length) {
        clearInterval(timer);
      }else{
        let ele = document.getElementById(path[idx]);
        idx++;
        // debugger
        ele.className = "cellPath";
      }
    }
  }

  renderSquare(cell,i,j) {
    return (
      <Square
        value={cell}
        rowIndex={i}
        colIndex={j}
        onClick={() => this.handleClick(i,j)}
      />
    );
  }

  isReachable = (grid, target, box, start) => {
    const rows = grid.length;
    const dirs = [0, 1, 0, -1, 0];
    const t = grid[box[0]][box[1]];
    grid[box[0]][box[1]] = '#';
    const queue = [start];
    const visited = new Set();
    visited.add(`${start[0]}#${start[1]}`);

    let i = 0;
    while (i < queue.length) {
      const [curX, curY] = queue[i++];
      if (curX === target[0] && curY === target[1]) {
        grid[box[0]][box[1]] = t;
        return true;
      }

      for (let j = 0; j < 4; j++) {
        const newX = curX + dirs[j];
        const newY = curY + dirs[j + 1];
        const pointStr = `${newX}#${newY}`;
        if (newX >= 0 && newX < rows && newY >= 0 && newY < rows && grid[newX][newY] !== '#' && !visited.has(pointStr)) {
          queue.push([newX, newY]);
          visited.add(pointStr);
        }
      }
    }

    grid[box[0]][box[1]] = t;
    return false;
  };

  minPushBox(grid) {
    let man;
    let box;
    let target;
    let totalMoves = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === 'S') {
          man = [i, j];
        } else if (grid[i][j] === 'B') {
          box = [i, j];
        } else if (grid[i][j] === 'T') {
          target = [i, j];
        }
      }
    }

    const visited = new Set();
    const queue = [[man[0], man[1], box[0], box[1]]];
    let queueIndex = 0;
    const dirs = [0, 1, 0, -1, 0];
    while (queueIndex < queue.length) {
      const curQueueLen = queue.length;
      let reached = false;
      while (queueIndex < curQueueLen) {
        const [pX, pY, bX, bY] = queue[queueIndex++];
        if (bX === target[0] && bY === target[1]) {
          reached = true;
          break;
        }

        const curKey = `${pX}#${pY}#${bX}#${bY}`;
        if (visited.has(curKey)) continue;
        visited.add(curKey);

        for (let i = 0; i < 4; i++) {
          const pX1 = bX + dirs[i];
          const pY1 = bY + dirs[i + 1];
          if (pX1 < 0 || pX1 >= rows || pY1 < 0 || pY1 >= cols || grid[pX1][pY1] === '#') {
            continue;
          }

          const bX1 = bX - dirs[i];
          const bY1 = bY - dirs[i + 1];
          if (bX1 < 0 || bX1 >= rows || bY1 < 0 || bY1 >= cols || grid[bX1][bY1] === '#') {
            continue;
          }

          if (this.isReachable(grid, [pX1, pY1], [bX, bY], [pX, pY])) {
            queue.push([bX, bY, bX1, bY1]);
          }
        }
      }

      if (reached) return new Array(totalMoves, box[0], box[1], target[0], target[1], man[0], man[1]); // steps, targetX, targetY

      totalMoves ++;
      // debugger;
    }
    return -1;
  };

  shortestPath(manX, manY, targetX, targetY){
    let board = this.state.board, length = board.length;
    let stack = [[manX,manY]], ans = [], minStep=0,queue=[[manX,manY]];
    const dirs=[1,0,-1,0,1];

    const bfs=()=>{
      let board0=[];
      for(let i=0;i<board.length;i++){
        let[...arr1]=board[i];
        board0.push(arr1);
      }
      let minStep = 0;
      while (queue.length) {
        let size = queue.length;
        minStep++;
        while (size--) {
          const [i, j] = queue.shift();
          // 出队列向四周扩散
          for (let k =0;k<4;k++) {
            const newI = i + dirs[k];
            const newJ = j + dirs[k+1];
            if (newI >= 0 && newI < board.length && newJ >= 0 && newJ < board[0].length) {
              // 找到单击的目标[targetX，targetY]直接返回
              if (newI===targetX && newJ === targetY){
                return minStep;
              } else if (board0[newI][newJ] === ".") {
                // 先把它融入#避免重复访问到
                board0[newI][newJ] = "2";
                queue.push([newI, newJ]);
              }
            }
          }
        }
      }
      return -1;
    }
    const dfs=(manX, manY)=>{
      if(stack.length > minStep+1) return;//初始[[]]
      if (manX === targetX && manY===targetY) {
        for(let pos of stack) {
          if(pos.length>0) ans.push(pos[0]*length+pos[1]);
        }
        return;
      }
      
      for (let i =0;i<4;i++) {
        let dx=manX+dirs[i];
        let dy=manY+dirs[i+1];
        if(dx<0||dx>=length||dy<0||dy>=length||board[dx][dy]!==".") continue;
        stack.push([dx,dy]);
        dfs(dx, dy);
        stack.pop();
      }
      debugger
    }
    minStep=bfs();
    // console.log(minStep);
    dfs(manX, manY);
    return ans;
  };

  initBoard(){
    let board = [["#", "#", "#", "#", "#", "#"],
    ["#", "T", "#", "#", "#", "#"],
    ["#", ".", ".", "B", ".", "#"],
    ["#", ".", "#", "#", ".", "#"],
    ["#", ".", ".", ".", "S", "#"],
    ["#", "#", "#", "#", "#", "#"]];
    let [totalMoves, boxX, boxY, targetX, targetY, manX, manY] = this.minPushBox(board);
    let boxPos = [boxX, boxY], 
    targetPos = [targetX, targetY],
    manPos = [manX, manY];
    this.setState({board:board, totalMoves:totalMoves, boxPos:boxPos, targetPos:targetPos, manPos:manPos, steps: 0, win:false})
  }
  componentWillMount(){
    this.initBoard();
    // const body = document.querySelector('root');
    // body.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  render() {
    // debugger;
    let status;
    
    if (this.state.steps === this.state.totalMoves) {
      if (this.state.boxPos[0] === this.state.targetPos[0] && this.state.boxPos[1] === this.state.targetPos[1]) {
        status = "You Win."
      } else {
        status = "End Game."
      }
    } else {
      status = 'Moves Left: ' + (this.state.totalMoves - this.state.steps);
    }
    return (
      <div className="game">
        <div className="game-board">
          {/* <Board squares={this.state.board} onClick={()=>this.handleClick(i,j)}/> */}
          <table>
            {
              this.state.board.map((row, i) => {
              return (
                <tr>
                  {
                    row.map((cell, j) => this.renderSquare(cell,i,j))
                  }
                </tr>
              );
              })
            }
          </table>
        </div>
        <div className="game-info">
          <ol>{status}</ol>
          <ol>Num Pushes:{this.state.steps}</ol>
          <ol>Win: {this.state.win ? "True": "False"}</ol>
          <ol><div className="button" onClick={() => {this.initBoard()}}>New Game</div></ol>
        </div>
      </div>
    );
  }
}

// ========================================
// const container = document.getElementById('app');
// const root = ReactDOM.createRoot(container);
ReactDOM
  .createRoot(document.getElementById('root'))
  .render(<Game />,
    document.getElementById('root')
  );


