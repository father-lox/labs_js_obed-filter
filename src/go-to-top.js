export default class GoToTop {
    #button;

    #place = document.body;

    #hiddenClass = 'go-to-top__hidden';

    #shownClass = 'go-to-top__shown';

    constructor() {
        this.#button = GoToTop.generateGoToTopButton();
        this.#injectButton();
        window.addEventListener('scroll', this.#showHideButtonOnScroll);
    }

    #showHideButtonOnScroll = () => {
        if (this.#isHidden() && window.scrollY > window.innerHeight) {
            this.#show();
        } else if (this.#isShown() && window.scrollY < window.innerHeight) {
            this.#hide();
        }
    };

    #injectButton() {
        this.#button.addEventListener('click', this.#onButtonClick);
        this.#hide();
        this.#place.prepend(this.#button);
    }

    #onButtonClick = () => {
        window.scrollTo(0, 0);
    };

    #hide() {
        this.#button.classList.add(this.#hiddenClass);
        this.#button.classList.remove(this.#shownClass);
    }

    #show() {
        this.#button.classList.add(this.#shownClass);
        this.#button.classList.remove(this.#hiddenClass);
    }

    #isHidden() {
        return this.#button.classList.contains(this.#hiddenClass);
    }

    #isShown() {
        return this.#button.classList.contains(this.#shownClass);
    }

    static generateGoToTopButton() {
        const button = document.createElement('button');

        button.innerText = 'Вверх ⬆';
        button.classList.add('ob-btn', 'go-to-top');

        return button;
    }
}
