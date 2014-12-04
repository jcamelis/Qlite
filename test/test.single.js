QUnit.test( "simple Defer", function( assert ) {
    
    var defer = Q.defer();
    var actual = false;
    defer.then(function () {
        actual = true;
    });
    
    assert.ok(!actual, "Not triggered yet!");
    
    defer.resolve();
    
    assert.ok(actual, "Already triggered");
});