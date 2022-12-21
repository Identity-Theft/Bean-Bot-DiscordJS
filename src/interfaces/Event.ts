import Bot from "../classes/Bot";

export default interface Event
{
	name: string;
	run(client: Bot, ...args: any[]): Promise<void>;
}