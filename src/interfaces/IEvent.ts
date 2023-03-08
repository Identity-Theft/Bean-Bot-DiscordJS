import ExtendedClient from "../structures/ExtendedClient";

export default interface IEvent
{
	name: string;
	execute(client: ExtendedClient, ...args: any[]): Promise<void>;
}