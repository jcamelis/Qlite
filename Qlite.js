/*global self:true */

/**
 *
 * Author: https://github.com/jcamelis
 */
(function () {
    "use strict";
    var PENDING = 'pending';
    var RESOLVED = 'resolved';
    var REJECTED = 'rejected';
    /**
    * @param {Object} param
    * @returns {Boolean}
    */
    function isFunction(param) {
        return typeof param === 'function';
    }
    /**
     *
     * @returns {Promise}
     */
    function Promise() {
        this.stack = [];
        this.dependsStack = [];
        this.catchStack = [];
        this.status = PENDING;
        this.reason = '';
        this.resolvedArgs = [];
    }
    /**
     * @param {Object} param
     * @returns {Boolean}
     */
    function isPromise(param) {
        return param instanceof Promise;
    }
    /**
     *
     * @returns {Boolean}
     */
    Promise.prototype.isPending = function () {
        return this.status === PENDING;
    };
    /**
     *
     * @returns {Boolean}
     */
    Promise.prototype.isResolved = function () {
        return this.status === RESOLVED;
    };
    /**
     *
     * @returns {Boolean}
     */
    Promise.prototype.isRejected = function () {
        return this.status === REJECTED;
    };
    /**
     *
     * @returns {void}
     */
    Promise.prototype.resolve = function () {
        if (this.isPending()) {
            this.status = RESOLVED;
            this.resolvedArgs = Array.prototype.slice.call(arguments, 0);
            var i;
            for (i = 0; this.stack.length > i; i += 1) {
                if (isFunction(this.stack[i])) {
                    this.stack[i].apply(this.stack[i], this.resolvedArgs);
                }
            }
        }
    };
    /**
    * @param {String} reason
    * @returns {void}
    */
    Promise.prototype.reject = function (reason) {
        if (this.isPending()) {
            this.status = REJECTED;
            this.reason = reason;
            var i;
            for (i = 0; this.catchStack.length > i; i += 1) {
                if (isFunction(this.catchStack[i])) {
                    this.catchStack[i].call(this.catchStack[i], this.reason);
                }
            }
        }
    };
    /**
     *
     * @param {function} callback
     * @returns {Promise.prototype}
     */
    Promise.prototype.then = function (callback) {
        if (isFunction(callback)) {
            if (this.isPending()) {
                this.stack.push(callback);
            } else {
                callback.call(callback, this.resolvedArgs);
            }
        } else {
            throw new TypeError("Expected callback to be a function.");
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

        if (isPromise(promise)) {
            this.dependsStack.push(promise);
            promise.then(function () {
                var i;
                for (i = 0; that.dependsStack.length > i; i += 1) {
                    if (that.dependsStack[i].isPending()) {
                        return;
                    }
                }
                that.resolve();
            }).catch(function (reason) {
                that.reject(reason);
            });
        } else {
            throw new TypeError("Expected promise to be a Promise instance");
        }
        return this;
    };
    /**
     * 
     * @param {function} callback
     * @returns {Promise}
     */
    Promise.prototype["catch"] = function (callback) {
        if (isFunction(callback)) {
            
            if (this.isPending()) {
                this.catchStack.push(callback);
            } else {
                callback.call(callback, this.reason);
            }
        } else {
            throw new TypeError("Expected callback to be a function.");
        }
        return this;
    };
    /**
     *
     * @type Object
     */
    var q = {
        /**
         *
         * @param {Array} promiseArray
         * @returns {Promise}
         */
        all: function (promiseArray) {
            var deferred = new Promise(),
                i;
            for (i = 0; promiseArray.length > i; i += 1) {
                if (isPromise(promiseArray[i])) {
                    deferred.depends(promiseArray[i]);
                } else {
                    throw new TypeError("Promise instance expected.");
                }
            }
            return deferred;
        },
        /**
         *
         * @returns {Promise}
         */
        defer: function () {
            return new Promise();
        }
    };
    if (self) {
        self.Q = q;
    } else {
        window.Q = q;
    }
}());
