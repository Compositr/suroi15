import { FireMode, ZIndexes } from "../constants";
import { mergeDeep } from "../utils/misc";
import { ItemType, type BaseBulletDefinition, type InventoryItemDefinition, type ReferenceTo } from "../utils/objectDefinitions";
import { Vec, type Vector } from "../utils/vector";
import { type AmmoDefinition } from "./ammos";

type BaseGunDefinition = InventoryItemDefinition & {
    readonly itemType: ItemType.Gun

    readonly ammoType: ReferenceTo<AmmoDefinition>
    readonly ammoSpawnAmount?: number
    readonly capacity: number
    readonly reloadTime: number
    readonly singleReload?: boolean
    readonly infiniteAmmo?: boolean

    readonly fireDelay: number
    readonly switchDelay: number

    readonly recoilMultiplier: number
    readonly recoilDuration: number
    readonly shotSpread: number
    readonly moveSpread: number
    readonly jitterRadius?: number // Jitters the bullet position, mainly for shotguns
    readonly consistentPatterning?: boolean

    readonly firstShotAccuracy?: boolean

    readonly noQuickswitch?: boolean
    readonly bulletCount?: number
    readonly length: number
    readonly centerJitterOnMuzzle?: boolean
    readonly shootOnRelease?: boolean
    readonly summonAirdrop?: boolean

    readonly fists: {
        readonly leftZIndex?: number
        readonly rightZIndex?: number
        readonly animationDuration: number
    }

    readonly casingParticles?: Array<{
        readonly frame?: string
        readonly count?: number
        readonly ejectionDelay?: number
        readonly velocity?: {
            readonly x?: {
                readonly min: number
                readonly max: number
                readonly randomSign?: boolean
            }
            readonly y?: {
                readonly min: number
                readonly max: number
                readonly randomSign?: boolean
            }
        }

        readonly on?: "fire" | "reload"
    }>

    readonly image: {
        readonly angle?: number
    }

    readonly noMuzzleFlash?: boolean
    readonly ballistics: BaseBulletDefinition
} & ({
    readonly fireMode: FireMode.Auto | FireMode.Single
} | {
    readonly fireMode: FireMode.Burst
    readonly burstProperties: {
        readonly shotsPerBurst: number
        readonly burstCooldown: number
        // note: the time between bursts is burstCooldown, and the time between shots within a burst is cooldown
    }
}) & ({
    readonly isDual?: false
    readonly fists?: InventoryItemDefinition["fists"]
    readonly image: {
        readonly position: Vector
    }

    readonly casingParticles?: Array<{ readonly position: Vector }>
} | {
    readonly isDual: true
    readonly singleVariant: ReferenceTo<GunDefinition>
    /**
     * This offset is used for pretty much everything that's unique to dual weapons: it's an offset for projectile spawns, casing spawns and world images
     */
    readonly leftRightOffset: number
});

export type GunDefinition = BaseGunDefinition & {
    readonly dualVariant?: ReferenceTo<GunDefinition>
};

export type SingleGunNarrowing = GunDefinition & { readonly isDual: false };
export type DualGunNarrowing = GunDefinition & { readonly isDual: true };

/* eslint-disable @typescript-eslint/indent */
type RawGunDefinition = BaseGunDefinition & {
    readonly isDual?: never
    readonly dual?: {
        readonly leftRightOffset: number
    } & {
        [
            K in Extract<
                keyof DualGunNarrowing,
                "wearerAttributes" |
                "ammoSpawnAmount" |
                "capacity" |
                "reloadTime" |
                "fireDelay" |
                "switchDelay" |
                "speedMultiplier" |
                "recoilMultiplier" |
                "recoilDuration" |
                "shotSpread" |
                "moveSpread" |
                "burstProperties" |
                "leftRightOffset"
            >
        ]?: DualGunNarrowing[K]
    }
};

const GunsRaw: RawGunDefinition[] = [
    {
        idString: "ak47",
        name: "AK-47",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        reloadTime: 2.5,
        fireDelay: 100,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 150,
        fireMode: FireMode.Auto,
        shotSpread: 2,
        moveSpread: 6,
        length: 7.5,
        fists: {
            left: Vec.create(120, -2),
            right: Vec.create(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 2) },
        casingParticles: [{
            frame: "casing_762x39mm",
            position: Vec.create(4, 0.4)
        }],
        ballistics: {
            damage: 14,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        }
    },
    {
        idString: "arx160",
        name: "ARX-160",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        reloadTime: 2.75,
        fireDelay: 75,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 145,
        fireMode: FireMode.Auto,
        shotSpread: 5,
        moveSpread: 10,
        length: 6.6,
        fists: {
            left: Vec.create(98, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(70, 0) },
        casingParticles: [{
            frame: "casing_762x39mm",
            position: Vec.create(4, 0.4)
        }],
        ballistics: {
            damage: 12.25,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        }
    },
    {
        idString: "aug",
        name: "AUG",
        itemType: ItemType.Gun,
        ammoType: "556mm",
        ammoSpawnAmount: 90,
        fireDelay: 70,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 120,
        fireMode: FireMode.Auto,
        shotSpread: 4,
        moveSpread: 11,
        length: 6.7,
        fists: {
            left: Vec.create(105, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(75, -4) },
        casingParticles: [{
            position: Vec.create(2.5, 0.5)
        }],
        capacity: 30,
        reloadTime: 2.25,
        ballistics: {
            damage: 10.5,
            obstacleMultiplier: 1.5,
            speed: 0.28,
            range: 160
        }
    },
    {
        idString: "acr",
        name: "ACR",
        itemType: ItemType.Gun,
        ammoType: "556mm",
        ammoSpawnAmount: 90,
        fireDelay: 72.5,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 130,
        fireMode: FireMode.Auto,
        shotSpread: 2,
        moveSpread: 7,
        noMuzzleFlash: true,
        length: 6.2,
        fists: {
            left: Vec.create(95, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(75, -1) },
        casingParticles: [{
            position: Vec.create(4, 0.5)
        }],
        capacity: 30,
        reloadTime: 3,
        ballistics: {
            damage: 14.5,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 160,
            tracer: {
                opacity: 0.5
            }
        }
    },
    {
        idString: "m3k",
        name: "M3K",
        itemType: ItemType.Gun,
        ammoType: "12g",
        ammoSpawnAmount: 18,
        capacity: 9,
        reloadTime: 0.55,
        fireDelay: 700,
        switchDelay: 700,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.5,
        recoilDuration: 500,
        fireMode: FireMode.Single,
        shotSpread: 5,
        moveSpread: 7,
        jitterRadius: 0.5,
        bulletCount: 9,
        length: 7.7,
        fists: {
            left: Vec.create(105, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 5) },
        casingParticles: [{
            position: Vec.create(4, 0.6)
        }],
        singleReload: true,
        ballistics: {
            damage: 9,
            obstacleMultiplier: 1,
            speed: 0.2,
            range: 80
        }
    },
    {
        idString: "model_37",
        name: "Model 37",
        itemType: ItemType.Gun,
        ammoType: "12g",
        ammoSpawnAmount: 15,
        capacity: 5,
        reloadTime: 0.75,
        fireDelay: 900,
        switchDelay: 900,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.5,
        recoilDuration: 550,
        fireMode: FireMode.Single,
        shotSpread: 11,
        moveSpread: 14,
        jitterRadius: 1.25,
        bulletCount: 10,
        length: 7.9,
        fists: {
            left: Vec.create(122, -3),
            right: Vec.create(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(95, 0) },
        casingParticles: [{
            position: Vec.create(4.5, 0.6),
            ejectionDelay: 450,
            velocity: {
                y: {
                    min: 2,
                    max: 5,
                    randomSign: true
                }
            }
        }],
        singleReload: true,
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 48,
            tracer: {
                length: 0.7
            }
        }
    },
    {
        idString: "hp18",
        name: "HP18",
        itemType: ItemType.Gun,
        ammoType: "12g",
        ammoSpawnAmount: 15,
        capacity: 5,
        reloadTime: 0.725,
        singleReload: true,
        fireDelay: 300,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.6,
        recoilDuration: 600,
        fireMode: FireMode.Single,
        bulletCount: 18,
        shotSpread: 24,
        moveSpread: 28,
        jitterRadius: 1.75,
        centerJitterOnMuzzle: true,
        length: 8,
        fists: {
            left: Vec.create(120, -1),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(100, 0) },
        casingParticles: [{
            position: Vec.create(4, 0.6)
        }],
        ballistics: {
            damage: 4,
            obstacleMultiplier: 0.5,
            speed: 0.12,
            range: 40,
            tracer: {
                length: 0.5
            }
        }
    },
    {
        idString: "flues",
        name: "Flues",
        itemType: ItemType.Gun,
        ammoType: "12g",
        ammoSpawnAmount: 10,
        capacity: 2,
        reloadTime: 2.6,
        fireDelay: 175,
        switchDelay: 250,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.8,
        recoilDuration: 100,
        fireMode: FireMode.Single,
        bulletCount: 10,
        shotSpread: 11,
        moveSpread: 14,
        jitterRadius: 1.5,
        length: 6,
        fists: {
            left: Vec.create(95, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(75, 0) },
        casingParticles: [{
            position: Vec.create(4, 0.6),
            count: 2,
            velocity: {
                y: {
                    min: 8,
                    max: 15,
                    randomSign: true
                }
            },
            on: "reload"
        }],
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 48,
            tracer: {
                length: 0.5
            }
        }
    },
    {
        idString: "vepr12",
        name: "Vepr-12",
        itemType: ItemType.Gun,
        ammoType: "12g",
        ammoSpawnAmount: 20,
        capacity: 5,
        reloadTime: 2.4,
        fireDelay: 450,
        switchDelay: 650,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.7,
        recoilDuration: 550,
        fireMode: FireMode.Auto,
        shotSpread: 11,
        moveSpread: 14,
        jitterRadius: 1.25,
        length: 7.1,
        bulletCount: 10,
        fists: {
            left: Vec.create(98, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(81, 2) },
        casingParticles: [{
            position: Vec.create(4.3, 0.6)
        }],
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 48,
            tracer: {
                length: 0.5
            }
        }
    },
    {
        idString: "mosin",
        name: "Mosin-Nagant",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 20,
        capacity: 5,
        reloadTime: 0.85,
        singleReload: true,
        fireDelay: 900,
        switchDelay: 900,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.45,
        recoilDuration: 750,
        fireMode: FireMode.Single,
        shotSpread: 1,
        moveSpread: 2,
        length: 8.7,
        shootOnRelease: true,
        fists: {
            left: Vec.create(115, -4),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 6.5) },
        casingParticles: [{
            frame: "casing_762x54mmR",
            position: Vec.create(4, 0.6),
            ejectionDelay: 700
        }],
        ballistics: {
            damage: 70,
            obstacleMultiplier: 1,
            speed: 0.33,
            range: 250,
            tracer: {
                width: 1.4,
                length: 2.5
            }
        }
    },
    {
        idString: "tango_51",
        name: "Tango 51",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 20,
        capacity: 5,
        reloadTime: 2.6,
        fireDelay: 900,
        switchDelay: 900,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.4,
        recoilDuration: 1000,
        fireMode: FireMode.Single,
        shotSpread: 0.3,
        moveSpread: 0.6,
        length: 8.9,
        shootOnRelease: true,
        fists: {
            left: Vec.create(106, -1),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 5) },
        casingParticles: [{
            position: Vec.create(4, 0.6),
            ejectionDelay: 450
        }],
        ballistics: {
            damage: 79,
            obstacleMultiplier: 1,
            speed: 0.4,
            range: 280,
            tracer: {
                width: 1.6,
                length: 3.5
            }
        }
    },
    {
        idString: "cz600",
        name: "CZ-600",
        itemType: ItemType.Gun,
        ammoType: "556mm",
        ammoSpawnAmount: 20,
        capacity: 5,
        reloadTime: 2.2,
        fireDelay: 600,
        switchDelay: 600,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.6,
        recoilDuration: 750,
        fireMode: FireMode.Single,
        shotSpread: 0.75,
        moveSpread: 1.25,
        length: 8.3,
        shootOnRelease: true,
        fists: {
            left: Vec.create(115, -4),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(95, 3.5) },
        casingParticles: [{
            position: Vec.create(5, 0.4),
            ejectionDelay: 250
        }],
        ballistics: {
            damage: 55,
            obstacleMultiplier: 1,
            speed: 0.3,
            range: 250,
            tracer: {
                width: 1.3,
                length: 2.4
            }
        }
    },
    {
        idString: "barrett",
        name: "Barrett M95",
        itemType: ItemType.Gun,
        ammoType: "127mm",
        ammoSpawnAmount: 20,
        capacity: 5,
        reloadTime: 3.4,
        fireDelay: 1400,
        switchDelay: 900,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.3,
        recoilDuration: 1500,
        fireMode: FireMode.Single,
        shotSpread: 0.5,
        moveSpread: 4,
        length: 9.2,
        shootOnRelease: true,
        fists: {
            left: Vec.create(115, -4),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 4) },
        casingParticles: [{
            position: Vec.create(2, 0.6),
            ejectionDelay: 700
        }],
        ballistics: {
            damage: 129,
            obstacleMultiplier: 1,
            speed: 0.45,
            range: 300,
            tracer: {
                width: 2.5,
                length: 4
            }
        }
    },
    {
        idString: "m1895",
        name: "M1895",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 28,
        fireDelay: 375,
        switchDelay: 250,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 135,
        fireMode: FireMode.Single,
        shotSpread: 2,
        moveSpread: 5,
        length: 5.1,
        fists: {
            left: Vec.create(40, 0),
            right: Vec.create(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(70, 0) },
        casingParticles: [{
            frame: "casing_762x38mmR",
            position: Vec.create(3.5, 0.5),
            count: 7,
            velocity: {
                x: {
                    min: -8,
                    max: -2
                },
                y: {
                    min: 2,
                    max: 9,
                    randomSign: true
                }
            },
            on: "reload"
        }],
        capacity: 7,
        reloadTime: 2.1,
        ballistics: {
            damage: 24.5,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        },
        dual: {
            leftRightOffset: 1.3,
            fireDelay: 187.5,
            shotSpread: 3,
            moveSpread: 6,
            capacity: 14,
            reloadTime: 4
        }
    },
    {
        idString: "g19",
        name: "G19",
        itemType: ItemType.Gun,
        ammoType: "9mm",
        ammoSpawnAmount: 60,
        fireDelay: 110,
        switchDelay: 250,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.8,
        recoilDuration: 90,
        fireMode: FireMode.Single,
        shotSpread: 7,
        moveSpread: 14,
        length: 4.7,
        fists: {
            left: Vec.create(40, 0),
            right: Vec.create(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(65, 0) },
        casingParticles: [{
            position: Vec.create(3.5, 0.5),
            velocity: {
                y: {
                    min: 2,
                    max: 18
                }
            }
        }],
        capacity: 15,
        reloadTime: 1.5,
        ballistics: {
            damage: 11.75,
            obstacleMultiplier: 1,
            speed: 0.14,
            range: 120
        },
        dual: {
            leftRightOffset: 1.3,
            fireDelay: 75,
            shotSpread: 10,
            moveSpread: 18,
            capacity: 30,
            reloadTime: 2.9
        }
    },
    {
        idString: "radio",
        name: "Radio",
        itemType: ItemType.Gun,
        summonAirdrop: true,
        ammoType: "curadell",
        ammoSpawnAmount: 1,
        fireDelay: 500,
        switchDelay: 250,
        speedMultiplier: 0.92,
        recoilMultiplier: 1,
        recoilDuration: 0,
        fireMode: FireMode.Single,
        shotSpread: 7,
        moveSpread: 14,
        length: 4.7,
        fists: {
            left: Vec.create(38, -35),
            right: Vec.create(38, 35),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(65, 35) },
        casingParticles: [{
            position: Vec.create(3.5, 1),
            ejectionDelay: 500
        }],
        noMuzzleFlash: true,
        capacity: 1,
        reloadTime: 1.4,
        ballistics: {
            tracer: {
                image: "radio_wave",
                opacity: 0.8,
                particle: true,
                zIndex: ZIndexes.BuildingsCeiling
            },
            damage: 0,
            obstacleMultiplier: 1,
            speed: 0.01,
            range: 50,
            noCollision: true
        }
    },
    {
        idString: "cz75a",
        name: "CZ-75A",
        itemType: ItemType.Gun,
        ammoType: "9mm",
        ammoSpawnAmount: 64,
        fireDelay: 60,
        switchDelay: 250,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.8,
        recoilDuration: 90,
        fireMode: FireMode.Auto,
        shotSpread: 12,
        moveSpread: 19,
        length: 5.1,
        fists: {
            left: Vec.create(40, 0),
            right: Vec.create(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(70, -1) },
        casingParticles: [{
            position: Vec.create(3.5, 0.5),
            velocity: {
                y: {
                    min: 2,
                    max: 18
                }
            }
        }],
        capacity: 16,
        reloadTime: 1.9,
        ballistics: {
            damage: 9,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 85
        },
        dual: {
            leftRightOffset: 1.3,
            fireDelay: 30,
            shotSpread: 17,
            moveSpread: 35,
            capacity: 32,
            reloadTime: 3.7
        }
    },
    {
        idString: "saf_200",
        name: "SAF-200",
        itemType: ItemType.Gun,
        ammoType: "9mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        reloadTime: 1.8,
        fireDelay: 75,
        burstProperties: {
            shotsPerBurst: 3,
            burstCooldown: 325
        },
        switchDelay: 300,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 300,
        fireMode: FireMode.Burst,
        shotSpread: 3,
        moveSpread: 4,
        length: 5.9,
        fists: {
            left: Vec.create(95, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(71, 0) },
        casingParticles: [{
            position: Vec.create(4, 0.5)
        }],
        ballistics: {
            damage: 15.5,
            obstacleMultiplier: 1,
            speed: 0.25,
            range: 130
        }
    },
    {
        idString: "m16a4",
        name: "M16A4",
        itemType: ItemType.Gun,
        ammoType: "556mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        reloadTime: 2.2,
        fireDelay: 75,
        burstProperties: {
            shotsPerBurst: 3,
            burstCooldown: 325
        },
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 350,
        fireMode: FireMode.Burst,
        shotSpread: 1,
        moveSpread: 2.5,
        length: 8.6,
        fists: {
            left: Vec.create(120, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(100, 0) },
        casingParticles: [{
            position: Vec.create(4, 0.5)
        }],
        ballistics: {
            damage: 21,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 180
        }
    },
    {
        idString: "micro_uzi",
        name: "Micro Uzi",
        itemType: ItemType.Gun,
        ammoType: "9mm",
        ammoSpawnAmount: 96,
        capacity: 32,
        reloadTime: 1.75,
        fireDelay: 40,
        switchDelay: 300,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 60,
        fireMode: FireMode.Auto,
        shotSpread: 9,
        moveSpread: 19,
        length: 5.8,
        fists: {
            left: Vec.create(85, -6),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        casingParticles: [{
            position: Vec.create(3.5, 0.6)
        }],
        image: { position: Vec.create(80, 0) },
        ballistics: {
            damage: 7.75,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 85
        }
    },
    {
        idString: "vector",
        name: "Vector",
        itemType: ItemType.Gun,
        ammoType: "45acp",
        ammoSpawnAmount: 99,
        capacity: 33,
        reloadTime: 1.7,
        fireDelay: 35,
        switchDelay: 300,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 60,
        fireMode: FireMode.Auto,
        shotSpread: 2,
        moveSpread: 7,
        length: 7.1,
        fists: {
            left: Vec.create(85, -6),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        casingParticles: [{
            position: Vec.create(4.7, 0.3)
        }],
        image: { position: Vec.create(80, 0) },
        ballistics: {
            damage: 6.75,
            obstacleMultiplier: 1,
            speed: 0.25,
            range: 85
        }
    },
    {
        idString: "pp19",
        name: "PP-19",
        itemType: ItemType.Gun,
        ammoType: "9mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        reloadTime: 2.2,
        fireDelay: 40,
        switchDelay: 300,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 150,
        fireMode: FireMode.Auto,
        shotSpread: 3,
        moveSpread: 6.75,
        length: 6.9, // nice
        noMuzzleFlash: true,
        fists: {
            left: Vec.create(88, -5),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        casingParticles: [{
            position: Vec.create(3.5, 0.5)
        }],
        image: { position: Vec.create(80, 0) },
        ballistics: {
            damage: 15.5,
            obstacleMultiplier: 1,
            speed: 0.25,
            range: 160,
            tracer: {
                opacity: 0.15
            }
        }
    },
    {
        idString: "mp40",
        name: "MP40",
        itemType: ItemType.Gun,
        ammoType: "9mm",
        ammoSpawnAmount: 96,
        capacity: 32,
        reloadTime: 2.1,
        fireDelay: 90,
        switchDelay: 300,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 150,
        fireMode: FireMode.Auto,
        shotSpread: 2,
        moveSpread: 4,
        length: 6.55,
        fists: {
            left: Vec.create(103, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(76, -3) },
        casingParticles: [{
            position: Vec.create(4, 0.6)
        }],
        ballistics: {
            damage: 11,
            obstacleMultiplier: 1,
            speed: 0.25,
            range: 130
        }
    },
    {
        idString: "mcx_spear",
        name: "MCX Spear",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 80,
        capacity: 20,
        reloadTime: 2.75,
        fireDelay: 87.5,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 130,
        fireMode: FireMode.Auto,
        shotSpread: 2,
        moveSpread: 4,
        length: 7.7,
        fists: {
            left: Vec.create(105, -6),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(80, 0) },
        casingParticles: [{
            position: Vec.create(5, 0.5)
        }],
        ballistics: {
            damage: 16,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 180,
            tracer: {
                length: 1.4
            }
        }
    },
    {
        idString: "lewis_gun",
        name: "Lewis Gun",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 94,
        capacity: 47,
        reloadTime: 3.4,
        fireDelay: 120,
        switchDelay: 400,
        speedMultiplier: 0.8,
        recoilMultiplier: 0.65,
        recoilDuration: 200,
        fireMode: FireMode.Auto,
        shotSpread: 2,
        moveSpread: 9,
        length: 11.8,
        fists: {
            left: Vec.create(140, -10),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(120, 0) },
        casingParticles: [{
            frame: "casing_30-06",
            position: Vec.create(4.7, 1.6)
        }],
        ballistics: {
            damage: 16,
            obstacleMultiplier: 2.5,
            speed: 0.3,
            range: 180,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    {
        idString: "stoner_63",
        name: "Stoner 63",
        itemType: ItemType.Gun,
        ammoType: "556mm",
        ammoSpawnAmount: 150,
        capacity: 75,
        reloadTime: 3.8,
        fireDelay: 90,
        switchDelay: 400,
        speedMultiplier: 0.9,
        recoilMultiplier: 0.7,
        recoilDuration: 175,
        fireMode: FireMode.Auto,
        shotSpread: 3,
        moveSpread: 4.5,
        length: 7.7,
        fists: {
            left: Vec.create(105, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 0) },
        casingParticles: [
            {
                position: Vec.create(4, 0.6),
                velocity: {
                    y: {
                        min: -15,
                        max: -10
                    }
                }
            },
            {
                position: Vec.create(4.2, 0.6),
                frame: "m13_link",
                velocity: {
                    x: {
                        min: -6,
                        max: 8
                    },
                    y: {
                        min: -25,
                        max: -10
                    }
                }
            }
        ] as NonNullable<SingleGunNarrowing["casingParticles"]>,
        ballistics: {
            damage: 14.25,
            obstacleMultiplier: 2,
            speed: 0.28,
            range: 180,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    {
        idString: "m1_garand",
        name: "M1 Garand",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 40,
        capacity: 8,
        reloadTime: 2.1,
        fireDelay: 200,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.75,
        recoilDuration: 200,
        fireMode: FireMode.Single,
        firstShotAccuracy: true,
        shotSpread: 1,
        moveSpread: 3.5,
        length: 8.1,
        fists: {
            left: Vec.create(110, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(87, 1) },
        casingParticles: [
            {
                frame: "casing_30-06",
                position: Vec.create(4, 0.6),
                velocity: {
                    y: {
                        min: 4,
                        max: 15
                    }
                }
            },
            {
                frame: "enbloc",
                position: Vec.create(4, 0.6),
                velocity: {
                    x: {
                        min: 1,
                        max: 3,
                        randomSign: true
                    },
                    y: {
                        min: 2,
                        max: 5,
                        randomSign: true
                    }
                },
                on: "reload"
            }
        ] as NonNullable<SingleGunNarrowing["casingParticles"]>,
        ballistics: {
            damage: 39,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 230,
            tracer: {
                length: 2
            },
            lastShotFX: true
        }
    },
    {
        idString: "vss",
        name: "VSS",
        itemType: ItemType.Gun,
        ammoType: "9mm",
        ammoSpawnAmount: 60,
        capacity: 20,
        reloadTime: 2.15,
        fireDelay: 140,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.7,
        recoilDuration: 140,
        fireMode: FireMode.Single,
        shotSpread: 2,
        moveSpread: 3.5,
        length: 6.9,
        fists: {
            left: Vec.create(110, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(80, 0) },
        casingParticles: [{
            frame: "casing_9x39mm",
            position: Vec.create(4, 0.5)
        }],
        noMuzzleFlash: true,
        ballistics: {
            damage: 22,
            obstacleMultiplier: 1.5,
            speed: 0.22,
            range: 160,
            tracer: {
                opacity: 0.5,
                length: 1.5
            }
        }
    },
    {
        idString: "sr25",
        name: "SR-25",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 80,
        capacity: 20,
        reloadTime: 2.5,
        fireDelay: 190,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.7,
        recoilDuration: 190,
        fireMode: FireMode.Single,
        shotSpread: 1,
        moveSpread: 3.5,
        length: 7.2,
        fists: {
            left: Vec.create(110, 0),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(80, 0) },
        casingParticles: [{
            position: Vec.create(4.2, 0.4)
        }],
        ballistics: {
            damage: 28.5,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 230,
            tracer: {
                length: 1.5
            }
        }
    },
    {
        idString: "mini14",
        name: "Mini-14",
        itemType: ItemType.Gun,
        ammoType: "556mm",
        ammoSpawnAmount: 80,
        capacity: 20,
        reloadTime: 2.4,
        fireDelay: 155,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.8,
        recoilDuration: 155,
        fireMode: FireMode.Single,
        shotSpread: 2,
        moveSpread: 5,
        length: 7.4,
        fists: {
            left: Vec.create(96, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(85, 0) },
        casingParticles: [{
            position: Vec.create(5, 0.5),
            velocity: {
                y: {
                    min: 4,
                    max: 15
                }
            }
        }],
        ballistics: {
            damage: 25.5,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 230,
            tracer: {
                length: 1.5
            }
        }
    },
    {
        idString: "model_89",
        name: "Model 89",
        itemType: ItemType.Gun,
        ammoType: "127mm",
        ammoSpawnAmount: 28,
        capacity: 7,
        reloadTime: 0.6,
        singleReload: true,
        fireDelay: 300,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.7,
        recoilDuration: 300,
        fireMode: FireMode.Single,
        shotSpread: 1,
        moveSpread: 4,
        length: 7.6,
        fists: {
            left: Vec.create(106, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 0) },
        casingParticles: [{
            frame: "casing_500sw",
            position: Vec.create(5, 0.5),
            ejectionDelay: 175
        }],
        ballistics: {
            damage: 60,
            obstacleMultiplier: 1,
            speed: 0.3,
            range: 250,
            tracer: {
                width: 1.8,
                length: 1.5
            }
        }
    },

    // only event weapons below this point

    {
        idString: "usas12",
        name: "USAS-12",
        itemType: ItemType.Gun,
        ammoType: "12g",
        ammoSpawnAmount: 30,
        capacity: 10,
        reloadTime: 3,
        fireDelay: 525,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.7,
        recoilDuration: 525,
        fireMode: FireMode.Auto,
        shotSpread: 5,
        moveSpread: 14,
        length: 7.7,
        fists: {
            left: Vec.create(115, -1),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, -3.5) },
        casingParticles: [{
            frame: "casing_12ga_he",
            position: Vec.create(4, 0.6)
        }],
        ballistics: {
            damage: 8,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 55,
            onHitExplosion: "usas_explosion",
            allowRangeOverride: true,
            tracer: {
                length: 0.5,
                color: 0xff0000
            }
        }
    },
    {
        idString: "s_g17",
        name: "G17 (scoped)",
        itemType: ItemType.Gun,
        ammoType: "bb",
        fireDelay: 35,
        switchDelay: 250,
        speedMultiplier: 1.5,
        recoilMultiplier: 0.99,
        recoilDuration: 10,
        fireMode: FireMode.Auto,
        shotSpread: 0.5,
        moveSpread: 5,
        length: 6.2,
        fists: {
            left: Vec.create(40, 0),
            right: Vec.create(40, 0),
            leftZIndex: 3,
            rightZIndex: 3,
            animationDuration: 80
        },
        noMuzzleFlash: true,
        image: { position: Vec.create(65, 0) },
        capacity: 100,
        reloadTime: 1.5,
        ballistics: {
            damage: 2,
            obstacleMultiplier: 0.5,
            speed: 0.1,
            range: 70,
            tracer: {
                width: 0.7,
                opacity: 0.85,
                color: 0xFF8000
            }
        }/* ,
        dual: {
            leftRightOffset: 1.3,
            capacity: 200,
            fireDelay: 20,
            shotSpread: 1,
            moveSpread: 8,
            reloadTime: 2.8
        } */
        // justice for dual s_g17 when™
    },

    // only dev weapons below this point

    {
        idString: "deathray",
        name: "Death Ray",
        itemType: ItemType.Gun,
        ammoType: "power_cell",
        capacity: 1,
        reloadTime: 1.4,
        fireDelay: 40,
        switchDelay: 500,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.8,
        recoilDuration: 100,
        fireMode: FireMode.Auto,
        shotSpread: 0.15,
        moveSpread: 0.1,
        killstreak: true,
        length: 8.7,
        fists: {
            left: Vec.create(135, -6),
            right: Vec.create(75, 0),
            animationDuration: 100
        },
        image: { position: Vec.create(90, 0) },
        noMuzzleFlash: true,
        casingParticles: [{
            position: Vec.create(4.5, 0.6),
            on: "reload"
        }],
        ballistics: {
            damage: 800,
            obstacleMultiplier: 2,
            speed: 4,
            range: 400,
            penetration: {
                players: true,
                obstacles: true
            },
            tracer: {
                image: "power_cell_trail",
                length: 10
            }
        }
    },
    {
        idString: "revitalizer",
        name: "Revitalizer",
        itemType: ItemType.Gun,
        ammoType: "12g",
        ammoSpawnAmount: 15,
        capacity: 5,
        reloadTime: 0.75,
        fireDelay: 925,
        switchDelay: 925,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.5,
        recoilDuration: 550,
        fireMode: FireMode.Single,
        shotSpread: 11,
        moveSpread: 14,
        killstreak: true,
        consistentPatterning: true,
        bulletCount: 10,
        length: 7.5,
        fists: {
            left: Vec.create(120, -2),
            right: Vec.create(45, 0),
            animationDuration: 100,
            rightZIndex: 4
        },
        image: { position: Vec.create(80, 0) },
        casingParticles: [{
            position: Vec.create(4, 0.6),
            ejectionDelay: 450,
            velocity: {
                y: {
                    min: 2,
                    max: 5,
                    randomSign: true
                }
            }
        }],
        singleReload: true,
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 48,
            tracer: {
                length: 0.7
            }
        },
        wearerAttributes: {
            passive: {
                maxHealth: 0.51,
                maxAdrenaline: 0.8
            },
            on: {
                kill: [
                    {
                        limit: 5,
                        maxHealth: 1.488,
                        maxAdrenaline: 1.201,
                        minAdrenaline: 20,
                        speedBoost: 1.02
                    },
                    {
                        healthRestored: 230,
                        adrenalineRestored: 30
                    }
                ],
                damageDealt: [
                    {
                        healthRestored: 2,
                        adrenalineRestored: 1.5
                    }
                ]
            }
        }
    },

    // OG weapons

    {
        idString: "pkp",
        name: "PKP Pecheneg",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 200,
        capacity: 200,
        reloadTime: 5,
        switchDelay: 750,
        fireDelay: 100,
        ballistics: {
            damage: 19,
            obstacleMultiplier: 2,
            range: 200 * 2.25,
            speed: 0.27
        },
        fireMode: FireMode.Auto,
        fists: {
            left: Vec.create(130, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: {
            position: Vec.create(110, 0)
        },
        shotSpread: 2.5,
        moveSpread: 10,
        length: 8.9,
        recoilDuration: 175,
        recoilMultiplier: 0.7,
        speedMultiplier: 0.9
    },

    {
        idString: "bar",
        name: "BAR M1918",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 80,
        capacity: 20,
        reloadTime: 2.7,
        switchDelay: 750,
        fireDelay: 120,
        ballistics: {
            damage: 18,
            obstacleMultiplier: 2,
            range: 275 * 2.25,
            speed: 0.2565
        },
        fireMode: FireMode.Auto,
        fists: {
            left: Vec.create(105, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: {
            position: Vec.create(100, 0)
        },
        shotSpread: 2,
        moveSpread: 10,
        length: 8.5,
        recoilDuration: 175,
        recoilMultiplier: 0.7,
        speedMultiplier: 0.9
    },

    {
        idString: "m249",
        name: "M249",
        itemType: ItemType.Gun,
        ammoType: "556mm",
        ammoSpawnAmount: 200,
        capacity: 100,
        reloadTime: 6.7,
        switchDelay: 750,
        fireDelay: 80,
        ballistics: {
            damage: 15,
            obstacleMultiplier: 2,
            range: 220 * 2.25,
            speed: 0.28125
        },
        fireMode: FireMode.Auto,
        fists: {
            left: Vec.create(105, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: {
            position: Vec.create(100, 0)
        },
        shotSpread: 1.5,
        moveSpread: 7.5,
        length: 8.5,
        recoilDuration: 175,
        recoilMultiplier: 0.7,
        speedMultiplier: 0.9
    },
    {
        idString: "deagle",
        name: "Desert Eagle",
        itemType: ItemType.Gun,
        ammoType: "50ae",
        ammoSpawnAmount: 56,
        fireDelay: 160,
        switchDelay: 300,
        speedMultiplier: 0.90,
        recoilMultiplier: 0.72,
        recoilDuration: 500,
        fireMode: FireMode.Single,
        firstShotAccuracy: true,
        shotSpread: 2.5,
        moveSpread: 8.5,
        length: 5.1,
        fists: {
            left: Vec.create(40, 0),
            right: Vec.create(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(70, 0) },
        // no casing particles yet
        capacity: 7,
        reloadTime: 2.3,
        ballistics: {
            damage: 35,
            obstacleMultiplier: 1.6,
            speed: 0.28,
            range: 120
        },
        dual: {
            leftRightOffset: 1.3,
            fireDelay: 187.5,
            shotSpread: 2.8,
            moveSpread: 8.8,
            capacity: 14,
            reloadTime: 5
        }
    },
    {
        idString: "m134",
        name: "M134",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 200,
        capacity: 200,
        reloadTime: 8,
        switchDelay: 900,
        fireDelay: 55,
        ballistics: {
            damage: 10.8,
            obstacleMultiplier: 5,
            range: 200 * 2.25,
            speed: 0.2925
        },
        fireMode: FireMode.Auto,
        fists: {
            left: Vec.create(105, 0),
            right: Vec.create(40, 3),
            rightZIndex: 4,
            leftZIndex: 4,
            animationDuration: 120
        },
        image: {
            position: Vec.create(120, 0)
        },
        shotSpread: 1,
        moveSpread: 2,
        length: 10.79,
        recoilDuration: 175,
        recoilMultiplier: 0.25,
        speedMultiplier: 0.75,
        casingParticles: [{
            position: Vec.create(5, 0.6),
            velocity: {
                y: {
                    min: 4,
                    max: 15
                }
            }
        }]
    },
    {
        idString: "sv98",
        name: "SV-98",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 30,
        capacity: 10,
        reloadTime: 2.7,
        fireDelay: 1500,
        switchDelay: 500,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.4,
        recoilDuration: 1000,
        fireMode: FireMode.Single,
        shotSpread: 1,
        moveSpread: 3.5,
        length: 8.9,
        shootOnRelease: true,
        fists: {
            left: Vec.create(106, -1),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 5) },
        casingParticles: [{
            position: Vec.create(4, 0.6),
            ejectionDelay: 450
        }],
        ballistics: {
            damage: 89,
            obstacleMultiplier: 1.5,
            speed: 0.4095,
            range: 1170,
            tracer: {
                width: 2.4,
                length: 2.25
            }
        }
    },
    {
        idString: "awms",
        name: "AWM-S",
        itemType: ItemType.Gun,
        ammoType: "127mm",
        ammoSpawnAmount: 20,
        capacity: 5,
        reloadTime: 3.5,
        fireDelay: 1500,
        switchDelay: 1000,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.3,
        recoilDuration: 1500,
        fireMode: FireMode.Auto,
        shotSpread: 0.5,
        moveSpread: 4.5,
        length: 10.2,
        shootOnRelease: true,
        fists: {
            left: Vec.create(115, -4),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(120, 5) },
        casingParticles: [{
            position: Vec.create(15, 0.6),
            ejectionDelay: 700
        }],
        ballistics: {
            damage: 185,
            obstacleMultiplier: 1.5,
            speed: 0.306,
            range: 675,
            tracer: {
                width: 2.3,
                length: 2.25
            }
        }
    },
    {
        idString: "super90",
        name: "Super 90",
        itemType: ItemType.Gun,
        ammoType: "12g",
        ammoSpawnAmount: 16,
        capacity: 8,
        reloadTime: 0.52,
        singleReload: true,
        fireDelay: 400,
        switchDelay: 750,
        speedMultiplier: 1,
        recoilMultiplier: 0.5,
        recoilDuration: 500,
        fireMode: FireMode.Single,
        firstShotAccuracy: true,
        shotSpread: 4,
        moveSpread: 8,
        length: 8.9,
        fists: {
            left: Vec.create(106, 0),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 5) },
        casingParticles: [{
            position: Vec.create(4, 0.6)
        }],
        ballistics: {
            damage: 80,
            obstacleMultiplier: 1,
            speed: 0.2655,
            range: 135,
            tracer: {
                width: 3,
                length: 0.7,
                color: 0xFEDCDC
            }
        }
    },
    {
        idString: "an94",
        name: "AN-94",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 90,
        capacity: 45,
        reloadTime: 2.35,
        fireDelay: 25,
        switchDelay: 750,
        speedMultiplier: 1,
        recoilMultiplier: 0.5,
        recoilDuration: 300,
        fireMode: FireMode.Burst,
        burstProperties: {
            shotsPerBurst: 2,
            burstCooldown: 240
        },
        shotSpread: 1.5,
        moveSpread: 5.5,
        length: 7.5,
        fists: {
            left: Vec.create(120, -2),
            right: Vec.create(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 2) },
        casingParticles: [{
            position: Vec.create(4, 0.6)
        }],
        ballistics: {
            damage: 19,
            obstacleMultiplier: 1,
            speed: 0.2475,
            range: 675
        }
    },

    // Ukraine Gun

    {
        idString: "fort_17",
        name: "Fort-17",
        itemType: ItemType.Gun,
        ammoType: "45acp",
        ammoSpawnAmount: 48,
        capacity: 12,
        reloadTime: 1.2,
        switchDelay: 250,
        fireDelay: 140,
        ballistics: {
            damage: 21,
            obstacleMultiplier: 1,
            range: 220 * 2.25,
            speed: 0.28125
        },
        fireMode: FireMode.Single,
        fists: {
            left: Vec.create(40, 0),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            leftZIndex: 4,
            animationDuration: 250
        },
        image: {
            position: Vec.create(65, 0)
        },
        shotSpread: 2,
        moveSpread: 6.5,
        length: 5.2,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.8,
        recoilDuration: 90,
        dual: {
            leftRightOffset: 1.3,
            fireDelay: 120,
            shotSpread: 8,
            moveSpread: 12,
            capacity: 24,
            reloadTime: 2.4
        }
    },

    // rejects
    {
        idString: "p90",
        name: "P90",
        itemType: ItemType.Gun,
        ammoType: "45acp",
        ammoSpawnAmount: 200,
        capacity: 100,
        reloadTime: 2.9,
        fireDelay: 50,
        switchDelay: 100,
        speedMultiplier: 1,
        recoilMultiplier: 0.6,
        recoilDuration: 100,
        fireMode: FireMode.Auto,
        shotSpread: 4,
        moveSpread: 10,
        length: 7.1,
        fists: {
            left: Vec.create(40, 0),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            leftZIndex: 4,
            animationDuration: 100
        },
        casingParticles: [{
            position: Vec.create(4.5, 0.6)
        }],
        image: { position: Vec.create(80, 0) },
        ballistics: {
            damage: 8,
            obstacleMultiplier: 1,
            speed: 0.20,
            range: 70
        }
        // dual: {
        //     leftRightOffset: 1,
        //     fireDelay: 25,
        //     capacity: 200,
        //     reloadTime: 5.8
        // }
    },
    {
        idString: "vickers",
        name: "Vickers No.2 Mk.1",
        itemType: ItemType.Gun,
        ammoType: "762mm",
        ammoSpawnAmount: 200,
        capacity: 100,
        reloadTime: 4.2,
        fireDelay: 75,
        switchDelay: 400,
        speedMultiplier: 0.9,
        recoilMultiplier: 0.65,
        recoilDuration: 175,
        fireMode: FireMode.Auto,
        shotSpread: 3,
        moveSpread: 5,
        length: 7,
        fists: {
            left: Vec.create(105, -3),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(80, 0) },
        casingParticles: [{
            position: Vec.create(4, 0.6)
        }],
        ballistics: {
            damage: 15.25,
            obstacleMultiplier: 2,
            speed: 0.3,
            range: 180,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },

    // .45 ACP

    {
        idString: "model_94",
        name: "Model 94",
        itemType: ItemType.Gun,
        ammoType: "45acp",
        ammoSpawnAmount: 64,
        capacity: 8,
        reloadTime: 0.5,
        singleReload: true,
        fireDelay: 700,
        switchDelay: 1000,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.70,
        recoilDuration: 450,
        fireMode: FireMode.Single,
        shotSpread: 1.5,
        moveSpread: 4.5,
        length: 8.7,
        shootOnRelease: true,
        fists: {
            left: Vec.create(113, 0),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(90, 0) },
        casingParticles: [{
            position: Vec.create(4, 0.6),
            ejectionDelay: 500
        }],
        ballistics: {
            damage: 49,
            obstacleMultiplier: 1.33,
            speed: 0.351,
            range: 394,
            tracer: {
                width: 1.2,
                length: 2.25,
                color: 0x8934eb
            }
        }
    },
    {
        idString: "tommy",
        name: "Tommy Gun",
        itemType: ItemType.Gun,
        ammoType: "45acp",
        ammoSpawnAmount: 100,
        capacity: 50,
        reloadTime: 3,
        fireDelay: 75,
        switchDelay: 350,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.7,
        recoilDuration: 170,
        fireMode: FireMode.Auto,
        shotSpread: 6,
        moveSpread: 10,
        length: 6.55,
        fists: {
            left: Vec.create(103, -2),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(76, -3) },
        casingParticles: [{
            position: Vec.create(4, 0.6)
        }],
        ballistics: {
            damage: 12.9,
            obstacleMultiplier: 1,
            speed: 0.25,
            range: 120
        }
    },
    {
        idString: "delisle",
        name: "De Lisle",
        itemType: ItemType.Gun,
        ammoType: "45acp",
        ammoSpawnAmount: 44,
        capacity: 11,
        reloadTime: 2.3,
        fireDelay: 700,
        switchDelay: 700,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.6,
        recoilDuration: 300,
        fireMode: FireMode.Single,
        shotSpread: 1.5,
        moveSpread: 2.5,
        length: 8.7,
        shootOnRelease: true,
        fists: {
            left: Vec.create(113, 0),
            right: Vec.create(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: Vec.create(85, 0) },
        casingParticles: [{
            position: Vec.create(4, 0.6),
            ejectionDelay: 300
        }],
        ballistics: {
            damage: 70,
            obstacleMultiplier: 1,
            speed: 0.21,
            range: 150,
            tracer: {
                opacity: 0.15,
                length: 2
            }
        },
        noMuzzleFlash: true
    }
];

export const Guns: GunDefinition[] = GunsRaw.map(e => {
    if (e.dual === undefined) {
        return [e];
    }

    const dualDef = mergeDeep(
        {},
        e,
        e.dual,
        {
            idString: `dual_${e.idString}`,
            name: `Dual ${e.name}`,
            isDual: true,
            singleVariant: e.idString
        }
    ) as GunDefinition & { readonly dual?: object, readonly isDual: true };
    // @ts-expect-error init code
    delete dualDef.dual;
    // @ts-expect-error init code
    delete dualDef.fists;
    // @ts-expect-error init code
    delete dualDef.image;
    // @ts-expect-error init code
    delete dualDef.casingParticles;
    // @ts-expect-error init code
    delete e.dual;
    // @ts-expect-error init code
    e.dualVariant = dualDef.idString;

    return [e, dualDef];
}).flat();
