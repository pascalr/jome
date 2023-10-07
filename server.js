import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import http from 'http';
import debugModule from 'debug';
import fs from 'fs';

import {buildFile} from './src/builder.js';

import * as esbuild from 'esbuild'

const debug = debugModule('cv:server');
//import _ from 'lodash';

function createFileWithDirectories(filePath, content) {
  const dirname = path.dirname(filePath);

  // Create the required directories
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  // Create the file
  fs.writeFileSync(filePath, content);
}


function splitObjId(objId) {
  const index = objId.search(/[0-9]/);
  if (index === -1) {throw "Wrong obj id"}
  return {objClass: objId.substring(0, index), objNb: objId.substring(index)}
}

class JomeServerSide {

  constructor(projectName) {

    this.projectName = projectName

  }

  // getObjectsById() {
  //   let objs = JSON.parse(this.objectsSerialized)
  //   let objectsById = (objs || []).filter(o => o).reduce((acc, item) => {
  //     acc[item.objId] = item;
  //     return acc;
  //   }, {});
  //   return objectsById
  // }

  // getObjectsByClass() {
  //   let objs = JSON.parse(this.objectsSerialized)
  //   let objectsById = (objs || []).filter(o => o).reduce((acc, item) => {
  //     let {objClass} = splitObjId(item.objId)
  //     acc[objClass] = [...(acc[objClass] || []), item];
  //     return acc;
  //   }, {});
  //   return objectsById
  // }

  replaceObjects(objects) {
    this.objectsSerialized = objects
  }

  load() {
    try {
      this.objectsSerialized = fs.readFileSync(path.join(__dirname, 'projects', this.projectName, '_objects.json'), 'utf8');
    } catch (err) {
      console.error('Error reading data from file', err);
      return null;
    }
  }

  save(filename) {
    const json = JSON.stringify(this.objectsSerialized, null, 2); // Convert the data object to JSON with 2 spaces indentation
    fs.writeFile(path.join(__dirname, 'projects', this.projectName, filename), json, function(err) {
      if (err) {
        console.error('Error saving data to file', err);
      } else {
        console.log(`Data saved to ${filename}`);
      }
    });
  }

}

// let _ = <%- JSON.stringify(objectsById) %>

// <% (Object.keys(objectsById)).forEach(id => { -%>
//   <% if (id.startsWith('FUNC')) { -%>
//       <% let o = objectsById[id]; -%>
//       <% let p = objectsById[o.objParent] -%>
//       <% if (p) { -%> 
//         _.<%= p.objId %>.<%= o.objName %> = () => {<%- o.code %>}
//       <% } -%>
//   <% } -%>
// <% }); -%>

var app = express();
var projectsList = []
var projectTree = null
var port = null
var server = null

//import { enableLiveReload } from './src/livereload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildFileTree(folderPath, isDirectory = null) {
  const name = path.basename(folderPath);

  const isDir = isDirectory === null ? fs.statSync(folderPath).isDirectory() : isDirectory

  if (!isDir) {
    return { name, type: 'file' };
  }

  const children = fs.readdirSync(folderPath, { withFileTypes: true })
    .map(child => buildFileTree(path.join(folderPath, child.name), child.isDirectory()));

  return { name, type: 'folder', children };
}

function buildDirList(folderPath) {
  return fs.readdirSync(folderPath, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
}

function setupExpress() {

  //enableLiveReload(app)

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.locals.locale = 'fr'
  app.locals.gon = {projectsList}
  app.locals.NODE_ENV = process.env.NODE_ENV

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.text());
  app.use(express.urlencoded({ extended: false }));

  app.use(express.static(path.join(__dirname, 'node_modules/p5/lib')));
  app.use(express.static(path.join(__dirname, 'src')));

  app.get('/src/:name', function(req, res, next) {
    res.redirect('/'+req.params.name)
  })

  app.get('/', function(req, res, next) {
    res.render('index')
  })

  app.get('/jome_file/:name', function(req, res, next) {

    res.sendFile(path.join(__dirname, 'docs', 'src', req.params.name+'.jome'))
  })

  app.get('/jome_lib.js', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'node_modules/jome_lib/jome_lib.js'))
  })

  // app.get('/jome_v9.js', function(req, res, next) {
  //   res.sendFile(path.join(__dirname, 'jome_v9.js'))
  // })

  app.get('/p/:name', function(req, res, next) {

    let jome = new JomeServerSide(req.params.name)
    jome.load()

    res.locals.projectName = req.params.name
    res.locals.gon = {
      ...app.locals.gon,
      projectName: jome.projectName,
      objects: jome.objectsSerialized,
    }
    res.locals.jomeServerSide = jome
    res.render('project')
  })

  app.get('/e/:name', function(req, res, next) {

    let projectName = req.params.name
    let filePath = path.join(__dirname, 'docs/src', projectName+'.jome')

    if (!fs.existsSync(filePath)) {
      createFileWithDirectories(filePath, '');
      console.log('Empty file created.');
    }
    
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error('Error reading data from file', err);
      return null;
    }

    res.locals.projectName = projectName
    res.locals.gon = {
      ...app.locals.gon,
      projectName: projectName,
      content
    }
    res.render('edit')
  })

  // Get compiled file
  app.get('/c/:name', function(req, res, next) {

    let fileName = req.params.name
    //let relPath = path.join('docs/src', fileName)
    let filePath = path.join(__dirname, 'docs/src', fileName)

    if (!fs.existsSync(filePath)) {
      createFileWithDirectories(filePath, '');
      console.log('Empty file created.');
    }

    let buildFileName = buildFile(filePath, [], true)
    if (buildFileName) {
      let bundleFileName = buildFileName.slice(0,buildFileName.length-9)+'.bundle.js'
      esbuild.build({
        entryPoints: [buildFileName],
        bundle: true,
        outfile: bundleFileName,
      }).then(() => {
        res.sendFile(bundleFileName)
      })
    } else {
      res.send('ERROR BUILDING FILE')
    }
  })

  app.get('/v/:name', function(req, res, next) {

    let projectName = req.params.name
    let filePath = path.join(__dirname, 'docs/src', projectName+'.jome')

    if (!fs.existsSync(filePath)) {
      throw "Invalid view file"
    }
    
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error('Error reading data from file', err);
      return null;
    }

    res.locals.projectName = projectName
    res.locals.gon = {
      ...app.locals.gon,
      projectName: projectName,
      content
    }
    res.render('view')
  })

  app.post('/p/:name/save', function(req, res, next) {
    let jome = new JomeServerSide(req.params.name)
    jome.replaceObjects(req.body.objects)
    jome.save('_objects.json')
    res.sendStatus(200)
  })

  app.post('/e/:name/save', function(req, res, next) {
    let projectName = req.params.name
    console.log('body', req.body)
    fs.writeFile(path.join(__dirname, 'docs/src', projectName+'.jome'), req.body, function(err) {
      if (err) {
        console.error('Error saving data to file', err);
      } else {
        console.log(`Data saved to successfully`);
      }
    });
    res.sendStatus(200)
  })

  app.use(express.static(path.join(__dirname, 'docs')));
  app.use(express.static(path.join(__dirname, 'assets')));
  app.use(express.static(path.join(__dirname, 'node_modules'))); // FIXME: Only serve ace

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {

    if (typeof err === 'string') {
      res.locals.message = err;
      res.locals.error = {};
    } else {
      res.locals.message = err.message;
      res.locals.error = err;
    }

    //console.error(err)

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // named pipe
  }

  if (port >= 0) {
    return port; // port number
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function main() {

  //projectTree = buildFileTree(path.join(__dirname, 'uploads'))
  //console.log('uploadsTree', projectTree)

  projectsList = buildDirList(path.join(__dirname, 'docs/src'))

  setupExpress()

  port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  server = http.createServer(app);
  // Listen on provided port, on all network interfaces.
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}
main()