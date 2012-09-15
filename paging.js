(function ($) {
    $.fn.paging = function (options) {

        return this.each(function () {

            // reference this
            var paging = this;

            this.settings = $.extend({
                limit:50,
                items:[]
            }, options);

            // setup
            this.current_item = null;
            this.$next_page = $('#load_next_batch');
            this.$previous_page = $('#load_previous_batch');
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
                this.pages = [];
                this.page_sets = Math.ceil(this.getItems().length / this.settings.limit);
                for (var index = 0; index < this.page_sets; index++) {
                    this.pages.push(new this.Page(this.getItems().slice(index * this.settings.limit, (index * this.settings.limit) + this.settings.limit)));
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
                    .html('Next ' + (paging.nextPageCount() || '') + ' items')
                    .show();
                paging.$previous_page
                    [!paging.previousPageCount() > 0 ? 'addClass' : 'removeClass']('disabled')
                    .html('Previous ' + (paging.previousPageCount() || '') + ' items')
                    .show();
                if (callback) callback.call(paging);
            };

            //
            // Helpers
            //

            this.bindItem = function () {
                if (!$(this.getItem()).hasClass('loaded')) {
                    $(this.getItem()).addClass('loaded');
                    // bind some events maybe
                }
                return this;
            };

            this.insertItem = function () {
                $(this).append(this.getItemElement());
                return this;
            };

            this.doSomeBindings = function () {
                // bind some stuff with this.getItem()
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

            this.$next_page
                .bind('click', function () {
                    paging.loadNextPage.call(this);
                });

            this.$previous_page
                .bind('click', function () {
                    paging.loadPreviousPage.call(this);
                });


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

            this.getPage = function () {
                return this.pages[this.page_number];
            };

            this.getPageItems = function () {
                return this.getPage().getItems();
            };

            this.previousPage = function (inc) {
                return this.pages[this.page_number - (inc || 1)];
            };

            this.nextPage = function (inc) {
                return this.pages[this.page_number + (inc || 1)];
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

            if ($(this).find('li').length)
                this._unloaded = $(this).find('li').detach();

            if ($(this).find('div').length)
                this._unloaded = $(this).find('div');

            this._unloaded = this.settings.items.length ? this.settings.items : this._unloaded;

            if (!this.settings.items) return;

            // kick off
            this.buildPages().loadItems();
        });

    }; // end of Paging

})(jQuery);