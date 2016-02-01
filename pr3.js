/*
 * There are more options for how we can deal with working with
 * equations. Equation1 is explicitly written, then evaluated by Math.js,
 * function from equation is parsed to var "f1" (parser then clears itself) and
 * then you can work with equation f1 as a function in your code.
 *
 * Second equation is loaded from HTML DOM element with jQuery, then evaluated, 
 * parsed and rerendered back to corresponding DOM element in form of TeX equation
 * (with help of KaTeX library by Khan Academy).
 *
 */
var parser = math.parser();

var equation = 'f(x, y) = x^3 + 3x*y^2 - 51x - 24y';
parser.eval(equation);
var f1 = parser.get('f');
parser.clear();


// Define global DOM handler to format 'latex' into an HTML span
MathBox.DOM.Types.latex = MathBox.DOM.createClass({
  render: function (el) {
    this.props.innerHTML = katex.renderToString(this.children);
    return el('span', this.props);
  }
});
// Set smaller height if device width is smaller than 960px
function mathboxHeight() {
  var height = 600;
  var width = window.innerWidth;
  if (width <= 960) height = 500;
  return height;
}

// MathBox settings 
// (visualization is injected into DOM element, we don't use context API here.)
var mathbox = mathBox({
  element: document.getElementById('visualization'),
  plugins: ['core', 'controls', 'cursor'],
  controls: {
    klass: THREE.OrbitControls, // NOTE: using keyboard arrows for slides moves camera too
    //klass: THREE.TrackballControls, // keyboard arrows doesn't move camera, but harder to navigate
  },
  size: {
    height: mathboxHeight()
  },
  camera: {
    fov: 60, // Field-of-view (degrees)
  }
});

var three = mathbox.three;
three.camera.position.set(2, 1.7, 2.7);
three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);

// Axis colors
colors = {
  x: new THREE.Color(0xFF4136),
  y: new THREE.Color(0x2ECC40),
  z: new THREE.Color(0x0074D9)
};

// Initial time
time = 0

var view = mathbox.cartesian({
  range: [[-1, 1], [-1.5, 1.5], [-1, 1]],
  scale: [1.8, 1.8, 1.8],
  position: [0, 0, 0]
})

view.axis({
  axis: 1,
  color: colors.x,
});
view.axis({
  axis: 2, // "y" also works
  color: colors.y,
});
view.axis({
  axis: 3,
  color: colors.z,
});

mathbox.select('axis')
  .set('end', true)
  .set('width', 5)

view.array({
  id: "colors",
  live: false,
  data: [colors.x, colors.y, colors.z].map(function (color){
    return [color.r, color.g, color.b, 1];
  }),
});

view.grid({
  axes: [1, 3],
  width: 1,
  color: 0xb0b0b0,
  depth: .5,
})

view.array({
  data: [[1.2,0,0], [0,1.9,0], [0,0,1.2]],
  channels: 3, // necessary
  live: false,
}).text({
  data: ["x", "z", "y"],
}).label({
  color: 0xFFFFFF,
  colors: "#colors",
});
      
surface = mathbox.select('surface')
vector = mathbox.select('vector')

// Set first presentation slide to 1
var present = view.present({ index: 1 });

// Nest the whole presentation in a slide
// This means any .step() directly inside will follow present.index directly
var scene = present.slide();

// Slide counter element
var slideNumber = document.getElementById('slide-number');
// Inject initial value into slide counter element
slideNumber.innerHTML = present.get('index') + '/3';

// Navigate through slides with left and right arrow on keyboard
if (window == top) {
  window.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
      case 38:
        present.set('index', present.get('index') - 1);
        slideNumber.innerHTML = present.get('index') + '/3';
        break;
      case 39:
      case 40:
        present.set('index', present.get('index') + 1);
        slideNumber.innerHTML = present.get('index') + '/3';
        break;
    }
  }
}

// Also navigate through slides with blue arrows in our webpage
$('#next').on('click', function() {
  var slide = present.get('index');
  $('.step-'+slide).removeClass('active');
  $('.step-'+slide).children('.extra').removeClass('active');
  $('#disqus_thread').removeClass('active');
  if (slide < 3) {
    slide += 1;
    $('.step-'+slide).addClass('active');
    $('.step-'+slide).children('.extra').addClass('active');
    present.set('index', slide);
    slideNumber.innerHTML = slide + '/3';
  }
});
$('#previous').on('click', function() {
  var slide = present.get('index');
  $('.step-'+slide).removeClass('active');
  $('.step-'+slide).children('.extra').removeClass('active');
  $('#disqus_thread').removeClass('active');
  if (slide > 0) {
    slide -= 1;
    $('.step-'+slide).addClass('active');
    $('.step-'+slide).children('.extra').addClass('active');
    present.set('index', slide);
    slideNumber.innerHTML = slide + '/3';
  }
});

// Presentation slides begins here
// Camera has a global script of steps
scene
  .camera({
    lookAt: [0, 0, 0],
    proxy: true,
  })
  .step({
    pace: 1,
    script: {
      0: {position: [2, 1.7, 3.2]}, // kamera pre krok 0 (základný)
      1: {position: [2, 1.7, 2.6]}, // kamera pre krok 1
      //3: {position: [2, 1.7, 2.1]}, // kamera pre krok 2
      // ...         // kamera pre krok n
    }
  })
// ---------------------
scene // Zaciatok prvej sceny
  .slide({ // pocet krokov, ktore scena obsahuje (potom zmizne)
    steps: 2
  })
  .reveal({
    duration: 1
  })
  // Hlavna funkcia
  .area({
    id: 'hlavna-funkcia',
    width: 50,
    height: 50,
    axes: [1, 3],
    live: false,
    rangeX: [-1, 1],
    rangeY: [-1, 1],
    expr: function (emit, x, y, i, j) {
      var func = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      emit(x, func, y);
    },
    channels: 3,
  })
  .surface({
    lineX: true,
    lineY: true,
    shaded: true,
    color: 0x5090FF,
    width: 2,
    shaded: true,
  })
    .step({
      pace: 1,
      script: [
        {props: {opacity: 1}},
        {props: {opacity: 1}},
        {props: {opacity: 0}},
      ]
    })
  // Set axis x, y, z input numbers
  .array({
    data: [[1,0,0], [0,1.5,0], [0,0,1], [-1,0,0], [0,0,-1]],
    channels: 3, // necessary
    live: false,
  }).text({
    data: ["1", "1.5", "1", "-1", "-1"],
  })
  .label({
    color: 0xFFFFFF,
    colors: "#colors",
  })
    .step({
      pace: 1,
      script: [
        {props: {opacity: 0}},
        {props: {opacity: 1}},
      ]
    })
  .point({
    size: 10,
    color: 0xFF0000,
    opacity: 0
  })
    .step({
      pace: 1,
      script: [
        {props: {opacity: 0}}, // 0-ty krok!
        {props: {opacity: 1}},
      ]
    })
