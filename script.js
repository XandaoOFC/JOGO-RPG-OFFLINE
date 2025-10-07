let player = { name: '', level: 1, coins: 0, xp: 0 };

function saveGame() {
  localStorage.setItem('rpgDivinoSave', JSON.stringify(player));
}

function loadGame() {
  const save = localStorage.getItem('rpgDivinoSave');
  if (save) player = JSON.parse(save);
}

function newGame() {
  const name = prompt('Digite o nome do seu personagem:');
  if (!name) return;
  player.name = name;
  player.level = 1;
  player.coins = 0;
  saveGame();
  startIntro();
}

function continueGame() {
  loadGame();
  if (!player.name) {
    alert('Nenhum jogo salvo encontrado.');
    return;
  }
  startGame();
}

function startIntro() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('intro').classList.remove('hidden');
  const introText = document.getElementById('introText');
  const story = `Em um universo onde os deuses dormem e o caos desperta, ${player.name} surge para transcender os limites da realidade...`;
  let i = 0;
  const interval = setInterval(() => {
    introText.textContent += story[i];
    i++;
    if (i >= story.length) {
      clearInterval(interval);
      setTimeout(startGame, 3000);
    }
  }, 60);
}

function startGame() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  updateHUD();
}

function updateHUD() {
  document.getElementById('playerName').textContent = `Nome: ${player.name}`;
  document.getElementById('playerLevel').textContent = `Nível: ${player.level}`;
  document.getElementById('playerCoins').textContent = `Moedas: ${player.coins}`;
}

function showCredits() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('credits').classList.remove('hidden');
}

function returnToMenu() {
  document.getElementById('credits').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
}
