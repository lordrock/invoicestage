const timeElement = document.querySelector('[data-testid="test-user-time"]');

function updateTime() {
  const currentTimeInMilliseconds = Date.now();
  timeElement.textContent = currentTimeInMilliseconds.toString();
}

updateTime();
setInterval(updateTime, 1000);