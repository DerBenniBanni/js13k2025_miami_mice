import { toRad } from "../utils.js";
import { Bone } from "./kinematics.js";

const sizing = 0.5;
const headsize = 40;

const BONE_ROOT = 0;
const BONE_UPPER_LEG_LEFT = 1;
const BONE_LOWER_LEG_LEFT = 2;
const BONE_UPPER_LEG_RIGHT = 3;
const BONE_LOWER_LEG_RIGHT = 4;
const BONE_BODY = 5;
const BONE_SHOULDER_LEFT = 6;
const BONE_ARM_LEFT = 7;
const BONE_FOREARM_LEFT = 8;
const BONE_SHOULDER_RIGHT = 9;
const BONE_ARM_RIGHT = 10;
const BONE_FOREARM_RIGHT = 11;
const BONE_NECK = 12;

const POSE_STAND = [];
POSE_STAND[BONE_ROOT] = 0;
POSE_STAND[BONE_UPPER_LEG_LEFT] = 60;
POSE_STAND[BONE_LOWER_LEG_LEFT] = 30;
POSE_STAND[BONE_UPPER_LEG_RIGHT] = 100;
POSE_STAND[BONE_LOWER_LEG_RIGHT] = 20;
POSE_STAND[BONE_BODY] = -90;
POSE_STAND[BONE_SHOULDER_LEFT] = 80;
POSE_STAND[BONE_ARM_LEFT] = 40;
POSE_STAND[BONE_FOREARM_LEFT] = -100;
POSE_STAND[BONE_SHOULDER_RIGHT] = -100;
POSE_STAND[BONE_ARM_RIGHT] = -30;
POSE_STAND[BONE_FOREARM_RIGHT] = -90;
POSE_STAND[BONE_NECK] = -10;

const POSE_PUNCH = [...POSE_STAND];
POSE_PUNCH[BONE_ARM_LEFT] = 15;
POSE_PUNCH[BONE_FOREARM_LEFT] = -10;
POSE_PUNCH[BONE_UPPER_LEG_LEFT] = 70;
POSE_PUNCH[BONE_LOWER_LEG_LEFT] = 40;
POSE_PUNCH[BONE_UPPER_LEG_RIGHT] = 110;

const POSE_KICK = [...POSE_STAND];
POSE_KICK[BONE_UPPER_LEG_LEFT] = -30;
POSE_KICK[BONE_LOWER_LEG_LEFT] = 10;
POSE_KICK[BONE_BODY] = -105;
POSE_KICK[BONE_UPPER_LEG_RIGHT] = 95;
POSE_KICK[BONE_ARM_LEFT] = 80;
POSE_KICK[BONE_FOREARM_LEFT] = -150;
POSE_KICK[BONE_ARM_RIGHT] = -0;
POSE_KICK[BONE_FOREARM_RIGHT] = -130;

export class CatKinematics {
    constructor(x,y) {
        this.rootBone = new Bone(0, 0);
        this.bones = [];
        this.x = x;
        this.y = y;
        this.morphFrom = [];
        this.morphTo = [];
        this.morphDuration = 1; // seconds
        this.morphTimer = 0;
        this.createBones();
    }

    addBone(id, length, angle, parentId = BONE_ROOT) {
        let bone = new Bone(length *sizing, angle);
        this.bones[id] = bone;
        this.bones[parentId].addChild(bone);
    }

    createBones() {
        this.bones[BONE_ROOT] = this.rootBone;
        this.addBone(BONE_UPPER_LEG_LEFT, 100, toRad(60), BONE_ROOT);
        this.addBone(BONE_LOWER_LEG_LEFT, 80, toRad(30), BONE_UPPER_LEG_LEFT);
        this.addBone(BONE_UPPER_LEG_RIGHT, 100, toRad(100), BONE_ROOT);
        this.addBone(BONE_LOWER_LEG_RIGHT, 80, toRad(20), BONE_UPPER_LEG_RIGHT);
        this.addBone(BONE_BODY, 100, toRad(-90), BONE_ROOT);
        this.addBone(BONE_NECK, 50, toRad(-10), BONE_BODY);
        this.addBone(BONE_SHOULDER_LEFT, 10, toRad(80), BONE_BODY);
        this.addBone(BONE_ARM_LEFT, 80, toRad(40), BONE_SHOULDER_LEFT);
        this.addBone(BONE_FOREARM_LEFT, 80, toRad(-100), BONE_ARM_LEFT);
        this.addBone(BONE_SHOULDER_RIGHT, 10, toRad(-100), BONE_BODY);
        this.addBone(BONE_ARM_RIGHT, 80, toRad(-30), BONE_SHOULDER_RIGHT);
        this.addBone(BONE_FOREARM_RIGHT, 80, toRad(-90), BONE_ARM_RIGHT);
       
        this.updateAngles();
    }

    pose(poseName) {
        const poseDef = this.getPoseDefinition(poseName);
        for (let i = 0; i < poseDef.length; i++) {
            this.bones[i].angle = toRad(poseDef[i]);
        }
        this.updateAngles();
    }

    morph(poseName, duration) {
        this.morphFrom = this.bones.map(bone => bone.angle);
        this.morphTo = this.getPoseDefinition(poseName).map(angle => toRad(angle));
        this.morphDuration = duration;
        this.morphTimer = duration;
    }

    getPoseDefinition(poseName) {
        switch (poseName) {
            case "stand":
                return POSE_STAND;
            case "punch":
                return POSE_PUNCH;
            case "kick":
                return POSE_KICK;
            default:
                return POSE_STAND;
        }
    }

    updateAngles() {
        this.rootBone.x = this.x;
        this.rootBone.y = this.y;
        this.rootBone.calculateEndPosition();
    }

    update(delta) {
        if(this.morphTimer > 0) {
            for(let i = 0; i < this.morphFrom.length; i++) {
                let step = ((this.morphTo[i]+100)-(this.morphFrom[i]+100)) / (this.morphDuration / delta);
                this.bones[i].angle += step;
            }
            this.updateAngles();
            this.morphTimer -= delta;
        }
    }

    render(ctx) {
        this.rootBone.render(ctx);
        let neck = this.bones[BONE_NECK];
        ctx.beginPath();
        ctx.arc(neck.endX, neck.endY, headsize*sizing, 0, 2*Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = 25;
        ctx.moveTo(neck.endX, neck.endY);
        let angle = neck.worldAngle + toRad(110);
        ctx.lineTo(neck.endX + Math.cos(angle) * (headsize - 20) * sizing, neck.endY + Math.sin(angle) * (headsize - 20) * sizing);
        ctx.stroke();

        [0,-30].forEach((angleOffset) => {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(neck.endX, neck.endY);
            let angle = neck.worldAngle + toRad(angleOffset+10);
            ctx.lineTo(neck.endX + Math.cos(angle) * (headsize + 20) * sizing, neck.endY + Math.sin(angle) * (headsize + 20) * sizing);
            angle = neck.worldAngle + toRad(angleOffset-20);
            ctx.lineTo(neck.endX + Math.cos(angle) * (headsize) * sizing, neck.endY + Math.sin(angle) * (headsize) * sizing);
            ctx.fill();
        });
    }
}