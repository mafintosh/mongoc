var FNS = {};

FNS.$eq = function(key, val) {
	return 'doc['+key+'] === '+val;
};
FNS.$exists = function(key, val) {
	return key+' in doc === '+val;
};
FNS.$pattern = function(key, val, raw) { // reduced from $regex
	return raw+'.test(doc['+key+'])';
};
FNS.$mod = function(key, val, raw) {
	return 'doc['+key+'] % '+raw[0]+' === '+raw[1];
};
FNS.$ne = function(key, val) {
	return 'doc['+key+'] !== '+val;
};
FNS.$gt = function(key, val) {
	return 'doc['+key+'] > '+val;
};
FNS.$gte = function(key, val) {
	return 'doc['+key+'] >= '+val;
};
FNS.$lt = function(key, val) {
	return 'doc['+key+'] < '+val;
};
FNS.$lte = function(key, val) {
	return 'doc['+key+'] <= '+val;
};
FNS.$in = function(key, vals) {
	return vals+'.indexOf(doc['+key+']) !== -1';
};
FNS.$nin = function(key, vals) {
	return vals+'.indexOf(doc['+key+']) === -1';
};
FNS.$size = function(key, val) {
	return 'doc['+key+'].length === '+val;
};

var map = function(key, val) {
	var obj = {};
	obj[key] = val;
	return obj;
};

var compile = function(query) {
	var rels = [];

	Object.keys(query).forEach(function(key) {
		var ops = typeof query[key] === 'object' ? query[key] || {} : {$eq:query[key]};

		var join = function(op) {
			return query[key].map(compile).join(op);
		};

		if (ops instanceof RegExp) {
			ops = {$pattern:ops.toString()};
		}
		if (ops.$regex) {
			ops.$pattern = '/'+ops.$regex+'/'+ops.$options;
		}

		if (ops.$not)       return rels.push('!'+compile(map(key, ops.$not)));
		if (key === '$nor') return rels.push('!('+join(' || ')+')');
		if (key === '$or')  return rels.push('('+join(' || ')+')');
		if (key === '$and') return rels.push('('+join(' && ')+')');

		Object.keys(ops).forEach(function(op) {
			if (!FNS[op]) return;
			rels.push(FNS[op](JSON.stringify(key), JSON.stringify(ops[op]), ops[op]));
		});
	});

	return '('+(rels.length < 2 ? rels[0] || 'true' : rels.join(' && '))+')';
};

module.exports = function(query) {
	return new Function('doc', '\treturn '+compile(query)+';');
};
