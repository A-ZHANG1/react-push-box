# 推箱子
现在你将作为玩家参与游戏，按规则将箱子 'B' 移动到目标位置 'T' ：

玩家用字符 'S' 表示，只要他在地板上，就可以在网格中向上、下、左、右四个方向移动。
地板用字符 '.' 表示，意味着可以自由行走。
墙用字符 '#' 表示，意味着障碍物，不能通行。 
箱子仅有一个，用字符 'B' 表示。相应地，网格上有一个目标位置 'T'。
玩家需要站在箱子旁边，然后沿着箱子的方向进行移动，此时箱子会被移动到相邻的地板单元格。记作一次「推动」。
玩家无法越过箱子。

<img width="783" alt="image" src="https://user-images.githubusercontent.com/21293571/165422974-bd4c90c4-1470-4e19-bf10-32191e1eba69.png">

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 代码段
```javascript
1. 工程初始化
	npx create-react-app my-app
	cd src
	# 如果你使用 Mac 或 Linux:
	rm -f  *
	# 创建组件:
	rcc
	# 挂载:
	ReactDOM
	  .createRoot(document.getElementById('root'))
	  .render(<Game />,
	    document.getElementById('root')
	  );

2. 一维数组转二维数组
	let board = this.state.squares.reduce((rows, key, index) => (index % 6 == 0 ? rows.push([key]) 
	     : rows[rows.length-1].push(key)) && rows, []);
	
3. 渲染二维数组
	render() {
	    return (
	      <div>
	        <table>
	          {
	            this.state.squares.map((row, i) => {
	            return (
	              <tr>
	                {
	                  row.map((cell, j) => this.renderSquare(cell,i,j))}
	              </tr>
	                  );
	            }
	            )
	          }
	        </table>
	      </div>
	    );
	  }
	
4. 深拷贝 二维数组 
    let re=[];
    for(let i=0;i<arr.length;i++){
      let[...arr1]=arr;
      re.push(arr1);
    }

5. 函数组件
	function Square(props) {
	  return (
	    <button
	      className="square"
	      rowIndex={props.rowIndex}// 需要传rowIndex, colIndex参数表示点击的不同位置
	      colIndex={props.colIndex}
	      onClick={props.onClick} // state改变放在父组件中
	    >
	      {props.value}
	    </button>
	  );
	}
6. 函数组件中的state
	const [count, setCount] = useState([0,0]);
  
7. onClick函数中this作用域问题：箭头函数解决
	const Row = ({ row, onClick }) => {
	  return (
	    <tr>
	      {
	        row.map((cell, i) => (
	          <Square
	            key={i}
	            value={cell}
	            onClick={onClick}
	          />))
	      }
	    </tr>
	  );
	};
	
8. 父组件中全局变量初始挂载
	componentWillMount(){
	    this.initBoard();
	    // const body = document.querySelector('root');
	    // body.addEventListener('keydown', this.handleKeyDown.bind(this));
	  }
    
	向子组件传参
	renderSquare(cell,i,j) {
	    return (
	      <Square
	        value={cell}
	        onClick={() => this.handleClick(i,j)}
	      />
	    );
	  }
  
 9. 动画
	https://www.runoob.com/jsref/met-win-setinterval.html
```

### 参考
```
1. 2048 https://codepen.io/jeffleu/pen/JRzyPe?editors=0010
2. tic-tac-toe https://zh-hans.reactjs.org/tutorial/tutorial.html#lifting-state-up-again
3. leetcode 1263, 797
```

### `npm start`
