## Instructions

Node.js >= 0.10 is required!

Edit file *Gruntfile.js* and modify the following two lines to match your development environment:

```
var foswikiBase = grunt.option('foswiki') || '/opt/qwiki';
var checkoutBase = grunt.option('git') || '/opt/git';
```

Exec:
```
npm install && bower install && grunt install
```

Ensure *Grunt* is running while you are editing any *.scss* or *.js* file.
