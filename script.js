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

function dragstart_handler(ev) {
  ev.originalEvent.target.setAttribute("id", "beingdragged");
  ev.originalEvent.dataTransfer.dropEffect = "move";
}

const createCard = (text, shown) =>
  $("<div>")
    .addClass("card")
    .addClass(shown ? "face-up" : "face-down")
    .addClass(text.slice(-1)) // extract family
    .attr("draggable", true)
    .on("dragstart", dragstart_handler)
    .css({
      position: "absolute",
      textAlign: "right",
    })
    .text(text);

const addToPile = (pile, cardText, shown) => {
  pile.append(createCard(cardText, shown).css({ marginTop: 20 * pile.find(".card").length }));
};

const moveBetweenPiles = (pileTo, card) => {
  const pile = $(pileTo);
  pile.append(card.css({ marginTop: 20 * pile.find(".card").length }));
};

const piles = [];

for (let i = 0; i <= 6; i++) {
  piles[i] = $(`.tableau > .pile[index=${i}]`)
    .attr("ondrop", "drop_handler(event)")
    .attr("ondragover", "dragover_handler(event)");
}

for (let line = 0; line <= 6; line++) {
  for (let column = line; column <= 6; column++) {
    const card = stock.pop();
    const shown = line == column;
    addToPile(piles[column], card, shown);
  }
}

console.log(stock);

function dragover_handler(ev) {
  ev.preventDefault();
}

function drop_handler(ev) {
  ev.preventDefault();
  const card = $("#beingdragged").removeAttr("id");
  moveBetweenPiles(ev.target.parentNode, card);
}

const talon = [];
