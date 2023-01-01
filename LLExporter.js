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

// Metrics

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

    const all = new Metrics("entities_count", entities.length, [new Label("filter", "all")]);
    const player = new Metrics("entities_count", 0, [new Label("filter", "player")]);
    const item = new Metrics("entities_count", 0, [new Label("filter", "item")]);

    const can_fly = new Metrics("entities_count", 0, [new Label("filter", "can_fly")]);
    const can_freeze = new Metrics("entities_count", 0, [new Label("filter", "can_freeze")]);
    const can_see_daylight = new Metrics("entities_count", 0, [new Label("filter", "can_see_daylight")]);
    const can_pickup_items = new Metrics("entities_count", 0, [new Label("filter", "can_pickup_items")]);

    const in_air = new Metrics("entities_count", 0, [new Label("filter", "in_air")]);
    const in_water = new Metrics("entities_count", 0, [new Label("filter", "in_water")]);
    const in_lava = new Metrics("entities_count", 0, [new Label("filter", "in_lava")]);
    const in_rain = new Metrics("entities_count", 0, [new Label("filter", "in_rain")]);
    const in_snow = new Metrics("entities_count", 0, [new Label("filter", "in_snow")]);
    const in_wall = new Metrics("entities_count", 0, [new Label("filter", "in_wall")]);
    const in_water_or_rain = new Metrics("entities_count", 0, [new Label("filter", "in_water_or_rain")]);
    const in_world = new Metrics("entities_count", 0, [new Label("filter", "in_world")]);
    const is_invisible = new Metrics("entities_count", 0, [new Label("filter", "is_invisible")]);
    const is_inside_portal = new Metrics("entities_count", 0, [new Label("filter", "is_inside_portal")]);
    const is_trusting = new Metrics("entities_count", 0, [new Label("filter", "is_trusting")]);
    const is_touching_damage_block = new Metrics("entities_count", 0, [new Label("filter", "is_touching_damage_block")]);
    const is_on_fire = new Metrics("entities_count", 0, [new Label("filter", "is_on_fire")]);
    const is_on_ground = new Metrics("entities_count", 0, [new Label("filter", "is_on_ground")]);
    const is_on_hot_block = new Metrics("entities_count", 0, [new Label("filter", "is_on_hot_block")]);
    const is_trading = new Metrics("entities_count", 0, [new Label("filter", "is_trading")]);
    const is_riding = new Metrics("entities_count", 0, [new Label("filter", "is_riding")]);
    const is_dancing = new Metrics("entities_count", 0, [new Label("filter", "is_dancing")]);
    const is_sleeping = new Metrics("entities_count", 0, [new Label("filter", "is_sleeping")]);
    const is_angry = new Metrics("entities_count", 0, [new Label("filter", "is_angry")]);
    const is_baby = new Metrics("entities_count", 0, [new Label("filter", "is_baby")]);
    const is_moveing = new Metrics("entities_count", 0, [new Label("filter", "is_moveing")]);

    for (const entity of entities) {
        if (entity.isPlayer()) {
            player.value++;
        }
        if (entity.isItemEntity()) {
            item.value++;
        }
        if (entity.canFly) {
            can_fly.value++;
        }
        if (entity.canFreeze) {
            can_freeze.value++;
        }
        if (entity.canSeeDaylight) {
            can_see_daylight.value++;
        }
        if (entity.canPickupItems) {
            can_pickup_items.value++;
        }
        if (entity.inAir) {
            in_air.value++;
        }
        if (entity.inWater) {
            in_water.value++;
        }
        if (entity.inLava) {
            in_lava.value++;
        }
        if (entity.inRain) {
            in_rain.value++;
        }
        if (entity.inSnow) {
            in_snow.value++;
        }
        if (entity.inWall) {
            in_wall.value++;
        }
        if (entity.inWaterOrRain) {
            in_water_or_rain.value++;
        }
        if (entity.inWorld) {
            in_world.value++;
        }
        if (entity.isInvisible) {
            is_invisible.value++;
        }
        if (entity.isInsidePortal) {
            is_inside_portal.value++;
        }
        if (entity.isTrusting) {
            is_trusting.value++;
        }
        if (entity.isTouchingDamageBlock) {
            is_touching_damage_block.value++;
        }
        if (entity.isOnFire) {
            is_on_fire.value++;
        }
        if (entity.isOnGround) {
            is_on_ground.value++;
        }
        if (entity.isOnHotBlock) {
            is_on_hot_block.value++;
        }
        if (entity.isTrading) {
            is_trading.value++;
        }
        if (entity.isRiding) {
            is_riding.value++;
        }
        if (entity.isDancing) {
            is_dancing.value++;
        }
        if (entity.isSleeping) {
            is_sleeping.value++;
        }
        if (entity.isAngry) {
            is_angry.value++;
        }
        if (entity.isBaby) {
            is_baby.value++;
        }
        if (entity.isMoving) {
            is_moveing.value++;
        }

    }

    return [all, player, item, can_fly, can_freeze, can_see_daylight, can_pickup_items, in_air, in_water, in_lava, in_rain, in_snow, in_wall, in_water_or_rain, in_world, is_invisible, is_inside_portal, is_trusting, is_touching_damage_block, is_on_fire, is_on_ground, is_on_hot_block, is_trading, is_riding, is_dancing, is_sleeping, is_angry, is_baby, is_moveing];
}

// Performance

function metrics_performance() {
    const [mspt, tps] = get_mspt_from_trapdoor();
    const mspt_metric = new Metrics("mspt", mspt, []);
    const tps_metric = new Metrics("tps", tps, []);
    return [mspt_metric, tps_metric];
}

// Metrics End

function get_mspt_from_trapdoor(){
    const result = mc.runcmdEx("log mspt");
    if (result.success){
        const reg = new RegExp("§.");
        const opt = result.output.replace(reg,"").split("\n")[0].split(":")[1];
        const nums = opt.split("/");
        const mspt = parseFloat(nums[0]);
        const tps = parseFloat(nums[1]);
        return [mspt, tps];
    }
    return [NaN, NaN];
}

server.startAt("127.0.0.1", 9999);