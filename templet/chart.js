(function(){
  $.bind("load",function(){
    var Wid = 0;
    $(".WinnerGroup").each(function(){
      Wid += $(this).width();
      if($(this).hasClass("SingleEliminationWinner") || $(this).hasClass("Winner"))
      {
        if($("WinnerGroup").attr("type") === "SE")
          Wid += $(this).width();
      }
    }).width(Wid);
    if($("LoserGroup"))
    {
      Wid = 0;
      $("LoserGroup").each(function(){
        Wid += $(this).width();
      }).width(Wid).css("margin-right",$("WinnerGroup").css("margin-right"));
    }
  });
  
  
  $(".Team_ul").each(function () {
    $(this).children("li").children("a").hover(function () {
      $(this).attr("class", "show");
    }, function () {
      $(this).attr("class", "");
    });
  });
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
})();
