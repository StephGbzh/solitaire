const family = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "V", "D", "R"];
const stock = [];

["♥", "♦", "♣", "♠"].forEach((color) => {
  family.forEach((rank) => {
    stock.push(`${rank} ${color}`);
  });
});

// https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5);
}

shuffleArray(stock);
shuffleArray(stock);
shuffleArray(stock);

const tableau = [[], [], [], [], [], [], []];

const createCard = (text, shown) =>
  $("<div>")
    .addClass("card")
    .addClass(shown ? "face-up" : "face-down")
    .addClass(text.slice(-1)) // extract family
    .attr("draggable", true)
    .css({
      position: "absolute",
      textAlign: "right",
    })
    .text(text);

const addToPile = (pile, cardText, shown) => {
  tableau[pile].push([cardText, shown]);
  const card = createCard(cardText, shown)
  card.css({marginTop: 20 * tableau[pile].length})
  $($(`div.tableau > div.pile[index=${pile}]`)).append(card)
};

const moveBetweenPiles = (pileFrom, pileTo, cardText) => {
  tableau[pileFrom].pop(); // TODO assuming the last element for now
  tableau[pileTo].push([cardText, true]);
  const card = createCard(cardText, true)
  card.css({marginTop: 20 * tableau[pileTo].length})
  $($(`div.tableau > div.pile[index=${pileTo}]`)).append(card)
};

for (let startingColumn = 0; startingColumn <= 6; startingColumn++) {
  for (let column = startingColumn; column <= 6; column++) {
    const card = stock.pop();
    const shown = startingColumn == column;
    addToPile(column, card, shown);
  }
}

console.log(stock);
console.log(tableau);

function dragstart_handler(ev) {
  console.log("dragstart_handler", ev);
  // console.log("typeof ev.target", typeof ev.target)
  ev.target.setAttribute("id", "beingdragged");
  // ev.dataTransfer.setData("application/x-moz-node", ev.target)
  // ev.dataTransfer.setData("text/plain", "coucou")
  ev.dataTransfer.dropEffect = "move";
}

document.querySelectorAll(".tableau .card, .talon").forEach((card) => {
  card.addEventListener("dragstart", dragstart_handler);
});

function dragover_handler(ev) {
  ev.preventDefault();
  // ev.dataTransfer.setData("text/plain", "coucou")
  // console.log("dragover_handler", ev)
  // console.log("dragover");
  // ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
  ev.preventDefault();
  // const data = ev.dataTransfer.getData("application/x-moz-node");
  console.log(ev.target);

  // ev.target.parentNode.appendChild(document.querySelector("#beingdragged"));
  const pileFrom = document.querySelector("#beingdragged").parentNode.getAttribute("index");
  const pileTo = ev.target.parentNode.getAttribute("index");
  moveBetweenPiles(pileFrom, pileTo, document.querySelector("#beingdragged").textContent);
  document.querySelector("#beingdragged").remove();

  // Get the id of the target and add the moved element to the target's DOM
  // const data = ev.dataTransfer.getData("text/plain");
  // ev.target.appendChild(document.getElementById(data));
  console.log("drop_handler", ev);
}

document.querySelectorAll(".pile").forEach((pile) => {
  $(pile).attr("ondrop", "drop_handler(event)").attr("ondragover", "dragover_handler(event)");
});

const talon = [];
