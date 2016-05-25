#!/usr/bin/env python

import httplib, urllib, sys



filename = sys.argv[1]
f = open(filename, 'r+')

code = f.read()


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


print(data)

f.seek(0)
f.write(data)
f.truncate()



conn.close()

f.close()