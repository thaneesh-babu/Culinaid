export default function match(cartData, recipe) {
    let count = 0;
    console.log('here in match')
    console.log(cartData)
    let missingIngredients = [];
    Object.values(recipe).forEach(function(c) {
        if (
            cartData.some(function(a) {
                return a.description === c;
            })
        ) {
            count++;
        } else {
            missingIngredients.push(c);
        }
    });

    return [(count * 100) / recipeIngredients.length, missingIngredients];
}
