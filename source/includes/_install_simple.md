# Installation Guide (simple)



## Add Singulr


### Include script

> Add this code to the bottom of the body

```html
<script src="https://rawgit.com/richyliu/singulr/release/singulr.min.js"></script>
```

Start off by adding singulr.min.js to your website, preferably at the bottom of
the body.


### Init Singulr

> Example

```javascript
Singulr.init({
  onPageLoaded: function() {
    console.log(Singulr.getPage())
  },
  PAGE_ID: 'the_page_id',
  CONTENT_ID: 'the_content_id',
  dependencies: {
    javascript: [
      'https://code.jquery.com/jquery-2.2.0.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js',
    ],
    css: [
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
      'css/main.css'
    ]
  }
});
```

Init Singulr with `Singulr.init()`. You can provide [options](#options) as well.



## Add Redirect Script

> Make sure you add this code first inside the head, so it executes first before anything else.

```html
<script id="singulr-ignore">var a=window.location.href;window.location.href='/index.html?'+encodeURIComponent(a.match(/[^\/](\/[\w\%\-\_]+(\.[a-zA-Z]+)?)+(?:(?=\#|\?)|$)/)[0].substr(1))</script>
```

Add this code to the top of the head in every [page](#page) except for the
[index page](#index-page).



