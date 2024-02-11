## How to process config.jome?

I don't want to have to write a file config.js

I want it to be in memory only.

With eval, __dirname is not OK. __dirname is at the value of the source file who called eval.

An in-memory only file would be nice. So I could require it. It is technically possible from what I've read.
But I don't know how to do that.

TOOD: Try testing with npm package tmp some more, but is it really in-memory only? I don't want to write to a tmp file.

In unix, I could use something like tmpfs

But unfortunately I have to support Windows...

How about simply piping? Piping code to node.js?