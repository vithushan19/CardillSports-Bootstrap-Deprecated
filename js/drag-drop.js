var zoneToPlayerMap = {};
var playerToZoneMap = {};

$('#submit').on('click', function (e) {

      var result = {};
      var keys = [];
      var k,i, len;

      //TODO validate zoneToPlayerMap
      for (k in zoneToPlayerMap) {
        if (zoneToPlayerMap.hasOwnProperty(k)) {
          var rank = parseInt(k.substr(9));
          result[rank] = zoneToPlayerMap[k].id;
        }
      }

      console.log(JSON.stringify(result));

})

function print() {
  console.log('\n');
  for (var key in playerToZoneMap) {
    if (playerToZoneMap.hasOwnProperty(key)) {
      console.log("DRAGGABLE: " + key + " DROPZONE: " + playerToZoneMap[key].id);
    }
  }
  console.log('\n');
  for (var key in zoneToPlayerMap) {
    if (zoneToPlayerMap.hasOwnProperty(key)) {
      console.log("DROPZONE: " + key + " DRAGGABLE: " + zoneToPlayerMap[key].id);
    }
  }
  console.log('\n');
}

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    if (target.id in zoneToPlayerMap ) {
      zoneToPlayerMap[target.id].classList.add('drop-empty');  
    }
    
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

  // enable draggables to be dropped into this

interact('.drop-empty').dropzone({
  // only accept elements matching this CSS selector
  accept: '.draggable',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  // This event fires for each possible zone for the draggable elem
  ondropactivate: function (event) {
    // add active dropzone feedback
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;
    //console.log("ON DROP ACTIVATE: DRAGGABLE: " + draggableElement.id);
    //console.log("ON DROP ACTIVATE: DROPZONE: " + dropzoneElement.id);
    
    if (dropzoneElement.id in zoneToPlayerMap) {
      if (draggableElement == zoneToPlayerMap[dropzoneElement.id]) {
        //make the current zone droppable again
        zoneToPlayerMap[dropzoneElement.id].classList.add('drop-empty');  
      }
      
    }
    dropzoneElement.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;
    //console.log("ON DRAG ENTER: DRAGGABLE: " + draggableElement.id);
    //console.log("ON DRAG ENTER: DROPZONE: " + dropzoneElement.id);

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    //draggableElement.textContent = 'Dragged in';
  },
  ondragleave: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;
    //console.log("ON DRAG LEAVE: DRAGGABLE: " + draggableElement.id);
    //console.log("ON DRAG LEAVE: DROPZONE: " + dropzoneElement.id);

    // remove the drop feedback style
    dropzoneElement.classList.remove('drop-target');
    draggableElement.classList.remove('can-drop');
    //event.relatedTarget.textContent = 'Dragged out';
  },
  ondrop: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    var idToRemove = "0";
    if (draggableElement.id in playerToZoneMap) {
      console.log("idToRemove " + idToRemove);
      idToRemove = playerToZoneMap[draggableElement.id].id;
      delete zoneToPlayerMap[idToRemove];
      delete playerToZoneMap[draggableElement.id];
    }

    if (dropzoneElement.id in zoneToPlayerMap) {
        zoneToPlayerMap[dropzoneElement.id].classList.remove('can-drop');
        idToRemove = zoneToPlayerMap[dropzoneElement.id].id;
        delete zoneToPlayerMap[dropzoneElement.id];
        delete playerToZoneMap[idToRemove];
    }
    

    playerToZoneMap[draggableElement.id] = dropzoneElement;
    zoneToPlayerMap[dropzoneElement.id] = draggableElement;

    
    //console.log("ON DROP: DRAGGABLE: " + draggableElement.id);
    //console.log("ON DROP: DROPZONE: " + dropzoneElement.id);
    
    //event.relatedTarget.textContent = 'Dropped';
  },
  ondropdeactivate: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;
    //console.log("ON DROP DEACTIVATE: DRAGGABLE: " + draggableElement.id);
    //console.log("ON DROP DEACTIVATE: DROPZONE: " + dropzoneElement.id);

    if (dropzoneElement.id in zoneToPlayerMap) {
      if (draggableElement == zoneToPlayerMap[dropzoneElement.id]) {
        zoneToPlayerMap[dropzoneElement.id].classList.remove('drop-empty'); 
      }
    }
    // remove active dropzone feedback
    dropzoneElement.classList.remove('drop-active');
    dropzoneElement.classList.remove('drop-target');
  }
});
