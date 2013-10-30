/**
 * Created by qiangtou on 13-10-28.
 */
(function () {
    /**
     * 日期控件设置
     */
    var now=$.datepicker.formatDate( "yy-mm-dd", new Date());
    $.datepicker.setDefaults({maxDate:0});
    $('.date').datepicker({defaultDate:-10});

    /**
     * 查询条件检验
     * @param o
     * @returns {boolean}
     */
    var checkIt = function (o) {
        var v;
        for (var k in o) {
            if (k != 'remark') {
                v = ('' + o[k]).replace(/^\s*|\s*$/g, '');
                if (v === '') {
                    //alert(k + '不能为空');
                    //return false;
                }
            }
        }
        return true;
    }

    avalon.define('inRes',function(vm){
        vm.units=[
            {value:1,name:'个'},
            {value:2,name:'本'},
            {value:3,name:'把'},
            {value:4,name:'支'},
            {value:5,name:'盒'},
            {value:6,name:'瓶'},
            {value:7,name:'对'},
            {value:8,name:'卷'},
        ]
        vm.add = {
            date:now,
            name: '',
            type: '',
            unit: 1,
            num: 1,
            price: 0,
            total: {get: function () {
                return this.num * this.price | 0;
            }},
            remark: ''
        };
        vm.addIt = function (e) {
            var m = vm.add.$model;
            console.log(m);
        }
    })
    /**
     * 应用
     * @type {*}
     */
    var office = avalon.define('office', function (vm) {
        vm.menus = [
            {name: '入库记录', hash: 'in'},
            {name: '库存', hash: 'repository'},
            {name: '领用记录', hash: 'use'}
        ];
        vm.arr = [];


        vm.save = function (e) {
            var el = this.$vmodel.el;
            var m=el.$model
            m.total= m.price* m.num|0;
            el.edit = false;
        }
        vm.removeIt = function (e) {
            var el = this.$vmodel.el,
                m=el.$model;
            if(confirm('确定要删除?')){
                console.log(el.$model);
            }
        }
    })
    for(var i=5;i--;)office.arr.push({date: '2005-10-01', name: '本本', type: 'hrhr', unit: 'rewg', num: '4', price: 8865, remark: '这就是一个测试', edit: 0});
})();
