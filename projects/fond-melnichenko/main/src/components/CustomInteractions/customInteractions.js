gsap.registerPlugin(Draggable);

function interaction1() {
  const dragItem = document.getElementById('gear-drag');
  const int1 = document.getElementById('interaction-1');
  const dropSpot = document.getElementById('drop-spot');
  const gearsClockwise = document.querySelectorAll('.clockwise');
  const gearsCounterclockwise = document.querySelectorAll('.counterclockwise');
  const overlapThreshold = '80%';
  let snap = false;

  let tween1 = gsap.to(gearsClockwise, {
    paused: true,
    rotation: 360,
    repeat: -1,
    duration: 2,
  });

  let tween2 = gsap.to(gearsCounterclockwise, {
    paused: true,
    rotation: -360,
    repeat: -1,
    duration: 2,
  });

//   ['mousemove', 'touchmove'].forEach(function (e) {
//     window.addEventListener(e, mouseMoveHandler);
//   });
//   EDIT

// ES6 helper function:

//     function addMultipleEventListener(element, events, handler) {
//     events.forEach(e => element.addEventListener(e, handler))
//   }

  int1.addEventListener('mouseover', function () {
    if (snap === true) {
      tween1.play();
      tween2.play();
    }
  });

  int1.addEventListener('mouseout', function () {
    if (snap === true) {
      tween1.pause();
      tween2.pause();
    }
  });

  Draggable.create(dragItem, {
    bounds: '#interaction-1',
    onDrag: function () {
      if (this.hitTest(dropSpot, overlapThreshold)) {
        dragItem.style.filter = 'grayscale(0%)';
        snap = true;
      } else {
        dragItem.style.filter = 'grayscale(50%)';
        snap = false;
      }
    },
    onDragEnd: function () {
      if (snap === true) {
        if (window.screen.width >= 719) {
          gsap.to(this.target, {
            x: 446,
            y: -115,
            scale: 1.6,
            duration: 0.3,
          });

          dropSpot.style.opacity = 0;

          tween1.play();
          tween2.play();

        } else {
          gsap.to(this.target, {
            x: 110,
            y: -88,
            scale: 1.6,
            duration: 0.3,
          });

          dropSpot.style.opacity = 0;

          tween1.play();
          tween2.play();
        }
      } else {
        gsap.to(this.target, {
          x: 0,
          y: 0,
          scale: 1,
        });
        dropSpot.style.opacity = 1;
        tween1.pause();
        tween2.pause();
      }
    }
  });
}

function interaction2() {
  const dragItem = document.getElementById('pers-drag');
  const dropSpot = document.getElementById('drop-spot-2');
  const backgrActive = document.getElementById('int-backgr');
  const overlapThreshold = '80%';
  let snap = false;
  
  console.log('works');

  Draggable.create(dragItem, {
    bounds: '#interaction-2',
    onDrag: function () {
      if (this.hitTest(dropSpot, overlapThreshold)) {
        console.log(overlapThreshold);
        dragItem.style.filter = 'grayscale(0%)';
        snap = true;
      } else {
        dragItem.style.filter = 'grayscale(56%)';
        snap = false;
        gsap.to(backgrActive, {
          opacity: 0,
          ease: "power1.out",
          duration: 0.3,
        });
      }
    },
    onDragEnd: function () {
      if (snap === true) {
        if (window.screen.width >= 719) {
          gsap.to(this.target, {
            x: -376, //153
            y: 10, //-15
            duration: 0.3,
          });
        } else {
          gsap.to(this.target, {
            x: -15,
            y: 153,
            duration: 0.3,
          });
        }
        gsap.to(backgrActive, {
          opacity: 1,
          ease: "power1.out",
          duration: 0.3,
        });
      } else {
        gsap.to(this.target, {
          x: 0,
          y: 0,
        })
      }
    }
  });
}