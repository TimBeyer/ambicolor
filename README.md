Ambicolor
==============

This is an experiment for using *Web workers* to create
an ambilight-like effect based on the HTML5 video tag.

Each frame, it posts the imageData to the webworker, which 
in turn calculates a color to be displayed.

Because of [a bug in chrome](http://code.google.com/p/chromium/issues/detail?id=68190) when working with imageData and webworkers,
Chrome will leak gigabytes of memory and then crash.

If you want to try this out, use firefox instead.