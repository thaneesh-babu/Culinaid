import { getSiteCatalogItemAttributesByItemCode } from "~/lib/catalog";

export default async function handler(req, res) {
  try {
    const itemCode = req.query.id;
    const catalogItem = await getSiteCatalogItemAttributesByItemCode(
      req.headers.siteid,
      itemCode
    );
    console.log(catalogItem);

    if (catalogItem.status === 200) {
      res.status(catalogItem.status).json(catalogItem);
    }
  } catch (err) {
    console.log("EERRRRRRRRRR", err);
    console.log(err);
    res.status(err.status).json(err.message);
  }
}
