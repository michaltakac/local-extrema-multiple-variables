	/*var power = 2;
	var f1 = 'f(x) = x^{'+power+'}+y^{'+power+'}';
	var f2;
	katex.render(f1, document.getElementById('step-1-eq-1'));

	for (var i = 2; i < 10; i++) {
		setTimeout(function() {
			f2 = 'f(x) = x^{'+i+'}+y^\\color{#f44}{'+i+'}';
			katex.render(f2, document.getElementById('step-1-eq-1'));
			i++;
		}, 1000);
	}*/

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

var equation1 = 'f(x, y) = x^2 + y^2';
var equation2 = $('#step-1-eq-2');

katex.render(equation1, document.getElementById('eq-1'));
parser.eval(equation1);
var f1 = parser.get('f');
parser.clear();

parser.eval(equation2.text());
var f2 = parser.get('f');
parser.clear();
katex.render(equation2.text(), document.getElementById('step-1-eq-2'));


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
  range: [[-2, 2], [-2, 2], [-2, 2]],
  scale: [1.8, 1.8, 1.8],
  position: [0, -.7, 0]
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

surface = mathbox.select('surface')
vector = mathbox.select('vector')

// Set first presentation slide to 1
var present = view.present({ index: 1 });

// Slide counter element
var slideNumber = document.getElementById('slide-number');
// Inject initial value into slide counter element
slideNumber.innerHTML = present.get('index') + '/9';

// Navigate through slides with left and right arrow on keyboard
if (window == top) {
  window.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
      case 38:
        present.set('index', present.get('index') - 1);
        slideNumber.innerHTML = present.get('index') + '/9';
        break;
      case 39:
      case 40:
        present.set('index', present.get('index') + 1);
        slideNumber.innerHTML = present.get('index') + '/9';
        break;
    }
  }
}

// Also navigate through slides with blue arrows in our webpage
$('#next').on('click', function() {
  var slide = present.get('index');
  $('.step-'+slide).removeClass('active');
  $('.step-'+slide).children('.extra').removeClass('active');
  if (slide < 10) {
    slide += 1;
    $('.step-'+slide).addClass('active');
    $('.step-'+slide).children('.extra').addClass('active');
    present.set('index', slide);
    slideNumber.innerHTML = slide + '/9';
  }
});
$('#previous').on('click', function() {
  var slide = present.get('index');
  $('.step-'+slide).removeClass('active');
  $('.step-'+slide).children('.extra').removeClass('active');
  if (slide > 0) {
    slide -= 1;
    $('.step-'+slide).addClass('active');
    $('.step-'+slide).children('.extra').addClass('active');
    present.set('index', slide);
    slideNumber.innerHTML = slide + '/9';
  }
});

// Presentation slides begins here
present
  .slide() // First

present
  .slide() // Second

present
  .slide() // Slide #1
    .reveal({
      duration: 1 // Animation transition duration
    })
      // Set axis x, y, z labels
      .array({
        data: [[2.1,0,0], [0,2.2,0], [0,0,2.1]],
        channels: 3, // necessary
        live: false,
      }).text({
        data: ["x", "z", "y"],
      }).label({
        color: 0xFFFFFF,
        colors: "#colors",
      })
      // Set grid
      .grid({
        width: 4,
        opacity: 0.7,
        axes: [1, 3],
      })
    .end() // Call end for every element you created that you want to delete
  .slide() // Slide #2
    .reveal({
      duration: 1
    })
      .grid({
        width: 2,
        opacity: 0.3,
        axes: [1, 3],
        depth: .2,
      })
        // Set axis x, y, z input numbers
        .array({
          data: [[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]],
          channels: 3, // necessary
          live: false,
        }).text({
          data: ["1", "1", "1", "-1", "-1", "-1"],
        }).label({
          color: 0xFFFFFF,
          colors: "#colors",
        })
        .point({
          size: 10,
          color: 0xFF0000
        })
          .area({
            id: "test44",
            width: 30,
            height: 30,
            axes: [1, 3],
            live: true,
            rangeX: [-1, 1],
            rangeY: [-1, 1],
            expr: function (emit, x, y, i, j) {
              var g = f1(x, y)
              emit(x, g, y);
            },
            channels: 3,
          })
          .point({
            size: 10,
            color: 0xFF0000
          })
          .surface({
            lineX: true,
            lineY: true,
            shaded: true,
            color: 0x5090FF,
            width: 2,
          })
    .end()

present
  .slide() // 3.
    .reveal({
      duration: 1
    })
      /* Pociatocne nastavenie gridu */
      .grid({
        width: 4,
        opacity: 0.7,
        axes: [1, 3],
      })
    .end()
  .slide() // 4.
    .reveal({
      duration: 1
    })
      .grid({
        axes: [1, 3],
        width: 2,
        color: 0xb0b0b0,
        depth: .5
      })
      .area({
        id: 'test',
        width: 100,
        height: 100,
        axes: [1, 3],
        live: true,
        rangeX: [-5, 5],
        rangeY: [-5, 5],
        expr: function (emit, x, y, i, j) {
          var g = f2(y, x);
          emit(x, g, y);
        },
        channels: 3,
      })
      .surface({
        lineX: true,
        lineY: true,
        shaded: true,
        color: 0x5090FF,
        width: 2,
      })
      .array({
        data: [[5.3,0,0], [0,890,0], [0,0,5.3]],
        channels: 3, // necessary
        live: false,
      }).text({
        data: ["x", "z", "y"],
      }).label({
        color: 0xFFFFFF,
        colors: "#colors",
      })
    .end()
  .slide()
    .reveal({
      duration: 2
    })
    // Set axis x, y, z input numbers
    .array({
      data: [[5,0,0], [0,400,0], [0,0,5], [-5,0,0], [0,-400,0], [0,0,-5]],
      channels: 3, // necessary
      live: false,
    }).text({
      data: ["5", "400", "5", "-5", "-400", "-5"],
    }).label({
      color: 0xFFFFFF,
      colors: "#colors",
    })
    .point({
      size: 10,
      color: 0xFF0000
    })
    .play({
        target: 'cartesian',
        pace: 5,
        to: 2,
        speed: .5,
        delay: 2,
        loop: false,
        ease: 'linear',
        script: [
          {props: {range: [[-2, 2], [-2, 2], [-2, 2]]}},
          {props: {range: [[-5, 5], [-800, 800], [-5, 5]]}},
        ]
      })
    .end()
  .slide()
    .reveal({
      duration: 2
    })
    .point({
      size: 10,
      color: 0xFF0000
    })
    .end()
      

present
  .slide() // 5.
    .interval({
      length: 64,
      expr: function (emit, x, i, t) {
        if (i == 0) console.log('emitting')
        /*var parser = math.parser();
        parser.eval('f(x) = x^2 + ');  // f(x, y)

        var y = 4 - Math.pow(x, 2)
        emit(x, Math.pow(f, 2));

        parser.clear();*/
      },
      channels: 2,
    })
    .line({
      color: 0x3090FF,
      width: 10,
    });
    

present
  .slide() // 6.
    .reveal({
      duration: 3
    })
      .transform({
        position: [0, -.25, 0]
      })
        .grid({
          axes: [1, 3],
          width: 2,
          color: 0xff2f90,
          depth: .5
        })
      .end()
    .end()
    .slide().reveal().move({ // 7.
      stagger: 2,
      from: [0, -2, 0, 0],
      to:   [0, -2, 0, 0]
    })
      .transform({
        position: [0, -.5, 0]
      })
        .grid({
          detailX: 20,
          detailY: 20,
          axes: [1, 3],
          width: 2,
          color: 0x9f2ff0,
          depth: .5,
          crossed: true
        })
    .end().end().end()
    .slide({ // 8.
      early: 1,
      late:  1,
    }).reveal()
      .transform({
        position: [0, -.75, 0]
      })
        .grid({
          axes: [1, 3],
          width: 2,
          color: 0x9f2ff0,
          depth: .5
        })
      .end()
    .end().end()
    .slide().reveal() // 9.
      .transform({
        position: [0, -1, 0]
      })
        .grid({
          axes: [1, 3],
          width: 2,
          color: 0x9f2ff0,
          depth: .5
        })
      .end()
    .end().end()


mathbox.select("#test44").set('rangeX', [-1, 3])
console.log(mathbox.select("#test44").get('rangeX'));