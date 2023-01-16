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
    return new Metrics("players_online", players.length, [new Label("permission", "all")]);
}

function metrics_players_online_op_count() {
    const players = mc.getOnlinePlayers();
    let count = 0;
    for (const player of players) {
        if (player.isOP()) {
            count++;
        }
    }
    return new Metrics("players_online", count, [new Label("permission", "op")]);
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
        all: entities.length,
    };

    for (const entity of entities) {

        if (data.hasOwnProperty(entity.type)) {
            data[entity.type]++;
        }
        else {
            data[entity.type] = 1;
        }

    }

    const to_return = [];
    for (const [type, value] of Object.entries(data)) {
        to_return.push(new Metrics("entities", value, [new Label("type", type)]));
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