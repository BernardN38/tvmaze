/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	const params = { q: query };
	const res = await axios.get('http://api.tvmaze.com/search/shows', { params });
	return res.data;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		show = show.show;
		if (show.image == null) {
			show.image = {
				original:
					'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300'
			};
		}

		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image.original}">
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-secondary" id='episodes-btn'>Episodes</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#shows-list').show();
	$('#episodes-area').hide();

	let shows = await searchShows(query);
	populateShows(shows);
});

$('#shows-list').on('click', '#episodes-btn', async function() {
	let parentId = $(this).parent().parent().data().showId;
	let list = await getEpisodes(parentId);
	$('#shows-list').hide();
	populateEpisodes(list);
});
/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
	let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	return res.data;
}

async function populateEpisodes(list) {
  $('#episodes-list').empty()
	for (let episode of list) {
		if (episode.image == null) {
			episode.image = {
				original:
					'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300'
			};
		}
		$('#episodes-list').append(`<div class="col-md-6 col-lg-3 Show" data-show-id="${episode.id}">
    <div class="card" data-show-id="${episode.id}">
      <div class="card-body">
        <h5 class="card-title">${episode.name}</h5>
        <img class="card-img-top" src="${episode.image.original}">
        <p class="card-text">${episode.summary}</p>
      </div>
    </div>
  </div>
 `);
	}

	$('#episodes-area').show();
}
