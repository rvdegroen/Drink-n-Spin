const cocktails = ['Mojito Blanco', 'Bloody Mary'];

const fetchCocktails = async () => {
	try {
		// fetch from server api with name queryparam
		for (const cocktail of cocktails) {
			const response = await fetch(`/api/cocktail?name=${encodeURIComponent(cocktail)}`);
			const data = await response.json();
			// build book
			console.log(data);
		}
	} catch (err) {
		console.err(`Something went wrong: ${err.message}`);
	}
};

//fetchCocktails();
