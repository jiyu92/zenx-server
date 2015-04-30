var app=angular.module("app",["ngAnimate","ngMaterial"]),ZenX={socket:null,socketRequests:{},version:window.version,modules:{},text:{},focusIndex:1};app.config(["$mdThemingProvider",function(e){e.theme("default").primaryPalette("orange").accentPalette("yellow")}]),ZenX.log=function(e,n){"string"!=typeof e&&(n=e);var t="color:white;             font-size: 14px; text-shadow: 1px 1px 1px #999, -1px 1px 1px #999, -1px -1px 1px #999, 1px -1px 1px #999",i="color:yellow;            font-size: 14px; text-shadow: 1px 1px 1px #999, -1px 1px 1px #999, -1px -1px 1px #999, 1px -1px 1px #999",o="color:white;             font-size: 14px; text-shadow: 1px 1px 1px #999, -1px 1px 1px #999, -1px -1px 1px #999, 1px -1px 1px #999",s="color: rgb(6, 152, 154); font-size: 12px;",a="%c[Zen%cX%c]%c "+("string"==typeof e?e:"");n?console.log(a,t,i,o,s,n):console.log(a,t,i,o,s)},ZenX.log("Version "+ZenX.version),ZenX.clock=setInterval(function(){$(".user-block .clock").html((new Date).getHours()+":"+((new Date).getMinutes()<10?"0":"")+(new Date).getMinutes())},1e3),$(window).click(function(e){var n=$(e.target);if(n.is(":not(.user-block .user-img)")&&$(".user-menu").addClass("out"),n.is(".zenx-window .window-head .x")&&ZenX.closeWindow(n),n.is(".desktop,.dock")){var t=$("<div>");t.addClass("circle").css({top:e.pageY,left:e.pageX}),$(".desktop").append(t),$(".x-focus").removeClass("x-focus"),setTimeout(function(){t.remove()},1500)}if(n.is(".zenx-window .window-head .fs"))if(n.parents(".zenx-window").hasClass("fs"))n.parents(".zenx-window").removeClass("fs"),n.parents(".zenx-window").animate({width:n.parents(".zenx-window").css("min-width"),height:n.parents(".zenx-window").css("min-height"),top:window.innerHeight/2-n.parents(".zenx-window").css("min-height").split("px")[0]/2,left:window.innerWidth/2-n.parents(".zenx-window").css("min-width").split("px")[0]/2},500,"swing");else{var i=n.parents(".zenx-window");i.animate({top:"10px",left:"10px",width:window.innerWidth-22+"px",height:window.innerHeight-100+"px"},300,"swing").addClass("fs")}}),$(window).bind("mousedown",function(e){var n=$(e.target);n.is(".zenx-window:not(.x-focus) *")&&ZenX.focus(n.parents(".zenx-window")),n.is(".zenx-window > .resizer")&&($("html").addClass("resizing"),ZenX.RESIZING=n.parents(".zenx-window"),ZenX.RESIZING_START={x:e.pageX,y:e.pageY,eW:ZenX.RESIZING.width()+2,eH:ZenX.RESIZING.height()+2}),n.is(".zenx-window .window-head, .zenx-window .window-head .title")&&(ZenX.DRAGGING=n.parents(".zenx-window"),ZenX.DRAGGING_START={x:e.pageX,y:e.pageY,eX:ZenX.DRAGGING.offset().left,eY:ZenX.DRAGGING.offset().top})}),$(window).bind("mouseup",function(){ZenX.DRAGGING=null,ZenX.RESIZING=null,$("html.resizing").removeClass("resizing")}),$(window).bind("mousemove",function(e){if(ZenX.DRAGGING){var n=ZenX.DRAGGING,t=ZenX.DRAGGING_START,i=+t.eY+(e.pageY-t.y),o=+t.eX+(e.pageX-t.x),s={top:i+"px",left:o+"px"};0>i&&(s.top="0px"),0>o&&(s.left="0px"),i+n.height()+2>window.innerHeight&&(s.top=window.innerHeight-n.height()-2+"px"),o+n.width()+2>window.innerWidth&&(s.left=window.innerWidth-n.width()-2+"px"),n.css(s)}if(ZenX.RESIZING){var n=ZenX.RESIZING,t=ZenX.RESIZING_START,a=+t.eW+(e.pageX-t.x),l=+t.eH+(e.pageY-t.y),s={width:a+"px",height:l+"px"};a+n.offset().left>window.innerWidth&&(s.width=window.innerWidth-n.offset().left+"px"),l+n.offset().top>window.innerHeight&&(s.height=window.innerHeight-n.offset().top+"px"),n.css(s).removeClass("fs")}}),app.controller("desktop",["$scope","$compile","$timeout","$rootScope",function(e,n,t,i){e.text={},ZenX.updateText=function(){e.text=this.text},$(".user-block .user-img").click(function(){$(".user-menu").toggleClass("out")}),ZenX.createWindow=function(t){var i=$(t.parent?t.parent:".desktop > .pool"),o=$(".window-template").clone(),s=t.width||400,a=t.height||350,l=void 0==t.focus?!0:t.focus;o.addClass("zenx-window").removeClass("window-template out").css({width:s+"px",height:a+"px",minWidth:(s<(t.minWidth||400)?s:t.minWidth||400)+"px",minHeight:(a<(t.minHeight||400)?a:t.minHeight||400)+"px",top:"calc(50% - "+a/2+"px)",left:"calc(50% - "+s/2+"px)"}),o.find(".title").html(t.title||""),i.append(o),"string"==typeof t.template?e.$apply(function(){var i=n(t.template)(e);o.find(".window-content").append(i)}):o.find(".window-content").append(t.template||""),(void 0==t.resizable||t.resizable)&&o.append('<div class="resizer"></div>'),l&&ZenX.focus(o),t.callback&&t.callback(o),void 0==t.maximizable||t.maximizable||o.find(".window-head .fs").addClass("disabled")},ZenX.confirm=function(e,n,t){var i=$(".dialog-template").clone(),o=function(){ZenX.closeWindow(this)};i.find(".title").html(e.title),i.find(".message").html(e.message),i.find(".yes").html(e.buttons.split(" ")[0]),i.find(".no").html(e.buttons.split(" ")[1]),this.createWindow({title:e.windowTitle,width:300,height:165,resizable:!1,maximizable:!1,parent:"body",template:i.removeClass("dialog-template out").addClass("confirm-content"),callback:function(e){e.find(".yes").click(o).click(n||function(){}).focus(),e.find(".no").click(o).click(t||function(){})}})},ZenX.alert=function(e){var n=$(".dialog-template").clone(),t=function(){ZenX.closeWindow(this)};n.find(".title").html(e.title),n.find(".message").html(e.message),n.find(".yes").html(e.buttons.split(" ")[0]),n.find(".no").remove(),this.createWindow({title:e.windowTitle,width:300,height:165,resizable:!1,maximizable:!1,parent:"body",template:n.removeClass("dialog-template out").addClass("confirm-content"),callback:function(e){e.find(".yes").click(t).focus()}})},ZenX.focus=function(e){"string"==typeof e&&(e=$(e)),$(".x-focus").removeClass("x-focus"),e.addClass("x-focus").css("z-index",++ZenX.focusIndex)},ZenX.closeWindow=function(e){var n=$(e).is(".zenx-window")?$(e):$(e).parents(".zenx-window");n.addClass("closing"),t(function(){n.remove()},250)},$(".user-menu .option.logout").click(function(){ZenX.confirm({windowTitle:"ZenX Manager",title:ZenX.text.LOGOUT,message:ZenX.text.CONFIRM_LOGOUT,buttons:"yes no"},function(){ZenX.log("Destroying token..."),$(".loading-status").html(ZenX.text.LOGGING_OUT),$(".desktop").addClass("out"),localStorage.removeItem("session_token"),ZenX.socket.send(JSON.stringify({api:"core",request:"purge-token",token:ZenX.token})),ZenX.LOGGING_OUT=!0,ZenX.socket.close(),delete ZenX.socket,ZenX.modules={},delete ZenX.token,$(".zenx-window").each(function(e,n){ZenX.closeWindow(n)}),ZenX.focusIndex=1,t(function(){ZenX.log("Logout successful."),i.showLogin()},1e3)})}),$(".user-menu .option.settings").click(function(){return $('.zenx-window[data-module="settings"]').length?ZenX.focus($('.zenx-window[data-module="settings"]')):void ZenX.createWindow({width:600,height:400,minWidth:600,minHeight:600,title:ZenX.text.SETTINGS,template:'<div class="app-spinner"></div><div ng-controller="settings"></div>',callback:function(e){e.attr("data-module","settings")}})})}]),app.controller("settings",["$scope","$rootScope","$timeout",function(e,n,t){ZenX.log("Started settings controller."),function i(){ZenX.log("Loading settings template..."),$http.post("api",{api:"core",request:"settings",token:ZenX.token}).success(function(e){}).error(function(e){ZenX.log("Failed to load settings template with error: ",e),ZenX.log("Retrying to load settings template..."),t(i,2e3)})}()}]);