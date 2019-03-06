import React, { Component } from "react";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
        {
          name: "Winnie",
          cards: ["one", "two"],
          className: "header-purple"
        },
        {
          name: "Bob",
          cards: ["three", "four"],
          className: "header-teal"
        },
        {
          name: "Thomas",
          cards: ["five", "six"],
          className: "header-navy"
        },
        {
          name: "George",
          cards: ["seven", "eight"],
          className: "header-orange"
        }
      ]
    };
  }

  componentDidMount() {
    let boardDataFromStorage = localStorage.getItem("board");
    if (boardDataFromStorage) {
      let parsed = JSON.parse(boardDataFromStorage);
      this.setState({ board: parsed });
    }
  }

  updateLocalStorage = () => {
    let { board } = this.state;
    localStorage.setItem("board", JSON.stringify(board));
  };

  handleInput = columnIdx => {
    let value = prompt("Add a card");
    let { board } = this.state;
    if (!value) {
      return;
    }
    board[columnIdx].cards.push(value);
    this.setState({ board }, () => {
      this.updateLocalStorage();
    });
  };

  moveItemTo = (e, columnIdx, cardIdx, direction) => {
    let { value } = e.currentTarget;
    let { board } = this.state;
    let idxDirection = direction === "left" ? columnIdx - 1 : columnIdx + 1;
    // removes item from original column
    board[columnIdx].cards.splice(cardIdx, 1);
    // adds item to the right of original column
    board[idxDirection].cards.push(value);
    this.setState({ board }, () => {
      this.updateLocalStorage();
    });
  };

  renderItems = (data, idx) => {
    return data.map((item, cardIdx) => {
      return (
        <CardItems
          item={item}
          cardIdx={cardIdx}
          idx={idx}
          moveItemTo={this.moveItemTo}
        />
      );
    });
  };

  render() {
    let { board } = this.state;
    return (
      <div className="App">
        {board.map((data, idx) => {
          return (
            <section key={idx} className="column-container">
              <div className={`column-header ${data.className}`}>
                {data.name}
              </div>
              <Items data={data.cards} idx={idx} moveItemTo={this.moveItemTo} />
              <AddACard handleInput={this.handleInput} columnIdx={idx} />
            </section>
          );
        })}
      </div>
    );
  }
}

const AddACard = ({ handleInput, columnIdx }) => {
  return <button onClick={() => handleInput(columnIdx)}>+ Add a Card</button>;
};

const Items = ({ data, idx, moveItemTo }) => {
  return data.map((item, cardIdx) => {
    return (
      <CardItems
        item={item}
        cardIdx={cardIdx}
        idx={idx}
        moveItemTo={moveItemTo}
      />
    );
  });
};

const MoveButton = ({ value, onClick, idx, cardIdx, symbol, direction }) => {
  return (
    <button
      className="move-btn"
      value={value}
      onClick={e => {
        onClick(e, idx, cardIdx, direction);
      }}
    >
      {symbol}
    </button>
  );
};

const CardItems = ({ item, idx, cardIdx, moveItemTo }) => {
  return (
    <div key={cardIdx} className="column-item">
      {!(idx === 0) && (
        <MoveButton
          value={item}
          onClick={moveItemTo}
          idx={idx}
          cardIdx={cardIdx}
          symbol={"<"}
          direction={"left"}
        />
      )}
      {item}
      {!(idx === 3) && (
        <MoveButton
          value={item}
          onClick={moveItemTo}
          idx={idx}
          cardIdx={cardIdx}
          symbol={">"}
          direction={"right"}
        />
      )}
    </div>
  );
};

export default App;
