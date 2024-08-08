let path0 = /*~path #.*/(__dirname)
let path1 = /*~path #/some/absolute/path.txt*/("/some/absolute/path.txt")
let path2 = /*~path #./someFile.jome*/(path.join(__dirname, "someFile.jome"))
let path3 = /*~path #../otherDir/"some file with spaces.txt"*/(path.join(__dirname, "./otherDir/some file with spaces.txt"))
let path4 = /*~path #cwd/someFile.txt*/(path.resolve("./someFile.txt")) // Allow paths after #cwd to get files inside current working directory.

// or

// actually path here adds no pertinent information, one thing that could be done is to show inside
// the editor for paths, the name of the file as a link (instead of path.join(__dirname, ...))
// and show if it is an absolute link, a relative link, a cwd link, somehow

let path0 = /*~path*/(__dirname)
let path1 = /*~path*/("/some/absolute/path.txt")
let path2 = /*~path*/(path.join(__dirname, "someFile.jome"))
let path3 = /*~path*/(path.join(__dirname, "./otherDir/some file with spaces.txt"))
let path4 = /*~path*/(path.resolve("./someFile.txt")) // Allow paths after #cwd to get files inside current working directory.

// maybe

let path5 = /*~path #~/Downloads/someFile.txt*/() // Maybe
