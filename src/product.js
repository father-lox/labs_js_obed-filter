export default class Product {
    #cardNode;

    #cardPriceSelector = '.ob-restaurantList__base-price';

    #price;

    constructor(cardNode) {
        this.#cardNode = cardNode;
        const priceValue = this.#cardNode.querySelector(this.#cardPriceSelector).textContent;

        this.#price = Number.parseInt(priceValue, 10);
    }

    hide() {
        this.#cardNode.style.display = 'none';
    }

    show() {
        this.#cardNode.style.display = 'flex';
    }

    setOrder(order) {
        this.#cardNode.style.order = order;
    }

    get price() {
        return this.#price;
    }
}
