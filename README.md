Client Side Paging
======

A simple jQuery plugin for client side JavaScript pagination. At least something to build on.

## Usage

Checkout the [demo](http://dontspreadit.com/apps/paging/)

## Examples

Just call $.paging on a container element and pass in some options.

	$('#master_list').paging({ limit:15 });

## Options

The plugin accepts only three options.

    limit: 50 // determines the number of items per page
    items:[], // collection to populate container and page through
    tags:['li', 'tr', 'div'] // types of tags accepted

If not given any items, $.paging will search the container for li, tr and divs, using the first type of element found for pagination.
$.paging also searches inside and around the container element for an element with the class 'page_navigation' containing tags with the classes 'prev_page' and 'next_page'.
If not found these elements will be created and inserted them after the container.
