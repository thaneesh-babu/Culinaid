import React, { useState } from "react";
import { Card, CardBody, CardTitle, CardText, CardSubtitle, ListGroup, ListGroupItem } from "reactstrap";
import { recipes } from "./RecipeView";
import RecipeDropdown from "./RecipeDropdown";

const RecipeCard = (args) => {
    const [isDroppedDown, setIsdroppedDown] = useState(false);
    const ingredientsArray = args.ingredients.map((ingredient) => {
        return ingredient[0];
    });

    const itemCodesArray = args.ingredients.map((ingredient) => {
        return ingredient[1];
    });
    if (isDroppedDown) {

        return (
            <Card
                style={{
                    width: "18rem",
                    height: "22.5rem",
                    border: "1px solid black",
                    overflowY: "scroll"
                }}
                onClick={() => setIsdroppedDown(!isDroppedDown)}
            >
                {/* <div className="recipe-card"> */}
                <CardBody style={{ border: "none", paddingBottom: "10%" }}>
                    <CardTitle tag="h5">{args.title}</CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                        {args.match}
                    </CardSubtitle>
                    <CardText style={{ fontSize: "small" }}>
                        {ingredientsArray.join(", ")}
                    </CardText>
                    <RecipeDropdown ingredientsAndItemCodes={args.ingredients} />
                </CardBody>

            </Card>
        )
    } else {
        return (
            <Card
                style={{
                    width: "18rem",
                    border: "1px solid black",
                    overflowY: "scroll"
                }}
                onClick={() => setIsdroppedDown(!isDroppedDown)}
            >
                {/* <div className="recipe-card"> */}
                <CardBody style={{ border: "none" }}>
                    <CardTitle tag="h5">{args.title}</CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                        {args.match}
                    </CardSubtitle>
                    <CardText style={{ fontSize: "small" }}>
                        {ingredientsArray.join(", ")}
                    </CardText>
                </CardBody>

            </Card>
        )
    }
};

export default RecipeCard;
