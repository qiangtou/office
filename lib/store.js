/**
 * Created by qiangtou on 13-11-8.
 */
!function(w){

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
    var s={
        save:save,
        get:get
    };
    var keys= {
        inventory:[ 'name', 'type', 'unit','num'],
        purchaseRequisition:['date', 'name', 'type', 'unit', 'num', 'price', 'total', 'remark', 'status', 'dept', 'user'],
        stockIn:['date', 'name', 'type', 'unit', 'num', 'price', 'total', 'remark', 'status', 'dept', 'user'],
        stockOut:['date', 'name', 'type', 'unit', 'num',  'remark', 'status', 'dept', 'user']
    };
    var baseSave=function(name,model){
        var data = get(name);
        data[id++] = keys[name].map(function (key) {
            return model[key];
        })
        save(name, data);
        save('id', id);
    }
    $.extend(s.save,{
        purchaseRequisition:function(name,model){
            baseSave.apply(null,arguments);
        },
        stockOut:function(model){
            console.log(model);
            baseSave('stockOut',model);
        },
        inventory:function(){
            baseSave.apply(null,arguments);
        },
        stockIn:function(name,model){
            baseSave.apply(null,arguments);
            //如果是入库操作的话，修改库存
            var o,num,type=model.type;
            if(type){
                var name='inventory';
                num=model.num|0;
                var data=get(name);
                if(o=data[type]){
                    o[3]+=num;
                }else{
                    //名字，单位，数量
                    data[type]=[model.name,model.type,model.unit,num];
                }
                save(name, data);
            }
        }
    });

    s.updateInventory=function(o){
        var i=get('inventory');
        var old=i[o.type];
        old[3]-= o.num;
        save('inventory',i);
    };
    s.remove=function(name,model){
        var data = get(name);
        delete data[model.id];
        save(name, data);
    }

    w.store=s;
}(this);
