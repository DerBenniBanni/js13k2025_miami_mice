import { toRad } from "../utils.js";
import { Bone } from "./kinematics.js";

const sizing = 0.5

export class CatKinematics {
    constructor(x,y) {
        this.rootBone = new Bone(0, 0);
        this.bones = {
            rootBone: this.rootBone
        };
        this.x = x;
        this.y = y;
        this.createBones();
    }

    addBone(id, length, angle, parentId = "rootBone") {
        let bone = new Bone(length *sizing, angle);
        this.bones[id] = bone;
        this.bones[parentId].addChild(bone);
    }

    findBone(id) {
        return this.bones[id] || null;
    }

    createBones() {
        this.addBone("leftUpperLeg", 100, toRad(60), "rootBone");
        this.addBone("leftLowerLeg", 80, toRad(30), "leftUpperLeg");
        this.addBone("rightUpperLeg", 100, toRad(100), "rootBone");
        this.addBone("rightLowerLeg", 80, toRad(20), "rightUpperLeg");
        this.addBone("body", 100, toRad(-90), "rootBone");
        this.addBone("neck", 50, toRad(-10), "body");
        this.addBone("leftShoulder", 10, toRad(80), "body");
        this.addBone("leftArm", 80, toRad(40), "leftShoulder");
        this.addBone("leftForearm", 80, toRad(-100), "leftArm");
        this.addBone("rightShoulder", 10, toRad(-100), "body");
        this.addBone("rightArm", 80, toRad(-30), "rightShoulder");
        this.addBone("rightForearm", 80, toRad(-90), "rightArm");
       
        this.update();
    }

    update() {
        this.rootBone.x = this.x;
        this.rootBone.y = this.y;
        this.rootBone.calculateEndPosition();
    }

    render(ctx) {
        this.rootBone.render(ctx);
    }
}