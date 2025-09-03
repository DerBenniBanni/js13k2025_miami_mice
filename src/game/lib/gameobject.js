import { ctxBeginPath, ctxFill, ctxFillStyle, ctxRect, ctxRestore, ctxRotate, ctxSave, ctxTranslate } from "./utils.js";

export const PARTICLE_HIT = 1;

export class GameObject {
    constructor(x, y, type = "gameObject") {
        this.x = x;
        this.y = y;
        this.game = null;
        this.type = type;
        this.particles = [];
        this.ttl = Infinity;
    }

    update(delta) {
        this.ttl -= delta;
        this.particles.forEach(p => {
            p.ttl -= delta;
            p.r += p.dr * delta;
            p.x += p.dx * delta;
            p.y += p.dy * delta;
        });
        this.particles = this.particles.filter(p=>p.ttl > 0);
    }

    renderParticles(ctx) {
        this.particles.forEach(p => {
            //TODO: make it depending on type
            ctxSave(ctx);
            ctxTranslate(ctx, p.x, p.y);
            ctxRotate(ctx, p.r);
            ctxBeginPath(ctx);
            let s = p.s * p.ttl/p.ittl;
            ctxFillStyle(ctx,'#ccc3');
            ctxRect(ctx, -s/2, -s/2, s, s);
            ctxFill(ctx);
            ctxRestore(ctx);    
        });
    }

    addParticle(x,y,s,ttl, type=PARTICLE_HIT) {
        this.particles.push({
            x,y, // position
            dx: Math.random() * 200 - 100, dy: Math.random() * 200 - 130,
            s, // size
            ttl, // lifetime in seconds
            type,
            ittl:ttl, // initial lifetime
            r:0, // rotation
            dr: 20 * (Math.random() > 0.5 ? 1 : -1) // rotation delta
        });
    }

    
}