import { GameConstants, KillType, ObjectCategory } from "../../../common/src/constants";
import { CircleHitbox } from "../../../common/src/utils/hitbox";
import { Angle, Numeric } from "../../../common/src/utils/math";
import { type FullData } from "../../../common/src/utils/objectsSerializations";
import { type Vector } from "../../../common/src/utils/vector";
import { type Airstrike, type Game } from "../game";
import { Building } from "./building";
import { BaseGameObject } from "./gameObject";
import { Loot } from "./loot";
import { Obstacle } from "./obstacle";
import { Player } from "./player";

export class Bomb extends BaseGameObject<ObjectCategory.Bomb> {
    override readonly type = ObjectCategory.Bomb;

    private _height = 1;
    get height(): number { return this._height; }

    hitbox = new CircleHitbox(30);

    endTime = Date.now() + GameConstants.airstrike.fallTime;

    private readonly _airstrike: Airstrike;

    constructor(game: Game, position: Vector, airstrike: Airstrike) {
        super(game, position);
        this.hitbox.position = position;
        this._airstrike = airstrike;
        this.game.mapPings.add(this.position);
    }

    update(): void {
        if (this._height < 0) {
            this.game.removeObject(this);
            this.game.airstrikes.delete(this._airstrike);

            const explosion = this.game.addExplosion("air_strike", this.position, this);

            // Spawn smoke
            // this.game.addSyncedParticles({
            //     type: "airdrop_smoke_particle",
            //     count: 5,
            //     deployAnimation: {
            //         duration: 2000,
            //         staggering: {
            //             delay: 100,
            //             initialAmount: 2
            //         }
            //     },
            //     spawnRadius: 10
            // }, explosion.position);

            // Making "smoke" specifically for airstrike soon

            // Crush damage
            for (const object of this.game.grid.intersectsHitbox(this.hitbox)) {
                if (object.hitbox?.collidesWith(this.hitbox)) {
                    switch (true) {
                        case object instanceof Player: {
                            object.piercingDamage(GameConstants.airstrike.damage, KillType.Airstrike);
                            break;
                        }
                        case object instanceof Obstacle: {
                            object.damage(Infinity, this);
                            break;
                        }
                        case object instanceof Building && object.scopeHitbox?.collidesWith(this.hitbox): {
                            object.damage(Infinity);
                            break;
                        }
                    }
                }
            }

            // loop again to make sure loot added by destroyed obstacles is checked
            for (const loot of this.game.grid.intersectsHitbox(this.hitbox)) {
                if (loot instanceof Loot && this.hitbox.collidesWith(loot.hitbox)) {
                    if (loot.hitbox.collidesWith(this.hitbox)) {
                        loot.hitbox.resolveCollision(this.hitbox);
                    }

                    loot.push(
                        Angle.betweenPoints(this.position, loot.position),
                        -0.03
                    );
                }
            }

            return;
        }

        const elapsed = this.endTime - this.game.now;

        this._height = Numeric.lerp(0, 1, elapsed / GameConstants.airstrike.fallTime);

        this.game.partialDirtyObjects.add(this);
    }   
    override get data(): FullData<ObjectCategory.Bomb> {
        return {
            height: this._height,
            full: {
                position: this.position
            }
        };
    }
    override damage(): void { }
}   
