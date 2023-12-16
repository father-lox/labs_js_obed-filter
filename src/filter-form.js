import ProductsManager from './products-manager.js';

export default class FilterForm {
    #formSectionElement;

    #formElement = this.#formSectionElement.querySelector('form');

    #productManager = new ProductsManager();

    #filterOptions = new Proxy({
        minPrice: 0,
        maxPrice: 0,
        sortDescending: false,
        sortAscending: false,
    }, {
        // eslint-disable-next-line complexity
        set: (target, key, value) => {
            if (!(key in target)) {
                return false;
            }

            const oldValue = target[key];

            target[key] = value;

            if ((key === 'minPrice' || key === 'maxPrice') && oldValue !== target[key]) {
                this.#productManager.filterProducts(target.minPrice, target.maxPrice);
            } else if (key === 'sortDescending' && value) {
                this.#productManager.sortDescending();
            } else if (key === 'sortAscending' && value) {
                this.#productManager.sortAscending();
            }

            return true;
        },
    });

    #sortType = {
        ascending: 'ascending',
        descending: 'descending',
    };

    constructor() {
        this.#formSectionElement = FilterForm.generateFilterForm();
        this.#injectForm();
    }

    #injectForm() {
        const formPlace = document.querySelector('.ob-supplier__content-col .ob-layout__box');

        formPlace.prepend(this.#formSectionElement);
        this.#formElement.addEventListener('submit', this.#onFormSubmit);
        this.#formElement.addEventListener('reset', this.#onFormReset);
    }

    #onFormSubmit = (event) => {
        event.preventDefault();
        const sortSettings = new FormData(event.currentTarget);
        const minPrice = Number(sortSettings.get('minPrice'));
        const maxPrice = Number(sortSettings.get('maxPrice'));

        if (minPrice > maxPrice) {
            // eslint-disable-next-line no-alert
            alert('Нижняя граница не может быть больше верхней');
        } else {
            this.#filterOptions.maxPrice = maxPrice;
            this.#filterOptions.minPrice = minPrice;
            this.#setSortOption(sortSettings.get('sort'));
        }
    };

    #onFormReset = () => {
        this.#filterOptions.minPrice = 0;
        this.#filterOptions.maxPrice = 0;
    };

    #setSortOption(option) {
        if (option === this.#sortType.ascending) {
            this.#filterOptions.sortAscending = true;
            this.#filterOptions.sortDescending = false;
        } else if (option === this.#sortType.descending) {
            this.#filterOptions.sortDescending = true;
            this.#filterOptions.sortAscending = false;
        }
    }

    static generateFilterForm() {
        const form = document.createElement('section');

        form.classList.add('ob-restaurantList__wrap');
        form.innerHTML =
            `<form class="form-sorter" id="sort-settings">
                <div class="sorter">
                    <input type="radio" class="sorter__field" id="larger-to-smaller" name="sort" value="descending">
                    <label for="larger-to-smaller" class="sorter__label"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sort-variant</title><path d="M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z" /></svg></label>
                </div>
                <div class="sorter">
                    <input type="radio" class="sorter__field" id="smaller-to-larger" value="ascending" name="sort">
                    <label for="smaller-to-larger" class="sorter__label"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sort-reverse-variant</title><path d="M3 11H15V13H3M3 18V16H21V18M3 6H9V8H3Z" /></svg></label>
                </div>
                <input type="radio" name="sort">
                <input type="number" class="ob-input" placeholder="Нижняя граница" name="minPrice">
                <input type="number" class="ob-input" placeholder="Верхняя граница" name="maxPrice">
                <button class="ob-btn">Фильтровать</button>
                <button type="reset" class="ob-btn">Сбросить</button>
            </form>`;

        return form;
    }
}
