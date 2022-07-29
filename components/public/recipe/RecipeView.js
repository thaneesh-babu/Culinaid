/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import useCart from "~/lib/swr/useCart";
import { UserCartContext } from "~/context/userCart";
import { UserStoreContext } from "~/context/userStore";

import RecipeCard from "./RecipeCard";
import { RecipeContext, RecipeContextProvider } from "~/context/recipe";

const RecipeView = (args) => {
    const [modal, setModal] = useState(false);
    const { userRecipe, setUserRecipe } = useContext(RecipeContext);
    const { userCart } = useContext(UserCartContext);
    const { userStore } = useContext(UserStoreContext);
    const { data, isLoading, isError } = useCart(userStore.id, userCart.location);
    const { filtered, setFiltered } = useState(async () => {
        let reformattedData = new Array();
        console.log("Length: " + Object.keys(userRecipe).length)
        if (Object.keys(userRecipe).length === 0) {
            console.log("in if")
            let response = await fetch(`${process.env.NEXTAUTH_URL}/api/recipe`)
            let data = await response.json()
            data.array.map((recipe) => {
                let recipeObj = {
                    recipe,
                    popularity: 0,
                };
                reformattedData.push(recipeObj);
            });
            await setUserRecipe(reformattedData);
        } else {
            reformattedData = userRecipe
        }
        let new_response = await fetch(`${process.env.NEXTAUTH_URL}/api/sortRecipes`, {
            method: "POST",
            body: JSON.stringify({
                userRecipe: reformattedData,
                userCart: userCart,
                userStore: userStore,
            }),
        })
        let new_data = await new_response.json()
        console.log(new_data);
        console.log(userRecipe)
        await setUserRecipe(new_data.array);
    })
    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button color="danger" onClick={toggle}>
                Recipe View
            </Button>
            <Modal
                style={{
                    marginTop: "100%",
                    width: "100%",
                    marginLeft: "0",
                }}
                isOpen={modal}
                toggle={toggle}
            >
                <ModalHeader toggle={toggle} className="modal-header2">
                    Suggested recipes{" "}
                    <Button style={{ marginLeft: "50px" }} href="/recipePage">
                        Expand
                    </Button>
                </ModalHeader>
                <ModalBody
                    style={{
                        width: "max-content",
                        border: "1px solid blue", paddingBottom: "10%",
                    }}
                >
                    {userRecipe?.length != undefined ? (
                        <div style={{ display: "flex" }}>
                            {userRecipe.map((obj) => {
                                return (
                                    <div
                                        style={{ marginRight: "30px" }}
                                    >
                                        <RecipeCard
                                            title={Object.keys(obj.recipe)[0]}
                                            match={`${obj.popularity}%`}
                                            ingredients={obj.recipe[Object.keys(obj.recipe)[0]]}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div>
                            <h1> Please add more items!</h1>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter />
            </Modal>
        </div>
    );
};

export default RecipeView;
