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
const dragstartHandler = (ev) => {
  ev.originalEvent.target.setAttribute("id", "beingdragged");
  ev.originalEvent.dataTransfer.dropEffect = "move";
};

const dragoverHandler = (ev) => ev.preventDefault();

const dropHandler = (ev) => {
  ev.preventDefault();
  const evTarget = $(ev.target);
  console.log(evTarget);
  dropOn(evTarget);
};

const dropOn = (dropTarget) => {
  // forbid dropping on itself
  if (dropTarget.attr("id") == "beingdragged") {
    dropTarget.removeAttr("id");
    return;
  }
  const droppedCard = $("#beingdragged");
  droppedCard.removeAttr("id");
  const from = droppedCard.attr("from");
  const foundation = dropTarget.closest(".foundation");
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
    if (droppedCardOldParent.hasClass("card") && !droppedCardOldParent.hasClass("revealed")) {
      droppedCardOldParent
        .addClass("revealed")
        .attr("draggable", true)
        .on("dragstart", dragstartHandler)
        .on("touchstart", handleStart)
        .on("touchend", handleEnd)
        .on("touchmove", handleMove);
    }
  } else if (from == "foundation") {
    // nothing specific
  }

  if (foundation.length > 0) {
    foundation.append(droppedCard);
    droppedCard.attr("from", "foundation");
    return;
  }
  const pileOrPileCard = dropTarget.closest(".card, .pile");
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
    card
      .addClass("revealed")
      .attr("draggable", true)
      .on("dragstart", dragstartHandler)
      .on("touchstart", handleStart)
      .on("touchend", handleEnd)
      .on("touchmove", handleMove);
  }

  return card;
};

const makeDropReceptor = (element) => {
  $(element).attr("ondrop", "dropHandler(event)").attr("ondragover", "dragoverHandler(event)");
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

start = [0, 0];
boxlefttop = [0, 0];

function handleStart(ev) {
  ev.preventDefault();
  if (ev.originalEvent.target.nodeName == "DIV" && ev.originalEvent.target.className == "t") {
    target = ev.originalEvent.target.parentNode;
  } else {
    target = ev.originalEvent.target;
  }
  console.log(target);
  target.setAttribute("id", "beingdragged");
  target.style.zIndex = 1;
  start = [parseInt(ev.changedTouches[0].clientX), parseInt(ev.changedTouches[0].clientY)];
  // console.log("touchstart", ev);
}

function handleEnd(ev) {
  ev.preventDefault();
  const targets = document
    .elementsFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY)
    .filter((e) => e.hasAttribute("ondrop") && e.getAttribute("id") != "beingdragged");
  console.log("touchend", targets);
  const dd = $("#beingdragged")
  if (targets.length > 0) {
    console.log("touchend", targets[0]);
    dropOn($(targets[0]));
  }
  dd.css({
    left: 0,
    top: 0,
    zIndex: 0,
  });
}

function handleCancel(ev) {
  ev.preventDefault();
  console.log("touchcancel", ev);
}

function handleMove(ev) {
  ev.preventDefault();
  move = [parseInt(ev.changedTouches[0].clientX) - start[0], parseInt(ev.changedTouches[0].clientY) - start[1]];
  start[0] += move[0];
  start[1] += move[1];
  if (ev.target.nodeName == "DIV" && ev.target.className == "t") {
    target = ev.target.parentNode;
  } else {
    target = ev.target;
  }
  $(target).css({
    left: function (index, value) {
      return parseInt(value) + move[0];
    },
    top: function (index, value) {
      return parseInt(value) + move[1];
    },
  });
}
