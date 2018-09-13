/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//Generate Chart
var WinChart;
(function(window){
  var chart = function(){return new chart.fn.init()};
  chart.fn = chart.prototype = {
    constructor: chart,
    init: function(){},
    //用处: 用于生成无数据的对阵图框架
    //参数说明: 生成的对阵图类型type，要生成的位置DOM,浮动方向或不浮动position
    //参数详细: 参数一："x yy"  x队伍数量 yy单双败 单败:SE 双败:DE，参数二：建议为宽度100%的div的class，参数三：left、right、center
    //说明: 
    generate: function(type,DOM,position){
      var teamNum = parseFloat(type.split(" ",2)[0]),chartType = type.split(" ",2)[1];  //获得队伍数量
      var Base = $("<div class='chart nos'><div class='WinnerGroup'></div><div class='LoserGroup'></div></div>"),
          WinnerG = Base.children("div.WinnerGroup"),
          LoserG = Base.children("div.LoserGroup");
      $("."+DOM).append(Base);  //建立大致框架
      WinnerG.attr("position",position);  //表明是否漂浮与漂浮的方向，用于页面加载时判断
      if(chartType == "SE")  //单败赛制的框架生成
      {
        if(teamNum > 32 || teamNum %2 === 1)  //若队伍数量大于16或为单数，则此通用单败框架不支持
        {
          alert("队伍数量错误");
          return;
        }
        LoserG.remove();  //单败框架没有败者组
        var pointer = WinnerG;  //对胜者组进行操作
        WinnerG.attr("type","SE");  //type属性表明这是单败赛制，用于在页面加载时判断是否自动获取长度以达到自适应的目的
        var temp;
        if(teamNum >= 2)  //当队伍为2、4、8、16、32时分别多加入一轮比赛,并完善每一轮具体赛事的li
        {
          temp = $("<ul class='SingleEliminationWinner NonePostposition'></ul>");
          pointer.prepend(temp);
          this.createMatchDom(temp,1);
        }
        if(teamNum >= 4)
        {
          temp = $("<ul></ul>");
          pointer.prepend(temp);
          this.createMatchDom(temp,2);
        }
        if(teamNum >= 8)
        {
          temp = $("<ul></ul>");
          pointer.prepend(temp);
          this.createMatchDom(temp,4);
        }
        if(teamNum >= 16)
        {
          temp = $("<ul></ul>");
          pointer.prepend(temp);
          this.createMatchDom(temp,8);
        }
        if(teamNum === 32)
        {
          temp = $("<ul></ul>");
          pointer.prepend(temp);
          this.createMatchDom(temp,16);
        }
        if(position === "center")  //无需向左或向右漂浮留出空隙的情况下可用长连接线，否则用短连接线尽量节省空间
        {
          WinnerG.children("ul").addClass("LongLineBefore");
          WinnerG.children("ul:nth-child(1)").removeClass("LongLineBefore");
        }
        else
        {
          WinnerG.children("ul").addClass("ShortLineBefore");
          WinnerG.children("ul:nth-child(1)").removeClass("ShortLineBefore");
          Base.attr("position",position);  //需要漂浮时给.chart加上特定的class
          Base.css("float",position);
        }
        var count = 1;  //为每轮添加具体的class
        WinnerG.children("ul").each(function(){
          if(count === 1)
            $(this).addClass("Basic");
          $(this).attr("id","SingleEliminationRound" + count++);
        });
        WinnerG.children("ul:last-child").attr("id","SingleEliminationWinner").removeClass("SingleEliminationWinner");
      }
      else
      {
        if(teamNum != 16)  //暂时只支持16支队伍的正赛双败赛制
        {
          alert("队伍数量错误");
          return;
        }
        //分别为胜者组和败者组添枝加叶
        WinnerG.append($("<ul class='Basic'></ul><ul class='LongLineBefore TwoInColumnInterval TwoInColumnPostposition'></ul><ul class='LongLineBefore'></ul><ul class='ShortLineBefore winner NonePostposition'></ul>"));
        var ul = WinnerG.children("ul");
        for(var i=0;i<ul.length;i++)
        {
          if(i < 1)
            this.createMatchDom($(ul.eq(i)),4);
          if(i > 0 && i < 2)
            this.createMatchDom($(ul.eq(i)),2);
          if(i > 1)
            this.createMatchDom($(ul.eq(i)),1);
        }
        LoserG.append($("<ul class='LoserRoundUnique' id='LoserRound1'></ul><ul class='Basic' id='LoserRound2'></ul><ul class='ShortLineBefore TwoInColumnInterval LoserRoundUnique' id='LoserRound3'></ul><ul class='TwoInColumnInterval TwoInColumnPostposition' id='LoserRound4'></ul><ul class='ShortLineBefore LoserRoundUnique' id='LoserRound5'></ul><ul class='SemifinalPostposition' id='LoserRound6'></ul>"));
        ul = LoserG.children("ul");
        for(var i=0;i<ul.length;i++)
        {
          if(i < 2)
            this.createMatchDom($(ul.eq(i)),4);
          else if(i < 4)
            this.createMatchDom($(ul.eq(i)),2);
          else if(i < 6)
            this.createMatchDom($(ul.eq(i)),1);
        }
      }
      var Wid = 0;
      WinnerG.children().each(function(){
        if ($(this).hasClass("SingleEliminationWinner") || $(this).hasClass("winner"))
        {
          if (WinnerG.attr("type") === "SE")
            Wid += $(this).width();
          return true;
        }
        Wid += $(this).width();
        Wid += parseFloat($(this).css("padding-left"));
      });
      WinnerG.width(Wid);
      if (LoserG)
      {
        Wid = 0;
        LoserG.children().each(function () {
          Wid += $(this).width();
          Wid += parseFloat($(this).css("padding-left"));
        });
        LoserG.width(Wid).css("margin-right", WinnerG.css("margin-right"));
      }
      //优化：每场赛事的弹窗的初始化,之后完成后可能会加个属性，让未开始也没数据的比赛不弹出弹窗
      var Mutex = true, TempStorage = 0;
      $("span.Tag").each(function () {
        $(this).click(function () {
          var t = $(this);
          if (t.next().children("div").hasClass("InfoShow"))
          {
            t.parents("li").css("z-index", "10");
            t.next().children("div").removeClass("InfoShow");
            setTimeout(function () {
              t.next().addClass("hide").children("div").addClass("hide");
            }, 300);
            Mutex = true;
            TempStorage = 0;
            return;
          }
          if (Mutex === false)
          {
            TempStorage.parents("li").css("z-index", "10");
            TempStorage.next().children("div").removeClass("InfoShow");
            setTimeout(function () {
              TempStorage.next().addClass("hide").children("div").addClass("hide");
            }, 300);
          }
          t.parents("li").css("z-index", "100");
          t.next().removeClass("hide").children("div").removeClass("hide");
          setTimeout(function () {
            t.next().children("div").addClass("InfoShow");
            Mutex = false;
            TempStorage = t;
          }, 310);

        });
      });
      
    },
    getData: function(){
      
    },
    fiilingIn: function(){
      var data = Data[0][content];
      //填入数据后根据数据获得Winner
      $(".chart>div>ul.FinalRound>li>div>div").each(function () {
        if (!$(this).hasClass("defeat"))
          Winner = $(this).children("span").html();
      });
      
      $(".chart>div>ul>li>div>div").hover(function () {
        if ($(this).hasClass("wrap") || $(this).hasClass("Info"))
          return;
        Ele = [];
        var teamName = $(this).children("span").html();
        $(".chart>div>ul>li>div>div").each(function () {
          var name = $(this).children("span").html();
          if (name === teamName)
          {
            if (name === Winner)
            {
              $(this).addClass("hoverWinnerTeam");
              Ele.push($(this)[0]);
            } else
            {
              $(this).addClass("hoverLoserTeam");
              Ele.push($(this)[0]);
            }
          }
        });
      }, function () {
        for (var i = 0; i < Ele.length; i++)
        {
          $(Ele[i]).removeClass("hoverWinnerTeam");
          $(Ele[i]).removeClass("hoverLoserTeam");
        }
      });
    },
    //
    checkChange: function(){},
    //功能：给每一轮ul中加入具体比赛li的框架
    //参数：DOM要加入的位置ul，count要加入的数量
    createMatchDom: function(DOM,count){
      for(var i=0;i<count;i++)
      {
        DOM.append($("<li><div><div class='teamA'><img src=''><span></span><p></p></div><div class='teamB'><img src=''><span></span><p></p></div><span class='Tag'></span><div class='wrap hide'><div class='Info hide'></div></div></div></li>"));
      }
    }
  };
  chart.fn.init.prototype = chart.fn;
  window.chart = chart;
  
})(window);




//var Ele = [],Winner;
//  $(window).bind('load',function(){
//    $(".Battle").height($("li>.show").height()+170);
//    Winner = $("div.Winner").children("span").html();
//  });
//  $(".time_list>li").click(function(){
//    $(".time_list").children("li").children("div").attr("class","");
//    $(this).children("div").attr("class","show");
//    $(".time_list").children("li").children("a").attr("class","");
//    $(this).children("a").attr("class","a_active");
//    $(".Battle").height($("li").children(".show").height()+170);
//  });
//  $(".temp_container>a").click(function(){
//    $(".temp_listview").attr("class","temp_listview nos");
//    $(".div_container").attr("class","div_container");
//    $(".temp_container").children("a").get(0).className = "temp_detail";
//    $(".temp_container").children("a").get(1).className = "temp_detail_eliminate";
//    var temp = $(this).attr("class");
//    if(temp == "temp_detail")
//    {
//      temp += " redborder";
//      $(this).attr("class",temp);
//      $(".temp_listview").attr("class","temp_listview nos show");
//      $(".Battle").height($("li").children(".show").height()+170);
//    }
//    if(temp == "temp_detail_eliminate")
//    {
//      temp += " redborder";
//      $(this).attr("class",temp);
//      $(".div_container").attr("class","div_container show");
//      $(".Battle").height($(".div_container").height()+170);
//    }
//  });
//  $(".Team_ul").each(function(){
//    $(this).children("li").children("a").hover(function(){
//      $(this).attr("class","show");
//    },function(){
//      $(this).attr("class","");
//    });
//  });
//  $(".chart>div>ul.FinalRound>li>div>div").each(function(){
//    if(!$(this).hasClass("defeat"))
//      Winner = $(this).children("span").html();
//  });
//  $(".chart>div>ul>li>div>div").hover(function(){
//    if($(this).hasClass("wrap") || $(this).hasClass("Info"))
//      return;
//    Ele = [];
//    var teamName = $(this).children("span").html();
//    $(".chart>div>ul>li>div>div").each(function(){
//      var name = $(this).children("span").html();
//      if(name === teamName)
//      {
//        if(name === Winner)
//        {
//          
//          $(this).addClass("hoverWinnerTeam");
//          Ele.push($(this)[0]);
//        }
//        else
//        {
//          $(this).addClass("hoverLoserTeam");
//          Ele.push($(this)[0]);
//        }
//      }
//    });
//  },function(){
//    for(var i=0;i<Ele.length;i++)
//    {
//      $(Ele[i]).removeClass("hoverWinnerTeam");
//      $(Ele[i]).removeClass("hoverLoserTeam");
//    }
//  });
//  
//  var Mutex = true,TempStorage = 0;
//  $("span.Tag").each(function(){
//    $(this).click(function(){
//      var t = $(this);
//      if(t.next().children("div").hasClass("InfoShow"))
//      {
//        t.parents("li").css("z-index","10");
//        t.next().children("div").removeClass("InfoShow");
//        setTimeout(function(){
//          t.next().addClass("he").children("div") .addClass("he");
//        },300);
//        Mutex = true;
//        TempStorage = 0;
//        return;
//      }
//      if(Mutex === false)
//      {
//        TempStorage.parents("li").css("z-index","10");
//        TempStorage.next().children("div").removeClass("InfoShow");
//        setTimeout(function(){
//          TempStorage.next().addClass("he").children("div") .addClass("he");
//        },300);
//      }
//      t.parents("li").css("z-index","100");
//      t.next().removeClass("he").children("div") .removeClass("he");
//      setTimeout(function(){
//         t.next().children("div").addClass("InfoShow");
//         Mutex = false;
//      TempStorage = t;
//      },310);
//      
//    });
//  });