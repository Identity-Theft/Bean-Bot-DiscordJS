class NewgroundsResponse
{
	public id = 0;
	public title = '';
	public download_url = '';
	public stream_url = '';
	public filesize = 0;
	public icons: Icons = new Icons();
	public authors: Author[] = [];
	public has_scouts = false;
	public unpublished = false;
	public allow_downloads = false;
	public has_valid_portal_member = false;
	public allow_external_api = false
}

class Author
{
	public id = '';
	public name = '';
	public url = '';
	public icons: Icons = new Icons();
	public owner = 0;
	public manager = 0;
	public is_scout = true;
}

class Icons
{
	public small = '';
	public medium = '';
	public large = '';
}

export default NewgroundsResponse;