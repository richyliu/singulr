---
title: Singulr Documentation

includes:
  - install_simple
  - install_adv
  - term

toc_footers:
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>
  - <p>Beta v0.0.1r5</p>

search: true
---



# Introduction

Welcome to Singulr! Singulr is a javascript library that loads only the part of
a web page that changes, improving performance.

This documentation is divided into 2 parts: functions accessable by the Singulr
global variable, and how to install and use Singulr on your website.



# Singulr

## init

> See the table to the right for all possible options

```javascript
Singulr.init(options)
```

Run `Singulr.init(options)` to load up Singulr. Note that Singulr.init() **does not** return anything, so only one
Singulr can only be used on one [index page](#index-page).

### Options

Option | Description
--------- | ------------
onDocumentPageLoaded | A function that fires when everything except the scripts have been loaded (on a [page](#page))
onPageLoaded | A function that fires when the everything have been loaded (on a [page](#page))
onDependenciesLoaded | A function that fires when the dependencies have been loaded, but the current [page](#page) hasn't been loaded yet
analyticNodes | A list of DOM nodes that are added every time a [page](#page) is loaded (for things like Google Analytics)
HOME_PAGE | A string representing the home [page](#page), which is loaded when the user visits the [index page](#index-page) (default: `home.html`)
BASE_PAGE | A string representing the base [page](#page), which includes things like the navbar and footer and is loaded on every page (default: `base.html`)
PAGE_404 | A string representing the 404 [page](#page), which is loaded when the page the user is looking for isn't found (default: `404.html`)
PAGE_ID | A string representing the id of the div which the base is loaded into (default: `page`)
CONTENT_ID | A string representing the id of the div which the actual [page](#page) is loaded into (default: `content`)
dependencies | <ul><li><code>javascript</code>: list of javascript file urls to be loaded</li><li><code>css</code>: list of css file urls to be loaded</li></ul>

<aside class="warning">
  The `CONTENT_ID` div is inside the base, not the [index page](#index-page).
</aside>


## getPage

> Log the current page to the console

```javascript
console.log(Singulr.getPage());
```

Returns the current page (returns the home page if currently on [index page](#index-page))


## loadPage

> Go to about.html

```javascript
Singulr.loadPage('about.html')
```

Usage: `Singulr.loadPage(page);`

Parameter | Description
----------|------------
page | Takes a string page as an input, and loads the page, similar to clicking a link on a page