---
title: Singulr API Reference

languages:
  - javascript

toc_footers:
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

search: true
---

# Introduction

Welcome to the Kittn API! You can use our API to access Kittn API endpoints, which can get information on various cats, kittens, and breeds in our database.

We have language bindings in Shell, Ruby, and Python! You can view code examples in the dark area to the right, and you can switch the programming language of the examples with the tabs in the top right.

This example API documentation page was created with [Slate](https://github.com/tripit/slate). Feel free to edit it and use it as a base for your own API's documentation.



# Singulr

## init

> See the table to the right for all possible options

```javasrcipt
Singulr.init(options)
```

Run `Singulr.init(options)` to load up Singulr. Note that Singulr.init() **does not** return anything, so only one
Singulr can be used on one index page.

### Options

Option | Description
--------- | ------------
onDocumentPageLoaded | A function that fires when everything except the scripts have been loaded (on a page)
onPageLoaded | A function that fires when the everything have been loaded (on a page)
onDependenciesLoaded | A function that fires when the dependencies have been loaded, but the current page hasn't been loaded yet
analyticNodes | A list of DOM nodes that are added every time a page is loaded (for things like Google Analytics)
HOME_PAGE | A string representing the home page, which is loaded when the user visits the index.html directly (default: `home.html`)
BASE_PAGE | A string representing the base page, which includes things like the navbar and footer and is loaded on every page (default: `base.html`)
PAGE_404 | A string representing the 404 page, which is loaded when the page the user is looking for isn't found (default: `404.html`)
PAGE_ID | A string representing the id of the div which the base is loaded into (default: `page`)
CONTENT_ID | A string representing the id of the div which the actual page is loaded into (default: `content`)
dependencies | <ul><li><code>javascript</code>: list of javascript file urls to be loaded</li><li><code>css</code>: list of css file urls to be loaded</li></ul>

<aside class="warning">
  The `CONTENT_ID` div is inside the base, not the index file.
</aside>


## getPage

> Log the current page to the console

```
console.log(Singulr.getPage());
```

Returns the current page (returns the home page if currently on index)


## loadPage

> Go to about.html

```
Singulr.loadPage('about.html')
```

Usage: `Singulr.loadPage(page);`

Parameter | Description
----------|------------
page | Takes a string page as an input, and loads the page, similar to clicking a link on a page



# Installation Guide

## Add Singulr

> Add this code to the bottom of the body

Start off by adding singulr.min.js to your website



# Terminology

## Page

The word `page` is used to describe a page that is loaded every time you click a
link or use Singulr.loadPage() to load a page