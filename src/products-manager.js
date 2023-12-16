import Product from './product.js';

export default class ProductsManager {
    #products = Array.from(document.querySelectorAll('.js-food-item')).map(product => {
        return new Product(product);
    })
        .sort((a, b) => a.price - b.price);

    #productsByCategories = [];

    #rangeModifications = {
        indexStart: 0,
        indexEnd: this.#products.length,
    };

    constructor() {
        this.#initProductsByCategory();
    }

    // eslint-disable-next-line complexity,max-statements
    filterProducts(minPrice, maxPrice) {
        let newIndexStart = 0;
        let newIndexEnd = this.#products.length - 1;

        if (minPrice) {
            newIndexStart = this.#products.findIndex(product => product.price >= minPrice);
        }

        if (maxPrice) {
            newIndexEnd = this.#products.findLastIndex(product => product.price <= maxPrice);
        }

        if (this.#isFullAvailableRange(newIndexStart, newIndexEnd)) {
            this.#discardChanges();
        } else if (this.#isNewSegment(newIndexStart, newIndexEnd)) {
            this.#hideElements(
                this.#rangeModifications.indexStart,
                this.#rangeModifications.indexEnd,
            );
            this.#showElements(newIndexStart, newIndexEnd);
        } else {
            if (this.#hasRightBorderIncreased(newIndexEnd)) {
                this.#showElements(this.#rangeModifications.indexEnd, newIndexEnd);
            } else if (this.#hasRightBorderDecreased(newIndexEnd)) {
                this.#hideElements(newIndexEnd, this.#rangeModifications.indexEnd);
            }

            if (this.#hasLeftBorderIncreased(newIndexStart)) {
                this.#hideElements(this.#rangeModifications.indexStart, newIndexStart);
            } else if (this.#hasLeftBorderDecreased(newIndexStart)) {
                this.#showElements(newIndexStart, this.#rangeModifications.indexStart);
            }
        }

        this.#rangeModifications.indexStart = newIndexStart;
        this.#rangeModifications.indexEnd = newIndexEnd;
    }

    sortDescending() {
        this.#productsByCategories.forEach(productsCategory => {
            productsCategory.sort((a, b) => b.price - a.price);
            productsCategory.forEach((product, index) => product.setOrder(index));
        });
    }

    sortAscending() {
        this.#productsByCategories.forEach(productsCategory => {
            productsCategory.sort((a, b) => a.price - b.price);
            productsCategory.forEach((product, index) => product.setOrder(index));
        });
    }

    #hideElements(from, to) {
        for (let i = from; i < to; i += 1) {
            this.#products[i].hide();
        }
    }

    #showElements(from, to) {
        for (let i = from; i < to; i += 1) {
            this.#products[i].show();
        }
    }

    #initProductsByCategory() {
        const categoriesNode = document.querySelectorAll('.ob-restaurantList__wrap');

        categoriesNode.forEach(productContainer => {
            this.#productsByCategories.push(Array.from(productContainer.querySelectorAll('.js-food-item')).map(product => new Product(product)));
        });
    }

    #discardChanges() {
        this.#showElements(0, this.#rangeModifications.indexStart - 1);
        this.#showElements(this.#rangeModifications.indexStart, this.#products.length - 1);
    }

    #isFullAvailableRange(newIndexStart, newIndexEnd) {
        return newIndexStart === 0 && newIndexEnd === this.#products.length - 1;
    }

    #isNewSegment(newIndexStart, newIndexEnd) {
        return (newIndexStart > this.#rangeModifications.indexEnd &&
                newIndexEnd > this.#rangeModifications.indexEnd) ||
            (newIndexStart < this.#rangeModifications.indexStart &&
                newIndexEnd < this.#rangeModifications.indexStart);
    }

    #hasRightBorderIncreased(newIndexEnd) {
        return newIndexEnd - this.#rangeModifications.indexEnd > 0;
    }

    #hasRightBorderDecreased(newIndexEnd) {
        return newIndexEnd - this.#rangeModifications.indexEnd < 0;
    }

    #hasLeftBorderIncreased(newIndexStart) {
        return newIndexStart - this.#rangeModifications.indexStart > 0;
    }

    #hasLeftBorderDecreased(newIndexStart) {
        return newIndexStart - this.#rangeModifications.indexStart < 0;
    }
}
