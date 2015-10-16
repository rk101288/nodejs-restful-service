module.exports = {
    customSort: function customSort(sortBy, sortOrder, transformer) {

        var key = transformer ? function (x) { return transformer(x[sortBy]) } : function (x) { return x[sortBy] };

        sortOrder = sortOrder == 'asc' ? 1 : -1;

        return function (a, b) {
            a = key(a);
            b = key(b);
            return sortOrder * ((a > b) - (b > a));
        }
    }
};