import React, { useState } from "react";

const RecipeContext = React.createContext();

function RecipeContextProvider(props) {
    const [userRecipe, setUserRecipe] = useState({});
    return (
        <RecipeContext.Provider value={{ userRecipe, setUserRecipe }}>
            {props.children}
        </RecipeContext.Provider>
    );
}

export { RecipeContext, RecipeContextProvider };
