const family = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "V", "D", "R"];
let stock = [];
let talon = [];

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

const dragover_handler = (ev) => ev.preventDefault();

const drop_handler = (ev) => {
  ev.preventDefault();
  const evTarget = $(ev.target);
  // forbid drop on itself
  if (evTarget.attr("id") == "beingdragged") {
    evTarget.removeAttr("id");
    return;
  }
  const droppedCard = $("#beingdragged");
  droppedCard.removeAttr("id");
  const from = droppedCard.attr("from");
  const foundation = evTarget.closest(".foundation");
  if (from == "talon") {
    talon.pop();
    makeDropReceptor(droppedCard);
  } else if (from == "pile") {
    // forbid dropping several cards on foundations
    if (foundation.length > 0 && droppedCard.find(".card").length > 0) {
      return;
    }

    const droppedCardOldParent = droppedCard.parent();
    makeDropReceptor(droppedCardOldParent);
    // reveal next card on old pile
    if (droppedCardOldParent.hasClass("card") && droppedCardOldParent.hasClass("face-down")) {
      droppedCardOldParent
        .removeClass("face-down")
        .addClass("face-up")
        .attr("draggable", true)
        .on("dragstart", dragstart_handler);
    }
  } else if (from == "foundation") {
    // nothing specific
  }

  if (foundation.length > 0) {
    foundation.append(droppedCard);
    droppedCard.attr("from", "foundation");
    return;
  }
  const pileOrPileCard = evTarget.closest(".card, .pile");
  if (pileOrPileCard.length > 0) {
    unmakeDropReceptor(pileOrPileCard);
    pileOrPileCard.append(droppedCard);
    droppedCard.attr("from", "pile");
  }
};

const createCard = (text, shown, from) => {
  const card = $("<div>")
    .addClass("card")
    .addClass(text.slice(-1)) // extract family
    .attr("from", from)
    .append($("<div>").addClass("t").text(text));

  if (shown) {
    card.addClass("face-up").attr("draggable", true).on("dragstart", dragstart_handler);
  } else {
    card.addClass("face-down");
  }

  return card;
};

const makeDropReceptor = (element) => {
  $(element).attr("ondrop", "drop_handler(event)").attr("ondragover", "dragover_handler(event)");
};

const unmakeDropReceptor = (element) => {
  element.removeAttr("ondrop").removeAttr("ondragover");
};

$(".pile, .foundation").each((i, e) => makeDropReceptor(e));

const foundations = [];

const findLastCardOnPile = (column) => {
  const cards = $(`.pile[index=${column}] .card`);
  if (cards.length == 0) {
    return $(`.pile[index=${column}]`);
  }
  return $(cards[cards.length - 1]);
};

const addToPile = (column, cardText, shown) => {
  const lastCard = findLastCardOnPile(column);
  unmakeDropReceptor(lastCard);
  const card = createCard(cardText, shown, "pile");
  makeDropReceptor(card);
  lastCard.append(card);
};

for (let line = 0; line <= 6; line++) {
  for (let column = line; column <= 6; column++) {
    const cardText = stock.pop();
    const shown = line == column;
    addToPile(column, cardText, shown);
  }
}

$(".stock").click((ev) => {
  if (stock.length == 0) {
    stock = talon.reverse();
    talon = [];
    $(".talon > .card").remove();
    if (stock.length > 0) {
      $(".stock").removeClass("empty");
    }
    return;
  }
  if (stock.length == 1) {
    $(".stock").addClass("empty");
  } else {
    $(".stock").removeClass("empty");
  }

  const cardText = stock.pop();
  talon.push(cardText);
  $(".talon").append(createCard(cardText, true, "talon"));
});
