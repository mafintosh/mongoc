# mongoc

Mongoc lets you compile mongodb queries into Javascript functions that returns true if the query fits the input

It's available through npm:

	npm install mongoc

It's easy to use

``` js
var mongoc = require('mongoc');

var query = mongoc({
	hello:'world',
	time:{
		$gt:10,
		$lt:20
	}
});

console.log(query({hello:world, time:14})) // prints true;
```

You can use the query to filter an array

``` js
var query = mongoc({
	hello:{$in:['world','mondo']}
});

console.log([{hello:'world'},{hello:'verden'},{hello:'mondo'},{hello:'welt'}].filter(query));
```

For a complete reference of the query language see [the mongo docs](http://www.mongodb.org/display/DOCS/Advanced+Queries)