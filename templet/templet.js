
quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$)/;
(function(window,undefined){
  var document = window.document,
       navigator = window.navigator,
       location = window.location;
       
  var js = (function(){
    var js = window.js = function(selector,context)
    {
      return new js.fn.init(selector,context);
    },
    
    quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$)/,
    
    hasOwn = Object.prototype.hasOwnProperty,
    toString = Object.prototype.toString,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    trim = String.prototype.trim,
    indexOf = Array.prototype.indexOf,
    
    ClassOfType = {};
    js.fn = js.prototype = {
    constructor: js,
    init: function(selector,context){
    if(!selector){
      return this;
    }
    //选择器为dom元素时，可直接获取运行
    if(selector.nodeType)
    {
      this.context = this[0] = selector;
      this.length = 1;
      return this;
    }
    //获取body
    if(selector == "body" && !context && document.body)
    {
      this.context = document;
      this.selector = selector;
      this[0] = document.body;
      this.length = 1;
      return this;
    }
    
    if(typeof selector == "string")
    {
      //处理标签
      var match = quickExpr.exec(selector);
      
      //首先处理并列的选择集合，将并列分成单独的选择集合再处理
      if(selector.indexOf(",") !== -1)
      {
        console.log("分隔");
        var index = selector.indexOf(",");
        var str = selector.substring(0, index);
        selector = selector.slice(index + 1, selector.length);
        var storage = js(str);
        var Tsto = js(selector);
        var stoLength = storage.length;
        var TstoLength = Tsto.length;
        for (var i = 0; i < TstoLength; i++)
        {
          for (var j = 0; j < stoLength; j++)
          {
            if (Tsto[i] === storage[j])
            {
              Tsto.splice(i, 1);
              TstoLength--;
              i--;
              break;
            }
          }
        }
        js.merge(storage,Tsto)
        return storage;
      }
      
      allCount = selector;
      //.class or #id or [attr=1]
      //此时情况为单个单项选择的处理逻辑
      if(allCount.length === 0)
      {
        return null;
      }
      if(allCount.charAt(0) === "#")
      {
        this.context = document;
        this.selector = selector;
        var ele = document.getElementById(allCount.slice(1,allCount.length));
        this.length = 1;
        this[0] = ele;
        return this;
      }
      //暂行方法，正确的解决方法应将除搜寻ID之外的其他搜索重新写成一个"find"方法，其原因在于搜寻id无论适配的元素有多少个
      //都只会取第一个适配元素输出，而其他的搜索方法都可能会有多个结果输出
      if(allCount.charAt(0) === ".")
      {
        return document.getElementsByClassName(allCount.slice(1,allCount.length));
      }
      if(allCount.charAt(0) === "[")
      {
        
      } 
    }
    //$(DOMElement)
    else if(selector.nodeType)
    {
      this[0] = selector;
      this.length = 1;
      return this;
    }
    //$(function)
    else if(js.isFunction(selector))
    {
      
    }
    
    
    },
  //使用array的原型方法而不是使用数组实例继承的方法是因为原型方法也可以对类似数组的类型进行"转换成数组"操作
  toArray: function()
  {
      return Array.prototype.slice.call(this,0);
  },
  each: function(callback,args)
  {
    return js.each(this,callback,args);
  },
  test: function(){}
  };
    js.fn.init.prototype = js.fn;
    //$.extend(target,{object1},{objectN})
    //$.extend([deep],target,{object1},{objectN})
    js.extend = js.fn.extend = function(){
      var isDeep = false,
              target = arguments[0] || {},
              length = arguments.length,
              base = 1,
              copyIsArray,extender,options;
      //当第一个参数是Boolean类型时，进行深浅度复制的相关赋值和判断
      if(typeof target === "boolean")
      {
        base = 2;
        isDeep = target;
        target = arguments[1] || {};
      }
      //如果就只有一个参数，那么就是为JS本身添加
      if(length == 1)
      {
        target = this;
        --base;
      }
      test = target;
      for(var i=base;i<length;i++)
      {
        if((options = arguments[i]) != null)
        {
          for(var j in options)
          {
            src = target[j];
            copy = options[j];
            if(src === copy)
              continue;
            if(isDeep && copy && (js.isPlainObject(copy) || (copyIsArray = js.isArray(copy))))
            {
              if(copyIsArray)
              {
                copyIsArray = false;
                extender = src && js.isArray(src) ? src : [];
              }
              else
              {
                extender = src && js.isPlainObject(src) ? src : {};
              }
              target[j] = js.extend(isDeep,extender,copy);
            }
            else if(copy !== undefined)
            {
              target[j] = copy;
            }
          }
        }
      }
      return target;
    };
    js.extend({
      isFunction: function(obj){
        return js.type(obj) === "fucntion";
      },
      isArray: Array.isArray || function(obj){
        return js.type(obj) === "array";
      },
      isNaN: function(obj)
       {
        return js.type(obj) === "null" || js.type("obj") === "undefined";
      },
      type : function(obj)
      {
        if(obj == null || obj == undefined)
          return String(obj)
        return ClassOfType[toString.call(obj)]  || "object";
      },
      isPlainObject : function(obj)
      {
        if(!obj || js.type(obj) !== "object" || obj.nodeType || js.isWindow(obj))
          return false;
        if(obj.constructor && !hasOwn.call(obj,"constructor") && !hasOwn.call(obj.constructor.prototype,"isPrototypeOf"))
          return false;
        var key;
        for(key in obj){};
        return key === undefined || hasOwn.call(obj,key);
      },
      isWindow: function(obj)
      {
        return obj && typeof obj === "object" && "console" in obj;
      },
      isEmptyObject: function(obj)
      {
        for(var j in obj)
          return false
        return true;
      },
      error: function(message)
      {
        throw message;
      },
      each: function(object,callback,args)
      {
        //args是额外传入的参数的数组，在callback中访问，例:(object,callback(p1,p2),['参数1','参数2']);
        var name,i = 0;
        length = object.length;
        //类没有length属性，所以length == undefined。而函数的length=0，0!=null和undefined
        isObj = length === undefined || js.isFunction(object);
        if(args)
        {
          if(isObj)
          {
            for(name in object)
            {
              if(callback.apply(object[name],args) === false)
              {
                break;
              }
            }
          }
          else
          {
            for(;i<length;i++)
            {
              if(callback.apply(object[i],args) === false)
              {
                break;
              }
            }
          }
        }
        else
        {
          if(isObj)
          {
            for(name in obj)
             {
              if(callback.call(object[name],name,object[name]) === false)
              {
                break;
              }
            }
          }
          else
          {
            for(;i<length;i++)
            {
              if(callback.call(object[i],i,object[i]) === false)
              {
                break;
              }
            }
          }
        }
        return object;
      },
      merge: function(first,second)
      {
        var length = first.length,
                i=0,
                j=0;
        if(typeof second.length === "Number")
        {
          for(;i<second.length;i++)
          {
            first[length++] = second[i];
          }
        }
        else
        {
          while(second[j] !== undefined)
          {
            first[length++] = second[j++];
          }
        }
        first.length = length;
        return first;
      }
    
    });
    
    js.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(i,name){
      ClassOfType["[object" + name + "]"] = name.toLowerCase();
    });
    
    return js;
  })();
  


  window.js = window.$ = js;
})(window);




window.onload = function(){
  
};
