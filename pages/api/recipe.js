import { promises as fsPromises } from "fs";
import { getSession } from "next-auth/client";
import { getOrdersByUser, getAllOrders } from "lib/order";

async function asyncReadFile(filename) {
    try {
        const contents = await fsPromises.readFile(filename, "utf-8");
        let trimmed_contents = contents.trim();
        let arr = trimmed_contents.split(/\r?\n/);
        let recipes = [];
        arr.forEach((recipe) => {
            let recipe_json = {};
            let recipe_list = recipe.split(",");
            let formatted_recipe_list = recipe_list.map((unformattedIngredient) => {
                return unformattedIngredient.split("-");
            })
            // split recipe_list ingredients (all but .pop()) on '-' to get [name, uid]
            recipe_json[recipe_list.pop()] = formatted_recipe_list;
            recipes.push(recipe_json);
        });

        return recipes;
    } catch (err) {
        console.log(err);
    }
}

export default async function handler(req, res) {
    const orderLineDescription = [];
    const itemMap = new Map();
    const session = await getSession({ req });
    // let data = await getOrdersByUser(
    //     "acct:test-drive-bf39870e98424be4b0412@394008ec-14b2-467e-8427-cf66df366fd0"
    // );
    // data = data.data;
    // console.log("data: ", data);
    // data.pageContent.forEach((order) => {
    //     order.orderLines.forEach((orderline) => {
    //         // console.log(orderline);
    //         orderLineDescription.push(orderline.description);
    //     });
    // });
    // buildMap(orderLineDescription, itemMap);
    //
    // let allOrderLineDescription = [];
    // const allItemMap = new Map();
    //
    // let items = await getAllOrders();
    // items = items.data;
    // items.pageContent.forEach((item) => {
    //     item.orderLines.forEach((orderLine) => {
    //         orderLineDescription.push(orderLine.description);
    //     });
    // });
    // buildMap(allOrderLineDescription, allItemMap);

    const recipes = await asyncReadFile("python/recipes.txt");
    // console.log(recipes);
    res.status(200).send({ array: recipes });
}
// handler();

