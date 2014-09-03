;(function ($, _, document, window, undefined) {
  window.NominalViewModel = function( source, offset, lang, animate ) {
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

    months = _.sortBy( months, function ( month ) {
      return Math.min( month.index );
    });

    this.lang = lang;

    this.months = ko.observableArray( months );
    this.nominals = ko.observableArray();
    this.showNewYearLink = ko.observable( true );
    this.canCompareYears = ko.observable( false );
    this.yearsToCompare = ko.observableArray();
    this.isComparing = ko.observable( false );
    this.newFiscalYear = ko.observable( (new Date()).getFullYear() );
    this.selectedNominal = ko.observable({name: ''});
    this.selectedNominalText = ko.observable('');

    this.selectedNominal.subscribe( function( nml ) {
      self.selectedNominalText( nml.name );
      _.each( self.nominals(), function( n ) { n.disabled( true ); });
    });

    this.nominals.subscribe( function( nmls ) {
      self.canCompareYears( nmls.length > 1 );
    });

    // load stored KPIs
    $.blockUI( foswiki.ModacSkin.blockDefaultOptions );
    var url = baseUri() + '/get?source=' + source;
    $.getJSON( url, function( response ) {
      if ( response.status === 'ok' ) {
        var extsort = function( nml ) {
          nml.disabled = ko.observable( true );
          return Math.max( parseInt( nml.name ) );
        };

        var nmls = _.sortBy( response.data, extsort );
        if ( nmls.length > 0 ) {
          for ( var i = 0; i < nmls.length; ++i ) {
            self.nominals.push( nmls[i] );
          }

          self.showNewYearLink( false );
          $('#tabs').tabs({
            fx: {opacity: 'toggle', duration: 150},
            select: self.nmlTabChanged
          });

          var query = window.location.search.match( /\d{4}/ );
          var year = query && query.length > 0 ? query[0] : (new Date()).getFullYear();
          var hasYear = _.where( nmls, {name: year.toString()} );
          if ( hasYear && hasYear.length > 0 ) {
            var index = nmls.indexOf( hasYear[0] );
            self.selectedNominal( hasYear[0] );
            $('#tabs').tabs( 'select', index );
          } else {
            self.selectedNominal( nmls[0] );
          }
        }

        $.unblockUI();
        plot( self );
      }
    });

    this.nmlTabChanged = function( evt, ui ) {
      var year = ui.panel.id;
      for( var i = 0; i < self.nominals().length; ++i ) {
        var nml = self.nominals()[i];
        if ( nml.name === year ) {
          self.selectedNominal( nml );
          plot( self );
          return;
        }
      }
    };

    var dclickHandle = null;
    this.clickToEdit = function() {
      if ( self.selectedNominal().disabled() === false ) {
        return;
      }

      if ( dclickHandle !== null ) {
        self.selectedNominal().disabled( false );
        dclick = null;
      } else {
        dclickHandle = setTimeout ( function() { dclickHandle = null; }, 350 );
      }
    };

    this.removeInvalidMarker = function() {
      $('#nml-select-year').removeClass('invalid');
    };

    this.showNewYearDialog = function() {
      $('#nml-add-dialog').dialog();
    };

    this.showCompareDialog = function() {
      $('#nml-compare-dialog').dialog();
    };

    this.showDeleteDialog = function( nml ) {
      self.selectedNominal( nml );
      $('#nml-delete-dialog').dialog();
    };

    this.addFiscalYear = function() {
      var year = $('#nml-select-year').val();
      for( var i = 0; i < self.nominals().length; ++i ) {
        if ( self.nominals()[i].name === year ) {
          $('#nml-select-year').addClass('invalid');
          return;
        }
      }

      var $tabs = $('#tabs');
      $('#nml-add-dialog').dialog('close');
      $tabs.tabs( 'destroy' );

      var nml = createEntryObject();
      nml.name = year;

      self.nominals.push( nml );
      self.showNewYearLink( false );

      var sort = function( nml ) {
        return Math.max( parseInt( nml.name ) );
      };

      self.nominals( _.sortBy( self.nominals(), sort ) );
      var index = self.nominals().indexOf( nml );

      $tabs.tabs({
        fx: {opacity: 'toggle', duration: 150},
        select: self.nmlTabChanged
      });
      $tabs.tabs( 'select', index );
    };

    this.editNominal = function( nml ) {
      nml.disabled( false );
    };

    this.cancelEditNominal = function( nml ) {
      // reset invalid inputs
      $('.nml-table input:invalid').each( function( i, input ) {
        $(input).val(0);
      });

      nml.disabled( true );
    };

    this.resetComparison = function() {
      var selectedYear = self.selectedNominal().name;
      $('ul.ui-tabs-nav li.ui-state-default a').each( function() {
        if ( $(this).text() === selectedYear ) {
          $(this).click();
          self.isComparing( false );
          plot( self );
          self.yearsToCompare([]);
          self.selectedNominalText( selectedYear );
          return;
        }
      });
    };

    this.compareYears = function() {
      $('#nml-compare-dialog').dialog('close');

      if ( self.yearsToCompare().length < 2 ) {
        if ( self.yearsToCompare().length === 1 ) {
          var year = self.yearsToCompare.pop();
          self.selectedNominal( year );
        }

        var selectedYear = self.selectedNominal().name;
        $('ul.ui-tabs-nav li.ui-state-default a').each( function() {
          if ( $(this).text() === selectedYear ) {
            $(this).click();
            return;
          }
        });

        return;
      }

      var years = _.map( self.yearsToCompare(), function( y ) { return y.name; });
      var sort = function( y ) { return Math.min( parseInt( y ) ); };
      years = _.sortBy( years, sort );

      self.selectedNominalText( years.join(', ') );
      plotMulti( self );
      self.isComparing( true );
    };

    this.saveNominal = function( nml ) {
      self.selectedNominal( nml );
      updateNominal( self, 'save', source ).done( function() {
        $.unblockUI();
      });
    };
 
    this.deleteNominal = function() {
      updateNominal( self, 'delete', source ).done( function() {
        // update ui
        var nml = self.selectedNominal();
        var index = self.nominals.indexOf( nml );
        self.nominals.splice( index, 1 );

        if ( index - 1 > 0 ) {
          index--;
        }

        if ( index >= self.nominals().length ) {
          index = 0;
        }

        if ( index < self.nominals().length ) {
          self.selectedNominal( self.nominals()[index] );
        } else {
          self.selectedNominal( {name: ''} );
          self.showNewYearLink( true );
        }

        $('#nml-delete-dialog').dialog('close');
        var $tabs = $('#tabs');
        $tabs.tabs( 'destroy' );
        $tabs.tabs({
          fx: {opacity: 'toggle', duration: 150},
          select: self.nmlTabChanged
        });
        $tabs.tabs( 'select', index );

        $.unblockUI();
        plot( self );
      });
    };
  };

  var updateNominal = function( self, action, source ) {
    var deferred = $.Deferred();

    // input validation
    var inputs = $('.nml-table input:invalid');
    if ( inputs.length > 0 ) {
      deferred.reject();
      return deferred.promise();
    }

    $.blockUI( foswiki.ModacSkin.blockDefaultOptions );
    var nml  = self.selectedNominal();
    nml.disabled( true );

    var url = baseUri() + '/' + action;
    var payload = {
      data: JSON.stringify( nml ),
      source: source
    };

    $.post( url, payload, function( response ) {
      if ( $.parseJSON( response ).status === 'ok' ) {
        if ( action === 'save' ) {
          plot( self );
        }

        deferred.resolve();
      } else {
        deferred.reject();
      }
    });

    return deferred.promise();
  };

  var createEntryObject = function() {
    var obj = {
      name: ko.observable(),
      disabled: ko.observable( true )
    };

    for ( var i = 1; i <= 12; ++i ) {
      obj['ACT_'+i] = 0;
      obj['NML_'+i] = 0;
      obj['CMT_'+i] = '';
    }

    return obj;
  };

  var baseUri = function() {
    var p = foswiki.preferences;
    return p.SCRIPTURLPATH + '/rest' + p.SCRIPTSUFFIX + '/NominalPlugin';
  };

  var plot = function( self ) {
    // series1: [date, actual]
    // series2: [date, nominal]

    var nml = self.selectedNominal();
    if ( !nml ) {
      if ( window.nmlplot ) {
        window.nmlplot.destroy();
      }

      return;
    }

    var labelActual = self.lang.actual + ' (' + nml.name + ')';
    var labelNominal = self.lang.nominal + ' (' + nml.name + ')';

    var s1 = [], s2 = [];
    var max = 0, min = 0;
    for( var i = 0; i < self.months().length; ++i ) {
      var month = self.months()[i];

      var val1 = nml['ACT_' + month.index];
      var val2 = nml['NML_' + month.index];
      max = Math.max( max, Math.max( val1, val2 ) );
      min = Math.min( min, Math.min( val1, val2 ) );
      s1.push( [month.name, val1] );
      s2.push( [month.name, val2] );
    }

    if ( window.nmlplot )  {
      window.nmlplot.destroy();
    }

    window.nmlplot = $.jqplot('nml-graph', [s1, s2], {
      animate: !$.jqplot.use_excanvas && self.animate,
      grid: {
        drawBorder: false,
        shadow: false,
        background: '#ffffff'
      },
      legend: {
        renderer: $.jqplot.EnhancedLegendRenderer,
        show: true,
        showSwatches: true,
        labels: [labelActual, labelNominal],
        placement: 'outsideGrid'
      },
      series:[{
        color: '#6494c9',
        renderer: $.jqplot.BarRenderer,
        shadow: false,
        rendererOptions: {
          barWidth: 50,
        },
        pointLabels: { show: false }
      }, {
        color: '#a90000',
        lineWidth: 5,
        showMarker: false,
        shadow: false
      }],
      axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
        tickOptions: {
          angle: 0
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
            formatString: '%.1f'
          }
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 7.5,
        tooltipAxes: 'y'
      },
      cursor: {
        show: true,
        tooltipLocation:'nw',
        showVerticalLine: false,
        showHorizontalLine: false
      }
    });
  };

  var plotMulti = function( self ) {
    var nmls = self.yearsToCompare();
    if ( nmls.length < 2 ) {
      if ( window.nmlplot ) {
        window.nmlplot.destroy();
      }

      return;
    }

    var sort = function( n ) { return Math.min( parseInt( n.name ) ); };
    nmls = _.sortBy( nmls, sort );

    var barWidth = 50/nmls.length;
    var barColors = ['#6494c9', '#81bcff', '#3d98ff', '#204d80', '#0078ff'];
    var lineColors = ['#a90000', '#ae4646', '#ff3d3d', '#c9394d', '#ff0024'];

    var labels = [], series = [], seriesPlotOpts = [];
    var max = 0, min = 0;
    for( var index in nmls ) {
      var nml = nmls[index];
      var labelActual = self.lang.actual + ' (' + nml.name + ')';
      var labelNominal = self.lang.nominal + ' (' + nml.name + ')';
      labels.push( labelActual );
      labels.push( labelNominal );

      var s1 = [], s2 = [];
      for( var i = 0; i < self.months().length; ++i ) {
        var month = self.months()[i];

        var val1 = nml['ACT_' + month.index];
        var val2 = nml['NML_' + month.index];
        max = Math.max( max, Math.max( val1, val2 ) );
        min = Math.min( min, Math.min( val1, val2 ) );
        s1.push( [month.name, val1] );
        s2.push( [month.name, val2] );
      }

      series.push( s1 );
      series.push( s2 );

      var barOpts = {
        color: barColors[index % barColors.length],
        renderer: $.jqplot.BarRenderer,
        shadow: false,
        rendererOptions: {
          barWidth: 15,
          barPadding: 0,
          barMargin: 0
        },
        pointLabels: { show: false }
      };

      var lineOpts = {
        color: lineColors[index % lineColors.length],
        lineWidth: 5,
        showMarker: false,
        shadow: false
      };

      seriesPlotOpts.push( barOpts );
      seriesPlotOpts.push( lineOpts );
    }

    if ( window.nmlplot )  {
      window.nmlplot.destroy();
    }

    window.nmlplot = $.jqplot('nml-graph', series, {
      animate: !$.jqplot.use_excanvas,
      grid: {
        drawBorder: false,
        shadow: false,
        background: '#ffffff'
      },
      legend: {
        renderer: $.jqplot.EnhancedLegendRenderer,
        show: true,
        showSwatches: true,
        labels: labels,
        placement: 'outsideGrid'
      },
      series: seriesPlotOpts,
      axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
        tickOptions: {
          angle: 0
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
            formatString: '%.1f'
          }
        }
      },
      highlighter: {
        show: false,
        sizeAdjust: 7.5,
        tooltipAxes: 'y',
        showMarker: false
      },
      cursor: {
        show: true,
        tooltipLocation:'nw',
        showVerticalLine: false,
        showHorizontalLine: false
      }
    });
  };
}(jQuery, window._, window.document, window));
