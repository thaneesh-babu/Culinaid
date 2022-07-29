import { useContext } from "react";
import { UserStoreContext } from "~/context/userStore";
import { getOrdersByUser, getAllOrders } from "~/lib/order";
import { getCartItemsById } from "~/lib/cart";
import { RecipeContext, RecipeContextProvider } from "~/context/recipe";
export default async function sortRecipes(req, res) {
    /**
     * get all the recipes
     * call the match func on each recipe which returns a match %
     * sorts the recipes by match and popularity desc
     * returns json array of recipes
     */
    function sort_by_key(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            return x > y ? -1 : x < y ? 1 : 0;
        });
    }
    let result = [];
    const orderLineDescription = [];
    const itemMap = new Map();
    console.log(req.body)
    const body = JSON.parse(req.body);
    let cartItems = await getCartItemsById(
        body.userStore.id,
        body.userCart.location
    );
    cartItems = cartItems.data.pageContent;
    let orderData = await getOrdersByUser(body.userStore.id);
    orderData = orderData.data;
    orderData.pageContent.forEach((order) => {
        order.orderLines.forEach((orderline) => {
            // console.log(orderline);
            orderLineDescription.push(orderline.description);
        });
    });
    buildMap(orderLineDescription, itemMap);
    const allItemMap = new Map();
    const allOrderLineDescription = [];
    let items = await getAllOrders();
    items = items.data;
    items.pageContent.forEach((item) => {
        item.orderLines.forEach((orderLine) => {
            allOrderLineDescription.push(orderLine.description);
        });
    });
    buildMap(allOrderLineDescription, allItemMap);

    const siteWeight = 0.5;
    const scoreWeight = 0.25;
    let score = 0;
    let matchPercent = 0;
    let missingIngredients = [];
    console.log("bruh work man")
    console.log(body.userRecipe.length)
    try {
        for (const recipeObj of body.userRecipe) {
            [matchPercent, missingIngredients] = match(cartItems, recipeObj.recipe);
            for (const [key, value] of itemMap) {
                if (key in missingIngredients) {
                    score += value;
                }
            }
            for (const [key, value] of allItemMap) {
                score += value * siteWeight;
            }
            result.push({
                recipe: recipeObj.recipe,
                popularity: matchPercent + score * scoreWeight,
            });
        }
    } catch (error) {
        console.log("error");
        console.log(error);
        console.log(body.userRecipe);
        if (Object.keys(body.userRecipe).length !== 0) {
            for (const recipeObj of body.userRecipe.array) {
                [matchPercent, missingIngredients] = match(cartItems, recipeObj.recipe);
                for (const [key, value] of itemMap) {
                    if (key in missingIngredients) {
                        score += value;
                    }
                }
                for (const [key, value] of allItemMap) {
                    score += value * siteWeight;
                }
                result.push({
                    recipe: recipeObj.recipe,
                    popularity: matchPercent + score * scoreWeight,
                });
            }
        }
    }
    // console.log("here");
    // console.log(result);
    res.status(200).send({ array: sort_by_key(result, "popularity") });
}

function buildMap(arr, counterTable) {
    for (let i = 0; i < arr.length; i++) {
        if (counterTable().has(arr[i])) {
            counterTable().set(arr[i], counterTable().get(arr[i]++));
        }
        counterTable.set(arr[i], 1);
    }
}

function match(cartData, recipe) {
    let count = 0;
    let missingIngredients = [];
    console.log(Object.values(recipe)[0])
    Object.values(recipe)[0].forEach(function(c) {
        if (
            cartData.some(function(a) {
                return a.description === c[0];
            })
        ) {
            count++;
        } else {
            missingIngredients.push(c[0]);
        }
    });

    return [parseFloat(((count * 100) / Object.values(recipe)[0].length).toFixed(2)), missingIngredients];
}
