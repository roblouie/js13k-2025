import {Mesh} from "@/engine/renderer/mesh";
import {Scene} from "@/engine/renderer/scene";
import {makeWitch} from "@/modeling/witch";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";

export class WitchManager {
  witches: Mesh[] = [];
  sceneRef: Scene;

  constructor(sceneRef: Scene) {
    this.sceneRef = sceneRef;

    // 1 - Map start witch
    this.witches.push(makeWitch(new EnhancedDOMPoint(103, 6.5, 125), new EnhancedDOMPoint(0, 50, 0)));

    // 2 - hedge maze witch
    this.witches.push(makeWitch(new EnhancedDOMPoint(-202, 6.5, 195), new EnhancedDOMPoint(0, 37)));

    // 3 - behind bridge witch
    this.witches.push(makeWitch(new EnhancedDOMPoint(-219, 6.5, 8), new EnhancedDOMPoint(0, 90)));

    // 4 - elevated path witch
    this.witches.push(makeWitch(new EnhancedDOMPoint(212,46, -214), new EnhancedDOMPoint(0, -90)));

    // 5 - cave top witch
    this.witches.push(makeWitch(new EnhancedDOMPoint(101, 63, 14.5), new EnhancedDOMPoint(0, 90)));

    // 6 - top of pipe witch
    this.witches.push(makeWitch(new EnhancedDOMPoint(250, 91, -88.5), new EnhancedDOMPoint(0, -90)));

    // 7 - mountaintop witch
    this.witches.push(makeWitch(new EnhancedDOMPoint(-105, 194.5, -106.5), new EnhancedDOMPoint(0, -180)));


    this.sceneRef.add_(...this.witches);
    // for (let i = 0; i < 13; i++) {
    //   const witch = makeWitch();
    //   witch.position.x = Math.random() * 90;
    //   witch.position.z = Math.random() * 90;
    //   witch.position.y = (Math.random()+ 0.5) * 20;
    //   witch.frameB = 1;
    //   this.witches.push(witch);
    //   this.sceneRef.add_(witch);
    // }
  }

  update() {
    this.witches.forEach(witch => {
      witch.alpha += 0.03;
      if (witch.alpha >= 1) {
        witch.alpha = 0;
        witch.frameA = witch.frameA === 0 ? 1 : 0;
        witch.frameB = witch.frameB === 0 ? 1 : 0;
      }
    })
  }
}