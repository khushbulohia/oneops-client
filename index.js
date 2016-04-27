"use strict";
var request = require("request");
var config = require("./config.js")
var plot = require('plotter').plot;

// var AUTH_TOKEN=''
// var ONEOPS_ENDPOINT=''

var environment = {
  endpoint : process.argv[2] ? process.argv[2] : ONEOPS_ENDPOINT,
  org: '',
  authkey: process.argv[3] ? process.argv[3] : AUTH_TOKEN
}

function getOrgHealth(orgname, assembly) {
  environment.org = orgname
  var options = config.options(environment)
  options.uri += '/operations/health.json?state=total'
  request(options, function(error, response, body) {
    var data = JSON.parse(body);
    for(var key in data) {//array of heath objects
      var nspath = data[key].ns
      var path = '/'+ orgname + '/' + assembly
      if(nspath.startsWith(path) > 0) {
        console.log(nspath + " " + JSON.stringify(data[key].health));
      }
    }
  });
}

function getInstanceMetrics(orgname, assembly, platform, enviornment, component, instance, monitor) {
  environment.org = orgname
  var options = config.options(environment)
  options.uri += '/assemblies/' + assembly + '/operations/environments/' + enviornment + '/platforms/' + platform + '/components/' + component + '/instances/' + instance + '/monitors/' + monitor + '.json'

  request(options, function(error, response, body) {
    var data = JSON.parse(body);
    var plotdata = {}
    for(var key in data) {//array os heath objects
      if(key == 'charts') {
        var obj = data[key]
        for(var o in obj) {
          var seriesdata = obj[o].data
          for(var s in seriesdata) {
            var sdata = seriesdata[s]
            var md = sdata.header.metric
            plotdata.md = sdata.data
            // console.log(sdata.header.metric + " " + sdata.data)
          }
        }

        // console.log(JSON.stringify(obj))
      }
    }
    plot({
      data:	plotdata,
      filename:	'output.svg'
    });

  });
}
