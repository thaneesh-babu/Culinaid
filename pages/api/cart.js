import {
    createCart,
    addItemToCart,
    getCartItemsById,
    updateItemInCartById,
} from "~/lib/cart";
let logs = [];
export default async function handler(req, res) {
    let body = JSON.parse(req.body);
    if (body.etag == false || body.location == false) {
        let cart = await createCart(body.siteId);

        logs.push(cart.log);
        // console.log(cart);

        let location = cart.headers.get("location");
        // console.log(location);
        let etag = cart.headers.get("ETag");
        // let cartId = location.split('/')[2];
        let cartId = location.slice(6);
        // console.log(cartId);
        let item = body.item;
        console.log(body)

        let obj = {
            itemId: item.itemId.itemCode,
            scanData: item.itemId.itemCode,
            quantity: {
                unitOfMeasure: "EA", // ???
                value: item.quantity,
            },
        };
        let addToCart = await addItemToCart(body.siteId, cartId, etag, obj);
        logs.push(addToCart.log);
        res.status(addToCart.status).json({ etag, location: cartId, logs });
    } else {
        let cartId = body.location;
        let etag = body.etag;
        let cartItems = await getCartItemsById(body.siteId, cartId);
        logs.push(cartItems.log);
        let item = body.item.catalogItem.data;
        console.log(item)
        let itemId = item.itemId.itemCode;
        // Check if we need to update.
        let update = false;
        let pageContent = cartItems.data.pageContent;
        for (let index = 0; index < pageContent.length; index++) {
            const element = pageContent[index];
            if (element.itemId.value == itemId) {
                update = element;
                break;
            }
        }
        // console.log("update " + update);
        if (!update) {
            let obj = {
                itemId: item.itemId.itemCode,
                scanData: item.itemId.itemCode,
                quantity: {
                    unitOfMeasure: "EA", // ???
                    value: 1,
                },
            };
            let addItemToExistingCart = await addItemToCart(
                body.siteId,
                cartId,
                etag,
                obj
            );
            logs.push(addItemToExistingCart.log);
        }
        res.status(200).json({ status: 200, etag, location: cartId, logs });
    }
}
