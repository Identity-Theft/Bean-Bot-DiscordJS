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
const glob_1 = __importDefault(require("glob"));
const dotenv_1 = __importDefault(require("dotenv"));
const util_1 = require("util");
const BotMusicManager_1 = __importDefault(require("./BotMusicManager"));
dotenv_1.default.config();
const globPromise = (0, util_1.promisify)(glob_1.default);
class Bot extends discord_js_1.Client {
    constructor() {
        super({ intents: 643 });
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.botMusicManager = new BotMusicManager_1.default();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.login(process.env.TOKEN);
            // Add commands to collection
            const commandFiles = yield globPromise(`${__dirname}/../commands/**/*.ts`);
            commandFiles.map((value) => __awaiter(this, void 0, void 0, function* () {
                const file = yield Promise.resolve().then(() => __importStar(require(value)));
                this.commands.set(file.data.name, file);
            }));
            // Add events to collection
            const eventFiles = yield globPromise(`${__dirname}/../events/**/*.ts`);
            eventFiles.map((value) => __awaiter(this, void 0, void 0, function* () {
                const file = yield Promise.resolve().then(() => __importStar(require(value)));
                this.events.set(file.name, file);
                // Bind event
                this.on(file.name, file.run.bind(null, this));
            }));
        });
    }
    generateCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            this.commands.forEach((file) => {
                var _a, _b;
                if (file.test == true) {
                    (_a = this.application) === null || _a === void 0 ? void 0 : _a.commands.create(file.data, '844081963324407848');
                }
                else {
                    (_b = this.application) === null || _b === void 0 ? void 0 : _b.commands.create(file.data);
                }
            });
        });
    }
}
exports.default = Bot;
