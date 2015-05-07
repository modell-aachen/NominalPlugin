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
      {index: getIndex( 1 ), name: lang.jan},
      {index: getIndex( 2 ), name: lang.feb},
      {index: getIndex( 3 ), name: lang.mar},
      {index: getIndex( 4 ), name: lang.apr},
      {index: getIndex( 5 ), name: lang.may},
      {index: getIndex( 6 ), name: lang.jun},
      {index: getIndex( 7 ), name: lang.jul},
      {index: getIndex( 8 ), name: lang.aug},
      {index: getIndex( 9 ), name: lang.sep},
      {index: getIndex( 10 ), name: lang.oct},
      {index: getIndex( 11 ), name: lang.nov},
      {index: getIndex( 12 ), name: lang.dec}
    ];

    // sort months according to their new index
    months = _.sortBy( months, function ( month ) {
      return Math.min( month.index );
    });

    this.months = ko.observableArray( months );
    this.quarter = ko.observableArray( quarter );
    this.ckpis = ko.observableArray();
    this.pkpis = ko.observableArray();
    this.hideEmpty = ko.observable( false );
    this.hideEmpty.subscribe( function( val ) { plot( self ); });

    var loaded = false;
    this.selectedYear = ko.observable( (new Date().getFullYear()) );
    this.selectedYear.subscribe( function( val ) {
      if ( loaded ) {
        plot( self );
      }
    });
    this.availableYears = ko.observableArray();

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
          self[e.type + 's'].push( e );
          if ( i + 1 === json.count ) {
            var sorted = _.sortBy( _.uniq( years ), function( year ) {
              return Math.min( year );
            });

            self.availableYears( sorted );
            self.selectedYear( (new Date()).getFullYear() );
            deferred.resolve();
          }
        });
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
    var sortFunc = function( nml ) {
      var chars = _.map( _.toArray(nml.title), function(i) {return i.charCodeAt();} );
      var sum = _.reduce( chars, function( s, c ) {return s + c;}, 0 );
      return Math.min( sum );
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
      } else {
        for( var j = 0; j < self.quarter().length; ++j ) {
          var q = self.quarter()[j];

          var qa = data['ACT_' + q.index];
          var qn = data['NML_' + q.index];
          max = Math.max( max, Math.max( qa, qn ) );
          min = Math.min( min, Math.min( qa, qn ) );
          s1.push( [q.name.substring( 0, 3 ), qa] );
          s2.push( [q.name.substring( 0, 3 ), qn] );
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
          barWidth: 15,
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
          angle: 45
        }
      },
      axes: {
        xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer
        },
        yaxis: {
          autoscale: false,
          min: 1.1 * min,
          max: 1.1 * max,
          tickOptions: {
            angle: 0,
            formatString: '%#.2f'
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
    $('#'+id).parent().css('display', 'none');
  };

  var showPlot = function( id ) {
    var $plot = $('#'+id);
    $plot.parent().css('display', 'inline-block');
    $plot.css('height', '');
    $plot.css('width', '');
  };

  var baseUri = function() {
    var p = foswiki.preferences;
    return p.SCRIPTURLPATH + '/rest' + p.SCRIPTSUFFIX + '/NominalPlugin';
  };
}(jQuery, window._, window.document, window));
