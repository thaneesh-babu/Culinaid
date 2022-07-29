import React, { useContext, useEffect, useState } from "react";
import { UserStoreContext } from "~/context/userStore";
import { ListGroupItem, ListGroup } from "reactstrap";

const RecipeDropdown = (args) => {
    const DropdownItem = ({ ingredient, itemCode }) => {
        const [aisleLocation, setAisleLocation] = useState("N/A");
        // for each recipe, it makes a call to catalog
        const { userStore } = useContext(UserStoreContext);

        useEffect(() => {
            async function fetchData() {
                try {
                    const requestOptions = {
                        method: "GET",
                        headers: {
                            siteId: userStore.id,
                        },
                    };

                    const response = await fetch(
                        `/api/itemAttributes/${itemCode}`,
                        requestOptions
                    );

                    if (response.status === 404) {
                        console.log("Item not found");
                    } else {
                        const dataObject = await response.json();
                        const location = dataObject.data.locations[0];
                        setAisleLocation(`A${location.aisle} S${location.shelf}`);
                    }
                } catch (err) {
                    console.log("ERRRRRRRRRRRRRRRRRRR", err);
                }
            }

            if (!itemCode) {
            } else {
                fetchData();
            }
        }, []);

        return (
            <ListGroupItem
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "2% 5%",
                }}
            >
                <p>{ingredient}</p>
                <p>{aisleLocation}</p>
            </ListGroupItem>
        );
    };

    return (
        <div>
            <ListGroup style={{ paddingBottom: "10%" }}>
                {args.ingredientsAndItemCodes.map((ingredientAndItemCode, index) => {
                    return (
                        <DropdownItem
                            ingredient={ingredientAndItemCode[0]}
                            itemCode={ingredientAndItemCode[1]}
                        />
                    );
                })}
            </ListGroup>
        </div>
    );
};

export default RecipeDropdown;
