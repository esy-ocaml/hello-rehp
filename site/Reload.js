/*!
 * Flatdoc - (c) 2013, 2014 Rico Sta. Cruz
 * http://ricostacruz.com/flatdoc
 * @license MIT
 */


var emptyHTML = "";

function escapePlatformStringLoop(html, lastIndex, index, s, len) {
  var html__0 = html;
  var lastIndex__0 = lastIndex;
  var index__0 = index;
  for (; ; ) {
    if (index__0 === len) {
      var match = 0 === lastIndex__0 ? 1 : 0;
      if (0 === match) {
        var match__0 = lastIndex__0 !== index__0 ? 1 : 0;
        return 0 === match__0 ?
          html__0 :
          html__0+s.substring(lastIndex__0, len);
      }
      return s;
    }
    var code = s.charCodeAt(index__0);
    if (40 <= code) {
      var switcher = code + -60 | 0;
      if (! (2 < switcher >>> 0)) {
        switch (switcher) {
          case 0:
            var html__1 = html__0+s.substring(lastIndex__0, index__0);
            var lastIndex__1 = index__0 + 1 | 0;
            var html__2 = html__1+"&lt;";
            var index__2 = index__0 + 1 | 0;
            var html__0 = html__2;
            var lastIndex__0 = lastIndex__1;
            var index__0 = index__2;
            continue;
          case 1:break;
          default:
            var html__3 = html__0+s.substring(lastIndex__0, index__0);
            var lastIndex__2 = index__0 + 1 | 0;
            var html__4 = html__3+"&gt;";
            var index__3 = index__0 + 1 | 0;
            var html__0 = html__4;
            var lastIndex__0 = lastIndex__2;
            var index__0 = index__3;
            continue
          }
      }
    }
    else if (34 <= code) {
      var switcher__0 = code + -34 | 0;
      switch (switcher__0) {
        case 0:
          var su = s.substring(lastIndex__0, index__0);
          var html__5 = html__0+su;
          var lastIndex__3 = index__0 + 1 | 0;
          var html__6 = html__5+"&quot;";
          var index__4 = index__0 + 1 | 0;
          var html__0 = html__6;
          var lastIndex__0 = lastIndex__3;
          var index__0 = index__4;
          continue;
        case 4:
          var su__0 = s.substring(lastIndex__0, index__0);
          var html__7 = html__0+su__0;
          var lastIndex__4 = index__0 + 1 | 0;
          var html__8 = html__7+"&amp;";
          var index__5 = index__0 + 1 | 0;
          var html__0 = html__8;
          var lastIndex__0 = lastIndex__4;
          var index__0 = index__5;
          continue;
        case 5:
          var su__1 = s.substring(lastIndex__0, index__0);
          var html__9 = html__0+su__1;
          var lastIndex__5 = index__0 + 1 | 0;
          var html__10 = html__9+"&#x27;";
          var index__6 = index__0 + 1 | 0;
          var html__0 = html__10;
          var lastIndex__0 = lastIndex__5;
          var index__0 = index__6;
          continue
        }
    }
    var index__1 = index__0 + 1 | 0;
    var index__0 = index__1;
    continue;
  }
}

function escapeHtml(s) {
  return (
    escapePlatformStringLoop(
      emptyHTML,
      0,
      0,
      s,
      s.length
    )
  );
}


var isSearchable = function(node) {
  return (
    node.tagName === 'H1' || node.tagName === 'h1' ||
    node.tagName === 'H2' || node.tagName === 'h2' ||
    node.tagName === 'H3' || node.tagName === 'h3' ||
    node.tagName === 'P' || node.tagName === 'p' ||
    node.tagName === 'LI' || node.tagName === 'li' ||
    node.tagName === 'CODE' || node.tagName === 'code' ||
    node.tagName === 'PRE' || node.tagName === 'pre'
  );
};
var updateContext = function(context, node) {
  if(node.tagName === 'h1' || node.tagName === 'H1') {
    return {...context, h1: node};
  }
  if(node.tagName === 'h2' || node.tagName === 'H2') {
    return {...context, h2: node};
  }
  if(node.tagName === 'h3' || node.tagName === 'H3') {
    return {...context, h3: node};
  }
  return context;
};
var updateSearchables = function(searchables, context, node) {
  if(isSearchable(node)) {
    return [{
      node: node,
      context: context
    }, searchables];
  } else {
    return searchables;
  }
};

/**
 * Turn a search string into a regex portion.
 * https://stackoverflow.com/a/1144788
 */
function escapeRegExpSearchString(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

function replaceAllStringsCaseInsensitive(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'gi'), replace);
}

function escapeRegExpSplitString(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

function splitStringCaseInsensitiveImpl(regex, str, find) {
  return str.split(regex);
}
function splitStringCaseInsensitive(str, find) {
  return str.split(new RegExp('(' + escapeRegExpSplitString(find) + ')', 'gi'));
}

/**
 * Only trust for markdown that came from trusted source (your own page).
 * I do not know exactly what portions are unsafe - perhaps none.
 */
var trustedTraverseAndHighlightImpl = function traverseAndHighlightImpl(regex, text, node) {
  var childNodes = node.childNodes;
  var childNode = childNodes.length > 0 ? childNodes[0] : null;
  var i = 0;
  var newInnerHtml = '';
  while(childNode && i < 2000) {
    if(childNode.nodeType === Node.TEXT_NODE) {
      var splitOnMatch = splitStringCaseInsensitiveImpl(regex, childNode.textContent, text);
      splitOnMatch.forEach(function(seg) {
        if(seg !== '') {
          if(seg.toLowerCase() === text.toLowerCase()) {
            newInnerHtml +=
              ('<search-highlight>' + escapeHtml(seg) + '</search-highlight>');
          } else {
            newInnerHtml += escapeHtml(seg);
          }
        }
      });
    } else {
      newInnerHtml += trustedTraverseAndHighlightImpl(regex, text, childNode);
    }
    i++;
    childNode = childNodes[i];
  }
  var openTag = '';
  var closeTag = '';
  var className = node.getAttributeNode("class");
  classAttr = className ? ' class="' + escapeHtml(className.value) + '"' : '';
  switch(node.tagName.toLowerCase()) {
    case 'a':
      var href = node.getAttributeNode("href");
      openTag = href ? '<a href="' + escapeHtml(href.value) + '"' + classAttr + '>' : '<a>';
      closeTag = '</a>'
      break;
    case 'code':
      var className = node.getAttributeNode("class");
      openTag = className ? '<code class="' + escapeHtml(className.value) + '"' + classAttr + '>' : '<code>';
      closeTag = '</code>'
      break;
    default:
      openTag = '<' + node.tagName + classAttr + '>';
      closeTag = '</' + node.tagName + '>';
  }
  if(node.tagName.toLowerCase() === 'a') {
  }
  return openTag + newInnerHtml + closeTag;
}

var trustedTraverseAndHighlight = function(text, node) {
  var regex = new RegExp('(' + escapeRegExpSplitString(text) + ')', 'gi');
  return trustedTraverseAndHighlightImpl(regex, text, node);
};

var traverseDOMInsideImpl = function traverseDOMInsideImpl(context, searchables, node, func) {
  func(node);
  node = node.firstChild;
  while(node) {
    context = updateContext(context, node);
    if(isSearchable(node)) {
      searchables = updateSearchables(searchables, context, node);
    } else {
      searchables = traverseDOMInsideImpl(context, searchables, node, func);
    }
    node = node.nextSibling;
  }
  return searchables;
}

var filterSearchablesLowerCaseImpl = function(searchText, searchablesArray) {
  var results = [];
  for(var i = 0; i < searchablesArray.length; i++) {
    var node = searchablesArray[i].node;
    var context = searchablesArray[i].context;
    var lowerCasedInnerText = node.innerText.toLowerCase();
    var indexMatch = lowerCasedInnerText.indexOf(searchText);
    if(indexMatch !== -1) {
      // TODO: Show multiple matches per searchable.
      results.push({
        searchable: searchablesArray[i],
        indexMatch: indexMatch,
        highlightedInnerText: trustedTraverseAndHighlight(searchText, node)
      })
    }
  }
  return results;
};

var filterSearchables = function(txt, searchablesArray) {
  return filterSearchablesLowerCaseImpl(txt, searchablesArray);
};

var matchedSearchableToHit = function(matchedSearchable) {
  return {
    name:
      matchedSearchable.searchable.context.h3 ? matchedSearchable.searchable.context.h3.innerText :
      matchedSearchable.searchable.context.h2 ? matchedSearchable.searchable.context.h2.innerText :
      matchedSearchable.searchable.context.h1 ? matchedSearchable.searchable.context.h1.innerText : "",
    content: matchedSearchable.searchable.node.innerText,
    _highlightResult: {
      content: {
        value: matchedSearchable.highlightedInnerText,
        matchLevel: "full",
        fullyHighlighted: true,
        matchedWords: ["z"],
      },
      // Add others here
    },
  }
};


/* Matches found in the header itself will be considered in that context */
var startContext = {
  h1: null,
  h2: null,
  h3: null,
};
var startSearchables = 0; // nill

var flattenList = function(list) {
  var ret = [];
  while(list !== 0) {
    ret.push(list[0]);
    list = list[1];
  }
  return ret;
};
var traverseDOMInside = function(node, func) {
  return flattenList(traverseDOMInsideImpl(startContext, startSearchables, node, func));
};

var searchables = null;
var searchDocs = (requests) => {
  var txt = requests[0].params.query;
  console.log(requests);
  var hits = [];
  if(txt == null || txt.trim() === "") {
    hits = [] 
  } else {
    if(true || searchables === null) {
      searchables = traverseDOMInside( document.querySelector('.content'), () => {});
    } 
    var filteredSearchables = filterSearchables(txt.trim(), searchables);
    hits = filteredSearchables.map(matchedSearchableToHit);
  }
  // https://www.algolia.com/doc/api-reference/api-methods/search-rules/#json-format
  // https://www.algolia.com/doc/api-reference/api-methods/search-synonyms/#method-response-value
  //
  // From: https://www.algolia.com/doc/guides/building-search-ui/going-further/backend-search/how-to/highlighting-snippeting/#response-information
  // The Algolia response will include a _highlightResult for each attribute,
  // which will contain the attribute’s value with highlighting, the match
  // level (how much of the query words were matched), a boolean indicating if
  // the whole attribute is highlighted, and the matched words for each
  // attribute. This is seen as follows:
  return {
    hits: hits,
    nbHits: 6022,
    page: 0,
    nbPages: 200,
    hitsPerPage: 5,
    exhaustiveNbHits: true,
    query: "z",
    queryAfterRemoval: "z",
    params: "query=z&hitsPerPage=5",
    processingTimeMS: 2,
  };


  var highlightResult = {
    results: [
      {
        hits: [
          {
            name: "Amazon - Fire TV Stick with Alexa Voice Remote - Black",
            description:
              "Enjoy smart access to videos, games and apps with this Amazon Fire TV stick. Its Alexa voice remote lets you deliver hands-free commands when you want to watch television or engage with other applications. With a quad-core processor, 1GB internal memory and 8GB of storage, this portable Amazon Fire TV stick works fast for buffer-free streaming.",
            brand: "Amazon",
            categories: ["TV & Home Theater", "Streaming Media Players"],
            hierarchicalCategories: {
              lvl0: "TV & Home Theater",
              lvl1: "TV & Home Theater > Streaming Media Players",
            },
            type: "Streaming media plyr",
            price: 39.99,
            price_range: "1 - 50",
            image: "https://cdn-demo.algolia.com/bestbuy-0118/5477500_sb.jpg",
            url: "https://api.bestbuy.com/click/-/5477500/pdp",
            free_shipping: false,
            rating: 4,
            popularity: 21469,
            objectID: "5477500",
            _highlightResult: {
              name: {
                value:
                  "Amazon - <ais-highlight-0000000000>Fire</ais-highlight-0000000000> TV Stick with Alexa Voice Remote - Black",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["fire"],
              },
              description: {
                value:
                  "Enjoy smart access to videos, games and apps with this Amazon <ais-highlight-0000000000>Fire</ais-highlight-0000000000> TV stick. Its Alexa voice remote lets you deliver hands-free commands when you want to watch television or engage with other applications. With a quad-core processor, 1GB internal memory and 8GB of storage, this portable Amazon <ais-highlight-0000000000>Fire</ais-highlight-0000000000> TV stick works fast for buffer-free streaming.",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["fire"],
              },
              brand: { value: "Amazon", matchLevel: "none", matchedWords: [] },
              categories: [
                {
                  value: "TV & Home Theater",
                  matchLevel: "none",
                  matchedWords: [],
                },
                {
                  value: "Streaming Media Players",
                  matchLevel: "none",
                  matchedWords: [],
                },
              ],
              type: {
                value: "Streaming media plyr",
                matchLevel: "none",
                matchedWords: [],
              },
            },
          },
          {
            name: "Landmann - Log Grabber - Black",
            description:
              "Landmann Log Grabber: Three gripping tongs firmly grasp logs up to 8\" thick, so you can adjust firewood while your hands remain a safe distance from open flames. The lever-action handle's rubber grip provides comfort during use.",
            brand: "Landmann",
            categories: [
              "Housewares",
              "Outdoor Living",
              "Patio Furniture & Decor",
              "Fire Pits",
            ],
            hierarchicalCategories: {
              lvl0: "Housewares",
              lvl1: "Housewares > Outdoor Living",
              lvl2: "Housewares > Outdoor Living > Patio Furniture & Decor",
              lvl3:
                "Housewares > Outdoor Living > Patio Furniture & Decor > Fire Pits",
            },
            type: "",
            price: 19.99,
            price_range: "1 - 50",
            image: "https://cdn-demo.algolia.com/bestbuy-0118/4239510_sb.jpg",
            url: "https://api.bestbuy.com/click/-/4239510/pdp",
            free_shipping: true,
            rating: 0,
            popularity: 12281,
            objectID: "4239510",
            _highlightResult: {
              name: {
                value: "Landmann - Log Grabber - Black",
                matchLevel: "none",
                matchedWords: [],
              },
              description: {
                value:
                  "Landmann Log Grabber: Three gripping tongs firmly grasp logs up to 8\" thick, so you can adjust firewood while your hands remain a safe distance from open flames. The lever-action handle's rubber grip provides comfort during use.",
                matchLevel: "none",
                matchedWords: [],
              },
              brand: { value: "Landmann", matchLevel: "none", matchedWords: [] },
              categories: [
                { value: "Housewares", matchLevel: "none", matchedWords: [] },
                { value: "Outdoor Living", matchLevel: "none", matchedWords: [] },
                {
                  value: "Patio Furniture & Decor",
                  matchLevel: "none",
                  matchedWords: [],
                },
                {
                  value:
                    "<ais-highlight-0000000000>Fire</ais-highlight-0000000000> Pits",
                  matchLevel: "full",
                  fullyHighlighted: false,
                  matchedWords: ["fire"],
                },
              ],
              type: { value: "", matchLevel: "none", matchedWords: [] },
            },
          },
          {
            name: "Landmann - Ball of Fire Fire Pit - Black",
            description:
              "Landmann Ball of Fire Fire Pit: Enhance a gathering with the inviting look of a glowing fire with this fire pit that creates the illusion that the fire is hovering. A pivoting section with an extra-large handle lets you easily tend the fire.",
            brand: "Landmann",
            categories: [
              "Housewares",
              "Outdoor Living",
              "Patio Furniture & Decor",
              "Fire Pits",
            ],
            hierarchicalCategories: {
              lvl0: "Housewares",
              lvl1: "Housewares > Outdoor Living",
              lvl2: "Housewares > Outdoor Living > Patio Furniture & Decor",
              lvl3:
                "Housewares > Outdoor Living > Patio Furniture & Decor > Fire Pits",
            },
            type: "",
            price: 199.99,
            price_range: "100 - 200",
            image: "https://cdn-demo.algolia.com/bestbuy-0118/4239505_sb.jpg",
            url: "https://api.bestbuy.com/click/-/4239505/pdp",
            free_shipping: false,
            rating: 5,
            popularity: 10706,
            objectID: "4239505",
            _highlightResult: {
              name: {
                value:
                  "Landmann - Ball of <ais-highlight-0000000000>Fire</ais-highlight-0000000000> <ais-highlight-0000000000>Fire</ais-highlight-0000000000> Pit - Black",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["fire"],
              },
              description: {
                value:
                  "Landmann Ball of <ais-highlight-0000000000>Fire</ais-highlight-0000000000> <ais-highlight-0000000000>Fire</ais-highlight-0000000000> Pit: Enhance a gathering with the inviting look of a glowing <ais-highlight-0000000000>fire</ais-highlight-0000000000> with this <ais-highlight-0000000000>fire</ais-highlight-0000000000> pit that creates the illusion that the <ais-highlight-0000000000>fire</ais-highlight-0000000000> is hovering. A pivoting section with an extra-large handle lets you easily tend the <ais-highlight-0000000000>fire</ais-highlight-0000000000>.",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["fire"],
              },
              brand: { value: "Landmann", matchLevel: "none", matchedWords: [] },
              categories: [
                { value: "Housewares", matchLevel: "none", matchedWords: [] },
                { value: "Outdoor Living", matchLevel: "none", matchedWords: [] },
                {
                  value: "Patio Furniture & Decor",
                  matchLevel: "none",
                  matchedWords: [],
                },
                {
                  value:
                    "<ais-highlight-0000000000>Fire</ais-highlight-0000000000> Pits",
                  matchLevel: "full",
                  fullyHighlighted: false,
                  matchedWords: ["fire"],
                },
              ],
              type: { value: "", matchLevel: "none", matchedWords: [] },
            },
          },
        ],
        nbHits: 705,
        page: 0,
        nbPages: 235,
        hitsPerPage: 3,
        exhaustiveNbHits: true,
        query: "fire ",
        queryAfterRemoval: "fire ",
        params:
          "highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=3&query=fire%20&page=0&facets=%5B%5D&tagFilters=",
        index: "instant_search",
        processingTimeMS: 2,
      },
    ],
  };

  return {
    "hits":[
      {
        "condition":{
          "pattern":"smartphone",
          "anchoring":"contains"
        },
        "consequence":{
          "params":{
            "filters":"category = 1"
          }
        },
        "objectID":"a-rule-id",
        "_highlightResult":{
          "condition":{
            "pattern":{
              "value":"<b>s<\/b>martphone",
              "matchLevel":"full",
              "fullyHighlighted":false,
              "matchedWords":[
                "s"
              ]
            },
            "anchoring":{
              "value":"contains",
              "matchLevel":"none",
              "matchedWords":[

              ]
            }
          },
          "consequence":{
            "params":{
              "filters":{
                "value":"category = 1",
                "matchLevel":"none",
                "matchedWords":[

                ]
              }
            }
          }
        }
      }
    ],
    "nbHits":1,
    "page":0,
    "nbPages":1
  };
};

var hitExample = {
  "name":"title one","alternative_titles":["alternative title 1"], "image":"https://image.tmdb.org/t/p/w154/eVP2IJCWmvb6lZRlyFFcFavBKvU.jpg","score":7.448484848484849,"rating":4,"actors":[],"actor_facets":[],"genre":["Crime"],"objectID":"439585470",
  "_highlightResult": {
    "name": {
      "value": "Dear <em>Z</em>achary: A Letter to a Son About His Father","matchLevel":"full","fullyHighlighted":false,"matchedWords":["z"]
    },
    "year":{
      "value":"2008","matchLevel":"none","matchedWords":[]
    }
  }
};

/**
 * Reload is just a paired down version of Flatdoc with some additional
 * features, and many features removed.
 *
 * This version of flatdoc can run in three modes:
 *
 * Main entrypoint script include (when included from an index.html or
 * foo.html).
 *
 *     <script start src="pathto/Reload.js"></script>
 *
 * Included in a name.md.html markdown document or name.styl.html Stylus
 * document at the start of file
 *
 *     <script src="pathto/Reload.js"></script>
 *     # Rest of markdown here
 *     - regular markdown
 *     - regular markdown
 *
 * or:
 *
 *     <script src="pathto/Reload.js"></script>
 *     Rest of .styl document here:
 *
 * As a node script which will bundle your page into a single file assuming you've run npm install.
 */

/**
 * Since we use one simple script for everything, we need to detect how it's
 * being used. If not a node script, it could be included form the main html
 * page, or from a docs/stylus page. The main script tag in the main page will
 * be run at a point where there's no body in the document. For doc pages
 * (markdown/stylus) it will have a script tag at the top which implicitly
 * defines a body.
 */
function detectDocOrStyleIfNotNodeScript() {
  var hasParentFrame = window.parent !== window;
  var hasBody = document.body !== null;
  return hasParentFrame || hasBody;
};

/**
 * Here's the order of events that occur when using the local file system at least:
 * 1. body DOMContentLoaded
 * 2. body onload event
 * 3. settimeout 0 handler.
 */
if(typeof process !== 'undefined') {
  if(process.argv && process.argv.length > 2 && process.argv[2] === 'bundle') {
    var fs = require('fs');
    var path = require('path');
    var Inliner = require('inliner');


    var siteDir = __dirname;

    var pathToChrome =
      process.platform === 'win32' ?
      path.join(require('process').env['LOCALAPPDATA'], 'Google', 'Chrome', 'Application', 'chrome.exe') :
      '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome';

    var cmd = pathToChrome + " " + path.join(siteDir, "index.dev.html") + ' --headless --dump-dom --virtual-time-budget=400';
    var rendered = require('child_process').execSync(cmd).toString();

    var renderedHtmlPath = path.join(siteDir, 'index.rendered.html');
    var indexHtmlPath = path.join(siteDir, 'index.html');
    fs.writeFileSync(renderedHtmlPath, rendered);

    console.log("INLINING PAGE: ", indexHtmlPath);

    var options = {
      /* Make sure you have this set to true to avoid flickering jumps */
      images: true,
      compressCSS: true,
      compressJS: true,
      // If true, will mess with hljs.
      collapseWhitespace: false,
      nosvg: true, // by default, DO compress SVG with SVGO
      skipAbsoluteUrls: false,
      preserveComments: false,
      iesafe: false,
    };

    new Inliner(renderedHtmlPath, options, function (error, html) {
      // compressed and inlined HTML page
      // console.log(html);
      if(error) {
        console.error(e);
        process.exit(1);
      }
      fs.writeFileSync(indexHtmlPath, html)
      process.exit(0);
    });
  }
}

/**
 * How Github decides to render previews as markdown:
 * https://github.com/github/markup/issues/1069#issuecomment-306084234
 *
 * This comment says you can force your file to be rendered as markdown in
 * github a couple of ways: A vim region, or a gitattributes but gitattributes
 * isn't working.
 * Abusing the Vim mode:
 * <!-- vim: syntax=Markdown -->
 * Abusing the Emacs mode:
 * <!--*- mode: markdown -*-->
 * (note that emacs mode is determined by the `-*- mode: markdown; -*-` It just fits nicely
 * with the html comment *)
 * https://github.com/github/markup/issues/1069#issuecomment-460056003
 *
 * Supposedly, Chrome is supposed to detect html files on local disk by
 * sniffing some tags.  but it doesn't appear to work.
 * Chromium mime type sniffing:
 *  https://source.chromium.org/chromium/chromium/src/+/master:net/base/mime_sniffer.cc;drc=faa13f8c8516dd027f5fc5a6ba984099ff330d05;l=781?originalUrl=https:%2F%2Fcs.chromium.org%2Fchromium%2Fsrc%2Fnet%2Fbase%2Fmime_sniffer.cc
 *  https://source.chromium.org/chromium/chromium/src/+/master:net/base/mime_sniffer.cc;l=795?originalUrl=https:%2F%2Fcs.chromium.org%2Fchromium%2Fsrc%2Fnet%2Fbase%2Fmime_sniffer.cc
 *  SniffForHTML:
 *  https://source.chromium.org/chromium/chromium/src/+/master:net/base/mime_sniffer.cc;drc=c12f7a008d7096c48d0c4db36c6d6edbc71700fb;l=381?originalUrl=https:%2F%2Fcs.chromium.org%2Fchromium%2Fsrc%2Fnet%2Fbase%2Fmime_sniffer.cc
 *
 * A trick to create markdown comments that don't render in Github:
 * http://alvinalexander.com/technology/markdown-comments-syntax-not-in-generated-output/
 * (Suggestion, use the # form and make sure there's a line before it)
 * https://stackoverflow.com/questions/4823468/comments-in-markdown
 *
 * <!--*- mode: markdown -*-->
 * This doesn't work because it needs spaces around the [] for ft detection to
 * kick in on Github:
 * [vim: syntax=Markdown]: # (<script src="./flatdoc.js"></script>)
 * This works!
 * [ vim:syntax=Markdown ]: # (<script src="./flatdoc.js"></script>)
 * But this does!
 * [-*-mode:markdown-*-]: # (<script src="./flatdoc.js"> </script>)
 *
 * Another supposed way to write comments in markdown is:
 * [this is a comment]::
 * So this works for injecting the script tag and getting Github to render it
 * as a markdown file:
 * [<script src="./flatdoc.js"> </script>]:-*-mode:markdown-*-:
 * However with that last approach, there's much more to clean up in the output
 * on Flatdoc's side.
 *
 * This approach is the cleanest and only has us searching for / cleaning up a
 * single `)` closing paren before Flatdoc renders the markup.
 *
 *     [ vim:syntax=Markdown ]: # (<script src="flatdoc.js"></script>)
 *
 */
else if(
    document.location.href.indexOf('.md') === document.location.href.length - 2  ||
    document.location.href.indexOf('.md.html') === document.location.href.length - 8  ||
    document.location.href.indexOf('.styl.html') === document.location.href.length - 10 ||
    document.location.href.indexOf('.md.htm') === document.location.href.length - 7  ||
    document.location.href.indexOf('.styl.htm') === document.location.href.length - 9 ||
    detectDocOrStyleIfNotNodeScript()
) {
  document.write('<plaintext>');
  document.addEventListener("DOMContentLoaded", function() {
    var plaintexts = document.querySelectorAll('plaintext');
    if(plaintexts.length === 1) {
      window.parent.postMessage({
        messageType: 'docPageContent' ,
        iframeName: window.name,
        content: plaintexts[0].innerHTML
      }, "*");
    } else {
      window.parent.postMessage({
        messageType: "docPageError",
        iframeName: window.name,
        error: "There isn't exactly one plaintext tag inside of " + window.name +
        ". Something went wrong and we didn't inject the plaintext tag."
      }, "*");
    }
  });
} else {
(function($) {
  var exports = this;

  var marked;

  /**
   * Basic Flatdoc module.
   *
   * The main entry point is `Flatdoc.run()`, which invokes the [Runner].
   *
   *     Flatdoc.run({
   *       fetcher: Flatdoc.github('rstacruz/backbone-patterns');
   *     });
   *
   * These fetcher functions are available:
   *
   *     Flatdoc.github('owner/repo')
   *     Flatdoc.github('owner/repo', 'API.md')
   *     Flatdoc.github('owner/repo', 'API.md', 'branch')
   *     Flatdoc.bitbucket('owner/repo')
   *     Flatdoc.bitbucket('owner/repo', 'API.md')
   *     Flatdoc.bitbucket('owner/repo', 'API.md', 'branch')
   *     Flatdoc.file('http://path/to/url')
   *     Flatdoc.file([ 'http://path/to/url', ... ])
   */

  var Flatdoc = exports.Flatdoc = {};
  exports.Reload = exports.Flatdoc;

  /**
   * Creates a runner.
   * See [Flatdoc].
   */
  Flatdoc.run = function(options) {
    $(function() { (new Flatdoc.runner(options)).run(); });
  };
  
  /**
   * Simplified easy to use API that calls the underlying API.
   */
  Flatdoc.reload = function(options) {
    var actualOptions = {};
    if(options.stylus) {
      actualOptions.stylusFetcher = Flatdoc.docPage(options.stylus);
    }
    if(options.doc) {
      actualOptions.fetcher = Reload.docPage(options.doc);
    }
    if(options.highlight) {
      actualOptions.highlight = options.highlight;
    }
    Flatdoc.run(actualOptions);
  };


  /**
   * File fetcher function.
   *
   * Fetches a given `url` via AJAX.
   * See [Runner#run()] for a description of fetcher functions.
   */

  Flatdoc.file = function(url) {
    function loadData(locations, response, callback) {
      if (locations.length === 0) callback(null, response);

      else $.get(locations.shift())
        .fail(function(e) {
          callback(e, null);
        })
        .done(function (data) {
          if (response.length > 0) response += '\n\n';
          response += data;
          loadData(locations, response, callback);
        });
    }

    return function(callback) {
      loadData(url instanceof Array ?
        url : [url], '', callback);
    };
  };

  /**
   * Local docPage doc fetcher function.
   *
   * Fetches a given `url` via iframe inclusion, expecting the file to be of
   * the "docPage" form of markdown which can be loaded offline.
   * See [Runner#run()] for a description of fetcher functions.
   *
   * Tags the url argument on the fetcher itself so it can be used for other
   * debugging/relativization.
   */

  Flatdoc.docPageErrorHandler = null;

  Flatdoc.docPage = function(url) {
    if (!Flatdoc.errorHandler) {
      var listenerID = window.addEventListener('message', function(e) {
        if (e.data.messageType === 'docPageError') {
          console.error(e.data.error);
        }
      });
      Flatdoc.docPageErrorHandler = listenerID;
    }
    var fetchdocPage = function(url) {
      var onDone = null;
      var onFail = null;
      var returns = {
        fail: function(cb) {
          onFail = cb;
          return returns;
        },
        done: function(cb) {
          onDone = cb;
          return returns;
        }
      };
      var timeout = window.setTimeout(function() {
        onFail && onFail(
          "Timed out loading " + url +
          ". It might still load if the request comes back, " +
          "but this took super long. Maybe you are paused in the debugger?"
        );
      }, 400);
      var listenerID = window.addEventListener('message', function(e) {
        if(e.data.messageType === 'docPageContent' && e.data.iframeName === url) {
          window.removeEventListener('message', listenerID);
          if(onDone) {
            window.clearTimeout(timeout);
            onDone(e.data.content);
          }
        }
      });
      var iframe = document.createElement('iframe');
      iframe.name = url;
      // Themes may opt to handle offline/pre rendering, and this is convenient
      // to mark these iframes as not-essential once rendered so they may be
      // removed from the DOM after rendering, and won't take up space in the
      // bundle.
      iframe.className = 'removeFromRenderedPage';
      iframe.src=url;
      iframe.style="display:none !important";
      iframe.type="text/plain";
      iframe.onerror = function(e) {
        if(onFail) {
          onFail(e);
        }
      };
      // iframe.onload = function(e) {
      // };
      document.body.appendChild(iframe);
      // Even if using the local file system, this will immediately resume
      // after appending without waiting or blocking.  There is no way to tell
      // that an iframe has loaded successfully without some kind of a timeout.
      // Even bad src locations will fire the onload event. An onerror event is
      // a solid signal that the page failed, but abscense of an onerror on the
      // iframe is not a confirmation of success or that it hasn't failed.
      return returns;
    };
    function loadData(locations, response, callback) {
      if (locations.length === 0) callback(null, response);
      else fetchdocPage(locations.shift())
        .fail(function(e) {
          callback(e, null);
        })
        .done(function (data) {
          if (response.length > 0) response += '\n\n';
          response += data;
          loadData(locations, response, callback);
        });
    }

    var url = url instanceof Array ? url : [url];
    var ret = function(callback) {
      loadData(url, '', callback);
    };
      // Tag the fetcher with the url in case you want it.
    ret.url = url;
    return ret;
  };

  /**
   * Github fetcher.
   * Fetches from repo `repo` (in format 'user/repo').
   *
   * If the parameter `filepath` is supplied, it fetches the contents of that
   * given file in the repo's default branch. To fetch the contents of
   * `filepath` from a different branch, the parameter `ref` should be
   * supplied with the target branch name.
   *
   * See [Runner#run()] for a description of fetcher functions.
   *
   * See: http://developer.github.com/v3/repos/contents/
   */
  Flatdoc.github = function(opts) {
    if (typeof opts === 'string') {
      opts = {
        repo: arguments[0],
        filepath: arguments[1]
      };
    }
    var url;
    if (opts.filepath) {
      url = 'https://api.github.com/repos/'+opts.repo+'/contents/'+opts.filepath;
    } else {
      url = 'https://api.github.com/repos/'+opts.repo+'/readme';
    }
    var data = {};
    if (opts.token) {
      data.access_token = opts.token;
    }
    if (opts.ref) {
      data.ref = opts.ref;
    }
    return function(callback) {
      $.get(url, data)
        .fail(function(e) { callback(e, null); })
        .done(function(data) {
          var markdown = exports.Base64.decode(data.content);
          callback(null, markdown);
        });
    };
  };

  /**
   * Bitbucket fetcher.
   * Fetches from repo `repo` (in format 'user/repo').
   *
   * If the parameter `filepath` is supplied, it fetches the contents of that
   * given file in the repo.
   *
   * See [Runner#run()] for a description of fetcher functions.
   *
   * See: https://confluence.atlassian.com/display/BITBUCKET/src+Resources#srcResources-GETrawcontentofanindividualfile
   * See: http://ben.onfabrik.com/posts/embed-bitbucket-source-code-on-your-website
   * Bitbucket appears to have stricter restrictions on
   * Access-Control-Allow-Origin, and so the method here is a bit
   * more complicated than for Github
   *
   * If you don't pass a branch name, then 'default' for Hg repos is assumed
   * For git, you should pass 'master'. In both cases, you should also be able
   * to pass in a revision number here -- in Mercurial, this also includes
   * things like 'tip' or the repo-local integer revision number
   * Default to Mercurial because Git users historically tend to use GitHub
   */
  Flatdoc.bitbucket = function(opts) {
    if (typeof opts === 'string') {
      opts = {
        repo: arguments[0],
        filepath: arguments[1],
        branch: arguments[2]
      };
    }
    if (!opts.filepath) opts.filepath = 'readme.md';
    if (!opts.branch) opts.branch = 'default';

    var url = 'https://bitbucket.org/api/1.0/repositories/'+opts.repo+'/src/'+opts.branch+'/'+opts.filepath;

   return function(callback) {
     $.ajax({
      url: url,
      dataType: 'jsonp',
      error: function(xhr, status, error) {
        alert(error);
      },
      success: function(response) {
        var markdown = response.data;
        callback(null, markdown);
      }
  });
};
};

  /**
   * Parser module.
   * Parses a given Markdown document and returns a JSON object with data
   * on the Markdown document.
   *
   *     var data = Flatdoc.parser.parse('markdown source here');
   *     console.log(data);
   *
   *     data == {
   *       title: 'My Project',
   *       content: '<p>This project is a...',
   *       menu: {...}
   *     }
   */

  var Parser = Flatdoc.parser = {};

  /**
   * Parses a given Markdown document.
   * See `Parser` for more info.
   */
  Parser.parse = function(source, highlight) {
    marked = exports.marked;

    Parser.setMarkedOptions(highlight);

    var html = $("<div>" + marked(source));
    var h1 = html.find('h1').eq(0);
    var title = h1.text();

    // Mangle content
    Transformer.mangle(html);
    var menu = Transformer.getMenu(html);

    return { title: title, content: html, menu: menu };
  };

  Parser.setMarkedOptions = function(highlight) {
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang) {
          return highlight(code, lang);
        }
        return code;
      }
    });
  };

  /**
   * Transformer module.
   * This takes care of any HTML mangling needed.  The main entry point is
   * `.mangle()` which applies all transformations needed.
   *
   *     var $content = $("<p>Hello there, this is a docu...");
   *     Flatdoc.transformer.mangle($content);
   *
   * If you would like to change any of the transformations, decorate any of
   * the functions in `Flatdoc.transformer`.
   */

  var Transformer = Flatdoc.transformer = {};

  /**
   * Takes a given HTML `$content` and improves the markup of it by executing
   * the transformations.
   *
   * > See: [Transformer](#transformer)
   */
  Transformer.mangle = function($content) {
    this.addIDs($content);
    this.buttonize($content);
    this.smartquotes($content);
  };

  /**
   * Adds IDs to headings.
   */

  Transformer.addIDs = function($content) {
    var slugs = ['', '', ''];
    $content.find('h1, h2, h3').each(function() {
      var $el = $(this);
      var num = parseInt(this.nodeName[1]);
      var text = $el.text();
      var slug = Flatdoc.slugify(text);
      if (num > 1) slug = slugs[num - 2] + '-' + slug;
      slugs.length = num - 1;
      slugs = slugs.concat([slug, slug]);
      $el.attr('id', slug);
    });
  };

  /**
   * Returns menu data for a given HTML.
   *
   *     menu = Flatdoc.transformer.getMenu($content);
   *     menu == {
   *       level: 0,
   *       items: [{
   *         section: "Getting started",
   *         level: 1,
   *         items: [...]}, ...]}
   */

  Transformer.getMenu = function($content) {
    var root = {items: [], id: '', level: 0};
    var cache = [root];

    function mkdir_p(level) {
      cache.length = level + 1;
      var obj = cache[level];
      if (!obj) {
        var parent = (level > 1) ? mkdir_p(level-1) : root;
        obj = { items: [], level: level };
        cache = cache.concat([obj, obj]);
        parent.items.push(obj);
      }
      return obj;
    }

    $content.find('h1, h2, h3').each(function() {
      var $el = $(this);
      var level = +(this.nodeName.substr(1));

      var parent = mkdir_p(level-1);

      var obj = { section: $el.text(), items: [], level: level, id: $el.attr('id') };
      parent.items.push(obj);
      cache[level] = obj;
    });

    return root;
  };

  /**
   * Changes "button >" text to buttons.
   */

  Transformer.buttonize = function($content) {
    $content.find('a').each(function() {
      var $a = $(this);

      var m = $a.text().match(/^(.*) >$/);
      if (m) $a.text(m[1]).addClass('button');
    });
  };

  /**
   * Applies smart quotes to a given element.
   * It leaves `code` and `pre` blocks alone.
   */

  Transformer.smartquotes = function ($content) {
    var nodes = getTextNodesIn($content), len = nodes.length;
    for (var i=0; i<len; i++) {
      var node = nodes[i];
      node.nodeValue = quotify(node.nodeValue);
    }
  };

  /**
   * Syntax highlighters.
   *
   * You may add or change more highlighters via the `Flatdoc.highlighters`
   * object.
   *
   *     Flatdoc.highlighters.js = function(code) {
   *     };
   *
   * Each of these functions
   */

  var Highlighters = Flatdoc.highlighters = {};

  /**
   * JavaScript syntax highlighter.
   *
   * Thanks @visionmedia!
   */

  Highlighters.js = Highlighters.javascript = function(code) {
    return code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("[^\"]*?")/g, '<span class="string">$1</span>')
      .replace(/('[^\']*?')/g, '<span class="string">$1</span>')
      .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
      .replace(/\/\*(.*)\*\//gm, '<span class="comment">/*$1*/</span>')
      .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
      .replace(/(\d+)/gm, '<span class="number">$1</span>')
      .replace(/\bnew *(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
      .replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>');
  };

  Highlighters.html = function(code) {
    return code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("[^\"]*?")/g, '<span class="string">$1</span>')
      .replace(/('[^\']*?')/g, '<span class="string">$1</span>')
      .replace(/&lt;!--(.*)--&gt;/g, '<span class="comment">&lt;!--$1--&gt;</span>')
      .replace(/&lt;([^!][^\s&]*)/g, '&lt;<span class="keyword">$1</span>');
  };

  Highlighters.generic = function(code) {
    return code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("[^\"]*?")/g, '<span class="string">$1</span>')
      .replace(/('[^\']*?')/g, '<span class="string">$1</span>')
      .replace(/(\/\/|#)(.*)/gm, '<span class="comment">$1$2</span>')
      .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
      .replace(/(\d+)/gm, '<span class="number">$1</span>');
  };

  /**
   * Menu view. Renders menus
   */

  var MenuView = Flatdoc.menuView = function(menu) {
    var $el = $("<ul>");

    function process(node, $parent) {
      var id = node.id || 'root';

      var $li = $('<li>')
        .attr('id', id + '-item')
        .addClass('level-' + node.level)
        .appendTo($parent);

      if (node.section) {
        var $a = $('<a>')
          .html(node.section)
          .attr('id', id + '-link')
          .attr('href', '#' + node.id)
          .addClass('level-' + node.level)
          .appendTo($li);
      }

      if (node.items.length > 0) {
        var $ul = $('<ul>')
          .addClass('level-' + (node.level+1))
          .attr('id', id + '-list')
          .appendTo($li);

        node.items.forEach(function(item) {
          process(item, $ul);
        });
      }
    }

    process(menu, $el);
    return $el;
  };

  /**
   * A runner module that fetches via a `fetcher` function.
   *
   *     var runner = new Flatdoc.runner({
   *       fetcher: Flatdoc.url('readme.txt')
   *     });
   *     runner.run();
   *
   * The following options are available:
   *
   *  - `fetcher` - a function that takes a callback as an argument and
   *    executes that callback when data is returned.
   *
   * See: [Flatdoc.run()]
   */

  var Runner = Flatdoc.runner = function(options) {
    this.initialize(options);
  };

  Runner.prototype.root    = '[role~="flatdoc"]';
  Runner.prototype.menu    = '[role~="flatdoc-menu"]';
  Runner.prototype.title   = '[role~="flatdoc-title"]';
  Runner.prototype.content = '[role~="flatdoc-content"]';

  Runner.prototype.initialize = function(options) {
    $.extend(this, options);
  };

  /**
   * Syntax highlighting.
   *
   * You may define a custom highlight function such as `highlight` from
   * the highlight.js library.
   *
   *     Flatdoc.run({
   *       highlight: function (code, value) {
   *         return hljs.highlight(lang, code).value;
   *       },
   *       ...
   *     });
   *
   */

  Runner.prototype.highlight = function(code, lang) {
    var fn = Flatdoc.highlighters[lang] || Flatdoc.highlighters.generic;
    return fn(code);
  };

  /**
   * Loads the Markdown document (via the fetcher), parses it, and applies it
   * to the elements.
   */

  Runner.prototype.run = function() {
    var doc = this;
    $(doc.root).trigger('flatdoc:loading');
    // If this *is* an already rendered snapshot, then no need to render
    // anything. Just fire off the ready events so that hacky jquery code can
    // perform resizing etc.
    if(window.location.pathname.indexOf('.dev.html') !== (window.location.pathname.length - '.dev.html'.length)) {
      $(doc.root).trigger('flatdoc:style-ready');
      $(doc.root).trigger('flatdoc:ready');
      return;
    }
    var fetchedStylus = false;
    var stylus = false;
    var fetchedMarkdown = false;
    var markdown = null;
    function checkDone() {
      if(fetchedStylus && fetchedMarkdown) {
        var styleCss = null;
        if(stylus) {
          window.stylus.render(stylus, function(err, result) {
            if(err) {
              console.error('Stylus error:' + err.message);
              throw err;
            } else {
              styleCss = result;
            }
          });
          var style = document.createElement('style');
          style.type = 'text/css';
          style.name = 'style generated from .styl.html file';
          style.innerHTML = styleCss;
          document.getElementsByTagName('head')[0].appendChild(style);
        }
        $(doc.root).trigger('flatdoc:style-ready');
        /**
         * The user can put this in their html file to:
         * 1. Get vim syntax highlighting to work.
         * 2. Get github to treat their html/htm file as a markdown file for rendering.
         * 3. Load the script tag only when rendered with ReFresh.
         *
         * [ vim:syntax=Markdown ]: # (<script src="flatdoc.js"></script>)
         *
         * Only downside is that it leaves a dangling ) in the text returned to
         * us which we can easily normalize.
         */
        if(markdown[0] === ')' && markdown[1] === '\n') {
          markdown = markdown.substring(2);
        }
        var data = Flatdoc.parser.parse(markdown, doc.highlight);
        doc.applyData(data, doc);
        var id = location.hash.substr(1);
        if (id) {
          var el = document.getElementById(id);
          if (el) el.scrollIntoView(true);
        }
        $(doc.root).trigger('flatdoc:ready');
      }
    };
    if(doc.stylusFetcher) {
      doc.stylusFetcher(function(err, st) { // Will run sync
        if (err) {
          console.error('[Flatdoc] fetching Stylus data failed.', err);
          return;
        }
        fetchedStylus = true;
        stylus = st;
        checkDone();
      });
    } else {
      fetchedStylus = true;
    }
    doc.fetcher(function(err, md) {
      if (err) {
        console.error('[Flatdoc] fetching Markdown data failed.', err);
        return;
      }
      fetchedMarkdown = true;
      markdown = md;
      checkDone();
    });
  };

  /**
   * Applies given doc data `data` to elements in object `elements`.
   */

  Runner.prototype.applyData = function(data) {
    var elements = this;
    elements.el('title').html(data.title);
    elements.el('content').html(data.content.find('>*'));
    elements.el('menu').html(MenuView(data.menu));
  };

  /**
   * Fetches a given element from the DOM.
   *
   * Returns a jQuery object.
   * @api private
   */

  Runner.prototype.el = function(aspect) {
    return $(this[aspect], this.root);
  };

  /*
   * Helpers
   */

  // http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
  function getTextNodesIn(el) {
    var exclude = 'iframe,pre,code';
    return $(el).find(':not('+exclude+')').andSelf().contents().filter(function() {
      return this.nodeType == 3 && $(this).closest(exclude).length === 0;
    });
  }

  // http://www.leancrew.com/all-this/2010/11/smart-quotes-in-javascript/
  function quotify(a) {
    a = a.replace(/(^|[\-\u2014\s(\["])'/g, "$1\u2018");        // opening singles
    a = a.replace(/'/g, "\u2019");                              // closing singles & apostrophes
    a = a.replace(/(^|[\-\u2014\/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
    a = a.replace(/"/g, "\u201d");                              // closing doubles
    a = a.replace(/\.\.\./g, "\u2026");                         // ellipses
    a = a.replace(/--/g, "\u2014");                             // em-dashes
    return a;
  }

})(jQuery);

/* jshint ignore:start */

/*!
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

(function(){var t={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:o,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:o,lheading:/^([^\n]+)\n *(=|-){3,} *\n*/,blockquote:/^( *>[^\n]+(\n[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:o,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};t.bullet=/(?:[*+-]|\d+\.)/;t.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;t.item=l(t.item,"gm")(/bull/g,t.bullet)();t.list=l(t.list)(/bull/g,t.bullet)("hr",/\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)();t._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b";t.html=l(t.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,t._tag)();t.paragraph=l(t.paragraph)("hr",t.hr)("heading",t.heading)("lheading",t.lheading)("blockquote",t.blockquote)("tag","<"+t._tag)("def",t.def)();t.normal=h({},t);t.gfm=h({},t.normal,{fences:/^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,paragraph:/^/});t.gfm.paragraph=l(t.paragraph)("(?!","(?!"+t.gfm.fences.source.replace("\\1","\\2")+"|")();t.tables=h({},t.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function e(e){this.tokens=[];this.tokens.links={};this.options=e||a.defaults;this.rules=t.normal;if(this.options.gfm){if(this.options.tables){this.rules=t.tables}else{this.rules=t.gfm}}}e.rules=t;e.lex=function(t,n){var s=new e(n);return s.lex(t)};e.prototype.lex=function(t){t=t.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(t,true)};e.prototype.token=function(e,n){var e=e.replace(/^ +$/gm,""),s,i,r,l,o,h,a,u,p;while(e){if(r=this.rules.newline.exec(e)){e=e.substring(r[0].length);if(r[0].length>1){this.tokens.push({type:"space"})}}if(r=this.rules.code.exec(e)){e=e.substring(r[0].length);r=r[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?r.replace(/\n+$/,""):r});continue}if(r=this.rules.fences.exec(e)){e=e.substring(r[0].length);this.tokens.push({type:"code",lang:r[2],text:r[3]});continue}if(r=this.rules.heading.exec(e)){e=e.substring(r[0].length);this.tokens.push({type:"heading",depth:r[1].length,text:r[2]});continue}if(n&&(r=this.rules.nptable.exec(e))){e=e.substring(r[0].length);h={type:"table",header:r[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:r[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:r[3].replace(/\n$/,"").split("\n")};for(u=0;u<h.align.length;u++){if(/^ *-+: *$/.test(h.align[u])){h.align[u]="right"}else if(/^ *:-+: *$/.test(h.align[u])){h.align[u]="center"}else if(/^ *:-+ *$/.test(h.align[u])){h.align[u]="left"}else{h.align[u]=null}}for(u=0;u<h.cells.length;u++){h.cells[u]=h.cells[u].split(/ *\| */)}this.tokens.push(h);continue}if(r=this.rules.lheading.exec(e)){e=e.substring(r[0].length);this.tokens.push({type:"heading",depth:r[2]==="="?1:2,text:r[1]});continue}if(r=this.rules.hr.exec(e)){e=e.substring(r[0].length);this.tokens.push({type:"hr"});continue}if(r=this.rules.blockquote.exec(e)){e=e.substring(r[0].length);this.tokens.push({type:"blockquote_start"});r=r[0].replace(/^ *> ?/gm,"");this.token(r,n);this.tokens.push({type:"blockquote_end"});continue}if(r=this.rules.list.exec(e)){e=e.substring(r[0].length);l=r[2];this.tokens.push({type:"list_start",ordered:l.length>1});r=r[0].match(this.rules.item);s=false;p=r.length;u=0;for(;u<p;u++){h=r[u];a=h.length;h=h.replace(/^ *([*+-]|\d+\.) +/,"");if(~h.indexOf("\n ")){a-=h.length;h=!this.options.pedantic?h.replace(new RegExp("^ {1,"+a+"}","gm"),""):h.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&u!==p-1){o=t.bullet.exec(r[u+1])[0];if(l!==o&&!(l.length>1&&o.length>1)){e=r.slice(u+1).join("\n")+e;u=p-1}}i=s||/\n\n(?!\s*$)/.test(h);if(u!==p-1){s=h[h.length-1]==="\n";if(!i)i=s}this.tokens.push({type:i?"loose_item_start":"list_item_start"});this.token(h,false);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(r=this.rules.html.exec(e)){e=e.substring(r[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:r[1]==="pre"||r[1]==="script",text:r[0]});continue}if(n&&(r=this.rules.def.exec(e))){e=e.substring(r[0].length);this.tokens.links[r[1].toLowerCase()]={href:r[2],title:r[3]};continue}if(n&&(r=this.rules.table.exec(e))){e=e.substring(r[0].length);h={type:"table",header:r[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:r[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:r[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(u=0;u<h.align.length;u++){if(/^ *-+: *$/.test(h.align[u])){h.align[u]="right"}else if(/^ *:-+: *$/.test(h.align[u])){h.align[u]="center"}else if(/^ *:-+ *$/.test(h.align[u])){h.align[u]="left"}else{h.align[u]=null}}for(u=0;u<h.cells.length;u++){h.cells[u]=h.cells[u].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(h);continue}if(n&&(r=this.rules.paragraph.exec(e))){e=e.substring(r[0].length);this.tokens.push({type:"paragraph",text:r[1][r[1].length-1]==="\n"?r[1].slice(0,-1):r[1]});continue}if(r=this.rules.text.exec(e)){e=e.substring(r[0].length);this.tokens.push({type:"text",text:r[0]});continue}if(e){throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}}return this.tokens};var n={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:o,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:o,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};n._inside=/(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/;n._href=/\s*<?([^\s]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;n.link=l(n.link)("inside",n._inside)("href",n._href)();n.reflink=l(n.reflink)("inside",n._inside)();n.normal=h({},n);n.pedantic=h({},n.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});n.gfm=h({},n.normal,{escape:l(n.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:l(n.text)("]|","~]|")("|","|https?://|")()});n.breaks=h({},n.gfm,{br:l(n.br)("{2,}","*")(),text:l(n.gfm.text)("{2,}","*")()});function s(t,e){this.options=e||a.defaults;this.links=t;this.rules=n.normal;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=n.breaks}else{this.rules=n.gfm}}else if(this.options.pedantic){this.rules=n.pedantic}}s.rules=n;s.output=function(t,e,n){var i=new s(e,n);return i.output(t)};s.prototype.output=function(t){var e="",n,s,i,l;while(t){if(l=this.rules.escape.exec(t)){t=t.substring(l[0].length);e+=l[1];continue}if(l=this.rules.autolink.exec(t)){t=t.substring(l[0].length);if(l[2]==="@"){s=l[1][6]===":"?this.mangle(l[1].substring(7)):this.mangle(l[1]);i=this.mangle("mailto:")+s}else{s=r(l[1]);i=s}e+='<a href="'+i+'">'+s+"</a>";continue}if(l=this.rules.url.exec(t)){t=t.substring(l[0].length);s=r(l[1]);i=s;e+='<a href="'+i+'">'+s+"</a>";continue}if(l=this.rules.tag.exec(t)){t=t.substring(l[0].length);e+=this.options.sanitize?r(l[0]):l[0];continue}if(l=this.rules.link.exec(t)){t=t.substring(l[0].length);e+=this.outputLink(l,{href:l[2],title:l[3]});continue}if((l=this.rules.reflink.exec(t))||(l=this.rules.nolink.exec(t))){t=t.substring(l[0].length);n=(l[2]||l[1]).replace(/\s+/g," ");n=this.links[n.toLowerCase()];if(!n||!n.href){e+=l[0][0];t=l[0].substring(1)+t;continue}e+=this.outputLink(l,n);continue}if(l=this.rules.strong.exec(t)){t=t.substring(l[0].length);e+="<strong>"+this.output(l[2]||l[1])+"</strong>";continue}if(l=this.rules.em.exec(t)){t=t.substring(l[0].length);e+="<em>"+this.output(l[2]||l[1])+"</em>";continue}if(l=this.rules.code.exec(t)){t=t.substring(l[0].length);e+="<code>"+r(l[2],true)+"</code>";continue}if(l=this.rules.br.exec(t)){t=t.substring(l[0].length);e+="<br>";continue}if(l=this.rules.del.exec(t)){t=t.substring(l[0].length);e+="<del>"+this.output(l[1])+"</del>";continue}if(l=this.rules.text.exec(t)){t=t.substring(l[0].length);e+=r(l[0]);continue}if(t){throw new Error("Infinite loop on byte: "+t.charCodeAt(0))}}return e};s.prototype.outputLink=function(t,e){if(t[0][0]!=="!"){return'<a href="'+r(e.href)+'"'+(e.title?' title="'+r(e.title)+'"':"")+">"+this.output(t[1])+"</a>"}else{return'<img src="'+r(e.href)+'" alt="'+r(t[1])+'"'+(e.title?' title="'+r(e.title)+'"':"")+">"}};s.prototype.smartypants=function(t){if(!this.options.smartypants)return t;return t.replace(/--/g,"—").replace(/'([^']*)'/g,"‘$1’").replace(/"([^"]*)"/g,"“$1”").replace(/\.{3}/g,"…")};s.prototype.mangle=function(t){var e="",n=t.length,s=0,i;for(;s<n;s++){i=t.charCodeAt(s);if(Math.random()>.5){i="x"+i.toString(16)}e+="&#"+i+";"}return e};function i(t){this.tokens=[];this.token=null;this.options=t||a.defaults}i.parse=function(t,e){var n=new i(e);return n.parse(t)};i.prototype.parse=function(t){this.inline=new s(t.links,this.options);this.tokens=t.reverse();var e="";while(this.next()){e+=this.tok()}return e};i.prototype.next=function(){return this.token=this.tokens.pop()};i.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};i.prototype.parseText=function(){var t=this.token.text;while(this.peek().type==="text"){t+="\n"+this.next().text}return this.inline.output(t)};i.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return"<hr>\n"}case"heading":{return"<h"+this.token.depth+">"+this.inline.output(this.token.text)+"</h"+this.token.depth+">\n"}case"code":{if(this.options.highlight){var t=this.options.highlight(this.token.text,this.token.lang);if(t!=null&&t!==this.token.text){this.token.escaped=true;this.token.text=t}}if(!this.token.escaped){this.token.text=r(this.token.text,true)}return"<pre><code"+(this.token.lang?' class="'+this.options.langPrefix+this.token.lang+'"':"")+">"+this.token.text+"</code></pre>\n"}case"table":{var e="",n,s,i,l,o;e+="<thead>\n<tr>\n";for(s=0;s<this.token.header.length;s++){n=this.inline.output(this.token.header[s]);e+=this.token.align[s]?'<th align="'+this.token.align[s]+'">'+n+"</th>\n":"<th>"+n+"</th>\n"}e+="</tr>\n</thead>\n";e+="<tbody>\n";for(s=0;s<this.token.cells.length;s++){i=this.token.cells[s];e+="<tr>\n";for(o=0;o<i.length;o++){l=this.inline.output(i[o]);e+=this.token.align[o]?'<td align="'+this.token.align[o]+'">'+l+"</td>\n":"<td>"+l+"</td>\n"}e+="</tr>\n"}e+="</tbody>\n";return"<table>\n"+e+"</table>\n"}case"blockquote_start":{var e="";while(this.next().type!=="blockquote_end"){e+=this.tok()}return"<blockquote>\n"+e+"</blockquote>\n"}case"list_start":{var h=this.token.ordered?"ol":"ul",e="";while(this.next().type!=="list_end"){e+=this.tok()}return"<"+h+">\n"+e+"</"+h+">\n"}case"list_item_start":{var e="";while(this.next().type!=="list_item_end"){e+=this.token.type==="text"?this.parseText():this.tok()}return"<li>"+e+"</li>\n"}case"loose_item_start":{var e="";while(this.next().type!=="list_item_end"){e+=this.tok()}return"<li>"+e+"</li>\n"}case"html":{return!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text}case"paragraph":{return"<p>"+this.inline.output(this.token.text)+"</p>\n"}case"text":{return"<p>"+this.parseText()+"</p>\n"}}};function r(t,e){return t.replace(!e?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function l(t,e){t=t.source;e=e||"";return function n(s,i){if(!s)return new RegExp(t,e);i=i.source||i;i=i.replace(/(^|[^\[])\^/g,"$1");t=t.replace(s,i);return n}}function o(){}o.exec=o;function h(t){var e=1,n,s;for(;e<arguments.length;e++){n=arguments[e];for(s in n){if(Object.prototype.hasOwnProperty.call(n,s)){t[s]=n[s]}}}return t}function a(t,n,s){if(s||typeof n==="function"){if(!s){s=n;n=null}if(n)n=h({},a.defaults,n);var l=e.lex(l,n),o=n.highlight,u=0,p=l.length,g=0;if(!o||o.length<3){return s(null,i.parse(l,n))}var c=function(){delete n.highlight;var t=i.parse(l,n);n.highlight=o;return s(null,t)};for(;g<p;g++){(function(t){if(t.type!=="code")return;u++;return o(t.text,t.lang,function(e,n){if(n==null||n===t.text){return--u||c()}t.text=n;t.escaped=true;--u||c()})})(l[g])}return}try{if(n)n=h({},a.defaults,n);return i.parse(e.lex(t,n),n)}catch(f){f.message+="\nPlease report this to https://github.com/chjj/marked.";if((n||a.defaults).silent){return"<p>An error occured:</p><pre>"+r(f.message+"",true)+"</pre>"}throw f}}a.options=a.setOptions=function(t){h(a.defaults,t);return a};a.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,smartLists:false,silent:false,highlight:null,langPrefix:"lang-"};a.Parser=i;a.parser=i.parse;a.Lexer=e;a.lexer=e.lex;a.InlineLexer=s;a.inlineLexer=s.output;a.parse=a;if(typeof exports==="object"){module.exports=a}else if(typeof define==="function"&&define.amd){define(function(){return a})}else{this.marked=a}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

/*!
 * base64.js
 * http://github.com/dankogai/js-base64
 */

(function(r){"use strict";if(r.Base64)return;var e="2.1.2";var t;if(typeof module!=="undefined"&&module.exports){t=require("buffer").Buffer}var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var a=function(r){var e={};for(var t=0,n=r.length;t<n;t++)e[r.charAt(t)]=t;return e}(n);var o=String.fromCharCode;var u=function(r){if(r.length<2){var e=r.charCodeAt(0);return e<128?r:e<2048?o(192|e>>>6)+o(128|e&63):o(224|e>>>12&15)+o(128|e>>>6&63)+o(128|e&63)}else{var e=65536+(r.charCodeAt(0)-55296)*1024+(r.charCodeAt(1)-56320);return o(240|e>>>18&7)+o(128|e>>>12&63)+o(128|e>>>6&63)+o(128|e&63)}};var c=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;var i=function(r){return r.replace(c,u)};var f=function(r){var e=[0,2,1][r.length%3],t=r.charCodeAt(0)<<16|(r.length>1?r.charCodeAt(1):0)<<8|(r.length>2?r.charCodeAt(2):0),a=[n.charAt(t>>>18),n.charAt(t>>>12&63),e>=2?"=":n.charAt(t>>>6&63),e>=1?"=":n.charAt(t&63)];return a.join("")};var h=r.btoa||function(r){return r.replace(/[\s\S]{1,3}/g,f)};var d=t?function(r){return new t(r).toString("base64")}:function(r){return h(i(r))};var v=function(r,e){return!e?d(r):d(r).replace(/[+\/]/g,function(r){return r=="+"?"-":"_"}).replace(/=/g,"")};var g=function(r){return v(r,true)};var l=new RegExp(["[À-ß][-¿]","[à-ï][-¿]{2}","[ð-÷][-¿]{3}"].join("|"),"g");var A=function(r){switch(r.length){case 4:var e=(7&r.charCodeAt(0))<<18|(63&r.charCodeAt(1))<<12|(63&r.charCodeAt(2))<<6|63&r.charCodeAt(3),t=e-65536;return o((t>>>10)+55296)+o((t&1023)+56320);case 3:return o((15&r.charCodeAt(0))<<12|(63&r.charCodeAt(1))<<6|63&r.charCodeAt(2));default:return o((31&r.charCodeAt(0))<<6|63&r.charCodeAt(1))}};var s=function(r){return r.replace(l,A)};var p=function(r){var e=r.length,t=e%4,n=(e>0?a[r.charAt(0)]<<18:0)|(e>1?a[r.charAt(1)]<<12:0)|(e>2?a[r.charAt(2)]<<6:0)|(e>3?a[r.charAt(3)]:0),u=[o(n>>>16),o(n>>>8&255),o(n&255)];u.length-=[0,0,2,1][t];return u.join("")};var C=r.atob||function(r){return r.replace(/[\s\S]{1,4}/g,p)};var b=t?function(r){return new t(r,"base64").toString()}:function(r){return s(C(r))};var B=function(r){return b(r.replace(/[-_]/g,function(r){return r=="-"?"+":"/"}).replace(/[^A-Za-z0-9\+\/]/g,""))};r.Base64={VERSION:e,atob:C,btoa:h,fromBase64:B,toBase64:v,utob:i,encode:v,encodeURI:g,btou:s,decode:B};if(typeof Object.defineProperty==="function"){var S=function(r){return{value:r,enumerable:false,writable:true,configurable:true}};r.Base64.extendString=function(){Object.defineProperty(String.prototype,"fromBase64",S(function(){return B(this)}));Object.defineProperty(String.prototype,"toBase64",S(function(r){return v(this,r)}));Object.defineProperty(String.prototype,"toBase64URI",S(function(){return v(this,true)}))}}})(this);

/*!
 * node-parameterize 0.0.7
 * https://github.com/fyalavuz/node-parameterize
 * Exported as `Flatdoc.slugify`
 */

(function(r){var LATIN_MAP={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ő":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ű":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ő":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ű":"u","ý":"y","þ":"th","ÿ":"y"};var LATIN_SYMBOLS_MAP={"©":"(c)"};var GREEK_MAP={"α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ά":"a","έ":"e","ί":"i","ό":"o","ύ":"y","ή":"h","ώ":"w","ς":"s","ϊ":"i","ΰ":"y","ϋ":"y","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ά":"A","Έ":"E","Ί":"I","Ό":"O","Ύ":"Y","Ή":"H","Ώ":"W","Ϊ":"I","Ϋ":"Y"};var TURKISH_MAP={"ş":"s","Ş":"S","ı":"i","İ":"I","ç":"c","Ç":"C","ü":"u","Ü":"U","ö":"o","Ö":"O","ğ":"g","Ğ":"G"};var RUSSIAN_MAP={"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ё":"Yo","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya"};var UKRAINIAN_MAP={"Є":"Ye","І":"I","Ї":"Yi","Ґ":"G","є":"ye","і":"i","ї":"yi","ґ":"g"};var CZECH_MAP={"č":"c","ď":"d","ě":"e","ň":"n","ř":"r","š":"s","ť":"t","ů":"u","ž":"z","Č":"C","Ď":"D","Ě":"E","Ň":"N","Ř":"R","Š":"S","Ť":"T","Ů":"U","Ž":"Z"};var POLISH_MAP={"ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ó":"o","ś":"s","ź":"z","ż":"z","Ą":"A","Ć":"C","Ę":"e","Ł":"L","Ń":"N","Ó":"o","Ś":"S","Ź":"Z","Ż":"Z"};var LATVIAN_MAP={"ā":"a","č":"c","ē":"e","ģ":"g","ī":"i","ķ":"k","ļ":"l","ņ":"n","š":"s","ū":"u","ž":"z","Ā":"A","Č":"C","Ē":"E","Ģ":"G","Ī":"i","Ķ":"k","Ļ":"L","Ņ":"N","Š":"S","Ū":"u","Ž":"Z"};var ALL_DOWNCODE_MAPS=new Array;ALL_DOWNCODE_MAPS[0]=LATIN_MAP;ALL_DOWNCODE_MAPS[1]=LATIN_SYMBOLS_MAP;ALL_DOWNCODE_MAPS[2]=GREEK_MAP;ALL_DOWNCODE_MAPS[3]=TURKISH_MAP;ALL_DOWNCODE_MAPS[4]=RUSSIAN_MAP;ALL_DOWNCODE_MAPS[5]=UKRAINIAN_MAP;ALL_DOWNCODE_MAPS[6]=CZECH_MAP;ALL_DOWNCODE_MAPS[7]=POLISH_MAP;ALL_DOWNCODE_MAPS[8]=LATVIAN_MAP;var Downcoder=new Object;Downcoder.Initialize=function(){if(Downcoder.map)return;Downcoder.map={};Downcoder.chars="";for(var i in ALL_DOWNCODE_MAPS){var lookup=ALL_DOWNCODE_MAPS[i];for(var c in lookup){Downcoder.map[c]=lookup[c];Downcoder.chars+=c}}Downcoder.regex=new RegExp("["+Downcoder.chars+"]|[^"+Downcoder.chars+"]+","g")};downcode=function(slug){Downcoder.Initialize();var downcoded="";var pieces=slug.match(Downcoder.regex);if(pieces){for(var i=0;i<pieces.length;i++){if(pieces[i].length==1){var mapped=Downcoder.map[pieces[i]];if(mapped!=null){downcoded+=mapped;continue}}downcoded+=pieces[i]}}else{downcoded=slug}return downcoded};Flatdoc.slugify=function(s,num_chars){s=downcode(s);s=s.replace(/[^-\w\s]/g,"");s=s.replace(/^\s+|\s+$/g,"");s=s.replace(/[-\s]+/g,"-");s=s.toLowerCase();return s.substring(0,num_chars)};})();

/* jshint ignore:end */

// This } is for the initial if() statement that bails out early.
}
