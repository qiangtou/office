/**
 * Created by qiangtou on 13-10-28.
 */
(function () {
    var checkIt = function (o) {
        var v;
        for (var k in o) {
            if (k != 'remark') {
                v = ('' + o[k]).replace(/^\s*|\s*$/g, '');
                if (v === '') {
                    alert(k + '不能为空');
                    return false;
                }
            }
        }
        return true;
    }


    var office = avalon.define('office', function (vm) {
        vm.menus = [
            {name: '入库记录', url: 'in'},
            {name: '库存', url: 'repository'},
            {name: '领用记录', url: 'use'}
        ];
        vm.arr = [];
        vm.add = {
            date: '',
            name: '',
            type: '',
            unit: '',
            num: 1,
            price: 0,
            total: {get: function () {
                return this.num * this.price | 0;
            }},
            remark: '',
            edit: false
        };

        vm.addIt = function (e) {
            var m = vm.add.$model;
            if (checkIt(m)) {
                vm.arr.push(m);
            }
        }

        vm.editIt = function (e) {
            vm.arr.forEach(function(el){
                el.edit=false;
            });
            var el = this.$vmodel.el;
            el.edit = true;
            return false;
        }

        vm.save = function (e) {
            var el = this.$vmodel.el;
            var m=el.$model
            m.total= m.price* m.num|0;
            el.edit = false;
        }
        vm.remove = function (e) {
            var el = this.$vmodel.el;
        }
    })
    for(var i=5;i--;)office.arr.push({date: '2005-10-01', name: '本本', type: 'hrhr', unit: 'rewg', num: '4', price: 8865, remark: '这就是一个测试', edit: 0});
})();
