var Q = require('q');
var db = require('../app-helpers/dbHelper');
var mustache = require('mustache');

exports.loadAll = function() {

    var deferred = Q.defer();

    var sql = 'select * from danhmuc';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.insert = function(entity) {

	var deferred = Q.defer();
    var sql = mustache.render(
        'insert into danhmuc(tendanhmuc) values("{{catName}}")',
        entity
    );
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });
    return deferred.promise;
}

exports.update = function(entity) {
	var deferred = Q.defer();
    var sql = mustache.render(
        'update danhmuc set tendanhmuc = "{{catName}}" where id = {{catId}}',
        entity
    );
    db.update(sql).then(function(changedRows){
    	deferred.resolve(changedRows);
    });

    return deferred.promise;
}

exports.delete = function(entity) {
	var deferred = Q.defer();

    var sql = mustache.render(
        'delete from danhmuc where id = {{id}}',
        entity
    );

    db.delete(sql).then(function(affectedRows) {
    	deferred.resolve(affectedRows);
    });

    return deferred.promise;
}

exports.loadDetail = function(id) {
    var d = Q.defer();

    var obj = {
        CatID: id
    };

    var sql = mustache.render(
        'select * from danhmuc where id = {{CatID}}',
        obj
    );

    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}