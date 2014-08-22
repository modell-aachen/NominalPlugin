;(function ($, _, document, window, undefined) {
  window.NominalViewModel = function( source, offset, lang ) {
    var self = this;
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
    this.newFiscalYear = ko.observable( (new Date()).getFullYear() );
    this.selectedNominal = ko.observable({name: ''});

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

    this.removeInvalidMarker = function() {
      $('#nml-select-year').removeClass('invalid');
    };

    this.showNewYearDialog = function() {
      $('#nml-add-dialog').dialog();
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
          self.selectedNominal(null);
        } else {
          self.selectedNominal( self.nominals()[index] );
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
      animate: !$.jqplot.use_excanvas,
      grid: {
        drawBorder: false,
        shadow: false,
        background: '#ffffff'
      },
      legend: {
        show: true,
        labels: [self.lang.actual, self.lang.nominal]
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
        sizeAdjust: 7.5
      }
    });
  };
}(jQuery, window._, window.document, window));
