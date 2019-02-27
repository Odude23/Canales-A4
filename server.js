const express = require('express');
const app = express();

// install session module first using 'npm install express-session'
var session = require('express-session'); 
app.use(session({ secret: 'happy jungle', 
                  resave: false, 
                  saveUninitialized: false, 
                  cookie: { maxAge: 60000 }}))

app.get('/', songs);
app.get('/add', add);
app.get('/sort', sort);
app.get('/remove', remove);
app.get('/clear', clear);
app.listen(process.env.PORT,  process.env.IP, startHandler())

function startHandler()
{
  console.log('Server listening on port ' + process.env.PORT)
}

function songs(req, res)
//display the song list as a default
{
  try
  {
    let result = {};
    if (req.session.songs != undefined)
    {
      result = {'songs':req.session.songs};
    }
    else
    {
      req.session.songs = [];
      result = {'songs':req.session.songs};
    }
  
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    let result = {};
    result = {'error' : e.message};
  }
}

function add(req, res)
//Adding Songs to the playlist
{
  try
  {
    let result = {};
    var object = {};
    req.session.songs.forEach(function (item) 
    {
          if(!object[item])
              object[item] = 0;
            object[item] += 1;
    })
    req.session.songs.push(req.query.song);
    result = {'songs':req.session.songs};
  
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    let result = {};
    result = {'error' : e.message};
  }
}

function remove(req,res)
//removing songs from the playlist
{
  try
  {
    let result = {};
    var index = req.session.songs.indexOf(req.query.song);
    if (index > -1) 
    {
      req.session.songs.splice(index, 1);
    }
  
    result = {'songs':req.session.songs};
  
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end('');
  }
    catch (e)
  {
    let result = {};
    result = {'error' : e.message};
  }
}  

function sort(req,res)
//sorting songs in the playlist
{
  let result = {};
  req.session.songs.sort();
  result = {'songs':req.session.songs};
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end('');
}

function clear(req,res)
//clearing songs in the playlist
{
  let result = {};
  req.session.songs = [];
  result = {'songs':req.session.songs};
    
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end('');
}

  

function instructions(req, res)
{
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("<h1>Favorite Song Playlist</h1>");
  res.write("<p>Use / to see your song list</p>");
  res.write("<p>Use /sort to sort your list</p>");
  res.write("<p>Use /add?song= to add a song to your list</p>");
  res.write("<p>Use /remove?song= to remove a song to your list</p>");
  res.write("<p>Use /clear to clear your list</p>");
  res.end('');
}