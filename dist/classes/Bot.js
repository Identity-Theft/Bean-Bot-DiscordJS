"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
// import glob from "glob";
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { promisify } from "util";
const MusicManager_1 = __importDefault(require("./MusicManager"));
dotenv_1.default.config();
// const globPromise = promisify(glob);
class Bot extends discord_js_1.Client {
    constructor() {
        super({ intents: 647 });
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.musicManager = new MusicManager_1.default();
        this.activities = new discord_js_1.Collection([
            ["youtube", '880218394199220334']
        ]);
    }
    start() {
        this.login(process.env.TOKEN);
        // this.login(process.env.DEV);
        // this.setup()
        this.herokuSetup();
    }
    // private async setup(): Promise<void>
    // {
    // 	const ext = __filename.split(".")[1];
    // 	// Add commands to collection
    // 	const commandFiles: string[] = await globPromise(`${__dirname}/../commands/**/*.${ext}`);
    // 	commandFiles.map(async (value: string) => {
    // 		const file: Command = await import(value);
    // 		this.commands.set(file.data.name, file);
    // 	});
    // 	// Add events to collection
    // 	const eventFiles: string[] = await globPromise(`${__dirname}/../events/**/*.${ext}`);
    // 	eventFiles.map(async (value: string) => {
    // 		const file: Event = await import(value);
    // 		this.events.set(file.name, file);
    // 		// Bind event
    // 		this.on(file.name, file.run.bind(null, this));
    // 	});
    // }
    herokuSetup() {
        return __awaiter(this, void 0, void 0, function* () {
            // Add commands to collection
            const commandsFiles = fs_1.default.readdirSync(`${__dirname}/../commands/`);
            commandsFiles.map((value) => __awaiter(this, void 0, void 0, function* () {
                const commandFoler = fs_1.default.readdirSync(`${__dirname}/../commands/${value}`);
                commandFoler.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const commandFile = yield Promise.resolve().then(() => __importStar(require(`${__dirname}/../commands/${value}/${file}`)));
                    this.commands.set(commandFile.data.name, commandFile);
                }));
            }));
            // Add events to collection
            const eventFiles = fs_1.default.readdirSync(`${__dirname}/../events/`);
            eventFiles.map((value) => __awaiter(this, void 0, void 0, function* () {
                const eventFoler = fs_1.default.readdirSync(`${__dirname}/../events/${value}`);
                eventFoler.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const eventFile = yield Promise.resolve().then(() => __importStar(require(`${__dirname}/../events/${value}/${file}`)));
                    this.events.set(eventFile.name, eventFile);
                    this.on(eventFile.name, eventFile.run.bind(null, this));
                }));
            }));
        });
    }
    generateCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            this.commands.forEach((cmd) => {
                var _a, _b, _c;
                if (this.token == process.env.DEV)
                    (_a = this.application) === null || _a === void 0 ? void 0 : _a.commands.create(cmd.data, '844081963324407848');
                else if (cmd.data.name == "activity") {
                    (_b = this.application) === null || _b === void 0 ? void 0 : _b.commands.create(cmd.data, "905958361995022356").then(command => {
                        command.setDefaultPermission(false);
                        const guild = command.guild;
                        const permissions = [
                            {
                                id: "905958714782134303",
                                type: "ROLE",
                                permission: true
                            }
                        ];
                        command.permissions.set({ guild, permissions });
                    });
                }
                else
                    (_c = this.application) === null || _c === void 0 ? void 0 : _c.commands.create(cmd.data);
            });
        });
    }
}
exports.default = Bot;
