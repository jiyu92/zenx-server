var app=angular.module("app",["ngAnimate","ngMaterial"]),ZenX={socket:null,socketRequests:{},version:window.version,modules:{},text:{},focusIndex:1};app.config(["$mdThemingProvider",function(e){e.theme("default").primaryPalette("orange").accentPalette("yellow")}]),ZenX.log=function(e,n){"string"!=typeof e&&(n=e);var t="color:white;             font-size: 14px; text-shadow: 1px 1px 1px #999, -1px 1px 1px #999, -1px -1px 1px #999, 1px -1px 1px #999",o="color:yellow;            font-size: 14px; text-shadow: 1px 1px 1px #999, -1px 1px 1px #999, -1px -1px 1px #999, 1px -1px 1px #999",i="color:white;             font-size: 14px; text-shadow: 1px 1px 1px #999, -1px 1px 1px #999, -1px -1px 1px #999, 1px -1px 1px #999",s="color: rgb(6, 152, 154); font-size: 12px;",a="%c[Zen%cX%c]%c "+("string"==typeof e?e:"");n?console.log(a,t,o,i,s,n):console.log(a,t,o,i,s)},ZenX.log("Version "+ZenX.version),ZenX.clock=setInterval(function(){$(".user-block .clock").html((new Date).getHours()+":"+((new Date).getMinutes()<10?"0":"")+(new Date).getMinutes())},1e3),$(window).click(function(e){var n=$(e.target);if(n.is(":not(.user-block .user-img)")&&$(".user-menu").addClass("out"),n.is(".zenx-window .window-head .x")&&ZenX.closeWindow(n),n.is(".desktop,.dock")){var t=$("<div>");t.addClass("circle").css({top:e.pageY,left:e.pageX}),$(".desktop").append(t),$(".x-focus").removeClass("x-focus"),setTimeout(function(){t.remove()},1500)}if(n.is(".zenx-window .window-head .fs"))if(n.parents(".zenx-window").hasClass("fs"))n.parents(".zenx-window").removeClass("fs"),n.parents(".zenx-window").animate({width:n.parents(".zenx-window").css("min-width"),height:n.parents(".zenx-window").css("min-height"),top:window.innerHeight/2-n.parents(".zenx-window").css("min-height").split("px")[0]/2,left:window.innerWidth/2-n.parents(".zenx-window").css("min-width").split("px")[0]/2},500,"swing");else{var o=n.parents(".zenx-window");o.animate({top:"10px",left:"10px",width:window.innerWidth-22+"px",height:window.innerHeight-100+"px"},300,"swing").addClass("fs")}}),$(window).bind("mousedown",function(e){var n=$(e.target);n.is(".zenx-window:not(.x-focus) *")&&ZenX.focus(n.parents(".zenx-window")),n.is(".zenx-window > .resizer")&&($("html").addClass("resizing"),ZenX.RESIZING=n.parents(".zenx-window"),ZenX.RESIZING_START={x:e.pageX,y:e.pageY,eW:ZenX.RESIZING.width()+2,eH:ZenX.RESIZING.height()+2}),n.is(".zenx-window .window-head, .zenx-window .window-head .title")&&(ZenX.DRAGGING=n.parents(".zenx-window"),ZenX.DRAGGING_START={x:e.pageX,y:e.pageY,eX:ZenX.DRAGGING.offset().left,eY:ZenX.DRAGGING.offset().top})}),$(window).bind("mouseup",function(){ZenX.DRAGGING=null,ZenX.RESIZING=null,$("html.resizing").removeClass("resizing")}),$(window).bind("mousemove",function(e){if(ZenX.DRAGGING){var n=ZenX.DRAGGING,t=ZenX.DRAGGING_START,o=+t.eY+(e.pageY-t.y),i=+t.eX+(e.pageX-t.x),s={top:o+"px",left:i+"px"};0>o&&(s.top="0px"),0>i&&(s.left="0px"),o+n.height()+2>window.innerHeight&&(s.top=window.innerHeight-n.height()-2+"px"),i+n.width()+2>window.innerWidth&&(s.left=window.innerWidth-n.width()-2+"px"),n.css(s)}if(ZenX.RESIZING){var n=ZenX.RESIZING,t=ZenX.RESIZING_START,a=+t.eW+(e.pageX-t.x),l=+t.eH+(e.pageY-t.y),s={width:a+"px",height:l+"px"};a+n.offset().left>window.innerWidth&&(s.width=window.innerWidth-n.offset().left+"px"),l+n.offset().top>window.innerHeight&&(s.height=window.innerHeight-n.offset().top+"px"),n.css(s).removeClass("fs")}}),app.run(["$http","$rootScope",function(e,n){ZenX.send=function(n){if(ZenX.token&&(n.token=ZenX.token),this.socket&&this.socket.readyState){var t=n.api+":"+n.request+":"+(new Date).getTime();return n.requestID=t,ZenX.socketRequests[t]=n,n.success=function(e){return this.onsuccess=e,this},n.error=function(e){return this.onerror=e,this},ZenX.socket.send(JSON.stringify(n)),0===n.timeout||n.persistent||(n.timeoutFn=setTimeout(function(){n.onerror&&n.onerror({error:"websocket_timeout"}),delete ZenX.socketRequests[n.requestID]},n.timeout||1e4)),n}return n.ws?ZenX.log("Request canceled. No WebSocket available: ",n):e.post("api",n)}}]),$(document).bind("touchstart touchend touchmove",function(e){return e.preventDefault(),e.stopPropagation(),!1}),app.controller("desktop",["$scope","$compile","$timeout","$rootScope",function(e,n,t,o){e.text={},ZenX.updateText=function(){e.text=this.text},e.toggleUserMenu=function(){$(".user-menu").toggleClass("out")},ZenX.createWindow=function(t){var o=$(t.parent?t.parent:".desktop > .pool"),i=$(".window-template").clone(),s=t.width||400,a=t.height||350,l=void 0==t.focus?!0:t.focus;i.addClass("zenx-window").removeClass("window-template out").css({width:s+"px",height:a+"px",minWidth:(s<(t.minWidth||400)?s:t.minWidth||400)+"px",minHeight:(a<(t.minHeight||400)?a:t.minHeight||400)+"px",top:"calc(50% - "+a/2+"px)",left:"calc(50% - "+s/2+"px)"}),i.find(".title").html(t.title||""),o.append(i),"string"==typeof t.template?e.$apply(function(){var o=n(t.template)(e);i.find(".window-content").append(o)}):i.find(".window-content").append(t.template||""),(void 0==t.resizable||t.resizable)&&i.append('<div class="resizer"></div>'),l&&ZenX.focus(i),t.callback&&t.callback(i),void 0==t.maximizable||t.maximizable||i.find(".window-head .fs").addClass("disabled")},ZenX.confirm=function(e,n,t){var o=$(".dialog-template").clone(),i=function(){ZenX.closeWindow(this)};o.find(".title").html(e.title),o.find(".message").html(e.message),o.find(".yes").html(e.buttons.split(" ")[0]),o.find(".no").html(e.buttons.split(" ")[1]),this.createWindow({title:e.windowTitle,width:300,height:165,resizable:!1,maximizable:!1,parent:"body",template:o.removeClass("dialog-template out").addClass("confirm-content"),callback:function(o){o.find(".yes").click(i).click(n||function(){}).focus(),o.find(".no").click(i).click(t||function(){}),e.callback&&e.callback(o)}})},ZenX.alert=function(e){var n=$(".dialog-template").clone(),t=function(){ZenX.closeWindow(this)};n.find(".title").html(e.title),n.find(".message").html(e.message),n.find(".yes").html(e.buttons.split(" ")[0]),n.find(".no").remove(),this.createWindow({title:e.windowTitle,width:300,height:165,resizable:!1,maximizable:!1,parent:"body",template:n.removeClass("dialog-template out").addClass("confirm-content"),callback:function(n){n.find(".yes").click(t).focus(),e.callback&&e.callback(n)}})},ZenX.focus=function(e){"string"==typeof e&&(e=$(e)),$(".x-focus").removeClass("x-focus"),e.addClass("x-focus").css("z-index",++ZenX.focusIndex)},ZenX.closeWindow=function(e){var n=$(e).is(".zenx-window")?$(e):$(e).parents(".zenx-window");n.addClass("closing"),t(function(){n.remove()},250)},e.logout=function(){$('.zenx-window[data-id="logout"]').length?ZenX.focus($('.zenx-window[data-id="logout"]')):ZenX.confirm({windowTitle:"ZenX Manager",title:ZenX.text.LOGOUT,message:ZenX.text.CONFIRM_LOGOUT,buttons:"yes no",callback:function(e){e.attr("data-id","logout")}},function(){ZenX.log("Destroying token..."),$(".loading-status").html(ZenX.text.LOGGING_OUT),$(".desktop").addClass("out"),localStorage.removeItem("session_token"),ZenX.socket.send(JSON.stringify({api:"core",request:"purge-token",token:ZenX.token})),ZenX.LOGGING_OUT=!0,ZenX.socket.close(),delete ZenX.socket,ZenX.modules={},delete ZenX.token,$(".zenx-window").each(function(e,n){ZenX.closeWindow(n)}),ZenX.focusIndex=1,t(function(){ZenX.log("Logout successful."),o.showLogin()},1e3)})},$(".user-menu .settings").click(function(){return $('.zenx-window[data-module="settings"]').length?ZenX.focus($('.zenx-window[data-module="settings"]')):void ZenX.createWindow({width:600,height:400,minWidth:600,minHeight:600,title:ZenX.text.SETTINGS,template:'<div class="app-spinner"></div><div class="out ani02" ng-controller="settings"></div>',callback:function(e){e.attr("data-module","settings")}})})}]),app.controller("login",["$scope","$timeout","$http","$rootScope",function(e,n,t,o){function i(){$(".loading-status").addClass("out"),$(".login-dialog *").attr("disabled",!1),$(".login-dialog").css("opacity",1).removeClass("pending"),$("body > .spinner").addClass("out")}function s(){$(".login-dialog *").attr("disabled",!1),$(".login-dialog").css("opacity",0).removeClass("pending")}function a(){$(".loading-status").addClass("out"),$(".login-dialog *").attr("disabled",!0),$(".login-dialog").css("opacity",1).addClass("pending"),$("body > .spinner:not(.out)").addClass("out")}function l(e){function n(t){ZenX.log("Starting new WebSocket connection..."),ZenX.socket=new WebSocket("wss://"+window.location.host),ZenX.socket.onopen=function(){ZenX.log("WebSocket connected. Getting auth...");var n={api:"core",request:"ws-auth",token:e.token,ws:!0};ZenX.send(n).success(function(e){ZenX.log("Auth received: ",e),$(".user-block .connected-light").removeClass("offline"),"success"!=e.message?(ZenX.log("Bad auth. Getting new in 1s..."),setTimeout(function(){return ZenX.socketRequests[requestID]=this,ZenX.socket.send(JSON.stringify(n))},1e3)):(ZenX.log("Auth successful. Socket healthy."),"function"==typeof t&&t())}).error(function(e){ZenX.log("Websocket auth timed out. Procceeding..."),"function"==typeof t&&t()}),ZenX.socket.onmessage=function(e){var e=JSON.parse(e.data),n=ZenX.socketRequests[e.requestID];n.onsuccess(e),!isNaN(n.timeoutFn)&&clearTimeout(n.timeoutFn),n.persistent||delete ZenX.socketRequests[e.requestID]}},ZenX.socket.onerror=function(e){ZenX.log("WebSocket error: ",e)},ZenX.socket.onclose=function(){for(var e in ZenX.socketRequests){try{clearTimeout(ZenX.socketRequests[e].timeoutFn),ZenX.socketRequests[e].onerror({error:"connection_dropped"})}catch(t){}delete ZenX.socketRequests[e]}return ZenX.LOGGING_OUT?delete ZenX.LOGGING_OUT:(ZenX.log("WebSocket dropped. Reconnecting..."),$(".user-block .connected-light").addClass("offline"),void n())}}function t(){$(".loading-status").html(ZenX.text.INITIALIZE_ASSETS),ZenX.log("Loading assets...");var e=[],n=[ZenX.user.profileImage||"images/default.gif",ZenX.user.backgroundImage||"images/bg3.jpg"],t=["audio/newmsg.mp3"],i=0;n.forEach(function(n){var t=new Image;t.src=n,e.push(t)}),t.forEach(function(n){var t=new Audio;t.src=n,e.push(t)}),e.forEach(function(n){var t=$(n).is("audio")?"oncanplaythrough":"onload";n[t]=function(){ZenX.log("Loaded asset: ",this),++i==e.length&&(ZenX.log("Loaded "+e.length+" assets."),o())}})}function o(){ZenX.log("Initialization complete. Welcome!"),$(".user-block .user-img").css("background-image","url("+(ZenX.user.profileImage||"images/default.gif")+")"),$(".desktop").removeClass("out").css("background-image","url("+(e.user.backgroundImage||"images/bg3.jpg")+")")}ZenX.token=e.token,ZenX.text=e.text,ZenX.user=e.user,ZenX.updateText(),$("body > .spinner, .loading-status").removeClass("out"),$(".loading-status").html(ZenX.text.INITIALIZE_CONNECTING_WEBSOCKET),n(function(){function e(i){$.getScript("/modules/"+i+"/main.js").done(function(){++n==o&&(ZenX.log("Loaded "+o+" modules."),t())}).fail(function(){e(i)})}var n=0,o=0;for(var i in ZenX.user.modules)o++;$(".loading-status").html(ZenX.text.INITIALIZE_MODULES),ZenX.log("Loading modules...");for(var i in ZenX.user.modules)e(i)})}s(),o.showLogin=i,window.hit=function(e){t.post("api",e).success(function(e){console.log(e)})};var c=new Image;c.src="/images/logo.png",localStorage.getItem("session_token")?(n(function(){$(".loading-status").removeClass("out")},100),ZenX.log("Token exists. Authenticating..."),t.post("api",{api:"core",request:"auth",token:localStorage.getItem("session_token")}).success(function(e){"success"!=e.message?(ZenX.log("Authentication unsuccessful: ",e),i(),localStorage.removeItem("session_token")):(ZenX.log("Authentication successful. Initializing..."),ZenX.log("Login data: ",e),l(e))}).error(function(e){ZenX.log("Authentication failed with error: ",e),i()})):c.onload=i,e.rememberMe=!0,e.showTooltip=!1,$('input[name="username"]').focus(),e.login=function(){return e.username&&e.password?(e.showTooltip=!1,a(),ZenX.log("Attempting to log in..."),void ZenX.send({request:"login",username:e.username,password:e.password,api:"core"}).success(function(n){"success"!=n.message?(ZenX.log("Login unsuccessful: ",n),ZenX.alert({windowTitle:"ZenX Manager",title:"Login failed: Wrong credentials",message:"Please make sure you entered your credentials correctly and try again.",buttons:"ok"}),i()):(ZenX.log("Successful login. Initializing..."),ZenX.log("Login data: ",n),e.username="",e.password="",e.rememberMe&&(localStorage.setItem("session_token",n.token),ZenX.log("Token saved to local storage.")),s(),l(n))}).error(function(e){ZenX.log("Login failed with error: ",e),ZenX.alert({windowTitle:"ZenX Manager",title:"Login failed",message:"An error occured. Please try again later.",buttons:"ok"}),i()})):e.showTooltip=!0}}]),app.controller("settings",["$scope","$rootScope","$timeout","$compile","$http",function(e,n,t,o,i){ZenX.log("Started settings controller."),function s(){ZenX.log("Loading settings template..."),ZenX.send({api:"core",request:"settings-template"}).success(function(n){"success"==n.message?(e.data=n.data,e.$apply(function(){var t=o(n.template)(e);$('[ng-controller="settings"]').html(t).removeClass("out")})):ZenX.log("Templated failed to load with response: ",n)}).error(function(e){ZenX.log("Failed to load settings template with error: ",e),ZenX.log("Retrying to load settings template..."),t(s,2e3)})}()}]);