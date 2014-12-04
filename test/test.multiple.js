QUnit.test( "Multiple Defer", function( assert ) {
    
    var defer1 = Q.defer();
    var defer2 = Q.defer();
    var actual = false;

    Q.all([defer1, defer2]).then(function () {
        actual = true;
    });
    
    assert.ok(!actual, "Not triggered yet!");
    
    defer1.resolve();
    
    assert.ok(!actual, "Not triggered yet!");
    
    defer2.resolve();
    
    assert.ok(actual, "already triggered");
});