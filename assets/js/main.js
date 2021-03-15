var margin = { top: 50, bottom: 50, right: 50, left: 50 };
var m = { top: 100, bottom: 90, right: 50, left: 70 };
var m3 = { top: 100, bottom: 90, right: 70, left: 50 };
var legend = {
  width: 500,
  height: 70,
  rectwidth: 500 / 21,
  color: d3.color('#bbf1fa'),
};

var tropes = [
  { t: 'fight', state: 'on' },
  { t: 'victory', state: 'on' },
  { t: 'win_won', state: 'on' },
  { t: 'rah', state: 'on' },
  { t: 'nonsense', state: 'on' },
  { t: 'colors', state: 'on' },
  { t: 'men', state: 'on' },
  { t: 'opponents', state: 'on' },
  { t: 'spelling', state: 'on' },
];

let infoText = ['table-school', 'table-violent', 'table-property'];

legend.color.opacity = 0.5;

let highlightStroke = '#a50f15';
let highlightBar = '#ffe05d';
let highlightBox = '#e7e6e1';
let radius = 7;
let highlight_color = '#e45826';
currSchool = 'Arizona';
chart1 = { height: 400, width: 800, color: d3.color('#51adcf') };

chart2 = {
  height: 500,
  width: 500,
  colorY: d3.color('#ffe05d'),
  colorN: d3.color('#51adcf'),
};

chart3 = {
  height: 500,
  width: 500,
  colorY: d3.color('#ffe05d'),
  colorN: d3.color('#51adcf'),
};

var b = null;
var selected;
var brush = d3.brushX().extent([
  [0, 0],
  [legend.width, legend.height],
]);

[minTrope, maxTrope] = d3.extent(data, (d) => {
  return d.trope_count;
});

opacityScale = d3.scaleDiverging().domain([1, 11, 21]).range([0.5, 1, 0.5]);

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

brush.on('brush', updateBrush).on('end', updateBrush);

// brush.on('start', cleanupChart);

function cleanupChart() {
  chart1Svg.selectAll('rect').remove();
  chart1Svg.selectAll('g').remove();
  chart1Svg.selectAll('text').remove();
  chart2Svg.selectAll('rect').remove();
  chart2Svg.selectAll('g').remove();
  chart2Svg.selectAll('text').remove();
  // chart3Svg.selectAll('circle').remove();
  // chart3Svg.selectAll('g').remove();
}

d3.select('#curr-selection').html(currSchool);
let uni = findbyname(currSchool);
d3.select('#chart1_input')
  .append('iframe')
  .attr('width', '300')
  .attr('height', '80')
  .attr('src', `https://open.spotify.com/embed/track/${uni.spotify_id}`)
  .attr('frameborder', '0')
  .attr('allow', 'encrypted-media')
  .attr('allowtransparency', 'true')
  .style('float', 'right');

d3.select('#drop-menu')
  .selectAll('a')
  .data(data)
  .enter()
  .append('a')
  .classed('dropdown-item', true)
  .html((d) => {
    return d.school;
  })
  .attr('href', '#')
  .on('click', changedSelection);

d3.select('#uni-slider')
  .append('svg')
  .attr('width', legend.width)
  .attr('height', legend.height)
  .attr('stroke', 'black');

d3.select('#barchart1')
  .append('svg')
  .attr('width', chart1.width)
  .attr('height', chart1.height);

d3.select('#barchart2')
  .append('svg')
  .attr('width', chart2.width)
  .attr('height', chart2.height);

d3.select('#barchart3')
  .append('svg')
  .attr('width', chart3.width)
  .attr('height', chart3.height);

chart1Svg = d3.selectAll('#barchart1').select('svg');
chart2Svg = d3.selectAll('#barchart2').select('svg');
chart3Svg = d3.selectAll('#barchart3').select('svg');
sliderSvg = d3.selectAll('#uni-slider').select('svg');
makeSlider();
makeChart3();
function changedSelection() {
  let sel = d3.select(this);
  currSchool = sel.data()[0].school;
  let uni = findbyname(currSchool);

  document.getElementById(`${infoText[0]}`).innerHTML = `${uni.school}`;
  document.getElementById(`${infoText[1]}`).innerHTML = `${uni.violent}`;
  document.getElementById(`${infoText[2]}`).innerHTML = `${uni.property}`;

  d3.select('#chart1_input')
    .selectAll('iframe')
    .attr('src', `https://open.spotify.com/embed/track/${uni.spotify_id}`);
  d3.select('#curr-selection').html(currSchool);
  chart1Svg
    .selectAll('rect')
    .filter((d) => {
      if (d.school === currSchool) {
        return true;
      }
      return false;
    })
    .attr('fill', highlightBar);
  chart1Svg
    .selectAll('rect')
    .filter((d) => {
      if (d.school === currSchool) {
        return false;
      }
      return true;
    })
    .attr('fill', chart1.color.toString());

  sliderSvg
    .selectAll('.slider-bar')
    .filter((d) => {
      if (d.school === currSchool) {
        return true;
      }
      return false;
    })
    .attr('fill', highlightBar);
  sliderSvg
    .selectAll('.slider-bar')
    .filter((d) => {
      if (d.school === currSchool) {
        return false;
      }
      return true;
    })
    .attr('fill', legend.color.toString());

  chart2Svg
    .selectAll('rect')
    .filter((d) => {
      if (d.school === currSchool) {
        return true;
      }
      return false;
    })
    .attr('stroke', highlightBar)
    .attr('stroke-width', 3)
    .raise();

  chart2Svg
    .selectAll('rect')
    .filter((d) => {
      if (d.school === currSchool) {
        return false;
      }
      return true;
    })
    .attr('stroke', chart2.colorN.toString());

  chart3Svg
    .selectAll('circle')
    .filter((d) => {
      if (d.school === currSchool) {
        return true;
      }
      return false;
    })
    .attr('fill', highlightBar)
    .raise();
  chart3Svg
    .selectAll('circle')
    .filter((d) => {
      if (d.school === currSchool) {
        return false;
      }
      return true;
    })
    .attr('fill', chart3.colorN.toString());
}

function onBrush() {
  let allRects = sliderSvg.selectAll('rect');

  if (b != null) {
    var x1 = b[0];
    var x2 = b[1];

    var lowerIndx = Math.round(xSliderScale.invert(d3.min([x1, x2]))) - 1;
    var upperIndx = Math.round(xSliderScale.invert(d3.max([x1, x2]))) - 1;

    // console.log(lowerIndx + '   ' + upperIndx);
  }

  // Selection filter function
  function isSelected(d, i) {
    // write this.

    if (i < upperIndx && i >= lowerIndx) {
      return true;
    }

    return false;
  }

  selected = allRects.filter((d, i) => {
    return isSelected(d, i);
  });
  let notSelected = allRects.filter(function (d, i) {
    return !isSelected(d, i);
  });

  // selected and notSelected are d3 selections, write code to set their
  // attributes as per the assignment specification.
  selected.transition().attr('stroke', highlightStroke).attr('stroke-width', 2);

  notSelected.transition().attr('stroke', 'black').attr('stroke-width', 1);
}

function findbyname(name) {
  let t = d3.filter(data, (d) => {
    if (d.school === name) {
      return true;
    }
    return false;
  });
  return t[0];
}

function updateBrush(event) {
  b = event.selection;
  onBrush();
  cleanupChart();
  makeChart1();
  makeChart2();

  //   if (event.type === 'end') {
  //     makeChart1();
  //   }
}

function makeSlider() {
  ySliderScale = d3
    .scaleLinear()
    .domain([0, maxTrope])
    .range([0, legend.height]);
  xSliderScale = d3
    .scaleLinear()
    .domain([1, 21])
    .range([0, legend.width - legend.rectwidth]);
  sliderSvg
    .append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .classed('slider-bar', true)
    .attr('width', legend.rectwidth)
    .attr('x', (d, i) => {
      return xSliderScale(i + 1);
    })
    .attr('y', (d, i) => {
      return legend.height - ySliderScale(d.trope_count);
    })
    .attr('height', (d, i) => {
      return ySliderScale(d.trope_count);
    })
    .attr('fill', legend.color.toString());

  sliderSvg
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('font-size', '.5em')
    .attr('font-family', 'Verdana')
    .attr('Arial', 'sans-serif')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', function (d, i) {
      return -(legend.height - 40);
    })
    .attr('y', (d, i) => {
      return xSliderScale(i + 1) + 10;
    })
    .attr('dy', '.35em')
    .text(function (d) {
      return d.school;
    });

  sliderSvg
    .append('rect')
    .attr('width', legend.width)
    .attr('height', legend.height)
    .attr('fill', 'none')
    .attr('stroke', 'black');

  sliderSvg.append('g').call(brush).call(brush.move, [7, 14].map(xSliderScale));

  // d3.selectAll('.handle').remove();
  sliderSvg
    .selectAll('.slider-bar')
    .filter((d) => {
      if (d.school === currSchool) {
        return true;
      }
      return false;
    })
    .attr('fill', highlightBar);
}

function makeChart1() {
  if (selected === undefined) {
    return;
  }
  ychart1Scale = d3
    .scaleLinear()
    .domain([minTrope, maxTrope])
    .range([chart1.height - margin.bottom, margin.top]);

  let yAxis = d3.axisLeft().scale(ychart1Scale);

  xchart1Scale = d3
    .scaleLinear()
    .domain([0, selected.data().length - 1])
    .range([
      margin.left,
      chart1.width -
        margin.right -
        (chart1.width - margin.left - margin.right) / selected.data().length,
    ]);
  chart1Svg
    .append('g')
    .selectAll('rect')
    .data(selected.data())
    .enter()
    .append('rect')
    .attr(
      'width',
      (chart1.width - margin.left - margin.right) / selected.data().length
    )
    .attr('x', (d, i) => {
      return xchart1Scale(i);
    })
    .attr('y', (d, i) => {
      return ychart1Scale(d.trope_count);
    })
    .attr('height', (d, i) => {
      return chart1.height - ychart1Scale(d.trope_count) - 50;
    })
    .attr('fill', chart1.color.toString())
    .attr('stroke-width', 0.5)
    .attr('stroke', 'black');

  chart1Svg
    .selectAll('text')
    .data(selected.data())
    .enter()
    .append('text')
    .attr('font-size', '1em')
    .attr('text-anchor', 'middle')
    .attr('x', function (d, i) {
      return -(chart1.height - 150);
    })
    .attr('transform', 'rotate(-90)')

    .attr('y', function (d, i) {
      return xchart1Scale(i) + 20;
    })

    .text(function (d) {
      return d.school;
    });
  chart1Svg
    .append('g')
    .classed('axisy', true)
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis.ticks(6));

  chart1Svg
    .selectAll('rect')
    .filter((d) => {
      if (d.school === currSchool) {
        return true;
      }
      return false;
    })
    .attr('fill', highlightBar);
  chart1Svg
    .append('text')
    .classed('axis_label', true)
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', '1em')
    .style('text-anchor', 'middle')
    .text(`${'Trope count'}`);
}

function makeChart2() {
  if (selected === undefined) {
    return;
  }
  let count = 0;
  let currTropes = d3.filter(tropes, (d) => {
    if (d.state === 'on') return true;
    return false;
  });
  ychart2Scale = d3
    .scaleLinear()
    .domain([0, currTropes.length])
    .range([m.top, chart2.height - m.bottom]);

  axisScale = d3
    .scaleBand()
    .range([ychart2Scale(0), ychart2Scale(currTropes.length)]);

  axisScale.domain(
    currTropes.map(function (d) {
      return d.t;
    })
  );
  let yAxis = d3.axisLeft().scale(axisScale);

  xchart2Scale = d3
    .scaleLinear()
    .domain([0, selected.data().length - 1])
    .range([m.left, chart2.width - m.right - 10]);

  for (idx in currTropes) {
    chart2Svg
      .append('g')
      .selectAll('rect')
      .data(selected.data())
      .enter()
      .append('rect')
      .attr('width', (chart2.width - m.left - m.right) / selected.data().length)
      .attr('x', (d, i) => {
        return xchart2Scale(i);
      })
      .attr('y', (d, i) => {
        return ychart2Scale(idx);
      })
      .attr('height', (d, i) => {
        return (chart2.height - m.bottom - m.top) / currTropes.length;
      })
      .attr('stroke', chart1.color.toString())
      .attr('stroke-width', 3)
      .attr('fill', (d) => {
        if (checkTrope(d, idx)) {
          return highlightBox;
        }
        return 'none';
      });
  }

  chart2Svg
    .append('g')
    .selectAll('text')
    .data(selected.data())
    .enter()
    .append('text')
    .attr('font-size', '0.8em')
    .attr('font-family', 'Verdana')
    .attr('Arial', 'sans-serif')
    .attr('text-anchor', 'middle')
    .attr('x', function (d, i) {
      return -(chart2.height - 450);
    })
    .attr('transform', 'rotate(-90)')

    .attr('y', function (d, i) {
      return xchart2Scale(i) + 15;
    })

    .text(function (d) {
      return d.school;
    });

  chart2Svg
    .append('g')
    .classed('axisy', true)
    .attr('transform', `translate(${m.left - 5},0)`)
    .call(yAxis);

  chart2Svg
    .selectAll('rect')
    .filter((d) => {
      if (d.school === currSchool) {
        return true;
      }
      return false;
    })
    .attr('stroke', highlightBar)
    .raise();

  chart2Svg.selectAll('.tick').selectAll('text').attr('font-size', '1.2em');
}

function checkTrope(d, i) {
  let currTrope = tropes[i].t;
  switch (currTrope) {
    case 'fight':
      if (d.fight === 'Yes') {
        return true;
      }
      break;
    case 'victory':
      if (d.victory === 'Yes') {
        return true;
      }
      break;
    case 'win_won':
      if (d.win_won === 'Yes') {
        return true;
      }
      break;
    case 'rah':
      if (d.rah === 'Yes') {
        return true;
      }
      break;
    case 'men':
      if (d.men === 'Yes') {
        return true;
      }
      break;
    case 'opponents':
      if (d.opponents === 'Yes') {
        return true;
      }
      break;
    case 'spelling':
      if (d.spelling === 'Yes') {
        return true;
      }
      break;
    case 'colors':
      if (d.colors === 'Yes') {
        return true;
      }
      break;
    case 'nonsense':
      if (d.nonsense === 'Yes') {
        return true;
      }
      break;

    default:
      break;
  }
  return false;
}

function makeChart3() {
  let [minP, maxP] = d3.extent(data, (d) => {
    return d.property;
  });
  let [minV, maxV] = d3.extent(data, (d) => {
    return d.violent;
  });

  let xScale = d3
    .scaleLinear()
    .domain([minV / 2, maxV])
    .range([m3.left, chart3.width - m3.right]); // create a scale for the x axis

  let yScale = d3
    .scaleLinear()
    .domain([minP / 2, maxP])
    .range([chart3.height - m3.top, m3.bottom]); // create a scale for the y axis

  chart3Svg
    .append('g')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .classed('point', true)
    .attr('r', radius)
    .attr('cx', (d) => {
      return xScale(d.violent);
    })
    .attr('cy', (d) => {
      return yScale(d.property);
    })
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .attr('fill', (d) => {
      if (d.school === currSchool) {
        return highlightBar;
      }
      return chart3.colorN.toString();
    })
    .on('mouseover', pointHover)
    .on('mouseleave', pointLeave);

  let xAxis = d3.axisBottom().scale(xScale); // create an axis object for the x axis
  let yAxis = d3.axisLeft().scale(yScale); // create an axis object for the y axis

  // add code to draw the axes / axes labels
  chart3Svg
    .append('g')
    .classed('axisx', true)
    .attr('transform', `translate(0,${chart3.height - m3.bottom - 10})`)
    .call(xAxis);

  chart3Svg
    .append('text')
    .classed('axis_label', true)
    .attr('transform', `translate(250,${chart3.height - 60})`)
    .style('text-anchor', 'middle')
    .text('Student who experience violent crime(per 1000)');

  chart3Svg
    .append('g')
    .classed('axisy', true)
    .attr('transform', `translate(${m3.left},0)`)
    .call(yAxis);

  chart3Svg
    .append('text')
    .classed('axis_label', true)
    .attr('transform', 'rotate(-90)')
    .attr('x', -240)
    .attr('y', '1em')
    .style('text-anchor', 'middle')
    .text(`${'Student who experience property crime(per 1000)'}`);
}

//Function that desribes the behaviour of a point when user hovers over it
function pointHover() {
  //Change color to electric blue and radius is increased
  d3.select(this)
    .transition()
    .duration(200)
    .ease(d3.easeBounce)
    .attr('r', 10)
    .attr('fill', (data) => {
      return highlight_color;
    });
  let point = d3.select(this);
  let ptData = point.data()[0];

  document.getElementById(`${infoText[0]}`).innerHTML = `${ptData.school}`;
  document.getElementById(`${infoText[1]}`).innerHTML = `${ptData.violent}`;
  document.getElementById(`${infoText[2]}`).innerHTML = `${ptData.property}`;
}

// Function to describe behaviour when user leaves a point
function pointLeave() {
  // Return to original fill and radius
  d3.select(this)
    .transition()
    .ease(d3.easeBounce)
    .attr('r', radius)
    .attr('fill', (d) => {
      if (d.school === currSchool) {
        return highlightBar;
      }
      return chart3.colorN.toString();
    });

  document.getElementById(`${infoText[0]}`).innerHTML = '';
  document.getElementById(`${infoText[1]}`).innerHTML = '';
  document.getElementById(`${infoText[2]}`).innerHTML = '';
}
