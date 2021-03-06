/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async so it
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

// TODO: Make an ajax request to the searchShows api.  Remove
// hard coded data.
async function searchShows(q) {
    const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${q}`);
    const missingImgURL = "http://tinyurl.com/missing-tv";
    const shows = res.data.map(function (result) {
        let show = result.show;
        return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : missingImgURL
        };
    });
    return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
    const $showsList = $("#shows-list");
    $showsList.empty();

    for (let show of shows) {
        let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}"></img>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-outline-secondary episode-btn">Episodes</button>
           </div>
         </div>
       </div>
      `);
        $showsList.append($item);
    }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
    evt.preventDefault();

    let query = $("#search-query").val();
    if (!query) return;

    $("#episodes-area").hide();

    let shows = await searchShows(query);

    populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
// TODO: get episodes from tvmaze
    //       you can get this by making GET request to
    //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

// TODO: return array-of-episode-info, as described in docstring above

async function getEpisodes(id) {
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

    let episodes = res.data.map(function (episode) {
        return {
            id: episode.id,
            name: episode.name,
            season: episode.season,
            number: episode.number
        }
    });
    console.log(episodes);
    return episodes;
}



function populateEpisodes(episodesArray) {
    const $episodesArea = $("#episodes-area");

    for (let episode of episodesArray) {
        let $listItem = $(`<li id=${episode.id}>${episode.name} (Season ${episode.season}, Episode ${episode.number})</li>`);

        $episodesArea.append($listItem);
    }
    $("#episodes-area").show();
}


$("#shows-list").on("click", ".episode-btn", async function handleEpisodeClick(e) {
    let showID = $(e.target).closest(".Show").data("show-id");
    let episodesArray = await getEpisodes(showID);
    
    populateEpisodes(episodesArray);
})
