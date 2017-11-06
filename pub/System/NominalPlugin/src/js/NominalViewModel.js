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

    var quarter = [
      {index: 1, name: 1},
      {index: 2, name: 2},
      {index: 3, name: 3},
      {index: 4, name: 4}
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

    months = _.sortBy( months, function ( month ) {
      return Math.min( month.index );
    });

    var weeks = [];
    for (var i = 1; i <= 52; ++i) {
      weeks.push({index: i, name: 'KW' + i});
    }

    this.lang = lang;
    this.months = ko.observableArray( months );
    this.quarter = ko.observableArray( quarter );
    this.weeks = ko.observableArray( weeks );
    this.days = ko.observableArray( [] );
    this.nominals = ko.observableArray();
    this.showNewYearLink = ko.observable( true );
    this.canCompareYears = ko.observable( false );
    this.yearsToCompare = ko.observableArray();
    this.isComparing = ko.observable( false );
    this.newFiscalYear = ko.observable( (new Date()).getFullYear() );
    this.selectedNominal = ko.observable({name: ''});
    this.selectedNominalText = ko.observable('');
    this.isMonthly = ko.observable( true );
    this.isQuarterly = ko.observable( true );
    this.isWeekly = ko.observable( true );
    this.isDaily = ko.observable( true );

    var m = _.findWhere(months, {rawIndex: 1 + (new Date()).getMonth()});
    this.selectedMonth = ko.observable(m.index);

    this.selectedNominal.subscribe( function( nml ) {
      self.selectedNominalText( nml.name );
      _.each( self.nominals(), function( n ) { n.disabled( true ); });
    });

    this.nominals.subscribe( function( nmls ) {
      self.canCompareYears( nmls.length > 1 && !self.isDaily());
    });

    // load stored KPIs
    $.blockUI();
    var url = baseUri() + '/get?source=' + source;
    $.getJSON( url, function( response ) {
      if ( response.status === 'ok' ) {
        var extsort = function( nml ) {
          nml.disabled = ko.observable( true );
          return Math.max( parseInt( nml.name ) );
        };

        self.isWeekly(response.weekly === 1);
        self.isMonthly(response.monthly === 1);
        self.isQuarterly(response.quarterly === 1);
        self.isDaily(response.daily === 1);

        var nmls = _.sortBy( response.data, extsort );
        if ( nmls.length > 0 ) {
          for ( var i = 0; i < nmls.length; ++i ) {
            self.nominals.push( nmls[i] );
          }

          self.showNewYearLink( false );
          $('#tabs').tabs({
            fx: {opacity: 'toggle', duration: 150},
            select: self.nmlTabChanged,
            activate: self.nmlTabChanged
          });

          var query = window.location.search.match( /year=(\d{4})/ );
          var year = query && query.length > 1 ? query[1] : (new Date()).getFullYear();
          var hasYear = _.where( nmls, {name: year.toString()} );
          if ( hasYear && hasYear.length > 0 ) {
            var index = _.indexOf( nmls, hasYear[0] );
            self.selectedNominal( hasYear[0] );

            try {
              $('#tabs').tabs( 'select', index );
            } catch ( e ) {
              $('#tabs').tabs( "option", "active", index );
            }
          } else {
            self.selectedNominal( nmls[0] );
          }
        }

        $.unblockUI();
        plot( self );
      }
    });

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

    this.nmlActions = function( evt ) {
      $.blockUI();
      $.ajax({
        cache: false,
        type: 'GET',
        url: baseUri() + '/actions?source=' + source
      }).success( function( data, status, xhr ) {
        var json = $.parseJSON( data );
        if ( json.status === 'ok' ) {
          var p = foswiki.preferences;
          var url = [
            p.SCRIPTURLPATH,
            '/view',
            p.SCRIPTSUFFIX,
            '/',
            json.location
          ];

          window.location = url.join('');
        }
      }).error( function( xhr, status, err ) {
        if ( window.console && console.error ) {
          console.error( err );
        }
      }).always( $.unblockUI );
    };

    this.nmlTabChanged = function( evt, ui ) {
      var id;
      if ( ui.panel && ui.panel.id ) {
        id = ui.panel.id;
      } else if ( ui.newPanel && ui.newPanel.length > 0 ) {
        id = ui.newPanel[0].id;
      } else {
        if ( window.console && console.error ) {
          console.error( 'unable to obtain panel id' );
        }

        return false;
      }

      var year = id;
      for( var i = 0; i < self.nominals().length; ++i ) {
        var nml = self.nominals()[i];
        if ( nml.name == year ) {
          self.selectedNominal( nml );
          months = self.getDailyObject(nml.name);
          if(self.isDaily()){
            _.each(months, function(m) {
              m.selected(m.index === (new Date()).getMonth()+1);
            });
          }
          self.days(months);
          plot( self );
          return;
        }
      }
    };

    this.onDailyMonthChanged = function(data, evt) {
      var selected = $(evt.target).val() - 1;
      var months = self.days();
      for (var i = 0; i < months.length; ++i) {
        var month = months[i];
        month.selected(i === selected);
      }

      plot(self);
    };

    this.onDailyMonthClicked = function(obj, evt) {
      var select = !this.selected();
      _.each(self.days(), function(day) {
        day.selected(false);
      });
      this.selected(select);
      plot(self);
    };

    var dclickHandle = null;
    this.clickToEdit = function() {
      if ( self.selectedNominal().disabled() === false ) {
        return;
      }

      if ( dclickHandle !== null ) {
        dclick = null;
        self.selectedNominal().disabled( false );
        $('.nml-input').each(function() {
          $(this).data('orig_val', $(this).val());
        });
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

    this.showBatchDialog = function() {
      $('#nml-batch-dialog').dialog();
    };

    this.showCompareDialog = function() {
      $('#nml-compare-dialog').dialog();
    };

    this.showDeleteDialog = function( nml ) {
      self.selectedNominal( nml );
      $('#nml-delete-dialog').dialog();
    };

    this.setNominalBatch = function() {
      var $input = $('#nml-nominal-batch');
      var val = $input.val();
      if ( val ) {
        val = val.replace(',', '.');
      }

      if ( !/^\d+(\.\d+)?$/.test( val ) || val < 0 ) {
        $input.addClass('invalid');
        return;
      }

      val = parseFloat( val );
      $('#nml-batch-dialog').dialog('close');
      $input.removeClass('invalid');
      $input.val(0);

      var $id = $('#' + self.selectedNominal().name);
      var $base = $id.find('.col-nominal > .nml-input');
      var addUp = $('#nml-sum-batch').prop('checked');
      if ( !addUp ) {
        if (!self.isDaily()) {
          $base.val( val );
          for( var p in self.selectedNominal() ) {
            if ( /^NML/.test( p ) ) {
              self.selectedNominal()[p] = val;
            }
          }
        } else {
          var selected = _.filter(self.days(), function(month) {
            return month.selected();
          })[0];

          val = "" + Math.round(val*1000/1000);
          _.each(selected.days(), function(day) {
            self.selectedNominal()['NML_' + day.index] = val;
            $id.find('[data-day="' + day.index + '"]').val(val);
          });
        }
      } else {
        var sum = val;
        var $col = $base;
        if (self.isQuarterly()) {
          $col = $id.find('[data-quarter]');
        } else if (self.isWeekly()) {
          $col = $id.find('[data-week]');
        }

        if (!self.isDaily()) {
          $col.each( function() {
            $(this).val( Math.round( sum * 1000 ) / 1000 );
            sum += val;
          });

          for( var prop in self.selectedNominal() ) {
            if ( /^NML_/.test( prop ) ) {
              var i = parseInt( prop.match(/^NML_(\d+)$/)[1] );
              self.selectedNominal()[prop] = i * val;
            }
          }
        } else {
          var selected = _.filter(self.days(), function(month) {
            return month.selected();
          })[0];

          var days = selected.days();
          for (var day = 0; day < days.length; ++day) {
            self.selectedNominal()['NML_' + days[day].index] = sum;
            $col = $id.find('[data-day="' + days[day].index + '"]');
            $col.val(Math.round(sum*1000/1000));
            sum += val;
          }
        }
      }

      $('#nml-btn-save').click();
    };

    this.addFiscalYear = function() {
      var year = $('#nml-select-year').val();
      if ( !/[0-9]{4}/.test(year) ) {
        $('#nml-select-year').addClass('invalid');
        return;
      }

      for( var i = 0; i < self.nominals().length; ++i ) {
        if ( self.nominals()[i].name === year ) {
          $('#nml-select-year').addClass('invalid');
          return;
        }
      }

      var $tabs = $('#tabs');
      $('#nml-add-dialog').dialog('close');

      try {
        $tabs.tabs( 'destroy' );
      } catch( e ) { /* ignore */ }

      var nml = createEntryObject( self, year );
      nml.name = year;
      if (self.isDaily()) {
        var days = self.getDailyObject(year);
        var now = 1 + (new Date()).getMonth();
        _.each(days, function(month) {
          month.selected(now === month.rawIndex);
        });
        self.days(days);
      }

      self.nominals.push( nml );
      self.showNewYearLink( false );

      var sort = function( nml ) {
        return Math.max( parseInt( nml.name ) );
      };

      self.nominals( _.sortBy( self.nominals(), sort ) );
      var index = self.nominals.indexOf( nml );

      $tabs.tabs({
        fx: {opacity: 'toggle', duration: 150},
        select: self.nmlTabChanged,
        activate: self.nmlTabChanged
      });
      try {
        $tabs.tabs( 'select', index );
      } catch ( e ) {
        $tabs.tabs( "option", "active", index );
      }

      self.selectedNominal( nml );
    };

    this.editNominal = function( nml ) {
      $('.nml-input').each(function() {
        $(this).data('orig_val', $(this).val());
      });

      nml.disabled( false );
    };

    this.cancelEditNominal = function( nml ) {
      // reset invalid inputs
      $('.nml-input').each( function() {
        $(this).val($(this).data('orig_val'));
        $(this).removeClass('invalid');
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
          var months = self.getDailyObject(self.nominals()[index].name);
          if(self.isDaily()){
            _.each(months, function(m) {
              m.selected(m.index === (new Date()).getMonth()+1);
            });
          }
          self.days(months);
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

        try {
          $tabs.tabs( 'select', index );
        } catch ( e ) {
          $tabs.tabs( "option", "active", index );
        }

        $.unblockUI();
        plot( self );
      });
    };
  };

  var updateNominal = function( self, action, source ) {
    var deferred = $.Deferred();
    var nml  = self.selectedNominal();

    $('#' + nml.name + ' input[data-required]').each( function() {
      var $input = $(this);
      if ($input.prop('disabled')) {
        return;
      }

      var val = $input.val();
      var isNotEmpty = val && val.trim() !== '';
      if ( isNotEmpty ) {
        val = val.replace( ',', '.' );
      } else {
        val = 0;
      }

      var valid = /^\d+(\.\d+)?$/.test( val );
      if ( valid ) {
        $input.removeClass('invalid');
        $input.val(val);
      } else {
        $input.addClass('invalid');
      }
    });

    if ( $('#' + nml.name + ' input.invalid').length > 0 ) {
      deferred.reject();
      nml.disabled( false );
    } else {
      $.blockUI();
      nml.disabled( true );

      for( var prop in nml ) {
        if ( /^(NML|ACT)/.test( prop ) && typeof nml[prop] === 'string' ) {
          nml[prop] = nml[prop].replace( ',', '.' );
        }
      }

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
    }

    return deferred.promise();
  };

  var createEntryObject = function( self, year ) {
    var obj = {
      name: ko.observable(),
      disabled: ko.observable( true ),
      monthly: ko.observable(self.isMonthly()),
      quarterly: ko.observable(self.isQuarterly()),
      weekly: ko.observable(self.isWeekly()),
      daily: ko.observable(self.isDaily())
    };

    var days = parseInt(year) % 4 === 0 ? 366 : 365;
    for ( var i = 1; i <= days; ++i ) {
      obj['ACT_'+i] = 0;
      obj['NML_'+i] = 0;
      obj['CMT_'+i] = '';
    }

    return obj;
  };

  var baseUri = function() {
    var p = foswiki.preferences;
    return p.SCRIPTURL + '/rest' + p.SCRIPTSUFFIX + '/NominalPlugin';
  };

  var plot = function( self ) {
    // series1: [date, actual]
    // series2: [date, nominal]
    // MA-Ticket: #10861 correct reset when in compare mode
    if( self.isComparing()){
       self.resetComparison();
    }
    var nml = self.selectedNominal();
    if ( !nml || /^$/.test(nml.name) ) {
      if ( window.nmlplot ) {
        window.nmlplot.destroy();
      }

      return;
    }

    var labelActual = self.lang.actual + ' (' + nml.name + ')';
    var labelNominal = self.lang.nominal + ' (' + nml.name + ')';

    var s1 = [], s2 = [];
    var max = 0, min = 0;
    if ( self.isMonthly() ) {
      for( var i = 0; i < self.months().length; ++i ) {
        var month = self.months()[i];

        var val1 = nml['ACT_' + month.index];
        var val2 = nml['NML_' + month.index];
        max = Math.max( max, Math.max( val1, val2 ) );
        min = Math.min( min, Math.min( val1, val2 ) );
        s1.push( [month.name, val1] );
        s2.push( [month.name, val2] );
      }
    } else if (self.isQuarterly()) {
      for( var j = 0; j < self.quarter().length; ++j ) {
        var q = self.quarter()[j];

        var qa = nml['ACT_' + q.index];
        var qn = nml['NML_' + q.index];
        max = Math.max( max, Math.max( qa, qn ) );
        min = Math.min( min, Math.min( qa, qn ) );
        s1.push( [q.name, qa] );
        s2.push( [q.name, qn] );
      }
    } else if (self.isWeekly()) {
      for( var k = 0; k < self.weeks().length; ++k ) {
        var week = self.weeks()[k];

        var wa = nml['ACT_' + week.index];
        var wn = nml['NML_' + week.index];
        max = Math.max( max, Math.max( wa, wn ) );
        min = Math.min( min, Math.min( wa, wn ) );
        s1.push( [week.name, wa] );
        s2.push( [week.name, wn] );
      }
    } else if (self.isDaily()) {
      var months = self.days();
      if (!months.length) {
        months = self.getDailyObject(nml.name);
        self.days(months);
      }

      var selected = _.filter(months, function(m) {
        return m.selected();
      });

      if (!selected.length) {
        var query = window.location.search.match( /month=(\d{1,2})/ );
        var qm = query && query.length > 1 ? parseInt(query[1]) : -1;
        if(qm != -1){
          _.each(months, function(m) {
            m.selected(m.index === qm);
          });
          //just select the month from query when loading the page for the first time
          //FIREFOX needs the hash
          window.history.pushState("", "", '#');
        } else if(!window.location.href.match(/#$/)) {
          _.each(months, function(m) {
            m.selected(m.index === (new Date()).getMonth()+1);
          });
          window.history.pushState("", "", "#");
        }
      }

      selected = _.filter(months, function(m) {
        return m.selected();
      });

      if(selected.length){
        var days = selected[0].days();
        for( var l = 0; l < days.length; ++l ) {
          var day = days[l];
          var da = nml['ACT_' + day.index];
          var dn = nml['NML_' + day.index];
          max = Math.max( max, Math.max( da, dn ) );
          min = Math.min( min, Math.min( da, dn ) );
          s1.push( [day.name, da] );
          s2.push( [day.name, dn] );
        }
      }
    }

    if ( window.nmlplot )  {
      window.nmlplot.destroy();
    }

    if (!s1.length && !s2.length) {
      return;
    }

    var fp = !!_.filter(_.unzip(s1)[1], function(n) {return /[\.,]/.test(n);}).length;
    var formatString = fp ? '%#.2f' : (max <= 3 ? '%#.1f' : '%#.0f');

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
          barWidth: self.isWeekly() ? 25 : (self.isDaily() ? 35 : 50),
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
          angle: (self.isWeekly() || self.isDaily()) ? 45 : 0
        }
      },
      axes: {
        xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer
        },
        yaxis: {
          autoscale: false,
          min: min,
          max: max,
          tickOptions: {
            angle: 0,
            formatString: formatString
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
    var lineColors = ['#a90000', '#fe5c5c', '#530000', '#fe3939', '#db0000'];

    var labels = [], series = [], seriesPlotOpts = [];
    var max = 0, min = 0;
    for( var index in nmls ) {
      var nml = nmls[index];
      var labelActual = self.lang.actual + ' (' + nml.name + ')';
      var labelNominal = self.lang.nominal + ' (' + nml.name + ')';
      labels.push( labelActual );
      labels.push( labelNominal );

      var s1 = [], s2 = [];
      if ( self.isMonthly() ) {
        for( var i = 0; i < self.months().length; ++i ) {
          var month = self.months()[i];

          var val1 = nml['ACT_' + month.index];
          var val2 = nml['NML_' + month.index];
          max = Math.max( max, Math.max( val1, val2 ) );
          min = Math.min( min, Math.min( val1, val2 ) );
          s1.push( [month.name, val1] );
          s2.push( [month.name, val2] );
        }
      } else if (self.isQuarterly()) {
        for( var j = 0; j < self.quarter().length; ++j ) {
          var q = self.quarter()[j];

          var qa = nml['ACT_' + q.index];
          var qn = nml['NML_' + q.index];
          max = Math.max( max, Math.max( qa, qn ) );
          min = Math.min( min, Math.min( qa, qn ) );
          s1.push( [q.name, qa] );
          s2.push( [q.name, qn] );
        }
      } else if (self.isWeekly()) {
        for( var k = 0; k < self.weeks().length; ++k ) {
          var week = self.weeks()[k];

          var wa = nml['ACT_' + week.index];
          var wn = nml['NML_' + week.index];
          max = Math.max( max, Math.max( wa, wn ) );
          min = Math.min( min, Math.min( wa, wn ) );
          s1.push( [week.name, wa] );
          s2.push( [week.name, wn] );
        }
      }

      var fp = !!_.filter(_.unzip(s1)[1], function(n) {return /[\.,]/.test(n);}).length;
      var formatString = fp ? '%#.2f' : (max <= 3 ? '%#.1f' : '%#.0f');

      series.push( s1 );
      series.push( s2 );

      var barOpts = {
        color: barColors[index % barColors.length],
        renderer: $.jqplot.BarRenderer,
        shadow: false,
        rendererOptions: {
          barWidth: (self.isWeekly() || self.isDaily()) ? 8 : 15,
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
          angle: (self.isWeekly() || self.isDaily()) ? 45 : 0
        }
      },
      axes: {
        xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer
        },
        yaxis: {
          autoscale: false,
          min: min,
          max: max,
          tickOptions: {
            angle: 0,
            formatString: formatString
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
