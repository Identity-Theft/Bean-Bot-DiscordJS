import Bot from "../classes/Bot";

export default abstract class Event
{
	abstract name: string;
	abstract execute(client: Bot, ...args: any[]): Promise<void>;
}