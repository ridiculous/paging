(function ($) {
    $.fn.paging = function (options) {

        return this.each(function () {

            // reference this
            var paging = this;

            this.settings = $.extend({
                limit:50,
                items:[],
                tags:['li', 'tr', 'div']
            }, options);

            // setup
            this.current_item = null;
            this.$next_page = $(this).find('.next_page');
            this.$previous_page = $(this).find('.prev_page');
            this.$master = [];
            this.page_number = 0;
            this.pages = [];

            // methods and attributes specific to the current page
            this.Page = function (collection) {
                this.firstItem = function () {
                    return this.getItems() ? this.getItems().first() : undefined;
                };
                this.lastItem = function () {
                    return this.getItems() ? this.getItems().last() : undefined;
                };
                this.getItems = function () {
                    return this._items;
                };
                this.setItems = function (items) {
                    this._items = items;
                };
                this.getItemCount = function () {
                    return this.getItems() ? this.getItems().length : 0;
                };
                this.setItems(collection);
            };

            // Split the collection into sets, create a new Page() for each set and save it to this.pages (array).
            this.buildPages = function () {
                var limit = this.settings.limit;

                this.pages = [];
                this.page_sets = Math.ceil(this.getItems().length / limit);

                for (var index = 0; index < this.page_sets; index++) {
                    this.pages.push(new this.Page(this.getItems().slice(index * limit, (index * limit) + limit)));
                }
                return this;
            };

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

            //
            // Helpers
            //

            this.bindItem = function () {
                if (!$(this.getItem()).hasClass('loaded')) {
                    // bind some events maybe
                    $(this.getItem()).addClass('loaded');
                }
                return this;
            };

            this.insertItem = function () {
                this.$master.append(this.getItemElement());
                return this;
            };

            this.hideButtons = function () {
                this.$next_page.hide();
                this.$previous_page.hide();
            };

            this.loadPreviousPage = function () {
                paging.pageChange(function () {
                    paging.page_number--;
                    paging.loadItems();
                });
            };

            this.loadNextPage = function () {
                paging.pageChange(function () {
                    paging.page_number++;
                    paging.loadItems();
                });
            };

            this.pageChange = function (callback) {
                this.pageCleanUp(callback);
            };

            this.pageCleanUp = function (callback) {
                if (/\+\+/.test(callback) && !this.nextPage()) return false;
                if (/\-\-/.test(callback) && !this.previousPage()) return false;
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
                this.$next_page
                    .bind('click', function () {
                        paging.loadNextPage.call(this);
                    });

                this.$previous_page
                    .bind('click', function () {
                        paging.loadPreviousPage.call(this);
                    });
                if (callback) callback.call(this);
            };


            //
            // Methods for Re-ordering
            //

            this.firstItem = function () {
                return this.getItems().first();
            };

            this.lastItem = function () {
                return this.getItems().last();
            };

            this.deleteItem = function (index) {
                this.setItem(this._unloaded.splice(index, 1));
            };

            this.removeItem = function (item, callback) {
                var changed_id = item.getId();

                $.each(this.getItems(), function (index, item) {
                    if (item.getId() == changed_id) {
                        paging.deleteItem(index);
                        return false;
                    }
                });
                this.buildPages();
                if (callback) callback.call(this);
            };

            //
            // getter setters
            //

            this.previousPageCount = function () {
                return !this.previousPage() ? 0 : this.previousPage().getItemCount();
            };

            this.nextPageCount = function () {
                return !this.nextPage() ? 0 : this.nextPage().getItemCount();
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
                return this._unloaded;
            };

            this.getItem = function () {
                return this.current_item;
            };

            this.setItem = function (item) {
                this.current_item = item;
                return this;
            };

            this.getItemElement = function () {
                return !this.current_item[0] ? this.getItem() : this.current_item[0];
            };

            // search for elements to use as $master and $prev/$next_page
            this.setMaster = function () {
                this.$master = $(this);

                if ($(this.getItems()).first().prop('tagName') == 'TR') {
                    if ($(this).prop('tagName') != 'TABLE') this.$master = $(this).find('table');
                }
                if ($(this.getItems()).first().prop('tagName') == 'LI') {
                    if ($(this).prop('tagName') != 'UL') this.$master = $(this).find('ul');
                }

                // search siblings for navigation elements
                if (!this.$previous_page.length) this.$previous_page = $(this).siblings().filter('.page_navigation').find('.prev_page');
                if (!this.$next_page.length) this.$next_page = $(this).siblings().filter('.page_navigation').find('.next_page');
                return this;
            };

            // init
            this._unloaded = this.settings.items;

            // search this element for li, tr, div elements and store them
            $.each(this.settings.tags, function () {
                var $item = $(paging).find(this.toString());
                if (!paging._unloaded.length && $item.length) paging._unloaded = $item.detach();
            });

            if (!this._unloaded.length) return;

            // kick off
            try {
                this.setMaster().buildPages().bindNavigation(function () {
                    this.loadItems();
                });
            } catch (e) {
                if (console) console.log('Oops, error in paging.js. ' + e);
            }
        });

    }; // end of Paging

})(jQuery);