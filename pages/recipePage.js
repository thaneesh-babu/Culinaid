import { useContext } from "react";
import { Row, Col } from "reactstrap";
import { UserStoreContext } from "~/context/userStore";
import Layout from "~/components/public/Layout";
import RecipeCard from "~/components/public/recipe/RecipeCard";
import { recipes } from "~/components/public/recipe/RecipeView";

import { RecipeContext, RecipeContextProvider } from "~/context/recipe";
export default function Catalog({ query }) {
    const { userStore } = useContext(UserStoreContext);
    const { userRecipe, setUserRecipe } = useContext(RecipeContext);
    console.log(userRecipe)
    let recipes = userRecipe;
    //   if (isError) {
    //     return (
    //       <Layout>
    //         <div className="container my-4 flex-grow-1">
    //           <p className="text-muted">{`Uhoh, we've hit an error.`}</p>
    //         </div>
    //       </Layout>
    //     );
    //   }

    return (
        <Layout title="Recipe Page">
            <h3 style={{ marginLeft: "70px" }}>Suggested Recipes</h3>
            <div className="container my-4 flex-grow-1">
                <Row>
                    {userRecipe?.length != undefined ? (
                        userRecipe.map((obj) => (
                            <Col sm="6" md="3" className="mb-4">
                                <RecipeCard
                                    title={Object.keys(obj.recipe)[0]}
                                    match={`${obj.popularity}%`}
                                    ingredients={obj.recipe[Object.keys(obj.recipe)[0]]}
                                />
                            </Col>
                        ))
                    ) : (
                        <div></div>
                    )}
                </Row>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {
            query: context.query.query ? context.query.query : null,
        },
    };
}
