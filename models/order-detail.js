var Q = require('q');
var mustache = require('mustache');

var product = require('./product');
var db = require('../app-helpers/dbHelper');

exports.insertAll = function(cart, orderId) {

    var deferred = Q.defer();

    var promises = [];

    for (var i = 0; i < cart.length; i++) {
        var entity = {
            OrderID: orderId,
            ProID: cart[i].product.ProID,
            Quantity: cart[i].quantity,
            Price: cart[i].product.Price,
            Amount: cart[i].amount
        };

        var sql =
            mustache.render(
                'insert into orderdetails (OrderID, ProID, Quantity, Price, Amount) values ({{OrderID}}, {{ProID}}, {{Quantity}}, {{Price}}, {{Amount}})',
                entity
            );

        var promise = db.insert(sql);
        promises.push(promise);
    }

    Q.all(promises).then(function(idList) {
        deferred.resolve(idList);
    });

    return deferred.promise;
}