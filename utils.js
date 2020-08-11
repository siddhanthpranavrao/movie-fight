//* Functional Prog. Version
const debounce = (func, delay = 1000) => {
	let timerId;
	return (...args) => {
		if (timerId) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
};

//* OOP Version
// class Debouncer {
// 	constructor(input, delay, func) {
// 		this.input = input;
// 		this.delay = delay;
// 		this.func = func;

// 		this.timerId = null;
// 		this.input.addEventListener('input', this.onInput);
// 	}

// 	onInput = event => {
// 		if (this.timerId) {
// 			clearTimeout(this.timerId);
// 		}
// 		this.timerId = setTimeout(() => {
// 			this.func(event.target.value);
// 		}, this.delay);
// 	};
// }
