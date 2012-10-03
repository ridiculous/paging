/**
 * PageNavigator
 * - Dependencies
 *      - PageHelper
 *      - PageBuilder
 *
 * @param {object} paging
 * @constructor
 */
function PageNavigator(paging) {
    var pager = paging;

    this.loadPreviousPage = function () {
        if (!pager.previousPage()) return;
        pager.pageChange(function () {
            pager.page_number--;
            pager.loadItems();
        });
    };

    this.loadNextPage = function () {
        if (!pager.nextPage()) return;
        pager.pageChange(function () {
            pager.page_number++;
            pager.loadItems();
        });
    };

    this.pageChange = function (callback) {
        this.pageCleanUp(callback);
    };

    this.pageCleanUp = function (callback) {
        $(this)
            .find('.loaded')
            .each(function () {
                $(this).detach();
            });
        if (callback) callback.call(this);
    };

    // Bindings

    this.bindNavigation = function (callback) {
        if (!this.$next_page.length && !this.$previous_page.length) {
            this.$nav = $('<div />').addClass('page_navigation');
            this.$nav
                .html('<a href="javascript:;" class="prev_page btn"  style="float: left;"></a> <a href="javascript:;" class="next_page btn"  style="float: right;"></a>')
                .insertAfter(this);
            this.$next_page = this.$nav.find('.next_page');
            this.$previous_page = this.$nav.find('.prev_page');
        }
        this.$next_page.bind('click', function () {
            pager.loadNextPage.call(this);
            return false;
        });
        this.$previous_page.bind('click', function () {
            pager.loadPreviousPage.call(this);
            return false;
        });
        if (callback) callback.call(this);
    };
}