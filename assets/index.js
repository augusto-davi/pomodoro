import dataTimer from './js/dataTimer.js';
import toggleBackgroundColor from './js/toggleBackgroundColor.js';
import decreaseDefaultTimer from './js/decreaseDefaultTimer.js';

const $btnTimer = document.querySelector('.btn-primary-timer');
const $display = document.querySelector('#timer');
const $btnTimerOptions = document.querySelectorAll('[class*=btn-options]');

let defaultTimer = 60 * 25 - 1;
let isRunning = false; // false | setInterval()

// TODO: notification, progressbar, dynamic title

function resetTimer(updateTimer) {
  clearInterval(isRunning);
  isRunning = false;
  defaultTimer = updateTimer * 60 - 1;
}

function handleTimerOptions() {
  const values = this.dataset.status;
  if (isRunning) {
    const changeTimerResponse = confirm(
      `O temporizador ainda está ligado. Tem certeza de que deseja desativar e alterar o temporizador?`
    );
    if (!changeTimerResponse) return;
    $btnTimer.textContent = 'Iniciar';
  }
  resetTimer(dataTimer[values][0]);
  toggleBackgroundColor(dataTimer[values][2]);
  $btnTimer.dataset.timer = dataTimer[values][0];
  $btnTimer.dataset.status = dataTimer[values][1];
  $display.textContent = `${
    dataTimer[values][0] === 5 ? '05' : dataTimer[values][0]
  }:00`;
}

function updateTimerButtonDataset() {
  if ($btnTimer.dataset.timer !== '25') {
    $btnTimer.dataset.timer = dataTimer.worktime[0];
    $btnTimer.dataset.status = dataTimer.worktime[1];
    $btnTimer.dataset.nextcolor = dataTimer.worktime[2];
  } else {
    $btnTimer.dataset.timer = dataTimer.minor[0];
    $btnTimer.dataset.status = dataTimer.minor[1];
    $btnTimer.dataset.nextcolor = dataTimer.minor[2];
  }
}

function updateDisplay(minutes, seconds) {
  $display.textContent = `${minutes}:${seconds}`;
  document.title = `${minutes}:${seconds} - Pomodoro`;
}

function resetDisplay() {
  $btnTimer.textContent = 'Iniciar';
  $display.textContent = `${
    $btnTimer.dataset.timer === '5' ? '05' : $btnTimer.dataset.timer
  }:00`;
}

function runTimer() {
  const minutes = parseInt(defaultTimer / 60, 10);
  const seconds = parseInt(defaultTimer % 60, 10);
  const formatMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formatSeconds = seconds < 10 ? `0${seconds}` : seconds;

  updateDisplay(formatMinutes, formatSeconds);

  if (defaultTimer === 0) {
    clearInterval(isRunning);
    resetTimer($btnTimer.dataset.timer);
    toggleBackgroundColor($btnTimer.dataset.nextcolor);
    resetDisplay();
    updateTimerButtonDataset();
  }
  decreaseDefaultTimer(() => {
    defaultTimer -= 1;
  });
}

function handleTimer() {
  if (!isRunning) {
    $btnTimer.textContent = 'Parar';
    isRunning = setInterval(runTimer, 1000);
    updateTimerButtonDataset();
    return;
  }
  $btnTimer.textContent = 'Iniciar';
  clearInterval(isRunning);
  isRunning = false;
}

$btnTimerOptions.forEach((options) =>
  options.addEventListener('click', handleTimerOptions)
);

$btnTimer.addEventListener('click', handleTimer);
