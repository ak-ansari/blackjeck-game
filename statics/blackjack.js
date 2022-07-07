// object :-
let bjgame = {
  you: { scorespan: "#your-bj-result", div: "#your-box", score: 0 },
  dealer: { scorespan: "#dealer-bj-result", div: "#dealer-box", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  cardsmap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isstand: false,
  turnsover: false,
  gameover: false,
};

//  variables decleration
const YOU = bjgame["you"];
const DEALER = bjgame["dealer"];
const hitsound = new Audio("/assets/sounds/swish.m4a");
const winnsound = new Audio("/assets/sounds/cash.mp3");
const lostsound = new Audio("/assets/sounds/aww.mp3");
let winner;

// applying functions on buttons

document.querySelector("#bj-hit-btn").addEventListener("click", bjhit);
document.querySelector("#bj-stand-btn").addEventListener("click", dealerlogic);
document.querySelector("#bj-deal-btn").addEventListener("click", bjdeal);

// hit button function definition

function bjhit() {
  if (bjgame["isstand"] === false && bjgame["turnsover"] === false) {
    bjgame["gameover"] = true;
    let card = randomcard();
    showcard(card, YOU);
    updatescore(card, YOU);
    showscore(YOU);
    
  }
}

// random card function

function randomcard() {
  let num = Math.floor(Math.random() * 13);
  return bjgame["cards"][num];
}

// showcard function

function showcard(x, activeplayer) {
  if (activeplayer["score"] <= 21) {
    let cardimage = document.createElement("img");
    cardimage.src = `/assets/images/${x}.png`;
    cardimage.style = "width:110px;height:154px; margin:.5rem ";
    document.querySelector(activeplayer["div"]).appendChild(cardimage);
    hitsound.play();
  }
}

// deal button function

function bjdeal() {
  if (bjgame["turnsover"] === true) {
    let yourimages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    for (let i = 0; i < yourimages.length; i++) {
      yourimages[i].remove();
    }
    let dealerimages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");
    for (let i = 0; i < dealerimages.length; i++) {
      dealerimages[i].remove();
    }
    YOU["score"] = 0;
    DEALER["score"] = 0;
    document.querySelector("#your-bj-result").textContent = "0";
    document.querySelector("#dealer-bj-result").textContent = "0";
    document.querySelector("#your-bj-result").style.color = "white";
    document.querySelector("#dealer-bj-result").style.color = "white";
    document.querySelector("#bj-results").textContent = "Let's play";
    document.querySelector("#bj-results").style.color = "black";
    bjgame["isstand"] = false;
    bjgame["turnsover"] = false;
  }
}

// update score function

function updatescore(card, activeplayer) {
  if (card === "A") {
    if (activeplayer["score"] + bjgame["cardsmap"][card][1] <= 21) {
      activeplayer["score"] += bjgame["cardsmap"][card][1];
    } else {
      activeplayer["score"] += bjgame["cardsmap"][card][0];
    }
  } else {
    activeplayer["score"] += bjgame["cardsmap"][card];
  }
}

// show score function

function showscore(activeplayer) {
  if (activeplayer["score"] > 21) {
    document.querySelector(activeplayer["scorespan"]).textContent = "BUST!";
    document.querySelector(activeplayer["scorespan"]).style.color = "red";
  } else {
    document.querySelector(activeplayer["scorespan"]).textContent =
      activeplayer["score"];
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// stand button function (dealer logic)

async function dealerlogic() {
  if (bjgame["gameover"] === true) {
    bjgame["isstand"] = true;
    bjgame["gameover"] =false;
    while (DEALER["score"] < 16) {
      let card = randomcard();
      showcard(card, DEALER);
      updatescore(card, DEALER);
      showscore(DEALER);
      await sleep(1000);
    }
    let winner = computewinner();
    showresult(winner);
    bjgame["turnsover"] = true;
    bjgame["isstand"] = false;
  }
}

// compute winner function

function computewinner() {
  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      bjgame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      bjgame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      bjgame["draws"]++;
      winner = 0;
    }
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    bjgame["losses"]++;
    winner = DEALER;
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    bjgame["draws"]++;
    winner = 0;
  }
  return winner;
}

// show results functoin

function showresult() {
  let message, messagecolor;
  if (winner === YOU) {
    document.querySelector("#wins").textContent = bjgame["wins"];

    message = "You won!";
    messagecolor = "green";
    winnsound.play();
  } else if (winner === DEALER) {
    document.querySelector("#Losses").textContent = bjgame["losses"];
    message = "You lost!";
    messagecolor = "red";
    lostsound.play();
  } else {
    document.querySelector("#Draws").textContent = bjgame["draws"];
    message = "draw";
    messagecolor = "black";
  }
  document.querySelector("#bj-results").textContent = message;
  document.querySelector("#bj-results").style.color = messagecolor;
}
