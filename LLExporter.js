/*jshint esversion: 6 */
ll.registerPlugin("LLExporter");

const server = new HttpServer();

server.onGet("/metrics", (req, res) => {
    for (const metric of getMetrics()) {
        res.write(metric.toString());
        res.write("\n");
    }
});

function getMetrics() {
    const metrics = [];
    metrics.push(metrics_players_online_count());
    metrics.push(metrics_players_online_op_count());
    metrics.push(...metrics_players_device());
    metrics.push(...metrics_entities_count());
    metrics.push(...metrics_performance());
    return metrics;
}


class Label {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}


class Metrics {
    constructor(name, value, labels) {
        this.name = name;
        this.value = value;
        this.labels = labels;
    }

    toString() {
        let str = "bds_" + this.name;
        if (this.labels.length > 0) {
            str += "{";
            for (const label of this.labels) {
                str += label.name + "=\"" + label.value + "\",";
            }
            str = str.substring(0, str.length - 1);
            str += "}";
        }
        if (typeof this.value === "number") {
            str += " " + this.value;
        } else {
            str += " \"" + this.value + "\"";
        }
        return str;
    }

}

//// Metrics

// Players
function metrics_players_online_count() {
    const players = mc.getOnlinePlayers();
    return new Metrics("players_online_count", players.length, [new Label("permission", "all")]);
}

function metrics_players_online_op_count() {
    const players = mc.getOnlinePlayers();
    let count = 0;
    for (const player of players) {
        if (player.isOP()) {
            count++;
        }
    }
    return new Metrics("players_online_count", count, [new Label("permission", "op")]);
}

function metrics_players_device() {
    const players = mc.getOnlinePlayers();
    const android = new Metrics("players_device", 0, [new Label("device", "android")]);
    const ios = new Metrics("players_device", 0, [new Label("device", "ios")]);
    const osx = new Metrics("players_device", 0, [new Label("device", "osx")]);
    const amazon = new Metrics("players_device", 0, [new Label("device", "amazon")]);
    const gearvr = new Metrics("players_device", 0, [new Label("device", "gearvr")]);
    const hololens = new Metrics("players_device", 0, [new Label("device", "hololens")]);
    const win10 = new Metrics("players_device", 0, [new Label("device", "win10")]);
    const win32 = new Metrics("players_device", 0, [new Label("device", "win32")]);
    const tvos = new Metrics("players_device", 0, [new Label("device", "tvos")]);
    const playstation = new Metrics("players_device", 0, [new Label("device", "playstation")]);
    const nintendo = new Metrics("players_device", 0, [new Label("device", "nintendo")]);
    const xbox = new Metrics("players_device", 0, [new Label("device", "xbox")]);
    const windowsphone = new Metrics("players_device", 0, [new Label("device", "windowsphone")]);
    const unknown = new Metrics("players_device", 0, [new Label("device", "unknown")]);
    for (const player of players) {
        switch (player.getDevice().os) {
            case "Android":
                android.value++;
                break;
            case "iOS":
                ios.value++;
                break;
            case "OSX":
                osx.value++;
                break;
            case "Amazon":
                amazon.value++;
                break;
            case "GearVR":
                gearvr.value++;
                break;
            case "Hololens":
                hololens.value++;
                break;
            case "Win10":
                win10.value++;
                break;
            case "Win32":
                win32.value++;
                break;
            case "TVOS":
                tvos.value++;
                break;
            case "PlayStation":
                playstation.value++;
                break;
            case "Nintendo":
                nintendo.value++;
                break;
            case "Xbox":
                xbox.value++;
                break;
            case "WindowsPhone":
                windowsphone.value++;
                break;
            default:
                unknown.value++;
        }
    }
    return [android, ios, osx, amazon, gearvr, hololens, win10, win32, tvos, playstation, nintendo, xbox, windowsphone, unknown];
}

// Entities
function metrics_entities_count() {
    const entities = mc.getAllEntities();

    const data = {
        all: {
            all: entities.length,
        },
        player: {
            all: 0,
        },
        item: {
            all: 0,
        },

        can_fly: {
            all: 0,
        },
        can_freeze: {
            all: 0,
        },
        can_see_daylight: {
            all: 0,
        },
        can_pickup_items: {
            all: 0,
        },

        in_air: {
            all: 0,
        },
        in_water: {
            all: 0,
        },
        in_lava: {
            all: 0,
        },
        in_rain: {
            all: 0,
        },
        in_snow: {
            all: 0,
        },
        in_wall: {
            all: 0,
        },
        in_water_or_rain: {
            all: 0,
        },
        in_world: {
            all: 0,
        },

        is_invisible: {
            all: 0,
        },
        is_inside_portal: {
            all: 0,
        },
        is_trusting: {
            all: 0,
        },
        is_touching_damage_block: {
            all: 0,
        },
        is_on_fire: {
            all: 0,
        },
        is_on_ground: {
            all: 0,
        },
        is_on_hot_block: {
            all: 0,
        },
        is_trading: {
            all: 0,
        },
        is_riding: {
            all: 0,
        },
        is_dancing: {
            all: 0,
        },
        is_sleeping: {
            all: 0,
        },
        is_angry: {
            all: 0,
        },
        is_baby: {
            all: 0,
        },
        is_moving: {
            all: 0,
        },
    };

    for (const entity of entities) {

        if (data.all.hasOwnProperty(entity.type)) {
            data.all[entity.type]++;
        } else {
            data.all[entity.type]=1;
        }

        if (entity.isPlayer()) {
            data.player.all++;
            if (data.player.hasOwnProperty(entity.type)) {
                data.player[entity.type]++;
            } else {
                data.player[entity.type]=1;
            }
        }
        if (entity.isItemEntity()) {
            data.item.all++;
            if (data.item.hasOwnProperty(entity.type)) {
                data.item[entity.type]++;
            } else {
                data.item[entity.type]=1;
            }
        }
        if (entity.canFly) {
            data.can_fly.all++;
            if (data.can_fly.hasOwnProperty(entity.type)) {
                data.can_fly[entity.type]++;
            } else {
                data.can_fly[entity.type]=1;
            }
        }
        if (entity.canFreeze) {
            data.can_freeze.all++;
            if (data.can_freeze.hasOwnProperty(entity.type)) {
                data.can_freeze[entity.type]++;
            } else {
                data.can_freeze[entity.type]=1;
            }
        }
        if (entity.canSeeDaylight) {
            data.can_see_daylight.all++;
            if (data.can_see_daylight.hasOwnProperty(entity.type)) {
                data.can_see_daylight[entity.type]++;
            } else {
                data.can_see_daylight[entity.type]=1;
            }
        }
        if (entity.canPickupItems) {
            data.can_pickup_items.all++;
            if (data.can_pickup_items.hasOwnProperty(entity.type)) {
                data.can_pickup_items[entity.type]++;
            } else {
                data.can_pickup_items[entity.type]=1;
            }
        }
        if (entity.inAir) {
            data.in_air.all++;
            if (data.in_air.hasOwnProperty(entity.type)) {
                data.in_air[entity.type]++;
            } else {
                data.in_air[entity.type]=1;
            }
        }
        if (entity.inWater) {
            data.in_water.all++;
            if (data.in_water.hasOwnProperty(entity.type)) {
                data.in_water[entity.type]++;
            } else {
                data.in_water[entity.type]=1;
            }
        }
        if (entity.inLava) {
            data.in_lava.all++;
            if (data.in_lava.hasOwnProperty(entity.type)) {
                data.in_lava[entity.type]++;
            } else {
                data.in_lava[entity.type]=1;
            }
        }
        if (entity.inRain) {
            data.in_rain.all++;
            if (data.in_rain.hasOwnProperty(entity.type)) {
                data.in_rain[entity.type]++;
            } else {
                data.in_rain[entity.type]=1;
            }
        }
        if (entity.inSnow) {
            data.in_snow.all++;
            if (data.in_snow.hasOwnProperty(entity.type)) {
                data.in_snow[entity.type]++;
            } else {
                data.in_snow[entity.type]=1;
            }
        }
        if (entity.inWall) {
            data.in_wall.all++;
            if (data.in_wall.hasOwnProperty(entity.type)) {
                data.in_wall[entity.type]++;
            } else {
                data.in_wall[entity.type]=1;
            }
        }
        if (entity.inWaterOrRain) {
            data.in_water_or_rain.all++;
            if (data.in_water_or_rain.hasOwnProperty(entity.type)) {
                data.in_water_or_rain[entity.type]++;
            } else {
                data.in_water_or_rain[entity.type]=1;
            }
        }
        if (entity.inWorld) {
            data.in_world.all++;
            if (data.in_world.hasOwnProperty(entity.type)) {
                data.in_world[entity.type]++;
            } else {
                data.in_world[entity.type]=1;
            }
        }
        if (entity.isInvisible) {
            data.is_invisible.all++;
            if (data.is_invisible.hasOwnProperty(entity.type)) {
                data.is_invisible[entity.type]++;
            } else {
                data.is_invisible[entity.type]=1;
            }
        }
        if (entity.isInsidePortal) {
            data.is_inside_portal.all++;
            if (data.is_inside_portal.hasOwnProperty(entity.type)) {
                data.is_inside_portal[entity.type]++;
            } else {
                data.is_inside_portal[entity.type]=1;
            }
        }
        if (entity.isTrusting) {
            data.is_trusting.all++;
            if (data.is_trusting.hasOwnProperty(entity.type)) {
                data.is_trusting[entity.type]++;
            } else {
                data.is_trusting[entity.type]=1;
            }
        }
        if (entity.isTouchingDamageBlock) {
            data.is_touching_damage_block.all++;
            if (data.is_touching_damage_block.hasOwnProperty(entity.type)) {
                data.is_touching_damage_block[entity.type]++;
            } else {
                data.is_touching_damage_block[entity.type]=1;
            }
        }
        if (entity.isOnFire) {
            data.is_on_fire.all++;
            if (data.is_on_fire.hasOwnProperty(entity.type)) {
                data.is_on_fire[entity.type]++;
            } else {
                data.is_on_fire[entity.type]=1;
            }
        }
        if (entity.isOnGround) {
            data.is_on_ground.all++;
            if (data.is_on_ground.hasOwnProperty(entity.type)) {
                data.is_on_ground[entity.type]++;
            } else {
                data.is_on_ground[entity.type]=1;
            }
        }
        if (entity.isOnHotBlock) {
            data.is_on_hot_block.all++;
            if (data.is_on_hot_block.hasOwnProperty(entity.type)) {
                data.is_on_hot_block[entity.type]++;
            } else {
                data.is_on_hot_block[entity.type]=1;
            }
        }
        if (entity.isTrading) {
            data.is_trading.all++;
            if (data.is_trading.hasOwnProperty(entity.type)) {
                data.is_trading[entity.type]++;
            } else {
                data.is_trading[entity.type]=1;
            }
        }
        if (entity.isRiding) {
            data.is_riding.all++;
            if (data.is_riding.hasOwnProperty(entity.type)) {
                data.is_riding[entity.type]++;
            } else {
                data.is_riding[entity.type]=1;
            }
        }
        if (entity.isDancing) {
            data.is_dancing.all++;
            if (data.is_dancing.hasOwnProperty(entity.type)) {
                data.is_dancing[entity.type]++;
            } else {
                data.is_dancing[entity.type]=1;
            }
        }
        if (entity.isSleeping) {
            data.is_sleeping.all++;
            if (data.is_sleeping.hasOwnProperty(entity.type)) {
                data.is_sleeping[entity.type]++;
            } else {
                data.is_sleeping[entity.type]=1;
            }
        }
        if (entity.isAngry) {
            data.is_angry.all++;
            if (data.is_angry.hasOwnProperty(entity.type)) {
                data.is_angry[entity.type]++;
            } else {
                data.is_angry[entity.type]=1;
            }
        }
        if (entity.isBaby) {
            data.is_baby.all++;
            if (data.is_baby.hasOwnProperty(entity.type)) {
                data.is_baby[entity.type]++;
            } else {
                data.is_baby[entity.type]=1;
            }
        }
        if (entity.isMoving) {
            data.is_moving.all++;
            if (data.is_moving.hasOwnProperty(entity.type)) {
                data.is_moving[entity.type]++;
            } else {
                data.is_moving[entity.type]=1;
            }
        }

    }

    const to_return = [];
    for (const [filter, value] of Object.entries(data)) {
        for (const [type, value2] of Object.entries(value)) {
            to_return.push(
                new Metrics(
                    "entities_count",
                    value2,
                    [
                        new Label("filter", filter),
                        new Label("type", type),
                    ]
                )
            );
        }
    }

    return to_return;
}

// Performance

function metrics_performance() {
    const [mspt, tps] = get_mspt_from_trapdoor();
    const mspt_metric = new Metrics("mspt", mspt, []);
    const tps_metric = new Metrics("tps", tps, []);
    return [mspt_metric, tps_metric];
}

//// Metrics End


//// Utils

function get_mspt_from_trapdoor() {
    const result = mc.runcmdEx("log mspt");
    if (result.success) {
        const reg = new RegExp("§.");
        const opt = result.output.replace(reg, "").split("\n")[0].split(":")[1];
        const nums = opt.split("/");
        const mspt = parseFloat(nums[0]);
        const tps = parseFloat(nums[1]);
        return [mspt, tps];
    }
    return [NaN, NaN];
}

//// Utils End

server.startAt("127.0.0.1", 9999);