import { toRad } from "../utils.js";
import { Bone } from "./kinematics.js";

const sizing = 1;
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
const BONE_FACE = 13;
const BONE_NOSE = 14;
const BONE_EAR1 = 15;
const BONE_EAR2 = 16;
const BONE_EYE1 = 17;
const BONE_EYE2 = 18;
const BONE_TAIL1 = 19;
const BONE_TAIL2 = 20;
const BONE_TAIL3 = 21;


const POSE_STAND = [];
POSE_STAND[BONE_ROOT] = -90;
POSE_STAND[BONE_UPPER_LEG_LEFT] = 150;
POSE_STAND[BONE_LOWER_LEG_LEFT] = 30;
POSE_STAND[BONE_UPPER_LEG_RIGHT] = 190;
POSE_STAND[BONE_LOWER_LEG_RIGHT] = 20;
POSE_STAND[BONE_BODY] = 0;
POSE_STAND[BONE_SHOULDER_LEFT] = 80;
POSE_STAND[BONE_ARM_LEFT] = 40;
POSE_STAND[BONE_FOREARM_LEFT] = -100;
POSE_STAND[BONE_SHOULDER_RIGHT] = -100;
POSE_STAND[BONE_ARM_RIGHT] = -30;
POSE_STAND[BONE_FOREARM_RIGHT] = -90;
POSE_STAND[BONE_NECK] = -10;
POSE_STAND[BONE_FACE] = 110;
POSE_STAND[BONE_NOSE] = 90;
POSE_STAND[BONE_EAR1] = 0;
POSE_STAND[BONE_EAR2] = -20;
POSE_STAND[BONE_EYE1] = 65;
POSE_STAND[BONE_EYE2] = 62;

const POSE_PUNCH = [...POSE_STAND];
POSE_PUNCH[BONE_ARM_LEFT] = 15;
POSE_PUNCH[BONE_FOREARM_LEFT] = -10;
POSE_PUNCH[BONE_UPPER_LEG_LEFT] = 160;
POSE_PUNCH[BONE_LOWER_LEG_LEFT] = 40;
POSE_PUNCH[BONE_UPPER_LEG_RIGHT] = 200;

const POSE_PUNCH2 = [...POSE_STAND];
POSE_PUNCH2[BONE_ARM_LEFT] = 110;
POSE_PUNCH2[BONE_FOREARM_LEFT] = -90;
POSE_PUNCH2[BONE_ARM_RIGHT] = -160;
POSE_PUNCH2[BONE_FOREARM_RIGHT] = -10;
POSE_PUNCH2[BONE_UPPER_LEG_LEFT] = 160;
POSE_PUNCH2[BONE_LOWER_LEG_LEFT] = 40;
POSE_PUNCH2[BONE_UPPER_LEG_RIGHT] = 200;

const POSE_KICK = [...POSE_STAND];
POSE_KICK[BONE_UPPER_LEG_LEFT] = 60;
POSE_KICK[BONE_LOWER_LEG_LEFT] = 10;
POSE_KICK[BONE_BODY] = -40;
POSE_KICK[BONE_UPPER_LEG_RIGHT] = 185;
POSE_KICK[BONE_ARM_LEFT] = 80;
POSE_KICK[BONE_FOREARM_LEFT] = -150;
POSE_KICK[BONE_ARM_RIGHT] = -0;
POSE_KICK[BONE_FOREARM_RIGHT] = -130;


const POSE_BOW = [...POSE_STAND];
POSE_BOW[BONE_BODY] = 60;
POSE_BOW[BONE_ARM_LEFT] = 50;
POSE_BOW[BONE_ARM_RIGHT] = -130;
POSE_BOW[BONE_NECK] = 40;
POSE_BOW[BONE_UPPER_LEG_RIGHT] = 170;


const LINE_ROUND = "round";
const LINE_BUTT = "butt";

export class CatKinematics {
    constructor(x,y) {
        this.rootBone = null;
        this.bones = [];
        this.x = x;
        this.y = y;
        this.morphFrom = [];
        this.morphTo = [];
        this.morphDuration = 1; // seconds
        this.morphTimer = 0;
        this.invertX = false;
        this.giColors = ['#fff', '#aaa'];
        this.createBones();
    }

    addBone(id, length, angle, parentId = BONE_ROOT) {
        let bone = new Bone(length *sizing, angle, this);
        this.bones[id] = bone;
        this.bones[parentId].addChild(bone);
    }

    createBones() {
        this.rootBone = new Bone(185, -90, this);
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
        this.addBone(BONE_FACE, headsize*sizing*0.55, toRad(0), BONE_NECK);
        this.addBone(BONE_NOSE, headsize*sizing*1.15, toRad(0), BONE_NECK);
        this.addBone(BONE_EAR1, headsize*sizing*1.8, toRad(0), BONE_NECK);
        this.addBone(BONE_EAR2, headsize*sizing*1.8, toRad(-20), BONE_NECK);
        this.addBone(BONE_EYE1, headsize*sizing*0.95, toRad(70), BONE_NECK);
        this.addBone(BONE_EYE2, headsize*sizing*0.75, toRad(65), BONE_NECK);

        this.addBone(BONE_TAIL1, 60, toRad(-90), BONE_ROOT);
        this.addBone(BONE_TAIL2, 60, toRad(45), BONE_TAIL1);
        this.addBone(BONE_TAIL3, 60, toRad(-45), BONE_TAIL2);

        this.pose("stand");
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
        this.morphTo[BONE_TAIL1] = toRad(-130 + Math.random() * 80);
        this.morphTo[BONE_TAIL2] = toRad(-60 + Math.random() * 120);
        this.morphTo[BONE_TAIL3] = toRad(-60 + Math.random() * 120);
        this.morphDuration = duration;
        this.morphTimer = duration;
    }

    getPoseDefinition(poseName) {
        switch (poseName) {
            case "stand":
                return POSE_STAND;
            case "punch":
                return POSE_PUNCH;
            case "punch2":
                return POSE_PUNCH2;
            case "kick":
                return POSE_KICK;
            case "bow":
                return POSE_BOW;
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

    renderCat(bone, ctx, renderChildren = true) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 40*sizing;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(bone.x, bone.y);
        ctx.lineTo(bone.endX, bone.endY);
        ctx.stroke();
        // Render children
        if(renderChildren) {
            for (const child of bone.children) {
                this.renderCat(child, ctx, true);
            }
        }
    }
    renderSuit(bone, ctx, renderChildren = true, scale = 1) {
        [[50,this.giColors[1],LINE_BUTT],[48,this.giColors[0], LINE_ROUND]].forEach(([linewidth, color, lineCap]) => {
            linewidth = linewidth * scale;
            this.renderBoneLine(bone, ctx, linewidth * sizing, color, lineCap, renderChildren);
        });
    }

    renderBoneLine(bone, ctx, width, color, lineCap, renderChildren = true) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = lineCap ? lineCap : LINE_ROUND;
        if(bone.children.length == 0) {
            ctx.lineCap = LINE_BUTT;
        }
        ctx.beginPath();
        ctx.moveTo(bone.x, bone.y);
        ctx.lineTo(bone.endX, bone.endY);
        ctx.stroke();
        if(renderChildren) {
            for (const child of bone.children) {
                this.renderBoneLine(child, ctx, width, color, renderChildren);
            }
        }
    }
    renderShadow(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.ellipse(this.bones[BONE_ROOT].x, this.bones[BONE_ROOT].y, 90 * sizing, 15 * sizing, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    render(ctx) {
        this.renderShadow(ctx);
        this.renderCat(this.bones[BONE_SHOULDER_LEFT], ctx);
        this.renderSuit(this.bones[BONE_SHOULDER_LEFT], ctx);

        this.renderCat(this.bones[BONE_UPPER_LEG_LEFT], ctx);
        this.renderSuit(this.bones[BONE_UPPER_LEG_LEFT], ctx);

        //tail
        ctx.strokeStyle = "black";
        ctx.lineWidth = 15*sizing;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.bones[BONE_TAIL1].x, this.bones[BONE_TAIL1].y);
        ctx.bezierCurveTo(
            this.bones[BONE_TAIL2].x, this.bones[BONE_TAIL2].y, 
            this.bones[BONE_TAIL3].x, this.bones[BONE_TAIL3].y, 
            this.bones[BONE_TAIL3].endX, this.bones[BONE_TAIL3].endY
        );
        ctx.stroke();

        this.renderSuit(this.bones[BONE_BODY], ctx, false, 1.4);
        
        this.renderCat(this.bones[BONE_UPPER_LEG_RIGHT], ctx);
        this.renderSuit(this.bones[BONE_UPPER_LEG_RIGHT], ctx);

        this.renderCat(this.bones[BONE_SHOULDER_RIGHT], ctx);
        this.renderSuit(this.bones[BONE_SHOULDER_RIGHT], ctx);
        
       

        // Head
        ctx.fillStyle = "#000";
        let neck = this.bones[BONE_NECK];
        ctx.beginPath();
        ctx.arc(neck.endX, neck.endY, headsize*sizing, 0, 2*Math.PI);
        ctx.fill();
        // Face
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(this.bones[BONE_FACE].endX, this.bones[BONE_FACE].endY, headsize*0.7*sizing, 0, 2*Math.PI);
        ctx.fill();
        // Nose
        ctx.fillStyle = "#844";
        ctx.beginPath();
        ctx.arc(this.bones[BONE_NOSE].endX, this.bones[BONE_NOSE].endY, 5 * sizing, 0, 2 * Math.PI);
        ctx.fill();
        // ear1
        [BONE_EAR1, BONE_EAR2].forEach((boneId) => {
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(neck.endX, neck.endY);
            ctx.lineTo(this.bones[boneId].endX, this.bones[boneId].endY);
            let angle = this.bones[boneId].worldAngle - toRad(90 * (this.invertX ? -1 : 1));
            let x = neck.endX + Math.cos(angle) * headsize * 0.8 * sizing;
            let y = neck.endY + Math.sin(angle) * headsize * 0.8 * sizing;
            ctx.lineTo(x, y);
            ctx.fill();
        });
        [BONE_EYE1, BONE_EYE2].forEach((boneId) => {
            ctx.beginPath();
            ctx.fillStyle = "#ff0";
            ctx.arc(this.bones[boneId].endX, this.bones[boneId].endY, 3 * sizing, 0, 2 * Math.PI);
            ctx.fill();
        });
        

        /*
        ctx.beginPath();
        let noseX = neck.endX + Math.cos(neck.angle+toRad(0)) * (headsize + 5) * sizing;
        let noseY = neck.endY + Math.sin(neck.angle+toRad(0)) * (headsize + 5) * sizing;
        ctx.fillStyle = "#844";
        ctx.arc(noseX, noseY, 5 * sizing, 0, 2 * Math.PI);
        ctx.fill();
        */



    }
}