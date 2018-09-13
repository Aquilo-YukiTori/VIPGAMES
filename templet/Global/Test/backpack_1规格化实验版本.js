var base,Result,typeColor=[],bagType="MyBag",GameCode="570_2",ShowArray,chooseArray=[],Tag,order="desc";
var start;
(function(){
  var operate = start = function(){return operate.fn.init();};
  
  operate.fn = operate.prototype = {
    
    init: function(){
      $(window).bind('load',function(){
        $.ajax({
          url:"https://account.steampp.com/server/Inventory/",
          data: {act:"getRobot",appid:"570_2"},
          method: "POST",
          success: function(result){
            Result = result;
            operate.fn.operation();
          }
        });
    
        $("select.valueOrder").change(function(){
          order = $(this).val();
          ShowArray = ExchangeArray(ShowArray);
          ShowDecoration(ShowArray);
        });
    
        $("select.type").change(function(){
          $.ajax({
            url:"https://account.steampp.com/server/Inventory/",
            data: {act:"getRobot",appid:"730_2"},
            method: "POST",
            success: function(result){
              Result = result;
              operate.fn.operation();
            }
          });
          GameCode = $(this).val();
        });
      });
    },
    operation: function(){
      base = Result[0].content.users_inventory;
      ShowArray = sortBubble(base);
      ShowArray = ExchangeArray(ShowArray);
    
      typeColor = [];
      if(GameCode == "570_2")
      {
        for(var i in Result[0].content.tags["X0000W54"])
        {
          var temp = Result[0].content.tags["X0000W54"][i]["tag_name"];
          typeColor[temp] = Result[0].content.tags["X0000W54"][i]["color"];
        }
      }
      else
      {
        for(var i in Result[0].content.tags["X0000WDZ"])
        {
          var temp = Result[0].content.tags["X0000WDZ"][i]["tag_name"];
          typeColor[temp] = Result[0].content.tags["X0000WDZ"][i].color;
        }
        for(var i in Result[0].content.tags["X0000WDY"])
        {
          var temp = Result[0].content.tags["X0000WDY"][i]["tag_name"];
          if(temp == "StatTrak™")
            typeColor[temp] = Result[0].content.tags["X0000WDY"][i].color;
        }
      }
      if($("select.show"))
      $("select.show").append($("<option value='"+ "全部" +"'>"+ "全部" +"</option>"));
      for(var i in typeColor)
      {
        $("select.show").append($("<option value='"+ i +"'>"+ i +"</option>"));
      }
      $("select.show").change(function(){
        ShowArray = SelectDecoration(base,$(this).val(),order);
        ShowDecoration(ShowArray);
      });
    
      ShowDecoration(ShowArray);
    },
    //冒泡，之后可以优化，物件少则冒泡，多则快速排序
    sortBubble: function(array)
    {
      var Array=array,len=array.length,i,j,tmp=0,position;
      for(i=len-1;i>=1;i--){
      tmp = 0;
      for(j=0;j<=i;j++){
        if(Number(Array[j].price) >= tmp)
        {
          tmp = Number(Array[j].price);
          position = j;
        }
      }
      var temp = Array[i];
      Array[i] = Array[position];
      Array[position] = temp;
      }
      return Array;
    },
    ShowDecoration: function(array)
    {
      if($("ul.decoration").children().length)
      $("ul.decoration").empty();
      for(var i=0;i<array.length;i++)
      {
        $("ul.decoration").append($("<li uid='"+ array[i].tid +"'><img src="+ window.G._STEAM_STATIC_oss + array[i].icon +"><div class='valueBackground' style='background-color:#"+ typeColor[array[i].types.split(" ",2)[0]] +"'></div><span class='value'>"+ array[i].price +"</span></li>"));
      }
      $("ul.decoration>li").each(function(){
        $(this).click(function(){
          if($(this).hasClass("choose"))
          {
            $(this).removeClass("choose");
            var uid = $(this).attr("uid");
            for(var i=0;i<chooseArray.length;i++)
            {
              if(chooseArray[i] == uid)
              {
                chooseArray.splice(i,1);
                break;
              }
            }
          }
          else
          {
            $(this).addClass("choose");
            chooseArray.push($(this).attr("uid"));
          }
        });
      });
    },
    SelectDecoration: function(array,tag,order)
    {
      var Array = [];
      if(tag == "全部")
      {
        Array = sortBubble(array);
        if(order == "asec")
          return Array;
        Array = ExchangeArray(Array);
        return Array;
      }
      for(var i=0;i<array.length;i++)
      {
        if(array[i].types.split(" ",2)[0] == tag)
        {
          Array.push(array[i]);
        }
      }
      Array = sortBubble(Array);
      if(order == "asec")
        return Array;
      Array = ExchangeArray(Array);
      return Array;
      },
    //数组先军变后军，升序变逆序，逆序变升序
    ExchangeArray: function(array)
    {
      var Array = array;
      for(var i=0;i<parseInt(Array.length/2);i++)
      {
        var temp = Array[i];
        Array[i] = Array[Array.length-1-i];
        Array[Array.length-1-i] = temp;
      };
      return Array;
      }
  };
})();

