window.location.href = '/singulr/index.html?' +
    encodeURIComponent(window.location.href.match(/[^\/](\/[\w\%\-\_]+(\.[a-zA-Z]+)?)+(?:(?=\#|\?)|$)/)[0]
    .substr(1));