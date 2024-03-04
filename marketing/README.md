It would be nice to do a video like the old rails video make a blog in 5 minutes.

I am thinking the following script:

Let's make a website from scratch in the Jome programming language.

In an empty directory, let's create a file called server.jome.

It it, let's write: ..."Un hello world avec express.js"...

We can run it with jome server.jome. (Open browser page at localhost:3000/). It works.

Now instead of calling jome server.jome everything, let's create a index.jome file.

In it, let's write: "import server from './server.jome'; with cmd end; if cmd == 's' or cmd == 'server': server()"

Alright now we can simply do `jome s`

Let's create a view. For the demo data, we are going to use an LLM to generate this data.

(Create views/home.html.jome)

(Add a build command to index.jome)

(Compile the file to docs folder)


## ...

Jome is designed to be easy and customizable.

You can use a lot of different syntaxes, and by default they all do the same thing so you don't have to learn all the peculiarities.

(|| vs or), (for of vs for in) (all kinds of quotes)

But it is customizable so you can add differences to all those things.

- You can choose if || and or have a different priority
- You can choose if for of and for in are like js, or for in is more like other programming languages for arrays.
- You can choose how to handle quotes
- You can choose what operators do