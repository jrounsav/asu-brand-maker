/*
  ToDo  
      
      - CSS needs to support multi-nested elements
      
*/
(function () {
  var renderer;

  var ASUHeaderRender = {
    update: function update() {
      var menuTarget = document.getElementById('asu_universal_nav');
      if (menuTarget.firstChild) {
        menuTarget.removeChild(menuTarget.firstChild);
      }
      var builtMenu = buildPreview(window.ASUHeaderMakerJSON.children)
      console.log(builtMenu);
      document.getElementById('asu_universal_nav').appendChild(builtMenu);
    },
    init: function init(){
      window.ASUHeaderRender = this;
      this.update();
    }
  }

  /* -- Main Thread -- */
  function main() {
    renderer = document.getElementsByClassName('asu-header-render')[0];
    coreHeaderExec();
    buildZone();
    ASUHeaderRender.init();
  }

  /* -- This just sets up the header text -- */
  function buildZone() {
    /* -- Build the header for the preview zone -- */
    var renderHeader = document.createElement('div');
    renderHeader.className = 'asu-header-render-head';
    var renderText = document.createElement('h3');
    renderText.textContent = 'Header Preview';
//    var renderType = document.createElement('i');
//    renderType.className = 'asu-header-render-type fa fa-toggle-off';
    renderHeader.appendChild(renderText);
//    renderHeader.appendChild(renderType);
    renderer.appendChild(renderHeader);
    
    /* -- Adding Event listener to the toggle button -- */
//    renderType.addEventListener('click', function isMobileEvent(){
//      var status = toggleMobileCss();
//      if(status){
//        document.getElementsByClassName('asu-header-render-type')[0].className = 'asu-header-render-type fa fa-toggle-on';
//      } else{
//        document.getElementsByClassName('asu-header-render-type')[0].className = 'asu-header-render-type fa fa-toggle-off';
//      }
//    }, false);

    /* -- Build the Preview zone -- */

    var renderZone = document.createElement('div');
    renderZone.className = 'asu-header-render-zone';
    renderZone.innerHTML = headerHTML;
    renderer.appendChild(renderZone);
  }
  /* -- Turns on/off the css for the mobile menu -- */
//  function toggleMobileCss(){
//    var target = document.getElementById('asu-header-render-mobile-css');
//    var head = document.getElementsByTagName('head')[0];
//    if(!target){
//      var newstyle = document.createElement('style');
//      newstyle.id = 'asu-header-render-mobile-css';
//      newstyle.innerHTML = mobileCSS;
//      head.appendChild(newstyle);
//      return true;
//    } else{
//      head.removeChild(target);
//      return null;
//    }
//  }

  /* -- This builds out the menu on the header block -- */
  //  function buildMenu(){
  //    var menuTarget = document.getElementById('asu_universal_nav');
  //    if(menuTarget.firstChild){     
  //      menuTarget.firstChild.removeChild();
  //    }
  //    var builtMenu = buildPreview(window.ASUHeaderMakerJSON.children)
  //    console.log(builtMenu);
  //    document.getElementById('asu_universal_nav').appendChild(builtMenu);
  //    
  //    document.getElementsByClassName('asu-header-builder').addEventListener('onclick onkeyup', function(){console.log('changed')}, false);
  //  }

  /* -- This recursively creates the header dom element, works in conjunction with buildMenu -- */
  function buildPreview(json) {
    var wrapperUl = document.createElement('ul');
    for (var i = 0; i < json.length; i++) {

      if (json[i].children.length) {
        var listItem = buildLi(json[i], true);
        listItem.appendChild(buildPreview(json[i].children));
      } else {
        var listItem = buildLi(json[i]);
      }
      wrapperUl.appendChild(listItem);
    }
    return wrapperUl;
  }

  /* -- Builds individual li elements -- */
  function buildLi(item, par) {
    var newLi = document.createElement('li');
    var liAnchor = document.createElement('a');
    if (par) {
      newLi.className = 'parent';
    }
    liAnchor.href = '#';
    liAnchor.target = '_top';
    liAnchor.textContent = item.title;
    newLi.appendChild(liAnchor);
    return newLi;
  }

  /* -- Uncouth? Maybe figure out how to add this at the end of everything else on the Drupal end -- */
  // These two functions check to make sure all dependencies are loaded before executing the init file.
  var checkReady = setInterval(function () {
    //    console.log('hit');
    try {
      if (window.ASUHeaderMakerJSON) {
        clearMe();
        main();
        //        console.log('targets are: .asu-header-builder  .asu-header-render');
      }
    } catch (e) {}
  }, 300);
  // Cleans up the CheckReady Interval
  var clearMe = function () {
    clearInterval(checkReady);
  }

  var mobileCSS = '#asu_footer a{font-size:16px}#asu_mobile_menu{clear:both;width:100%}#asu_mobile_menu.asutoggle_off{display:none}#asu_mobile_menu.asutoggle_on,#asu_nav_menu{display:block}#asu_nav_wrapper{float:none;margin:0;max-width:100%}#asu_nav_menu{float:none;text-align:left;padding:0}#asu_hdr{z-index:100}#asu_hdr .f-search:before{content:"\f002"}#asu_hdr .f-user:before{content:"\f007"}#asu_hdr .f-times:before{content:"\f00d";padding:0 2px 0 3px}#asu_hdr .f-share-square-o:before{content:"\f045"}#asu_hdr .f-share-square-o{background:#fff!important;border-left:none!important}#asu_hdr .clicked,#main-search input{background-color:#E7E7E7}#asu_hdr .f-navicon:before{content:"\f0c9"}#asu_hdr .f-sort-down:before{content:"\f0dd"}#asu_hdr .f-sort-up:before{content:"\f0de"}#asu_mobile_button,#search_new{color:#999;cursor:pointer;float:right;font-size:22px;padding:18px 5px;width:35px;text-align:center}#asu_mobile_button:hover,#search_new:hover{color:#000}#search_new{display:inline!important;float:right;margin:0;padding:21px 5px;font-size:16px;text-align:center}#asu_mobile_button a{display:block;padding:0;margin:0;width:0;height:0;overflow:hidden;letter-spacing:-20px;text-indent:-9999px;text-decoration:none;border-bottom:none}#main-search input{position:relative;z-index:500;width:100%;border:none;color:#505558;font-size:16px;padding:10px 12px;outline:0;-webkit-appearance:none;border-radius:0}#asu_universal_nav,.navmenu{display:none!important}#asu_universal_nav_new{font-size:15px}#asu_hdr #asu_mobile_button,#asu_hdr .icn,#asu_hdr .icn2,#asu_universal_nav_new,.main-search{display:inherit!important}#asu_universal_nav_new ul{list-style-type:none;margin:0;padding:0;width:100%}#asu_universal_nav_new ul li{-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;width:100%}#asu_universal_nav_new .site_title{background-color:#505558!important}#asu_universal_nav_new .site_title>span{display:block;padding:12px 15px;color:#fff}#asu_universal_nav_new ul li a{padding:12px 12px 12px 15px;width:100%;display:inline-block}#asu_universal_nav_new .tlb a{color:#505558}#asu_universal_nav_new .clb .text a{color:#d23153}#asu_universal_nav_new ul ul{position:relative!important;padding:0;box-shadow:none;font-size:.9em}#asu_universal_nav_new .clb:last-child .cb:last-child,#asu_universal_nav_new .tlb:last-child{border-bottom:none!important}#asu_universal_nav_new .text{display:inline;overflow:hidden;white-space:nowrap}#asu_universal_nav_new .icn,#asu_universal_nav_new .icn2{float:right;width:35px;height:15px;background:#F4F4F4;border-left:solid 1px #DDD;text-align:center;font-size:14px;color:#B2B2B2;padding:10px;position:absolute;top:0;right:0}#asu_universal_nav_new .icn2:hover,#asu_universal_nav_new .icn:hover{color:#555}#asu_universal_nav_new .f-sort-down,#asu_universal_nav_new .f-sort-up{font-size:20px}#asu_universal_nav_new .f-sort-up{padding-top:13px;height:13px}#asu_universal_nav_new .f-sort-down{padding:3px 10px 18px}#asu_universal_nav_new .tlb{color:#77797B;background:#fff;border-bottom:solid 1px #ddd;font-weight:600;position:relative}#asu_universal_nav_new .clb{color:#a42b4d;background:#F4F4F4}#asu_universal_nav_new .cb,#asu_universal_nav_new .ccb{border-bottom:solid 1px #ddd;font-weight:100;background:#F4F4F4;position:relative}#asu_universal_nav_new .ccb{padding-left:15px}.closed{overflow:hidden;max-height:0;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;-moz-transition-duration:.3s;-webkit-transition-duration:.3s;-o-transition-duration:.3s;transition-duration:.3s;-moz-transition-timing-function:cubic-bezier(0,1,.5,1);-webkit-transition-timing-function:cubic-bezier(0,1,.5,1);-o-transition-timing-function:cubic-bezier(0,1,.5,1);transition-timing-function:cubic-bezier(0,1,.5,1)}.opened{-moz-transition-duration:.3s;-webkit-transition-duration:.3s;-o-transition-duration:.3s;transition-duration:.3s;-moz-transition-timing-function:ease-in;-webkit-transition-timing-function:ease-in;-o-transition-timing-function:ease-in;transition-timing-function:ease-in;max-height:1000px;overflow:hidden;display:inherit!important}#asu_login_module,#asu_search_module,.asu_search_button{display:none!important}';
  var headerHTML = '<div id="main-search" class="main-search closed"></div><div id="asu_hdr" class="asu_hdr_white"> <div id="asu_mobile_hdr"> <div id="asu_logo"> <a href="//www.asu.edu/" target="_top" title="Arizona State University"> <img alt="Arizona State University" title="Arizona State University" src="data:image/png;base64,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"></a> </div><img alt="Arizona State University" title="Arizona State University" id="asu_print_logo" src="data:image/png;base64,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" > <div class="asuhide f-navicon" id="asu_mobile_button" onclick="javascript:ASUHeader.toggleASU();"> <a href="javascript:ASUHeader.toggleASU();">Menu</a> </div><div class="f-search" id="search_new"></div></div><div class="closed" id="asu_mobile_menu"> <div id="asu_nav_wrapper"> <h2 class="hidden"> Sign In / Sign Out </h2> <ul id="asu_login_module"> <li class="end" id="asu_hdr_ssi"> <a href="#">Sign In</a> </li></ul> <div id="asu_nav_menu"> <h2 class="hidden"> Menu </h2> <div id="asu_universal_nav"></div></div></div><div id="asu_search"> <h2 class="hidden"> Search </h2> <div id="asu_search_module"></div></div></div></div><div style="clear:both;"></div>'
})();