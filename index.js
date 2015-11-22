

module.exports={
    Service:require('./lib/service'),
    Provider:require('./lib/provider'),
    factory:require('./lib/factory'),
    noop:require('./lib/noop'),
    interval:require('./lib/interval'),
    debounce:require('./lib/debounce'),
    $Cookie:require('./lib/provider.cookie'),
    $Local:require('./lib/provider.local'),
    $Session:require('./lib/provder.session'),
    $OData:require('./lib/provider.odata'),
    $Rest:require('/lib/provider.rest'),
    $Template:require('./lib/provider.template'),
    $Pagination:require('./lib/provider.pagination'),
    $Sort:require('./lib/provider.sort'),
    $Navigation:require('./lib/provder.navigation'),
    Notify:require('./lib/services'),
    Validation:require('./lib/services'),
    Search:require('./lib/services'),
    Dialog:require('./lib/services'),
    Store:require('./lib/services'),
    Sort:require('./lib/services')
};
