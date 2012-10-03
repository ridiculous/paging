/**
 * PageBuilder
 * - Dependencies
 *      - PageHelper
 *
 * @param paging
 * @constructor
 */
function PageBuilder(paging) {

    // DOM Load each Item.
    this.loadItems = function (callback) {
        if (this.getPage()) {
            $(this.getPageItems()).each(function () {
                paging.setItem(this).bindItem().insertItem();
            });
        }
        this.ready(callback);
    };

    this.ready = function (callback) {
        paging.$next_page
            [!paging.nextPageCount() > 0 ? 'addClass' : 'removeClass']('disabled')
            .html('Next ' + (paging.nextPageCount() || '') + ' items &raquo;')
            .show();
        paging.$previous_page
            [!paging.previousPageCount() > 0 ? 'addClass' : 'removeClass']('disabled')
            .html('&laquo; Previous ' + (paging.previousPageCount() || '') + ' items')
            .show();
        if (callback) callback.call(paging);
    };
}