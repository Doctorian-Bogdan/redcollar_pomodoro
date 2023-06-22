const timerElement = document.querySelector('.pomodoro__timer');
const bodyElement = document.querySelector('.body');

const startButton = document.querySelector('.pomodoro__start');
const stopButton = document.querySelector('.pomodoro__stop');
const resetButton = document.querySelector('.pomodoro__reset');

const workButton = document.querySelector('.pomodoro__work');
const smallBreakButton = document.querySelector('.pomodoro__small-break');
const bigBreakButton = document.querySelector('.pomodoro__big-break');

const buttonsList = Array.from(document.querySelectorAll('.pomodoro__button'));

const sound = new Audio('../sounds/sound.mp3');

const fullWork = 1500;
const fullSmallBreak = 300;
const fullBigBreak = 900;
let remains = fullWork;
let timer;
let currentTimer = 'work';
let pomodoroCount = 0;

const changeToBreak = () => {
  bodyElement.classList.add('body_break');

  buttonsList.forEach((button) => {
    button.classList.add('pomodoro__button_break');
  })
}

const changeToWork = () => {
  bodyElement.classList.remove('body_break');

  buttonsList.forEach((button) => {
    button.classList.remove('pomodoro__button_break');
  })
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().length < 2 ? '0' + minutes : minutes}:${seconds.toString().length < 2 ? '0' + seconds : seconds}`
}

const stopTimer = () => {
  clearInterval(timer);
}

const runTimer = () => {
  clearInterval(timer);

  switch (currentTimer) {
    case "work": remains = (remains <= 0) ? fullWork : remains;
    break;
    case "smallBreak": remains = (remains <= 0) ? fullSmallBreak : remains;
    break;
    case "bigBreak": remains = (remains <= 0) ? fullBigBreak : remains;
  }

  timerElement.textContent = formatTime(remains);

  timer = setInterval(() => {
    remains--;
    timerElement.textContent = formatTime(remains);

    if (remains === 0) {
      sound.play();
      stopTimer();

      if (currentTimer === 'smallBreak' || currentTimer === 'bigBreak') {
        changeToWork()

        currentTimer = 'work';
        timerElement.textContent = formatTime(fullWork);
      } else {
        changeToBreak()

        if (pomodoroCount === 4) {
          timerElement.textContent = formatTime(fullBigBreak);
          currentTimer = 'bigBreak';
          pomodoroCount = 0;
        } else {
          timerElement.textContent = formatTime(fullSmallBreak);
          currentTimer = 'smallBreak';
          pomodoroCount++;
        }
      }
    }
  }, 1000)
};

const resetTimer = () => {
  clearInterval(timer);

  switch (currentTimer) {
    case "work": remains = fullWork;
      break;
    case "smallBreak": remains = fullSmallBreak;
      break;
    case "bigBreak": remains = fullBigBreak;
  }

  timerElement.textContent = formatTime(remains);
}

const selectWork = () => {
  clearInterval(timer);

  workButton.setAttribute('disabled', '');
  smallBreakButton.removeAttribute('disabled');
  bigBreakButton.removeAttribute('disabled');

  remains = fullWork;

  changeToWork()
  currentTimer = 'work';
  timerElement.textContent = formatTime(fullWork);
}

const selectSmallBreak = () => {
  clearInterval(timer);

  workButton.removeAttribute('disabled');
  smallBreakButton.setAttribute('disabled', '');
  bigBreakButton.removeAttribute('disabled');

  remains = fullSmallBreak;

  changeToBreak()
  currentTimer = 'smallBreak';
  timerElement.textContent = formatTime(fullSmallBreak);
}

const selectBigBreak = () => {
  clearInterval(timer);

  workButton.removeAttribute('disabled');
  smallBreakButton.removeAttribute('disabled');
  bigBreakButton.setAttribute('disabled', '');

  remains = fullBigBreak;

  changeToBreak()
  currentTimer = 'bigBreak';
  timerElement.textContent = formatTime(fullBigBreak);
}

startButton.addEventListener('click', runTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

workButton.addEventListener('click', selectWork);
smallBreakButton.addEventListener('click', selectSmallBreak);
bigBreakButton.addEventListener('click', selectBigBreak);
