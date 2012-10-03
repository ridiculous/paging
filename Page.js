/**
 * Page class - methods and properties specific to the page
 *
 * @param {Array} collection
 * @constructor
 */
function Page(collection) {

    this._items = collection;

    this.getItems = function () {
        return this._items;
    };
    this.getItemCount = function () {
        if (this.getItems()) return this.getItems().length;
        else return 0;
    };
}