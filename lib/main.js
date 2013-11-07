/**
 * Created by qiangtou on 13-10-28.
 */
(function () {
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
    if (!get('store')) {
        save('store', true)
        save('id', 0)
        save('apply')
        save('useLog')
        save('res')
    }
    var id = get('id') | 0;
    /**
     * 日期控件设置
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
        defaultDate: -10});

    var keys = ['date', 'name', 'type', 'unit', 'num', 'price', 'total', 'remark', 'status', 'dept', 'user'];

    var applyFilter = {
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

    var getApply = function () {
        var len, arr = [];
        var apply = get('apply');
        var v, o;
        for (var k in apply) {
            v = apply[k];
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
            for (var k in applyFilter) {
                ret = applyFilter[k].call(q, o[k]);
                if (!ret) {
                    return ret;
                }
            }
            return ret;
        });
        len = arr.length;
        arr.sort(function (b, a) {
            return new Date(a.date) - new Date(b.date);
        });
        //处理分页
        var start = (page.page - 1) * page.size | 0,
            end = (page.size | 0) + start;
        arr = arr.slice(start, end);
        return {len: len, arr: arr};
    }

    /**
     * 应用
     * @type {*}
     */
    var office = avalon.define('office', function (vm) {
        vm.units = [ '个', '本', '把', '支', '盒', '瓶', '对', '卷']
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
        vm.menus = [
            {name: '申请', hash: 'apply'},
            {name: '入库', hash: 'apply'},
            {name: '领用', hash: 'useLog'},
            {name: '库存', hash: 'repository'}
        ];
        vm.data = [];
        vm.query = {
            from: d.from,
            to: d.now,
            dept: '',
            user: '',
            name: ''
        }
        vm.total = 0;

        vm.addIt = function (e) {
            var m = vm.add.$model,
                apply = get('apply');
            apply[id++] = keys.map(function (key) {
                return m[key];
            })
            save('apply', apply);
            save('id', id);
            office.search();
            return false;
        }
        vm.removeIt = function (e) {
            var el = this.$vmodel.el,
                m = el.$model,
                apply = get('apply');
            delete apply[m.id];
            save('apply', apply);
            vm.search();
            return false;
        }
        vm.search = function (p) {
            p && (page.page = p);
            var m = vm.query.$model;
            var apply = getApply(vm.query.$model);
            vm.data = apply.arr;
            vm.total = apply.len;
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
        vm.size = 10;
        vm.sizeArr = [10, 15, 20, 30, 40];
        vm.toPage = function (page) {
            vm.page = page;
            office.search();
            return false;
        }
    });
    page.$watch('size', function (v) {
        office.search(1);
    });
    office.search();
})();