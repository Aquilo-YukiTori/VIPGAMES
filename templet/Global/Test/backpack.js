var base,Result,typeColor=[],bagType="getRobot",bagTypeFTrade="toSteam",GameCode="570_2",intervalID=0,showArray,chooseArray=[],order="desc";
(function(){
  $(window).bind('load',function(){
    $.ajax({
      url:"https://account.steampp.com/server/Inventory/",
      data: {act:"getRobot",appid:"570_2"},
      method: "POST",
      success: function(result){
        Result = result;
        return operate();
      },
      error: function(result){
        alert("请先登录");
        window.open(Location.account + "/login");
        return;
      }
    });
    
    $("select.valueOrder").change(function(){
      order = $(this).val();
      ShowArray = ExchangeArray(ShowArray);
      ShowDecoration(ShowArray);
    });
    
    $("select.type").change(function(){
      if($(this).val() == "730_2")
      {
        $.ajax({
          url:"https://account.steampp.com/server/Inventory/",
          data: {act:"getRobot",appid:"730_2"},
          method: "POST",
          success: function(result){
            Result = result;
            return operate();
          }
        });
      }
      else
      {
        $.ajax({
          url:"https://account.steampp.com/server/Inventory/",
          data: {act:"getRobot",appid:"570_2"},
          method: "POST",
          success: function(result){
            Result = result;
            return operate();
          }
        });
      }
       GameCode = $(this).val();
    });
    
    $("span.changeBag").click(function(){
      if($(this).html() == "切换到Steam背包")
      {
        bagType = "getSteam";
        bagTypeFTrade = "toRobot";
        $("span.repo").addClass("close");
        $(this).html("切换到我的背包");
        $("span.operate").html("存入");
      }
      else
      {
        bagType = "getRobot";
        bagTypeFTrade = "toSteam";
        $("span.repo").removeClass("close");
        $(this).html("切换到Steam背包");
        $("span.operate").html("取出");
      }
      $("ul.decoration").empty();
      
      //获取Steam背包，因为研发环境暂时无法获取从而无法测试，此处似乎有个设定为，获取到的数据为Steam背包里全部的物品，但是能否存入还要根据json数据进行筛选
      $.ajax({
          url:"https://account.steampp.com/server/Inventory/",
          data: {act: bagType,appid: GameCode},
          method: "POST",
          success: function(result){
            Result = result;
            return operate();
          }
        });
    });
    
    $("span.operate").click(function(){
      var data,tid = "";
//      if(!chooseArray[0])
//      {
//        alert("未选中饰品");
//        return;
//      }
      
      for(var i=0;i<chooseArray.length;i++)
      {
        tid += chooseArray[i] + "%";
      }
      tid = tid.substring(0,tid.length-1);
      if($(this).html() == "兑换")
      {
        $.getJSON("https://account.steampp.com/server/Account/",{act: "repo",inventoryTids: tid},function(data){
          console.log(data);
          if(data[0].status == "ok")
          {
            
              $.ajax({
                  url:"https://account.steampp.com/server/Inventory/",
                  data: {act: bagType,appid: GameCode},
                  method: "POST",
                  success: function(result){
                  Result = result;
                  return operate();
              }
            });
            return;
          }
          else
          {
            alert("发生错误，错误原因："+ data[0].mess);
            return;
          }
          
          
        });
        return;
      };
      
      $.ajax({
          url:"https://account.steampp.com/server/Trade/",
          data: {act: bagTypeFTrade,appid: GameCode,inventoryTids: tid},
          method: "POST",
          success: function(result){
            data = result[0];
            if(data.status == "err")
            {
              alert("错误，错误原因:" + data.mess);
              return;
            }
            data = data.content;
            for(var i=0;i<data.length;i++)
            {
              $(".wrap").append($("<div class='robot'><img src='"+ window.G._STEAM_STATIC_oss + data[0].face +"'><span class='botName'>"+ data[0]["nick_name"] +"</span><a href='' class='wait'>正在发送交易，请耐心等待</a><span class='secruityCode'>交易安全码："+ data[0].tid +"</span></div>"))
            }
            if(intervalID !=0)
            {
              clearInterval(intervalID);
              intervalID = setInterval(function(){
                checkTrades();
              },3000);
            }
            intervalID = setInterval(function(){
              checkTrades();
            },3000);
          }
        });
    });
    
    $("span.repo").click(function(){
      $.ajax({
          url:"https://account.steampp.com/server/Inventory/",
          data: {act: "getRobot",appid: GameCode,repo: 1},
          method: "POST",
          success: function(result){
            Result = result;
            $("span.operate").html("兑换");
            $("span.repo").addClass("close");
            return operate();
          }
        });
    });
  });
//  var base;
  var operate = function(){
    base = Result[0].content.users_inventory;
    ShowArray = SelectDecoration(base,"全部",order);
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
    if($("select.show").children().length)
    {
      $("select.show").empty();
    }
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
  };
  //冒泡，之后可以优化，物件少则冒泡，多则快速排序
  var sortBubble = function(array)
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
    };
  
  var ShowDecoration = function(array){
    chooseArray = [];
    if($("ul.decoration").children().length)
      $("ul.decoration").empty();
    for(var i=0;i<array.length;i++)
    {
      var temp = array[i].price;
      if(array[i].price.lastIndexOf("00") != -1)
        temp = temp.split(".",2)[0];
      console.log(temp);
      $("ul.decoration").append($("<li tid='"+ array[i].tid +"'><img src="+ window.G._STEAM_STATIC_oss + array[i].icon +"><div class='valueBackground' style='background-color:#"+ typeColor[array[i].types.split(" ",2)[0]] +"'></div><span class='value'>"+ temp +"</span></li>"));
    }
    $("ul.decoration>li").each(function(){
        $(this).click(function(){
          if($(this).hasClass("choose"))
          {
            $(this).removeClass("choose");
            var tid = $(this).attr("tid");
            for(var i=0;i<chooseArray.length;i++)
            {
              if(chooseArray[i] == tid)
              {
                chooseArray.splice(i,1);
                break;
              }
            }
          }
          else
          {
            $(this).addClass("choose");
            chooseArray.push($(this).attr("tid"));
          }
        });
      });
    
  };
  
  var SelectDecoration = function(array,tag,order)
    {
      var Array = [];
      if(tag == "全部")
      {
        Array = sortBubble(array);
        if(order == "desc")
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
      if(order == "asce")
        return Array;
      Array = ExchangeArray(Array);
      return Array;
      };
  //数组升序变逆序，逆序变升序
  var ExchangeArray = function(array)
  {
      var Array = array;
      for(var i=0;i<parseInt(Array.length/2);i++)
      {
        var temp = Array[i];
        Array[i] = Array[Array.length-1-i];
        Array[Array.length-1-i] = temp;
      };
      return Array;
    };
  var checkTrades = function()
  {
    $.ajax({
              url:"https://account.steampp.com/server/Trade/",
              data: {act: "checkTrades",Trades: tid},
              method: "POST",
              success: function(result){
                if(result[0].status == "err")
                {
                  alert("发生错误，错误原因：" + result[0].mess);
                  clearInterval(intervalID);
                  return;
                }
                var data = result[0].content;
                if(!data)
                {
                  clearInterval(intervalID);
                  intervalID = 0;
                  $(".wrap").empty();
                  $.ajax({
                    url:"https://account.steampp.com/server/Inventory/",
                    data: {act: bagType,appid: GameCode},
                    method: "POST",
                    success: function(result){
                      Result = result;
                      return operate();
                    }
                  });
                }
                else
                {
                  for(var i=0;i<data.length;i++)
                  {
                    if(data[i].tradeofferid)
                    {
                      $(".wrap>div:nth-child("+ ++i +")>a").removeClass("wait").html("交易发送成功，点击处理")[0].href = "https://steamcommunity.com/tradeoffer/" + data[i].tradeofferid;
                    }
                  }
                }
              }
            });
  };
})();


