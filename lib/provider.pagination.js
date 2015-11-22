/*
 * =============================================================
 * elliptical.$Pagination
 * =============================================================
 * returns a pagination ui context(object) for template binding
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./provider'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./provider'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Pagination = factory(root.elliptical.Provider);
        root.returnExports = root.elliptical.$Pagination;
    }
}(this, function (Provider) {
    /**
     * @param paginate {Object}
     * @param pagination {Object}
     * @param data {Object}
     * @returns {Object}
     */


    var $Pagination;
    $Pagination = Provider.extend({
        count: 'count',
        data: 'data',
        spread: 10,

        /**
         *
         * @param {object} params
         * @param {object} data
         * @returns {{pagination, data}|*}
         * @public
         */
        get: function (params, data) {

            var count_ = this.count;
            var data_ = this.data;
            var spread_ = this.spread;

            if (params.paginate) params = params.paginate;

            return _pagination(params, data);

            /**
             *
             * @param {object} params
             * @param {object} result
             *
             * @returns {object}
             * @qpi private
             */
            function _pagination(params, result) {
                var baseUrl, rawUrl, page, count, pageSize, pageSpread, data;
                baseUrl = params.baseUrl;
                rawUrl = params.rawUrl;
                page = params.page;


                if (result instanceof Array) {
                    count = result.length;
                    data = result;

                } else {
                    count = result[count_];
                    data = result[data_];
                    if (count === undefined) count = result.count;
                    if (data === undefined) data = result.data;
                }


                pageSize = params.pageSize;
                pageSpread = spread_;
                try {
                    page = parseInt(page);
                } catch (ex) {
                    page = 1;
                }

                var pageCount = parseInt(count / pageSize);
                var remainder = count % pageSize;
                if (pageCount < 1) pageCount = 1;
                else if (remainder > 0) pageCount++;

                //query search part of url
                var querySearch = getQuerySearch(rawUrl);

                //pagination object
                var pagination = {
                    page: page,
                    pageCount: pageCount,
                    prevPage: baseUrl + '/1',
                    firstPage: null,
                    prevClass: 'hide',
                    nextPage: baseUrl + '/' + pageCount,
                    nextClass: 'hide',
                    lastPage: null,
                    pages: [],
                    beginRecord: null,
                    endRecord: null,
                    count: count

                };
                //assign pagination properties
                //prev
                if (page > 1) {
                    pagination.prevClass = '';
                    pagination.prevPage = assignUrl(baseUrl, parseInt(page - 1), querySearch);
                }
                //next
                if (page < pageCount) {
                    pagination.nextClass = '';
                    pagination.nextPage = assignUrl(baseUrl, parseInt(page + 1), querySearch);
                }

                //get page links

                if (pageCount > 1) pagination.pages = _pageLinks(baseUrl, page, pageCount, pageSpread, querySearch);


                //first,last pages
                pagination.firstPage = assignUrl(baseUrl, 1, querySearch);
                pagination.lastPage = assignUrl(baseUrl, pageCount, querySearch);
                if (page === pageCount) pagination.nextPage = pagination.lastPage;

                //assign record pointers
                var currentPointer = assignRecordPointers(count, page, pageSize);
                pagination.beginRecord = currentPointer.beginRecord;
                pagination.endRecord = currentPointer.endRecord;

                return {
                    pagination: pagination,
                    data: data
                };

            }


            /**
             *
             * @param {string} baseUrl
             * @param {number} page
             * @param {number} pageCount
             * @param {number} pageSpread
             * @param {string} querySearch
             * @returns {Array}
             * @api private
             */
            function _pageLinks(baseUrl, page, pageCount, pageSpread, querySearch) {
                var pages = [];
                if (pageSpread > pageCount) {
                    pageSpread = pageCount;
                }

                if (page < pageSpread) {

                    for (var i = 0; i < pageSpread; i++) {
                        var obj = {
                            page: i + 1,
                            pageUrl: assignUrl(baseUrl, parseInt(i + 1), querySearch)
                        };

                        if (i === parseInt(page - 1)) obj.activePage = 'active';
                        pages.push(obj);
                    }
                    return pages;
                } else {
                    var halfSpread = parseInt(pageSpread / 2);
                    var beginPage, endPage;
                    if (pageCount < page + halfSpread) {
                        endPage = pageCount;
                        beginPage = endPage - pageSpread;
                    } else {
                        endPage = page + halfSpread;
                        beginPage = page - halfSpread;
                    }
                    for (var i = beginPage; i < endPage + 1; i++) {
                        var obj = {
                            page: i,
                            pageUrl: assignUrl(baseUrl, i, querySearch)
                        };
                        if (i === page) obj.activePage = 'active';
                        pages.push(obj);
                    }
                    return pages;
                }
            }

            function assignUrl(baseUrl, index, querySearch) {

                var pageUrl = baseUrl + '/' + index;
                if (querySearch && querySearch !== undefined) pageUrl += querySearch;
                return pageUrl;
            }

            function assignRecordPointers(count, page, pageSize) {
                var beginRecord = (page - 1) * pageSize + 1;
                if (count === 0) beginRecord = 0;
                var endRecord = page * pageSize;
                if (endRecord > count) endRecord = count;
                return {
                    beginRecord: beginRecord,
                    endRecord: endRecord
                };
            }

            function getQuerySearch(url) {
                var index = url.indexOf('?');
                var length = url.length;
                if (index > -1) return url.substring(index, length);
                else return null;
            }

        }


    }, {});


    return $Pagination;


}));
