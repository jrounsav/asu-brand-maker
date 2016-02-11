/*
  ToDo  
      
      - Add the drag/drop functionality that comes stock with html5
      
*/
(function () {
  /* -- The Object from which all others are created -- */
  var MenuItem = {
    id: 0,
    count: 0,
    title: '',
    url: '',
    parent: null,
    children: [],
    index: null,
    domElement: null,
    addItem: function () {
      ++window.ASUHeaderMakerJSON.count;

      //adds a child item
      var newItem = Object.create(MenuItem);
      newItem.id = 'asu-header-item-' + window.ASUHeaderMakerJSON.count;
      newItem.children = [];
      newItem.parent = this;
      newItem.index = this.children.push(newItem) - 1;
      newItem.buildDomItem();
      newItem.paintItem();

      sizeUI(this);
      return newItem;

    },
    buildDomItem: function () {
      /* -- Outer Most Div -- */
      var wrapperDiv = document.createElement('div');
      wrapperDiv.id = this.id;
      wrapperDiv.className = "asu-header-builder-menu-item";

      /* -- Div with Action Buttons -- */
      var actionDiv = document.createElement('div');
      actionDiv.className = "asu-header-builder-actions";
      /* -- Add Button -- */
      var addBtn = document.createElement('div');
      addBtn.className = "asu-header-builder-add";
      var addIcn = document.createElement('i');
      addIcn.className = "fa fa-plus-circle";
      addBtn.appendChild(addIcn);
      /* -- Minus Button -- */
      var minusBtn = document.createElement('div');
      minusBtn.className = "asu-header-builder-minus";
      var minusIcn = document.createElement('i');
      minusIcn.className = "fa fa-minus-circle";
      minusBtn.appendChild(minusIcn);
      /* -- Append Buttons -- */ // Add Event Listeners to addBtn and minusBtn
      actionDiv.appendChild(addBtn);
      actionDiv.appendChild(minusBtn);

      /* -- Divs for Input Fields -- */ // Add Event Listeners to these too please
      var inputDiv = document.createElement('div');
      inputDiv.className = "asu-header-maker-input-wrapper";
      /* -- Name In -- */
      var nameInput = document.createElement('input');
      nameInput.className = "asu-header-maker-name-input";
      nameInput.type = "text";
      nameInput.size = "30";
      nameInput.placeholder = "Enter a link Name";
      nameInput.value = this.title;
      /* -- URL In -- */
      var urlInput = document.createElement('input');
      urlInput.className = "asu-header-maker-url-input";
      urlInput.type = "text";
      urlInput.size = "30";
      urlInput.placeholder = "Enter a link URL";
      urlInput.value = this.url;
      /* -- Appending Inputs to Wrapper -- */
      inputDiv.appendChild(nameInput);
      inputDiv.appendChild(urlInput);

      /* -- Div For all of the Object's Children -- */
      var childrenDiv = document.createElement("div");
      childrenDiv.className = "asu-header-builder-children";
      /* -- Append all child elements to the child div -- */
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i] && this.children[i].domElement) {
          childrenDiv.appendChild(this.children[i].domElement);
        }
      }
      /* -- Append all items to master wrapper -- */
      wrapperDiv.appendChild(actionDiv);
      wrapperDiv.appendChild(inputDiv);
      wrapperDiv.appendChild(childrenDiv);

      /* -- Add new DOM element to Object -- */
      this.domElement = wrapperDiv;

      var me = this;

      /* -- Adding Event Listeners to buttons and inputs -- */
      addBtn.addEventListener('click', function clickAddBtn() {
        var newItem = me.addItem();
        newItem.buildDomItem();
        sizeUI(newItem);
        me.updateDomChildren();
        updateJSON();
        window.ASUHeaderRender.update();
      }, false);

      minusBtn.addEventListener('click', function clickMinusBtn() {
        me.removeItem();
        sizeUI();
        updateJSON();
        window.ASUHeaderRender.update();
      }, false);

      nameInput.addEventListener('keyup', function () {
        me.title = nameInput.value;
        me.updateDomFields();
        updateJSON();
        window.ASUHeaderRender.update();
      }, false);

      urlInput.addEventListener('keyup', function () {
        me.url = urlInput.value;
        me.updateDomFields();
        updateJSON();
        window.ASUHeaderRender.update();
      }, false);
    },
    updateDomFields: function () {
      /* -- Ensures that repainted elements have the correct form values -- */
      /* -- Update Name -- */
      this.domElement.getElementsByClassName('asu-header-maker-name-input')[0].value = this.title;
      /* -- Update URL -- */
      this.domElement.getElementsByClassName('asu-header-maker-url-input')[0].value = this.url;
    },
    updateDomChildren: function () {
      /* -- Update Children -- */
      var childDiv = this.domElement.getElementsByClassName('asu-header-builder-children')[0];
      while (childDiv.firstChild) {
        childDiv.removeChild(childDiv.firstChild);
      }
      for (var i = 0; i < this.children.length; i++) {
        childDiv.appendChild(this.children[i].domElement);
      }
    },
    paintItem: function () {
      /* -- Paints the relevant UI item in the correct spot -- */
      if (!this.parent || !this.parent.id) {
        var topLevel = document.getElementsByClassName('asu-header-builder-ui')[0];
        topLevel.appendChild(this.domElement);
      } else {
        var parentIdTarget = document.getElementById(this.parent.id);
        parentIdTarget.getElementsByClassName('asu-header-builder-children')[0].appendChild(this.domElement);
      }
    },
    removeItem: function () {
      //Removes this item. sending children to parent if it exists
      var moveTo;
      var removeDomTarget = document.getElementById(this.id);
      removeDomTarget.remove();

      if ((!this.parent || !this.parent.id) && this.children.length) {
        moveTo = window.ASUHeaderMakerJSON;
      } else {
        moveTo = this.parent;
      }

      for (var i = 0; i < this.children.length; i++) {
        this.children[i].moveItem(moveTo);
      }

      /* -- Store Parent location for null removal -- */
      var holdit = this;
      
      this.parent.children[this.index] = null;

      /* -- null removal -- */
      this.parent.children = clearEmpty(holdit.parent.children);

      /* -- index fix -- */
      for (var i = 0; i < holdit.parent.children.length; ++i) {
        holdit.parent.children[i].index = i;
      }
    },
    moveItem: function (target) {
      /* -- Moves this item to another item's child array, and repaints -- */
      this.parent = target;
      target.children.push(this);
      this.updateDomChildren();
      this.paintItem();
    },
    restore: function () {

    },
    init: function () {
      /* -- Initializes the "Widget" -- */
      window.ASUHeaderMakerJSON = this;
      var builderUI = document.getElementsByClassName('asu-header-builder')[0];

      /* -- Building the Header div -- */
      var builderHeader = document.createElement('div');
      builderHeader.className = 'asu-header-builder-head';
      var builderText = document.createElement('h3');
      builderText.textContent = 'Header Builder';
      var primeAdd = document.createElement('i');
      primeAdd.className = "fa fa-plus-circle";
      primeAdd.id = 'asu-header-builder-primary-add';

      /* -- Add Event Listener to top "add" button -- */
      primeAdd.addEventListener('click', function () {
        window.ASUHeaderMakerJSON.addItem();
      }, false);

      /* -- Putting it all together -- */
      builderHeader.appendChild(builderText);
      builderText.appendChild(primeAdd);

      var builderAdd = document.createElement("div");
      builderAdd.className = 'asu-header-builder-ui';

      builderUI.appendChild(builderHeader);
      builderUI.appendChild(builderAdd);

      var doppleInput = document.createElement('textarea');
      doppleInput.className = "form-textarea";
      doppleInput.id = "asu-brand-header-json-out";
      doppleInput.cols = 60;
      doppleInput.rows = 5;
//      doppleInput.disabled = true;

      document.getElementsByClassName('form-item-brand-header-config-und-0-value')[0].appendChild(doppleInput);
      
      if (!document.getElementById('edit-brand-header-config-und-0-value').value) {
        /* -- Creates first item -- */
        console.log('no header json');
        window.ASUHeaderMakerJSON.addItem();
      } else {
        var json = JSON.parse(document.getElementById('edit-brand-header-config-und-0-value').value);
        console.log('header json exists');
        var realChildren = restoreObj(json,null);
        window.ASUHeaderMakerJSON.children = realChildren;
        restoreDom(window.ASUHeaderMakerJSON.children);
        updateJSON();
        sizeUI();
      }
    }
  };

  /* -- Main Running Function, Build "Restore" method -- */
  function main() {
    MenuItem.init();
    sizeUI();
  }

  /* -- Begin all Use Functions -- */
  /* -- Restores Obj form from string to consumable UI json -- */
  function restoreObj(json, par) {
    var childArr = [];
    if (json) {
      for (var i = 0; i < json.length; ++i) {
        window.ASUHeaderMakerJSON.count++;
        var newObj = Object.create(MenuItem);
        newObj.id = 'asu-header-item-' + window.ASUHeaderMakerJSON.count;;
//        newObj.id = json[i].id;
        newObj.title = json[i].title;
        newObj.url = json[i].url;
        newObj.buildDomItem();
        newObj.parent = par || window.ASUHeaderMakerJSON;
        newObj.children = restoreObj(json[i].children, newObj);
        newObj.updateDomChildren();
        newObj.index = childArr.push(newObj) - 1;
      }
    }
    return childArr;
  }
  /* -- Repaints the UI when there is valid json -- */
  function restoreDom(all) {
    for (var i = 0; i < all.length; i++) {
      all[i].paintItem();
      if (all[i].children.length) {
        restoreDom(all[i].children);
      }
    }
  }
  /* -- Creates the proper JSON and outputs it to the input box -- */
  function updateJSON() {
    var windowjson = window.ASUHeaderMakerJSON.children;
    var stringified = JSON.stringify(windowjson, ['id', 'count', 'title', 'url', 'children', 'index']);
    console.log(windowjson);
    document.getElementById('edit-brand-header-config-und-0-value').value = stringified;
    document.getElementById('asu-brand-header-json-out').value = stringified;
  }

  /* -- Removes empty items from array -- */
  function clearEmpty(objArr) {
    var nonull = [];
    for (var i = 0; i < objArr.length; ++i) {
      if (objArr[i]) {
        nonull.push(objArr[i]);
      }
    }
    return nonull;
  }

  /* -- Resizes the UI so that there is never any wrapping -- */
  function sizeUI(obj) {
    var uiZone = document.getElementsByClassName('asu-header-builder-ui')[0];
    var jsonArrLength = ASUHeaderMakerJSON.children.length;
    var addAmount = 0;
    if (!uiZone.style.width) {
      var width = 0;
    } else {
      var width = uiZone.style.width.replace('px', '');
    }
    if (!obj) {
      width = 0;
      for (var i = 0; i < jsonArrLength; i++) {
        addAmount += 280;
      }
      addAmount += (30*(ASUHeaderMakerJSON.count-i));
    } else if (obj && obj.parent) {
      addAmount = 30;
    } else if (obj) {
      addAmount = 280;
    }
    uiZone.style.width = (parseInt(width) + parseInt(addAmount)) + 'px';
  }

  /* -- Uncouth? Maybe figure out how to add this at the end of everything else on the Drupal end -- */
  // These two functions check to make sure all dependencies are loaded before executing the init file.
  var checkReady = setInterval(function () {
    //    console.log('hit');
    try {
      var ch = document.getElementById('edit-brand-header-config-und-0-value');
      if (ch) {
        clearMe();
        main();
        //target the following two classes to create the UI and the rendered menu
        //        console.log('targets are: .asu-header-builder  .asu-header-render');
        // This field will only be editable by the UI created above
        document.getElementById('edit-brand-header-config-und-0-value').style.display = 'none'; // Not robust. Modify to grab all inputs in namespace
      }
    } catch (e) {}
  }, 300);
  // Cleans up the CheckReady Interval
  var clearMe = function () {
    clearInterval(checkReady);
  }
})();