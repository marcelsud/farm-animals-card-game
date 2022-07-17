let audioEnabled = false;
let backgroundMusicElement = createAudioElement(`sounds/background.mp3`, 0.3);

function shuffleCards() {
  $("#game").empty();
  const rows = _.range(2);
  const cards = _.slice(_.shuffle(_.range(12)), 0, 6);
  const mergedCards = _.shuffle(cards.concat(cards));
  const chunks = [_.slice(mergedCards, 0, 6), _.slice(mergedCards, 6, 12)];

  rows.map((row) => {
    $("#game").append(
      `<div
        class="row align-items-center row-cols-6 row-cols-sm-6 row-cols-md-6 g-6 cards-container-${row}"
      ></div>`
    );
    chunks[row].map((card) => {
      $(`.cards-container-${row}`).append(`
        <div class="col-md-2 col-xs-2 col-sm-2">
          <div class="card" data-card="${card}">
            <div class="back">
              <img draggable="false" src="imgs/back.png" />
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

function createAudioElement(sound, volume = 0.5) {
  var audioElement = document.createElement("audio");
  audioElement.setAttribute("src", sound);
  audioElement.volume = volume;
  return audioElement;
}

function bindEvents() {
  if (!audioEnabled) {
    $("#enableAudio").html(`
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"></path>
      </svg>
      Enable audio
    `);
  }

  $("#enableAudio").on("click", function () {
    if (audioEnabled) {
      audioEnabled = false;
      backgroundMusicElement.pause();
      $("#enableAudio").html(`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"></path>
        </svg>
        Enable audio
      `);
    } else {
      audioEnabled = true;
      backgroundMusicElement.loop = true;
      backgroundMusicElement.play();
      $("#enableAudio").html(`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-pause-circle-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"
          ></path>
        </svg>
        Disable audio
      `);
    }
  });

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
        $(`.card[data-card="${flipped[0]}"]`).off(".flip");
        $(`.card[data-card="${flipped[1]}"]`).off(".flip");

        if (audioEnabled) {
          createAudioElement(`sounds/yeah.mp3`, 1).play();
        }

        correctCards.push(flipped[0]);
        if (correctCards.length >= 6) {
          alert("Congratulations! You won the game!");
          return shuffleCards();
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
