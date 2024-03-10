    
    
    
    
App.one = function(id, event, call) {
        
    var handler = function(evt) {
        console.log("ONE "+id+" "+event);   
        call(evt); 
        htmx.off(id, event, handler);
    }

    htmx.on(id, event, handler);
    console.log("ATTACH "+id+" "+event);    
    
}



App.handle1 = function(id, event, call) {
    /*
    console.log("HANDLE "+id+" "+event);
    console.log(call);
    var handler = function(evt) {
        console.log("HANDLER "+id+" "+event);    
        call(evt);
    }
    var cleaner = function(evt) {
        console.log("CLEANER "+id+" "+event);
        htmx.off('htmx:beforeSwap', cleaner);
        htmx.off(id, event, handler);
    
    }
    */
    htmx.on(id, event, call);
    //htmx.on('htmx:beforeOnLoad',cleaner);
    console.log("ATTACH "+id+" "+event);    
}
    

App.on = function(id, event, call) {
    /*
    console.log("HANDLE "+id+" "+event);
    console.log(call);
    var handler = function(evt) {
        console.log("HANDLER "+id+" "+event);    
        call(evt);
    }
    var cleaner = function(evt) {
        console.log("CLEANER "+id+" "+event);
        htmx.off('htmx:beforeSwap', cleaner);
        htmx.off(id, event, handler);
    
    }
    */
    htmx.on(id, event, call);
    //htmx.on('htmx:beforeOnLoad',cleaner);
    console.log("ON "+id+" "+event);    
}
    

App.one = function(id, event, call) {
        
    var handler = function(evt) {
        console.log("ONE "+id+" "+event);   
        call(evt); 
        htmx.off(id, event, handler);
    }

    htmx.on(id, event, handler);
    console.log("ATTACH "+id+" "+event);    
    
}

App.handle= function(id, event, call) {
    console.log("HANDLE "+id+" "+event);
    console.log(call);
    var handler = function(evt) {
        console.log("HANDLER "+id+" "+event);    
        call(evt);
    }
    var cleaner = function(evt) {
        console.log("CLEANER "+id+" "+event);
        htmx.off('htmx:beforeSwap', cleaner);
        htmx.off(id, event, handler);
    
    }
    htmx.on(id, event, handler);
    htmx.on('htmx:beforeSwap',cleaner)
    console.log("ATTACH "+id+" "+event);    
    
},
/**
 * Updates the innerHTML of HTML elements based on the provided dictionary.
 * @param {Object} dict - An object where each key is an element ID and each value is the new innerHTML for the corresponding element.
 */




    


document.addEventListener('keydown', function (event) {
    if (event.shiftKey && event.key === 'F12') {
        App.console();
    }
});


App.emit = function (element, name, detail) {
    element.dispatchEvent(new CustomEvent(name, {
        detail: detail,
        bubbles: true,
        composed: true
    }));
};