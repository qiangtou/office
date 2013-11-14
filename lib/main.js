/**
 * Created by qiangtou on 13-10-28.
 */
!function () {
    var save = function (name, json) {
        name = 'office-' + name;
        if (json === undefined)json = {};
        localStorage.setItem(name, JSON.stringify(json));
    }
    var get = function (name, string) {
        name = 'office-' + name;
        var v = localStorage.getItem(name);
        return string ? v : (v ? JSON.parse(v) : v);
    }
    var id = get('id') | 0;
    /**
     * 日期件设置
     */
    var now = new Date,
        d = {
            now: $.datepicker.formatDate("yy-mm-dd", now)
        };
    d.from = '' + function () {
        var from = now - 7 * 86400000;
        return $.datepicker.formatDate("yy-mm-dd", new Date(from));
    }();

    $.datepicker.setDefaults({maxDate: 0});
    $('.date').datepicker({
        onSelect: function (v) {
            var k = this.dataset.model;
            k = k.split('.');
            office[k[0]][k[1]] = v;
        },
        defaultDate: -10
    });

    var keys = ['date', 'name', 'type', 'unit', 'num', 'price', 'total', 'remark', 'status', 'dept', 'user'];

    var dataFilter = {
        date: function (v) {
            var q = this,
                f = q.from,
                t = q.to;
            return true;
        },
        name: function (v) {
            var q = this,
                n = q.name;
            if (n && v.indexOf(n) == -1) {
                return false;
            }
            return true;
        }
    };

    var getData = function (name, query, page) {
        var len, ret = {}, arr = [];
        var data = get(name);
        var v, o;
        for (var k in data) {
            v = data[k];
            o = {id: k}
            keys.forEach(function (key, i) {
                o[key] = v[i];
            })
            arr.push(o)
        }
        //条件过滤
        arr = arr.filter(function (o, i) {
            var ret = true,
                q = office.query.$model;
            for (var k in dataFilter) {
                ret = dataFilter[k].call(q, o[k]);
                if (!ret) {
                    return ret;
                }
            }
            return ret;
        });
        ret.excel = arr;
        ret.len = arr.length;
        arr.sort(function (b, a) {
            return new Date(a.date) - new Date(b.date);
        });
        //处理分页
        var start = (page.page - 1) * page.size | 0,
            end = (page.size | 0) + start;
        ret.arr = arr.slice(start, end);
        return ret;
    }
    var store={};
    store.save=function(name,model){
            var data = get(name);
        data[id++] = keys.map(function (key) {
            return model[key];
        })
        save(name, data);
        save('id', id);
    }
    store.remove=function(name,model){
        var data = get(name);
        delete data[model.id];
        save(name, data);
    }

    var office = avalon.define('office', function (vm) {
        vm.menu = '';
        vm.title = '';
        vm.$units = ['个', '本', '把', '支', '盒', '瓶', '对', '卷']
        vm.add = {
            date: d.now,
            name: '',
            type: '',
            unit: 1,
            num: 1,
            price: 1,
            total: {get: function () {
                return this.num * this.price | 0;
            }},
            remark: '',
            status: 0,
            dept: '',
            user: ''
        };
        vm.$menus = [
            {name: '申请', hash: 'purchaseRequisition'},
            {name: '入库', hash: 'stockIn'},
            {name: '领用', hash: 'stockOut'},
            {name: '库存', hash: 'inventory'}
        ];
        vm.data = [];
        vm.$excel = [];
        vm.query = {
            from: d.from,
            to: d.now,
            dept: '',
            user: '',
            name: ''
        }
        vm.total = 0;

        vm.addIt = function (e) {
            store.save(office.menu,vm.add.$model);
            office.search();
            return false;
        }
        vm.removeIt = function (e) {
            store.remove(office.menu,this.$vmodel.el.$model);
            vm.search();
            return false;
        }
        vm.search = function (p) {
            page.page = p || 1;
            var m = vm.query.$model;
            var data = getData(office.menu, vm.query.$model, page);
            vm.data = data.arr;
            vm.total = data.len;
            vm.$excel = data.excel;
            return false;
        }
    });

    var page = avalon.define('page', function (vm) {
        vm.page = 1;
        vm.totalPage = {
            get: function () {
                return ((office.total - 1) / this.size + 1) | 0;
            }
        };
        vm.$sizeArr = [10, 15, 20, 30, 40];
        vm.size = vm.$sizeArr[0];
        vm.excelData = [];
        vm.toPage = function (page) {
            office.search(vm.page = page);
            return false;
        }
        vm.exports = function () {
            page.excelData = office.$excel;
            var table = $('#excel').html();
            table = '<html><head></head><body>' + table + '</body></html>';
            table = window.btoa(unescape(encodeURIComponent(table)));
            window.location.href = 'data:application/vnd.ms-excel;base64,' + table;
            return false;
        }
    });
    office.$watch('menu', function (title) {
        office.search();
    });

    page.$watch('size', function (v) {
        office.search();
    });
    var checkHash = window.onhashchange = function () {
        var hash = location.hash.slice(1),
            menus = office.$menus,
            menu = menus.filter(function (v) {
                return v.hash == hash;
            });
        menu = menu.length ? menu[0] : menus[0];
        office.menu = location.hash = menu.hash;
        document.title = menu.name;
    }
    if (undefined == get('id')) {
        save('id', 0)
        office.$menus.forEach(function (v) {
            save(v.hash);
        });
    }
    checkHash()
    office.search();
}();
