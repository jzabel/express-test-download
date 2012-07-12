/**
 * Module dependencies.
 */

var express = require('express'),
    app     = express.createServer();


app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'mustache');
    app.register('.mustache', require('stache'));
    app.use(express.static(__dirname + '/../public'));
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'superSecret'
     }));
    //app.use(everyauth.middleware()); //use everyauth for login middleware
    app.use(app.router);
});

app.get('/', function(req, res){

    res.render('index', {
        locals: {
            title: 'Main Page'
        }, 
        layout: 'layout'
    })

});

// /files/* is accessed via req.params[0]
// but here we name it :file
app.get('/files/:file(*)', function(req, res, next){
  var file = req.params.file
    , path = __dirname + '/files/' + file;

  res.download(path);
});

app.get('/parent_folder', function(req, res, next){
    // *********************************************
    //EDIT THIS TO BE THE ABSOLUTE PATH OF YOUR FILE
    // *********************************************
    var file = '/Users/jzabel/data/express-test-download/public/sample-1.jpeg'
    console.log("File is : " + file);
    res.download(file);
});

app.get('/parent_folder_err', function(req, res, next){
    console.log("CWD is : " + __dirname);
    var file = __dirname + "/../../public/sample-1.jpeg";
    console.log("File is : " + file);
    res.download(file);
});

app.get('/404', function(req, res){
    res.render('404',{
        locals: {
            title:'Page Not Found',
            error: 404
        },
        layout: 'layout'
    });

});

// error handling middleware. Because it's
// below our routes, you will be able to
// "intercept" errors, otherwise Connect
// will respond with 500 "Internal Server Error".
app.use(function(err, req, res, next){
  // special-case 404s,
  // remember you could
  // render a 404 template here
  if (404 == err.status) {
    res.statusCode = 404;
    //res.send('Cant find that file, sorry!');
    res.render('404', {status:404});
  } else {
    next(err);
  }
});

app.listen(3000);
console.log('Express started on port 3000');
