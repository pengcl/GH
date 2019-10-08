// charts 渲染函数
function draw(charts, id) { //charts:数据 id:容器id

  var len = charts.list.length;
  var $container = $("#" + id);
  $container.html(''); // 清空画布
  $("#actions").detach();

  $('<div id="x"></div>').appendTo($container); // 构建x轴 画布
  $('<div id="y"></div>').appendTo($container); // 构建y轴 画布
  $('<div id="c"></div>').appendTo($container); // 构建区域 画布
  $('<div id="d"></div>').appendTo($container); // 构建点 画布
  $('<div id="l"></div>').appendTo($container); // 构建线 画布

  // 构建主操作空间
  $('<div id="content" class="content"></div>').appendTo($container);
  var $content = $("#content");
  var $x = $("#x");
  var $y = $("#y");
  var $c = $("#c");
  var $d = $("#d");
  var $l = $("#l");

  var className = '';

  for (var i = 0; i < 5 * len; i++) {

    if ((i >= 10 && i < 20) || (i >= 30 && i < 40)) {

      if (i % 2 === 0) {
        className = 'even-e';
      } else {
        className = 'odd-o';
      }
    } else {
      if (i % 2 === 0) {
        className = 'even';
      } else {
        className = 'odd';
      }
    }

    $("<span style='width: " + 100 / len + "%;' class=" + className + "></span>").appendTo($content);
  }

  $('<div id="p"></div>').appendTo($container); // 构建比例 画布
  var $p = $("#p");
  $p.animate({height: charts.percent + '%'});

  charts.list.forEach(function (item, i) {
    // 绘制x轴
    $("<i style='right: " + (100 - (i + 1) * 100 / len) + "%;'>" + item.x + "</i>").appendTo($x);
    // 绘制点
    $("<i style='left: " + (i + 1) * 100 / len + "%;bottom: " + item.y * 100 / charts.need + "%;'>" + item.y + "</i>").appendTo($d);
    // 绘制区间
    $("<i class='old' style='left: " + (i + 1) * 100 / len + "%;width:" + 80 / len + "%;bottom:" + item.c[0] * 100 / charts.need + "%;top:" + (charts.need - item.c[1]) * 100 / charts.need + "%;'><em>" + (item.c[1] - item.c[0]) + "</em></i>").appendTo($c);
  });

  for (var i = 0; i < 6; i++) { // 绘制y轴
    $("<i>" + Math.floor(charts.need / 5 * i) + "</i>").appendTo($y);
  }

  for (var i = 0; i < len - 1; i++) {
    var x0 = $d.find('i')[i].offsetLeft;
    var y0 = $d.find('i')[i].offsetTop;
    var x1 = $d.find('i')[i + 1].offsetLeft;
    var y1 = $d.find('i')[i + 1].offsetTop;

    var _x = x1 - x0;
    var _y = y1 - y0;

    var _w = Math.sqrt(_x * _x + _y * _y);


    $("<i style='width: " + _w + "px;left:" + (x0 + 3) + "px;top:" + (y0 + 3) + "px;transform: rotate(" + (y1 - y0 > 0 ? "" : "-") + Math.floor(180 / (Math.PI / Math.acos(_x / _w))) + "deg)'></i>").appendTo($l);
  }

  $d.find('i').click(function () {
    $(this).toggleClass('big');
  });

  $container.after('<div id="actions"><span class="dot"><i></i><em>云购位置</em></span><span class="diamond"><i></i><em>获奖用户区间</em></span></div>');
  var $actions = $("#actions");

  if (charts.now && charts.now.length > 0) {// 绘制我当前的购买区间
    charts.now.forEach(function (item, i) {
      $("<i class='now now-" + i + "' style='left: 0%;width:" + 80 / len + "%;bottom:" + item.start * 100 / charts.need + "%;height:0%;'></i>").appendTo($c);
      var $n = $("#c i.now").eq(i);
      if ($n.css('height') === "0px") {
        $n.animate({height: (item.end - item.start) * 100 / charts.need + '%'});
      } else {
        $n.animate({height: "0px"});
      }
    });
    $("<span class='now'><i></i><em>我的购买人次</em></span>").appendTo($actions);
  }

  $("#actions .dot").click(function () {
    var $l = $("#l");
    var $d = $("#d");
    if ($l.css('width') === "0px") {
      $l.animate({width: "100%"});
      $d.show();
    } else {
      $l.animate({width: "0px"});
      $d.hide();
    }
  });

  $("#actions .diamond").click(function () {
    var $c = $("#c i.old");
    if ($c.css('width') === "0px") {
      $c.animate({width: 80 / charts.list.length + '%'});
      $c.find('em').show();
    } else {
      $c.animate({width: "0px"});
      $c.find('em').hide();
    }
  });

  $("#actions .now").click(function () {
    charts.now.forEach(function (item, i) {
      var $n = $("#c i.now").eq(i);
      if ($n.css('height') === "0px") {
        $n.animate({height: (item.end - item.start) * 100 / charts.need + '%'});
      } else {
        $n.animate({height: "0px"});
      }
    });
  });
}
