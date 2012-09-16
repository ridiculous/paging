Client Side Paging
======

A simple jQuery plugin for client side JavaScript pagination. At least something to build on.

## Usage

[Demo](http://dontspreadit.com/apps/paging/) using Twitter BootStrap

## Examples

Just call $.paging on a container element and pass in some options.

	$('#master_list').paging({ limit:15 });

## Options

The plugin accepts only three options.

    limit: 50                    // number of items per page
    items: [],                  // collection of items to put in the container and page through
    tags : ['li', 'tr', 'div'] // types of tags accepted

If not given any items, $.paging will search the container for li, tr and divs, using the first type of element found for pagination.

    <div id="master_list">
        <ul>
            <li>Item One</li>
            <li>Item Two</li>
            <li>Item Three</li>
        </ul>
    </div>

$.paging also searches inside and around the container element for an element with the class 'page_navigation' containing tags with the classes 'prev_page' and 'next_page'.

    <div class="page_navigation">
        <a href="#" class="prev_page"></a>
        <a href="#" class="next_page"></a>
    </div>
    <div id="master_list">
        <ul>
            <li>Item One</li>
            <li>Item Two</li>
            <li>Item Three</li>
        </ul>
    </div>

If not found these elements will be created and inserted after the container.
