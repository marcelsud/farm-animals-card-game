function shuffleCards() {
  $(".container").empty();

  _.range(2).map((row) => {
    $(".container").append(
      `<div
        class="row align-items-center row-cols-6 row-cols-sm-6 row-cols-md-6 g-6 cards-container-${row}"
      ></div>`
    );
    _.shuffle(_.range(6)).map((card) => {
      $(`.cards-container-${row}`).append(`
        <div class="col-md-2 col-xs-2 col-sm-2">
          <div class="card" data-card="${card}">
            <div class="back">
              <img src="imgs/back.png" />
            </div>
            <div class="front" >
              <img src="imgs/${card}.png" />
            </div>
          </div>
        </div>
      `);
    });
  });

  bindEvents();
}

function bindEvents() {
  $(".card").flip({
    front: ".back",
    back: ".front",
  });

  let correctCards = [];

  $(".card").on("flip:done", function () {
    const flipped = [
      ...$(".card")
        .filter((_, el) => $(el).data("flip-model")?.isFlipped === true)
        .map((_, el) => $(el).data("card"))
        .filter((_, card) => {
          return correctCards.includes(card) === false;
        }),
    ];

    if (flipped.length > 1) {
      if (flipped[0] === flipped[1]) {
        correctCards.push(flipped[0]);
        if (correctCards.length >= 6) {
          alert("Congratulations! You won the game!");
          document.location.reload(true);
        }
      } else {
        setTimeout(() => {
          flipped.map((card) => $(`.card[data-card="${card}"]`).flip(false));
        }, 600);
      }
    }
  });
}

$(document).ready(function () {
  shuffleCards();
});
