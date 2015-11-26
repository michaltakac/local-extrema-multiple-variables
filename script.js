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
  range: [[-5, 5], [-800, 800], [-5, 5]],
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
        width: 2,
        color: 0xb0b0b0,
        depth: .5
      })

view.array({
        data: [[5.3,0,0], [0,890,0], [0,0,5.3]],
        channels: 3, // necessary
        live: false,
      }).text({
        data: ["x", "z", "y"],
      }).label({
        color: 0xFFFFFF,
        colors: "#colors",
      });
    // Set axis x, y, z input numbers
    view.array({
      data: [[5,0,0], [0,400,0], [0,0,5], [-5,0,0], [0,-400,0], [0,0,-5]],
      channels: 3, // necessary
      live: false,
    }).text({
      data: ["5", "400", "5", "-5", "-400", "-5"],
    }).label({
      color: 0xFFFFFF,
      colors: "#colors",
    });
    view.point({
      size: 10,
      color: 0xFF0000
    });
      


surface = mathbox.select('surface')
vector = mathbox.select('vector')

// Set first presentation slide to 1
var present = view.present({ index: 1 });

// Slide counter element
var slideNumber = document.getElementById('slide-number');
// Inject initial value into slide counter element
slideNumber.innerHTML = present.get('index') + '/99';

// Navigate through slides with left and right arrow on keyboard
if (window == top) {
  window.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
      case 38:
        present.set('index', present.get('index') - 1);
        slideNumber.innerHTML = present.get('index') + '/99';
        break;
      case 39:
      case 40:
        present.set('index', present.get('index') + 1);
        slideNumber.innerHTML = present.get('index') + '/99';
        break;
    }
  }
}

// Also navigate through slides with blue arrows in our webpage
$('#next').on('click', function() {
  var slide = present.get('index');
  $('.step-'+slide).removeClass('active');
  $('.step-'+slide).children('.extra').removeClass('active');
  if (slide < 20) {
    slide += 1;
    $('.step-'+slide).addClass('active');
    $('.step-'+slide).children('.extra').addClass('active');
    present.set('index', slide);
    slideNumber.innerHTML = slide + '/99';
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
    slideNumber.innerHTML = slide + '/99';
  }
});

// Presentation slides begins here
present
  .slide() // 1.
    .reveal({
      duration: 1
    })
    .area({
        id: 'test',
        width: 100,
        height: 100,
        axes: [1, 3],
        live: false,
        rangeX: [-5, 5],
        rangeY: [-5, 5],
        expr: function (emit, x, y, i, j) {
          emit(x, f1(y, x), y);
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
    .end()
  .slide() // 2.
    .reveal({
      duration: 1
    })
    .end()
  .slide() // 3.
    .reveal({
      duration: 1
    })
    .area({
        width: 100,
        height: 100,
        axes: [1, 3],
        live: false,
        rangeX: [-5, 5],
        rangeY: [-5, 5],
        expr: function (emit, x, y, i, j) {
          var func = 3*Math.pow(x, 2) + 3*Math.pow(y, 2) - 51;
          emit(x, func, y);
        },
        channels: 3,
      }).surface({
        color: 0x1AAD00,
        width: 2,
        opacity: 1,
        lineX: false,
        lineY: false
      })

present
  .slide() // 4.
    .reveal({
      duration: 1
    })
    .area({
      width: 100,
      height: 100,
      axes: [1, 3],
      rangeX: [-5, 5],
      rangeY: [-5, 5],
      expr: function (emit, x, y, i, j) {
        var func = 3*Math.pow(x, 2) + 3*Math.pow(y, 2) - 51;
        emit(x, func, y);
      },
      channels: 3,
    })
    .surface({
      color: 0x1AAD00,
      width: 1,
      opacity: 1,
      lineX: true,
      lineY: true
    })
    .play({
      target: 'cartesian',
      pace: 5,
      to: 2,
      loop: true,
      script: [
        {props: {range: [[-5, 5], [-800, 800], [-5, 5]]}},
        {props: {range: [[-5, 5], [-1, 1], [-5, 5]]}},
      ]
    })

present
  .slide() // 4.
    .reveal({
      duration: 1
    })
    .area({
      width: 100,
      height: 100,
      axes: [1, 3],
      live: false,
      rangeX: [-5, 5],
      rangeY: [-5, 5],
      expr: function (emit, x, y, i, j) {
          var func = (6*x*y) - 24;
          emit(x, func, y);
        },
      channels: 3,
    }).surface({
      color: 0xA16300, //xA16300
      width: 2,
      opacity: 1,
      lineX: false,
      lineY: false
    })

present
  .slide() // 5.
    .reveal({
      duration: 1
    })

present
  .slide() // 6.
    .reveal({
      duration: 1
    })

present
  .slide() // 7.
    .reveal({
      duration: 1
    })

present
  .slide() // 8.
    .reveal({
      duration: 1
    })
    // Draw ticks and labels
    .scale({
      axis: 1,
      divide: 10,
    }).ticks({
      width: 5,
      size: 25,
      color: 'black',
    }).format({
      digits: 1,
    }).label({
      color: 'red',
      zIndex: 1,
    })
    .scale({
      axis: 3,
      divide: 10,
    }).ticks({
      width: 5,
      size: 25,
      color: 'black',
    }).format({
      digits: 1,
    }).label({
      color: 'red',
      zIndex: 1,
    })
    .end()
  .slide()
    .reveal({
      duration: 1
    })
    .end()
  .slide()
    .reveal({
      duration: 1
    })
    .array({
      data: [[4,0,1], [-4,0,-1], [1,0,4], [-1,0,-4]],
      channels: 3, // necessary
      live: false
    })
    .point({
      size: 35,
      color: 0xFAE900
    })
    .array({
      data: [[4,100,1], [-4,-80,-1], [1,100,4], [-1,-50,-4]],
      channels: 3, // necessary
      live: false,
    }).text({
      data: ["A", "B", "C", "D"],
      weight: 'bold',
      detail: 45
    }).label({
      color: 0xDB00BA,
    })
    .end()
  .slide() // 9.
    .reveal({
      duration: 1
    })
    .end()
  .slide() // 9.
    .reveal({
      duration: 1
    })
    .end()
  .slide() // 9.
    .reveal({
      duration: 1
    })
    .end()