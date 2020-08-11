class Autocomplete {
	constructor({ root, renderOption, onOptionSelect, inputValue, fetchData }) {
		this.root = root;
		this.renderOption = renderOption;
		this.onOptionSelect = onOptionSelect;
		this.inputValue = inputValue;
		this.fetchData = fetchData;

		this.create();
	}

	create = () => {
		this.root.innerHTML = `
      <label><b>Search</b></label> 
      <input type="text" class="input" />
      <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>
      </div>
    `;
		this.input = this.root.querySelector('input');
		this.dropdown = this.root.querySelector('.dropdown');
		this.resultsWrapper = this.root.querySelector('.results');

		this.input.addEventListener('input', debounce(this.onInput, 500));
		document.addEventListener('click', event => {
			if (!this.root.contains(event.target)) {
				this.dropdown.classList.remove('is-active');
			}
		});
	};

	onInput = async event => {
		const results = await this.fetchData(event.target.value);

		if (!results.length) {
			this.dropdown.classList.remove('is-active');
			return;
		}

		this.resultsWrapper.innerHTML = '';
		this.dropdown.classList.add('is-active');
		for (let result of results) {
			const option = document.createElement('a');

			option.classList.add('dropdown-item');
			option.innerHTML = this.renderOption(result);

			option.addEventListener('click', () => {
				this.dropdown.classList.remove('is-active');
				this.input.value = this.inputValue(result);
				this.onOptionSelect(result);
			});

			this.resultsWrapper.appendChild(option);
		}
	};
}
