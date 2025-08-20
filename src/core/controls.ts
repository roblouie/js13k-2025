import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";

const enum XboxControllerButton {
  A,
  B,
  X,
  Y,
  LeftBumper,
  RightBumper,
  LeftTrigger,
  RightTrigger,
  Select,
  Start,
  L3,
  R3,
  DpadUp,
  DpadDown,
  DpadLeft,
  DpadRight,
}

class Controls {
  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;
  inputDirection = new EnhancedDOMPoint();
  cameraDirection = new EnhancedDOMPoint();
  mouseSensitivity = 0.5;
  mouseMovement = new EnhancedDOMPoint();
  isJump? = false;

  keyMap: Map<string, boolean> = new Map();
  previousState = { isUp: this.isUp, isDown: this.isDown };

  constructor() {
    document.addEventListener('keydown', event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));

    window.addEventListener("mousemove", (e) => {
      this.mouseMovement.x += e.movementX * 0.1;
      this.mouseMovement.y += e.movementY * 0.1;
    });
  }

  queryController() {
    this.previousState.isUp = this.isUp;
    this.previousState.isDown = this.isDown;
    const gamepad = navigator.getGamepads()[0];
    const isButtonPressed = (button: XboxControllerButton) => gamepad?.buttons[button].pressed;

    const leftVal = (this.keyMap.get('KeyA') || this.keyMap.get('ArrowLeft') || isButtonPressed(XboxControllerButton.DpadLeft)) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD') || this.keyMap.get('ArrowRight') || isButtonPressed(XboxControllerButton.DpadRight)) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW') || this.keyMap.get('ArrowUp') || isButtonPressed(XboxControllerButton.DpadUp)) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS') || this.keyMap.get('ArrowDown') || isButtonPressed(XboxControllerButton.DpadDown)) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal) || gamepad?.axes[0] || 0;
    this.inputDirection.y = (upVal + downVal) || gamepad?.axes[1] || 0;
    this.cameraDirection.x = gamepad?.axes[2] || this.mouseMovement.x;
    this.cameraDirection.y = this.mouseMovement.y; //gamepad?.axes[3] || this.mouseMovement.y;
    this.isJump = this.keyMap.get('Space') || isButtonPressed(XboxControllerButton.A);

    const deadzone = 0.15;
    if (this.inputDirection.magnitude < deadzone) {
      this.inputDirection.x = 0;
      this.inputDirection.y = 0;
    }

    if (this.cameraDirection.magnitude < deadzone) {
      this.cameraDirection.set(0, 0, 0);
    }

    this.isUp = this.inputDirection.y < 0;
    this.isDown = this.inputDirection.y > 0;
    this.isLeft = this.inputDirection.x < 0;
    this.isRight = this.inputDirection.x > 0;

    this.mouseMovement.set(0, 0);
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    this.keyMap.set(event.code, isPressed);
  }
}

export const controls = new Controls();
