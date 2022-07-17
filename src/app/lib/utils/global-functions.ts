export function delay(t: number) {
	return new Promise(function(resolve) {
		setTimeout(() => resolve.bind(null), t);
	});
}