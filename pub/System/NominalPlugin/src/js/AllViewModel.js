;(function ($, _, document, window, undefined) {
  window.AllViewModel = function( source, offset, lang, animate ) {
    var self = this;
    self.animate = animate;
    offset = offset - 1 || 0;

    var langList = lang.split("\t");
    lang = {};
    while (langList.length) {
      var k = langList.shift();
      lang[k] = langList.shift();
    }

    var getIndex = function( index ) {
      var retval = (index + 12 - offset) % 12;
      return retval === 0 ? 12 : retval;
    };

    var quarter = [
      {index: 1, name: 'Q1'},
      {index: 2, name: 'Q2'},
      {index: 3, name: 'Q3'},
      {index: 4, name: 'Q4'}
    ];

    var months = [
      {index: getIndex( 1 ), rawIndex: 1, name: lang.jan},
      {index: getIndex( 2 ), rawIndex: 2, name: lang.feb},
      {index: getIndex( 3 ), rawIndex: 3, name: lang.mar},
      {index: getIndex( 4 ), rawIndex: 4, name: lang.apr},
      {index: getIndex( 5 ), rawIndex: 5, name: lang.may},
      {index: getIndex( 6 ), rawIndex: 6, name: lang.jun},
      {index: getIndex( 7 ), rawIndex: 7, name: lang.jul},
      {index: getIndex( 8 ), rawIndex: 8, name: lang.aug},
      {index: getIndex( 9 ), rawIndex: 9, name: lang.sep},
      {index: getIndex( 10 ), rawIndex: 10, name: lang.oct},
      {index: getIndex( 11 ), rawIndex: 11, name: lang.nov},
      {index: getIndex( 12 ), rawIndex: 12, name: lang.dec}
    ];

    // sort months according to their new index
    months = _.sortBy( months, function ( month ) {
      return Math.min( month.index );
    });

    var weeks = [];
    for (var i = 1; i <= 52; ++i) {
      weeks.push({index: i, name: 'KW' + i});
    }

    this.months = ko.observableArray( months );
    this.quarter = ko.observableArray( quarter );
    this.weeks = ko.observableArray( weeks );
    this.days = ko.observableArray( [] );
    this.ckpis = ko.observableArray();
    this.pkpis = ko.observableArray();
    this.hideEmpty = ko.observable( false );
    this.hideEmpty.subscribe( function( val ) { plot( self ); });

    var m = _.findWhere(months, {rawIndex: 1 + (new Date()).getMonth()});
    this.selectedMonth = ko.observable(m.index);

    var loaded = false;
    this.selectedYear = ko.observable( (new Date().getFullYear()) );
    this.selectedYear.subscribe( function( val ) {
      if ( loaded ) {
        plot( self );
      }
    });
    this.availableYears = ko.observableArray();

    this.getDailyObject = function(year) {
      var totalDays = function(y, m) {
        var d = new Date(y, m, 0);
        return d.getDate();
      };

      var dayCounter = 1;
      var now = new Date(Date.now());
      year = parseInt(year);

      var days = [];
      _.each(self.months(), function(month) {
        var arr = [];
        var m = _.clone(month);
        m.days = ko.observableArray();
        m.selected = ko.observable(false);

        var numdays = totalDays(year, m.rawIndex);
        for (var n = 1; n <= numdays; ++n) {
          var d = new Date(year, m.rawIndex - 1, n);
          arr.push({index: dayCounter, name: d.toLocaleDateString(navigator.language)});
          dayCounter++;
        }

        m.days(arr);
        days.push(m);
      });

      return days;
    };

    this.onDailyMonthChanged = function(nml, evt) {
      var month = _.findWhere(self.months(), {index: parseInt($(evt.target).val())});
      nml.selectedMonth(month.index);
      plotNominals(self, nml);
      return false;
    };

    $.blockUI();
    load( self ).done( function() {
      setTimeout( function() {
        $.unblockUI();
        plot( self );
        loaded = true;
      }, 300);

      $('.filter').each( function() {
        var $filter = $(this);
        if ( $filter.hasClass('filter-select') || $filter.hasClass('filter-checkbox') ) {
          $filter.on( 'change', function() {
            applyFilter(self);
          });
        } else if ( $filter.hasClass('filter-text') ) {
          $filter.on( 'keyup', function() {
            applyFilter(self);
          });
        }
      });
    }).fail( function() {
      $.unblockUI();
    });
  };

  var load = function( self ) {
    var deferred = $.Deferred();

    try {
      var str = $('.nml-json').text();
      var json = $.parseJSON(str);
      if ( json && json.status === 'ok' ) {
        // return if no data available
        if ( json.data && json.data.length === 0 ) {
          deferred.resolve();
          return deferred.promise();
        }

        // collect data per year
        var years = [];
        _.each( json.data, function( e, i ) {
          years = years.concat( _.map( e._data, function( d ) {
            return parseInt( d.name );
          }));

          e.id = _.uniqueId();
          if ( !e.type ) {
            e.type = 'pkpi';
          }

          e._visible = ko.observable(true);
          e.isDaily = ko.observable(e._daily === 1);
          e.selectedMonth = ko.observable();
          if (e.isDaily()) {
            var now = 1 + (new Date()).getMonth();
            var current = _.filter(self.months(), function(m) {
              return m.rawIndex === now;
            })[0];
            e.selectedMonth(current.index);
          }

          self[e.type + 's'].push( e );
        });

        var sorted = _.sortBy( _.uniq( years ), function( year ) {
          return Math.min( year );
        });

        self.availableYears( sorted );
        self.selectedYear( (new Date()).getFullYear() );
        deferred.resolve();
      } else {
        deferred.reject();
      }
    } catch( err ) {
      deferred.reject( err );
    }

    return deferred.promise();
  };

  var sortNominals = function( self ) {
    // sort by title, ascending
    var sortFunc = function(nml) {
      return (nml.title || '').toLowerCase();
    };

    self.ckpis( _.sortBy( self.ckpis(), sortFunc ) );
    self.pkpis( _.sortBy( self.pkpis(), sortFunc ) );
  };

  var applyFilter = function( self ) {
    $('.filter').each( function() {
      var $filter = $(this);
      var prop = $filter.attr('data-name');
      var val = $filter.val();
      var isSelect = $filter.hasClass('filter-select') || $filter.hasClass('filter-checkbox');

      var apply = function( nml ) {
        if ( _.isUndefined( nml._filter ) ) {
          nml._filter = {};
        }

        var hidden;
        var isSet;

        if ( isSelect ) {
          isSet = val !== '(all)';

          if ( _.isUndefined( nml[prop] ) ) {
            hidden = isSet && true;
          } else if ( _.isArray( nml[prop] ) ) {
            hidden = isSet && _.indexOf(nml[prop], val ) === -1;
          } else {
            hidden = isSet && nml[prop] !== val;
          }
        } else {
          isSet = !/^\s*$/.test(val);

          if ( _.isUndefined( nml[prop] ) ) {
            hidden = isSet && true;
          } else if ( _.isArray( nml[prop] ) ) {
            _.each(nml[prop], function(p) {
              if ( !hidden ) {
                if ( _.isString(p) ) {
                  hidden = isSet && p.indexOf(val) === -1;
                } else {
                  hidden = isSet && p.indexOf(val) === val;
                }
              }
            });
          } else {
            if ( _.isUndefined( nml[prop] ) ) {
              hidden = isSet && true;
            } else if ( _.isString(nml[prop]) ) {
              hidden = isSet && nml[prop].toLowerCase().indexOf(val) === -1;
            } else {
              hidden = isSet && nml[prop] !== val;
            }
          }
        }

        nml._filter[prop] = {
          type: isSelect ? 'select' : 'text',
          value: val,
          hidden: hidden
        };
      };

      _.each( self.ckpis(), apply );
      _.each( self.pkpis(), apply );
    });

    enforceFilter( self );
  };

  var enforceFilter = function( self ) {
    var filter = function(nml) {
      var hidden = !nml._visible();
      var enforce = [];
      for( var p in nml._filter ) {
        var o = nml._filter[p];
        enforce.push(o.hidden);
      }

      nml._visible( _.compact(enforce).length === 0 );
    };

    _.each( self.ckpis(), filter );
    _.each( self.pkpis(), filter );
  };

  var plot = function( self ) {
    sortNominals( self );
    var eachFunc = function( nml ) {
      plotNominals( self, nml );
    };

    _.each( self.ckpis(), eachFunc );
    _.each( self.pkpis(), eachFunc );
  };

  var plotNominals = function( self, nml ) {
    var id = nml.id;
    var plotId = 'nmlPlot' + id;
    var $container = $('#'+id).parent();
    $container.css('display', 'inline-block' );
    if ( nml._data.length === 0 ) {
      if ( self.hideEmpty() ) {
        hidePlot( id );
      } else {
        showPlot( id );
      }
    }

    // select KPI according to var self.selectedYear
    if ( !self.selectedYear() ) {
      self.selectedYear( (new Date()).getFullYear() );
    }

    var data = _.where( nml._data, {name: self.selectedYear().toString()});
    if ( data.length === 0 ) {
      if ( self.hideEmpty() ) {
        hidePlot( id );
      } else {
        showPlot( id );
      }
    } else {
      // there's only one entry per year possible (hopefully)
      data = data[0];
    }

    var s1 = [], s2 = [];
    var max = 0, min = 0;
    var formatString = '%#.0f';
    if ( data ) {
      if ( nml._monthly ) {
        for( var i = 0; i < self.months().length; ++i ) {
          var month = self.months()[i];

          var val1 = data['ACT_' + month.index];
          var val2 = data['NML_' + month.index];
          max = Math.max( max, Math.max( val1, val2 ) );
          min = Math.min( min, Math.min( val1, val2 ) );
          s1.push( [month.name.substring( 0, 3 ), val1] );
          s2.push( [month.name.substring( 0, 3 ), val2] );
        }
      } else if (nml._quarterly) {
        for( var j = 0; j < self.quarter().length; ++j ) {
          var q = self.quarter()[j];

          var qa = data['ACT_' + q.index];
          var qn = data['NML_' + q.index];
          max = Math.max( max, Math.max( qa, qn ) );
          min = Math.min( min, Math.min( qa, qn ) );
          s1.push( [q.name.substring( 0, 3 ), qa] );
          s2.push( [q.name.substring( 0, 3 ), qn] );
        }
      } else if (nml._weekly) {
        for( var k = 0; k < self.weeks().length; ++k ) {
          var week = self.weeks()[k];

          var wa = data['ACT_' + week.index];
          var wn = data['NML_' + week.index];
          max = Math.max( max, Math.max( wa, wn ) );
          min = Math.min( min, Math.min( wa, wn ) );
          s1.push( [week.name, wa] );
          s2.push( [week.name, wn] );
        }
      } else if (nml._daily) {
        var months = self.days();
        if (!months.length) {
          months = self.getDailyObject(data.name);
          self.days(months);
        }

        var current = nml.selectedMonth();
        var selected = _.findWhere(months, {index: parseInt(current)});
        var days = selected.days();
        for( var l = 0; l < days.length; ++l ) {
          var day = days[l];
          var da = data['ACT_' + day.index];
          var dn = data['NML_' + day.index];
          max = Math.max( max, Math.max( da, dn ) );
          min = Math.min( min, Math.min( da, dn ) );
          s1.push( [day.name, da] );
          s2.push( [day.name, dn] );
        }
      }
    }

    if (!s1.length && !s2.length) {
      return;
    } else {
      for (var i = 0; i < s1.length; ++i) {
        if (/\.|,/.test(s1[i][1]) || /\.|,/.test(s2[i][1])) {
          formatString = '%#.2f';
          break;
        }
      }
    }

    var plot = window[plotId];
    if ( plot ) {
      plot.destroy();
    }

    var title = nml.title;
    if ( nml.unit ) {
      title += ' [' + nml.unit + ']';
    }

    window[plotId] = $.jqplot(id, [s1, s2], {
      animate: !$.jqplot.use_excanvas && self.animate,
      title: title,
      grid: {
        drawBorder: false,
        shadow: false,
        background: '#ffffff'
      },
      series:[{
        color: '#6494c9',
        renderer: $.jqplot.BarRenderer,
        shadow: false,
        rendererOptions: {
          barWidth: nml._weekly ? 3 : (nml._daily ? 5 : (nml._monthly ? 15 : 35))
        },
        pointLabels: { show: false }
      }, {
        color: '#a90000',
        lineWidth: 3,
        showMarker: false,
        shadow: false
      }],
      axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
        tickOptions: {
          angle: nml._weekly ? 90 : (nml._monthly ? 45 : 0)
        }
      },
      axes: {
        xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer,
          numberTicks: nml._daily ? 0.1 : undefined,
        },
        yaxis: {
          autoscale: false,
          min: Math.round(1.1 * min),
          max: Math.round(1.1 * max),
          tickOptions: {
            angle: 0,
            formatString: formatString
          }
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 7.5,
        tooltipAxes: 'y',
      }
    });
  };

  var hidePlot = function( id ) {
    $('#'+id).closest('.nml-container').css('display', 'none');
  };

  var showPlot = function( id ) {
    var $plot = $('#'+id);
    $plot.closest('.nml-container').css('display', 'inline-block');
    $plot.css('height', '');
    $plot.css('width', '');
  };

  var baseUri = function() {
    var p = foswiki.preferences;
    return p.SCRIPTURL + '/rest' + p.SCRIPTSUFFIX + '/NominalPlugin';
  };
}(jQuery, window._, window.document, window));
