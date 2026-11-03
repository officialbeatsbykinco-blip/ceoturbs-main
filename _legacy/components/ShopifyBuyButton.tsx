import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

export const ShopifyBuyButton = () => {
  const containerId = "product-component-1774984590933";
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loadScript = () => {
      return new Promise<void>((resolve) => {
        if (window.ShopifyBuy?.UI) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
        script.onload = () => resolve();
        (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(script);
      });
    };

    loadScript().then(() => {
      const client = window.ShopifyBuy.buildClient({
        domain: "qg5zmc-rx.myshopify.com",
        storefrontAccessToken: "8485ea7ca81bb3c6f160c39df0f8aba8",
      });

      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        ui.createComponent("product", {
          id: "9294223048962",
          node: document.getElementById(containerId),
          moneyFormat: "%24%7B%7Bamount%7D%7D",
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "calc(25% - 20px)",
                    "margin-left": "20px",
                    "margin-bottom": "50px",
                  },
                  "carousel-button": { display: "none" },
                },
                title: { color: "#000000" },
                button: {
                  "font-size": "18px",
                  "padding-top": "17px",
                  "padding-bottom": "17px",
                  ":hover": { "background-color": "#000000" },
                  "background-color": "#000000",
                  ":focus": { "background-color": "#000000" },
                  "border-radius": "2px",
                  "padding-left": "67px",
                  "padding-right": "67px",
                },
                quantityInput: { "font-size": "18px", "padding-top": "17px", "padding-bottom": "17px" },
                price: { "font-weight": "bold", color: "#0c0c0c" },
                compareAt: { "font-weight": "bold", color: "#0c0c0c" },
                unitPrice: { "font-weight": "bold", color: "#0c0c0c" },
              },
              buttonDestination: "checkout",
              contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
              width: "380px",
              text: { button: "Buy now" },
            },
            productSet: {
              styles: { products: { "@media (min-width: 601px)": { "margin-left": "-20px" } } },
            },
            modalProduct: {
              contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
              styles: {
                product: { "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0px", "margin-bottom": "0px" } },
                button: {
                  "font-size": "18px",
                  "padding-top": "17px",
                  "padding-bottom": "17px",
                  ":hover": { "background-color": "#000000" },
                  "background-color": "#000000",
                  ":focus": { "background-color": "#000000" },
                  "border-radius": "2px",
                  "padding-left": "67px",
                  "padding-right": "67px",
                },
                quantityInput: { "font-size": "18px", "padding-top": "17px", "padding-bottom": "17px" },
                title: { "font-family": "Helvetica Neue, sans-serif", "font-weight": "bold", "font-size": "26px", color: "#4c4c4c" },
                price: { "font-family": "Helvetica Neue, sans-serif", "font-weight": "normal", "font-size": "18px", color: "#4c4c4c" },
                compareAt: { "font-family": "Helvetica Neue, sans-serif", "font-weight": "normal", "font-size": "15.3px", color: "#4c4c4c" },
                unitPrice: { "font-family": "Helvetica Neue, sans-serif", "font-weight": "normal", "font-size": "15.3px", color: "#4c4c4c" },
              },
              text: { button: "Add to cart" },
            },
            option: {
              styles: {
                label: { "font-weight": "bold", color: "#070707" },
                select: { "font-weight": "bold" },
              },
            },
            cart: {
              styles: {
                button: {
                  "font-size": "18px",
                  "padding-top": "17px",
                  "padding-bottom": "17px",
                  ":hover": { "background-color": "#000000" },
                  "background-color": "#000000",
                  ":focus": { "background-color": "#000000" },
                  "border-radius": "2px",
                },
                title: { color: "#ffffff" },
                header: { color: "#ffffff" },
                lineItems: { color: "#ffffff" },
                subtotalText: { color: "#ffffff" },
                subtotal: { color: "#ffffff" },
                notice: { color: "#ffffff" },
                currency: { color: "#ffffff" },
                close: { color: "#ffffff", ":hover": { color: "#ffffff" } },
                empty: { color: "#ffffff" },
                noteDescription: { color: "#ffffff" },
                discountText: { color: "#ffffff" },
                discountIcon: { fill: "#ffffff" },
                discountAmount: { color: "#ffffff" },
                cart: { "background-color": "#000000" },
                footer: { "background-color": "#000000" },
              },
              text: { total: "Subtotal", button: "Checkout" },
            },
            toggle: {
              styles: {
                toggle: {
                  "background-color": "#000000",
                  ":hover": { "background-color": "#000000" },
                  ":focus": { "background-color": "#000000" },
                },
                count: { "font-size": "18px" },
              },
            },
            lineItem: {
              styles: {
                variantTitle: { color: "#ffffff" },
                title: { color: "#ffffff" },
                price: { color: "#ffffff" },
                fullPrice: { color: "#ffffff" },
                discount: { color: "#ffffff" },
                discountIcon: { fill: "#ffffff" },
                quantity: { color: "#ffffff" },
                quantityIncrement: { color: "#ffffff", "border-color": "#ffffff" },
                quantityDecrement: { color: "#ffffff", "border-color": "#ffffff" },
                quantityInput: { color: "#ffffff", "border-color": "#ffffff" },
              },
            },
          },
        });
      });
    });
  }, []);

  return <div id={containerId} />;
};
