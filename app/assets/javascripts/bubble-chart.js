var data = {};

(function() {

data.topics = [
  {name: "Work", re: /\b(work[a-z]*)\b/gi, count: 10},
  {name: "Women", re: /\b(wom[ae]n)\b/gi, count: 22}
];

data.topic = function(name) {
  var t = topic({name: name, re: new RegExp("\\b(" + d3.requote(name) + ")\\b", "gi")});
  data.topics.push(t);
  return t;
};

function topic(topic) {
  topic.count = Math.floor(Math.random() * 10);
  topic.mentions = [];
  return topic;
}

})();

(function() {

var width = 970,
    height = 500;

var padding = 4, // collision padding
    maxRadius = 80, // collision search radius
    maxMentions = 100, // limit displayed mentions
    activeTopic; // currently-displayed topic

var r = d3.scale.sqrt()
    .domain([0, d3.max(data.topics, function(d) { return d.count; })])
    .range([0, maxRadius]);

var force = d3.layout.force()
    .gravity(0)
    .charge(0)
    .size([width, height])
    .on("tick", tick);

var node = d3.select(".g-nodes").selectAll(".g-node"),
    label = d3.select(".g-labels").selectAll(".g-label");

d3.select(".g-nodes").append("rect")
    .attr("class", "g-overlay")
    .attr("width", width)
    .attr("height", height)
    .on("click", clear);

d3.select(window)
    .on("hashchange", hashchange);

d3.select("#g-form")
    .on("submit", submit);

updateTopics(data.topics);
hashchange();

// Update the known topics.
function updateTopics(topics) {
  topics.forEach(function(d, i) { d.r = Math.max(12, r(d.count)); }); // min. collision
  force.nodes(data.topics = topics).start();
  updateNodes();
  updateLabels();
}

// Update the displayed nodes.
function updateNodes() {
  node = node.data(data.topics, function(d) { return d.name; });

  node.exit().remove();

  node.enter().append("a")
      .attr("class", "g-node")
      .attr("xlink:href", function(d) { return "#" + encodeURIComponent(d.name); })
      .call(force.drag)
      .call(linkTopic)
    .append("circle");

  node.select("circle")
      .attr("r", function(d) { return r(d.count); });
}

// Update the displayed node labels.
function updateLabels() {
  label = label.data(data.topics, function(d) { return d.name; });

  label.exit().remove();

  var labelEnter = label.enter().append("a")
      .attr("class", "g-label")
      .attr("href", function(d) { return "#" + encodeURIComponent(d.name); })
      .call(force.drag)
      .call(linkTopic);

  labelEnter.append("div")
      .attr("class", "g-name")
      .text(function(d) { return d.name; });

  labelEnter.append("div")
      .attr("class", "g-value");

  label
      .style("font-size", function(d) { return Math.max(8, r(d.count) / 2) + "px"; })
      .style("width", function(d) { return r(d.count) * 2.5 + "px"; });

  // Create a temporary span to compute the true text width.
  label.append("span")
      .text(function(d) { return d.name; })
      .each(function(d) { d.dx = Math.max(2.5 * r(d.count), this.getBoundingClientRect().width); })
      .remove();

  label
      .style("width", function(d) { return d.dx + "px"; })
    .select(".g-value")
      .text(function(d) { return d.count + (d.r > 60 ? " mentions" : ""); });

  // Compute the height of labels when wrapped.
  label.each(function(d) { d.dy = this.getBoundingClientRect().height; });
}

// Update the active topic.
function updateActiveTopic(topic) {
  if (activeTopic = topic) {
    node.classed("g-selected", function(d) { return d === topic; });
    d3.select("#g-topic").text(topic.count + " aparicións da palabra '" + topic.name + "'");
  } else {
    d3.select("#g-topic").text("");
    d3.select("#mentions-left").html(null);
    d3.select("#mentions-right").html(null);
  }
}

// Assign event handlers to topic links.
function linkTopic(a) {
  a.on("click", click)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);
}

// Returns the topic matching the specified name, approximately.
// If no matching topic is found, returns undefined.
function findTopic(name) {
  for (var i = 0, n = data.topics.length, t; i < n; ++i) {
    if ((t = data.topics[i]).name === name) {
        return t;
    }
  }
}

// Returns the topic matching the specified name, approximately.
// If no matching topic is found, a new one is created.
function findOrAddTopic(name) {
  var topic = findTopic(name);
  if (!topic) {
    data.topic(capitalize(name), function(topic) {
        topic.x = 200;
        topic.y = 0;
        updateTopics(data.topics);

        return topic;
    });
  }
  return topic;

  function capitalize(name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  }
}

data.topic = function(name, cb) {
    $.get('/word_counts/' + name + '.json', function(topic) {
        topic.name = topic.word;
        data.topics.push(topic);
        cb(topic);
    });
};

// Simulate forces and update node and label positions on tick.
function tick(e) {
  node
      .each(gravity(e.alpha * .1))
      .each(collide(.5))
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  label
      .style("left", function(d) { return (d.x - d.dx / 2) + "px"; })
      .style("top", function(d) { return (d.y - d.dy / 2) + "px"; });
}

// Custom gravity to favor a non-square aspect ratio.
function gravity(alpha) {
  var cx = width / 2,
      cy = height / 2,
      ax = alpha / 4,
      ay = alpha;
  return function(d) {
    d.x += (cx - d.x) * ax;
    d.y += (cy - d.y) * ay;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var q = d3.geom.quadtree(data.topics);
  return function(d) {
    var r = d.r + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    q.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d) && d.other !== quad.point && d !== quad.point.other) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.r + quad.point.r + padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

// Fisher–Yates shuffle.
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// Update the active topic on hashchange, perhaps creating a new topic.
function hashchange() {
  var name = decodeURIComponent(location.hash.substring(1)).trim();
  updateActiveTopic(name && name != "!" ? findOrAddTopic(name) : null);
}

// Trigger a hashchange on submit.
function submit() {
  d3.event.preventDefault();
  var name = this.search.value.trim();
  location.hash = name ? encodeURIComponent(name) : "!";
  this.search.value = "";
}

// Clear the active topic when clicking on the chart background.
function clear() {
  location.replace("#!");
}

// Rather than flood the browser history, use location.replace.
function click(d) {
  d3.event.preventDefault();
  if (d !== activeTopic) {
    refreshMentions(d.name);
  }
  location.replace("#" + encodeURIComponent(d === activeTopic ? "!" : d.name));
}

function keys(hash) {
    var result = new Array();
    for (var attr in hash) {
        result.push(attr);
    }
    return result;
}

function refreshMentions(word) {
    $.get("/words/" + word + ".json", function(result) {
        var lMentions = d3.select("#mentions-left");
        var rMentions = d3.select("#mentions-right");

        lMentions.html(null);
        rMentions.html(null);

        var speakers = result.speakers,
            speakerNames = keys(speakers);

        var len = speakerNames.length;
        var half = len / 2;
        var i = 0;

        speakerNames.sort();
        speakerNames.forEach(function(name) {
            var entries = speakers[name];

            var div;
            if (i < half) {
                div = lMentions.append("div")
                    .attr("class", "mention");
            } else {
                div = rMentions.append("div")
                    .attr("class", "mention");
            }
            i++;

            div.append("div")
                .attr("class", "g-speaker")
                .text(name);

            div.selectAll("span")
                .data(entries)
                .enter()
                .append("span")
                .html(function(entry) { 
                    return "<p>" + formatDate(entry.date) + "</p>" + 
                        "<p>" + formatBody(entry.body) + "</p>"; 
                });
        });

        function formatDate(tstamp) {
            var format = d3.time.format("%d/%m/%Y");
            return format(new Date(tstamp * 1000));
        }

        function formatBody(body) {
            var pos, start, end;

            pos = body.indexOf(word);
            end = index(body, ".¡!¿?", pos);
            end = end != body.length ? end + 1 : end;
            start = rindex(body, ".¡!¿?", pos);
            start = start != 0 ? start + 1 : start;
            return body.substring(start, end).replace(word, "<span style='background: #ccc; padding: 1px 3px'>" + word + "</span>");
        }

        function index(str, chars, from) {
            var regex = new RegExp("[" + chars + "]");
            return from + str.substr(from).search(regex);
        }

        function rindex(str, chars, from) {
            for (var i = from; i > 0; i--) {
                for (var j = 0; j < chars.length; j++) {
                    if (str[i] == chars[j]) {
                        return i;
                    }
                }
            }
            return 0;
        }

    });
}

function format(date, body) {
    var html = new Array();
    html.push("<div>" + date + "<div>");
    html.push("<div>" + body + "<div>");
    return "<div>" + html.join("\n") + "</div>";
}

// When hovering the label, highlight the associated node and vice versa.
// When no topic is active, also cross-highlight with any mentions in excerpts.
function mouseover(d) {
  node.classed("g-hover", function(p) { return p === d; });
  if (!activeTopic) d3.selectAll(".g-mention p").classed("g-hover", function(p) { return p.topic === d; });
}

// When hovering the label, highlight the associated node and vice versa.
// When no topic is active, also cross-highlight with any mentions in excerpts.
function mouseout(d) {
  node.classed("g-hover", false);
  if (!activeTopic) d3.selectAll(".g-mention p").classed("g-hover", false);
}

})();
