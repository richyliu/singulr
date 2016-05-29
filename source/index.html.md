---
title: Singulr Documentation

includes:
  - install_simple
  - install_adv
  - term

toc_footers:
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>
  - <p>Beta v0.0.1r10</p>
  - <a href='https://github.com/richyliu/singulr'>View on Github</a>

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
BASE_PAGE | A string representing the [base page](#base-page), which includes things like the navbar and footer and is loaded on every page (default: `base.html`)
PAGE_404 | A string representing the 404 [page](#page), which is loaded when the page the user is looking for isn't found (default: `404.html`)
PAGE_ID | A string representing the id of the div which the [base page](#base-page) is loaded into (default: `page`)
CONTENT_ID | A string representing the id of the div which the actual [page](#page) is loaded into (default: `content`)
dependencies | <ul><li><code>javascript</code>: list of javascript file urls to be loaded. Note: the scripts are loaded in order.</li><li><code>css</code>: list of css file urls to be loaded. Note: the styles are loaded in parallel.</li></ul>

<aside class="warning">
  The `CONTENT_ID` div is inside the <a href="#base-page">base page</a>, not the <a href="#index-page">index page</a>
</aside>


## getPage

> Log the current page to the console

```javascript
console.log(Singulr.getPage());
```

Returns the current page (returns the home page if currently on [index page](#index-page))


## loadPage

> Example (loads `about.html`)

```javascript
Singulr.loadPage('about.html')
```

Use this instead of setting `window.location.href`

Parameter | Description
----------|------------
page | Takes a string page as an input, and loads the page, similar to clicking a link on a page



# Notes

## Link event handlers

Do not bind event handlers to `<a>` tags with `element.addEventListener('click')`.
Instead use `element.onclick`.


## Keyframes

If you are using keyframes, do not have a keyframe name `fLhpiHgvMd`.



# Page Layout

## Necessary Parts

Include [this](#add-redirect-script) at the top of every page!


## CSS Links

> Valid

```html
<link rel="stylesheet" href="css/foo.css" type="text/css">
<link rel="stylesheet" href="css/foo.css">
<link rel="stylesheet" href="css/foo.css" type="text/css" foo="bar">
```

> Invalid

```html
<link href="css/foo.css" type="text/css">
<link rel="stylesheet">
<link rel="stylesheet" href="css/foo.css" type="text/css">
```

You can put link elements anywhere, both in the body and head. Make sure you
use the format `<link rel="stylesheet" href="css/foo.css" type="text/css">`.


## CSS Styles

> Valid

```html
<style>
    .foo {
        color: blue;
    }
</style>
<style>
    abcdefg
</style>
<style></style>
```

> Invalid

```html
<sty>
    abcdefg
</sty>
```

You can also put css directly in `<style>` tags.


## Inline Javascript

> Valid

```html
<script>
    console.log('foobarbaz');
</script>
<script>abcdefg</script>
<script></script>
```

> Invalid

```html
<script src="foo.js">
    console.log('bar');
    // In this case, foo.js is loaded and console.log('bar')
</script>
<script>abcdefg</script>
<script></script>
```

You can inline javascript code anywhere. Code in the head will be ran before the
the body is loaded.


## External Javascript

> Valid

```html
<script src="foo.js"></script>
<script src="path/to/foo.js">
    console.log('bar');
    // In this case, path/to/foo.js is loaded and console.log('bar')
</script>
<script src="foo.js" bar="baz"></script>
```

> Invalid

```html
<script></script>
<script src="foo.js">
```

You can use external javascript code
(`<script src="path/to/javascriptfile.js"></script>`) anywhere. Code in the head
will be ran before the body is loaded.