var request = require( "request" );
var extend = require( "extend" );
var queryString = require( "query-string" );

var def = {
  protocol: "http",
  host: "localhost",
  port: 8000
};

module.exports = function( app, defaults ) {
  var config = extend( def, defaults );

  var proxy = {
    get: mapping( "GET" ),
    post: mapping( "POST" ),
    put: mapping( "PUT" ),
    delete: mapping( "DELETE" ),
    del: mapping( "DELETE" ),
    patch: mapping( "PATCH" ),
    option: mapping( "OPTION" ),
    all: mapping( "ALL" )
  };

  function mapping( method ) {
    return function( path ) {
      app[ method.toLowerCase() ]( path, function( req, res ) {
        var destiny = config.protocol + "://" + config.host + ":" + config.port + req.path;

        if ( req.query ) {
          destiny += "?" + queryString.stringify( req.query );
        }

        console.log( req.method + "\t" + destiny );

        req.url = destiny;
        req.body = req.body ? JSON.stringify( req.body )  : null;

        request( req ).pipe( res );
      });
    };
  }

  return proxy;
};