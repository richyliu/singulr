# Installation Guide (advanced)

## Add Singulr

> Add this code to the bottom of the body

```html
<script src="https://rawgit.com/richyliu/singulr/release/singulr.min.js"></script>
```

Start off by adding singulr.min.js to your website, preferably at the bottom of
the body.

> Example

```javascript
Singulr.init({
  dependencies: {
    javascript: [
      'foo/bar.js',
      'main.js'
    ], css: [
      'stylesheet.css',
      'http://example.com/foo.css'
    ]
  }
})
```


## Add dependencies

Then, add your dependencies that aren't necessary to the dependencies in
[options](#options)