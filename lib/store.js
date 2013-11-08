/**
 * Created by qiangtou on 13-11-8.
 */
define(function(){
    return {
        save : function (name, json) {
            name = 'office-' + name;
            if (json === undefined)json = {};
            localStorage.setItem(name, JSON.stringify(json));
        },
        get : function (name, string) {
            name = 'office-' + name;
            var v = localStorage.getItem(name);
            return string ? v : (v ? JSON.parse(v) : v);
        }
    }
})