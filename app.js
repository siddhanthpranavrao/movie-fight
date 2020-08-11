const autoCompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
    `;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		return fetchData(searchTerm);
	}
};

const autocompleteLeft = new Autocomplete({
	root           : document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		searchData(movie, document.querySelector('#left-summary'), 'left');
	},
	...autoCompleteConfig
});

const autocompleteRight = new Autocomplete({
	root           : document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		searchData(movie, document.querySelector('#right-summary'), 'right');
	},
	...autoCompleteConfig
});

const fetchData = async searchTerm => {
	const response = await axios.get('https://www.omdbapi.com/', {
		params : {
			apikey : 'API_KEY',
			s      : searchTerm
		}
	});

	if (response.data.Error) {
		return [];
	}
	return response.data.Search;
};

let leftMovie;
let rightMovie;

const searchData = async (movie, summaryElement, side) => {
	const response = await axios.get('https://www.omdbapi.com/', {
		params : {
			apikey : 'API_KEY',
			i      : movie.imdbID
		}
	});

	summaryElement.innerHTML = movieTempleate(response.data);

	if (side === 'left') leftMovie = response.data;
	else rightMovie = response.data;

	if (leftMovie && rightMovie) {
		runComparision();
	}
};

const runComparision = () => {
	const leftSideStats = document.querySelectorAll(
		'#left-summary .notification'
	);
	const rightSideStats = document.querySelectorAll(
		'#right-summary .notification'
	);

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-danger');
		} else {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-danger');
		}
	});
};

const movieTempleate = movieDetail => {
	const dollars = parseInt(
		movieDetail.BoxOffice.replace(/\$/g, '').split(',').join('')
	);
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.split(',').join(''));
	const awards = movieDetail.Awards.split(' ').reduce((acc, element) => {
		const num = parseInt(element);
		if (num) {
			return acc + num;
		} else return acc;
	}, 0);

	console.log(awards);

	return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre} (${movieDetail.Runtime})</h4>
          <p><i>Director - ${movieDetail.Director}</i></p>
          <p style="font-size: 10px">${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>

    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>

    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
