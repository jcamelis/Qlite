/**
 * 
 * Author: https://github.com/jcamelis
 */
(function (Q) {
    "use strict";
    /**
     * 
     * @returns {Promise}
     */
    function Promise() {
        this.stack = [];
        this.dependsStack = [];
        this.status = 'pending';
    }
    /**
     * 
     * @returns {Boolean}
     */
    Promise.prototype.isPending = function () {
        return this.status === 'pending';
    };
    /**
     * 
     * @returns {void}
     */
    Promise.prototype.resolve = function () {
        this.status = 'resolved';
        var i;
        for (i = 0; this.stack.length > i; i += 1) {
            this.stack[i].apply(null, Array.prototype.slice.call(arguments, 0));
        }
    };

    Promise.prototype.reject = function () {
        this.status = 'rejected';
    };
    /**
     * 
     * @param {function} callback
     * @returns {Promise.prototype}
     */
    Promise.prototype.then = function (callback) {
        if (typeof callback === 'function') {
            if (this.isPending()) {
                this.stack.push(callback);
            } else {
                callback();
            }
        }
        return this;
    };
    /**
     * 
     * @param {Promise} promise
     * @returns {Promise.prototype}
     */
    Promise.prototype.depends = function (promise) {
        var that = this;
        
        if (promise instanceof Promise) {
            this.dependsStack.push(promise);
            promise.then(function () {
                var i;
                for (i = 0; that.dependsStack.length > i; i += 1) {
                    if (that.dependsStack[i].isPending()) {
                        return;
                    }
                }
                that.resolve();
            });
        }
        return this;
    };
    /**
     * @todo Implement
     * @returns {void}
     */
    Promise.prototype["catch"] = function () { };
    /**
     * 
     * @type Object
     */
    var q = {
        /**
         * 
         * @param {Array} callbackArray
         * @returns {Promise}
         */
        all: function (callbackArray) {
            var defered = new Promise(),
                i;
            for (i = 0; callbackArray.length > i; i += 1) {
                if (callbackArray[i] instanceof Promise) {
                    defered.depends(callbackArray[i]);
                }
            }
            return defered;
        },
        /**
         * 
         * @returns {Promise}
         */
        defer: function () {
            return new Promise();
        }
    };
    Q = q;
}(Q || window.Q));