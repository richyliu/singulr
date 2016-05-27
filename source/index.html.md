---
title: Singulr API Reference

languages:
  - javascript

toc_footers:
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

includes:
  - errors

search: true
---

# Introduction

Welcome to the Kittn API! You can use our API to access Kittn API endpoints, which can get information on various cats, kittens, and breeds in our database.

We have language bindings in Shell, Ruby, and Python! You can view code examples in the dark area to the right, and you can switch the programming language of the examples with the tabs in the top right.

This example API documentation page was created with [Slate](https://github.com/tripit/slate). Feel free to edit it and use it as a base for your own API's documentation.



# Constructor

```javasrcipt
Singulr.init(options)
```

### Options

Parameter | Description
--------- | ------------
onPageLoaded | A function that fires when the the current page has been loaded
onDependenciesLoaded | A function that fires when the dependencies have been loaded, but the current page hasn't been loaded yet
analyticNodes | A list of DOM nodes that are added every time a page is loaded (for things like Google Analytics)
HOME_PAGE | A string representing the home page, which is loaded when the user visits the index.html directly (default: `home.html`)
BASE_PAGE | A string representing the base page, which includes things like the navbar and footer and is loaded on every page (default: `base.html`)
PAGE_404 | A string representing the 404 page, which is loaded when the page the user is looking for isn't found (default: `404.html`)
PAGE_ID | A string representing the id of the div which the base is loaded into (default: `page`)
CONTENT_ID | A string representing the id of the div which the actual page is loaded into (default: `content`)
<aside class="warning">
  The CONTENT_ID div is inside the base, not the index file.
</aside>


# Kittens

## Get All Kittens

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.get
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.get()
```

```shell
curl "http://example.com/api/kittens"
  -H "Authorization: meowmeowmeow"
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 1,
    "name": "Fluffums",
    "breed": "calico",
    "fluffiness": 6,
    "cuteness": 7
  },
  {
    "id": 2,
    "name": "Max",
    "breed": "unknown",
    "fluffiness": 5,
    "cuteness": 10
  }
]
```

This endpoint retrieves all kittens.

### HTTP Request

`GET http://example.com/api/kittens`

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
include_cats | false | If set to true, the result will also include cats.
available | true | If set to false, the result will include kittens that have already been adopted.

<aside class="success">
Remember — a happy kitten is an authenticated kitten!
</aside>

## Get a Specific Kitten

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "name": "Max",
  "breed": "unknown",
  "fluffiness": 5,
  "cuteness": 10
}
```

This endpoint retrieves a specific kitten.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET http://example.com/kittens/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the kitten to retrieve

