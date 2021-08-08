const family = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "V", "D", "R"];
let stock = [];

["♥", "♦", "♣", "♠"].forEach((color) => {
  family.forEach((rank) => {
    stock.push(`${rank} ${color}`);
  });
});

// https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

shuffleArray(stock);
shuffleArray(stock);
shuffleArray(stock);

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
const dragstart_handler = (ev) => {
  ev.originalEvent.target.setAttribute("id", "beingdragged");
  ev.originalEvent.dataTransfer.dropEffect = "move";
};

const createCard = (text, shown) => {
  const card = $("<div>")
    .addClass("card")
    .addClass(text.slice(-1)) // extract family
    .append($("<div>").addClass("t").text(text));

  if (shown) {
    card.addClass("face-up").attr("draggable", true).on("dragstart", dragstart_handler);
  } else {
    card.addClass("face-down");
  }

  return card;
};

let talon = [];

$(".stock").click((ev) => {
  if (stock.length == 0) {
    stock = talon.reverse();
    talon = [];
    $(".talon > .card").remove()
    $(".stock").removeClass("empty")
    return
  }
  if (stock.length == 1) {
    $(".stock").addClass("empty")
  } else {
    $(".stock").removeClass("empty")
  }
  
  const cardText = stock.pop();
  talon.push(cardText);
  const card = createCard(cardText, true);
  $(".talon").append(card);
});

// in fact, we store here only the last card on each pile
const piles = [];

for (let i = 0; i <= 6; i++) {
  piles[i] = $(`.tableau > .pile[index=${i}]`)
    .attr("ondrop", "drop_handler(event)")
    .attr("ondragover", "dragover_handler(event)");
}

const addToPile = (column, cardText, shown) => {
  card = createCard(cardText, shown);
  piles[column].append(card);
  piles[column] = card;
};
console.log(piles);

for (let line = 0; line <= 6; line++) {
  for (let column = line; column <= 6; column++) {
    const cardText = stock.pop();
    const shown = line == column;
    addToPile(column, cardText, shown);
  }
}

console.log(stock);

const dragover_handler = (ev) => ev.preventDefault();

const drop_handler = (ev) => {
  ev.preventDefault();
  const card = $("#beingdragged");
  const cardParent = card.parent();
  if (cardParent.hasClass("card") && !cardParent.hasClass("talon")) {
    cardParent.removeClass("face-down").addClass("face-up").attr("draggable", true).on("dragstart", dragstart_handler);
  }
  card.removeAttr("id");
  $(ev.target).append(card);
};
