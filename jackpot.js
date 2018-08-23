//Element,Index,Self,Event;
(function(window,undefined,jul){
var jackpot = jul.jackpot = function(SOConnect){return new jackpot.fn.base(SOConnect);};
jackpot.fn = jackpot.prototype = {
  d : {
    d : null,
    p : [],
    xxxxxxx : null,
    xxxxxxx : null,
    xxxxxxx : null,
    xxxxxxx : null,
  },
  u : {
    join : false,
    position : null,
    uinventory : null,
    jointid : null,
  },
  award : {
    award : [],
    index : null,
    zIndex : null,
  },
  history : null,
  message : 0,
  ctrl : {
    mt : 0,
    messageMove : true,
  },
  vara : {
    flag: true,  //聊天室滚动条的点击拖动
    loaded: false,
    waiting: false,
    ifLocked: false, //聊天栏是否锁屏
    jset: {},
    FastRedeemIns : 0,
    stage: 0,
		RandIntervalID: 0,
    Navi:0,
    awardWait:0, //载入时如果正在开奖，则弹窗，此变量用来告知何时从开奖变成新开局
    //用于IE兼容移动的坐标
    formerposition: {
      "left":[136,434,527,286,40,166,203,358,403,282],
      "top":[81,81,362,537,366,247,388,390,247,164]
    }
  },
  repo : [],
  base : function(SOConnect){

//		Alert("debugging","error","调试中");
    var t = this,i;
    t.jXJMark  = jul(".XJMark");
    t.jXJRes   = jul(".XJRes");
    t.jXJRem   = t.jXJRes.jul(">div");
    t.jXJMybag = jul(".XJMybag");
    
    t.jSubjeact = jul(".XJacpotr>div>ul");
    t.jSubjeact_but = jul(".XJacpotr>span");
    
    t.jXJacpot = jul(".XJacpotl");
    t.jXJacpot_c = t.jXJacpot.jul(">dl>dt>span");//倒计时
    t.jXJacpot_s = t.jXJacpot.jul(">dl>dt>label");//"开奖倒计时"文字
    
    t.jXJacpot_p = t.jXJacpot.jul(">dl>dd>span");//10个参加的位置
    
    t.jXJacpotrSubject = jul(".XJacpotr>div>ul");//主题
    t.jXJacpotrSubjects = {};
    
    t.jHistory = jul(".XJacpotbl");//整体
    t.jHistory_t = t.jHistory.jul(">div>span").get(0);//龙钩主题
    t.jHistory_c = t.jHistory.jul(">div>span").get(1);//时间
    t.jHistory_uf = t.jHistory.jul(">div>a>img");//头像
    t.jHistory_logoa = t.jHistory.jul(">div>a").elements[0];//头像链接
    t.jHistory_un = t.jHistory.jul(">div>span").get(2);//用户名字
    t.jHistory_ul = t.jHistory.jul(">div>label");//用户等级
    t.jHistory_sums = t.jHistory.jul(">div>span").get(4).jul(">font");//总价
    t.jHistory_sumc = t.jHistory.jul(">div>span").get(3).jul(">font");//件数
    t.jHistory_imgs = t.jHistory.jul(">dl");//可能是饰品图片
    
    t.jXJMessm_cont = jul(".XJMessm_cont");
    t.jXJMessm_cont_m = t.jXJMessm_cont.jul(">div");
    t.jXJMessm_scroll = jul(".XJMessm_scroll>div>span");
    t.XJMessb_input = jul(".XJMessb>input");
    t.XJMessb_but = jul(".XJMessb>button");
    
    
    t.socketIns = jul.socket({
      url : SOConnect,
      on : function(data){
        if(data.m && t["SO"+data.m]){
          t["SO"+data.m](data.d);
        }else{
          Alert(data.m,"error","载入错误");
        }
      }
    });
    
    t.uInventoryIns = jul.uInventory(jul(".XJMybag>DIV"),{
      apps: ["570_2"],
      rows: 32,
      trade: false,
      onAppSwitch: function (appid){
      },
      onChoice: function (tid,price,appid,jdemo,boolean){
        if (boolean) {
          if(t.u.uinventory){
            return false;
          }
          t.u.uinventory = tid;
          return true;
        } else {
          t.u.uinventory = null;
          return true;
        }
      },
      onConfirm: function () {
      },
      onCancel: function () {
      },
      yyyy: null
    });
    
    t.initEvent();
    
    t.getHistory(null,function(history){
      if(!history){
        return;
      }
      t.newHistory(history);
    });
    $(document).ready(function(){
      if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0")
      {
        t.vara.Navi = "IE7";
      }
      else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0")
      {
        t.vara.Navi = "IE8";
      }
      else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0")
      {
        t.vara.Navi = "IE9";
      }
    });
  },
  
  initEvent : function(){
    var t = this,i;
    //全局的回车键松开事件绑定为聊天栏发送信息
    jul(window).keyup(function(EE,EI,ES,E){
      var k = jul.event.which(E);
      if(k === 13){
        var mess = t.XJMessb_input.html();
        if(mess.length>0){
          t.onMessaging(mess);
        }
      }
    });
    
    t.jXJacpot_p.Click(function(EE,EI,ES,E){
      if(!G.userInfo.uid){
        window.open(G.Location.account+"/login/","_top");
        return;
      }
      if(t.vara.stage == 1)
      {
        Alert("本轮已经在开奖中了", "error", "参加失败");
        return;
      }
      if(t.u.join)
      {
        Alert("您已参加此次主题,请勿重复操作","error","参加失败");
        return;
      }
      if(t.d.p[EI]!="00000000" && t.d.p[EI] != undefined)
      {
          Alert("位置已被占领,请选择其他位置","error","参加失败");
        return;
      }
      t.u.position = EI;
      t.MyBagOn();
    });

    jul(".false").Click(function(){
      t.jXJRes.h();
      Alert("处理中，请稍后","wait","");
      t.vara.FastRedeemIns.repo(function(){
        t.jXJMark.h();
        $(".false").hide();
      });
    });
    
    jul(".XJMybag>i").Click(function(){
      t.u.uinventory = null;
      t.jXJMark.h();
      if($(".XJMybag").css("display") == "none")
        $(".XJMybag").css("display","block");
      $(".XJMybag").removeClass("show");
      if(t.vara.Navi == "IE9")
        t.jXJMybag.h();
    });
    
    jul(".true").Click(function(){
      t.jXJMark.h();
      t.jXJRes.h();
      $(".false").hide();
    });
    
    jul(".XJMybag>div>button").Click(function(){
      t.onToJoin();
    });
    
    t.XJMessb_but.Click(function(){
      if(!G.userInfo.uid)
      {
        Alert("请先登录！","warning","温馨提示",{
          "确定": function(self){
            self.off();
          },
          "错误": null
        });
        return;
      }
      var mess = t.XJMessb_input.html();
      if(mess.length>0){
        t.onMessaging(mess);
      }
    });
    
    jul(".trashBtn").Click(function(){
      t.jXJMessm_cont_m.empty().removeAttr("className");
      $(".XJMessm_scroll").addClass("notfull");
    });
    
    jul(".lock").Click(function(){
      if(jul(".lock").elements[0].className.indexOf("un") !== -1)
      {
        document.getElementsByClassName("lock")[0].setAttribute("class","iconfont lock ing");
        jul(".lock").Attr("className","iconfont lock ing");
        t.vara.ifLocked = true;
      }
      else if(jul(".lock").elements[0].className.indexOf("ing") !== -1)
      {
        document.getElementsByClassName("lock")[0].setAttribute("class","iconfont lock un");
        jul(".lock").Attr("class","iconfont lock un");
        t.vara.ifLocked = false;
      }
    });
    //滚动条的拖动
    jul(".XJMessm_scroll").Draggable({
      onMousedown:function(EE,EI,ES,E){
        t.vara.flag = false;
        t.ctrl.messageMove = false;
        t.ctrl.mt = ES.jul("div>span").marginTop();
      },
      onMousemove:function(EE,EI,ES,E,x,y){
        //t.ctrl.mt是原位置距离顶端的高度，y是点击后Y轴的位移，向上为负，向下为正;
        var mt = t.ctrl.mt+y;
        //如果滚动条已经到顶了，那么直接给其margintop赋0;
        if(mt<=0){
          ES.jul("div>span").marginTop(0);
          return;
        }
        //如果到底了，则直接赋200;
        else if(mt >= 200){
          ES.jul("div>span").marginTop(200);
          return;
        }
        t.ScrollChatFrame(mt/200);
      },
      onMouseup:function(){
        t.vara.flag = true;
        t.ctrl.messageMove = true;
      }
    },{},{});
    //聊天栏可视区域的滚轮事件
    t.jXJMessm_cont.scroll(function(EE,EI,ES,E){
      var mt = ES.scrollTop();
      var minfo = t.jXJMessm_cont_m.info();
      var h = minfo.height-301;
      t.jXJMessm_scroll.Styles({"marginTop":(200*(mt/h))+"px"});
    });
  },
  
  reSetUI : function(){
    var t = this;
    if($(".XJMybag").css("display") == "none")
      $(".XJMybag").css("display","block");
    $(".XJMybag").removeClass("show");
    
    t.d.p = [];
    t.u.join = false;
    t.u.position = null;
    t.u.uinventory = null;
    t.u.jointid = null;
    t.award.award = [];
    t.award.index = null;
    t.award.zIndex = null;
    t.jXJacpot_c.delCss("avtive"); //倒计时归位
    if(t.vara.Navi == "IE9")
    {
      $(".countdown").animate({
        "margin-top" : 44
      },300);
    }
    if(t.d.d.phase.stage == 1 || t.d.d.phase.stage == 2)
    {}
    else
    {
      $(".XJacpotl>dl>dd").removeClass("awarding");
      $(".XJacpotl>dl>dd>span").html("点击参加");
      $(".countdown + label").html("开奖倒计时");
      $(".countdown + label").show();
      $(".countdown + label").animate({
        "top": 0
      },300);
    }
		t.jXJacpot_c.Style("font-size","30px");
    
    //十个参加位置改变
    t.jXJacpot_p.zIndex(0);
    t.jXJacpot_p.delCss("avtive");
    if(t.vara.Navi == "IE9")
    {
      for(var i=0;i<10;i++)
      {
        this.MoveTo_compa($(".XJacpotl").children("dl").children("dd").children("span").get(i),t.vara.formerposition.left[i],t.vara.formerposition.top[i]);
      }
    }
    
    //此处的ajax使用环境为 1.加载网页 2.新的档期。
    jul.send("/server/jackpot/getPhase",{
      tid : t.d.d.phase.tid
    },function(json){
      t.vara.stage = json.content.stage;
      if(json.status === "ok"){
        if(t.d.d.subject){
          //对主题进行操作
          t.SetTheme(t.d.d);
        }
        for(var i=0; i<10; i++){
          t.d.p[i]=json.content["position_"+i];
        }
        t.jXJacpot_p.html("点击参加");
        if(t.d.d.phase.stage == 1 || t.d.d.phase.stage == 2)
        {
          $(".XJacpotl>dl>dd>span").each(function(){
            if($(this).html() == "点击参加")
              $(this).html("虚位以待");
          });
        }
        // 获取当前所有押注人
        t.socketIns.get({
          m : "getJoin",
          d : {}
        },function(soJson){
          if(soJson)
          {
            for(var i in soJson){
            t.getUserJoins(soJson[i]);
            }
          }
          else{
            Alert("押注信息获取失败","error","载入失败");
            return;
          }
        });
      }
      else{
        Alert("","warning","正在开奖中，请稍候");
      }
    });
  },
  getHistory : function(phasetid,callback){
    var t = this;
    jul.send("/server/jackpot/getResult/",{
      phasetid : phasetid
    },function(json){
      if(json.status == "ok"){
        callback(json.content);
      }else{
        callback(null);
      }
    });
  },
  
  newHistory : function(history){
    var t = this,l;
    t.jHistory_t.html(history.title);
    t.jHistory_c.html(history.vtime);
    t.jHistory_uf.Attrs({"src":G._STEAM_STATIC_oss+history.face});
    t.jHistory_logoa.href = G.Location.account+"/"+history.uid;
    t.jHistory_un.html(history.nick_name);
    t.jHistory_ul.getDom(0).className = "";
    t.jHistory_ul.addCss("userLevel"+history.level);
    t.jHistory_ul.html(history.level_name);
    t.jHistory_sums.html("$"+history.sum);
    t.jHistory_sumc.html(history.counts+"件");
    t.jHistory_imgs.jul("DD").remove();
    l = Math.min(history.joins.length,5);
    t.jHistory_imgs.Create("dd",l).each(function(EE,EI,ES,E){
      var d = history.joins[EI];
      ES.get(EI).jul("*img").Attrs({"src":G._STEAM_STATIC_oss+d.icon});
    });
  },
  // 获奖结果 OR 历史
  onResult : function(){
    var t = this;
		var award  = t.award.index+1;
    t.jXJacpot_c.html(award+"号"+"中奖");
    t.jXJacpot_c.Style("font-size","25px");
    t.jXJacpot_p.get(t.award.index).addCss("avtive");
    t.getHistory(t.history,function(history){
      if(!history){
        return;
      }
      t.newHistory(history);
      if(history.uid !== G.userInfo.uid){
        return;
      }
      t.jXJMark.s();
      t.jXJRes.s();
      t.repo = [];
      t.jXJRem.jul(".item").empty().Create("img",history.joins.length).each(function(EE,EI,ES,E){
        var d = history.joins[EI];
        ES.get(EI).Attrs({"src":G._STEAM_STATIC_oss+d.icon});
        t.repo.push(d.users_inventory_tid);
      });
			t.vara.FastRedeemIns = jul.FastRedeem(t.repo,function(self,json){
				var count = 0;
				for(var i in json)
				{
					count += Number(json[i]);
				}
        if(count != 0)
        {
          count = parseFloat(count).toFixed(2);
          t.jXJRem.jul(".false").html("兑换"+count+"赏金");
				  t.jXJRem.jul(".false").delCss("ing");
          $(".false").show();
        }
			});
    });
  },
  // 切换头像,剔除头像
  OnRand : function(){
    var t = this,i;
    
    var award = [];
		//如果位置被购买的话，就将其[逻辑序号]推进award中
    for(i=0;i<10;i++){
      //参加了的位置t.d.d.phase[position_i]!= "00000000";
      //所以此时的award是所有未参加的位置的数组集合
      if(t.d.d.phase["position_"+i] == "00000000"){
        award.push(i);
      }
    }
    var p = -1;
    var pos = 0;
    var flag = 0;
		var order = [0,5,3,1,8,6,9,2,4,7];
    //可能的升级方案：在未满10人的开奖情况下，可以先剔除无人参加的头像。award是有人参加的头像序号的数组，order是0-10的乱序数组。
		//对order进行处理，将无人购买的序号除去，留下的则为即有人购买也保持乱序的数组，以便下面循环时使用
		//对award的长度进行判断，小于一半则直接从中抽取需要的元素，大于一半则变为删去不需要的元素，这样减少了算法的时间复杂度
//		if(award.length < 6)
//		{
//      //创建一个10个空位的临时变量数组用于保存按order数组的顺序排列的award数组的元素
//      var tOrder = new Array(10);
//      //award数组中的每个元素在order数组中找到相应的位置，并在临时数组的相同位置保存这个元素的值
//      for (var j = 0; j < award.length; j++)
//      {
//        tOrder[order.indexOf(award[j])] = award[j];
//      }
//      //将临时数组中的空位消去
//      for(var k=0;k<tOrder.length;k++)
//      {
//        if(tOrder[k] === undefined)
//        {
//          tOrder.splice(k,1);
//          k--;
//        }
//      }
//      order = tOrder;
//		}
//		else
//		{
//			var length = award.length;
//      for(var i=0;i<10;i++)
//      {
//        for(var j=0;j<award.length;j++)
//        {
//          if(i == award[j])
//            break;
//          if(j == award.length-1)
//            award.push(i);
//        }
//      }
//      award.splice(0,length);
//      for(var i=0;i<award.length;i++)
//      {
//        for(var j=0;j<order.length;j++)
//        {
//          if(order[j] == award[i])
//          {
//            order.splice(j,1);
//            break;
//          }
//        }
//      }
//		}
//    
    t.vara.RandIntervalID = t.tIntervalRand = setInterval(function(){
			p++;
			if(p >= order.length){
				p = 0;
			}
			pos = order[p];
			if(t.award.index != null)
      {
        if(flag == 0)
        {
          //开始剔除头像
          t.KickUser(t.vara.RandIntervalID,p,order,pos,award);
          flag = 1;
        }
			}
        t.jXJacpot_p.get(pos).zIndex(t.award.zIndex++);
        t.jXJacpot_c.html(pos+1);
    },150);
  },
  
  //剔除头像
  KickUser : function(ID,p,order,pos,award){
    var t = this;
    p++;
    t.tIntervalRand = setInterval(function()
    {
      p--;
			if(p < 0)
				p = order.length-1;
			pos = order[p];
			if(order.length == 1 && pos == t.award.index)
      {
				t.onResult();
        clearInterval(ID);
				clearInterval(t.tIntervalRand);
				return;
			}
      if(pos == t.award.index)
      {
        p--;
        if(p < 0)
          p = order.length-1;
        pos = order[p];
      }
      //在award(非玩家位置)的数组长度不为0时，也即是仍有非玩家位置在中心点切换时，在固定切换顺序order中找到下一个要剔除的非玩家位置，剔除时同时在award中删除相关元素
      //此处用来在剔除玩家前先剔除所有的非玩家位置
      if(award.length)
      {
        outer:
        while(1)
        {
          for(var i=0;i<award.length;i++)
          {
            if(award[i] == pos)
            {
              award.splice(i,1);
              break outer;
            }
          }
          p--;
          if(p < 0)
            p = order.length-1;
          pos = order[p];
        }
      }
	   	t.jXJacpot_p.get(pos).delCss("avtive");
        if (t.vara.Navi == "IE9")
          t.MoveTo_compa($(".XJacpotl").children("dl").children("dd").children("span").get(pos),t.vara.formerposition.left[pos],t.vara.formerposition.top[pos]);
				order.splice(p,1);
    },700);
  },
  // 启动开奖
  onAward : function(){
    var t = this;
    
    t.vara.stage = 1;
    t.jXJacpot_p.html();//???
    t.jXJacpot_c.addCss("avtive");
    $(".countdown + label").hide();
    $(".XJacpotl>dl>dd").addClass("awarding");
    $(".XJacpotl>dl>dd>span").each(function(){
            if($(this).html() == "点击参加")
              $(this).html("虚位以待");
          });
    //"倒计时移动"的IE兼容
    if(t.vara.Navi == "IE9")
    {
      $(".countdown").animate({
        "margin-top" : 20
      },300);
    }
    
    var p = -1;
    t.tIntervalMove = setInterval(function(){
      p++;
      if(p == 10)
      {
        if(t.tIntervalMove)
          clearInterval(t.tIntervalMove);
        // 切换头像
        t.OnRand();
        return;
      }
//      if(t.d.d.phase["position_"+p] != "00000000")
//      {
//        t.jXJacpot_p.get(p).addCss("avtive");
//        if(t.vara.Navi == "IE9")
//        {
//          t.MoveTo_compa($(".XJacpotl>dl>dd>span").get(p),283,309);
//        }
//      }
        $(".XJacpotl>dl>dd>span").eq(p).addClass("avtive");
        if(t.vara.Navi == "IE9")
          t.MoveTo_compa($(".XJacpotl>dl>dd>span").get(p),283,309);
    },80);
  },
  // 发送消息
  onMessaging : function(mess){
    var t = this;
    if(!mess || mess.length == 0 || !G.userInfo.uid){
      return;
    }
    if(t.vara.waiting == true)
     return;
    t.vara.waiting = true;
    jul.send("/server/messaging",{
      mid : "X000003D",
      mess : mess,
    },function(json){
      if(json.status === "ok"){
        t.socketIns.get({
          m : "messaging",
          d : json.content
        },function(soJson){});
      }
      t.XJMessb_input.html("");
      t.vara.waiting = false;
    });
  },

  //从socket获得新聊天消息时的响应函数
  ShowMessage : function(mess){
    var t = this;
    //将信息写上去
    var jdl = t.jXJMessm_cont_m.jul("*p");
    jdl.jul("*span").html(mess.nick_name);
    jdl.jul("*span").html(mess.content);
    //如果添加的信息填满了显示区域并且滚动条还未显示，那么显示滚动条
    var h = t.jXJMessm_cont_m.info().height;
    if(h > 300 && $(".XJMessm_scroll").hasClass("notfull"))
      $(".XJMessm_scroll").removeClass("notfull");
    //调整内容栏和滚动条
    t.ScrollChatFrame(1);
  },
  //改变聊天栏中内容栏和滚动条的函数
  ScrollChatFrame : function(p){
    var t = this;
    var h = t.jXJMessm_cont_m.info().height;
    
    //内容栏的移动(内容栏只在此处有代码使其移动)
      //判定条件: 1.未被锁屏 2.鼠标在拖动 这两种情况时内容栏可以动
    if(t.vara.ifLocked == false || t.vara.flag == false)
    {
      var top = (h-301)*p;
      t.jXJMessm_cont.scrollTop(top);
    }
    //滚动条的改变,滚动条在1.此处 2.滚轮滚动(L290) 3.鼠标拖动(L266) 处皆有使其移动的代码
      //判定条件: 锁屏时以及鼠标移动时，不需要依靠此处的计算方式移动滚动条
    if(t.ctrl.messageMove && t.vara.ifLocked == false){
      t.jXJMessm_scroll.Styles({"marginTop":(200*p)+"px"});
    }
    else{
      //锁屏时的滚动条移动计算方式
      var scroll = t.jXJMessm_cont;
      var mt = scroll.scrollTop();
      var minfo = t.jXJMessm_cont_m.info();
      var h = minfo.height - 301;
      t.jXJMessm_scroll.Styles({"marginTop":(200*(mt/h))+"px"});
    }
  },
  // 获取某个押注人
  getUserJoins : function(join_tid){
    var t = this;
    jul.send("/server/jackpot/loadUserJoin",{
      tid : join_tid
    },function(json){
      if(json.status === "ok"){
        var cont = json.content;
        var post = cont.position;
        t.d.p[post] = cont.tid;
        t.jXJacpot_p.get(post).empty().jul("*img").Attrs({"src":G._STEAM_STATIC_oss+cont.face});
        if(cont.uid == G.userInfo.uid){
          t.u.join = true;
          t.u.position = cont.position;
        }
      }else{
        Alert(json.mess,"warning","错误",{
          "确定": function(self){
            self.off();
          },
          "错误": null
        });
      }
    });
  },
  
  // 显示我的背包
  MyBagOn : function(){
    var t = this;
    
    var temp = t.d.d.subject[t.d.d.phase.subtid].steam_market.split(/\s+/);
    var smtid = [];
    for(var i in temp){
      smtid.push(temp[i].replace(/(^\s*)|(\s*$)/g, ""));
    }
    t.jXJMark.s();
    $(".XJMybag").addClass("show");
    if(t.vara.Navi == "IE9")
      t.jXJMybag.s();
    t.uInventoryIns.CBody.choice.inventory = {};
    t.uInventoryIns.CBody.choice.counts = 0;
    t.uInventoryIns.init("Robot","570_2",null,smtid);
  },
  
  // 用户参加
  onToJoin : function(){
    var t = this;
    var Ins = Alert("请稍等","wait");
    t.jXJMark.h();
    t.jXJMybag.h();
    $(".XJMybag").removeClass("show");
    if(t.u.uinventory == null)
    {
      Alert("请先选择一件符合当前主题的饰品","error","温馨提示");
      $(".XJMybag").css("display","block");
      $(".XJMybag").removeClass("show");
      return;
    }
    if(t.vara.waiting == true)//ajax的互斥
    {
      $(".XJMybag").css("display","block");
      $(".XJMybag").removeClass("show");
      return;
    }
    t.vara.waiting = true;
    jul.send("/server/jackpot/toJoin/",{
      tid : t.d.d.phase.tid,
      pos : t.u.position,
      uin : t.u.uinventory
    },function(json){
      if(json.status === "ok"){
        Ins.off();
        t.u.jointid = json.content;
        t.socketIns.get({
          m : "newJoin",
          d : {
            phase_tid : t.d.d.phase.tid,
            join_tid : t.u.jointid,
          }
        },function(soJson){
          if(!soJson.status){
              Alert(soJson.mess,"warning","参加失败",{
                "确定":function(self){
                  self.off();
                  $(".XJMybag").removeClass("show");
                  $(".XJMybag").css("display","block");
                },
                "错误":null
              });
          }else{
            t.u.join = true;
						var position = t.u.position + 1;
              var Ins = Alert("您已经成功占据" + position + "号位置，祝您好运","success","参加成功",{
                "确定":function(self){
                  self.off();
                },
                "错误": null
              });
							Ins.close(3);
          }
        });
        t.vara.waiting = false;
      }
      else{
        Ins.off();
        if(json.mess)
        {
            $(".XJMybag").removeClass("show");
            $(".XJMybag").css("display","block");
            Alert(json.mess, "error", "参加失败", {
              "确定": function (self) {
                self.off();
              },
              "错误": null
            });
          t.u.uinventory = null;
        }
        t.vara.waiting = false;
      }
    });
  },
  //载入和新局时，对主题进行的动作
  SetTheme : function(sub){
    var t = this;
    var array = [];//以数组形式存放所有的主题对象
    var count = -1;
    //遍历json中的主题，将其放入数组中,时间n，空间n
    for (var i in sub.subject)
    {
      count++;
      array[count] = sub.subject[i];
    }
    //通过当前主题在数组中的位置，确认其前一个主题和后一个主题，将三个主题存入相关变量，时间n，空间3
    var current, before, after;
    for (var i = 0; i < array.length; i++)
    {
      var d = array[i];
      if (sub.phase.subtid == array[i].tid)
      {
        current = array[i];
        if (i - 1 < 0)
        {
          var temp = array.length;
          before = array[temp - 1];
        } else
        {
          before = array[i - 1];
        }
        if (i + 1 == array.length)
        {
          after = array[0];
        }else
        {
          after = array[i + 1];
        }
      }
    }
    array[0] = before;
    array[1] = current;
    array[2] = after;
    var d = array[0];
    //array的length会随现在存在的主题增加而增加，但是正确的起作用的只有0、1、2，也就是上一次这次下一次
    //其他的是不是正确的信息，可以考虑删除，
    //判定是否是初次加载
    if (!t.vara.jset[d.tid] && $(".wrap>ul>li").length == 0){
      for (var i = 0; i < 3; i++)
      {
        var h = array[i];
        var j = t.jXJacpotrSubject.jul("*li");
        j.jul("*IMG").Attrs({"src": G.oss.game + h.img});
        j.jul("*span").html(h.title);
        if (i == 1){
          j.elements[0].className = "on";
        }
        t.vara.jset[h.tid] = j;
      }
    }
    //不是初次加载则进行除旧布新的一系列动作
    else
    {
      //添加新元素
      var j = t.jXJacpotrSubject.jul("*li");
      j.jul("*IMG").Attrs({"src": G.oss.game + array[2].img});
      j.jul("*span").html(array[2].title);
      t.vara.jset[array[2].tid] = j;
      //验证即将第三个也就是下面马上要切换的主题是否正确，有可能因为后台对主题进行更改从而影响到前端上一轮对主题的判断
      if($(".wrap>ul>li").eq(2).children("span").html() !== array[1].title)
      {
        $(".wrap>ul>li").eq(2).children("img").attr("src",G.oss.game + array[1].img);
        $(".wrap>ul>li").eq(2).children("span").html(array[1].title);
      }
      //删除li的class=on
      t.jXJacpotrSubject.jul(".on").delCss("on");
      ////ul.class=on，移动ul
      setTimeout(function () {
        if (t.vara.Navi == "IE9")
        {
          $(".wrap>ul").animate({left: "-150px"}, "fast");
        } else
        {
          t.jXJacpotrSubject.addCss("on");
        }
      }, 1000);
      //添加li上的class=on
      setTimeout(function () {
        t.jXJacpotrSubject.jul("li").get(2).addCss("on");
      }, 1500);
      //删除元素和ul的class
      setTimeout(function () {
        t.jXJacpotrSubject.jul("li").get(0).remove();
        delete t.jXJacpotrSubject.jul("li").get(0);
        if (t.vara.Navi == "IE9")
        {
          $(".wrap>ul").css("left", "0px");
        } else
        {
          t.jXJacpotrSubject.delCss("on");
        }
      }, 2500);
    }
  },
	//用于在无法接收到开奖消息的情况下，在第二局开始时进行重置
	AccidentReset : function(){
		var t = this;
		//历史的重新载入，相当于更新了新的游戏历史
		t.getHistory(t.history,function(history){
      if(!history){
        return;
      }
      t.newHistory(history);
    });
		//将仍在切换的数字和头像重置
		clearInterval(t.vara.RandIntervalID);
	},
  // SO 链接成功
  SOloadPhase : function(data){
    var t = this;
    t.d.d = data;
    //载入时正在开奖
    if(t.d.d.phase.stage == 1 || t.d.d.phase.stage == 2)
    {
      $(".XJacpotl>dl>dd").addClass("awarding");
      $(".XJacpotl>dl>dd>span").each(function(){
        if($(this).html() == "点击参加")
          $(this).html("虚位以待");
      });
      $(".countdown + label").animate({
      "top": -23
      },300);
      $(".countdown + label").html("系统开奖中");
    }
    
    t.reSetUI();
  },
  // 开启新档期
  SOnewPhase : function(data){
    var t = this;
    t.d.d = data;
    clearInterval(t.vara.IDfWait);
    
    t.reSetUI();
    t.AccidentReset();
  },
  // 一个新的押注人
  SOnewJoin : function(data){
    var t = this;
    t.getUserJoins(data.join_tid);
  },
  // 倒计时
  SOawardCountdown : function(phase){
    var t = this;
    t.jXJacpot_c.html(phase.second+"s");
//    if($(".countdown").html == "58s")
//    {
//      var tempSec = t.vara.Date.getSeconds();
//      var resu = t.Judge(t.vara.Count,tempSec);
//      if(resu >= 16)
//        t.reSetUI();
//    }
  },
  // 开奖
  SOAward : function(data){
    var t = this;
    t.jXJMark.h();
    t.jXJMybag.h();
    t.d.d.phase = data.phase;
    t.onAward();
  },
  // 展示结果
  SOAwardResult : function(data){
    var t = this;
    setTimeout(function(){
      t.award.index = data.index;
      t.history = t.d.d.phase.tid;
    },2000);
  },
  // 即时通讯
  SOmessaging : function(mess){
    var t = this;
//    t.onNewMessaging(mess);
    t.ShowMessage(mess);
  },
  // 流局
  SOlosePhase : function(data){
    var t = this;
    if($(".XJRes").css("display") != "block")
      t.jXJMark.h();
    if(t.vara.Navi == "IE9")
      t.jXJMybag.h();
    if (t.u.join === true)
    {
      var Ins = Alert("您的饰品已被退回至背包,请及时查看","warning","本局流局",{
        "确定": function(self){
          self.off();
        },
        "错误": null
      });
      Ins.close(3);
    };
  },
  MoveTo_compa : function(obj,left,top){
    var t = this;
    $(obj).animate({
      left: left,
      top: top
    },300);
  },
  xxxxxxx : function(){},
  m : function(str){
    alert(str);}
};
jackpot.fn.base.prototype = jackpot.fn;
})(window,undefined,jul);
