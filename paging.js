(function ($) {
    $.fn.paging = function (options) {

        return this.each(function () {

            // reference this
            var paging = this;

            this.prefs = $.extend({
                limit:50,
                items:[],
                tags:['li', 'tr', 'div'],
                container:$(this)
            }, options);

            // setup
            this.$next_page = $(this).find('.next_page');
            this.$previous_page = $(this).find('.prev_page');

            // search for elements to use as container and $prev/$next_page
            this.setContainer = function () {

                if (!this.prefs.container.length) {

                    if ($(this.getItems()).first().prop('tagName') == 'TR') {
                        if ($(this).prop('tagName') != 'TABLE') this.prefs.container = $(this).find('table');
                    }
                    if ($(this.getItems()).first().prop('tagName') == 'LI') {
                        if ($(this).prop('tagName') != 'UL') this.prefs.container = $(this).find('ul');
                    }
                }

                // search siblings for navigation elements
                if (!this.$previous_page.length) this.$previous_page = $(this).siblings().filter('.page_navigation').find('.prev_page');
                if (!this.$next_page.length) this.$next_page = $(this).siblings().filter('.page_navigation').find('.next_page');
                return this;
            };

            // save the items to the internal collection
            this.prefs.collection = this.prefs.items;

            // search this element for li, tr, div elements and store them
            $.each(this.prefs.tags, function () {
                var $item = $(paging).find(this.toString());
                if (!paging.prefs.collection.length && $item.length) paging.prefs.collection = $item.detach();
            });

            if (!this.prefs.collection.length) return;

            // Load in the modules
            $.extend(this, new PageBuilder(this));
            $.extend(this, new PageHelper(paging.prefs));
            $.extend(this, new PageNavigator(this));

            // kick off
            try {
                this.setContainer().buildPages().bindNavigation(function () {
                    paging.loadItems();
                });
            } catch (e) {
                if (console) console.log('Oops, error in paging.js. ' + e);
            }
        });

    }; // end of Paging

})(jQuery);