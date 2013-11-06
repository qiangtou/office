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
    var now = $.datepicker.formatDate("yy-mm-dd", new Date());
    $.datepicker.setDefaults({maxDate: 0});
    $('.date').datepicker({defaultDate: -10});

    var keys = ['date', 'name', 'type', 'unit', 'num', 'price','total', 'remark','status'];

    /**
     * 应用
     * @type {*}
     */
    var office = avalon.define('office', function (vm) {
        vm.units = {
             1:  '个',
             2:  '本',
             3:  '把',
             4:  '支',
             5:  '盒',
             6:  '瓶',
             7:  '对',
             8:  '卷'
        }
        vm.add = {
            date: now,
            name: '',
            type: '',
            unit: 1,
            num: 1,
            price: 1,
            total: {get: function () {
                return this.num * this.price | 0;
            }},
            remark: '',
            status:0
        };
        vm.menus = [
            {name: '申请', hash: 'apply'},
            {name: '入库', hash: 'apply'},
            {name: '领用', hash: 'useLog'},
            {name: '库存', hash: 'repository'}
        ];
        vm.data = [];
        vm.query = {
            from: '',
            to: now,
            name: ''
        }

        vm.addIt = function (e) {
            var m = vm.add.$model;
            var apply = get('apply');
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
        vm.selectAll=function(){
            vm.data.forEach(function(o){
                o.status= !o.status;
            })

        }
        vm.search = function (e) {
            var m = vm.query.$model;
            var arr = [];
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
            vm.data = arr;
            return false;
        }
    })
    office.search();
})();
