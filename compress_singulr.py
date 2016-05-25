#!/usr/bin/env python

import httplib, urllib, sys, re



f = open('singulr.js', 'r')

code = f.read()

f.close()


# make code production ready
code = re.sub('// \(function \(document, window\) \{', '(function (document, window) {', code)
code = re.sub('// \}\(document, window\)\);', '}(document, window));', code)

print(code)


# Define the parameters for the POST request and encode them in a URL-safe format.
params = urllib.urlencode([
    ('js_code', code),
    ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
    ('language', 'ECMASCRIPT5'),
    ('output_format', 'text'),
    ('output_info', 'compiled_code')
])


# Always use the following value for the Content-type header.
headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)

response = conn.getresponse()
data = response.read()

conn.close()


print(data)


w = open('singulr.min.js', 'r+')

w.seek(0)
w.write(data)
w.truncate()

w.close()




