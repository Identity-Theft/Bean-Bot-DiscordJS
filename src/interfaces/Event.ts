import Bot from "../classes/Bot";

export default interface IEvent
{
	name: string;
	run(client: Bot, ...args: any[]): Promise<void>;
}