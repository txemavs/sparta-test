
// app/js/boot.js

document.addEventListener('DOMContentLoaded', function () {
    
    App.sub('log', function (message) {
        //console.log(message);
        if (!message) return;
        let m = (typeof message === 'object' && 'message' in message) ? message.message : message;
        color='white';
        if (m.includes('ERROR')) color='red';
        if (m.includes('RDY')) color='orange';
        if (m.includes('GET')) color='cyan';
        if (m.includes('END')) color='gray';
        App.log(message, color);
    });

    App.log('Sparta monitor', 'green');

    App.sub('beforeRequest', function (e) {
        if (!e) return;
        App.log('\n🟠 HX-'+e.detail.requestConfig.verb.toUpperCase() + ' ' + e.detail.pathInfo.finalRequestPath);
    });

    App.sub('afterSwap', function (e) {
        if (!e) return;
        if (e.target.id === 'main') {
            App.log('⚫    '+e.detail.requestConfig.verb.toUpperCase() + ' ' + e.detail.pathInfo.finalRequestPath +'  ');
        }
        
    });

    // Add a click event listener to the document
    document.addEventListener('click', function(event) {
        // If the clicked element is a span with a data-index attribute
        if (event.target.tagName === 'SPAN' && event.target.hasAttribute('data-detail')) {
            // Get the index from the data-index attribute
            let i = event.target.getAttribute('data-detail');
            // Call App.detail(i)
            App.detail(i)();
        }
    });


    document.body.addEventListener('htmx:beforeRequest', function (event) {
        App.pub('beforeRequest', event);
    });

    document.body.addEventListener('htmx:afterSwap', function (event) {
        App.pub('afterSwap', event);
    });
    

    const allElements = document.getElementsByTagName('*');
    for(let element of allElements) {
        // Check if the element is a custom element that is not defined
        if(element.localName.startsWith('pa-') && !customElements.get(element.localName)) {
            //App.stdout('⛚ ?'+ element.localName);
            App.define(element.localName);
        }
    }
/*
    const observer = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
          //App.pub("log",'<- '+mutation.length+' added');
          //if(mutation.target.id) App.pub("log",'MU '+mutation);
          if (mutation.type === 'childList') {
            for(let node of mutation.addedNodes) {

              if(node.nodeType === Node.ELEMENT_NODE) {
                  
                  // Check if the custom element is defined
                  if(node.localName.startsWith('pa-') && !customElements.get(node.localName)) {
                      console.log('Auto import ', node.localName);
                      App.define(node.localName);
                  }
              }
          

              if(node.id) {
                App.pub("log",' + '+node.nodeName.toLowerCase()+' '+node.id+' added');
              }
            }
            for(let node of mutation.removedNodes) {
                if(node.id) {
                    App.pub("log",' - '+node.nodeName.toLowerCase()+' '+node.id+' removed');
                  }
            }
          }
        }
      });
  */  



      App.mutation.observer.observe(App.id('main'), { childList: true, subtree: true });
      App.log('🔵 Observer started');

      App.mutation.name.start();
    
});

//🔴 Error
//🟠 Request
//🟢 OK
//🟡 Defined
//🟣 Event
//🔵 Observer