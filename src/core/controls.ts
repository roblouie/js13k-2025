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
  inputDirection = new EnhancedDOMPoint();
  cameraDirection = new EnhancedDOMPoint();
  mouseMovement = new EnhancedDOMPoint();
  isJump? = false;
  isPrevJump? = false;

  keyMap: Map<string, boolean> = new Map();

  constructor() {
    document.addEventListener('keydown', event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));

    window.addEventListener("mousemove", (e) => {
      this.mouseMovement.x += e.movementX * 0.1;
      this.mouseMovement.y += e.movementY * 0.1;
    });
  }

  queryController() {
    this.isPrevJump = this.isJump;
    const gamepad = navigator.getGamepads()[0];
    const isButtonPressed = (button: XboxControllerButton) => gamepad?.buttons[button].pressed;

    const leftVal = (this.keyMap.get('KeyA') || isButtonPressed(XboxControllerButton.DpadLeft)) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD') || isButtonPressed(XboxControllerButton.DpadRight)) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW') || isButtonPressed(XboxControllerButton.DpadUp)) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS') || isButtonPressed(XboxControllerButton.DpadDown)) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal) || gamepad?.axes[0] || 0;
    this.inputDirection.y = (upVal + downVal) || gamepad?.axes[1] || 0;
    this.cameraDirection.x = gamepad?.axes[2] || this.mouseMovement.x;
    this.cameraDirection.y = gamepad?.axes[3] || this.mouseMovement.y;
    this.isJump = this.keyMap.get('Space') || isButtonPressed(XboxControllerButton.A);

    const deadzone = 0.15;
    if (this.inputDirection.magnitude < deadzone) {
      this.inputDirection.x = 0;
      this.inputDirection.y = 0;
    }

    if (this.cameraDirection.magnitude < deadzone) {
      this.cameraDirection.set(0, 0, 0);
    }

    this.mouseMovement.set(0, 0);
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    this.keyMap.set(event.code, isPressed);
  }
}

export const controls = new Controls();
