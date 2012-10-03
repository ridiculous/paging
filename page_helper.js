/**
 * PageHelper
 *
 * @constructor
 *
 * Accepts an object with these options
 *  - limit #=> per page
 *  - collection #=> array of html elements
 *  - container #=> html element
 */
function PageHelper(options) {

    this.limit = options.limit || 50;
    this.collection = options.collection;
    this.container = options.container;
    this.current_item = null;
    this.pages = [];
    this.page_number = 0;

    // Split the collection into sets, create a new Page() for each set and save it to this.pages (array).
    this.buildPages = function () {
        var limit = this.limit;

        this.pages = [];
        this.page_sets = Math.ceil(this.getItems().length / limit);

        for (var index = 0; index < this.page_sets; index++) {
            this.pages.push(new Page(this.getItems().slice(index * limit, (index * limit) + limit)));
        }
        return this;
    };

    this.bindItem = function () {
        if (!$(this.getItem()).hasClass('loaded')) {
            // bind some events maybe?
            $(this.getItem()).addClass('loaded');
        }
        return this;
    };

    this.insertItem = function () {
        this.container.append(this.getItemElement());
        return this;
    };

    this.previousPageCount = function () {
        if (this.previousPage()) return this.previousPage().getItemCount();
        else return 0;
    };

    this.nextPageCount = function () {
        if (this.nextPage()) return this.nextPage().getItemCount();
        else return 0;
    };

    this.getPage = function (page_number) {
        return this.pages[page_number || this.page_number];
    };

    this.getPageItems = function () {
        return this.getPage().getItems();
    };

    this.previousPage = function () {
        return this.pages[this.page_number - 1];
    };

    this.nextPage = function () {
        return this.pages[this.page_number + 1];
    };

    this.getItems = function () {
        return this.collection;
    };

    this.getItem = function () {
        return this.current_item;
    };

    this.setItem = function (item) {
        this.current_item = item;
        return this;
    };

    this.getItemElement = function () {
        if (this.current_item[0]) return this.current_item[0];
        else return this.getItem();
    };

    this.searchForPageNumber = function (request_uri) {
        var match = request_uri.match(/[?|&]page=\d+/), page_num = null;
        if (match) page_num = match.join().match(/page=(\d+)/)[1];
        return page_num;
    };
}
