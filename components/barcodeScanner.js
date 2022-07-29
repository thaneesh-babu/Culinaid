import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import React, { useState, useContext } from 'react';
import { UserCartContext } from "~/context/userCart";
import { UserStoreContext } from '~/context/userStore';

const BarcodeScanner = ({ setIsOpen }) => {
    const [itemCode, setItemCode] = useState('notFound');
    const { userCart, setUserCart } = useContext(UserCartContext);
    const { userStore } = useContext(UserStoreContext);

    console.log("*********************************** ", userCart);
    return (
        <div className="barcode-scanner">
            <BarcodeScannerComponent
                width={300}
                height={400}
                onUpdate={async (err, result) => {
                    try {
                        if (result) {
                            const responseFromCatalog = await fetch(`/api/catalog/${result}`);
                            const dataFromCatalogue = await responseFromCatalog.json();
                            const requestOptions = {
                                method: "POST",
                                body: JSON.stringify({
                                    siteId: userStore.id,
                                    cart: userCart,
                                    etag: userCart.etag ?? false,
                                    location: userCart.location ?? false,
                                    item: dataFromCatalogue,
                                })
                            }

                            const responseAddTocart = await fetch(`/api/cart`, requestOptions);
                            const dataFromAddToCart = await responseAddTocart.json();
                            userCart.location = dataFromAddToCart.location;
                            userCart.etag = dataFromAddToCart.etag;
                            userCart.totalQuantity = userCart.totalQuantity
                                ? userCart.totalQuantity + 1
                                : 1;
                            setUserCart(userCart);

                            console.log(dataFromAddToCart);
                            setItemCode(result.text);
                            setIsOpen(false);
                        } else {
                            setItemCode('Not Found');
                        }
                    } catch (err) {
                        console.log(err);
                    }

                }}
                className="barcode-camera"
            />
            <p>{itemCode}</p>
        </div>
    );
};

export default BarcodeScanner;
