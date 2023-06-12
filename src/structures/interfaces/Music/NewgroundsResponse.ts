export default interface NewgroundsResponse {
	id: number;
	title: string;
	download_url: string;
	stream_url: string;
	filesize: number;
	icons: Icons;
	authors: Author[];
	has_scouts: boolean;
	unpublished: boolean;
	allow_downloads: boolean;
	has_valid_portal_member: boolean;
	allow_external_api: boolean;
}

interface Author {
	id: string;
	name: string;
	url: string;
	icons: Icons;
	owner: number;
	manager: number;
	is_scout: boolean;
}

interface Icons {
	small: string;
	medium: string;
	large: string;
}