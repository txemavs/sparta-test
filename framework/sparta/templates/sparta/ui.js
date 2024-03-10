

App.django_error = function (response) {

  let doc = new DOMParser().parseFromString(response, 'text/html');
  let body = doc.querySelector('body');
  let script = doc.querySelector('head script');
  let div = document.createElement('div')
  let summary = body.querySelector('#summary');
  let value = summary.querySelector("pre").textContent;
  let table = summary.querySelector("table");

  let rows = table.querySelectorAll("tr");

  // Remove the first and second rows
  rows[9].remove();
  rows[8].remove();
  rows[7].remove();
  rows[6].remove();
  rows[4].remove();
  div.innerHTML = `
    <ion-accordion-group value="summary">
        <ion-accordion value="summary" toggle-icon="caret-down-circle" toggle-icon-slot="start">
            <ion-item slot="header" color="light">
                <ion-label>${value}</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">
            ${table.outerHTML}
            </div>
        </ion-accordion>
            
        <ion-accordion value="traceback" toggle-icon="caret-down-circle" toggle-icon-slot="start">
            <ion-item slot="header" color="light">
                <ion-label>Traceback</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">${body.querySelector('#browserTraceback').outerHTML}</div>
        </ion-accordion>
    </ion-accordion-group>`;
  div.appendChild(script);
  console.log(body.innerHTML); // This will log the contents of the #summary div
  App.modal(summary.querySelector("h1").textContent, div.innerHTML)
  return;

}



App.progress = {
  indeterminate: () => {
    progressBar = App.$('ion-progress-bar');
    if (progressBar) {
      progressBar.value = 0;
      progressBar.type = 'indeterminate';
      progressBar.style.setProperty('--background', 'rgba(228,4,141,1)');
    };
  },
  end: () => {
    progressBar = App.$('ion-progress-bar');
    if (progressBar) {
      progressBar.value = 1;
      progressBar.type = 'determinate';
    }
  },
}

App.menu_open = function () {
  App.id('start-menu').open();
}

App.html = function (dict) {
  for (var key in dict) {
    App.id(key).innerHTML = dict[key];
  }
}



App.details = []; //cache for details

App.detail = function (i) {
  return function () {
    App.modal_json(App.details[i], 'Detail');
  }
}


App.log = function (message, color = 'white', callback) {
  let stdout = App.id('stdout');
  if (!stdout) { console.log(message); return; }

  let span = document.createElement('span');
  span.style.color = color;

  if (typeof message === 'object' && 'message' in message) {

    if ('message' in message) {
      span.textContent = message.message;
    }

    if ('detail' in message) {
      let i = App.details.push(message.detail) - 1;
      span.dataset.detail = i;
    }

    if ('callback' in message && typeof callback === 'function') {
      span.addEventListener('click', callback);
    }
  } else {
    span.textContent = message;
  }

  stdout.appendChild(span);
  stdout.appendChild(document.createTextNode('\n'));
}

App.console = function () {
  App.id('console').open();
}


App.func = {
  dismiss: function (id) {
    return function () {
      document.querySelector(id).dismiss(null, 'cancel');
    }
  },
}


App.actions = function (menu, handlers) {
  let actions = App.$('ion-action-sheet');
  actions.buttons = menu;
  actions.addEventListener('ionActionSheetDidDismiss', (e) => {
    if (handlers && e.detail && e.detail.data && handlers.hasOwnProperty(e.detail.data.action)) {
      handlers[e.detail.data.action](e.detail);
    }
  });
  return actions;
}



App.toast = function (message, duration = 2000) {
  let toast = App.$('ion-toast');
  if (!toast) {
    toast = document.createElement('ion-toast');
    document.body.appendChild(toast);
  }
  toast.message = message;
  toast.duration = duration;
  toast.present();
}


App.alert = function (message) {
  document.addEventListener('DOMContentLoaded', function () {
    let alert = App.$('ion-alert');
    if (!alert) {
      alert = document.createElement('ion-alert');
      document.body.appendChild(alert);
    }
    alert.message = message;
    alert.present();
  })
}


App.modal = function (title, html, present = true) {
  let modal = document.createElement('ion-modal');
  modal.id = App.get_id();
  modal.innerHTML = `
    <ion-header>
        <ion-toolbar color="dark">
            <ion-title>${title}</ion-title>
            <ion-buttons slot="end">
                <ion-button onclick="App.id('${modal.id}').dismiss()" strong>
                    <ion-icon name="close-outline"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content style='font-size: 0.8em;'>
        ${html}
    </ion-content>
    `;
  document.body.appendChild(modal);
  if (present) { modal.present(); }
  return modal;
}


App._id = 0;
App.get_id = function () {
  return 'app_' + (App._id++);
}


App.modal_json = function (json, title = "Data") {
  let viewer = App.get_id();
  App.modal(title, `
        <div style="overflow:auto; height:100%; width:100%;padding:0 10px;">
            <json-viewer style="min-height:100%;display:flex;font-size: 10.5px;" id="${viewer}"></json-viewer>
        </div>
    `);
  if (json.description && typeof json.description === 'string' && json.description.startsWith("</")) { json.description = "<HTML>" }
  App.id('' + viewer).data = json;
  App.id('' + viewer).expand('*.*');
}



App.modal_list = function (title = "Data") {
  let viewer = App.get_id();
  let h = '';
  h += '<ion-item><ion-label>id</ion-label><ion-note slot="end">❌</ion-note></ion-item>';
  let modal = App.modal(title, '<ion-list inset="true">' + h + '</ion-list>', false);
  return modal;
}


App.modal_path = function (path) {
  let x = App.get_id();
  let modal = App.modal(path, `<div id='${x}' hx-get="${path}" hx-trigger="revealed" ></div>`, true)
  modal.addEventListener('ionModalDidPresent', () => {
    htmx.process(App.id(x))
  });
  //htmx.trigger(App.id(x), 'htmx:trigger');
  return modal;
}




App.modal_create = function (serializer) {//KEVIN
  console.log(serializer.name)
  let x = App.get_id();

  let modal = App.modal(serializer.name, `<div id='${x}' hx-get="/app/form/Device" hx-trigger="revealed"></div>`, true);
  modal.addEventListener('ionModalDidPresent', () => {
    htmx.process(App.id(x))
  });
  return modal;
}



App.part = {
  Searchbar: class extends HTMLElement {
    connectedCallback() {
      const me = document.createElement('ion-searchbar');
      me.animated = true;
      me.showCancelButton = true;
      me.placeholder = "Search...";
      me.searchIcon = "search";
      me.innerHTML = this.innerHTML;
      me.setAttribute('role', 'search');
      this.replaceWith(me);
      return me;
    }
  }
}