import { controls } from '@/core/controls';
import { initTextures } from '@/textures';
import { GameState } from '@/game-states/game.state';

let previousTime = 0;
const interval = 1000 / 60;
// tmpl.innerHTML = `<div style="font-size: 30px; text-align: center; position: absolute; bottom: 20px; width: 100%;">Click to Start</div>`;
document.onclick = (async () => {
  document.onclick = () => tmpl.requestPointerLock();
    tmpl.requestPointerLock();
    msg.innerHTML = '';

    await initTextures();

    const gameState = new GameState();

    let bgColor = 1.0;

    function fadeIn() {
      bgColor -= 0.008;
      tmpl.style.backgroundColor = `rgba(0.0, 0.0, 0.0, ${bgColor}`;
      if (bgColor > 0) {
        setTimeout(fadeIn, 10);
      } else {
        controls.enableControls();
        tmpl.style.backgroundColor = 'none';
      }
    }

    fadeIn();

    draw(0);

  function draw(currentTime: number) {
    const delta = currentTime - previousTime;

    if (delta >= interval) {
      previousTime = currentTime - (delta % interval);

      controls.queryController();
      gameState.onUpdate();
    }
    requestAnimationFrame(draw);
  }
});

