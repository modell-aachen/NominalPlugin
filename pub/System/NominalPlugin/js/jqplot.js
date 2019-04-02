/**
 * Title: jqPlot Charts
 * 
 * Pure JavaScript plotting plugin for jQuery.
 * 
 * About: Version
 * 
 * version: 1.0.8 
 * revision: 1250
 * 
 * About: Copyright & License
 * 
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly.
 * 
 * See <GPL Version 2> and <MIT License> contained within this distribution for further information. 
 *
 * The author would appreciate an email letting him know of any substantial
 * use of jqPlot.  You can reach the author at: chris at jqplot dot com 
 * or see http://www.jqplot.com/info.php.  This is, of course, not required.
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php.
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 * 
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 * 
 * About: Introduction
 * 
 * jqPlot requires jQuery (1.4+ required for certain features). jQuery 1.4.2 is included in the distribution.  
 * To use jqPlot include jQuery, the jqPlot jQuery plugin, the jqPlot css file and optionally 
 * the excanvas script for IE support in your web page:
 * 
 * > <!--[if lt IE 9]><script language="javascript" type="text/javascript" src="excanvas.js"></script><![endif]-->
 * > <script language="javascript" type="text/javascript" src="jquery-1.4.4.min.js"></script>
 * > <script language="javascript" type="text/javascript" src="jquery.jqplot.min.js"></script>
 * > <link rel="stylesheet" type="text/css" href="jquery.jqplot.css" />
 * 
 * jqPlot can be customized by overriding the defaults of any of the objects which make
 * up the plot. The general usage of jqplot is:
 * 
 * > chart = $.jqplot('targetElemId', [dataArray,...], {optionsObject});
 * 
 * The options available to jqplot are detailed in <jqPlot Options> in the jqPlotOptions.txt file.
 * 
 * An actual call to $.jqplot() may look like the 
 * examples below:
 * 
 * > chart = $.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]]);
 * 
 * or
 * 
 * > dataArray = [34,12,43,55,77];
 * > chart = $.jqplot('targetElemId', [dataArray, ...], {title:'My Plot', axes:{yaxis:{min:20, max:100}}});
 * 
 * For more inforrmation, see <jqPlot Usage>.
 * 
 * About: Usage
 * 
 * See <jqPlot Usage>
 * 
 * About: Available Options 
 * 
 * See <jqPlot Options> for a list of options available thorugh the options object (not complete yet!)
 * 
 * About: Options Usage
 * 
 * See <Options Tutorial>
 * 
 * About: Changes
 * 
 * See <Change Log>
 * 
 */
!function($){/**
     * Class: Axis
     * An individual axis object.  Cannot be instantiated directly, but created
     * by the Plot object.  Axis properties can be set or overridden by the 
     * options passed in from the user.
     * 
     */
function Axis(name){$.jqplot.ElemContainer.call(this),
// Group: Properties
//
// Axes options are specified within an axes object at the top level of the 
// plot options like so:
// > {
// >    axes: {
// >        xaxis: {min: 5},
// >        yaxis: {min: 2, max: 8, numberTicks:4},
// >        x2axis: {pad: 1.5},
// >        y2axis: {ticks:[22, 44, 66, 88]}
// >        }
// > }
// There are 2 x axes, 'xaxis' and 'x2axis', and 
// 9 yaxes, 'yaxis', 'y2axis'. 'y3axis', ...  Any or all of which may be specified.
this.name=name,this._series=[],
// prop: show
// Wether to display the axis on the graph.
this.show=!1,
// prop: tickRenderer
// A class of a rendering engine for creating the ticks labels displayed on the plot, 
// See <$.jqplot.AxisTickRenderer>.
this.tickRenderer=$.jqplot.AxisTickRenderer,
// prop: tickOptions
// Options that will be passed to the tickRenderer, see <$.jqplot.AxisTickRenderer> options.
this.tickOptions={},
// prop: labelRenderer
// A class of a rendering engine for creating an axis label.
this.labelRenderer=$.jqplot.AxisLabelRenderer,
// prop: labelOptions
// Options passed to the label renderer.
this.labelOptions={},
// prop: label
// Label for the axis
this.label=null,
// prop: showLabel
// true to show the axis label.
this.showLabel=!0,
// prop: min
// minimum value of the axis (in data units, not pixels).
this.min=null,
// prop: max
// maximum value of the axis (in data units, not pixels).
this.max=null,
// prop: autoscale
// DEPRECATED
// the default scaling algorithm produces superior results.
this.autoscale=!1,
// prop: pad
// Padding to extend the range above and below the data bounds.
// The data range is multiplied by this factor to determine minimum and maximum axis bounds.
// A value of 0 will be interpreted to mean no padding, and pad will be set to 1.0.
this.pad=1.2,
// prop: padMax
// Padding to extend the range above data bounds.
// The top of the data range is multiplied by this factor to determine maximum axis bounds.
// A value of 0 will be interpreted to mean no padding, and padMax will be set to 1.0.
this.padMax=null,
// prop: padMin
// Padding to extend the range below data bounds.
// The bottom of the data range is multiplied by this factor to determine minimum axis bounds.
// A value of 0 will be interpreted to mean no padding, and padMin will be set to 1.0.
this.padMin=null,
// prop: ticks
// 1D [val, val, ...] or 2D [[val, label], [val, label], ...] array of ticks for the axis.
// If no label is specified, the value is formatted into an appropriate label.
this.ticks=[],
// prop: numberTicks
// Desired number of ticks.  Default is to compute automatically.
this.numberTicks,
// prop: tickInterval
// number of units between ticks.  Mutually exclusive with numberTicks.
this.tickInterval,
// prop: renderer
// A class of a rendering engine that handles tick generation, 
// scaling input data to pixel grid units and drawing the axis element.
this.renderer=$.jqplot.LinearAxisRenderer,
// prop: rendererOptions
// renderer specific options.  See <$.jqplot.LinearAxisRenderer> for options.
this.rendererOptions={},
// prop: showTicks
// Wether to show the ticks (both marks and labels) or not.
// Will not override showMark and showLabel options if specified on the ticks themselves.
this.showTicks=!0,
// prop: showTickMarks
// Wether to show the tick marks (line crossing grid) or not.
// Overridden by showTicks and showMark option of tick itself.
this.showTickMarks=!0,
// prop: showMinorTicks
// Wether or not to show minor ticks.  This is renderer dependent.
this.showMinorTicks=!0,
// prop: drawMajorGridlines
// True to draw gridlines for major axis ticks.
this.drawMajorGridlines=!0,
// prop: drawMinorGridlines
// True to draw gridlines for minor ticks.
this.drawMinorGridlines=!1,
// prop: drawMajorTickMarks
// True to draw tick marks for major axis ticks.
this.drawMajorTickMarks=!0,
// prop: drawMinorTickMarks
// True to draw tick marks for minor ticks.  This is renderer dependent.
this.drawMinorTickMarks=!0,
// prop: useSeriesColor
// Use the color of the first series associated with this axis for the
// tick marks and line bordering this axis.
this.useSeriesColor=!1,
// prop: borderWidth
// width of line stroked at the border of the axis.  Defaults
// to the width of the grid boarder.
this.borderWidth=null,
// prop: borderColor
// color of the border adjacent to the axis.  Defaults to grid border color.
this.borderColor=null,
// prop: scaleToHiddenSeries
// True to include hidden series when computing axes bounds and scaling.
this.scaleToHiddenSeries=!1,
// minimum and maximum values on the axis.
this._dataBounds={min:null,max:null},
// statistics (min, max, mean) as well as actual data intervals for each series attached to axis.
// holds collection of {intervals:[], min:, max:, mean: } objects for each series on axis.
this._intervalStats=[],
// pixel position from the top left of the min value and max value on the axis.
this._offsets={min:null,max:null},this._ticks=[],this._label=null,
// prop: syncTicks
// true to try and synchronize tick spacing across multiple axes so that ticks and
// grid lines line up.  This has an impact on autoscaling algorithm, however.
// In general, autoscaling an individual axis will work better if it does not
// have to sync ticks.
this.syncTicks=null,
// prop: tickSpacing
// Approximate pixel spacing between ticks on graph.  Used during autoscaling.
// This number will be an upper bound, actual spacing will be less.
this.tickSpacing=75,
// Properties to hold the original values for min, max, ticks, tickInterval and numberTicks
// so they can be restored if altered by plugins.
this._min=null,this._max=null,this._tickInterval=null,this._numberTicks=null,this.__ticks=null,
// hold original user options.
this._options={}}/**
     * Class: Legend
     * Legend object.  Cannot be instantiated directly, but created
     * by the Plot object.  Legend properties can be set or overridden by the 
     * options passed in from the user.
     */
function Legend(options){$.jqplot.ElemContainer.call(this),
// Group: Properties
// prop: show
// Wether to display the legend on the graph.
this.show=!1,
// prop: location
// Placement of the legend.  one of the compass directions: nw, n, ne, e, se, s, sw, w
this.location="ne",
// prop: labels
// Array of labels to use.  By default the renderer will look for labels on the series.
// Labels specified in this array will override labels specified on the series.
this.labels=[],
// prop: showLabels
// true to show the label text on the  legend.
this.showLabels=!0,
// prop: showSwatch
// true to show the color swatches on the legend.
this.showSwatches=!0,
// prop: placement
// "insideGrid" places legend inside the grid area of the plot.
// "outsideGrid" places the legend outside the grid but inside the plot container, 
// shrinking the grid to accomodate the legend.
// "inside" synonym for "insideGrid", 
// "outside" places the legend ouside the grid area, but does not shrink the grid which
// can cause the legend to overflow the plot container.
this.placement="insideGrid",
// prop: xoffset
// DEPRECATED.  Set the margins on the legend using the marginTop, marginLeft, etc. 
// properties or via CSS margin styling of the .jqplot-table-legend class.
this.xoffset=0,
// prop: yoffset
// DEPRECATED.  Set the margins on the legend using the marginTop, marginLeft, etc. 
// properties or via CSS margin styling of the .jqplot-table-legend class.
this.yoffset=0,
// prop: border
// css spec for the border around the legend box.
this.border,
// prop: background
// css spec for the background of the legend box.
this.background,
// prop: textColor
// css color spec for the legend text.
this.textColor,
// prop: fontFamily
// css font-family spec for the legend text.
this.fontFamily,
// prop: fontSize
// css font-size spec for the legend text.
this.fontSize,
// prop: rowSpacing
// css padding-top spec for the rows in the legend.
this.rowSpacing="0.5em",
// renderer
// A class that will create a DOM object for the legend,
// see <$.jqplot.TableLegendRenderer>.
this.renderer=$.jqplot.TableLegendRenderer,
// prop: rendererOptions
// renderer specific options passed to the renderer.
this.rendererOptions={},
// prop: predraw
// Wether to draw the legend before the series or not.
// Used with series specific legend renderers for pie, donut, mekko charts, etc.
this.preDraw=!1,
// prop: marginTop
// CSS margin for the legend DOM element. This will set an element 
// CSS style for the margin which will override any style sheet setting.
// The default will be taken from the stylesheet.
this.marginTop=null,
// prop: marginRight
// CSS margin for the legend DOM element. This will set an element 
// CSS style for the margin which will override any style sheet setting.
// The default will be taken from the stylesheet.
this.marginRight=null,
// prop: marginBottom
// CSS margin for the legend DOM element. This will set an element 
// CSS style for the margin which will override any style sheet setting.
// The default will be taken from the stylesheet.
this.marginBottom=null,
// prop: marginLeft
// CSS margin for the legend DOM element. This will set an element 
// CSS style for the margin which will override any style sheet setting.
// The default will be taken from the stylesheet.
this.marginLeft=null,
// prop: escapeHtml
// True to escape special characters with their html entity equivalents
// in legend text.  "<" becomes &lt; and so on, so html tags are not rendered.
this.escapeHtml=!1,this._series=[],$.extend(!0,this,options)}/**
     * Class: Title
     * Plot Title object.  Cannot be instantiated directly, but created
     * by the Plot object.  Title properties can be set or overridden by the 
     * options passed in from the user.
     * 
     * Parameters:
     * text - text of the title.
     */
function Title(text){$.jqplot.ElemContainer.call(this),
// Group: Properties
// prop: text
// text of the title;
this.text=text,
// prop: show
// whether or not to show the title
this.show=!0,
// prop: fontFamily
// css font-family spec for the text.
this.fontFamily,
// prop: fontSize
// css font-size spec for the text.
this.fontSize,
// prop: textAlign
// css text-align spec for the text.
this.textAlign,
// prop: textColor
// css color spec for the text.
this.textColor,
// prop: renderer
// A class for creating a DOM element for the title,
// see <$.jqplot.DivTitleRenderer>.
this.renderer=$.jqplot.DivTitleRenderer,
// prop: rendererOptions
// renderer specific options passed to the renderer.
this.rendererOptions={},
// prop: escapeHtml
// True to escape special characters with their html entity equivalents
// in title text.  "<" becomes &lt; and so on, so html tags are not rendered.
this.escapeHtml=!1}/**
     * Class: Series
     * An individual data series object.  Cannot be instantiated directly, but created
     * by the Plot object.  Series properties can be set or overridden by the 
     * options passed in from the user.
     */
function Series(options){options=options||{},$.jqplot.ElemContainer.call(this),this.show=!0,this.xaxis="xaxis",this._xaxis,this.yaxis="yaxis",this._yaxis,this.gridBorderWidth=2,this.renderer=$.jqplot.LineRenderer,this.rendererOptions={},this.data=[],this.gridData=[],this.label="",this.showLabel=!0,this.color,this.negativeColor,this.lineWidth=2.5,this.lineJoin="round",this.lineCap="round",this.linePattern="solid",this.shadow=!0,this.shadowAngle=45,this.shadowOffset=1.25,this.shadowDepth=3,this.shadowAlpha="0.1",this.breakOnNull=!1,this.markerRenderer=$.jqplot.MarkerRenderer,this.markerOptions={},this.showLine=!0,this.showMarker=!0,this.index,this.fill=!1,this.fillColor,this.fillAlpha,this.fillAndStroke=!1,this.disableStack=!1,this._stack=!1,this.neighborThreshold=4,this.fillToZero=!1,this.fillToValue=0,this.fillAxis="y",this.useNegativeColors=!0,this._stackData=[],this._plotData=[],this._plotValues={x:[],y:[]},this._intervals={x:{},y:{}},this._prevPlotData=[],this._prevGridData=[],this._stackAxis="y",this._primaryAxis="_xaxis",this.canvas=new $.jqplot.GenericCanvas,this.shadowCanvas=new $.jqplot.GenericCanvas,this.plugins={},this._sumy=0,this._sumx=0,this._type=""}/**
     * Class: Grid
     * 
     * Object representing the grid on which the plot is drawn.  The grid in this
     * context is the area bounded by the axes, the area which will contain the series.
     * Note, the series are drawn on their own canvas.
     * The Grid object cannot be instantiated directly, but is created by the Plot object.  
     * Grid properties can be set or overridden by the options passed in from the user.
     */
function Grid(){$.jqplot.ElemContainer.call(this),
// Group: Properties
// prop: drawGridlines
// whether to draw the gridlines on the plot.
this.drawGridlines=!0,
// prop: gridLineColor
// color of the grid lines.
this.gridLineColor="#cccccc",
// prop: gridLineWidth
// width of the grid lines.
this.gridLineWidth=1,
// prop: background
// css spec for the background color.
this.background="#fffdf6",
// prop: borderColor
// css spec for the color of the grid border.
this.borderColor="#999999",
// prop: borderWidth
// width of the border in pixels.
this.borderWidth=2,
// prop: drawBorder
// True to draw border around grid.
this.drawBorder=!0,
// prop: shadow
// whether to show a shadow behind the grid.
this.shadow=!0,
// prop: shadowAngle
// shadow angle in degrees
this.shadowAngle=45,
// prop: shadowOffset
// Offset of each shadow stroke from the border in pixels
this.shadowOffset=1.5,
// prop: shadowWidth
// width of the stoke for the shadow
this.shadowWidth=3,
// prop: shadowDepth
// Number of times shadow is stroked, each stroke offset shadowOffset from the last.
this.shadowDepth=3,
// prop: shadowColor
// an optional css color spec for the shadow in 'rgba(n, n, n, n)' form
this.shadowColor=null,
// prop: shadowAlpha
// Alpha channel transparency of shadow.  0 = transparent.
this.shadowAlpha="0.07",this._left,this._top,this._right,this._bottom,this._width,this._height,this._axes=[],
// prop: renderer
// Instance of a renderer which will actually render the grid,
// see <$.jqplot.CanvasGridRenderer>.
this.renderer=$.jqplot.CanvasGridRenderer,
// prop: rendererOptions
// Options to pass on to the renderer,
// see <$.jqplot.CanvasGridRenderer>.
this.rendererOptions={},this._offsets={top:null,bottom:null,left:null,right:null}}/**
     * Class: jqPlot
     * Plot object returned by call to $.jqplot.  Handles parsing user options,
     * creating sub objects (Axes, legend, title, series) and rendering the plot.
     */
function jqPlot(){
// sort the series data in increasing order.
function sortData(series){for(var d,i=0;i<series.length;i++)for(var check,bat=[series[i].data,series[i]._stackData,series[i]._plotData,series[i]._prevPlotData],n=0;4>n;n++)if(check=!0,d=bat[n],"x"==series[i]._stackAxis){for(var j=0;j<d.length;j++)if("number"!=typeof d[j][1]){check=!1;break}check&&d.sort(function(a,b){return a[1]-b[1]})}else{for(var j=0;j<d.length;j++)if("number"!=typeof d[j][0]){check=!1;break}check&&d.sort(function(a,b){return a[0]-b[0]})}}function getEventPosition(ev){var n,axis,plot=ev.data.plot,go=plot.eventCanvas._elem.offset(),gridPos={x:ev.pageX-go.left,y:ev.pageY-go.top},dataPos={xaxis:null,yaxis:null,x2axis:null,y2axis:null,y3axis:null,y4axis:null,y5axis:null,y6axis:null,y7axis:null,y8axis:null,y9axis:null,yMidAxis:null},an=["xaxis","yaxis","x2axis","y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis","yMidAxis"],ax=plot.axes;for(n=11;n>0;n--)axis=an[n-1],ax[axis].show&&(dataPos[axis]=ax[axis].series_p2u(gridPos[axis.charAt(0)]));return{offsets:go,gridPos:gridPos,dataPos:dataPos}}
// function to check if event location is over a area area
function checkIntersection(gridpos,plot){
// equations of right and left sides, returns x, y values given height of section (y value and 2 points)
function findedge(l,p1,p2){var m=(p1[1]-p2[1])/(p1[0]-p2[0]),b=p1[1]-m*p1[0],y=l+p1[1];return[(y-b)/m,y]}var i,j,k,s,r,x,y,theta,sm,sa,minang,maxang,d0,d,p,points,hp,threshold,t,series=plot.series;for(k=plot.seriesStack.length-1;k>=0;k--)switch(i=plot.seriesStack[k],s=series[i],hp=s._highlightThreshold,s.renderer.constructor){case $.jqplot.BarRenderer:for(x=gridpos.x,y=gridpos.y,j=0;j<s._barPoints.length;j++)if(points=s._barPoints[j],p=s.gridData[j],x>points[0][0]&&x<points[2][0]&&y>points[2][1]&&y<points[0][1])return{seriesIndex:s.index,pointIndex:j,gridData:p,data:s.data[j],points:s._barPoints[j]};break;case $.jqplot.PyramidRenderer:for(x=gridpos.x,y=gridpos.y,j=0;j<s._barPoints.length;j++)if(points=s._barPoints[j],p=s.gridData[j],x>points[0][0]+hp[0][0]&&x<points[2][0]+hp[2][0]&&y>points[2][1]&&y<points[0][1])return{seriesIndex:s.index,pointIndex:j,gridData:p,data:s.data[j],points:s._barPoints[j]};break;case $.jqplot.DonutRenderer:if(sa=s.startAngle/180*Math.PI,x=gridpos.x-s._center[0],y=gridpos.y-s._center[1],r=Math.sqrt(Math.pow(x,2)+Math.pow(y,2)),x>0&&-y>=0?theta=2*Math.PI-Math.atan(-y/x):x>0&&0>-y?theta=-Math.atan(-y/x):0>x?theta=Math.PI-Math.atan(-y/x):0==x&&-y>0?theta=3*Math.PI/2:0==x&&0>-y?theta=Math.PI/2:0==x&&0==y&&(theta=0),sa&&(theta-=sa,0>theta?theta+=2*Math.PI:theta>2*Math.PI&&(theta-=2*Math.PI)),sm=s.sliceMargin/180*Math.PI,r<s._radius&&r>s._innerRadius)for(j=0;j<s.gridData.length;j++)if(minang=j>0?s.gridData[j-1][1]+sm:sm,maxang=s.gridData[j][1],theta>minang&&maxang>theta)return{seriesIndex:s.index,pointIndex:j,gridData:[gridpos.x,gridpos.y],data:s.data[j]};break;case $.jqplot.PieRenderer:if(sa=s.startAngle/180*Math.PI,x=gridpos.x-s._center[0],y=gridpos.y-s._center[1],r=Math.sqrt(Math.pow(x,2)+Math.pow(y,2)),x>0&&-y>=0?theta=2*Math.PI-Math.atan(-y/x):x>0&&0>-y?theta=-Math.atan(-y/x):0>x?theta=Math.PI-Math.atan(-y/x):0==x&&-y>0?theta=3*Math.PI/2:0==x&&0>-y?theta=Math.PI/2:0==x&&0==y&&(theta=0),sa&&(theta-=sa,0>theta?theta+=2*Math.PI:theta>2*Math.PI&&(theta-=2*Math.PI)),sm=s.sliceMargin/180*Math.PI,r<s._radius)for(j=0;j<s.gridData.length;j++)if(minang=j>0?s.gridData[j-1][1]+sm:sm,maxang=s.gridData[j][1],theta>minang&&maxang>theta)return{seriesIndex:s.index,pointIndex:j,gridData:[gridpos.x,gridpos.y],data:s.data[j]};break;case $.jqplot.BubbleRenderer:x=gridpos.x,y=gridpos.y;var ret=null;if(s.show){for(var j=0;j<s.gridData.length;j++)p=s.gridData[j],d=Math.sqrt((x-p[0])*(x-p[0])+(y-p[1])*(y-p[1])),d<=p[2]&&(d0>=d||null==d0)&&(d0=d,ret={seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]});if(null!=ret)return ret}break;case $.jqplot.FunnelRenderer:x=gridpos.x,y=gridpos.y;var lex,rex,cv,v=s._vertices,vfirst=v[0],vlast=v[v.length-1];for(lex=findedge(y,vfirst[0],vlast[3]),rex=findedge(y,vfirst[1],vlast[2]),j=0;j<v.length;j++)if(cv=v[j],y>=cv[0][1]&&y<=cv[3][1]&&x>=lex[0]&&x<=rex[0])return{seriesIndex:s.index,pointIndex:j,gridData:null,data:s.data[j]};break;case $.jqplot.LineRenderer:if(x=gridpos.x,y=gridpos.y,r=s.renderer,s.show){if(!(!(s.fill||s.renderer.bands.show&&s.renderer.bands.fill)||plot.plugins.highlighter&&plot.plugins.highlighter.show)){
// first check if it is in bounding box
var inside=!1;if(x>s._boundingBox[0][0]&&x<s._boundingBox[1][0]&&y>s._boundingBox[1][1]&&y<s._boundingBox[0][1])for(var ii,numPoints=s._areaPoints.length,j=numPoints-1,ii=0;numPoints>ii;ii++){var vertex1=[s._areaPoints[ii][0],s._areaPoints[ii][1]],vertex2=[s._areaPoints[j][0],s._areaPoints[j][1]];(vertex1[1]<y&&vertex2[1]>=y||vertex2[1]<y&&vertex1[1]>=y)&&vertex1[0]+(y-vertex1[1])/(vertex2[1]-vertex1[1])*(vertex2[0]-vertex1[0])<x&&(inside=!inside),j=ii}if(inside)return{seriesIndex:i,pointIndex:null,gridData:s.gridData,data:s.data,points:s._areaPoints};break}t=s.markerRenderer.size/2+s.neighborThreshold,threshold=t>0?t:0;for(var j=0;j<s.gridData.length;j++)
// neighbor looks different to OHLC chart.
if(p=s.gridData[j],r.constructor==$.jqplot.OHLCRenderer)if(r.candleStick){var yp=s._yaxis.series_u2p;if(x>=p[0]-r._bodyWidth/2&&x<=p[0]+r._bodyWidth/2&&y>=yp(s.data[j][2])&&y<=yp(s.data[j][3]))return{seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}else if(r.hlc){var yp=s._yaxis.series_u2p;if(x>=p[0]-r._tickLength&&x<=p[0]+r._tickLength&&y>=yp(s.data[j][1])&&y<=yp(s.data[j][2]))return{seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}else{var yp=s._yaxis.series_u2p;if(x>=p[0]-r._tickLength&&x<=p[0]+r._tickLength&&y>=yp(s.data[j][2])&&y<=yp(s.data[j][3]))return{seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}else if(null!=p[0]&&null!=p[1]&&(d=Math.sqrt((x-p[0])*(x-p[0])+(y-p[1])*(y-p[1])),threshold>=d&&(d0>=d||null==d0)))return d0=d,{seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}break;default:if(x=gridpos.x,y=gridpos.y,r=s.renderer,s.show){t=s.markerRenderer.size/2+s.neighborThreshold,threshold=t>0?t:0;for(var j=0;j<s.gridData.length;j++)
// neighbor looks different to OHLC chart.
if(p=s.gridData[j],r.constructor==$.jqplot.OHLCRenderer)if(r.candleStick){var yp=s._yaxis.series_u2p;if(x>=p[0]-r._bodyWidth/2&&x<=p[0]+r._bodyWidth/2&&y>=yp(s.data[j][2])&&y<=yp(s.data[j][3]))return{seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}else if(r.hlc){var yp=s._yaxis.series_u2p;if(x>=p[0]-r._tickLength&&x<=p[0]+r._tickLength&&y>=yp(s.data[j][1])&&y<=yp(s.data[j][2]))return{seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}else{var yp=s._yaxis.series_u2p;if(x>=p[0]-r._tickLength&&x<=p[0]+r._tickLength&&y>=yp(s.data[j][2])&&y<=yp(s.data[j][3]))return{seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}else if(d=Math.sqrt((x-p[0])*(x-p[0])+(y-p[1])*(y-p[1])),threshold>=d&&(d0>=d||null==d0))return d0=d,{seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}}return null}
// Group: Properties
// These properties are specified at the top of the options object
// like so:
// > {
// >     axesDefaults:{min:0},
// >     series:[{color:'#6633dd'}],
// >     title: 'A Plot'
// > }
//
// prop: animate
// True to animate the series on initial plot draw (renderer dependent).
// Actual animation functionality must be supported in the renderer.
this.animate=!1,
// prop: animateReplot
// True to animate series after a call to the replot() method.
// Use with caution!  Replots can happen very frequently under
// certain circumstances (e.g. resizing, dragging points) and
// animation in these situations can cause problems.
this.animateReplot=!1,
// prop: axes
// up to 4 axes are supported, each with its own options, 
// See <Axis> for axis specific options.
this.axes={xaxis:new Axis("xaxis"),yaxis:new Axis("yaxis"),x2axis:new Axis("x2axis"),y2axis:new Axis("y2axis"),y3axis:new Axis("y3axis"),y4axis:new Axis("y4axis"),y5axis:new Axis("y5axis"),y6axis:new Axis("y6axis"),y7axis:new Axis("y7axis"),y8axis:new Axis("y8axis"),y9axis:new Axis("y9axis"),yMidAxis:new Axis("yMidAxis")},this.baseCanvas=new $.jqplot.GenericCanvas,
// true to intercept right click events and fire a 'jqplotRightClick' event.
// this will also block the context menu.
this.captureRightClick=!1,
// prop: data
// user's data.  Data should *NOT* be specified in the options object,
// but be passed in as the second argument to the $.jqplot() function.
// The data property is described here soley for reference. 
// The data should be in the form of an array of 2D or 1D arrays like
// > [ [[x1, y1], [x2, y2],...], [y1, y2, ...] ].
this.data=[],
// prop: dataRenderer
// A callable which can be used to preprocess data passed into the plot.
// Will be called with 3 arguments: the plot data, a reference to the plot,
// and the value of dataRendererOptions.
this.dataRenderer,
// prop: dataRendererOptions
// Options that will be passed to the dataRenderer.
// Can be of any type.
this.dataRendererOptions,this.defaults={
// prop: axesDefaults
// default options that will be applied to all axes.
// see <Axis> for axes options.
axesDefaults:{},axes:{xaxis:{},yaxis:{},x2axis:{},y2axis:{},y3axis:{},y4axis:{},y5axis:{},y6axis:{},y7axis:{},y8axis:{},y9axis:{},yMidAxis:{}},
// prop: seriesDefaults
// default options that will be applied to all series.
// see <Series> for series options.
seriesDefaults:{},series:[]},
// prop: defaultAxisStart
// 1-D data series are internally converted into 2-D [x,y] data point arrays
// by jqPlot.  This is the default starting value for the missing x or y value.
// The added data will be a monotonically increasing series (e.g. [1, 2, 3, ...])
// starting at this value.
this.defaultAxisStart=1,
// this.doCustomEventBinding = true;
// prop: drawIfHidden
// True to execute the draw method even if the plot target is hidden.
// Generally, this should be false.  Most plot elements will not be sized/
// positioned correclty if renderered into a hidden container.  To render into
// a hidden container, call the replot method when the container is shown.
this.drawIfHidden=!1,this.eventCanvas=new $.jqplot.GenericCanvas,
// prop: fillBetween
// Fill between 2 line series in a plot.
// Options object:
// {
//    series1: first index (0 based) of series in fill
//    series2: second index (0 based) of series in fill
//    color: color of fill [default fillColor of series1]
//    baseSeries:  fill will be drawn below this series (0 based index)
//    fill: false to turn off fill [default true].
//  }
this.fillBetween={series1:null,series2:null,color:null,baseSeries:0,fill:!0},
// prop; fontFamily
// css spec for the font-family attribute.  Default for the entire plot.
this.fontFamily,
// prop: fontSize
// css spec for the font-size attribute.  Default for the entire plot.
this.fontSize,
// prop: grid
// See <Grid> for grid specific options.
this.grid=new Grid,
// prop: legend
// see <$.jqplot.TableLegendRenderer>
this.legend=new Legend,
// prop: noDataIndicator
// Options to set up a mock plot with a data loading indicator if no data is specified.
this.noDataIndicator={show:!1,indicator:"Loading Data...",axes:{xaxis:{min:0,max:10,tickInterval:2,show:!0},yaxis:{min:0,max:12,tickInterval:3,show:!0}}},
// prop: negativeSeriesColors 
// colors to use for portions of the line below zero.
this.negativeSeriesColors=$.jqplot.config.defaultNegativeColors,
// container to hold all of the merged options.  Convienence for plugins.
this.options={},this.previousSeriesStack=[],
// Namespace to hold plugins.  Generally non-renderer plugins add themselves to here.
this.plugins={},
// prop: series
// Array of series object options.
// see <Series> for series specific options.
this.series=[],
// array of series indices. Keep track of order
// which series canvases are displayed, lowest
// to highest, back to front.
this.seriesStack=[],
// prop: seriesColors
// Ann array of CSS color specifications that will be applied, in order,
// to the series in the plot.  Colors will wrap around so, if their
// are more series than colors, colors will be reused starting at the
// beginning.  For pie charts, this specifies the colors of the slices.
this.seriesColors=$.jqplot.config.defaultColors,
// prop: sortData
// false to not sort the data passed in by the user.
// Many bar, stacked and other graphs as well as many plugins depend on
// having sorted data.
this.sortData=!0,
// prop: stackSeries
// true or false, creates a stack or "mountain" plot.
// Not all series renderers may implement this option.
this.stackSeries=!1,
// a shortcut for axis syncTicks options.  Not implemented yet.
this.syncXTicks=!0,
// a shortcut for axis syncTicks options.  Not implemented yet.
this.syncYTicks=!0,
// the jquery object for the dom target.
this.target=null,
// The id of the dom element to render the plot into
this.targetId=null,
// prop textColor
// css spec for the css color attribute.  Default for the entire plot.
this.textColor,
// prop: title
// Title object.  See <Title> for specific options.  As a shortcut, you
// can specify the title option as just a string like: title: 'My Plot'
// and this will create a new title object with the specified text.
this.title=new Title,
// Count how many times the draw method has been called while the plot is visible.
// Mostly used to test if plot has never been dran (=0), has been successfully drawn
// into a visible container once (=1) or draw more than once into a visible container.
// Can use this in tests to see if plot has been visibly drawn at least one time.
// After plot has been visibly drawn once, it generally doesn't need redrawing if its
// container is hidden and shown.
this._drawCount=0,
// sum of y values for all series in plot.
// used in mekko chart.
this._sumy=0,this._sumx=0,
// array to hold the cumulative stacked series data.
// used to ajust the individual series data, which won't have access to other
// series data.
this._stackData=[],
// array that holds the data to be plotted. This will be the series data
// merged with the the appropriate data from _stackData according to the stackAxis.
this._plotData=[],this._width=null,this._height=null,this._plotDimensions={height:null,width:null},this._gridPadding={top:null,right:null,bottom:null,left:null},this._defaultGridPadding={top:10,right:10,bottom:23,left:10},this._addDomReference=$.jqplot.config.addDomReference,this.preInitHooks=new $.jqplot.HooksManager,this.postInitHooks=new $.jqplot.HooksManager,this.preParseOptionsHooks=new $.jqplot.HooksManager,this.postParseOptionsHooks=new $.jqplot.HooksManager,this.preDrawHooks=new $.jqplot.HooksManager,this.postDrawHooks=new $.jqplot.HooksManager,this.preDrawSeriesHooks=new $.jqplot.HooksManager,this.postDrawSeriesHooks=new $.jqplot.HooksManager,this.preDrawLegendHooks=new $.jqplot.HooksManager,this.addLegendRowHooks=new $.jqplot.HooksManager,this.preSeriesInitHooks=new $.jqplot.HooksManager,this.postSeriesInitHooks=new $.jqplot.HooksManager,this.preParseSeriesOptionsHooks=new $.jqplot.HooksManager,this.postParseSeriesOptionsHooks=new $.jqplot.HooksManager,this.eventListenerHooks=new $.jqplot.EventListenerManager,this.preDrawSeriesShadowHooks=new $.jqplot.HooksManager,this.postDrawSeriesShadowHooks=new $.jqplot.HooksManager,this.colorGenerator=new $.jqplot.ColorGenerator,this.negativeColorGenerator=new $.jqplot.ColorGenerator,this.canvasManager=new $.jqplot.CanvasManager,this.themeEngine=new $.jqplot.ThemeEngine;
// Group: methods
//
// method: init
// sets the plot target, checks data and applies user
// options to plot.
this.init=function(target,data,options){options=options||{};for(var i=0;i<$.jqplot.preInitHooks.length;i++)$.jqplot.preInitHooks[i].call(this,target,data,options);for(var i=0;i<this.preInitHooks.hooks.length;i++)this.preInitHooks.hooks[i].call(this,target,data,options);if(this.targetId="#"+target,this.target=$("#"+target),
//////
// Add a reference to plot
//////
this._addDomReference&&this.target.data("jqplot",this),
// remove any error class that may be stuck on target.
this.target.removeClass("jqplot-error"),!this.target.get(0))throw new Error("No plot target specified");
// if no height or width specified, use a default.
if(
// make sure the target is positioned by some means and set css
"static"==this.target.css("position")&&this.target.css("position","relative"),this.target.hasClass("jqplot-target")||this.target.addClass("jqplot-target"),this.target.height())this._height=h=this.target.height();else{var h;h=options&&options.height?parseInt(options.height,10):this.target.attr("data-height")?parseInt(this.target.attr("data-height"),10):parseInt($.jqplot.config.defaultHeight,10),this._height=h,this.target.css("height",h+"px")}if(this.target.width())this._width=w=this.target.width();else{var w;w=options&&options.width?parseInt(options.width,10):this.target.attr("data-width")?parseInt(this.target.attr("data-width"),10):parseInt($.jqplot.config.defaultWidth,10),this._width=w,this.target.css("width",w+"px")}for(var i=0,l=_axisNames.length;l>i;i++)this.axes[_axisNames[i]]=new Axis(_axisNames[i]);if(this._plotDimensions.height=this._height,this._plotDimensions.width=this._width,this.grid._plotDimensions=this._plotDimensions,this.title._plotDimensions=this._plotDimensions,this.baseCanvas._plotDimensions=this._plotDimensions,this.eventCanvas._plotDimensions=this._plotDimensions,this.legend._plotDimensions=this._plotDimensions,this._height<=0||this._width<=0||!this._height||!this._width)throw new Error("Canvas dimension not set");if(options.dataRenderer&&$.isFunction(options.dataRenderer)&&(options.dataRendererOptions&&(this.dataRendererOptions=options.dataRendererOptions),this.dataRenderer=options.dataRenderer,data=this.dataRenderer(data,this,this.dataRendererOptions)),options.noDataIndicator&&$.isPlainObject(options.noDataIndicator)&&$.extend(!0,this.noDataIndicator,options.noDataIndicator),null==data||0==$.isArray(data)||0==data.length||0==$.isArray(data[0])||0==data[0].length){if(0==this.noDataIndicator.show)throw new Error("No data specified");
// have to be descructive here in order for plot to not try and render series.
// This means that $.jqplot() will have to be called again when there is data.
//delete options.series;
for(var ax in this.noDataIndicator.axes)for(var prop in this.noDataIndicator.axes[ax])this.axes[ax][prop]=this.noDataIndicator.axes[ax][prop];this.postDrawHooks.add(function(){var eh=this.eventCanvas.getHeight(),ew=this.eventCanvas.getWidth(),temp=$('<div class="jqplot-noData-container" style="position:absolute;"></div>');this.target.append(temp),temp.height(eh),temp.width(ew),temp.css("top",this.eventCanvas._offsets.top),temp.css("left",this.eventCanvas._offsets.left);var temp2=$('<div class="jqplot-noData-contents" style="text-align:center; position:relative; margin-left:auto; margin-right:auto;"></div>');temp.append(temp2),temp2.html(this.noDataIndicator.indicator);var th=temp2.height(),tw=temp2.width();temp2.height(th),temp2.width(tw),temp2.css("top",(eh-th)/2+"px")})}
// make a copy of the data
this.data=$.extend(!0,[],data),this.parseOptions(options),this.textColor&&this.target.css("color",this.textColor),this.fontFamily&&this.target.css("font-family",this.fontFamily),this.fontSize&&this.target.css("font-size",this.fontSize),this.title.init(),this.legend.init(),this._sumy=0,this._sumx=0,this.computePlotData();for(var i=0;i<this.series.length;i++){
// set default stacking order for series canvases
this.seriesStack.push(i),this.previousSeriesStack.push(i),this.series[i].shadowCanvas._plotDimensions=this._plotDimensions,this.series[i].canvas._plotDimensions=this._plotDimensions;for(var j=0;j<$.jqplot.preSeriesInitHooks.length;j++)$.jqplot.preSeriesInitHooks[j].call(this.series[i],target,this.data,this.options.seriesDefaults,this.options.series[i],this);for(var j=0;j<this.preSeriesInitHooks.hooks.length;j++)this.preSeriesInitHooks.hooks[j].call(this.series[i],target,this.data,this.options.seriesDefaults,this.options.series[i],this);
// this.populatePlotData(this.series[i], i);
this.series[i]._plotDimensions=this._plotDimensions,this.series[i].init(i,this.grid.borderWidth,this);for(var j=0;j<$.jqplot.postSeriesInitHooks.length;j++)$.jqplot.postSeriesInitHooks[j].call(this.series[i],target,this.data,this.options.seriesDefaults,this.options.series[i],this);for(var j=0;j<this.postSeriesInitHooks.hooks.length;j++)this.postSeriesInitHooks.hooks[j].call(this.series[i],target,this.data,this.options.seriesDefaults,this.options.series[i],this);this._sumy+=this.series[i]._sumy,this._sumx+=this.series[i]._sumx}for(var name,axis,i=0,l=_axisNames.length;l>i;i++)name=_axisNames[i],axis=this.axes[name],axis._plotDimensions=this._plotDimensions,axis.init(),null==this.axes[name].borderColor&&("x"!==name.charAt(0)&&axis.useSeriesColor===!0&&axis.show?axis.borderColor=axis._series[0].color:axis.borderColor=this.grid.borderColor);this.sortData&&sortData(this.series),this.grid.init(),this.grid._axes=this.axes,this.legend._series=this.series;for(var i=0;i<$.jqplot.postInitHooks.length;i++)$.jqplot.postInitHooks[i].call(this,target,this.data,options);for(var i=0;i<this.postInitHooks.hooks.length;i++)this.postInitHooks.hooks[i].call(this,target,this.data,options)},
// method: resetAxesScale
// Reset the specified axes min, max, numberTicks and tickInterval properties to null
// or reset these properties on all axes if no list of axes is provided.
//
// Parameters:
// axes - Boolean to reset or not reset all axes or an array or object of axis names to reset.
this.resetAxesScale=function(axes,options){var opts=options||{},ax=axes||this.axes;if(ax===!0&&(ax=this.axes),$.isArray(ax))for(var i=0;i<ax.length;i++)this.axes[ax[i]].resetScale(opts[ax[i]]);else if("object"==typeof ax)for(var name in ax)this.axes[name].resetScale(opts[name])},
// method: reInitialize
// reinitialize plot for replotting.
// not called directly.
this.reInitialize=function(data,opts){for(var options=$.extend(!0,{},this.options,opts),target=this.targetId.substr(1),tdata=null==data?this.data:data,i=0;i<$.jqplot.preInitHooks.length;i++)$.jqplot.preInitHooks[i].call(this,target,tdata,options);for(var i=0;i<this.preInitHooks.hooks.length;i++)this.preInitHooks.hooks[i].call(this,target,tdata,options);if(this._height=this.target.height(),this._width=this.target.width(),this._height<=0||this._width<=0||!this._height||!this._width)throw new Error("Target dimension not set");this._plotDimensions.height=this._height,this._plotDimensions.width=this._width,this.grid._plotDimensions=this._plotDimensions,this.title._plotDimensions=this._plotDimensions,this.baseCanvas._plotDimensions=this._plotDimensions,this.eventCanvas._plotDimensions=this._plotDimensions,this.legend._plotDimensions=this._plotDimensions;for(var name,t,j,axis,i=0,l=_axisNames.length;l>i;i++){name=_axisNames[i],axis=this.axes[name],
// Memory Leaks patch : clear ticks elements
t=axis._ticks;for(var j=0,tlen=t.length;tlen>j;j++){var el=t[j]._elem;el&&(
// if canvas renderer
$.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined&&window.G_vmlCanvasManager.uninitElement(el.get(0)),el.emptyForce(),el=null,t._elem=null)}t=null,delete axis.ticks,delete axis._ticks,this.axes[name]=new Axis(name),this.axes[name]._plotWidth=this._width,this.axes[name]._plotHeight=this._height}data&&(options.dataRenderer&&$.isFunction(options.dataRenderer)&&(options.dataRendererOptions&&(this.dataRendererOptions=options.dataRendererOptions),this.dataRenderer=options.dataRenderer,data=this.dataRenderer(data,this,this.dataRendererOptions)),
// make a copy of the data
this.data=$.extend(!0,[],data)),opts&&this.parseOptions(options),this.title._plotWidth=this._width,this.textColor&&this.target.css("color",this.textColor),this.fontFamily&&this.target.css("font-family",this.fontFamily),this.fontSize&&this.target.css("font-size",this.fontSize),this.title.init(),this.legend.init(),this._sumy=0,this._sumx=0,this.seriesStack=[],this.previousSeriesStack=[],this.computePlotData();for(var i=0,l=this.series.length;l>i;i++){
// set default stacking order for series canvases
this.seriesStack.push(i),this.previousSeriesStack.push(i),this.series[i].shadowCanvas._plotDimensions=this._plotDimensions,this.series[i].canvas._plotDimensions=this._plotDimensions;for(var j=0;j<$.jqplot.preSeriesInitHooks.length;j++)$.jqplot.preSeriesInitHooks[j].call(this.series[i],target,this.data,this.options.seriesDefaults,this.options.series[i],this);for(var j=0;j<this.preSeriesInitHooks.hooks.length;j++)this.preSeriesInitHooks.hooks[j].call(this.series[i],target,this.data,this.options.seriesDefaults,this.options.series[i],this);
// this.populatePlotData(this.series[i], i);
this.series[i]._plotDimensions=this._plotDimensions,this.series[i].init(i,this.grid.borderWidth,this);for(var j=0;j<$.jqplot.postSeriesInitHooks.length;j++)$.jqplot.postSeriesInitHooks[j].call(this.series[i],target,this.data,this.options.seriesDefaults,this.options.series[i],this);for(var j=0;j<this.postSeriesInitHooks.hooks.length;j++)this.postSeriesInitHooks.hooks[j].call(this.series[i],target,this.data,this.options.seriesDefaults,this.options.series[i],this);this._sumy+=this.series[i]._sumy,this._sumx+=this.series[i]._sumx}for(var i=0,l=_axisNames.length;l>i;i++)name=_axisNames[i],axis=this.axes[name],axis._plotDimensions=this._plotDimensions,axis.init(),null==axis.borderColor&&("x"!==name.charAt(0)&&axis.useSeriesColor===!0&&axis.show?axis.borderColor=axis._series[0].color:axis.borderColor=this.grid.borderColor);this.sortData&&sortData(this.series),this.grid.init(),this.grid._axes=this.axes,this.legend._series=this.series;for(var i=0,l=$.jqplot.postInitHooks.length;l>i;i++)$.jqplot.postInitHooks[i].call(this,target,this.data,options);for(var i=0,l=this.postInitHooks.hooks.length;l>i;i++)this.postInitHooks.hooks[i].call(this,target,this.data,options)},
// method: quickInit
// 
// Quick reinitialization plot for replotting.
// Does not parse options ore recreate axes and series.
// not called directly.
this.quickInit=function(){if(
// Plot should be visible and have a height and width.
// If plot doesn't have height and width for some
// reason, set it by other means.  Plot must not have
// a display:none attribute, however.
this._height=this.target.height(),this._width=this.target.width(),this._height<=0||this._width<=0||!this._height||!this._width)throw new Error("Target dimension not set");this._plotDimensions.height=this._height,this._plotDimensions.width=this._width,this.grid._plotDimensions=this._plotDimensions,this.title._plotDimensions=this._plotDimensions,this.baseCanvas._plotDimensions=this._plotDimensions,this.eventCanvas._plotDimensions=this._plotDimensions,this.legend._plotDimensions=this._plotDimensions;for(var n in this.axes)this.axes[n]._plotWidth=this._width,this.axes[n]._plotHeight=this._height;this.title._plotWidth=this._width,this.textColor&&this.target.css("color",this.textColor),this.fontFamily&&this.target.css("font-family",this.fontFamily),this.fontSize&&this.target.css("font-size",this.fontSize),this._sumy=0,this._sumx=0,this.computePlotData();for(var i=0;i<this.series.length;i++)
// this.populatePlotData(this.series[i], i);
"line"===this.series[i]._type&&this.series[i].renderer.bands.show&&this.series[i].renderer.initBands.call(this.series[i],this.series[i].renderer.options,this),this.series[i]._plotDimensions=this._plotDimensions,this.series[i].canvas._plotDimensions=this._plotDimensions,
//this.series[i].init(i, this.grid.borderWidth);
this._sumy+=this.series[i]._sumy,this._sumx+=this.series[i]._sumx;for(var name,j=0;12>j;j++){name=_axisNames[j];for(var t=this.axes[name]._ticks,i=0;i<t.length;i++){var el=t[i]._elem;el&&(
// if canvas renderer
$.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined&&window.G_vmlCanvasManager.uninitElement(el.get(0)),el.emptyForce(),el=null,t._elem=null)}t=null,this.axes[name]._plotDimensions=this._plotDimensions,this.axes[name]._ticks=[]}this.sortData&&sortData(this.series),this.grid._axes=this.axes,this.legend._series=this.series},this.computePlotData=function(){this._plotData=[],this._stackData=[];var series,index,l;for(index=0,l=this.series.length;l>index;index++){series=this.series[index],this._plotData.push([]),this._stackData.push([]);var cd=series.data;this._plotData[index]=$.extend(!0,[],cd),this._stackData[index]=$.extend(!0,[],cd),series._plotData=this._plotData[index],series._stackData=this._stackData[index];var plotValues={x:[],y:[]};if(this.stackSeries&&!series.disableStack){series._stack=!0;for(var sidx="x"===series._stackAxis?0:1,k=0,cdl=cd.length;cdl>k;k++){var temp=cd[k][sidx];if(null==temp&&(temp=0),this._plotData[index][k][sidx]=temp,this._stackData[index][k][sidx]=temp,index>0)for(var j=index;j--;){var prevval=this._plotData[j][k][sidx];
// only need to sum up the stack axis column of data
// and only sum if it is of same sign.
// if previous series isn't same sign, keep looking
// at earlier series untill we find one of same sign.
if(temp*prevval>=0){this._plotData[index][k][sidx]+=prevval,this._stackData[index][k][sidx]+=prevval;break}}}}else{for(var i=0;i<series.data.length;i++)plotValues.x.push(series.data[i][0]),plotValues.y.push(series.data[i][1]);this._stackData.push(series.data),this.series[index]._stackData=series.data,this._plotData.push(series.data),series._plotData=series.data,series._plotValues=plotValues}for(index>0&&(series._prevPlotData=this.series[index-1]._plotData),series._sumy=0,series._sumx=0,i=series.data.length-1;i>-1;i--)series._sumy+=series.data[i][1],series._sumx+=series.data[i][0]}},
// populate the _stackData and _plotData arrays for the plot and the series.
this.populatePlotData=function(series,index){
// if a stacked chart, compute the stacked data
this._plotData=[],this._stackData=[],series._stackData=[],series._plotData=[];var plotValues={x:[],y:[]};if(this.stackSeries&&!series.disableStack){series._stack=!0;
// for first series, nothing to add to stackData.
for(var tempx,tempy,dval,stackval,sidx="x"===series._stackAxis?0:1,temp=$.extend(!0,[],series.data),plotdata=$.extend(!0,[],series.data),j=0;index>j;j++)for(var cd=this.series[j].data,k=0;k<cd.length;k++)dval=cd[k],tempx=null!=dval[0]?dval[0]:0,tempy=null!=dval[1]?dval[1]:0,temp[k][0]+=tempx,temp[k][1]+=tempy,stackval=sidx?tempy:tempx,series.data[k][sidx]*stackval>=0&&(plotdata[k][sidx]+=stackval);for(var i=0;i<plotdata.length;i++)plotValues.x.push(plotdata[i][0]),plotValues.y.push(plotdata[i][1]);this._plotData.push(plotdata),this._stackData.push(temp),series._stackData=temp,series._plotData=plotdata,series._plotValues=plotValues}else{for(var i=0;i<series.data.length;i++)plotValues.x.push(series.data[i][0]),plotValues.y.push(series.data[i][1]);this._stackData.push(series.data),this.series[index]._stackData=series.data,this._plotData.push(series.data),series._plotData=series.data,series._plotValues=plotValues}for(index>0&&(series._prevPlotData=this.series[index-1]._plotData),series._sumy=0,series._sumx=0,i=series.data.length-1;i>-1;i--)series._sumy+=series.data[i][1],series._sumx+=series.data[i][0]},
// function to safely return colors from the color array and wrap around at the end.
this.getNextSeriesColor=function(t){var idx=0,sc=t.seriesColors;return function(){return idx<sc.length?sc[idx++]:(idx=0,sc[idx++])}}(this),this.parseOptions=function(options){for(var i=0;i<this.preParseOptionsHooks.hooks.length;i++)this.preParseOptionsHooks.hooks[i].call(this,options);for(var i=0;i<$.jqplot.preParseOptionsHooks.length;i++)$.jqplot.preParseOptionsHooks[i].call(this,options);this.options=$.extend(!0,{},this.defaults,options);var opts=this.options;if(this.animate=opts.animate,this.animateReplot=opts.animateReplot,this.stackSeries=opts.stackSeries,$.isPlainObject(opts.fillBetween))for(var tempi,temp=["series1","series2","color","baseSeries","fill"],i=0,l=temp.length;l>i;i++)tempi=temp[i],null!=opts.fillBetween[tempi]&&(this.fillBetween[tempi]=opts.fillBetween[tempi]);opts.seriesColors&&(this.seriesColors=opts.seriesColors),opts.negativeSeriesColors&&(this.negativeSeriesColors=opts.negativeSeriesColors),opts.captureRightClick&&(this.captureRightClick=opts.captureRightClick),this.defaultAxisStart=options&&null!=options.defaultAxisStart?options.defaultAxisStart:this.defaultAxisStart,this.colorGenerator.setColors(this.seriesColors),this.negativeColorGenerator.setColors(this.negativeSeriesColors),
// var cg = new this.colorGenerator(this.seriesColors);
// var ncg = new this.colorGenerator(this.negativeSeriesColors);
// this._gridPadding = this.options.gridPadding;
$.extend(!0,this._gridPadding,opts.gridPadding),this.sortData=null!=opts.sortData?opts.sortData:this.sortData;for(var i=0;12>i;i++){var n=_axisNames[i],axis=this.axes[n];axis._options=$.extend(!0,{},opts.axesDefaults,opts.axes[n]),$.extend(!0,axis,opts.axesDefaults,opts.axes[n]),axis._plotWidth=this._width,axis._plotHeight=this._height}
// if (this.data.length == 0) {
//     this.data = [];
//     for (var i=0; i<this.options.series.length; i++) {
//         this.data.push(this.options.series.data);
//     }    
// }
var normalizeData=function(data,dir,start){
// return data as an array of point arrays,
// in form [[x1,y1...], [x2,y2...], ...]
var i,l,temp=[];if(dir=dir||"vertical",$.isArray(data[0]))
// we have a properly formatted data series, copy it.
$.extend(!0,temp,data);else
// we have a series of scalars.  One line with just y values.
// turn the scalar list of data into a data array of form:
// [[1, data[0]], [2, data[1]], ...]
for(i=0,l=data.length;l>i;i++)"vertical"==dir?temp.push([start+i,data[i]]):temp.push([data[i],start+i]);return temp};this.series=[];for(var i=0;i<this.data.length;i++){for(var sopts=$.extend(!0,{index:i},{seriesColors:this.seriesColors,negativeSeriesColors:this.negativeSeriesColors},this.options.seriesDefaults,this.options.series[i],{rendererOptions:{animation:{show:this.animate}}}),temp=new Series(sopts),j=0;j<$.jqplot.preParseSeriesOptionsHooks.length;j++)$.jqplot.preParseSeriesOptionsHooks[j].call(temp,this.options.seriesDefaults,this.options.series[i]);for(var j=0;j<this.preParseSeriesOptionsHooks.hooks.length;j++)this.preParseSeriesOptionsHooks.hooks[j].call(temp,this.options.seriesDefaults,this.options.series[i]);
// Now go back and apply the options to the series.  Really should just do this during initializaiton, but don't want to
// mess up preParseSeriesOptionsHooks at this point.
$.extend(!0,temp,sopts);var dir="vertical";switch(temp.renderer===$.jqplot.BarRenderer&&temp.rendererOptions&&"horizontal"==temp.rendererOptions.barDirection&&(dir="horizontal",temp._stackAxis="x",temp._primaryAxis="_yaxis"),temp.data=normalizeData(this.data[i],dir,this.defaultAxisStart),temp.xaxis){case"xaxis":temp._xaxis=this.axes.xaxis;break;case"x2axis":temp._xaxis=this.axes.x2axis}temp._yaxis=this.axes[temp.yaxis],temp._xaxis._series.push(temp),temp._yaxis._series.push(temp),temp.show?(temp._xaxis.show=!0,temp._yaxis.show=!0):(temp._xaxis.scaleToHiddenSeries&&(temp._xaxis.show=!0),temp._yaxis.scaleToHiddenSeries&&(temp._yaxis.show=!0)),
// // parse the renderer options and apply default colors if not provided
// if (!temp.color && temp.show != false) {
//     temp.color = cg.next();
//     colorIndex = cg.getIndex() - 1;;
// }
// if (!temp.negativeColor && temp.show != false) {
//     temp.negativeColor = ncg.get(colorIndex);
//     ncg.setIndex(colorIndex);
// }
temp.label||(temp.label="Series "+(i+1).toString()),
// temp.rendererOptions.show = temp.show;
// $.extend(true, temp.renderer, {color:this.seriesColors[i]}, this.rendererOptions);
this.series.push(temp);for(var j=0;j<$.jqplot.postParseSeriesOptionsHooks.length;j++)$.jqplot.postParseSeriesOptionsHooks[j].call(this.series[i],this.options.seriesDefaults,this.options.series[i]);for(var j=0;j<this.postParseSeriesOptionsHooks.hooks.length;j++)this.postParseSeriesOptionsHooks.hooks[j].call(this.series[i],this.options.seriesDefaults,this.options.series[i])}
// copy the grid and title options into this object.
$.extend(!0,this.grid,this.options.grid);
// if axis border properties aren't set, set default.
for(var i=0,l=_axisNames.length;l>i;i++){var n=_axisNames[i],axis=this.axes[n];null==axis.borderWidth&&(axis.borderWidth=this.grid.borderWidth)}"string"==typeof this.options.title?this.title.text=this.options.title:"object"==typeof this.options.title&&$.extend(!0,this.title,this.options.title),this.title._plotWidth=this._width,this.legend.setOptions(this.options.legend);for(var i=0;i<$.jqplot.postParseOptionsHooks.length;i++)$.jqplot.postParseOptionsHooks[i].call(this,options);for(var i=0;i<this.postParseOptionsHooks.hooks.length;i++)this.postParseOptionsHooks.hooks[i].call(this,options)},
// method: destroy
// Releases all resources occupied by the plot
this.destroy=function(){this.canvasManager.freeAllCanvases(),this.eventCanvas&&this.eventCanvas._elem&&this.eventCanvas._elem.unbind(),
// Couple of posts on Stack Overflow indicate that empty() doesn't
// always cear up the dom and release memory.  Sometimes setting
// innerHTML property to null is needed.  Particularly on IE, may 
// have to directly set it to null, bypassing $.
this.target.empty(),this.target[0].innerHTML=""},
// method: replot
// Does a reinitialization of the plot followed by
// a redraw.  Method could be used to interactively
// change plot characteristics and then replot.
//
// Parameters:
// options - Options used for replotting.
//
// Properties:
// clear - false to not clear (empty) the plot container before replotting (default: true).
// resetAxes - true to reset all axes min, max, numberTicks and tickInterval setting so axes will rescale themselves.
//             optionally pass in list of axes to reset (e.g. ['xaxis', 'y2axis']) (default: false).
this.replot=function(options){var opts=options||{},data=opts.data||null,clear=opts.clear===!1?!1:!0,resetAxes=opts.resetAxes||!1;delete opts.data,delete opts.clear,delete opts.resetAxes,this.target.trigger("jqplotPreReplot"),clear&&this.destroy(),
// if have data or other options, full reinit.
// otherwise, quickinit.
data||!$.isEmptyObject(opts)?this.reInitialize(data,opts):this.quickInit(),resetAxes&&this.resetAxesScale(resetAxes,opts.axes),this.draw(),this.target.trigger("jqplotPostReplot")},
// method: redraw
// Empties the plot target div and redraws the plot.
// This enables plot data and properties to be changed
// and then to comletely clear the plot and redraw.
// redraw *will not* reinitialize any plot elements.
// That is, axes will not be autoscaled and defaults
// will not be reapplied to any plot elements.  redraw
// is used primarily with zooming. 
//
// Parameters:
// clear - false to not clear (empty) the plot container before redrawing (default: true).
this.redraw=function(clear){clear=null!=clear?clear:!0,this.target.trigger("jqplotPreRedraw"),clear&&(this.canvasManager.freeAllCanvases(),this.eventCanvas._elem.unbind(),this.target.empty());for(var ax in this.axes)this.axes[ax]._ticks=[];this.computePlotData(),
// for (var i=0; i<this.series.length; i++) {
//     this.populatePlotData(this.series[i], i);
// }
this._sumy=0,this._sumx=0;for(var i=0,tsl=this.series.length;tsl>i;i++)this._sumy+=this.series[i]._sumy,this._sumx+=this.series[i]._sumx;this.draw(),this.target.trigger("jqplotPostRedraw")},
// method: draw
// Draws all elements of the plot into the container.
// Does not clear the container before drawing.
this.draw=function(){if(this.drawIfHidden||this.target.is(":visible")){this.target.trigger("jqplotPreDraw");var i,j,l;for(i=0,l=$.jqplot.preDrawHooks.length;l>i;i++)$.jqplot.preDrawHooks[i].call(this);for(i=0,l=this.preDrawHooks.hooks.length;l>i;i++)this.preDrawHooks.hooks[i].apply(this,this.preDrawSeriesHooks.args[i]);
// create an underlying canvas to be used for special features.
this.target.append(this.baseCanvas.createElement({left:0,right:0,top:0,bottom:0},"jqplot-base-canvas",null,this)),this.baseCanvas.setContext(),this.target.append(this.title.draw()),this.title.pack({top:0,left:0});
// make room  for the legend between the grid and the edge.
// pass a dummy offsets object and a reference to the plot.
var legendElem=this.legend.draw({},this),gridPadding={top:0,left:0,bottom:0,right:0};if("outsideGrid"==this.legend.placement){switch(
// temporarily append the legend to get dimensions
this.target.append(legendElem),this.legend.location){case"n":gridPadding.top+=this.legend.getHeight();break;case"s":gridPadding.bottom+=this.legend.getHeight();break;case"ne":case"e":case"se":gridPadding.right+=this.legend.getWidth();break;case"nw":case"w":case"sw":gridPadding.left+=this.legend.getWidth();break;default:// same as 'ne'
gridPadding.right+=this.legend.getWidth()}legendElem=legendElem.detach()}var name,ax=this.axes;
// draw the yMidAxis first, so xaxis of pyramid chart can adjust itself if needed.
for(i=0;12>i;i++)name=_axisNames[i],this.target.append(ax[name].draw(this.baseCanvas._ctx,this)),ax[name].set();ax.yaxis.show&&(gridPadding.left+=ax.yaxis.getWidth());var n,ra=["y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis"],rapad=[0,0,0,0,0,0,0,0],gpr=0;for(n=0;8>n;n++)ax[ra[n]].show&&(gpr+=ax[ra[n]].getWidth(),rapad[n]=gpr);
// end of gridPadding adjustments.
// if user passed in gridDimensions option, check against calculated gridPadding
if(gridPadding.right+=gpr,ax.x2axis.show&&(gridPadding.top+=ax.x2axis.getHeight()),this.title.show&&(gridPadding.top+=this.title.getHeight()),ax.xaxis.show&&(gridPadding.bottom+=ax.xaxis.getHeight()),this.options.gridDimensions&&$.isPlainObject(this.options.gridDimensions)){var gdw=parseInt(this.options.gridDimensions.width,10)||0,gdh=parseInt(this.options.gridDimensions.height,10)||0,widthAdj=(this._width-gridPadding.left-gridPadding.right-gdw)/2,heightAdj=(this._height-gridPadding.top-gridPadding.bottom-gdh)/2;heightAdj>=0&&widthAdj>=0&&(gridPadding.top+=heightAdj,gridPadding.bottom+=heightAdj,gridPadding.left+=widthAdj,gridPadding.right+=widthAdj)}var arr=["top","bottom","left","right"];for(var n in arr)null==this._gridPadding[arr[n]]&&gridPadding[arr[n]]>0?this._gridPadding[arr[n]]=gridPadding[arr[n]]:null==this._gridPadding[arr[n]]&&(this._gridPadding[arr[n]]=this._defaultGridPadding[arr[n]]);var legendPadding=this._gridPadding;for("outsideGrid"===this.legend.placement&&(legendPadding={top:this.title.getHeight(),left:0,right:0,bottom:0},"s"===this.legend.location&&(legendPadding.left=this._gridPadding.left,legendPadding.right=this._gridPadding.right)),ax.xaxis.pack({position:"absolute",bottom:this._gridPadding.bottom-ax.xaxis.getHeight(),left:0,width:this._width},{min:this._gridPadding.left,max:this._width-this._gridPadding.right}),ax.yaxis.pack({position:"absolute",top:0,left:this._gridPadding.left-ax.yaxis.getWidth(),height:this._height},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top}),ax.x2axis.pack({position:"absolute",top:this._gridPadding.top-ax.x2axis.getHeight(),left:0,width:this._width},{min:this._gridPadding.left,max:this._width-this._gridPadding.right}),i=8;i>0;i--)ax[ra[i-1]].pack({position:"absolute",top:0,right:this._gridPadding.right-rapad[i-1]},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top});var ltemp=(this._width-this._gridPadding.left-this._gridPadding.right)/2+this._gridPadding.left-ax.yMidAxis.getWidth()/2;ax.yMidAxis.pack({position:"absolute",top:0,left:ltemp,zIndex:9,textAlign:"center"},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top}),this.target.append(this.grid.createElement(this._gridPadding,this)),this.grid.draw();var series=this.series,seriesLength=series.length;
// put the shadow canvases behind the series canvases so shadows don't overlap on stacked bars.
for(i=0,l=seriesLength;l>i;i++)j=this.seriesStack[i],this.target.append(series[j].shadowCanvas.createElement(this._gridPadding,"jqplot-series-shadowCanvas",null,this)),series[j].shadowCanvas.setContext(),series[j].shadowCanvas._elem.data("seriesIndex",j);for(i=0,l=seriesLength;l>i;i++)j=this.seriesStack[i],this.target.append(series[j].canvas.createElement(this._gridPadding,"jqplot-series-canvas",null,this)),series[j].canvas.setContext(),series[j].canvas._elem.data("seriesIndex",j);
// Need to use filled canvas to capture events in IE.
// Also, canvas seems to block selection of other elements in document on FF.
this.target.append(this.eventCanvas.createElement(this._gridPadding,"jqplot-event-canvas",null,this)),this.eventCanvas.setContext(),this.eventCanvas._ctx.fillStyle="rgba(0,0,0,0)",this.eventCanvas._ctx.fillRect(0,0,this.eventCanvas._ctx.canvas.width,this.eventCanvas._ctx.canvas.height),
// bind custom event handlers to regular events.
this.bindCustomEvents(),
// draw legend before series if the series needs to know the legend dimensions.
this.legend.preDraw?(this.eventCanvas._elem.before(legendElem),this.legend.pack(legendPadding),this.legend._elem?this.drawSeries({legendInfo:{location:this.legend.location,placement:this.legend.placement,width:this.legend.getWidth(),height:this.legend.getHeight(),xoffset:this.legend.xoffset,yoffset:this.legend.yoffset}}):this.drawSeries()):(// draw series before legend
this.drawSeries(),seriesLength&&$(series[seriesLength-1].canvas._elem).after(legendElem),this.legend.pack(legendPadding));
// register event listeners on the overlay canvas
for(var i=0,l=$.jqplot.eventListenerHooks.length;l>i;i++)
// in the handler, this will refer to the eventCanvas dom element.
// make sure there are references back into plot objects.
this.eventCanvas._elem.bind($.jqplot.eventListenerHooks[i][0],{plot:this},$.jqplot.eventListenerHooks[i][1]);
// register event listeners on the overlay canvas
for(var i=0,l=this.eventListenerHooks.hooks.length;l>i;i++)
// in the handler, this will refer to the eventCanvas dom element.
// make sure there are references back into plot objects.
this.eventCanvas._elem.bind(this.eventListenerHooks.hooks[i][0],{plot:this},this.eventListenerHooks.hooks[i][1]);var fb=this.fillBetween;fb.fill&&fb.series1!==fb.series2&&fb.series1<seriesLength&&fb.series2<seriesLength&&"line"===series[fb.series1]._type&&"line"===series[fb.series2]._type&&this.doFillBetweenLines();for(var i=0,l=$.jqplot.postDrawHooks.length;l>i;i++)$.jqplot.postDrawHooks[i].call(this);for(var i=0,l=this.postDrawHooks.hooks.length;l>i;i++)this.postDrawHooks.hooks[i].apply(this,this.postDrawHooks.args[i]);this.target.is(":visible")&&(this._drawCount+=1);var temps,tempr,sel,_els;
// ughh.  ideally would hide all series then show them.
for(i=0,l=seriesLength;l>i;i++)temps=series[i],tempr=temps.renderer,sel=".jqplot-point-label.jqplot-series-"+i,tempr.animation&&tempr.animation._supported&&tempr.animation.show&&(this._drawCount<2||this.animateReplot)&&(_els=this.target.find(sel),_els.stop(!0,!0).hide(),temps.canvas._elem.stop(!0,!0).hide(),temps.shadowCanvas._elem.stop(!0,!0).hide(),temps.canvas._elem.jqplotEffect("blind",{mode:"show",direction:tempr.animation.direction},tempr.animation.speed),temps.shadowCanvas._elem.jqplotEffect("blind",{mode:"show",direction:tempr.animation.direction},tempr.animation.speed),_els.fadeIn(.8*tempr.animation.speed));_els=null,this.target.trigger("jqplotPostDraw",[this])}},jqPlot.prototype.doFillBetweenLines=function(){var fb=this.fillBetween,sid1=fb.series1,sid2=fb.series2,id1=sid2>sid1?sid1:sid2,id2=sid2>sid1?sid2:sid1,series1=this.series[id1],series2=this.series[id2];if(series2.renderer.smooth)var tempgd=series2.renderer._smoothedData.slice(0).reverse();else var tempgd=series2.gridData.slice(0).reverse();if(series1.renderer.smooth)var gd=series1.renderer._smoothedData.concat(tempgd);else var gd=series1.gridData.concat(tempgd);var color=null!==fb.color?fb.color:this.series[sid1].fillColor,baseSeries=null!==fb.baseSeries?fb.baseSeries:id1,sr=this.series[baseSeries].renderer.shapeRenderer,opts={fillStyle:color,fill:!0,closePath:!0};sr.draw(series1.shadowCanvas._ctx,gd,opts)},this.bindCustomEvents=function(){this.eventCanvas._elem.bind("click",{plot:this},this.onClick),this.eventCanvas._elem.bind("dblclick",{plot:this},this.onDblClick),this.eventCanvas._elem.bind("mousedown",{plot:this},this.onMouseDown),this.eventCanvas._elem.bind("mousemove",{plot:this},this.onMouseMove),this.eventCanvas._elem.bind("mouseenter",{plot:this},this.onMouseEnter),this.eventCanvas._elem.bind("mouseleave",{plot:this},this.onMouseLeave),this.captureRightClick?(this.eventCanvas._elem.bind("mouseup",{plot:this},this.onRightClick),this.eventCanvas._elem.get(0).oncontextmenu=function(){return!1}):this.eventCanvas._elem.bind("mouseup",{plot:this},this.onMouseUp)},this.onClick=function(ev){
// Event passed in is normalized and will have data attribute.
// Event passed out is unnormalized.
var positions=getEventPosition(ev),p=ev.data.plot,neighbor=checkIntersection(positions.gridPos,p),evt=$.Event("jqplotClick");evt.pageX=ev.pageX,evt.pageY=ev.pageY,$(this).trigger(evt,[positions.gridPos,positions.dataPos,neighbor,p])},this.onDblClick=function(ev){
// Event passed in is normalized and will have data attribute.
// Event passed out is unnormalized.
var positions=getEventPosition(ev),p=ev.data.plot,neighbor=checkIntersection(positions.gridPos,p),evt=$.Event("jqplotDblClick");evt.pageX=ev.pageX,evt.pageY=ev.pageY,$(this).trigger(evt,[positions.gridPos,positions.dataPos,neighbor,p])},this.onMouseDown=function(ev){var positions=getEventPosition(ev),p=ev.data.plot,neighbor=checkIntersection(positions.gridPos,p),evt=$.Event("jqplotMouseDown");evt.pageX=ev.pageX,evt.pageY=ev.pageY,$(this).trigger(evt,[positions.gridPos,positions.dataPos,neighbor,p])},this.onMouseUp=function(ev){var positions=getEventPosition(ev),evt=$.Event("jqplotMouseUp");evt.pageX=ev.pageX,evt.pageY=ev.pageY,$(this).trigger(evt,[positions.gridPos,positions.dataPos,null,ev.data.plot])},this.onRightClick=function(ev){var positions=getEventPosition(ev),p=ev.data.plot,neighbor=checkIntersection(positions.gridPos,p);if(p.captureRightClick)if(3==ev.which){var evt=$.Event("jqplotRightClick");evt.pageX=ev.pageX,evt.pageY=ev.pageY,$(this).trigger(evt,[positions.gridPos,positions.dataPos,neighbor,p])}else{var evt=$.Event("jqplotMouseUp");evt.pageX=ev.pageX,evt.pageY=ev.pageY,$(this).trigger(evt,[positions.gridPos,positions.dataPos,neighbor,p])}},this.onMouseMove=function(ev){var positions=getEventPosition(ev),p=ev.data.plot,neighbor=checkIntersection(positions.gridPos,p),evt=$.Event("jqplotMouseMove");evt.pageX=ev.pageX,evt.pageY=ev.pageY,$(this).trigger(evt,[positions.gridPos,positions.dataPos,neighbor,p])},this.onMouseEnter=function(ev){var positions=getEventPosition(ev),p=ev.data.plot,evt=$.Event("jqplotMouseEnter");evt.pageX=ev.pageX,evt.pageY=ev.pageY,evt.relatedTarget=ev.relatedTarget,$(this).trigger(evt,[positions.gridPos,positions.dataPos,null,p])},this.onMouseLeave=function(ev){var positions=getEventPosition(ev),p=ev.data.plot,evt=$.Event("jqplotMouseLeave");evt.pageX=ev.pageX,evt.pageY=ev.pageY,evt.relatedTarget=ev.relatedTarget,$(this).trigger(evt,[positions.gridPos,positions.dataPos,null,p])},
// method: drawSeries
// Redraws all or just one series on the plot.  No axis scaling
// is performed and no other elements on the plot are redrawn.
// options is an options object to pass on to the series renderers.
// It can be an empty object {}.  idx is the series index
// to redraw if only one series is to be redrawn.
this.drawSeries=function(options,idx){var i,series,ctx;
// draw specified series
if(idx="number"==typeof options&&null==idx?options:idx,options="object"==typeof options?options:{},idx!=undefined)series=this.series[idx],ctx=series.shadowCanvas._ctx,ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),series.drawShadow(ctx,options,this),ctx=series.canvas._ctx,ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),series.draw(ctx,options,this),series.renderer.constructor==$.jqplot.BezierCurveRenderer&&idx<this.series.length-1&&this.drawSeries(idx+1);else
// if call series drawShadow method first, in case all series shadows
// should be drawn before any series.  This will ensure, like for 
// stacked bar plots, that shadows don't overlap series.
for(i=0;i<this.series.length;i++)series=this.series[i],ctx=series.shadowCanvas._ctx,ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),series.drawShadow(ctx,options,this),ctx=series.canvas._ctx,ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),series.draw(ctx,options,this);options=idx=i=series=ctx=null},
// method: moveSeriesToFront
// This method requires jQuery 1.4+
// Moves the specified series canvas in front of all other series canvases.
// This effectively "draws" the specified series on top of all other series,
// although it is performed through DOM manipulation, no redrawing is performed.
//
// Parameters:
// idx - 0 based index of the series to move.  This will be the index of the series
// as it was first passed into the jqplot function.
this.moveSeriesToFront=function(idx){idx=parseInt(idx,10);var stackIndex=$.inArray(idx,this.seriesStack);
// if already in front, return
if(-1!=stackIndex){if(stackIndex==this.seriesStack.length-1)return void(this.previousSeriesStack=this.seriesStack.slice(0));var opidx=this.seriesStack[this.seriesStack.length-1],serelem=this.series[idx].canvas._elem.detach(),shadelem=this.series[idx].shadowCanvas._elem.detach();this.series[opidx].shadowCanvas._elem.after(shadelem),this.series[opidx].canvas._elem.after(serelem),this.previousSeriesStack=this.seriesStack.slice(0),this.seriesStack.splice(stackIndex,1),this.seriesStack.push(idx)}},
// method: moveSeriesToBack
// This method requires jQuery 1.4+
// Moves the specified series canvas behind all other series canvases.
//
// Parameters:
// idx - 0 based index of the series to move.  This will be the index of the series
// as it was first passed into the jqplot function.
this.moveSeriesToBack=function(idx){idx=parseInt(idx,10);var stackIndex=$.inArray(idx,this.seriesStack);
// if already in back, return
if(0!=stackIndex&&-1!=stackIndex){var opidx=this.seriesStack[0],serelem=this.series[idx].canvas._elem.detach(),shadelem=this.series[idx].shadowCanvas._elem.detach();this.series[opidx].shadowCanvas._elem.before(shadelem),this.series[opidx].canvas._elem.before(serelem),this.previousSeriesStack=this.seriesStack.slice(0),this.seriesStack.splice(stackIndex,1),this.seriesStack.unshift(idx)}},
// method: restorePreviousSeriesOrder
// This method requires jQuery 1.4+
// Restore the series canvas order to its previous state.
// Useful to put a series back where it belongs after moving
// it to the front.
this.restorePreviousSeriesOrder=function(){var i,serelem,shadelem,temp,move,keep;
// if no change, return.
if(this.seriesStack!=this.previousSeriesStack){for(i=1;i<this.previousSeriesStack.length;i++)move=this.previousSeriesStack[i],keep=this.previousSeriesStack[i-1],serelem=this.series[move].canvas._elem.detach(),shadelem=this.series[move].shadowCanvas._elem.detach(),this.series[keep].shadowCanvas._elem.after(shadelem),this.series[keep].canvas._elem.after(serelem);temp=this.seriesStack.slice(0),this.seriesStack=this.previousSeriesStack.slice(0),this.previousSeriesStack=temp}},
// method: restoreOriginalSeriesOrder
// This method requires jQuery 1.4+
// Restore the series canvas order to its original order
// when the plot was created.
this.restoreOriginalSeriesOrder=function(){var i,serelem,shadelem,arr=[];for(i=0;i<this.series.length;i++)arr.push(i);if(this.seriesStack!=arr)for(this.previousSeriesStack=this.seriesStack.slice(0),this.seriesStack=arr,i=1;i<this.seriesStack.length;i++)serelem=this.series[i].canvas._elem.detach(),shadelem=this.series[i].shadowCanvas._elem.detach(),this.series[i-1].shadowCanvas._elem.after(shadelem),this.series[i-1].canvas._elem.after(serelem)},this.activateTheme=function(name){this.themeEngine.activate(this,name)}}function getSteps(d,f){return(3.4182054+f)*Math.pow(d,-.3534992)}function tanh(x){var a=(Math.exp(2*x)-1)/(Math.exp(2*x)+1);return a}
//////////
// computeConstrainedSmoothedData
// An implementation of the constrained cubic spline interpolation
// method as presented in:
//
// Kruger, CJC, Constrained Cubic Spine Interpolation for Chemical Engineering Applications
// http://www.korf.co.uk/spline.pdf
//
// The implementation below borrows heavily from the sample Visual Basic
// implementation by CJC Kruger found in http://www.korf.co.uk/spline.xls
//
/////////
// called with scope of series
function computeConstrainedSmoothedData(gd){function dxx(x1,x0){return x1-x0==0?Math.pow(10,10):x1-x0}var smooth=this.renderer.smooth,dim=this.canvas.getWidth(),xp=this._xaxis.series_p2u,yp=this._yaxis.series_p2u,steps=null,dist=gd.length/dim,_smoothedData=[],_smoothedPlotData=[];steps=isNaN(parseFloat(smooth))?getSteps(dist,.5):parseFloat(smooth);for(var yy=[],xx=[],i=0,l=gd.length;l>i;i++)yy.push(gd[i][1]),xx.push(gd[i][0]);for(var A,B,C,D,nmax=gd.length-1,num=1,gdl=gd.length;gdl>num;num++){
// point at each end of segment.
for(var gxx=[],ggxx=[],j=0;2>j;j++){var i=num-1+j;// point number, 0 to # points.
0==i||i==nmax?gxx[j]=Math.pow(10,10):yy[i+1]-yy[i]==0||yy[i]-yy[i-1]==0?gxx[j]=0:(xx[i+1]-xx[i])/(yy[i+1]-yy[i])+(xx[i]-xx[i-1])/(yy[i]-yy[i-1])==0?gxx[j]=0:(yy[i+1]-yy[i])*(yy[i]-yy[i-1])<0?gxx[j]=0:gxx[j]=2/(dxx(xx[i+1],xx[i])/(yy[i+1]-yy[i])+dxx(xx[i],xx[i-1])/(yy[i]-yy[i-1]))}
// Reset first derivative (slope) at first and last point
1==num?
// First point has 0 2nd derivative
gxx[0]=1.5*(yy[1]-yy[0])/dxx(xx[1],xx[0])-gxx[1]/2:num==nmax&&(
// Last point has 0 2nd derivative
gxx[1]=1.5*(yy[nmax]-yy[nmax-1])/dxx(xx[nmax],xx[nmax-1])-gxx[0]/2),
// Calc second derivative at points
ggxx[0]=-2*(gxx[1]+2*gxx[0])/dxx(xx[num],xx[num-1])+6*(yy[num]-yy[num-1])/Math.pow(dxx(xx[num],xx[num-1]),2),ggxx[1]=2*(2*gxx[1]+gxx[0])/dxx(xx[num],xx[num-1])-6*(yy[num]-yy[num-1])/Math.pow(dxx(xx[num],xx[num-1]),2),
// Calc constants for cubic interpolation
D=1/6*(ggxx[1]-ggxx[0])/dxx(xx[num],xx[num-1]),C=.5*(xx[num]*ggxx[0]-xx[num-1]*ggxx[1])/dxx(xx[num],xx[num-1]),B=(yy[num]-yy[num-1]-C*(Math.pow(xx[num],2)-Math.pow(xx[num-1],2))-D*(Math.pow(xx[num],3)-Math.pow(xx[num-1],3)))/dxx(xx[num],xx[num-1]),A=yy[num-1]-B*xx[num-1]-C*Math.pow(xx[num-1],2)-D*Math.pow(xx[num-1],3);for(var temp,tempx,increment=(xx[num]-xx[num-1])/steps,j=0,l=steps;l>j;j++)temp=[],tempx=xx[num-1]+j*increment,temp.push(tempx),temp.push(A+B*tempx+C*Math.pow(tempx,2)+D*Math.pow(tempx,3)),_smoothedData.push(temp),_smoothedPlotData.push([xp(temp[0]),yp(temp[1])])}return _smoothedData.push(gd[i]),_smoothedPlotData.push([xp(gd[i][0]),yp(gd[i][1])]),[_smoothedData,_smoothedPlotData]}
///////
// computeHermiteSmoothedData
// A hermite spline smoothing of the plot data.
// This implementation is derived from the one posted
// by krypin on the jqplot-users mailing list:
//
// http://groups.google.com/group/jqplot-users/browse_thread/thread/748be6a445723cea?pli=1
//
// with a blog post:
//
// http://blog.statscollector.com/a-plugin-renderer-for-jqplot-to-draw-a-hermite-spline/
//
// and download of the original plugin:
//
// http://blog.statscollector.com/wp-content/uploads/2010/02/jqplot.hermiteSplineRenderer.js
//////////
// called with scope of series
function computeHermiteSmoothedData(gd){var t,s,h1,h2,h3,h4,TiX,TiY,Ti1X,Ti1Y,pX,pY,p,min,max,stretch,scale,shift,smooth=this.renderer.smooth,tension=this.renderer.tension,dim=this.canvas.getWidth(),xp=this._xaxis.series_p2u,yp=this._yaxis.series_p2u,steps=null,a=null,a1=null,a2=null,slope=null,slope2=null,temp=null,dist=gd.length/dim,_smoothedData=[],_smoothedPlotData=[];steps=isNaN(parseFloat(smooth))?getSteps(dist,.5):parseFloat(smooth),isNaN(parseFloat(tension))||(tension=parseFloat(tension));for(var i=0,l=gd.length-1;l>i;i++)for(null===tension?(slope=Math.abs((gd[i+1][1]-gd[i][1])/(gd[i+1][0]-gd[i][0])),min=.3,max=.6,stretch=(max-min)/2,scale=2.5,shift=-1.4,temp=slope/scale+shift,a1=stretch*tanh(temp)-stretch*tanh(shift)+min,i>0&&(slope2=Math.abs((gd[i][1]-gd[i-1][1])/(gd[i][0]-gd[i-1][0]))),temp=slope2/scale+shift,a2=stretch*tanh(temp)-stretch*tanh(shift)+min,a=(a1+a2)/2):a=tension,t=0;steps>t;t++)s=t/steps,h1=(1+2*s)*Math.pow(1-s,2),h2=s*Math.pow(1-s,2),h3=Math.pow(s,2)*(3-2*s),h4=Math.pow(s,2)*(s-1),gd[i-1]?(TiX=a*(gd[i+1][0]-gd[i-1][0]),TiY=a*(gd[i+1][1]-gd[i-1][1])):(TiX=a*(gd[i+1][0]-gd[i][0]),TiY=a*(gd[i+1][1]-gd[i][1])),gd[i+2]?(Ti1X=a*(gd[i+2][0]-gd[i][0]),Ti1Y=a*(gd[i+2][1]-gd[i][1])):(Ti1X=a*(gd[i+1][0]-gd[i][0]),Ti1Y=a*(gd[i+1][1]-gd[i][1])),pX=h1*gd[i][0]+h3*gd[i+1][0]+h2*TiX+h4*Ti1X,pY=h1*gd[i][1]+h3*gd[i+1][1]+h2*TiY+h4*Ti1Y,p=[pX,pY],_smoothedData.push(p),_smoothedPlotData.push([xp(pX),yp(pY)]);return _smoothedData.push(gd[l]),_smoothedPlotData.push([xp(gd[l][0]),yp(gd[l][1])]),[_smoothedData,_smoothedPlotData]}
// called with scope of plot.
// make sure to not leave anything highlighted.
function postInit(target,data,options){for(var i=0;i<this.series.length;i++)this.series[i].renderer.constructor==$.jqplot.LineRenderer&&this.series[i].highlightMouseOver&&(this.series[i].highlightMouseDown=!1)}
// called within context of plot
// create a canvas which we can draw on.
// insert it before the eventCanvas, so eventCanvas will still capture events.
function postPlotDraw(){
// Memory Leaks patch    
this.plugins.lineRenderer&&this.plugins.lineRenderer.highlightCanvas&&(this.plugins.lineRenderer.highlightCanvas.resetCanvas(),this.plugins.lineRenderer.highlightCanvas=null),this.plugins.lineRenderer.highlightedSeriesIndex=null,this.plugins.lineRenderer.highlightCanvas=new $.jqplot.GenericCanvas,this.eventCanvas._elem.before(this.plugins.lineRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-lineRenderer-highlight-canvas",this._plotDimensions,this)),this.plugins.lineRenderer.highlightCanvas.setContext(),this.eventCanvas._elem.bind("mouseleave",{plot:this},function(ev){unhighlight(ev.data.plot)})}function highlight(plot,sidx,pidx,points){var s=plot.series[sidx],canvas=plot.plugins.lineRenderer.highlightCanvas;canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width,canvas._ctx.canvas.height),s._highlightedPoint=pidx,plot.plugins.lineRenderer.highlightedSeriesIndex=sidx;var opts={fillStyle:s.highlightColor};"line"===s.type&&s.renderer.bands.show&&(opts.fill=!0,opts.closePath=!0),s.renderer.shapeRenderer.draw(canvas._ctx,points,opts),canvas=null}function unhighlight(plot){var canvas=plot.plugins.lineRenderer.highlightCanvas;canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width,canvas._ctx.canvas.height);for(var i=0;i<plot.series.length;i++)plot.series[i]._highlightedPoint=null;plot.plugins.lineRenderer.highlightedSeriesIndex=null,plot.target.trigger("jqplotDataUnhighlight"),canvas=null}function handleMove(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data],evt1=jQuery.Event("jqplotDataMouseOver");if(evt1.pageX=ev.pageX,evt1.pageY=ev.pageY,plot.target.trigger(evt1,ins),plot.series[ins[0]].highlightMouseOver&&ins[0]!=plot.plugins.lineRenderer.highlightedSeriesIndex){var evt=jQuery.Event("jqplotDataHighlight");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY,plot.target.trigger(evt,ins),highlight(plot,neighbor.seriesIndex,neighbor.pointIndex,neighbor.points)}}else null==neighbor&&unhighlight(plot)}function handleMouseDown(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data];if(plot.series[ins[0]].highlightMouseDown&&ins[0]!=plot.plugins.lineRenderer.highlightedSeriesIndex){var evt=jQuery.Event("jqplotDataHighlight");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY,plot.target.trigger(evt,ins),highlight(plot,neighbor.seriesIndex,neighbor.pointIndex,neighbor.points)}}else null==neighbor&&unhighlight(plot)}function handleMouseUp(ev,gridpos,datapos,neighbor,plot){var idx=plot.plugins.lineRenderer.highlightedSeriesIndex;null!=idx&&plot.series[idx].highlightMouseDown&&unhighlight(plot)}function handleClick(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data],evt=jQuery.Event("jqplotDataClick");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY,plot.target.trigger(evt,ins)}}function handleRightClick(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data],idx=plot.plugins.lineRenderer.highlightedSeriesIndex;null!=idx&&plot.series[idx].highlightMouseDown&&unhighlight(plot);var evt=jQuery.Event("jqplotDataRightClick");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY,plot.target.trigger(evt,ins)}}/**
    * The following code was generaously given to me a while back by Scott Prahl.
    * He did a good job at computing axes min, max and number of ticks for the 
    * case where the user has not set any scale related parameters (tickInterval,
    * numberTicks, min or max).  I had ignored this use case for a long time,
    * focusing on the more difficult case where user has set some option controlling
    * tick generation.  Anyway, about time I got this into jqPlot.
    * Thanks Scott!!
    */
/**
    * Copyright (c) 2010 Scott Prahl
    * The next three routines are currently available for use in all personal 
    * or commercial projects under both the MIT and GPL version 2.0 licenses. 
    * This means that you can choose the license that best suits your project 
    * and use it accordingly. 
    */
// A good format string depends on the interval. If the interval is greater 
// than 1 then there is no need to show any decimal digits. If it is < 1.0, then
// use the magnitude of the interval to determine the number of digits to show.
function bestFormatString(interval){var fstr;if(interval=Math.abs(interval),interval>=10)fstr="%d";else if(interval>1)fstr=interval===parseInt(interval,10)?"%d":"%.1f";else{var expv=-Math.floor(Math.log(interval)/Math.LN10);fstr="%."+expv+"f"}return fstr}
// Given a fixed minimum and maximum and a target number ot ticks
// figure out the best interval and 
// return min, max, number ticks, format string and tick interval
function bestConstrainedInterval(min,max,nttarget){for(var temp,sd,bestNT,fsd,fs,currentNT,bestPrec,low=Math.floor(nttarget/2),hi=Math.ceil(1.5*nttarget),badness=Number.MAX_VALUE,r=max-min,gsf=$.jqplot.getSignificantFigures,i=0,l=hi-low+1;l>i;i++)currentNT=low+i,temp=r/(currentNT-1),sd=gsf(temp),temp=Math.abs(nttarget-currentNT)+sd.digitsRight,badness>temp?(badness=temp,bestNT=currentNT,bestPrec=sd.digitsRight):temp===badness&&sd.digitsRight<bestPrec&&(bestNT=currentNT,bestPrec=sd.digitsRight);
// min, max, number ticks, format string, tick interval
return fsd=Math.max(bestPrec,Math.max(gsf(min).digitsRight,gsf(max).digitsRight)),fs=0===fsd?"%d":"%."+fsd+"f",temp=r/(bestNT-1),[min,max,bestNT,fs,temp]}
// This will return an interval of form 2 * 10^n, 5 * 10^n or 10 * 10^n
// it is based soley on the range and number of ticks.  So if user specifies
// number of ticks, use this.
function bestInterval(range,numberTicks){numberTicks=numberTicks||7;var interval,minimum=range/(numberTicks-1),magnitude=Math.pow(10,Math.floor(Math.log(minimum)/Math.LN10)),residual=minimum/magnitude;
// "nicest" ranges are 1, 2, 5 or powers of these.
// for magnitudes below 1, only allow these. 
return interval=1>magnitude?residual>5?10*magnitude:residual>2?5*magnitude:residual>1?2*magnitude:magnitude:residual>5?10*magnitude:residual>4?5*magnitude:residual>3?4*magnitude:residual>2?3*magnitude:residual>1?2*magnitude:magnitude}
// This will return an interval of form 2 * 10^n, 5 * 10^n or 10 * 10^n
// it is based soley on the range of data, number of ticks must be computed later.
function bestLinearInterval(range,scalefact){scalefact=scalefact||1;var fact,expv=Math.floor(Math.log(range)/Math.LN10),magnitude=Math.pow(10,expv),f=range/magnitude;
// for large plots, scalefact will decrease f and increase number of ticks.
// for small plots, scalefact will increase f and decrease number of ticks.
// for large plots, smaller interval, more ticks.
return f/=scalefact,fact=.38>=f?.1:1.6>=f?.2:4>=f?.5:8>=f?1:16>=f?2:5,fact*magnitude}function bestLinearComponents(range,scalefact){var interval,fact,expv=Math.floor(Math.log(range)/Math.LN10),magnitude=Math.pow(10,expv),f=range/magnitude;
// for large plots, scalefact will decrease f and increase number of ticks.
// for small plots, scalefact will increase f and decrease number of ticks.
// for large plots, smaller interval, more ticks.
return f/=scalefact,fact=.38>=f?.1:1.6>=f?.2:4>=f?.5:8>=f?1:16>=f?2:5,interval=fact*magnitude,[interval,fact,magnitude]}function numericalOrder(a,b){return a-b}
// function clone(obj) {
//     return eval(obj.toSource());
// }
function clone(obj){if(null==obj||"object"!=typeof obj)return obj;var temp=new obj.constructor;for(var key in obj)temp[key]=clone(obj[key]);return temp}function merge(obj1,obj2){if(null!=obj2&&"object"==typeof obj2)for(var key in obj2)"highlightColors"==key&&(obj1[key]=clone(obj2[key])),null!=obj2[key]&&"object"==typeof obj2[key]?(obj1.hasOwnProperty(key)||(obj1[key]={}),merge(obj1[key],obj2[key])):obj1[key]=obj2[key]}
//
// I think John Reisig published this method on his blog, ejohn.
//
function inArray(elem,array){if(array.indexOf)return array.indexOf(elem);for(var i=0,length=array.length;length>i;i++)if(array[i]===elem)return i;return-1}
//
// Thanks to Kangax, Christian Sciberras and Stack Overflow for this method.
//
function get_type(thing){return null===thing?"[object Null]":Object.prototype.toString.call(thing)}
// return an effect options object for the given parameters:
function _normalizeArguments(effect,options,speed,callback){
// short path for passing an effect options object:
// short path for passing an effect options object:
// convert to an object
// catch (effect)
// catch (effect, callback)
// catch (effect, speed, ?)
// catch (effect, options, callback)
// add options to effect
return $.isPlainObject(effect)?effect:(effect={effect:effect},options===undefined&&(options={}),$.isFunction(options)&&(callback=options,speed=null,options={}),("number"===$.type(options)||$.fx.speeds[options])&&(callback=speed,speed=options,options={}),$.isFunction(speed)&&(callback=speed,speed=null),options&&$.extend(effect,options),speed=speed||options.duration,effect.duration=$.fx.off?0:"number"==typeof speed?speed:speed in $.fx.speeds?$.fx.speeds[speed]:$.fx.speeds._default,effect.complete=callback||options.complete,effect)}
// make sure undefined is undefined
var undefined;$.fn.emptyForce=function(){for(var elem,i=0;null!=(elem=$(this)[i]);i++){
// Remove any remaining nodes
if(
// Remove element nodes and prevent memory leaks
1===elem.nodeType&&$.cleanData(elem.getElementsByTagName("*")),$.jqplot.use_excanvas)elem.outerHTML="";else for(;elem.firstChild;)elem.removeChild(elem.firstChild);elem=null}return $(this)},$.fn.removeChildForce=function(parent){for(;parent.firstChild;)this.removeChildForce(parent.firstChild),parent.removeChild(parent.firstChild)},$.fn.jqplot=function(){
// see how many data arrays we have
for(var datas=[],options=[],i=0,l=arguments.length;l>i;i++)$.isArray(arguments[i])?datas.push(arguments[i]):$.isPlainObject(arguments[i])&&options.push(arguments[i]);return this.each(function(index){var tid,plot,data,opts,$this=$(this),dl=datas.length,ol=options.length;data=dl>index?datas[index]:dl?datas[dl-1]:null,opts=ol>index?options[index]:ol?options[ol-1]:null,tid=$this.attr("id"),tid===undefined&&(tid="jqplot_target_"+$.jqplot.targetCounter++,$this.attr("id",tid)),plot=$.jqplot(tid,data,opts),$this.data("jqplot",plot)})},/**
     * Namespace: $.jqplot
     * jQuery function called by the user to create a plot.
     *  
     * Parameters:
     * target - ID of target element to render the plot into.
     * data - an array of data series.
     * options - user defined options object.  See the individual classes for available options.
     * 
     * Properties:
     * config - object to hold configuration information for jqPlot plot object.
     * 
     * attributes:
     * enablePlugins - False to disable plugins by default.  Plugins must then be explicitly 
     *   enabled in the individual plot options.  Default: false.
     *   This property sets the "show" property of certain plugins to true or false.
     *   Only plugins that can be immediately active upon loading are affected.  This includes
     *   non-renderer plugins like cursor, dragable, highlighter, and trendline.
     * defaultHeight - Default height for plots where no css height specification exists.  This
     *   is a jqplot wide default.
     * defaultWidth - Default height for plots where no css height specification exists.  This
     *   is a jqplot wide default.
     */
$.jqplot=function(target,data,options){var _data=null,_options=null;3===arguments.length?(_data=data,_options=options):2===arguments.length&&($.isArray(data)?_data=data:$.isPlainObject(data)&&(_options=data)),null===_data&&null!==_options&&_options.data&&(_data=_options.data);var plot=new jqPlot;if(
// remove any error class that may be stuck on target.
$("#"+target).removeClass("jqplot-error"),!$.jqplot.config.catchErrors)return plot.init(target,_data,_options),plot.draw(),plot.themeEngine.init.call(plot),plot;try{return plot.init(target,_data,_options),plot.draw(),plot.themeEngine.init.call(plot),plot}catch(e){var msg=$.jqplot.config.errorMessage||e.message;$("#"+target).append('<div class="jqplot-error-message">'+msg+"</div>"),$("#"+target).addClass("jqplot-error"),document.getElementById(target).style.background=$.jqplot.config.errorBackground,document.getElementById(target).style.border=$.jqplot.config.errorBorder,document.getElementById(target).style.fontFamily=$.jqplot.config.errorFontFamily,document.getElementById(target).style.fontSize=$.jqplot.config.errorFontSize,document.getElementById(target).style.fontStyle=$.jqplot.config.errorFontStyle,document.getElementById(target).style.fontWeight=$.jqplot.config.errorFontWeight}},$.jqplot.version="1.0.8",$.jqplot.revision="1250",$.jqplot.targetCounter=1,
// canvas manager to reuse canvases on the plot.
// Should help solve problem of canvases not being freed and
// problem of waiting forever for firefox to decide to free memory.
$.jqplot.CanvasManager=function(){
// canvases are managed globally so that they can be reused
// across plots after they have been freed
"undefined"==typeof $.jqplot.CanvasManager.canvases&&($.jqplot.CanvasManager.canvases=[],$.jqplot.CanvasManager.free=[]);var myCanvases=[];this.getCanvas=function(){var canvas,makeNew=!0;if(!$.jqplot.use_excanvas)for(var i=0,l=$.jqplot.CanvasManager.canvases.length;l>i;i++)if($.jqplot.CanvasManager.free[i]===!0){makeNew=!1,canvas=$.jqplot.CanvasManager.canvases[i],
// $(canvas).removeClass('jqplot-canvasManager-free').addClass('jqplot-canvasManager-inuse');
$.jqplot.CanvasManager.free[i]=!1,myCanvases.push(i);break}return makeNew&&(canvas=document.createElement("canvas"),myCanvases.push($.jqplot.CanvasManager.canvases.length),$.jqplot.CanvasManager.canvases.push(canvas),$.jqplot.CanvasManager.free.push(!1)),canvas},
// this method has to be used after settings the dimesions
// on the element returned by getCanvas()
this.initCanvas=function(canvas){return $.jqplot.use_excanvas?window.G_vmlCanvasManager.initElement(canvas):canvas},this.freeAllCanvases=function(){for(var i=0,l=myCanvases.length;l>i;i++)this.freeCanvas(myCanvases[i]);myCanvases=[]},this.freeCanvas=function(idx){if($.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined)
// excanvas can't be reused, but properly unset
window.G_vmlCanvasManager.uninitElement($.jqplot.CanvasManager.canvases[idx]),$.jqplot.CanvasManager.canvases[idx]=null;else{var canvas=$.jqplot.CanvasManager.canvases[idx];canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height),$(canvas).unbind().removeAttr("class").removeAttr("style"),
// Style attributes seemed to be still hanging around.  wierd.  Some ticks
// still retained a left: 0px attribute after reusing a canvas.
$(canvas).css({left:"",top:"",position:""}),
// setting size to 0 may save memory of unused canvases?
canvas.width=0,canvas.height=0,$.jqplot.CanvasManager.free[idx]=!0}}},
// Convienence function that won't hang IE or FF without FireBug.
$.jqplot.log=function(){window.console&&window.console.log.apply(window.console,arguments)},$.jqplot.config={addDomReference:!1,enablePlugins:!1,defaultHeight:300,defaultWidth:400,UTCAdjust:!1,timezoneOffset:new Date(6e4*(new Date).getTimezoneOffset()),errorMessage:"",errorBackground:"",errorBorder:"",errorFontFamily:"",errorFontSize:"",errorFontStyle:"",errorFontWeight:"",catchErrors:!1,defaultTickFormatString:"%.1f",defaultColors:["#4bb2c5","#EAA228","#c5b47f","#579575","#839557","#958c12","#953579","#4b5de4","#d8b83f","#ff5800","#0085cc","#c747a3","#cddf54","#FBD178","#26B4E3","#bd70c7"],defaultNegativeColors:["#498991","#C08840","#9F9274","#546D61","#646C4A","#6F6621","#6E3F5F","#4F64B0","#A89050","#C45923","#187399","#945381","#959E5C","#C7AF7B","#478396","#907294"],dashLength:4,gapLength:4,dotGapLength:2.5,srcLocation:"jqplot/src/",pluginLocation:"jqplot/src/plugins/"},$.jqplot.arrayMax=function(array){return Math.max.apply(Math,array)},$.jqplot.arrayMin=function(array){return Math.min.apply(Math,array)},$.jqplot.enablePlugins=$.jqplot.config.enablePlugins,
// canvas related tests taken from modernizer:
// Copyright (c) 2009 - 2010 Faruk Ates.
// http://www.modernizr.com
$.jqplot.support_canvas=function(){return"undefined"==typeof $.jqplot.support_canvas.result&&($.jqplot.support_canvas.result=!!document.createElement("canvas").getContext),$.jqplot.support_canvas.result},$.jqplot.support_canvas_text=function(){return"undefined"==typeof $.jqplot.support_canvas_text.result&&(window.G_vmlCanvasManager!==undefined&&window.G_vmlCanvasManager._version>887?$.jqplot.support_canvas_text.result=!0:$.jqplot.support_canvas_text.result=!(!document.createElement("canvas").getContext||"function"!=typeof document.createElement("canvas").getContext("2d").fillText)),$.jqplot.support_canvas_text.result},$.jqplot.use_excanvas=$.support.boxModel&&$.support.objectAll&&$support.leadingWhitespace||$.jqplot.support_canvas()?!1:!0,/**
     * 
     * Hooks: jqPlot Pugin Hooks
     * 
     * $.jqplot.preInitHooks - called before initialization.
     * $.jqplot.postInitHooks - called after initialization.
     * $.jqplot.preParseOptionsHooks - called before user options are parsed.
     * $.jqplot.postParseOptionsHooks - called after user options are parsed.
     * $.jqplot.preDrawHooks - called before plot draw.
     * $.jqplot.postDrawHooks - called after plot draw.
     * $.jqplot.preDrawSeriesHooks - called before each series is drawn.
     * $.jqplot.postDrawSeriesHooks - called after each series is drawn.
     * $.jqplot.preDrawLegendHooks - called before the legend is drawn.
     * $.jqplot.addLegendRowHooks - called at the end of legend draw, so plugins
     *     can add rows to the legend table.
     * $.jqplot.preSeriesInitHooks - called before series is initialized.
     * $.jqplot.postSeriesInitHooks - called after series is initialized.
     * $.jqplot.preParseSeriesOptionsHooks - called before series related options
     *     are parsed.
     * $.jqplot.postParseSeriesOptionsHooks - called after series related options
     *     are parsed.
     * $.jqplot.eventListenerHooks - called at the end of plot drawing, binds
     *     listeners to the event canvas which lays on top of the grid area.
     * $.jqplot.preDrawSeriesShadowHooks - called before series shadows are drawn.
     * $.jqplot.postDrawSeriesShadowHooks - called after series shadows are drawn.
     * 
     */
$.jqplot.preInitHooks=[],$.jqplot.postInitHooks=[],$.jqplot.preParseOptionsHooks=[],$.jqplot.postParseOptionsHooks=[],$.jqplot.preDrawHooks=[],$.jqplot.postDrawHooks=[],$.jqplot.preDrawSeriesHooks=[],$.jqplot.postDrawSeriesHooks=[],$.jqplot.preDrawLegendHooks=[],$.jqplot.addLegendRowHooks=[],$.jqplot.preSeriesInitHooks=[],$.jqplot.postSeriesInitHooks=[],$.jqplot.preParseSeriesOptionsHooks=[],$.jqplot.postParseSeriesOptionsHooks=[],$.jqplot.eventListenerHooks=[],$.jqplot.preDrawSeriesShadowHooks=[],$.jqplot.postDrawSeriesShadowHooks=[],
// A superclass holding some common properties and methods.
$.jqplot.ElemContainer=function(){this._elem,this._plotWidth,this._plotHeight,this._plotDimensions={height:null,width:null}},$.jqplot.ElemContainer.prototype.createElement=function(el,offsets,clss,cssopts,attrib){this._offsets=offsets;var klass=clss||"jqplot",elem=document.createElement(el);
// avoid memory leak;
return this._elem=$(elem),this._elem.addClass(klass),this._elem.css(cssopts),this._elem.attr(attrib),elem=null,this._elem},$.jqplot.ElemContainer.prototype.getWidth=function(){return this._elem?this._elem.outerWidth(!0):null},$.jqplot.ElemContainer.prototype.getHeight=function(){return this._elem?this._elem.outerHeight(!0):null},$.jqplot.ElemContainer.prototype.getPosition=function(){return this._elem?this._elem.position():{top:null,left:null,bottom:null,right:null}},$.jqplot.ElemContainer.prototype.getTop=function(){return this.getPosition().top},$.jqplot.ElemContainer.prototype.getLeft=function(){return this.getPosition().left},$.jqplot.ElemContainer.prototype.getBottom=function(){return this._elem.css("bottom")},$.jqplot.ElemContainer.prototype.getRight=function(){return this._elem.css("right")},Axis.prototype=new $.jqplot.ElemContainer,Axis.prototype.constructor=Axis,Axis.prototype.init=function(){$.isFunction(this.renderer)&&(this.renderer=new this.renderer),
// set the axis name
this.tickOptions.axis=this.name,
// if showMark or showLabel tick options not specified, use value of axis option.
// showTicks overrides showTickMarks.
null==this.tickOptions.showMark&&(this.tickOptions.showMark=this.showTicks),null==this.tickOptions.showMark&&(this.tickOptions.showMark=this.showTickMarks),null==this.tickOptions.showLabel&&(this.tickOptions.showLabel=this.showTicks),null==this.label||""==this.label?this.showLabel=!1:this.labelOptions.label=this.label,0==this.showLabel&&(this.labelOptions.show=!1),
// set the default padMax, padMin if not specified
// special check, if no padding desired, padding
// should be set to 1.0
0==this.pad&&(this.pad=1),0==this.padMax&&(this.padMax=1),0==this.padMin&&(this.padMin=1),null==this.padMax&&(this.padMax=(this.pad-1)/2+1),null==this.padMin&&(this.padMin=(this.pad-1)/2+1),
// now that padMin and padMax are correctly set, reset pad in case user has supplied 
// padMin and/or padMax
this.pad=this.padMax+this.padMin-1,(null!=this.min||null!=this.max)&&(this.autoscale=!1),
// if not set, sync ticks for y axes but not x by default.
null==this.syncTicks&&this.name.indexOf("y")>-1?this.syncTicks=!0:null==this.syncTicks&&(this.syncTicks=!1),this.renderer.init.call(this,this.rendererOptions)},Axis.prototype.draw=function(ctx,plot){
// Memory Leaks patch
return this.__ticks&&(this.__ticks=null),this.renderer.draw.call(this,ctx,plot)},Axis.prototype.set=function(){this.renderer.set.call(this)},Axis.prototype.pack=function(pos,offsets){this.show&&this.renderer.pack.call(this,pos,offsets),
// these properties should all be available now.
null==this._min&&(this._min=this.min,this._max=this.max,this._tickInterval=this.tickInterval,this._numberTicks=this.numberTicks,this.__ticks=this._ticks)},
// reset the axis back to original values if it has been scaled, zoomed, etc.
Axis.prototype.reset=function(){this.renderer.reset.call(this)},Axis.prototype.resetScale=function(opts){$.extend(!0,this,{min:null,max:null,numberTicks:null,tickInterval:null,_ticks:[],ticks:[]},opts),this.resetDataBounds()},Axis.prototype.resetDataBounds=function(){
// Go through all the series attached to this axis and find
// the min/max bounds for this axis.
var db=this._dataBounds;db.min=null,db.max=null;for(var l,s,d,doforce=this.show?!0:!1,i=0;i<this._series.length;i++)if(s=this._series[i],s.show||this.scaleToHiddenSeries){d=s._plotData,"line"===s._type&&s.renderer.bands.show&&"x"!==this.name.charAt(0)&&(d=[[0,s.renderer.bands._min],[1,s.renderer.bands._max]]);var minyidx=1,maxyidx=1;null!=s._type&&"ohlc"==s._type&&(minyidx=3,maxyidx=2);for(var j=0,l=d.length;l>j;j++)"xaxis"==this.name||"x2axis"==this.name?((null!=d[j][0]&&d[j][0]<db.min||null==db.min)&&(db.min=d[j][0]),(null!=d[j][0]&&d[j][0]>db.max||null==db.max)&&(db.max=d[j][0])):((null!=d[j][minyidx]&&d[j][minyidx]<db.min||null==db.min)&&(db.min=d[j][minyidx]),(null!=d[j][maxyidx]&&d[j][maxyidx]>db.max||null==db.max)&&(db.max=d[j][maxyidx]));
// Hack to not pad out bottom of bar plots unless user has specified a padding.
// every series will have a chance to set doforce to false.  once it is set to 
// false, it cannot be reset to true.
// If any series attached to axis is not a bar, wont force 0.
doforce&&s.renderer.constructor!==$.jqplot.BarRenderer?doforce=!1:doforce&&this._options.hasOwnProperty("forceTickAt0")&&0==this._options.forceTickAt0?doforce=!1:doforce&&s.renderer.constructor===$.jqplot.BarRenderer&&("vertical"==s.barDirection&&"xaxis"!=this.name&&"x2axis"!=this.name?(null!=this._options.pad||null!=this._options.padMin)&&(doforce=!1):"horizontal"!=s.barDirection||"xaxis"!=this.name&&"x2axis"!=this.name||(null!=this._options.pad||null!=this._options.padMin)&&(doforce=!1))}doforce&&this.renderer.constructor===$.jqplot.LinearAxisRenderer&&db.min>=0&&(this.padMin=1,this.forceTickAt0=!0)},Legend.prototype=new $.jqplot.ElemContainer,Legend.prototype.constructor=Legend,Legend.prototype.setOptions=function(options){if($.extend(!0,this,options),
// Try to emulate deprecated behaviour
// if user has specified xoffset or yoffset, copy these to
// the margin properties.
"inside"==this.placement&&(this.placement="insideGrid"),this.xoffset>0){if("insideGrid"==this.placement)switch(this.location){case"nw":case"w":case"sw":null==this.marginLeft&&(this.marginLeft=this.xoffset+"px"),this.marginRight="0px";break;case"ne":case"e":case"se":default:null==this.marginRight&&(this.marginRight=this.xoffset+"px"),this.marginLeft="0px"}else if("outside"==this.placement)switch(this.location){case"nw":case"w":case"sw":null==this.marginRight&&(this.marginRight=this.xoffset+"px"),this.marginLeft="0px";break;case"ne":case"e":case"se":default:null==this.marginLeft&&(this.marginLeft=this.xoffset+"px"),this.marginRight="0px"}this.xoffset=0}if(this.yoffset>0){if("outside"==this.placement)switch(this.location){case"sw":case"s":case"se":null==this.marginTop&&(this.marginTop=this.yoffset+"px"),this.marginBottom="0px";break;case"ne":case"n":case"nw":default:null==this.marginBottom&&(this.marginBottom=this.yoffset+"px"),this.marginTop="0px"}else if("insideGrid"==this.placement)switch(this.location){case"sw":case"s":case"se":null==this.marginBottom&&(this.marginBottom=this.yoffset+"px"),this.marginTop="0px";break;case"ne":case"n":case"nw":default:null==this.marginTop&&(this.marginTop=this.yoffset+"px"),this.marginBottom="0px"}this.yoffset=0}},Legend.prototype.init=function(){$.isFunction(this.renderer)&&(this.renderer=new this.renderer),this.renderer.init.call(this,this.rendererOptions)},Legend.prototype.draw=function(offsets,plot){for(var i=0;i<$.jqplot.preDrawLegendHooks.length;i++)$.jqplot.preDrawLegendHooks[i].call(this,offsets);return this.renderer.draw.call(this,offsets,plot)},Legend.prototype.pack=function(offsets){this.renderer.pack.call(this,offsets)},Title.prototype=new $.jqplot.ElemContainer,Title.prototype.constructor=Title,Title.prototype.init=function(){$.isFunction(this.renderer)&&(this.renderer=new this.renderer),this.renderer.init.call(this,this.rendererOptions)},Title.prototype.draw=function(width){return this.renderer.draw.call(this,width)},Title.prototype.pack=function(){this.renderer.pack.call(this)},Series.prototype=new $.jqplot.ElemContainer,Series.prototype.constructor=Series,Series.prototype.init=function(index,gridbw,plot){
// weed out any null values in the data.
this.index=index,this.gridBorderWidth=gridbw;var i,l,d=this.data,temp=[];for(i=0,l=d.length;l>i;i++)if(this.breakOnNull)
// TODO: figure out what to do with null values
// probably involve keeping nulls in data array
// and then updating renderers to break line
// when it hits null value.
// For now, just keep value.
temp.push(d[i]);else{if(null==d[i]||null==d[i][0]||null==d[i][1])continue;temp.push(d[i])}if(this.data=temp,
// parse the renderer options and apply default colors if not provided
// Set color even if not shown, so series don't change colors when other
// series on plot shown/hidden.
this.color||(this.color=plot.colorGenerator.get(this.index)),this.negativeColor||(this.negativeColor=plot.negativeColorGenerator.get(this.index)),this.fillColor||(this.fillColor=this.color),this.fillAlpha){var comp=$.jqplot.normalize2rgb(this.fillColor),comp=$.jqplot.getColorComponents(comp);this.fillColor="rgba("+comp[0]+","+comp[1]+","+comp[2]+","+this.fillAlpha+")"}$.isFunction(this.renderer)&&(this.renderer=new this.renderer),this.renderer.init.call(this,this.rendererOptions,plot),this.markerRenderer=new this.markerRenderer,this.markerOptions.color||(this.markerOptions.color=this.color),null==this.markerOptions.show&&(this.markerOptions.show=this.showMarker),this.showMarker=this.markerOptions.show,
// the markerRenderer is called within its own scope, don't want to overwrite series options!!
this.markerRenderer.init(this.markerOptions)},
// data - optional data point array to draw using this series renderer
// gridData - optional grid data point array to draw using this series renderer
// stackData - array of cumulative data for stacked plots.
Series.prototype.draw=function(sctx,opts,plot){var options=opts==undefined?{}:opts;sctx=sctx==undefined?this.canvas._ctx:sctx;var j,data,gridData;
// hooks get called even if series not shown
// we don't clear canvas here, it would wipe out all other series as well.
for(j=0;j<$.jqplot.preDrawSeriesHooks.length;j++)$.jqplot.preDrawSeriesHooks[j].call(this,sctx,options);for(this.show&&(this.renderer.setGridData.call(this,plot),options.preventJqPlotSeriesDrawTrigger||$(sctx.canvas).trigger("jqplotSeriesDraw",[this.data,this.gridData]),data=[],data=options.data?options.data:this._stack?this._plotData:this.data,gridData=options.gridData||this.renderer.makeGridData.call(this,data,plot),"line"===this._type&&this.renderer.smooth&&this.renderer._smoothedData.length&&(gridData=this.renderer._smoothedData),this.renderer.draw.call(this,sctx,gridData,options,plot)),j=0;j<$.jqplot.postDrawSeriesHooks.length;j++)$.jqplot.postDrawSeriesHooks[j].call(this,sctx,options,plot);sctx=opts=plot=j=data=gridData=null},Series.prototype.drawShadow=function(sctx,opts,plot){var options=opts==undefined?{}:opts;sctx=sctx==undefined?this.shadowCanvas._ctx:sctx;var j,data,gridData;
// hooks get called even if series not shown
// we don't clear canvas here, it would wipe out all other series as well.
for(j=0;j<$.jqplot.preDrawSeriesShadowHooks.length;j++)$.jqplot.preDrawSeriesShadowHooks[j].call(this,sctx,options);for(this.shadow&&(this.renderer.setGridData.call(this,plot),data=[],data=options.data?options.data:this._stack?this._plotData:this.data,gridData=options.gridData||this.renderer.makeGridData.call(this,data,plot),this.renderer.drawShadow.call(this,sctx,gridData,options,plot)),j=0;j<$.jqplot.postDrawSeriesShadowHooks.length;j++)$.jqplot.postDrawSeriesShadowHooks[j].call(this,sctx,options);sctx=opts=plot=j=data=gridData=null},
// toggles series display on plot, e.g. show/hide series
Series.prototype.toggleDisplay=function(ev,callback){var s,speed;s=ev.data.series?ev.data.series:this,ev.data.speed&&(speed=ev.data.speed),speed?s.canvas._elem.is(":hidden")||!s.show?(s.show=!0,s.canvas._elem.removeClass("jqplot-series-hidden"),s.shadowCanvas._elem&&s.shadowCanvas._elem.fadeIn(speed),s.canvas._elem.fadeIn(speed,callback),s.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+s.index).fadeIn(speed)):(s.show=!1,s.canvas._elem.addClass("jqplot-series-hidden"),s.shadowCanvas._elem&&s.shadowCanvas._elem.fadeOut(speed),s.canvas._elem.fadeOut(speed,callback),s.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+s.index).fadeOut(speed)):s.canvas._elem.is(":hidden")||!s.show?(s.show=!0,s.canvas._elem.removeClass("jqplot-series-hidden"),s.shadowCanvas._elem&&s.shadowCanvas._elem.show(),s.canvas._elem.show(0,callback),s.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+s.index).show()):(s.show=!1,s.canvas._elem.addClass("jqplot-series-hidden"),s.shadowCanvas._elem&&s.shadowCanvas._elem.hide(),s.canvas._elem.hide(0,callback),s.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+s.index).hide())},Grid.prototype=new $.jqplot.ElemContainer,Grid.prototype.constructor=Grid,Grid.prototype.init=function(){$.isFunction(this.renderer)&&(this.renderer=new this.renderer),this.renderer.init.call(this,this.rendererOptions)},Grid.prototype.createElement=function(offsets,plot){return this._offsets=offsets,this.renderer.createElement.call(this,plot)},Grid.prototype.draw=function(){this.renderer.draw.call(this)},$.jqplot.GenericCanvas=function(){$.jqplot.ElemContainer.call(this),this._ctx},$.jqplot.GenericCanvas.prototype=new $.jqplot.ElemContainer,$.jqplot.GenericCanvas.prototype.constructor=$.jqplot.GenericCanvas,$.jqplot.GenericCanvas.prototype.createElement=function(offsets,clss,plotDimensions,plot){this._offsets=offsets;var klass="jqplot";clss!=undefined&&(klass=clss);var elem;
// if new plotDimensions supplied, use them.
return elem=plot.canvasManager.getCanvas(),null!=plotDimensions&&(this._plotDimensions=plotDimensions),elem.width=this._plotDimensions.width-this._offsets.left-this._offsets.right,elem.height=this._plotDimensions.height-this._offsets.top-this._offsets.bottom,this._elem=$(elem),this._elem.css({position:"absolute",left:this._offsets.left,top:this._offsets.top}),this._elem.addClass(klass),elem=plot.canvasManager.initCanvas(elem),elem=null,this._elem},$.jqplot.GenericCanvas.prototype.setContext=function(){return this._ctx=this._elem.get(0).getContext("2d"),this._ctx},
// Memory Leaks patch
$.jqplot.GenericCanvas.prototype.resetCanvas=function(){this._elem&&($.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined&&window.G_vmlCanvasManager.uninitElement(this._elem.get(0)),
//this._elem.remove();
this._elem.emptyForce()),this._ctx=null},$.jqplot.HooksManager=function(){this.hooks=[],this.args=[]},$.jqplot.HooksManager.prototype.addOnce=function(fn,args){args=args||[];for(var havehook=!1,i=0,l=this.hooks.length;l>i;i++)this.hooks[i]==fn&&(havehook=!0);havehook||(this.hooks.push(fn),this.args.push(args))},$.jqplot.HooksManager.prototype.add=function(fn,args){args=args||[],this.hooks.push(fn),this.args.push(args)},$.jqplot.EventListenerManager=function(){this.hooks=[]},$.jqplot.EventListenerManager.prototype.addOnce=function(ev,fn){for(var h,i,havehook=!1,i=0,l=this.hooks.length;l>i;i++)h=this.hooks[i],h[0]==ev&&h[1]==fn&&(havehook=!0);havehook||this.hooks.push([ev,fn])},$.jqplot.EventListenerManager.prototype.add=function(ev,fn){this.hooks.push([ev,fn])};var _axisNames=["yMidAxis","xaxis","yaxis","x2axis","y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis"];
// conpute a highlight color or array of highlight colors from given colors.
$.jqplot.computeHighlightColors=function(colors){var ret;if($.isArray(colors)){ret=[];for(var i=0;i<colors.length;i++){for(var rgba=$.jqplot.getColorComponents(colors[i]),newrgb=[rgba[0],rgba[1],rgba[2]],sum=newrgb[0]+newrgb[1]+newrgb[2],j=0;3>j;j++)
// when darkening, lowest color component can be is 60.
newrgb[j]=sum>660?.85*newrgb[j]:.73*newrgb[j]+90,newrgb[j]=parseInt(newrgb[j],10),newrgb[j]>255?255:newrgb[j];
// newrgb[3] = (rgba[3] > 0.4) ? rgba[3] * 0.4 : rgba[3] * 1.5;
// newrgb[3] = (rgba[3] > 0.5) ? 0.8 * rgba[3] - .1 : rgba[3] + 0.2;
newrgb[3]=.3+.35*rgba[3],ret.push("rgba("+newrgb[0]+","+newrgb[1]+","+newrgb[2]+","+newrgb[3]+")")}}else{for(var rgba=$.jqplot.getColorComponents(colors),newrgb=[rgba[0],rgba[1],rgba[2]],sum=newrgb[0]+newrgb[1]+newrgb[2],j=0;3>j;j++)
// when darkening, lowest color component can be is 60.
// newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
// newrgb[j] = parseInt(newrgb[j], 10);
newrgb[j]=sum>660?.85*newrgb[j]:.73*newrgb[j]+90,newrgb[j]=parseInt(newrgb[j],10),newrgb[j]>255?255:newrgb[j];
// newrgb[3] = (rgba[3] > 0.4) ? rgba[3] * 0.4 : rgba[3] * 1.5;
// newrgb[3] = (rgba[3] > 0.5) ? 0.8 * rgba[3] - .1 : rgba[3] + 0.2;
newrgb[3]=.3+.35*rgba[3],ret="rgba("+newrgb[0]+","+newrgb[1]+","+newrgb[2]+","+newrgb[3]+")"}return ret},$.jqplot.ColorGenerator=function(colors){colors=colors||$.jqplot.config.defaultColors;var idx=0;this.next=function(){return idx<colors.length?colors[idx++]:(idx=0,colors[idx++])},this.previous=function(){return idx>0?colors[idx--]:(idx=colors.length-1,colors[idx])},
// get a color by index without advancing pointer.
this.get=function(i){var idx=i-colors.length*Math.floor(i/colors.length);return colors[idx]},this.setColors=function(c){colors=c},this.reset=function(){idx=0},this.getIndex=function(){return idx},this.setIndex=function(index){idx=index}},
// convert a hex color string to rgb string.
// h - 3 or 6 character hex string, with or without leading #
// a - optional alpha
$.jqplot.hex2rgb=function(h,a){h=h.replace("#",""),3==h.length&&(h=h.charAt(0)+h.charAt(0)+h.charAt(1)+h.charAt(1)+h.charAt(2)+h.charAt(2));var rgb;return rgb="rgba("+parseInt(h.slice(0,2),16)+", "+parseInt(h.slice(2,4),16)+", "+parseInt(h.slice(4,6),16),a&&(rgb+=", "+a),rgb+=")"},
// convert an rgb color spec to a hex spec.  ignore any alpha specification.
$.jqplot.rgb2hex=function(s){for(var pat=/rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *(?:, *[0-9.]*)?\)/,m=s.match(pat),h="#",i=1;4>i;i++){var temp;-1!=m[i].search(/%/)?(temp=parseInt(255*m[i]/100,10).toString(16),1==temp.length&&(temp="0"+temp)):(temp=parseInt(m[i],10).toString(16),1==temp.length&&(temp="0"+temp)),h+=temp}return h},
// given a css color spec, return an rgb css color spec
$.jqplot.normalize2rgb=function(s,a){if(-1!=s.search(/^ *rgba?\(/))return s;if(-1!=s.search(/^ *#?[0-9a-fA-F]?[0-9a-fA-F]/))return $.jqplot.hex2rgb(s,a);throw new Error("Invalid color spec")},
// extract the r, g, b, a color components out of a css color spec.
$.jqplot.getColorComponents=function(s){
// check to see if a color keyword.
s=$.jqplot.colorKeywordMap[s]||s;for(var rgb=$.jqplot.normalize2rgb(s),pat=/rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *,? *([0-9.]* *)?\)/,m=rgb.match(pat),ret=[],i=1;4>i;i++)-1!=m[i].search(/%/)?ret[i-1]=parseInt(255*m[i]/100,10):ret[i-1]=parseInt(m[i],10);return ret[3]=parseFloat(m[4])?parseFloat(m[4]):1,ret},$.jqplot.colorKeywordMap={aliceblue:"rgb(240, 248, 255)",antiquewhite:"rgb(250, 235, 215)",aqua:"rgb( 0, 255, 255)",aquamarine:"rgb(127, 255, 212)",azure:"rgb(240, 255, 255)",beige:"rgb(245, 245, 220)",bisque:"rgb(255, 228, 196)",black:"rgb( 0, 0, 0)",blanchedalmond:"rgb(255, 235, 205)",blue:"rgb( 0, 0, 255)",blueviolet:"rgb(138, 43, 226)",brown:"rgb(165, 42, 42)",burlywood:"rgb(222, 184, 135)",cadetblue:"rgb( 95, 158, 160)",chartreuse:"rgb(127, 255, 0)",chocolate:"rgb(210, 105, 30)",coral:"rgb(255, 127, 80)",cornflowerblue:"rgb(100, 149, 237)",cornsilk:"rgb(255, 248, 220)",crimson:"rgb(220, 20, 60)",cyan:"rgb( 0, 255, 255)",darkblue:"rgb( 0, 0, 139)",darkcyan:"rgb( 0, 139, 139)",darkgoldenrod:"rgb(184, 134, 11)",darkgray:"rgb(169, 169, 169)",darkgreen:"rgb( 0, 100, 0)",darkgrey:"rgb(169, 169, 169)",darkkhaki:"rgb(189, 183, 107)",darkmagenta:"rgb(139, 0, 139)",darkolivegreen:"rgb( 85, 107, 47)",darkorange:"rgb(255, 140, 0)",darkorchid:"rgb(153, 50, 204)",darkred:"rgb(139, 0, 0)",darksalmon:"rgb(233, 150, 122)",darkseagreen:"rgb(143, 188, 143)",darkslateblue:"rgb( 72, 61, 139)",darkslategray:"rgb( 47, 79, 79)",darkslategrey:"rgb( 47, 79, 79)",darkturquoise:"rgb( 0, 206, 209)",darkviolet:"rgb(148, 0, 211)",deeppink:"rgb(255, 20, 147)",deepskyblue:"rgb( 0, 191, 255)",dimgray:"rgb(105, 105, 105)",dimgrey:"rgb(105, 105, 105)",dodgerblue:"rgb( 30, 144, 255)",firebrick:"rgb(178, 34, 34)",floralwhite:"rgb(255, 250, 240)",forestgreen:"rgb( 34, 139, 34)",fuchsia:"rgb(255, 0, 255)",gainsboro:"rgb(220, 220, 220)",ghostwhite:"rgb(248, 248, 255)",gold:"rgb(255, 215, 0)",goldenrod:"rgb(218, 165, 32)",gray:"rgb(128, 128, 128)",grey:"rgb(128, 128, 128)",green:"rgb( 0, 128, 0)",greenyellow:"rgb(173, 255, 47)",honeydew:"rgb(240, 255, 240)",hotpink:"rgb(255, 105, 180)",indianred:"rgb(205, 92, 92)",indigo:"rgb( 75, 0, 130)",ivory:"rgb(255, 255, 240)",khaki:"rgb(240, 230, 140)",lavender:"rgb(230, 230, 250)",lavenderblush:"rgb(255, 240, 245)",lawngreen:"rgb(124, 252, 0)",lemonchiffon:"rgb(255, 250, 205)",lightblue:"rgb(173, 216, 230)",lightcoral:"rgb(240, 128, 128)",lightcyan:"rgb(224, 255, 255)",lightgoldenrodyellow:"rgb(250, 250, 210)",lightgray:"rgb(211, 211, 211)",lightgreen:"rgb(144, 238, 144)",lightgrey:"rgb(211, 211, 211)",lightpink:"rgb(255, 182, 193)",lightsalmon:"rgb(255, 160, 122)",lightseagreen:"rgb( 32, 178, 170)",lightskyblue:"rgb(135, 206, 250)",lightslategray:"rgb(119, 136, 153)",lightslategrey:"rgb(119, 136, 153)",lightsteelblue:"rgb(176, 196, 222)",lightyellow:"rgb(255, 255, 224)",lime:"rgb( 0, 255, 0)",limegreen:"rgb( 50, 205, 50)",linen:"rgb(250, 240, 230)",magenta:"rgb(255, 0, 255)",maroon:"rgb(128, 0, 0)",mediumaquamarine:"rgb(102, 205, 170)",mediumblue:"rgb( 0, 0, 205)",mediumorchid:"rgb(186, 85, 211)",mediumpurple:"rgb(147, 112, 219)",mediumseagreen:"rgb( 60, 179, 113)",mediumslateblue:"rgb(123, 104, 238)",mediumspringgreen:"rgb( 0, 250, 154)",mediumturquoise:"rgb( 72, 209, 204)",mediumvioletred:"rgb(199, 21, 133)",midnightblue:"rgb( 25, 25, 112)",mintcream:"rgb(245, 255, 250)",mistyrose:"rgb(255, 228, 225)",moccasin:"rgb(255, 228, 181)",navajowhite:"rgb(255, 222, 173)",navy:"rgb( 0, 0, 128)",oldlace:"rgb(253, 245, 230)",olive:"rgb(128, 128, 0)",olivedrab:"rgb(107, 142, 35)",orange:"rgb(255, 165, 0)",orangered:"rgb(255, 69, 0)",orchid:"rgb(218, 112, 214)",palegoldenrod:"rgb(238, 232, 170)",palegreen:"rgb(152, 251, 152)",paleturquoise:"rgb(175, 238, 238)",palevioletred:"rgb(219, 112, 147)",papayawhip:"rgb(255, 239, 213)",peachpuff:"rgb(255, 218, 185)",peru:"rgb(205, 133, 63)",pink:"rgb(255, 192, 203)",plum:"rgb(221, 160, 221)",powderblue:"rgb(176, 224, 230)",purple:"rgb(128, 0, 128)",red:"rgb(255, 0, 0)",rosybrown:"rgb(188, 143, 143)",royalblue:"rgb( 65, 105, 225)",saddlebrown:"rgb(139, 69, 19)",salmon:"rgb(250, 128, 114)",sandybrown:"rgb(244, 164, 96)",seagreen:"rgb( 46, 139, 87)",seashell:"rgb(255, 245, 238)",sienna:"rgb(160, 82, 45)",silver:"rgb(192, 192, 192)",skyblue:"rgb(135, 206, 235)",slateblue:"rgb(106, 90, 205)",slategray:"rgb(112, 128, 144)",slategrey:"rgb(112, 128, 144)",snow:"rgb(255, 250, 250)",springgreen:"rgb( 0, 255, 127)",steelblue:"rgb( 70, 130, 180)",tan:"rgb(210, 180, 140)",teal:"rgb( 0, 128, 128)",thistle:"rgb(216, 191, 216)",tomato:"rgb(255, 99, 71)",turquoise:"rgb( 64, 224, 208)",violet:"rgb(238, 130, 238)",wheat:"rgb(245, 222, 179)",white:"rgb(255, 255, 255)",whitesmoke:"rgb(245, 245, 245)",yellow:"rgb(255, 255, 0)",yellowgreen:"rgb(154, 205, 50)"},
// class: $.jqplot.AxisLabelRenderer
// Renderer to place labels on the axes.
$.jqplot.AxisLabelRenderer=function(options){
// Group: Properties
$.jqplot.ElemContainer.call(this),
// name of the axis associated with this tick
this.axis,
// prop: show
// whether or not to show the tick (mark and label).
this.show=!0,
// prop: label
// The text or html for the label.
this.label="",this.fontFamily=null,this.fontSize=null,this.textColor=null,this._elem,
// prop: escapeHTML
// true to escape HTML entities in the label.
this.escapeHTML=!1,$.extend(!0,this,options)},$.jqplot.AxisLabelRenderer.prototype=new $.jqplot.ElemContainer,$.jqplot.AxisLabelRenderer.prototype.constructor=$.jqplot.AxisLabelRenderer,$.jqplot.AxisLabelRenderer.prototype.init=function(options){$.extend(!0,this,options)},$.jqplot.AxisLabelRenderer.prototype.draw=function(ctx,plot){
// Memory Leaks patch
return this._elem&&(this._elem.emptyForce(),this._elem=null),this._elem=$('<div style="position:absolute;" class="jqplot-'+this.axis+'-label"></div>'),Number(this.label)&&this._elem.css("white-space","nowrap"),this.escapeHTML?this._elem.text(this.label):this._elem.html(this.label),this.fontFamily&&this._elem.css("font-family",this.fontFamily),this.fontSize&&this._elem.css("font-size",this.fontSize),this.textColor&&this._elem.css("color",this.textColor),this._elem},$.jqplot.AxisLabelRenderer.prototype.pack=function(){},
// class: $.jqplot.AxisTickRenderer
// A "tick" object showing the value of a tick/gridline on the plot.
$.jqplot.AxisTickRenderer=function(options){
// Group: Properties
$.jqplot.ElemContainer.call(this),
// prop: mark
// tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
this.mark="outside",
// name of the axis associated with this tick
this.axis,
// prop: showMark
// whether or not to show the mark on the axis.
this.showMark=!0,
// prop: showGridline
// whether or not to draw the gridline on the grid at this tick.
this.showGridline=!0,
// prop: isMinorTick
// if this is a minor tick.
this.isMinorTick=!1,
// prop: size
// Length of the tick beyond the grid in pixels.
// DEPRECATED: This has been superceeded by markSize
this.size=4,
// prop:  markSize
// Length of the tick marks in pixels.  For 'cross' style, length
// will be stoked above and below axis, so total length will be twice this.
this.markSize=6,
// prop: show
// whether or not to show the tick (mark and label).
// Setting this to false requires more testing.  It is recommended
// to set showLabel and showMark to false instead.
this.show=!0,
// prop: showLabel
// whether or not to show the label.
this.showLabel=!0,this.label=null,this.value=null,this._styles={},
// prop: formatter
// A class of a formatter for the tick text.  sprintf by default.
this.formatter=$.jqplot.DefaultTickFormatter,
// prop: prefix
// String to prepend to the tick label.
// Prefix is prepended to the formatted tick label.
this.prefix="",
// prop: suffix
// String to append to the tick label.
// Suffix is appended to the formatted tick label.
this.suffix="",
// prop: formatString
// string passed to the formatter.
this.formatString="",
// prop: fontFamily
// css spec for the font-family css attribute.
this.fontFamily,
// prop: fontSize
// css spec for the font-size css attribute.
this.fontSize,
// prop: textColor
// css spec for the color attribute.
this.textColor,
// prop: escapeHTML
// true to escape HTML entities in the label.
this.escapeHTML=!1,this._elem,this._breakTick=!1,$.extend(!0,this,options)},$.jqplot.AxisTickRenderer.prototype.init=function(options){$.extend(!0,this,options)},$.jqplot.AxisTickRenderer.prototype=new $.jqplot.ElemContainer,$.jqplot.AxisTickRenderer.prototype.constructor=$.jqplot.AxisTickRenderer,$.jqplot.AxisTickRenderer.prototype.setTick=function(value,axisName,isMinor){return this.value=value,this.axis=axisName,isMinor&&(this.isMinorTick=!0),this},$.jqplot.AxisTickRenderer.prototype.draw=function(){null===this.label&&(this.label=this.prefix+this.formatter(this.formatString,this.value)+this.suffix);var style={position:"absolute"};Number(this.label)&&(style.whitSpace="nowrap"),
// Memory Leaks patch
this._elem&&(this._elem.emptyForce(),this._elem=null),this._elem=$(document.createElement("div")),this._elem.addClass("jqplot-"+this.axis+"-tick"),this.escapeHTML?this._elem.text(this.label):this._elem.html(this.label),this._elem.css(style);for(var s in this._styles)this._elem.css(s,this._styles[s]);return this.fontFamily&&this._elem.css("font-family",this.fontFamily),this.fontSize&&this._elem.css("font-size",this.fontSize),this.textColor&&this._elem.css("color",this.textColor),this._breakTick&&this._elem.addClass("jqplot-breakTick"),this._elem},$.jqplot.DefaultTickFormatter=function(format,val){return"number"==typeof val?(format||(format=$.jqplot.config.defaultTickFormatString),$.jqplot.sprintf(format,val)):String(val)},$.jqplot.PercentTickFormatter=function(format,val){return"number"==typeof val?(val=100*val,format||(format=$.jqplot.config.defaultTickFormatString),$.jqplot.sprintf(format,val)):String(val)},$.jqplot.AxisTickRenderer.prototype.pack=function(){},
// Class: $.jqplot.CanvasGridRenderer
// The default jqPlot grid renderer, creating a grid on a canvas element.
// The renderer has no additional options beyond the <Grid> class.
$.jqplot.CanvasGridRenderer=function(){this.shadowRenderer=new $.jqplot.ShadowRenderer},
// called with context of Grid object
$.jqplot.CanvasGridRenderer.prototype.init=function(options){this._ctx,$.extend(!0,this,options);
// set the shadow renderer options
var sopts={lineJoin:"miter",lineCap:"round",fill:!1,isarc:!1,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.shadowWidth,closePath:!1,strokeStyle:this.shadowColor};this.renderer.shadowRenderer.init(sopts)},
// called with context of Grid.
$.jqplot.CanvasGridRenderer.prototype.createElement=function(plot){var elem;
// Memory Leaks patch
this._elem&&($.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined&&(elem=this._elem.get(0),window.G_vmlCanvasManager.uninitElement(elem),elem=null),this._elem.emptyForce(),this._elem=null),elem=plot.canvasManager.getCanvas();var w=this._plotDimensions.width,h=this._plotDimensions.height;
// avoid memory leak
return elem.width=w,elem.height=h,this._elem=$(elem),this._elem.addClass("jqplot-grid-canvas"),this._elem.css({position:"absolute",left:0,top:0}),elem=plot.canvasManager.initCanvas(elem),this._top=this._offsets.top,this._bottom=h-this._offsets.bottom,this._left=this._offsets.left,this._right=w-this._offsets.right,this._width=this._right-this._left,this._height=this._bottom-this._top,elem=null,this._elem},$.jqplot.CanvasGridRenderer.prototype.draw=function(){function drawLine(bx,by,ex,ey,opts){ctx.save(),opts=opts||{},(null==opts.lineWidth||0!=opts.lineWidth)&&($.extend(!0,ctx,opts),ctx.beginPath(),ctx.moveTo(bx,by),ctx.lineTo(ex,ey),ctx.stroke(),ctx.restore())}this._ctx=this._elem.get(0).getContext("2d");var ctx=this._ctx,axes=this._axes;
// Add the grid onto the grid canvas.  This is the bottom most layer.
ctx.save(),ctx.clearRect(0,0,this._plotDimensions.width,this._plotDimensions.height),ctx.fillStyle=this.backgroundColor||this.background,ctx.fillRect(this._left,this._top,this._width,this._height),ctx.save(),ctx.lineJoin="miter",ctx.lineCap="butt",ctx.lineWidth=this.gridLineWidth,ctx.strokeStyle=this.gridLineColor;for(var b,e,s,m,ax=["xaxis","yaxis","x2axis","y2axis"],i=4;i>0;i--){var name=ax[i-1],axis=axes[name],ticks=axis._ticks,numticks=ticks.length;if(axis.show){if(axis.drawBaseline){var bopts={};switch(null!==axis.baselineWidth&&(bopts.lineWidth=axis.baselineWidth),null!==axis.baselineColor&&(bopts.strokeStyle=axis.baselineColor),name){case"xaxis":drawLine(this._left,this._bottom,this._right,this._bottom,bopts);break;case"yaxis":drawLine(this._left,this._bottom,this._left,this._top,bopts);break;case"x2axis":drawLine(this._left,this._bottom,this._right,this._bottom,bopts);break;case"y2axis":drawLine(this._right,this._bottom,this._right,this._top,bopts)}}for(var j=numticks;j>0;j--){var t=ticks[j-1];if(t.show){var pos=Math.round(axis.u2p(t.value))+.5;switch(name){case"xaxis":
// draw the mark
if(
// draw the grid line if we should
t.showGridline&&this.drawGridlines&&(!t.isMinorTick&&axis.drawMajorGridlines||t.isMinorTick&&axis.drawMinorGridlines)&&drawLine(pos,this._top,pos,this._bottom),t.showMark&&t.mark&&(!t.isMinorTick&&axis.drawMajorTickMarks||t.isMinorTick&&axis.drawMinorTickMarks)){s=t.markSize,m=t.mark;var pos=Math.round(axis.u2p(t.value))+.5;switch(m){case"outside":b=this._bottom,e=this._bottom+s;break;case"inside":b=this._bottom-s,e=this._bottom;break;case"cross":b=this._bottom-s,e=this._bottom+s;break;default:b=this._bottom,e=this._bottom+s}
// draw the shadow
this.shadow&&this.renderer.shadowRenderer.draw(ctx,[[pos,b],[pos,e]],{lineCap:"butt",lineWidth:this.gridLineWidth,offset:.75*this.gridLineWidth,depth:2,fill:!1,closePath:!1}),
// draw the line
drawLine(pos,b,pos,e)}break;case"yaxis":
// draw the mark
if(
// draw the grid line
t.showGridline&&this.drawGridlines&&(!t.isMinorTick&&axis.drawMajorGridlines||t.isMinorTick&&axis.drawMinorGridlines)&&drawLine(this._right,pos,this._left,pos),t.showMark&&t.mark&&(!t.isMinorTick&&axis.drawMajorTickMarks||t.isMinorTick&&axis.drawMinorTickMarks)){s=t.markSize,m=t.mark;var pos=Math.round(axis.u2p(t.value))+.5;switch(m){case"outside":b=this._left-s,e=this._left;break;case"inside":b=this._left,e=this._left+s;break;case"cross":b=this._left-s,e=this._left+s;break;default:b=this._left-s,e=this._left}
// draw the shadow
this.shadow&&this.renderer.shadowRenderer.draw(ctx,[[b,pos],[e,pos]],{lineCap:"butt",lineWidth:1.5*this.gridLineWidth,offset:.75*this.gridLineWidth,fill:!1,closePath:!1}),drawLine(b,pos,e,pos,{strokeStyle:axis.borderColor})}break;case"x2axis":
// draw the mark
if(
// draw the grid line
t.showGridline&&this.drawGridlines&&(!t.isMinorTick&&axis.drawMajorGridlines||t.isMinorTick&&axis.drawMinorGridlines)&&drawLine(pos,this._bottom,pos,this._top),t.showMark&&t.mark&&(!t.isMinorTick&&axis.drawMajorTickMarks||t.isMinorTick&&axis.drawMinorTickMarks)){s=t.markSize,m=t.mark;var pos=Math.round(axis.u2p(t.value))+.5;switch(m){case"outside":b=this._top-s,e=this._top;break;case"inside":b=this._top,e=this._top+s;break;case"cross":b=this._top-s,e=this._top+s;break;default:b=this._top-s,e=this._top}
// draw the shadow
this.shadow&&this.renderer.shadowRenderer.draw(ctx,[[pos,b],[pos,e]],{lineCap:"butt",lineWidth:this.gridLineWidth,offset:.75*this.gridLineWidth,depth:2,fill:!1,closePath:!1}),drawLine(pos,b,pos,e)}break;case"y2axis":
// draw the mark
if(
// draw the grid line
t.showGridline&&this.drawGridlines&&(!t.isMinorTick&&axis.drawMajorGridlines||t.isMinorTick&&axis.drawMinorGridlines)&&drawLine(this._left,pos,this._right,pos),t.showMark&&t.mark&&(!t.isMinorTick&&axis.drawMajorTickMarks||t.isMinorTick&&axis.drawMinorTickMarks)){s=t.markSize,m=t.mark;var pos=Math.round(axis.u2p(t.value))+.5;switch(m){case"outside":b=this._right,e=this._right+s;break;case"inside":b=this._right-s,e=this._right;break;case"cross":b=this._right-s,e=this._right+s;break;default:b=this._right,e=this._right+s}
// draw the shadow
this.shadow&&this.renderer.shadowRenderer.draw(ctx,[[b,pos],[e,pos]],{lineCap:"butt",lineWidth:1.5*this.gridLineWidth,offset:.75*this.gridLineWidth,fill:!1,closePath:!1}),drawLine(b,pos,e,pos,{strokeStyle:axis.borderColor})}}}}t=null}axis=null,ticks=null}
// Now draw grid lines for additional y axes
//////
// TO DO: handle yMidAxis
//////
ax=["y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis","yMidAxis"];for(var i=7;i>0;i--){var axis=axes[ax[i-1]],ticks=axis._ticks;if(axis.show){var tn=ticks[axis.numberTicks-1],t0=ticks[0],left=axis.getLeft(),points=[[left,tn.getTop()+tn.getHeight()/2],[left,t0.getTop()+t0.getHeight()/2+1]];
// draw the shadow
this.shadow&&this.renderer.shadowRenderer.draw(ctx,points,{lineCap:"butt",fill:!1,closePath:!1}),
// draw the line
drawLine(points[0][0],points[0][1],points[1][0],points[1][1],{lineCap:"butt",strokeStyle:axis.borderColor,lineWidth:axis.borderWidth});
// draw the tick marks
for(var j=ticks.length;j>0;j--){var t=ticks[j-1];s=t.markSize,m=t.mark;var pos=Math.round(axis.u2p(t.value))+.5;if(t.showMark&&t.mark){switch(m){case"outside":b=left,e=left+s;break;case"inside":b=left-s,e=left;break;case"cross":b=left-s,e=left+s;break;default:b=left,e=left+s}points=[[b,pos],[e,pos]],
// draw the shadow
this.shadow&&this.renderer.shadowRenderer.draw(ctx,points,{lineCap:"butt",lineWidth:1.5*this.gridLineWidth,offset:.75*this.gridLineWidth,fill:!1,closePath:!1}),
// draw the line
drawLine(b,pos,e,pos,{strokeStyle:axis.borderColor})}t=null}t0=null}axis=null,ticks=null}if(ctx.restore(),this.shadow){var points=[[this._left,this._bottom],[this._right,this._bottom],[this._right,this._top]];this.renderer.shadowRenderer.draw(ctx,points)}
// Now draw border around grid.  Use axis border definitions. start at
// upper left and go clockwise.
0!=this.borderWidth&&this.drawBorder&&(drawLine(this._left,this._top,this._right,this._top,{lineCap:"round",strokeStyle:axes.x2axis.borderColor,lineWidth:axes.x2axis.borderWidth}),drawLine(this._right,this._top,this._right,this._bottom,{lineCap:"round",strokeStyle:axes.y2axis.borderColor,lineWidth:axes.y2axis.borderWidth}),drawLine(this._right,this._bottom,this._left,this._bottom,{lineCap:"round",strokeStyle:axes.xaxis.borderColor,lineWidth:axes.xaxis.borderWidth}),drawLine(this._left,this._bottom,this._left,this._top,{lineCap:"round",strokeStyle:axes.yaxis.borderColor,lineWidth:axes.yaxis.borderWidth})),
// ctx.lineWidth = this.borderWidth;
// ctx.strokeStyle = this.borderColor;
// ctx.strokeRect(this._left, this._top, this._width, this._height);
ctx.restore(),ctx=null,axes=null},
// Class: $.jqplot.DivTitleRenderer
// The default title renderer for jqPlot.  This class has no options beyond the <Title> class. 
$.jqplot.DivTitleRenderer=function(){},$.jqplot.DivTitleRenderer.prototype.init=function(options){$.extend(!0,this,options)},$.jqplot.DivTitleRenderer.prototype.draw=function(){
// Memory Leaks patch
this._elem&&(this._elem.emptyForce(),this._elem=null);var elem=(this.renderer,document.createElement("div"));if(this._elem=$(elem),this._elem.addClass("jqplot-title"),this.text){if(this.text){var color;this.color?color=this.color:this.textColor&&(color=this.textColor);
// don't trust that a stylesheet is present, set the position.
var styles={position:"absolute",top:"0px",left:"0px"};this._plotWidth&&(styles.width=this._plotWidth+"px"),this.fontSize&&(styles.fontSize=this.fontSize),"string"==typeof this.textAlign?styles.textAlign=this.textAlign:styles.textAlign="center",color&&(styles.color=color),this.paddingBottom&&(styles.paddingBottom=this.paddingBottom),this.fontFamily&&(styles.fontFamily=this.fontFamily),this._elem.css(styles),this.escapeHtml?this._elem.text(this.text):this._elem.html(this.text)}}else this.show=!1,this._elem.height(0),this._elem.width(0);return elem=null,this._elem},$.jqplot.DivTitleRenderer.prototype.pack=function(){};var dotlen=.1;$.jqplot.LinePattern=function(ctx,pattern){var defaultLinePatterns={dotted:[dotlen,$.jqplot.config.dotGapLength],dashed:[$.jqplot.config.dashLength,$.jqplot.config.gapLength],solid:null};if("string"==typeof pattern)if("."===pattern[0]||"-"===pattern[0]){var s=pattern;pattern=[];for(var i=0,imax=s.length;imax>i;i++){if("."===s[i])pattern.push(dotlen);else{if("-"!==s[i])continue;pattern.push($.jqplot.config.dashLength)}pattern.push($.jqplot.config.gapLength)}}else pattern=defaultLinePatterns[pattern];if(!pattern||!pattern.length)return ctx;var patternIndex=0,patternDistance=pattern[0],px=0,py=0,pathx0=0,pathy0=0,moveTo=function(x,y){ctx.moveTo(x,y),px=x,py=y,pathx0=x,pathy0=y},lineTo=function(x,y){var scale=ctx.lineWidth,dx=x-px,dy=y-py,dist=Math.sqrt(dx*dx+dy*dy);if(dist>0&&scale>0)for(dx/=dist,dy/=dist;;){var dp=scale*patternDistance;if(!(dist>dp)){px=x,py=y,0==(1&patternIndex)?ctx.lineTo(px,py):ctx.moveTo(px,py),patternDistance-=dist/scale;break}px+=dp*dx,py+=dp*dy,0==(1&patternIndex)?ctx.lineTo(px,py):ctx.moveTo(px,py),dist-=dp,patternIndex++,patternIndex>=pattern.length&&(patternIndex=0),patternDistance=pattern[patternIndex]}},beginPath=function(){ctx.beginPath()},closePath=function(){lineTo(pathx0,pathy0)};return{moveTo:moveTo,lineTo:lineTo,beginPath:beginPath,closePath:closePath}},
// Class: $.jqplot.LineRenderer
// The default line renderer for jqPlot, this class has no options beyond the <Series> class.
// Draws series as a line.
$.jqplot.LineRenderer=function(){this.shapeRenderer=new $.jqplot.ShapeRenderer,this.shadowRenderer=new $.jqplot.ShadowRenderer},
// called with scope of series.
$.jqplot.LineRenderer.prototype.init=function(options,plot){options=options||{},this._type="line",this.renderer.animation={show:!1,direction:"left",speed:2500,_supported:!0},this.renderer.smooth=!1,this.renderer.tension=null,this.renderer.constrainSmoothing=!0,this.renderer._smoothedData=[],this.renderer._smoothedPlotData=[],this.renderer._hiBandGridData=[],this.renderer._lowBandGridData=[],this.renderer._hiBandSmoothedData=[],this.renderer._lowBandSmoothedData=[],this.renderer.bandData=[],this.renderer.bands={show:!1,hiData:[],lowData:[],color:this.color,showLines:!1,fill:!0,fillColor:null,_min:null,_max:null,interval:"3%"};var lopts={highlightMouseOver:options.highlightMouseOver,highlightMouseDown:options.highlightMouseDown,highlightColor:options.highlightColor};delete options.highlightMouseOver,delete options.highlightMouseDown,delete options.highlightColor,$.extend(!0,this.renderer,options),this.renderer.options=options,
// if we are given some band data, and bands aren't explicity set to false in options, turn them on.
this.renderer.bandData.length>1&&(!options.bands||null==options.bands.show)?this.renderer.bands.show=!0:options.bands&&null==options.bands.show&&null!=options.bands.interval&&(this.renderer.bands.show=!0),
// if plot is filled, turn off bands.
this.fill&&(this.renderer.bands.show=!1),this.renderer.bands.show&&this.renderer.initBands.call(this,this.renderer.options,plot),
// smoothing is not compatible with stacked lines, disable
this._stack&&(this.renderer.smooth=!1);
// set the shape renderer options
var opts={lineJoin:this.lineJoin,lineCap:this.lineCap,fill:this.fill,isarc:!1,strokeStyle:this.color,fillStyle:this.fillColor,lineWidth:this.lineWidth,linePattern:this.linePattern,closePath:this.fill};this.renderer.shapeRenderer.init(opts);var shadow_offset=options.shadowOffset;
// set the shadow renderer options
null==shadow_offset&&(
// scale the shadowOffset to the width of the line.
shadow_offset=this.lineWidth>2.5?1.25*(1+.6*(Math.atan(this.lineWidth/2.5)/.785398163-1)):1.25*Math.atan(this.lineWidth/2.5)/.785398163);var sopts={lineJoin:this.lineJoin,lineCap:this.lineCap,fill:this.fill,isarc:!1,angle:this.shadowAngle,offset:shadow_offset,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.lineWidth,linePattern:this.linePattern,closePath:this.fill};if(this.renderer.shadowRenderer.init(sopts),this._areaPoints=[],this._boundingBox=[[],[]],!this.isTrendline&&this.fill||this.renderer.bands.show){if(
// Group: Properties
//        
// prop: highlightMouseOver
// True to highlight area on a filled plot when moused over.
// This must be false to enable highlightMouseDown to highlight when clicking on an area on a filled plot.
this.highlightMouseOver=!0,
// prop: highlightMouseDown
// True to highlight when a mouse button is pressed over an area on a filled plot.
// This will be disabled if highlightMouseOver is true.
this.highlightMouseDown=!1,
// prop: highlightColor
// color to use when highlighting an area on a filled plot.
this.highlightColor=null,
// if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
lopts.highlightMouseDown&&null==lopts.highlightMouseOver&&(lopts.highlightMouseOver=!1),$.extend(!0,this,{highlightMouseOver:lopts.highlightMouseOver,highlightMouseDown:lopts.highlightMouseDown,highlightColor:lopts.highlightColor}),!this.highlightColor){var fc=this.renderer.bands.show?this.renderer.bands.fillColor:this.fillColor;this.highlightColor=$.jqplot.computeHighlightColors(fc)}
// turn off (disable) the highlighter plugin
this.highlighter&&(this.highlighter.show=!1)}!this.isTrendline&&plot&&(plot.plugins.lineRenderer={},plot.postInitHooks.addOnce(postInit),plot.postDrawHooks.addOnce(postPlotDraw),plot.eventListenerHooks.addOnce("jqplotMouseMove",handleMove),plot.eventListenerHooks.addOnce("jqplotMouseDown",handleMouseDown),plot.eventListenerHooks.addOnce("jqplotMouseUp",handleMouseUp),plot.eventListenerHooks.addOnce("jqplotClick",handleClick),plot.eventListenerHooks.addOnce("jqplotRightClick",handleRightClick))},$.jqplot.LineRenderer.prototype.initBands=function(options,plot){
// use bandData if no data specified in bands option
//var bd = this.renderer.bandData;
var bd=options.bandData||[],bands=this.renderer.bands;bands.hiData=[],bands.lowData=[];var data=this.data;
// If 2 arrays, and each array greater than 2 elements, assume it is hi and low data bands of y values.
if(bands._max=null,bands._min=null,2==bd.length)
// Do we have an array of x,y values?
// like [[[1,1], [2,4], [3,3]], [[1,3], [2,6], [3,5]]]
if($.isArray(bd[0][0])){for(var p,bdminidx=0,bdmaxidx=0,i=0,l=bd[0].length;l>i;i++)p=bd[0][i],(null!=p[1]&&p[1]>bands._max||null==bands._max)&&(bands._max=p[1]),(null!=p[1]&&p[1]<bands._min||null==bands._min)&&(bands._min=p[1]);for(var i=0,l=bd[1].length;l>i;i++)p=bd[1][i],(null!=p[1]&&p[1]>bands._max||null==bands._max)&&(bands._max=p[1],bdmaxidx=1),(null!=p[1]&&p[1]<bands._min||null==bands._min)&&(bands._min=p[1],bdminidx=1);bdmaxidx===bdminidx&&(bands.show=!1),bands.hiData=bd[bdmaxidx],bands.lowData=bd[bdminidx]}else if(bd[0].length===data.length&&bd[1].length===data.length)for(var hi=bd[0][0]>bd[1][0]?0:1,low=hi?0:1,i=0,l=data.length;l>i;i++)bands.hiData.push([data[i][0],bd[hi][i]]),bands.lowData.push([data[i][0],bd[low][i]]);else bands.show=!1;else if(bd.length>2&&!$.isArray(bd[0][0]))for(var hi=bd[0][0]>bd[0][1]?0:1,low=hi?0:1,i=0,l=bd.length;l>i;i++)bands.hiData.push([data[i][0],bd[i][hi]]),bands.lowData.push([data[i][0],bd[i][low]]);else{var intrv=bands.interval,a=null,b=null,afunc=null,bfunc=null;if($.isArray(intrv)?(a=intrv[0],b=intrv[1]):a=intrv,isNaN(a)?
// we have a string
"%"===a.charAt(a.length-1)&&(afunc="multiply",a=parseFloat(a)/100+1):(a=parseFloat(a),afunc="add"),null!==b&&isNaN(b)?
// we have a string
"%"===b.charAt(b.length-1)&&(bfunc="multiply",b=parseFloat(b)/100+1):null!==b&&(b=parseFloat(b),bfunc="add"),null!==a){
// make sure a always applies to hi band.
if(null===b&&(b=-a,bfunc=afunc,"multiply"===bfunc&&(b+=2)),b>a){var temp=a;a=b,b=temp,temp=afunc,afunc=bfunc,bfunc=temp}for(var i=0,l=data.length;l>i;i++){switch(afunc){case"add":bands.hiData.push([data[i][0],data[i][1]+a]);break;case"multiply":bands.hiData.push([data[i][0],data[i][1]*a])}switch(bfunc){case"add":bands.lowData.push([data[i][0],data[i][1]+b]);break;case"multiply":bands.lowData.push([data[i][0],data[i][1]*b])}}}else bands.show=!1}for(var hd=bands.hiData,ld=bands.lowData,i=0,l=hd.length;l>i;i++)(null!=hd[i][1]&&hd[i][1]>bands._max||null==bands._max)&&(bands._max=hd[i][1]);for(var i=0,l=ld.length;l>i;i++)(null!=ld[i][1]&&ld[i][1]<bands._min||null==bands._min)&&(bands._min=ld[i][1]);
// one last check for proper data
// these don't apply any more since allowing arbitrary x,y values
// if (bands.hiData.length != bands.lowData.length) {
//     bands.show = false;
// }
// if (bands.hiData.length != this.data.length) {
//     bands.show = false;
// }
if(null===bands.fillColor){var c=$.jqplot.getColorComponents(bands.color);
// now adjust alpha to differentiate fill
c[3]=.5*c[3],bands.fillColor="rgba("+c[0]+", "+c[1]+", "+c[2]+", "+c[3]+")"}},
// setGridData
// converts the user data values to grid coordinates and stores them
// in the gridData array.
// Called with scope of a series.
$.jqplot.LineRenderer.prototype.setGridData=function(plot){
// recalculate the grid data
var xp=this._xaxis.series_u2p,yp=this._yaxis.series_u2p,data=this._plotData,pdata=this._prevPlotData;this.gridData=[],this._prevGridData=[],this.renderer._smoothedData=[],this.renderer._smoothedPlotData=[],this.renderer._hiBandGridData=[],this.renderer._lowBandGridData=[],this.renderer._hiBandSmoothedData=[],this.renderer._lowBandSmoothedData=[];for(var bands=this.renderer.bands,hasNull=!1,i=0,l=data.length;l>i;i++)
// if not a line series or if no nulls in data, push the converted point onto the array.
null!=data[i][0]&&null!=data[i][1]?this.gridData.push([xp.call(this._xaxis,data[i][0]),yp.call(this._yaxis,data[i][1])]):null==data[i][0]?(hasNull=!0,this.gridData.push([null,yp.call(this._yaxis,data[i][1])])):null==data[i][1]&&(hasNull=!0,this.gridData.push([xp.call(this._xaxis,data[i][0]),null])),
// if not a line series or if no nulls in data, push the converted point onto the array.
null!=pdata[i]&&null!=pdata[i][0]&&null!=pdata[i][1]?this._prevGridData.push([xp.call(this._xaxis,pdata[i][0]),yp.call(this._yaxis,pdata[i][1])]):null!=pdata[i]&&null==pdata[i][0]?this._prevGridData.push([null,yp.call(this._yaxis,pdata[i][1])]):null!=pdata[i]&&null!=pdata[i][0]&&null==pdata[i][1]&&this._prevGridData.push([xp.call(this._xaxis,pdata[i][0]),null]);if(
// don't do smoothing or bands on broken lines.
hasNull&&(this.renderer.smooth=!1,"line"===this._type&&(bands.show=!1)),"line"===this._type&&bands.show){for(var i=0,l=bands.hiData.length;l>i;i++)this.renderer._hiBandGridData.push([xp.call(this._xaxis,bands.hiData[i][0]),yp.call(this._yaxis,bands.hiData[i][1])]);for(var i=0,l=bands.lowData.length;l>i;i++)this.renderer._lowBandGridData.push([xp.call(this._xaxis,bands.lowData[i][0]),yp.call(this._yaxis,bands.lowData[i][1])])}
// calculate smoothed data if enough points and no nulls
if("line"===this._type&&this.renderer.smooth&&this.gridData.length>2){var ret;this.renderer.constrainSmoothing?(ret=computeConstrainedSmoothedData.call(this,this.gridData),this.renderer._smoothedData=ret[0],this.renderer._smoothedPlotData=ret[1],bands.show&&(ret=computeConstrainedSmoothedData.call(this,this.renderer._hiBandGridData),this.renderer._hiBandSmoothedData=ret[0],ret=computeConstrainedSmoothedData.call(this,this.renderer._lowBandGridData),this.renderer._lowBandSmoothedData=ret[0]),ret=null):(ret=computeHermiteSmoothedData.call(this,this.gridData),this.renderer._smoothedData=ret[0],this.renderer._smoothedPlotData=ret[1],bands.show&&(ret=computeHermiteSmoothedData.call(this,this.renderer._hiBandGridData),this.renderer._hiBandSmoothedData=ret[0],ret=computeHermiteSmoothedData.call(this,this.renderer._lowBandGridData),this.renderer._lowBandSmoothedData=ret[0]),ret=null)}},
// makeGridData
// converts any arbitrary data values to grid coordinates and
// returns them.  This method exists so that plugins can use a series'
// linerenderer to generate grid data points without overwriting the
// grid data associated with that series.
// Called with scope of a series.
$.jqplot.LineRenderer.prototype.makeGridData=function(data,plot){
// recalculate the grid data
var xp=this._xaxis.series_u2p,yp=this._yaxis.series_u2p,gd=[];this.renderer._smoothedData=[],this.renderer._smoothedPlotData=[],this.renderer._hiBandGridData=[],this.renderer._lowBandGridData=[],this.renderer._hiBandSmoothedData=[],this.renderer._lowBandSmoothedData=[];for(var bands=this.renderer.bands,hasNull=!1,i=0;i<data.length;i++)
// if not a line series or if no nulls in data, push the converted point onto the array.
null!=data[i][0]&&null!=data[i][1]?gd.push([xp.call(this._xaxis,data[i][0]),yp.call(this._yaxis,data[i][1])]):null==data[i][0]?(hasNull=!0,gd.push([null,yp.call(this._yaxis,data[i][1])])):null==data[i][1]&&(hasNull=!0,gd.push([xp.call(this._xaxis,data[i][0]),null]));if(
// don't do smoothing or bands on broken lines.
hasNull&&(this.renderer.smooth=!1,"line"===this._type&&(bands.show=!1)),"line"===this._type&&bands.show){for(var i=0,l=bands.hiData.length;l>i;i++)this.renderer._hiBandGridData.push([xp.call(this._xaxis,bands.hiData[i][0]),yp.call(this._yaxis,bands.hiData[i][1])]);for(var i=0,l=bands.lowData.length;l>i;i++)this.renderer._lowBandGridData.push([xp.call(this._xaxis,bands.lowData[i][0]),yp.call(this._yaxis,bands.lowData[i][1])])}if("line"===this._type&&this.renderer.smooth&&gd.length>2){var ret;this.renderer.constrainSmoothing?(ret=computeConstrainedSmoothedData.call(this,gd),this.renderer._smoothedData=ret[0],this.renderer._smoothedPlotData=ret[1],bands.show&&(ret=computeConstrainedSmoothedData.call(this,this.renderer._hiBandGridData),this.renderer._hiBandSmoothedData=ret[0],ret=computeConstrainedSmoothedData.call(this,this.renderer._lowBandGridData),this.renderer._lowBandSmoothedData=ret[0]),ret=null):(ret=computeHermiteSmoothedData.call(this,gd),this.renderer._smoothedData=ret[0],this.renderer._smoothedPlotData=ret[1],bands.show&&(ret=computeHermiteSmoothedData.call(this,this.renderer._hiBandGridData),this.renderer._hiBandSmoothedData=ret[0],ret=computeHermiteSmoothedData.call(this,this.renderer._lowBandGridData),this.renderer._lowBandSmoothedData=ret[0]),ret=null)}return gd},
// called within scope of series.
$.jqplot.LineRenderer.prototype.draw=function(ctx,gd,options,plot){var i,xmin,ymin,xmax,ymax,opts=$.extend(!0,{},options),shadow=opts.shadow!=undefined?opts.shadow:this.shadow,showLine=opts.showLine!=undefined?opts.showLine:this.showLine,fill=opts.fill!=undefined?opts.fill:this.fill,fillAndStroke=opts.fillAndStroke!=undefined?opts.fillAndStroke:this.fillAndStroke;if(ctx.save(),gd.length){if(showLine)
// if we fill, we'll have to add points to close the curve.
if(fill){if(this.fillToZero){
// have to break line up into shapes at axis crossings
var negativeColor=this.negativeColor;this.useNegativeColors||(negativeColor=opts.fillStyle);var isnegative=!1,posfs=opts.fillStyle;
// if stoking line as well as filling, get a copy of line data.
if(fillAndStroke)var fasgd=gd.slice(0);
// if not stacked, fill down to axis
if(0!=this.index&&this._stack){for(var prev=this._prevGridData,i=prev.length;i>0;i--)gd.push(prev[i-1]);shadow&&this.renderer.shadowRenderer.draw(ctx,gd,opts),this._areaPoints=gd,this.renderer.shapeRenderer.draw(ctx,gd,opts)}else{var tempgd=[],pd=this.renderer.smooth?this.renderer._smoothedPlotData:this._plotData;this._areaPoints=[];var pyzero=this._yaxis.series_u2p(this.fillToValue);this._xaxis.series_u2p(this.fillToValue);if(opts.closePath=!0,"y"==this.fillAxis){tempgd.push([gd[0][0],pyzero]),this._areaPoints.push([gd[0][0],pyzero]);for(var i=0;i<gd.length-1;i++)
// do we have an axis crossing?
if(tempgd.push(gd[i]),this._areaPoints.push(gd[i]),pd[i][1]*pd[i+1][1]<=0){pd[i][1]<0?(isnegative=!0,opts.fillStyle=negativeColor):(isnegative=!1,opts.fillStyle=posfs);var xintercept=gd[i][0]+(gd[i+1][0]-gd[i][0])*(pyzero-gd[i][1])/(gd[i+1][1]-gd[i][1]);tempgd.push([xintercept,pyzero]),this._areaPoints.push([xintercept,pyzero]),
// now draw this shape and shadow.
shadow&&this.renderer.shadowRenderer.draw(ctx,tempgd,opts),this.renderer.shapeRenderer.draw(ctx,tempgd,opts),
// now empty temp array and continue
tempgd=[[xintercept,pyzero]]}pd[gd.length-1][1]<0?(isnegative=!0,opts.fillStyle=negativeColor):(isnegative=!1,opts.fillStyle=posfs),tempgd.push(gd[gd.length-1]),this._areaPoints.push(gd[gd.length-1]),tempgd.push([gd[gd.length-1][0],pyzero]),this._areaPoints.push([gd[gd.length-1][0],pyzero])}
// now draw the last area.
shadow&&this.renderer.shadowRenderer.draw(ctx,tempgd,opts),this.renderer.shapeRenderer.draw(ctx,tempgd,opts)}}else{
// if stoking line as well as filling, get a copy of line data.
if(fillAndStroke)var fasgd=gd.slice(0);
// if not stacked, fill down to axis
if(0!=this.index&&this._stack)for(var prev=this._prevGridData,i=prev.length;i>0;i--)gd.push(prev[i-1]);else{
// var gridymin = this._yaxis.series_u2p(this._yaxis.min) - this.gridBorderWidth / 2;
var gridymin=ctx.canvas.height;
// IE doesn't return new length on unshift
gd.unshift([gd[0][0],gridymin]);var len=gd.length;gd.push([gd[len-1][0],gridymin])}this._areaPoints=gd,shadow&&this.renderer.shadowRenderer.draw(ctx,gd,opts),this.renderer.shapeRenderer.draw(ctx,gd,opts)}if(fillAndStroke){var fasopts=$.extend(!0,{},opts,{fill:!1,closePath:!1});
//////////
// TODO: figure out some way to do shadows nicely
// if (shadow) {
//     this.renderer.shadowRenderer.draw(ctx, fasgd, fasopts);
// }
// now draw the markers
if(this.renderer.shapeRenderer.draw(ctx,fasgd,fasopts),this.markerRenderer.show)for(this.renderer.smooth&&(fasgd=this.gridData),i=0;i<fasgd.length;i++)this.markerRenderer.draw(fasgd[i][0],fasgd[i][1],ctx,opts.markerOptions)}}else{if(this.renderer.bands.show){var bdat,bopts=$.extend(!0,{},opts);this.renderer.bands.showLines&&(bdat=this.renderer.smooth?this.renderer._hiBandSmoothedData:this.renderer._hiBandGridData,this.renderer.shapeRenderer.draw(ctx,bdat,opts),bdat=this.renderer.smooth?this.renderer._lowBandSmoothedData:this.renderer._lowBandGridData,this.renderer.shapeRenderer.draw(ctx,bdat,bopts)),this.renderer.bands.fill&&(bdat=this.renderer.smooth?this.renderer._hiBandSmoothedData.concat(this.renderer._lowBandSmoothedData.reverse()):this.renderer._hiBandGridData.concat(this.renderer._lowBandGridData.reverse()),this._areaPoints=bdat,bopts.closePath=!0,bopts.fill=!0,bopts.fillStyle=this.renderer.bands.fillColor,this.renderer.shapeRenderer.draw(ctx,bdat,bopts))}shadow&&this.renderer.shadowRenderer.draw(ctx,gd,opts),this.renderer.shapeRenderer.draw(ctx,gd,opts)}
// calculate the bounding box
var xmin=xmax=ymin=ymax=null;for(i=0;i<this._areaPoints.length;i++){var p=this._areaPoints[i];(xmin>p[0]||null==xmin)&&(xmin=p[0]),(ymax<p[1]||null==ymax)&&(ymax=p[1]),(xmax<p[0]||null==xmax)&&(xmax=p[0]),(ymin>p[1]||null==ymin)&&(ymin=p[1])}
// now draw the markers
if("line"===this.type&&this.renderer.bands.show&&(ymax=this._yaxis.series_u2p(this.renderer.bands._min),ymin=this._yaxis.series_u2p(this.renderer.bands._max)),this._boundingBox=[[xmin,ymax],[xmax,ymin]],this.markerRenderer.show&&!fill)for(this.renderer.smooth&&(gd=this.gridData),i=0;i<gd.length;i++)null!=gd[i][0]&&null!=gd[i][1]&&this.markerRenderer.draw(gd[i][0],gd[i][1],ctx,opts.markerOptions)}ctx.restore()},$.jqplot.LineRenderer.prototype.drawShadow=function(ctx,gd,options){},
// class: $.jqplot.LinearAxisRenderer
// The default jqPlot axis renderer, creating a numeric axis.
$.jqplot.LinearAxisRenderer=function(){},
// called with scope of axis object.
$.jqplot.LinearAxisRenderer.prototype.init=function(options){
// prop: breakPoints
// EXPERIMENTAL!! Use at your own risk!
// Works only with linear axes and the default tick renderer.
// Array of [start, stop] points to create a broken axis.
// Broken axes have a "jump" in them, which is an immediate 
// transition from a smaller value to a larger value.
// Currently, axis ticks MUST be manually assigned if using breakPoints
// by using the axis ticks array option.
this.breakPoints=null,
// prop: breakTickLabel
// Label to use at the axis break if breakPoints are specified.
this.breakTickLabel="&asymp;",
// prop: drawBaseline
// True to draw the axis baseline.
this.drawBaseline=!0,
// prop: baselineWidth
// width of the baseline in pixels.
this.baselineWidth=null,
// prop: baselineColor
// CSS color spec for the baseline.
this.baselineColor=null,
// prop: forceTickAt0
// This will ensure that there is always a tick mark at 0.
// If data range is strictly positive or negative,
// this will force 0 to be inside the axis bounds unless
// the appropriate axis pad (pad, padMin or padMax) is set
// to 0, then this will force an axis min or max value at 0.
// This has know effect when any of the following options
// are set:  autoscale, min, max, numberTicks or tickInterval.
this.forceTickAt0=!1,
// prop: forceTickAt100
// This will ensure that there is always a tick mark at 100.
// If data range is strictly above or below 100,
// this will force 100 to be inside the axis bounds unless
// the appropriate axis pad (pad, padMin or padMax) is set
// to 0, then this will force an axis min or max value at 100.
// This has know effect when any of the following options
// are set:  autoscale, min, max, numberTicks or tickInterval.
this.forceTickAt100=!1,
// prop: tickInset
// Controls the amount to inset the first and last ticks from 
// the edges of the grid, in multiples of the tick interval.
// 0 is no inset, 0.5 is one half a tick interval, 1 is a full
// tick interval, etc.
this.tickInset=0,
// prop: minorTicks
// Number of ticks to add between "major" ticks.
// Major ticks are ticks supplied by user or auto computed.
// Minor ticks cannot be created by user.
this.minorTicks=0,
// prop: alignTicks
// true to align tick marks across opposed axes
// such as from the y2axis to yaxis.
this.alignTicks=!1,this._autoFormatString="",this._overrideFormatString=!1,this._scalefact=1,$.extend(!0,this,options),this.breakPoints&&($.isArray(this.breakPoints)?(this.breakPoints.length<2||this.breakPoints[1]<=this.breakPoints[0])&&(this.breakPoints=null):this.breakPoints=null),null!=this.numberTicks&&this.numberTicks<2&&(this.numberTicks=2),this.resetDataBounds()},
// called with scope of axis
$.jqplot.LinearAxisRenderer.prototype.draw=function(ctx,plot){if(this.show){
// populate the axis label and value properties.
// createTicks is a method on the renderer, but
// call it within the scope of the axis.
this.renderer.createTicks.call(this,plot);if(
// Added for theming.
this._elem&&(
// Memory Leaks patch
//this._elem.empty();
this._elem.emptyForce(),this._elem=null),this._elem=$(document.createElement("div")),this._elem.addClass("jqplot-axis jqplot-"+this.name),this._elem.css("position","absolute"),"xaxis"==this.name||"x2axis"==this.name?this._elem.width(this._plotDimensions.width):this._elem.height(this._plotDimensions.height),
// create a _label object.
this.labelOptions.axis=this.name,this._label=new this.labelRenderer(this.labelOptions),this._label.show){var elem=this._label.draw(ctx,plot);elem.appendTo(this._elem),elem=null}for(var tick,t=this._ticks,i=0;i<t.length;i++)tick=t[i],tick.show&&tick.showLabel&&(!tick.isMinorTick||this.showMinorTicks)&&this._elem.append(tick.draw(ctx,plot));tick=null,t=null}return this._elem},
// called with scope of an axis
$.jqplot.LinearAxisRenderer.prototype.reset=function(){this.min=this._options.min,this.max=this._options.max,this.tickInterval=this._options.tickInterval,this.numberTicks=this._options.numberTicks,this._autoFormatString="",this._overrideFormatString&&this.tickOptions&&this.tickOptions.formatString&&(this.tickOptions.formatString="")},
// called with scope of axis
$.jqplot.LinearAxisRenderer.prototype.set=function(){var temp,dim=0,w=0,h=0,lshow=null==this._label?!1:this._label.show;if(this.show){for(var tick,t=this._ticks,i=0;i<t.length;i++)tick=t[i],tick._breakTick||!tick.show||!tick.showLabel||tick.isMinorTick&&!this.showMinorTicks||(temp="xaxis"==this.name||"x2axis"==this.name?tick._elem.outerHeight(!0):tick._elem.outerWidth(!0),temp>dim&&(dim=temp));tick=null,t=null,lshow&&(w=this._label._elem.outerWidth(!0),h=this._label._elem.outerHeight(!0)),"xaxis"==this.name?(dim+=h,this._elem.css({height:dim+"px",left:"0px",bottom:"0px"})):"x2axis"==this.name?(dim+=h,this._elem.css({height:dim+"px",left:"0px",top:"0px"})):"yaxis"==this.name?(dim+=w,this._elem.css({width:dim+"px",left:"0px",top:"0px"}),lshow&&this._label.constructor==$.jqplot.AxisLabelRenderer&&this._label._elem.css("width",w+"px")):(dim+=w,this._elem.css({width:dim+"px",right:"0px",top:"0px"}),lshow&&this._label.constructor==$.jqplot.AxisLabelRenderer&&this._label._elem.css("width",w+"px"))}},
// called with scope of axis
$.jqplot.LinearAxisRenderer.prototype.createTicks=function(plot){
// we're are operating on an axis here
var min,max,tt,i,ticks=this._ticks,userTicks=this.ticks,name=this.name,db=this._dataBounds,dim="x"===this.name.charAt(0)?this._plotDimensions.width:this._plotDimensions.height,userMin=this.min,userMax=this.max,userNT=this.numberTicks,userTI=this.tickInterval,threshold=30;
// if we already have ticks, use them.
// ticks must be in order of increasing value.
if(this._scalefact=(Math.max(dim,threshold+1)-threshold)/300,userTicks.length){
// ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
for(i=0;i<userTicks.length;i++){var ut=userTicks[i],t=new this.tickRenderer(this.tickOptions);$.isArray(ut)?(t.value=ut[0],this.breakPoints?ut[0]==this.breakPoints[0]?(t.label=this.breakTickLabel,t._breakTick=!0,t.showGridline=!1,t.showMark=!1):ut[0]>this.breakPoints[0]&&ut[0]<=this.breakPoints[1]?(t.show=!1,t.showGridline=!1,t.label=ut[1]):t.label=ut[1]:t.label=ut[1],t.setTick(ut[0],this.name),this._ticks.push(t)):$.isPlainObject(ut)?($.extend(!0,t,ut),t.axis=this.name,this._ticks.push(t)):(t.value=ut,this.breakPoints&&(ut==this.breakPoints[0]?(t.label=this.breakTickLabel,t._breakTick=!0,t.showGridline=!1,t.showMark=!1):ut>this.breakPoints[0]&&ut<=this.breakPoints[1]&&(t.show=!1,t.showGridline=!1)),t.setTick(ut,this.name),this._ticks.push(t))}this.numberTicks=userTicks.length,this.min=this._ticks[0].value,this.max=this._ticks[this.numberTicks-1].value,this.tickInterval=(this.max-this.min)/(this.numberTicks-1)}else{dim="xaxis"==name||"x2axis"==name?this._plotDimensions.width:this._plotDimensions.height;var _numberTicks=this.numberTicks;
// if aligning this axis, use number of ticks from previous axis.
// Do I need to reset somehow if alignTicks is changed and then graph is replotted??
this.alignTicks&&("x2axis"===this.name&&plot.axes.xaxis.show?_numberTicks=plot.axes.xaxis.numberTicks:"y"===this.name.charAt(0)&&"yaxis"!==this.name&&"yMidAxis"!==this.name&&plot.axes.yaxis.show&&(_numberTicks=plot.axes.yaxis.numberTicks)),min=null!=this.min?this.min:db.min,max=null!=this.max?this.max:db.max;var rmin,rmax,temp,range=max-min;
// Doing complete autoscaling
if(null!=this.tickOptions&&this.tickOptions.formatString||(this._overrideFormatString=!0),null==this.min||null==this.max&&null==this.tickInterval&&!this.autoscale){
// Check if user must have tick at 0 or 100 and ensure they are in range.
// The autoscaling algorithm will always place ticks at 0 and 100 if they are in range.
this.forceTickAt0&&(min>0&&(min=0),0>max&&(max=0)),this.forceTickAt100&&(min>100&&(min=100),100>max&&(max=100));var keepMin=!1,keepMax=!1;null!=this.min?keepMin=!0:null!=this.max&&(keepMax=!0);
// var threshold = 30;
// var tdim = Math.max(dim, threshold+1);
// this._scalefact =  (tdim-threshold)/300.0;
var ret=$.jqplot.LinearTickGenerator(min,max,this._scalefact,_numberTicks,keepMin,keepMax),tumin=null!=this.min?min:min+range*(this.padMin-1),tumax=null!=this.max?max:max-range*(this.padMax-1);
// if they're equal, we shouldn't have to do anything, right?
// if (min <=tumin || max >= tumax) {
(tumin>min||max>tumax)&&(tumin=null!=this.min?min:min-range*(this.padMin-1),tumax=null!=this.max?max:max+range*(this.padMax-1),ret=$.jqplot.LinearTickGenerator(tumin,tumax,this._scalefact,_numberTicks,keepMin,keepMax)),this.min=ret[0],this.max=ret[1],
// if numberTicks specified, it should return the same.
this.numberTicks=ret[2],this._autoFormatString=ret[3],this.tickInterval=ret[4]}else{
// if min and max are same, space them out a bit
if(min==max){var adj=.05;min>0&&(adj=Math.max(Math.log(min)/Math.LN10,.05)),min-=adj,max+=adj}
// autoscale.  Can't autoscale if min or max is supplied.
// Will use numberTicks and tickInterval if supplied.  Ticks
// across multiple axes may not line up depending on how
// bars are to be plotted.
if(this.autoscale&&null==this.min&&null==this.max){
// if any series are bars, or if any are fill to zero, and if this
// is the axis to fill toward, check to see if we can start axis at zero.
for(var rrange,ti,margin,forceMinZero=!1,forceZeroLine=!1,i=0;i<this._series.length;i++){var s=this._series[i],faname="x"==s.fillAxis?s._xaxis.name:s._yaxis.name;
// check to see if this is the fill axis
if(this.name==faname){for(var vals=s._plotValues[s.fillAxis],vmin=vals[0],vmax=vals[0],j=1;j<vals.length;j++)vals[j]<vmin?vmin=vals[j]:vals[j]>vmax&&(vmax=vals[j]);var dp=(vmax-vmin)/vmax;
// is this sries a bar?
s.renderer.constructor==$.jqplot.BarRenderer?
// if no negative values and could also check range.
vmin>=0&&(s.fillToZero||dp>.1)?forceMinZero=!0:(forceMinZero=!1,forceZeroLine=s.fill&&s.fillToZero&&0>vmin&&vmax>0?!0:!1):s.fill?vmin>=0&&(s.fillToZero||dp>.1)?forceMinZero=!0:0>vmin&&vmax>0&&s.fillToZero?(forceMinZero=!1,forceZeroLine=!0):(forceMinZero=!1,forceZeroLine=!1):0>vmin&&(forceMinZero=!1)}}
// check if we need make axis min at 0.
if(forceMinZero)
// compute number of ticks
this.numberTicks=2+Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing),this.min=0,userMin=0,ti=max/(this.numberTicks-1),temp=Math.pow(10,Math.abs(Math.floor(Math.log(ti)/Math.LN10))),ti/temp==parseInt(ti/temp,10)&&(ti+=temp),this.tickInterval=Math.ceil(ti/temp)*temp,this.max=this.tickInterval*(this.numberTicks-1);else if(forceZeroLine){
// compute number of ticks
this.numberTicks=2+Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);var ntmin=Math.ceil(Math.abs(min)/range*(this.numberTicks-1)),ntmax=this.numberTicks-1-ntmin;ti=Math.max(Math.abs(min/ntmin),Math.abs(max/ntmax)),temp=Math.pow(10,Math.abs(Math.floor(Math.log(ti)/Math.LN10))),this.tickInterval=Math.ceil(ti/temp)*temp,this.max=this.tickInterval*ntmax,this.min=-this.tickInterval*ntmin}else null==this.numberTicks&&(this.tickInterval?this.numberTicks=3+Math.ceil(range/this.tickInterval):this.numberTicks=2+Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing)),null==this.tickInterval?(ti=range/(this.numberTicks-1),temp=1>ti?Math.pow(10,Math.abs(Math.floor(Math.log(ti)/Math.LN10))):1,this.tickInterval=Math.ceil(ti*temp*this.pad)/temp):temp=1/this.tickInterval,rrange=this.tickInterval*(this.numberTicks-1),margin=(rrange-range)/2,null==this.min&&(this.min=Math.floor(temp*(min-margin))/temp),null==this.max&&(this.max=this.min+rrange);
// Compute a somewhat decent format string if it is needed.
// get precision of interval and determine a format string.
var fstr,sf=$.jqplot.getSignificantFigures(this.tickInterval);
// if we have only a whole number, use integer formatting
if(sf.digitsLeft>=sf.significantDigits)fstr="%d";else{var temp=Math.max(0,5-sf.digitsLeft);temp=Math.min(temp,sf.digitsRight),fstr="%."+temp+"f"}this._autoFormatString=fstr}else{rmin=null!=this.min?this.min:min-range*(this.padMin-1),rmax=null!=this.max?this.max:max+range*(this.padMax-1),range=rmax-rmin,null==this.numberTicks&&(
// if tickInterval is specified by user, we will ignore computed maximum.
// max will be equal or greater to fit even # of ticks.
null!=this.tickInterval?this.numberTicks=Math.ceil((rmax-rmin)/this.tickInterval)+1:dim>100?this.numberTicks=parseInt(3+(dim-100)/75,10):this.numberTicks=2),null==this.tickInterval&&(this.tickInterval=range/(this.numberTicks-1)),null==this.max&&(rmax=rmin+this.tickInterval*(this.numberTicks-1)),null==this.min&&(rmin=rmax-this.tickInterval*(this.numberTicks-1));
// get precision of interval and determine a format string.
var fstr,sf=$.jqplot.getSignificantFigures(this.tickInterval);
// if we have only a whole number, use integer formatting
if(sf.digitsLeft>=sf.significantDigits)fstr="%d";else{var temp=Math.max(0,5-sf.digitsLeft);temp=Math.min(temp,sf.digitsRight),fstr="%."+temp+"f"}this._autoFormatString=fstr,this.min=rmin,this.max=rmax}if(this.renderer.constructor==$.jqplot.LinearAxisRenderer&&""==this._autoFormatString){
// fix for misleading tick display with small range and low precision.
range=this.max-this.min;
// figure out precision
var temptick=new this.tickRenderer(this.tickOptions),fs=temptick.formatString||$.jqplot.config.defaultTickFormatString,fs=fs.match($.jqplot.sprintf.regex)[0],precision=0;if(fs){if(fs.search(/[fFeEgGpP]/)>-1){var m=fs.match(/\%\.(\d{0,})?[eEfFgGpP]/);precision=m?parseInt(m[1],10):6}else fs.search(/[di]/)>-1&&(precision=0);
// fact will be <= 1;
var fact=Math.pow(10,-precision);if(this.tickInterval<fact&&null==userNT&&null==userTI)if(this.tickInterval=fact,null==userMax&&null==userMin){
// this.min = Math.floor((this._dataBounds.min - this.tickInterval)/fact) * fact;
this.min=Math.floor(this._dataBounds.min/fact)*fact,this.min==this._dataBounds.min&&(this.min=this._dataBounds.min-this.tickInterval),
// this.max = Math.ceil((this._dataBounds.max + this.tickInterval)/fact) * fact;
this.max=Math.ceil(this._dataBounds.max/fact)*fact,this.max==this._dataBounds.max&&(this.max=this._dataBounds.max+this.tickInterval);var n=(this.max-this.min)/this.tickInterval;n=n.toFixed(11),n=Math.ceil(n),this.numberTicks=n+1}else if(null==userMax){
// add one tick for top of range.
var n=(this._dataBounds.max-this.min)/this.tickInterval;n=n.toFixed(11),this.numberTicks=Math.ceil(n)+2,this.max=this.min+this.tickInterval*(this.numberTicks-1)}else if(null==userMin){
// add one tick for bottom of range.
var n=(this.max-this._dataBounds.min)/this.tickInterval;n=n.toFixed(11),this.numberTicks=Math.ceil(n)+2,this.min=this.max-this.tickInterval*(this.numberTicks-1)}else
// calculate a number of ticks so max is within axis scale
this.numberTicks=Math.ceil((userMax-userMin)/this.tickInterval)+1,
// if user's min and max don't fit evenly in ticks, adjust.
// This takes care of cases such as user min set to 0, max set to 3.5 but tick
// format string set to %d (integer ticks)
this.min=Math.floor(userMin*Math.pow(10,precision))/Math.pow(10,precision),this.max=Math.ceil(userMax*Math.pow(10,precision))/Math.pow(10,precision),
// this.max = this.min + this.tickInterval*(this.numberTicks-1);
this.numberTicks=Math.ceil((this.max-this.min)/this.tickInterval)+1}}}this._overrideFormatString&&""!=this._autoFormatString&&(this.tickOptions=this.tickOptions||{},this.tickOptions.formatString=this._autoFormatString);for(var t,to,i=0;i<this.numberTicks;i++){if(tt=this.min+i*this.tickInterval,t=new this.tickRenderer(this.tickOptions),t.setTick(tt,this.name),this._ticks.push(t),i<this.numberTicks-1)for(var j=0;j<this.minorTicks;j++)tt+=this.tickInterval/(this.minorTicks+1),to=$.extend(!0,{},this.tickOptions,{name:this.name,value:tt,label:"",isMinorTick:!0}),t=new this.tickRenderer(to),this._ticks.push(t);t=null}}this.tickInset&&(this.min=this.min-this.tickInset*this.tickInterval,this.max=this.max+this.tickInset*this.tickInterval),ticks=null},
// Used to reset just the values of the ticks and then repack, which will
// recalculate the positioning functions.  It is assuemd that the 
// number of ticks is the same and the values of the new array are at the
// proper interval.
// This method needs to be called with the scope of an axis object, like:
//
// > plot.axes.yaxis.renderer.resetTickValues.call(plot.axes.yaxis, yarr);
//
$.jqplot.LinearAxisRenderer.prototype.resetTickValues=function(opts){if($.isArray(opts)&&opts.length==this._ticks.length){for(var t,i=0;i<opts.length;i++)t=this._ticks[i],t.value=opts[i],t.label=t.formatter(t.formatString,opts[i]),t.label=t.prefix+t.label,t._elem.html(t.label);t=null,this.min=$.jqplot.arrayMin(opts),this.max=$.jqplot.arrayMax(opts),this.pack()}},
// called with scope of axis
$.jqplot.LinearAxisRenderer.prototype.pack=function(pos,offsets){pos=pos||{},offsets=offsets||this._offsets;var ticks=this._ticks,max=this.max,min=this.min,offmax=offsets.max,offmin=offsets.min,lshow=null==this._label?!1:this._label.show;for(var p in pos)this._elem.css(p,pos[p]);this._offsets=offsets;
// pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
var pixellength=offmax-offmin,unitlength=max-min;if(
// point to unit and unit to point conversions references to Plot DOM element top left corner.
this.breakPoints?(unitlength=unitlength-this.breakPoints[1]+this.breakPoints[0],this.p2u=function(p){return(p-offmin)*unitlength/pixellength+min},this.u2p=function(u){return u>this.breakPoints[0]&&u<this.breakPoints[1]&&(u=this.breakPoints[0]),u<=this.breakPoints[0]?(u-min)*pixellength/unitlength+offmin:(u-this.breakPoints[1]+this.breakPoints[0]-min)*pixellength/unitlength+offmin},"x"==this.name.charAt(0)?(this.series_u2p=function(u){return u>this.breakPoints[0]&&u<this.breakPoints[1]&&(u=this.breakPoints[0]),u<=this.breakPoints[0]?(u-min)*pixellength/unitlength:(u-this.breakPoints[1]+this.breakPoints[0]-min)*pixellength/unitlength},this.series_p2u=function(p){return p*unitlength/pixellength+min}):(this.series_u2p=function(u){return u>this.breakPoints[0]&&u<this.breakPoints[1]&&(u=this.breakPoints[0]),u>=this.breakPoints[1]?(u-max)*pixellength/unitlength:(u+this.breakPoints[1]-this.breakPoints[0]-max)*pixellength/unitlength},this.series_p2u=function(p){return p*unitlength/pixellength+max})):(this.p2u=function(p){return(p-offmin)*unitlength/pixellength+min},this.u2p=function(u){return(u-min)*pixellength/unitlength+offmin},"xaxis"==this.name||"x2axis"==this.name?(this.series_u2p=function(u){return(u-min)*pixellength/unitlength},this.series_p2u=function(p){return p*unitlength/pixellength+min}):(this.series_u2p=function(u){return(u-max)*pixellength/unitlength},this.series_p2u=function(p){return p*unitlength/pixellength+max})),this.show)if("xaxis"==this.name||"x2axis"==this.name){for(var i=0;i<ticks.length;i++){var t=ticks[i];if(t.show&&t.showLabel){var shim;if(t.constructor==$.jqplot.CanvasAxisTickRenderer&&t.angle){
// will need to adjust auto positioning based on which axis this is.
var temp="xaxis"==this.name?1:-1;switch(t.labelPosition){case"auto":
// position at end
shim=temp*t.angle<0?-t.getWidth()+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2:-t._textRenderer.height*Math.sin(t._textRenderer.angle)/2;break;case"end":shim=-t.getWidth()+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;case"start":shim=-t._textRenderer.height*Math.sin(t._textRenderer.angle)/2;break;case"middle":shim=-t.getWidth()/2+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;default:shim=-t.getWidth()/2+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2}}else shim=-t.getWidth()/2;var val=this.u2p(t.value)+shim+"px";t._elem.css("left",val),t.pack()}}if(lshow){var w=this._label._elem.outerWidth(!0);this._label._elem.css("left",offmin+pixellength/2-w/2+"px"),"xaxis"==this.name?this._label._elem.css("bottom","0px"):this._label._elem.css("top","0px"),this._label.pack()}}else{for(var i=0;i<ticks.length;i++){var t=ticks[i];if(t.show&&t.showLabel){var shim;if(t.constructor==$.jqplot.CanvasAxisTickRenderer&&t.angle){
// will need to adjust auto positioning based on which axis this is.
var temp="yaxis"==this.name?1:-1;switch(t.labelPosition){case"auto":
// position at end
case"end":shim=temp*t.angle<0?-t._textRenderer.height*Math.cos(-t._textRenderer.angle)/2:-t.getHeight()+t._textRenderer.height*Math.cos(t._textRenderer.angle)/2;break;case"start":shim=t.angle>0?-t._textRenderer.height*Math.cos(-t._textRenderer.angle)/2:-t.getHeight()+t._textRenderer.height*Math.cos(t._textRenderer.angle)/2;break;case"middle":
// if (t.angle > 0) {
//     shim = -t.getHeight()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
// }
// else {
//     shim = -t.getHeight()/2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
// }
shim=-t.getHeight()/2;break;default:shim=-t.getHeight()/2}}else shim=-t.getHeight()/2;var val=this.u2p(t.value)+shim+"px";t._elem.css("top",val),t.pack()}}if(lshow){var h=this._label._elem.outerHeight(!0);this._label._elem.css("top",offmax-pixellength/2-h/2+"px"),"yaxis"==this.name?this._label._elem.css("left","0px"):this._label._elem.css("right","0px"),this._label.pack()}}ticks=null};
// Given the min and max for a dataset, return suitable endpoints
// for the graphing, a good number for the number of ticks, and a
// format string so that extraneous digits are not displayed.
// returned is an array containing [min, max, nTicks, format]
$.jqplot.LinearTickGenerator=function(axis_min,axis_max,scalefact,numberTicks,keepMin,keepMax){
// make sure range is positive
if(keepMin=null===keepMin?!1:keepMin,keepMax=null===keepMax||keepMin?!1:keepMax,axis_min===axis_max&&(axis_max=axis_max?0:1),scalefact=scalefact||1,axis_min>axis_max){var a=axis_max;axis_max=axis_min,axis_min=a}var r=[],ss=bestLinearInterval(axis_max-axis_min,scalefact),gsf=$.jqplot.getSignificantFigures;if(null==numberTicks)
// Figure out the axis min, max and number of ticks
// the min and max will be some multiple of the tick interval,
// 1*10^n, 2*10^n or 5*10^n.  This gaurantees that, if the
// axis min is negative, 0 will be a tick.
if(keepMin||keepMax){if(keepMin){r[0]=axis_min,// min
r[2]=Math.ceil((axis_max-axis_min)/ss+1),// number of ticks
r[1]=axis_min+(r[2]-1)*ss;// max
var digitsMin=gsf(axis_min).digitsRight,digitsSS=gsf(ss).digitsRight;digitsSS>digitsMin?r[3]=bestFormatString(ss):r[3]="%."+digitsMin+"f",r[4]=ss}else if(keepMax){r[1]=axis_max,// max
r[2]=Math.ceil((axis_max-axis_min)/ss+1),// number of ticks
r[0]=axis_max-(r[2]-1)*ss;// min
var digitsMax=gsf(axis_max).digitsRight,digitsSS=gsf(ss).digitsRight;digitsSS>digitsMax?r[3]=bestFormatString(ss):r[3]="%."+digitsMax+"f",r[4]=ss}}else r[0]=Math.floor(axis_min/ss)*ss,// min
r[1]=Math.ceil(axis_max/ss)*ss,// max
r[2]=Math.round((r[1]-r[0])/ss+1),// number of ticks
r[3]=bestFormatString(ss),// format string
r[4]=ss;else{var tempr=[];// tick Interval
// first, see if we happen to get the right number of ticks
if(
// Figure out the axis min, max and number of ticks
// the min and max will be some multiple of the tick interval,
// 1*10^n, 2*10^n or 5*10^n.  This gaurantees that, if the
// axis min is negative, 0 will be a tick.
tempr[0]=Math.floor(axis_min/ss)*ss,// min
tempr[1]=Math.ceil(axis_max/ss)*ss,// max
tempr[2]=Math.round((tempr[1]-tempr[0])/ss+1),// number of ticks
tempr[3]=bestFormatString(ss),// format string
tempr[4]=ss,tempr[2]===numberTicks)r=tempr;else{var newti=bestInterval(tempr[1]-tempr[0],numberTicks);r[0]=tempr[0],// min
r[2]=numberTicks,// number of ticks
r[4]=newti,// tick interval
r[3]=bestFormatString(newti),// format string
r[1]=r[0]+(r[2]-1)*r[4]}}return r},$.jqplot.LinearTickGenerator.bestLinearInterval=bestLinearInterval,$.jqplot.LinearTickGenerator.bestInterval=bestInterval,$.jqplot.LinearTickGenerator.bestLinearComponents=bestLinearComponents,$.jqplot.LinearTickGenerator.bestConstrainedInterval=bestConstrainedInterval,
// class: $.jqplot.MarkerRenderer
// The default jqPlot marker renderer, rendering the points on the line.
$.jqplot.MarkerRenderer=function(options){
// Group: Properties
// prop: show
// whether or not to show the marker.
this.show=!0,
// prop: style
// One of diamond, circle, square, x, plus, dash, filledDiamond, filledCircle, filledSquare
this.style="filledCircle",
// prop: lineWidth
// size of the line for non-filled markers.
this.lineWidth=2,
// prop: size
// Size of the marker (diameter or circle, length of edge of square, etc.)
this.size=9,
// prop: color
// color of marker.  Will be set to color of series by default on init.
this.color="#666666",
// prop: shadow
// whether or not to draw a shadow on the line
this.shadow=!0,
// prop: shadowAngle
// Shadow angle in degrees
this.shadowAngle=45,
// prop: shadowOffset
// Shadow offset from line in pixels
this.shadowOffset=1,
// prop: shadowDepth
// Number of times shadow is stroked, each stroke offset shadowOffset from the last.
this.shadowDepth=3,
// prop: shadowAlpha
// Alpha channel transparency of shadow.  0 = transparent.
this.shadowAlpha="0.07",
// prop: shadowRenderer
// Renderer that will draws the shadows on the marker.
this.shadowRenderer=new $.jqplot.ShadowRenderer,
// prop: shapeRenderer
// Renderer that will draw the marker.
this.shapeRenderer=new $.jqplot.ShapeRenderer,$.extend(!0,this,options)},$.jqplot.MarkerRenderer.prototype.init=function(options){$.extend(!0,this,options);var sdopt={angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,lineWidth:this.lineWidth,depth:this.shadowDepth,closePath:!0};-1!=this.style.indexOf("filled")&&(sdopt.fill=!0),-1!=this.style.indexOf("ircle")&&(sdopt.isarc=!0,sdopt.closePath=!1),this.shadowRenderer.init(sdopt);var shopt={fill:!1,isarc:!1,strokeStyle:this.color,fillStyle:this.color,lineWidth:this.lineWidth,closePath:!0};-1!=this.style.indexOf("filled")&&(shopt.fill=!0),-1!=this.style.indexOf("ircle")&&(shopt.isarc=!0,shopt.closePath=!1),this.shapeRenderer.init(shopt)},$.jqplot.MarkerRenderer.prototype.drawDiamond=function(x,y,ctx,fill,options){var stretch=1.2,dx=this.size/2/stretch,dy=this.size/2*stretch,points=[[x-dx,y],[x,y+dy],[x+dx,y],[x,y-dy]];this.shadow&&this.shadowRenderer.draw(ctx,points),this.shapeRenderer.draw(ctx,points,options)},$.jqplot.MarkerRenderer.prototype.drawPlus=function(x,y,ctx,fill,options){var stretch=1,dx=this.size/2*stretch,dy=this.size/2*stretch,points1=[[x,y-dy],[x,y+dy]],points2=[[x+dx,y],[x-dx,y]],opts=$.extend(!0,{},this.options,{closePath:!1});this.shadow&&(this.shadowRenderer.draw(ctx,points1,{closePath:!1}),this.shadowRenderer.draw(ctx,points2,{closePath:!1})),this.shapeRenderer.draw(ctx,points1,opts),this.shapeRenderer.draw(ctx,points2,opts)},$.jqplot.MarkerRenderer.prototype.drawX=function(x,y,ctx,fill,options){var stretch=1,dx=this.size/2*stretch,dy=this.size/2*stretch,opts=$.extend(!0,{},this.options,{closePath:!1}),points1=[[x-dx,y-dy],[x+dx,y+dy]],points2=[[x-dx,y+dy],[x+dx,y-dy]];this.shadow&&(this.shadowRenderer.draw(ctx,points1,{closePath:!1}),this.shadowRenderer.draw(ctx,points2,{closePath:!1})),this.shapeRenderer.draw(ctx,points1,opts),this.shapeRenderer.draw(ctx,points2,opts)},$.jqplot.MarkerRenderer.prototype.drawDash=function(x,y,ctx,fill,options){var stretch=1,dx=this.size/2*stretch,points=(this.size/2*stretch,[[x-dx,y],[x+dx,y]]);this.shadow&&this.shadowRenderer.draw(ctx,points),this.shapeRenderer.draw(ctx,points,options)},$.jqplot.MarkerRenderer.prototype.drawLine=function(p1,p2,ctx,fill,options){var points=[p1,p2];this.shadow&&this.shadowRenderer.draw(ctx,points),this.shapeRenderer.draw(ctx,points,options)},$.jqplot.MarkerRenderer.prototype.drawSquare=function(x,y,ctx,fill,options){var stretch=1,dx=this.size/2/stretch,dy=this.size/2*stretch,points=[[x-dx,y-dy],[x-dx,y+dy],[x+dx,y+dy],[x+dx,y-dy]];this.shadow&&this.shadowRenderer.draw(ctx,points),this.shapeRenderer.draw(ctx,points,options)},$.jqplot.MarkerRenderer.prototype.drawCircle=function(x,y,ctx,fill,options){var radius=this.size/2,end=2*Math.PI,points=[x,y,radius,0,end,!0];this.shadow&&this.shadowRenderer.draw(ctx,points),this.shapeRenderer.draw(ctx,points,options)},$.jqplot.MarkerRenderer.prototype.draw=function(x,y,ctx,options){
// hack here b/c shape renderer uses canvas based color style options
// and marker uses css style names.
if(options=options||{},null==options.show||0!=options.show)switch(options.color&&!options.fillStyle&&(options.fillStyle=options.color),options.color&&!options.strokeStyle&&(options.strokeStyle=options.color),this.style){case"diamond":this.drawDiamond(x,y,ctx,!1,options);break;case"filledDiamond":this.drawDiamond(x,y,ctx,!0,options);break;case"circle":this.drawCircle(x,y,ctx,!1,options);break;case"filledCircle":this.drawCircle(x,y,ctx,!0,options);break;case"square":this.drawSquare(x,y,ctx,!1,options);break;case"filledSquare":this.drawSquare(x,y,ctx,!0,options);break;case"x":this.drawX(x,y,ctx,!0,options);break;case"plus":this.drawPlus(x,y,ctx,!0,options);break;case"dash":this.drawDash(x,y,ctx,!0,options);break;case"line":this.drawLine(x,y,ctx,!1,options);break;default:this.drawDiamond(x,y,ctx,!1,options)}},
// class: $.jqplot.shadowRenderer
// The default jqPlot shadow renderer, rendering shadows behind shapes.
$.jqplot.ShadowRenderer=function(options){
// Group: Properties
// prop: angle
// Angle of the shadow in degrees.  Measured counter-clockwise from the x axis.
this.angle=45,
// prop: offset
// Pixel offset at the given shadow angle of each shadow stroke from the last stroke.
this.offset=1,
// prop: alpha
// alpha transparency of shadow stroke.
this.alpha=.07,
// prop: lineWidth
// width of the shadow line stroke.
this.lineWidth=1.5,
// prop: lineJoin
// How line segments of the shadow are joined.
this.lineJoin="miter",
// prop: lineCap
// how ends of the shadow line are rendered.
this.lineCap="round",
// prop; closePath
// whether line path segment is closed upon itself.
this.closePath=!1,
// prop: fill
// whether to fill the shape.
this.fill=!1,
// prop: depth
// how many times the shadow is stroked.  Each stroke will be offset by offset at angle degrees.
this.depth=3,this.strokeStyle="rgba(0,0,0,0.1)",
// prop: isarc
// whether the shadow is an arc or not.
this.isarc=!1,$.extend(!0,this,options)},$.jqplot.ShadowRenderer.prototype.init=function(options){$.extend(!0,this,options)},
// function: draw
// draws an transparent black (i.e. gray) shadow.
//
// ctx - canvas drawing context
// points - array of points or [x, y, radius, start angle (rad), end angle (rad)]
$.jqplot.ShadowRenderer.prototype.draw=function(ctx,points,options){ctx.save();var opts=null!=options?options:{},fill=null!=opts.fill?opts.fill:this.fill,fillRect=null!=opts.fillRect?opts.fillRect:this.fillRect,closePath=null!=opts.closePath?opts.closePath:this.closePath,offset=null!=opts.offset?opts.offset:this.offset,alpha=null!=opts.alpha?opts.alpha:this.alpha,depth=null!=opts.depth?opts.depth:this.depth,isarc=null!=opts.isarc?opts.isarc:this.isarc,linePattern=null!=opts.linePattern?opts.linePattern:this.linePattern;ctx.lineWidth=null!=opts.lineWidth?opts.lineWidth:this.lineWidth,ctx.lineJoin=null!=opts.lineJoin?opts.lineJoin:this.lineJoin,ctx.lineCap=null!=opts.lineCap?opts.lineCap:this.lineCap,ctx.strokeStyle=opts.strokeStyle||this.strokeStyle||"rgba(0,0,0,"+alpha+")",ctx.fillStyle=opts.fillStyle||this.fillStyle||"rgba(0,0,0,"+alpha+")";for(var j=0;depth>j;j++){var ctxPattern=$.jqplot.LinePattern(ctx,linePattern);if(ctx.translate(Math.cos(this.angle*Math.PI/180)*offset,Math.sin(this.angle*Math.PI/180)*offset),ctxPattern.beginPath(),isarc)ctx.arc(points[0],points[1],points[2],points[3],points[4],!0);else if(fillRect)fillRect&&ctx.fillRect(points[0],points[1],points[2],points[3]);else if(points&&points.length)for(var move=!0,i=0;i<points.length;i++)
// skip to the first non-null point and move to it.
null!=points[i][0]&&null!=points[i][1]?move?(ctxPattern.moveTo(points[i][0],points[i][1]),move=!1):ctxPattern.lineTo(points[i][0],points[i][1]):move=!0;closePath&&ctxPattern.closePath(),fill?ctx.fill():ctx.stroke()}ctx.restore()},
// class: $.jqplot.shapeRenderer
// The default jqPlot shape renderer.  Given a set of points will
// plot them and either stroke a line (fill = false) or fill them (fill = true).
// If a filled shape is desired, closePath = true must also be set to close
// the shape.
$.jqplot.ShapeRenderer=function(options){this.lineWidth=1.5,
// prop: linePattern
// line pattern 'dashed', 'dotted', 'solid', some combination
// of '-' and '.' characters such as '.-.' or a numerical array like 
// [draw, skip, draw, skip, ...] such as [1, 10] to draw a dotted line, 
// [1, 10, 20, 10] to draw a dot-dash line, and so on.
this.linePattern="solid",
// prop: lineJoin
// How line segments of the shadow are joined.
this.lineJoin="miter",
// prop: lineCap
// how ends of the shadow line are rendered.
this.lineCap="round",
// prop; closePath
// whether line path segment is closed upon itself.
this.closePath=!1,
// prop: fill
// whether to fill the shape.
this.fill=!1,
// prop: isarc
// whether the shadow is an arc or not.
this.isarc=!1,
// prop: fillRect
// true to draw shape as a filled rectangle.
this.fillRect=!1,
// prop: strokeRect
// true to draw shape as a stroked rectangle.
this.strokeRect=!1,
// prop: clearRect
// true to cear a rectangle.
this.clearRect=!1,
// prop: strokeStyle
// css color spec for the stoke style
this.strokeStyle="#999999",
// prop: fillStyle
// css color spec for the fill style.
this.fillStyle="#999999",$.extend(!0,this,options)},$.jqplot.ShapeRenderer.prototype.init=function(options){$.extend(!0,this,options)},
// function: draw
// draws the shape.
//
// ctx - canvas drawing context
// points - array of points for shapes or 
// [x, y, width, height] for rectangles or
// [x, y, radius, start angle (rad), end angle (rad)] for circles and arcs.
$.jqplot.ShapeRenderer.prototype.draw=function(ctx,points,options){ctx.save();var opts=null!=options?options:{},fill=null!=opts.fill?opts.fill:this.fill,closePath=null!=opts.closePath?opts.closePath:this.closePath,fillRect=null!=opts.fillRect?opts.fillRect:this.fillRect,strokeRect=null!=opts.strokeRect?opts.strokeRect:this.strokeRect,clearRect=null!=opts.clearRect?opts.clearRect:this.clearRect,isarc=null!=opts.isarc?opts.isarc:this.isarc,linePattern=null!=opts.linePattern?opts.linePattern:this.linePattern,ctxPattern=$.jqplot.LinePattern(ctx,linePattern);if(ctx.lineWidth=opts.lineWidth||this.lineWidth,ctx.lineJoin=opts.lineJoin||this.lineJoin,ctx.lineCap=opts.lineCap||this.lineCap,ctx.strokeStyle=opts.strokeStyle||opts.color||this.strokeStyle,ctx.fillStyle=opts.fillStyle||this.fillStyle,ctx.beginPath(),isarc)return ctx.arc(points[0],points[1],points[2],points[3],points[4],!0),closePath&&ctx.closePath(),fill?ctx.fill():ctx.stroke(),void ctx.restore();if(clearRect)return ctx.clearRect(points[0],points[1],points[2],points[3]),void ctx.restore();if(fillRect||strokeRect){if(fillRect&&ctx.fillRect(points[0],points[1],points[2],points[3]),strokeRect)return ctx.strokeRect(points[0],points[1],points[2],points[3]),void ctx.restore()}else if(points&&points.length){for(var move=!0,i=0;i<points.length;i++)
// skip to the first non-null point and move to it.
null!=points[i][0]&&null!=points[i][1]?move?(ctxPattern.moveTo(points[i][0],points[i][1]),move=!1):ctxPattern.lineTo(points[i][0],points[i][1]):move=!0;closePath&&ctxPattern.closePath(),fill?ctx.fill():ctx.stroke()}ctx.restore()},
// class $.jqplot.TableLegendRenderer
// The default legend renderer for jqPlot.
$.jqplot.TableLegendRenderer=function(){},$.jqplot.TableLegendRenderer.prototype.init=function(options){$.extend(!0,this,options)},$.jqplot.TableLegendRenderer.prototype.addrow=function(label,color,pad,reverse){var tr,td,elem,div0,div1,rs=pad?this.rowSpacing+"px":"0px";elem=document.createElement("tr"),tr=$(elem),tr.addClass("jqplot-table-legend"),elem=null,reverse?tr.prependTo(this._elem):tr.appendTo(this._elem),this.showSwatches&&(td=$(document.createElement("td")),td.addClass("jqplot-table-legend jqplot-table-legend-swatch"),td.css({textAlign:"center",paddingTop:rs}),div0=$(document.createElement("div")),div0.addClass("jqplot-table-legend-swatch-outline"),div1=$(document.createElement("div")),div1.addClass("jqplot-table-legend-swatch"),div1.css({backgroundColor:color,borderColor:color}),tr.append(td.append(div0.append(div1)))),this.showLabels&&(td=$(document.createElement("td")),td.addClass("jqplot-table-legend jqplot-table-legend-label"),td.css("paddingTop",rs),tr.append(td),this.escapeHtml?td.text(label):td.html(label)),td=null,div0=null,div1=null,tr=null,elem=null},
// called with scope of legend
$.jqplot.TableLegendRenderer.prototype.draw=function(){if(this._elem&&(this._elem.emptyForce(),this._elem=null),this.show){var series=this._series,elem=document.createElement("table");this._elem=$(elem),this._elem.addClass("jqplot-table-legend");var ss={position:"absolute"};this.background&&(ss.background=this.background),this.border&&(ss.border=this.border),this.fontSize&&(ss.fontSize=this.fontSize),this.fontFamily&&(ss.fontFamily=this.fontFamily),this.textColor&&(ss.textColor=this.textColor),null!=this.marginTop&&(ss.marginTop=this.marginTop),null!=this.marginBottom&&(ss.marginBottom=this.marginBottom),null!=this.marginLeft&&(ss.marginLeft=this.marginLeft),null!=this.marginRight&&(ss.marginRight=this.marginRight);for(var s,pad=!1,reverse=!1,i=0;i<series.length;i++)if(s=series[i],(s._stack||s.renderer.constructor==$.jqplot.BezierCurveRenderer)&&(reverse=!0),s.show&&s.showLabel){var lt=this.labels[i]||s.label.toString();if(lt){var color=s.color;reverse&&i<series.length-1?pad=!0:reverse&&i==series.length-1&&(pad=!1),this.renderer.addrow.call(this,lt,color,pad,reverse),pad=!0}
// let plugins add more rows to legend.  Used by trend line plugin.
for(var j=0;j<$.jqplot.addLegendRowHooks.length;j++){var item=$.jqplot.addLegendRowHooks[j].call(this,s);item&&(this.renderer.addrow.call(this,item.label,item.color,pad),pad=!0)}lt=null}}return this._elem},$.jqplot.TableLegendRenderer.prototype.pack=function(offsets){if(this.show)if("insideGrid"==this.placement)switch(this.location){case"nw":var a=offsets.left,b=offsets.top;this._elem.css("left",a),this._elem.css("top",b);break;case"n":var a=(offsets.left+(this._plotDimensions.width-offsets.right))/2-this.getWidth()/2,b=offsets.top;this._elem.css("left",a),this._elem.css("top",b);break;case"ne":var a=offsets.right,b=offsets.top;this._elem.css({right:a,top:b});break;case"e":var a=offsets.right,b=(offsets.top+(this._plotDimensions.height-offsets.bottom))/2-this.getHeight()/2;this._elem.css({right:a,top:b});break;case"se":var a=offsets.right,b=offsets.bottom;this._elem.css({right:a,bottom:b});break;case"s":var a=(offsets.left+(this._plotDimensions.width-offsets.right))/2-this.getWidth()/2,b=offsets.bottom;this._elem.css({left:a,bottom:b});break;case"sw":var a=offsets.left,b=offsets.bottom;this._elem.css({left:a,bottom:b});break;case"w":var a=offsets.left,b=(offsets.top+(this._plotDimensions.height-offsets.bottom))/2-this.getHeight()/2;this._elem.css({left:a,top:b});break;default:// same as 'se'
var a=offsets.right,b=offsets.bottom;this._elem.css({right:a,bottom:b})}else if("outside"==this.placement)switch(this.location){case"nw":var a=this._plotDimensions.width-offsets.left,b=offsets.top;this._elem.css("right",a),this._elem.css("top",b);break;case"n":var a=(offsets.left+(this._plotDimensions.width-offsets.right))/2-this.getWidth()/2,b=this._plotDimensions.height-offsets.top;this._elem.css("left",a),this._elem.css("bottom",b);break;case"ne":var a=this._plotDimensions.width-offsets.right,b=offsets.top;this._elem.css({left:a,top:b});break;case"e":var a=this._plotDimensions.width-offsets.right,b=(offsets.top+(this._plotDimensions.height-offsets.bottom))/2-this.getHeight()/2;this._elem.css({left:a,top:b});break;case"se":var a=this._plotDimensions.width-offsets.right,b=offsets.bottom;this._elem.css({left:a,bottom:b});break;case"s":var a=(offsets.left+(this._plotDimensions.width-offsets.right))/2-this.getWidth()/2,b=this._plotDimensions.height-offsets.bottom;this._elem.css({left:a,top:b});break;case"sw":var a=this._plotDimensions.width-offsets.left,b=offsets.bottom;this._elem.css({right:a,bottom:b});break;case"w":var a=this._plotDimensions.width-offsets.left,b=(offsets.top+(this._plotDimensions.height-offsets.bottom))/2-this.getHeight()/2;this._elem.css({right:a,top:b});break;default:// same as 'se'
var a=offsets.right,b=offsets.bottom;this._elem.css({right:a,bottom:b})}else switch(this.location){case"nw":this._elem.css({left:0,top:offsets.top});break;case"n":var a=(offsets.left+(this._plotDimensions.width-offsets.right))/2-this.getWidth()/2;this._elem.css({left:a,top:offsets.top});break;case"ne":this._elem.css({right:0,top:offsets.top});break;case"e":var b=(offsets.top+(this._plotDimensions.height-offsets.bottom))/2-this.getHeight()/2;this._elem.css({right:offsets.right,top:b});break;case"se":this._elem.css({right:offsets.right,bottom:offsets.bottom});break;case"s":var a=(offsets.left+(this._plotDimensions.width-offsets.right))/2-this.getWidth()/2;this._elem.css({left:a,bottom:offsets.bottom});break;case"sw":this._elem.css({left:offsets.left,bottom:offsets.bottom});break;case"w":var b=(offsets.top+(this._plotDimensions.height-offsets.bottom))/2-this.getHeight()/2;this._elem.css({left:offsets.left,top:b});break;default:// same as 'se'
this._elem.css({right:offsets.right,bottom:offsets.bottom})}},/**
     * Class: $.jqplot.ThemeEngine
     * Theme Engine provides a programatic way to change some of the  more
     * common jqplot styling options such as fonts, colors and grid options.
     * A theme engine instance is created with each plot.  The theme engine
     * manages a collection of themes which can be modified, added to, or 
     * applied to the plot.
     * 
     * The themeEngine class is not instantiated directly.
     * When a plot is initialized, the current plot options are scanned
     * an a default theme named "Default" is created.  This theme is
     * used as the basis for other themes added to the theme engine and
     * is always available.
     * 
     * A theme is a simple javascript object with styling parameters for
     * various entities of the plot.  A theme has the form:
     * 
     * 
     * > {
     * >     _name:f "Default",
     * >     target: {
     * >         backgroundColor: "transparent"
     * >     },
     * >     legend: {
     * >         textColor: null,
     * >         fontFamily: null,
     * >         fontSize: null,
     * >         border: null,
     * >         background: null
     * >     },
     * >     title: {
     * >         textColor: "rgb(102, 102, 102)",
     * >         fontFamily: "'Trebuchet MS',Arial,Helvetica,sans-serif",
     * >         fontSize: "19.2px",
     * >         textAlign: "center"
     * >     },
     * >     seriesStyles: {},
     * >     series: [{
     * >         color: "#4bb2c5",
     * >         lineWidth: 2.5,
     * >         linePattern: "solid",
     * >         shadow: true,
     * >         fillColor: "#4bb2c5",
     * >         showMarker: true,
     * >         markerOptions: {
     * >             color: "#4bb2c5",
     * >             show: true,
     * >             style: 'filledCircle',
     * >             lineWidth: 1.5,
     * >             size: 4,
     * >             shadow: true
     * >         }
     * >     }],
     * >     grid: {
     * >         drawGridlines: true,
     * >         gridLineColor: "#cccccc",
     * >         gridLineWidth: 1,
     * >         backgroundColor: "#fffdf6",
     * >         borderColor: "#999999",
     * >         borderWidth: 2,
     * >         shadow: true
     * >     },
     * >     axesStyles: {
     * >         label: {},
     * >         ticks: {}
     * >     },
     * >     axes: {
     * >         xaxis: {
     * >             borderColor: "#999999",
     * >             borderWidth: 2,
     * >             ticks: {
     * >                 show: true,
     * >                 showGridline: true,
     * >                 showLabel: true,
     * >                 showMark: true,
     * >                 size: 4,
     * >                 textColor: "",
     * >                 whiteSpace: "nowrap",
     * >                 fontSize: "12px",
     * >                 fontFamily: "'Trebuchet MS',Arial,Helvetica,sans-serif"
     * >             },
     * >             label: {
     * >                 textColor: "rgb(102, 102, 102)",
     * >                 whiteSpace: "normal",
     * >                 fontSize: "14.6667px",
     * >                 fontFamily: "'Trebuchet MS',Arial,Helvetica,sans-serif",
     * >                 fontWeight: "400"
     * >             }
     * >         },
     * >         yaxis: {
     * >             borderColor: "#999999",
     * >             borderWidth: 2,
     * >             ticks: {
     * >                 show: true,
     * >                 showGridline: true,
     * >                 showLabel: true,
     * >                 showMark: true,
     * >                 size: 4,
     * >                 textColor: "",
     * >                 whiteSpace: "nowrap",
     * >                 fontSize: "12px",
     * >                 fontFamily: "'Trebuchet MS',Arial,Helvetica,sans-serif"
     * >             },
     * >             label: {
     * >                 textColor: null,
     * >                 whiteSpace: null,
     * >                 fontSize: null,
     * >                 fontFamily: null,
     * >                 fontWeight: null
     * >             }
     * >         },
     * >         x2axis: {...
     * >         },
     * >         ...
     * >         y9axis: {...
     * >         }
     * >     }
     * > }
     * 
     * "seriesStyles" is a style object that will be applied to all series in the plot.
     * It will forcibly override any styles applied on the individual series.  "axesStyles" is
     * a style object that will be applied to all axes in the plot.  It will also forcibly
     * override any styles on the individual axes.
     * 
     * The example shown above has series options for a line series.  Options for other
     * series types are shown below:
     * 
     * Bar Series:
     * 
     * > {
     * >     color: "#4bb2c5",
     * >     seriesColors: ["#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"],
     * >     lineWidth: 2.5,
     * >     shadow: true,
     * >     barPadding: 2,
     * >     barMargin: 10,
     * >     barWidth: 15.09375,
     * >     highlightColors: ["rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)"]
     * > }
     * 
     * Pie Series:
     * 
     * > {
     * >     seriesColors: ["#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"],
     * >     padding: 20,
     * >     sliceMargin: 0,
     * >     fill: true,
     * >     shadow: true,
     * >     startAngle: 0,
     * >     lineWidth: 2.5,
     * >     highlightColors: ["rgb(129,201,214)", "rgb(240,189,104)", "rgb(214,202,165)", "rgb(137,180,158)", "rgb(168,180,137)", "rgb(180,174,89)", "rgb(180,113,161)", "rgb(129,141,236)", "rgb(227,205,120)", "rgb(255,138,76)", "rgb(76,169,219)", "rgb(215,126,190)", "rgb(220,232,135)", "rgb(200,167,96)", "rgb(103,202,235)", "rgb(208,154,215)"]
     * > }
     * 
     * Funnel Series:
     * 
     * > {
     * >     color: "#4bb2c5",
     * >     lineWidth: 2,
     * >     shadow: true,
     * >     padding: {
     * >         top: 20,
     * >         right: 20,
     * >         bottom: 20,
     * >         left: 20
     * >     },
     * >     sectionMargin: 6,
     * >     seriesColors: ["#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"],
     * >     highlightColors: ["rgb(147,208,220)", "rgb(242,199,126)", "rgb(220,210,178)", "rgb(154,191,172)", "rgb(180,191,154)", "rgb(191,186,112)", "rgb(191,133,174)", "rgb(147,157,238)", "rgb(231,212,139)", "rgb(255,154,102)", "rgb(102,181,224)", "rgb(221,144,199)", "rgb(225,235,152)", "rgb(200,167,96)", "rgb(124,210,238)", "rgb(215,169,221)"]
     * > }
     * 
     */
$.jqplot.ThemeEngine=function(){
// Group: Properties
//
// prop: themes
// hash of themes managed by the theme engine.  
// Indexed by theme name.
this.themes={},
// prop: activeTheme
// Pointer to currently active theme
this.activeTheme=null},
// called with scope of plot
$.jqplot.ThemeEngine.prototype.init=function(){
// get the Default theme from the current plot settings.
var n,i,nn,th=new $.jqplot.Theme({_name:"Default"});for(n in th.target)"textColor"==n?th.target[n]=this.target.css("color"):th.target[n]=this.target.css(n);if(this.title.show&&this.title._elem)for(n in th.title)"textColor"==n?th.title[n]=this.title._elem.css("color"):th.title[n]=this.title._elem.css(n);for(n in th.grid)th.grid[n]=this.grid[n];if(null==th.grid.backgroundColor&&null!=this.grid.background&&(th.grid.backgroundColor=this.grid.background),this.legend.show&&this.legend._elem)for(n in th.legend)"textColor"==n?th.legend[n]=this.legend._elem.css("color"):th.legend[n]=this.legend._elem.css(n);var s;for(i=0;i<this.series.length;i++){s=this.series[i],s.renderer.constructor==$.jqplot.LineRenderer?th.series.push(new LineSeriesProperties):s.renderer.constructor==$.jqplot.BarRenderer?th.series.push(new BarSeriesProperties):s.renderer.constructor==$.jqplot.PieRenderer?th.series.push(new PieSeriesProperties):s.renderer.constructor==$.jqplot.DonutRenderer?th.series.push(new DonutSeriesProperties):s.renderer.constructor==$.jqplot.FunnelRenderer?th.series.push(new FunnelSeriesProperties):s.renderer.constructor==$.jqplot.MeterGaugeRenderer?th.series.push(new MeterSeriesProperties):th.series.push({});for(n in th.series[i])th.series[i][n]=s[n]}var a,ax;for(n in this.axes){if(ax=this.axes[n],a=th.axes[n]=new AxisProperties,a.borderColor=ax.borderColor,a.borderWidth=ax.borderWidth,ax._ticks&&ax._ticks[0])for(nn in a.ticks)ax._ticks[0].hasOwnProperty(nn)?a.ticks[nn]=ax._ticks[0][nn]:ax._ticks[0]._elem&&(a.ticks[nn]=ax._ticks[0]._elem.css(nn));if(ax._label&&ax._label.show)for(nn in a.label)
// a.label[nn] = ax._label._elem.css(nn);
ax._label[nn]?a.label[nn]=ax._label[nn]:ax._label._elem&&("textColor"==nn?a.label[nn]=ax._label._elem.css("color"):a.label[nn]=ax._label._elem.css(nn))}this.themeEngine._add(th),this.themeEngine.activeTheme=this.themeEngine.themes[th._name]},/**
     * Group: methods
     * 
     * method: get
     * 
     * Get and return the named theme or the active theme if no name given.
     * 
     * parameter:
     * 
     * name - name of theme to get.
     * 
     * returns:
     * 
     * Theme instance of given name.
     */
$.jqplot.ThemeEngine.prototype.get=function(name){return name?this.themes[name]:this.activeTheme},/**
     * method: getThemeNames
     * 
     * Return the list of theme names in this manager in alpha-numerical order.
     * 
     * parameter:
     * 
     * None
     * 
     * returns:
     * 
     * A the list of theme names in this manager in alpha-numerical order.
     */
$.jqplot.ThemeEngine.prototype.getThemeNames=function(){var tn=[];for(var n in this.themes)tn.push(n);return tn.sort(numericalOrder)},/**
     * method: getThemes
     * 
     * Return a list of themes in alpha-numerical order by name.
     * 
     * parameter:
     * 
     * None
     * 
     * returns:
     * 
     * A list of themes in alpha-numerical order by name.
     */
$.jqplot.ThemeEngine.prototype.getThemes=function(){var tn=[],themes=[];for(var n in this.themes)tn.push(n);tn.sort(numericalOrder);for(var i=0;i<tn.length;i++)themes.push(this.themes[tn[i]]);return themes},$.jqplot.ThemeEngine.prototype.activate=function(plot,name){
// sometimes need to redraw whole plot.
var redrawPlot=!1;if(!name&&this.activeTheme&&this.activeTheme._name&&(name=this.activeTheme._name),!this.themes.hasOwnProperty(name))throw new Error("No theme of that name");var th=this.themes[name];this.activeTheme=th;var val,arr=["xaxis","x2axis","yaxis","y2axis"];for(i=0;i<arr.length;i++){var ax=arr[i];null!=th.axesStyles.borderColor&&(plot.axes[ax].borderColor=th.axesStyles.borderColor),null!=th.axesStyles.borderWidth&&(plot.axes[ax].borderWidth=th.axesStyles.borderWidth)}for(var axname in plot.axes){var axis=plot.axes[axname];if(axis.show){var thaxis=th.axes[axname]||{},thaxstyle=th.axesStyles,thax=$.jqplot.extend(!0,{},thaxis,thaxstyle);if(val=null!=th.axesStyles.borderColor?th.axesStyles.borderColor:thax.borderColor,null!=thax.borderColor&&(axis.borderColor=thax.borderColor,redrawPlot=!0),val=null!=th.axesStyles.borderWidth?th.axesStyles.borderWidth:thax.borderWidth,null!=thax.borderWidth&&(axis.borderWidth=thax.borderWidth,redrawPlot=!0),axis._ticks&&axis._ticks[0])for(var nn in thax.ticks)val=thax.ticks[nn],null!=val&&(axis.tickOptions[nn]=val,axis._ticks=[],redrawPlot=!0);if(axis._label&&axis._label.show)for(var nn in thax.label)val=thax.label[nn],null!=val&&(axis.labelOptions[nn]=val,redrawPlot=!0)}}for(var n in th.grid)null!=th.grid[n]&&(plot.grid[n]=th.grid[n]);if(redrawPlot||plot.grid.draw(),plot.legend.show)for(n in th.legend)null!=th.legend[n]&&(plot.legend[n]=th.legend[n]);if(plot.title.show)for(n in th.title)null!=th.title[n]&&(plot.title[n]=th.title[n]);var i;for(i=0;i<th.series.length;i++){var opts={};for(n in th.series[i])val=null!=th.seriesStyles[n]?th.seriesStyles[n]:th.series[i][n],null!=val&&(opts[n]=val,"color"==n?(plot.series[i].renderer.shapeRenderer.fillStyle=val,plot.series[i].renderer.shapeRenderer.strokeStyle=val,plot.series[i][n]=val):"lineWidth"==n||"linePattern"==n?(plot.series[i].renderer.shapeRenderer[n]=val,plot.series[i][n]=val):"markerOptions"==n?(merge(plot.series[i].markerOptions,val),merge(plot.series[i].markerRenderer,val)):plot.series[i][n]=val,redrawPlot=!0)}redrawPlot&&(plot.target.empty(),plot.draw());for(n in th.target)null!=th.target[n]&&plot.target.css(n,th.target[n])},$.jqplot.ThemeEngine.prototype._add=function(theme,name){if(name&&(theme._name=name),theme._name||(theme._name=Date.parse(new Date)),this.themes.hasOwnProperty(theme._name))throw new Error("jqplot.ThemeEngine Error: Theme already in use");this.themes[theme._name]=theme},
// method remove
// Delete the named theme, return true on success, false on failure.
/**
     * method: remove
     * 
     * Remove the given theme from the themeEngine.
     * 
     * parameters:
     * 
     * name - name of the theme to remove.
     * 
     * returns:
     * 
     * true on success, false on failure.
     */
$.jqplot.ThemeEngine.prototype.remove=function(name){return"Default"==name?!1:delete this.themes[name]},/**
     * method: newTheme
     * 
     * Create a new theme based on the default theme, adding it the themeEngine.
     * 
     * parameters:
     * 
     * name - name of the new theme.
     * obj - optional object of styles to be applied to this new theme.
     * 
     * returns:
     * 
     * new Theme object.
     */
$.jqplot.ThemeEngine.prototype.newTheme=function(name,obj){"object"==typeof name&&(obj=obj||name,name=null),name=obj&&obj._name?obj._name:name||Date.parse(new Date);
// var th = new $.jqplot.Theme(name);
var th=this.copy(this.themes.Default._name,name);return $.jqplot.extend(th,obj),th},$.jqplot.clone=clone,$.jqplot.merge=merge,
// Use the jQuery 1.3.2 extend function since behaviour in jQuery 1.4 seems problematic
$.jqplot.extend=function(){
// copy reference to target object
var options,target=arguments[0]||{},i=1,length=arguments.length,deep=!1;for(
// Handle a deep copy situation
"boolean"==typeof target&&(deep=target,target=arguments[1]||{},i=2),
// Handle case when target is a string or something (possible in deep copy)
"object"!=typeof target&&"[object Function]"===!toString.call(target)&&(target={});length>i;i++)
// Only deal with non-null/undefined values
if(null!=(options=arguments[i]))
// Extend the base object
for(var name in options){var src=target[name],copy=options[name];
// Prevent never-ending loop
target!==copy&&(
// Recurse if we're merging object values
deep&&copy&&"object"==typeof copy&&!copy.nodeType?target[name]=$.jqplot.extend(deep,
// Never move original objects, clone them
src||(null!=copy.length?[]:{}),copy):copy!==undefined&&(target[name]=copy))}
// Return the modified object
return target},/**
     * method: rename
     * 
     * Rename a theme.
     * 
     * parameters:
     * 
     * oldName - current name of the theme.
     * newName - desired name of the theme.
     * 
     * returns:
     * 
     * new Theme object.
     */
$.jqplot.ThemeEngine.prototype.rename=function(oldName,newName){if("Default"==oldName||"Default"==newName)throw new Error("jqplot.ThemeEngine Error: Cannot rename from/to Default");if(this.themes.hasOwnProperty(newName))throw new Error("jqplot.ThemeEngine Error: New name already in use.");if(this.themes.hasOwnProperty(oldName)){var th=this.copy(oldName,newName);return this.remove(oldName),th}throw new Error("jqplot.ThemeEngine Error: Old name or new name invalid")},/**
     * method: copy
     * 
     * Create a copy of an existing theme in the themeEngine, adding it the themeEngine.
     * 
     * parameters:
     * 
     * sourceName - name of the existing theme.
     * targetName - name of the copy.
     * obj - optional object of style parameter to apply to the new theme.
     * 
     * returns:
     * 
     * new Theme object.
     */
$.jqplot.ThemeEngine.prototype.copy=function(sourceName,targetName,obj){if("Default"==targetName)throw new Error("jqplot.ThemeEngine Error: Cannot copy over Default theme");if(!this.themes.hasOwnProperty(sourceName)){var s="jqplot.ThemeEngine Error: Source name invalid";throw new Error(s)}if(this.themes.hasOwnProperty(targetName)){var s="jqplot.ThemeEngine Error: Target name invalid";throw new Error(s)}var th=clone(this.themes[sourceName]);return th._name=targetName,$.jqplot.extend(!0,th,obj),this._add(th),th},$.jqplot.Theme=function(name,obj){"object"==typeof name&&(obj=obj||name,name=null),name=name||Date.parse(new Date),this._name=name,this.target={backgroundColor:null},this.legend={textColor:null,fontFamily:null,fontSize:null,border:null,background:null},this.title={textColor:null,fontFamily:null,fontSize:null,textAlign:null},this.seriesStyles={},this.series=[],this.grid={drawGridlines:null,gridLineColor:null,gridLineWidth:null,backgroundColor:null,borderColor:null,borderWidth:null,shadow:null},this.axesStyles={label:{},ticks:{}},this.axes={},"string"==typeof obj?this._name=obj:"object"==typeof obj&&$.jqplot.extend(!0,this,obj)};var AxisProperties=function(){this.borderColor=null,this.borderWidth=null,this.ticks=new AxisTicks,this.label=new AxisLabel},AxisTicks=function(){this.show=null,this.showGridline=null,this.showLabel=null,this.showMark=null,this.size=null,this.textColor=null,this.whiteSpace=null,this.fontSize=null,this.fontFamily=null},AxisLabel=function(){this.textColor=null,this.whiteSpace=null,this.fontSize=null,this.fontFamily=null,this.fontWeight=null},LineSeriesProperties=function(){this.color=null,this.lineWidth=null,this.linePattern=null,this.shadow=null,this.fillColor=null,this.showMarker=null,this.markerOptions=new MarkerOptions},MarkerOptions=function(){this.show=null,this.style=null,this.lineWidth=null,this.size=null,this.color=null,this.shadow=null},BarSeriesProperties=function(){this.color=null,this.seriesColors=null,this.lineWidth=null,this.shadow=null,this.barPadding=null,this.barMargin=null,this.barWidth=null,this.highlightColors=null},PieSeriesProperties=function(){this.seriesColors=null,this.padding=null,this.sliceMargin=null,this.fill=null,this.shadow=null,this.startAngle=null,this.lineWidth=null,this.highlightColors=null},DonutSeriesProperties=function(){this.seriesColors=null,this.padding=null,this.sliceMargin=null,this.fill=null,this.shadow=null,this.startAngle=null,this.lineWidth=null,this.innerDiameter=null,this.thickness=null,this.ringMargin=null,this.highlightColors=null},FunnelSeriesProperties=function(){this.color=null,this.lineWidth=null,this.shadow=null,this.padding=null,this.sectionMargin=null,this.seriesColors=null,this.highlightColors=null},MeterSeriesProperties=function(){this.padding=null,this.backgroundColor=null,this.ringColor=null,this.tickColor=null,this.ringWidth=null,this.intervalColors=null,this.intervalInnerRadius=null,this.intervalOuterRadius=null,this.hubRadius=null,this.needleThickness=null,this.needlePad=null};$.fn.jqplotChildText=function(){return $(this).contents().filter(function(){return 3==this.nodeType}).text()},
// Returns font style as abbreviation for "font" property.
$.fn.jqplotGetComputedFontStyle=function(){for(var css=window.getComputedStyle?window.getComputedStyle(this[0],""):this[0].currentStyle,attrs=css["font-style"]?["font-style","font-weight","font-size","font-family"]:["fontStyle","fontWeight","fontSize","fontFamily"],style=[],i=0;i<attrs.length;++i){var attr=String(css[attrs[i]]);attr&&"normal"!=attr&&style.push(attr)}return style.join(" ")},/**
     * Namespace: $.fn
     * jQuery namespace to attach functions to jQuery elements.
     *  
     */
$.fn.jqplotToImageCanvas=function(options){function getLineheight(el){var lineheight=parseInt($(el).css("line-height"),10);return isNaN(lineheight)&&(lineheight=1.2*parseInt($(el).css("font-size"),10)),lineheight}function writeWrappedText(el,context,text,left,top,canvasWidth){for(var lineheight=getLineheight(el),tagwidth=$(el).innerWidth(),words=($(el).innerHeight(),text.split(/\s+/)),wl=words.length,w="",breaks=[],temptop=top,templeft=left,i=0;wl>i;i++)w+=words[i],context.measureText(w).width>tagwidth&&(breaks.push(i),w="",i--);if(0===breaks.length)
// center text if necessary
"center"===$(el).css("textAlign")&&(templeft=left+(canvasWidth-context.measureText(w).width)/2-transx),context.fillText(text,templeft,top);else{w=words.slice(0,breaks[0]).join(" "),
// center text if necessary
"center"===$(el).css("textAlign")&&(templeft=left+(canvasWidth-context.measureText(w).width)/2-transx),context.fillText(w,templeft,temptop),temptop+=lineheight;for(var i=1,l=breaks.length;l>i;i++)w=words.slice(breaks[i-1],breaks[i]).join(" "),"center"===$(el).css("textAlign")&&(templeft=left+(canvasWidth-context.measureText(w).width)/2-transx),context.fillText(w,templeft,temptop),temptop+=lineheight;w=words.slice(breaks[i-1],words.length).join(" "),
// center text if necessary
"center"===$(el).css("textAlign")&&(templeft=left+(canvasWidth-context.measureText(w).width)/2-transx),context.fillText(w,templeft,temptop)}}function _jqpToImage(el,x_offset,y_offset){var tagname=el.tagName.toLowerCase(),p=$(el).position(),css=window.getComputedStyle?window.getComputedStyle(el,""):el.currentStyle,left=x_offset+p.left+parseInt(css.marginLeft,10)+parseInt(css.borderLeftWidth,10)+parseInt(css.paddingLeft,10),top=y_offset+p.top+parseInt(css.marginTop,10)+parseInt(css.borderTopWidth,10)+parseInt(css.paddingTop,10),w=newCanvas.width;
// var left = x_offset + p.left + $(el).css('marginLeft') + $(el).css('borderLeftWidth') 
// somehow in here, for divs within divs, the width of the inner div should be used instead of the canvas.
if("div"!=tagname&&"span"!=tagname||$(el).hasClass("jqplot-highlighter-tooltip"))if("table"===tagname&&$(el).hasClass("jqplot-table-legend")){newContext.strokeStyle=$(el).css("border-top-color"),newContext.fillStyle=$(el).css("background-color"),newContext.fillRect(left,top,$(el).innerWidth(),$(el).innerHeight()),parseInt($(el).css("border-top-width"),10)>0&&newContext.strokeRect(left,top,$(el).innerWidth(),$(el).innerHeight()),
// find all the swatches
$(el).find("div.jqplot-table-legend-swatch-outline").each(function(){
// get the first div and stroke it
var elem=$(this);newContext.strokeStyle=elem.css("border-top-color");var l=left+elem.position().left,t=top+elem.position().top;newContext.strokeRect(l,t,elem.innerWidth(),elem.innerHeight()),l+=parseInt(elem.css("padding-left"),10),t+=parseInt(elem.css("padding-top"),10);var h=elem.innerHeight()-2*parseInt(elem.css("padding-top"),10),w=elem.innerWidth()-2*parseInt(elem.css("padding-left"),10),swatch=elem.children("div.jqplot-table-legend-swatch");newContext.fillStyle=swatch.css("background-color"),newContext.fillRect(l,t,w,h)}),
// now add text
$(el).find("td.jqplot-table-legend-label").each(function(){var elem=$(this),l=left+elem.position().left,t=top+elem.position().top+parseInt(elem.css("padding-top"),10);newContext.font=elem.jqplotGetComputedFontStyle(),newContext.fillStyle=elem.css("color"),writeWrappedText(elem,newContext,elem.text(),l,t,w)})}else"canvas"==tagname&&newContext.drawImage(el,left,top);else{$(el).children().each(function(){_jqpToImage(this,left,top)});var text=$(el).jqplotChildText();text&&(newContext.font=$(el).jqplotGetComputedFontStyle(),newContext.fillStyle=$(el).css("color"),writeWrappedText(el,newContext,text,left,top,w))}}options=options||{};var x_offset=null==options.x_offset?0:options.x_offset,y_offset=null==options.y_offset?0:options.y_offset,backgroundColor=null==options.backgroundColor?"rgb(255,255,255)":options.backgroundColor;if(0==$(this).width()||0==$(this).height())return null;
// excanvas and hence IE < 9 do not support toDataURL and cannot export images.
if($.jqplot.use_excanvas)return null;for(var temptop,templeft,tempbottom,tempright,newCanvas=document.createElement("canvas"),h=$(this).outerHeight(!0),w=$(this).outerWidth(!0),offs=$(this).offset(),plotleft=offs.left,plottop=offs.top,transx=0,transy=0,clses=["jqplot-table-legend","jqplot-xaxis-tick","jqplot-x2axis-tick","jqplot-yaxis-tick","jqplot-y2axis-tick","jqplot-y3axis-tick","jqplot-y4axis-tick","jqplot-y5axis-tick","jqplot-y6axis-tick","jqplot-y7axis-tick","jqplot-y8axis-tick","jqplot-y9axis-tick","jqplot-xaxis-label","jqplot-x2axis-label","jqplot-yaxis-label","jqplot-y2axis-label","jqplot-y3axis-label","jqplot-y4axis-label","jqplot-y5axis-label","jqplot-y6axis-label","jqplot-y7axis-label","jqplot-y8axis-label","jqplot-y9axis-label"],i=0;i<clses.length;i++)$(this).find("."+clses[i]).each(function(){temptop=$(this).offset().top-plottop,templeft=$(this).offset().left-plotleft,tempright=templeft+$(this).outerWidth(!0)+transx,tempbottom=temptop+$(this).outerHeight(!0)+transy,-transx>templeft&&(w=w-transx-templeft,transx=-templeft),-transy>temptop&&(h=h-transy-temptop,transy=-temptop),tempright>w&&(w=tempright),tempbottom>h&&(h=tempbottom)});newCanvas.width=w+Number(x_offset),newCanvas.height=h+Number(y_offset);var newContext=newCanvas.getContext("2d");return newContext.save(),newContext.fillStyle=backgroundColor,newContext.fillRect(0,0,newCanvas.width,newCanvas.height),newContext.restore(),newContext.translate(transx,transy),newContext.textAlign="left",newContext.textBaseline="top",$(this).children().each(function(){_jqpToImage(this,x_offset,y_offset)}),newCanvas},
// return the raw image data string.
// Should work on canvas supporting browsers.
$.fn.jqplotToImageStr=function(options){var imgCanvas=$(this).jqplotToImageCanvas(options);return imgCanvas?imgCanvas.toDataURL("image/png"):null},
// return a DOM <img> element and return it.
// Should work on canvas supporting browsers.
$.fn.jqplotToImageElem=function(options){var elem=document.createElement("img"),str=$(this).jqplotToImageStr(options);return elem.src=str,elem},
// return a string for an <img> element and return it.
// Should work on canvas supporting browsers.
$.fn.jqplotToImageElemStr=function(options){var str="<img src="+$(this).jqplotToImageStr(options)+" />";return str},
// Not guaranteed to work, even on canvas supporting browsers due to 
// limitations with location.href and browser support.
$.fn.jqplotSaveImage=function(){var imgData=$(this).jqplotToImageStr({});imgData&&(window.location.href=imgData.replace("image/png","image/octet-stream"))},
// Not guaranteed to work, even on canvas supporting browsers due to
// limitations with window.open and arbitrary data.
$.fn.jqplotViewImage=function(){var imgStr=$(this).jqplotToImageElemStr({});$(this).jqplotToImageStr({});if(imgStr){var w=window.open("");w.document.open("image/png"),w.document.write(imgStr),w.document.close(),w=null}};/** 
     * @description
     * <p>Object with extended date parsing and formatting capabilities.
     * This library borrows many concepts and ideas from the Date Instance 
     * Methods by Ken Snyder along with some parts of Ken's actual code.</p>
     *
     * <p>jsDate takes a different approach by not extending the built-in 
     * Date Object, improving date parsing, allowing for multiple formatting 
     * syntaxes and multiple and more easily expandable localization.</p>
     * 
     * @author Chris Leonello
     * @date #date#
     * @version #VERSION#
     * @copyright (c) 2010-2013 Chris Leonello
     * jsDate is currently available for use in all personal or commercial projects 
     * under both the MIT and GPL version 2.0 licenses. This means that you can 
     * choose the license that best suits your project and use it accordingly.
     * 
     * <p>Ken's original Date Instance Methods and copyright notice:</p>
     * <pre>
     * Ken Snyder (ken d snyder at gmail dot com)
     * 2008-09-10
     * version 2.0.2 (http://kendsnyder.com/sandbox/date/)     
     * Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
     * </pre>
     * 
     * @class
     * @name jsDate
     * @param  {String | Number | Array | Date&nbsp;Object | Options&nbsp;Object} arguments Optional arguments, either a parsable date/time string,
     * a JavaScript timestamp, an array of numbers of form [year, month, day, hours, minutes, seconds, milliseconds],
     * a Date object, or an options object of form {syntax: "perl", date:some Date} where all options are optional.
     */
var jsDate=function(){switch(this.syntax=jsDate.config.syntax,this._type="jsDate",this.proxy=new Date,this.options={},this.locale=jsDate.regional.getLocale(),this.formatString="",this.defaultCentury=jsDate.config.defaultCentury,arguments.length){case 0:break;case 1:
// other objects either won't have a _type property or,
// if they do, it shouldn't be set to "jsDate", so
// assume it is an options argument.
if("[object Object]"==get_type(arguments[0])&&"jsDate"!=arguments[0]._type){var opts=this.options=arguments[0];this.syntax=opts.syntax||this.syntax,this.defaultCentury=opts.defaultCentury||this.defaultCentury,this.proxy=jsDate.createDate(opts.date)}else this.proxy=jsDate.createDate(arguments[0]);break;default:for(var a=[],i=0;i<arguments.length;i++)a.push(arguments[i]);
// this should be the current date/time?
this.proxy=new Date,this.proxy.setFullYear.apply(this.proxy,a.slice(0,3)),a.slice(3).length&&this.proxy.setHours.apply(this.proxy,a.slice(3))}};/**
     * @namespace Configuration options that will be used as defaults for all instances on the page.
     * @property {String} defaultLocale The default locale to use [en].
     * @property {String} syntax The default syntax to use [perl].
     * @property {Number} defaultCentury The default centry for 2 digit dates.
     */
jsDate.config={defaultLocale:"en",syntax:"perl",defaultCentury:1900},/**
     * Add an arbitrary amount to the currently stored date
     * 
     * @param {Number} number      
     * @param {String} unit
     * @returns {jsDate}       
     */
jsDate.prototype.add=function(number,unit){var factor=multipliers[unit]||multipliers.day;return"number"==typeof factor?this.proxy.setTime(this.proxy.getTime()+factor*number):factor.add(this,number),this},/**
     * Create a new jqplot.date object with the same date
     * 
     * @returns {jsDate}
     */
jsDate.prototype.clone=function(){return new jsDate(this.proxy.getTime())},/**
     * Get the UTC TimeZone Offset of this date in milliseconds.
     *
     * @returns {Number}
     */
jsDate.prototype.getUtcOffset=function(){return 6e4*this.proxy.getTimezoneOffset()},/**
     * Find the difference between this jsDate and another date.
     * 
     * @param {String| Number| Array| jsDate&nbsp;Object| Date&nbsp;Object} dateObj
     * @param {String} unit
     * @param {Boolean} allowDecimal
     * @returns {Number} Number of units difference between dates.
     */
jsDate.prototype.diff=function(dateObj,unit,allowDecimal){if(dateObj=new jsDate(dateObj),null===dateObj)return null;
// get the multiplying factor integer or factor function
var factor=multipliers[unit]||multipliers.day;if("number"==typeof factor)
// multiply
var unitDiff=(this.proxy.getTime()-dateObj.proxy.getTime())/factor;else
// run function
var unitDiff=factor.diff(this.proxy,dateObj.proxy);
// if decimals are not allowed, round toward zero
return allowDecimal?unitDiff:Math[unitDiff>0?"floor":"ceil"](unitDiff)},/**
     * Get the abbreviated name of the current week day
     * 
     * @returns {String}
     */
jsDate.prototype.getAbbrDayName=function(){return jsDate.regional[this.locale].dayNamesShort[this.proxy.getDay()]},/**
     * Get the abbreviated name of the current month
     * 
     * @returns {String}
     */
jsDate.prototype.getAbbrMonthName=function(){return jsDate.regional[this.locale].monthNamesShort[this.proxy.getMonth()]},/**
     * Get UPPER CASE AM or PM for the current time
     * 
     * @returns {String}
     */
jsDate.prototype.getAMPM=function(){return this.proxy.getHours()>=12?"PM":"AM"},/**
     * Get lower case am or pm for the current time
     * 
     * @returns {String}
     */
jsDate.prototype.getAmPm=function(){return this.proxy.getHours()>=12?"pm":"am"},/**
     * Get the century (19 for 20th Century)
     *
     * @returns {Integer} Century (19 for 20th century).
     */
jsDate.prototype.getCentury=function(){return parseInt(this.proxy.getFullYear()/100,10)},/**
     * Implements Date functionality
     */
jsDate.prototype.getDate=function(){return this.proxy.getDate()},/**
     * Implements Date functionality
     */
jsDate.prototype.getDay=function(){return this.proxy.getDay()},/**
     * Get the Day of week 1 (Monday) thru 7 (Sunday)
     * 
     * @returns {Integer} Day of week 1 (Monday) thru 7 (Sunday)
     */
jsDate.prototype.getDayOfWeek=function(){var dow=this.proxy.getDay();return 0===dow?7:dow},/**
     * Get the day of the year
     * 
     * @returns {Integer} 1 - 366, day of the year
     */
jsDate.prototype.getDayOfYear=function(){var d=this.proxy,ms=d-new Date(""+d.getFullYear()+"/1/1 GMT");return ms+=6e4*d.getTimezoneOffset(),d=null,parseInt(ms/6e4/60/24,10)+1},/**
     * Get the name of the current week day
     * 
     * @returns {String}
     */
jsDate.prototype.getDayName=function(){return jsDate.regional[this.locale].dayNames[this.proxy.getDay()]},/**
     * Get the week number of the given year, starting with the first Sunday as the first week
     * @returns {Integer} Week number (13 for the 13th full week of the year).
     */
jsDate.prototype.getFullWeekOfYear=function(){var d=this.proxy,doy=this.getDayOfYear(),rdow=6-d.getDay(),woy=parseInt((doy+rdow)/7,10);return woy},/**
     * Implements Date functionality
     */
jsDate.prototype.getFullYear=function(){return this.proxy.getFullYear()},/**
     * Get the GMT offset in hours and minutes (e.g. +06:30)
     * 
     * @returns {String}
     */
jsDate.prototype.getGmtOffset=function(){
// divide the minutes offset by 60
var hours=this.proxy.getTimezoneOffset()/60,prefix=0>hours?"+":"-";
// add the +/- to the padded number of hours to : to the padded minutes
// remove the negative sign if any
return hours=Math.abs(hours),prefix+addZeros(Math.floor(hours),2)+":"+addZeros(hours%1*60,2)},/**
     * Implements Date functionality
     */
jsDate.prototype.getHours=function(){return this.proxy.getHours()},/**
     * Get the current hour on a 12-hour scheme
     * 
     * @returns {Integer}
     */
jsDate.prototype.getHours12=function(){var hours=this.proxy.getHours();return hours>12?hours-12:0==hours?12:hours},jsDate.prototype.getIsoWeek=function(){var d=this.proxy,woy=this.getWeekOfYear(),dow1_1=new Date(""+d.getFullYear()+"/1/1").getDay(),idow=woy+(dow1_1>4||1>=dow1_1?0:1);return 53==idow&&new Date(""+d.getFullYear()+"/12/31").getDay()<4?idow=1:0===idow&&(d=new jsDate(new Date(""+(d.getFullYear()-1)+"/12/31")),idow=d.getIsoWeek()),d=null,idow},/**
     * Implements Date functionality
     */
jsDate.prototype.getMilliseconds=function(){return this.proxy.getMilliseconds()},/**
     * Implements Date functionality
     */
jsDate.prototype.getMinutes=function(){return this.proxy.getMinutes()},/**
     * Implements Date functionality
     */
jsDate.prototype.getMonth=function(){return this.proxy.getMonth()},/**
     * Get the name of the current month
     * 
     * @returns {String}
     */
jsDate.prototype.getMonthName=function(){return jsDate.regional[this.locale].monthNames[this.proxy.getMonth()]},/**
     * Get the number of the current month, 1-12
     * 
     * @returns {Integer}
     */
jsDate.prototype.getMonthNumber=function(){return this.proxy.getMonth()+1},/**
     * Implements Date functionality
     */
jsDate.prototype.getSeconds=function(){return this.proxy.getSeconds()},/**
     * Return a proper two-digit year integer
     * 
     * @returns {Integer}
     */
jsDate.prototype.getShortYear=function(){return this.proxy.getYear()%100},/**
     * Implements Date functionality
     */
jsDate.prototype.getTime=function(){return this.proxy.getTime()},/**
     * Get the timezone abbreviation
     *
     * @returns {String} Abbreviation for the timezone
     */
jsDate.prototype.getTimezoneAbbr=function(){return this.proxy.toString().replace(/^.*\(([^)]+)\)$/,"$1")},/**
     * Get the browser-reported name for the current timezone (e.g. MDT, Mountain Daylight Time)
     * 
     * @returns {String}
     */
jsDate.prototype.getTimezoneName=function(){var match=/(?:\((.+)\)$| ([A-Z]{3}) )/.exec(this.toString());return match[1]||match[2]||"GMT"+this.getGmtOffset()},/**
     * Implements Date functionality
     */
jsDate.prototype.getTimezoneOffset=function(){return this.proxy.getTimezoneOffset()},/**
     * Get the week number of the given year, starting with the first Monday as the first week
     * @returns {Integer} Week number (13 for the 13th week of the year).
     */
jsDate.prototype.getWeekOfYear=function(){var doy=this.getDayOfYear(),rdow=7-this.getDayOfWeek(),woy=parseInt((doy+rdow)/7,10);return woy},/**
     * Get the current date as a Unix timestamp
     * 
     * @returns {Integer}
     */
jsDate.prototype.getUnix=function(){return Math.round(this.proxy.getTime()/1e3,0)},/**
     * Implements Date functionality
     */
jsDate.prototype.getYear=function(){return this.proxy.getYear()},/**
     * Return a date one day ahead (or any other unit)
     * 
     * @param {String} unit Optional, year | month | day | week | hour | minute | second | millisecond
     * @returns {jsDate}
     */
jsDate.prototype.next=function(unit){return unit=unit||"day",this.clone().add(1,unit)},/**
     * Set the jsDate instance to a new date.
     *
     * @param  {String | Number | Array | Date Object | jsDate Object | Options Object} arguments Optional arguments, 
     * either a parsable date/time string,
     * a JavaScript timestamp, an array of numbers of form [year, month, day, hours, minutes, seconds, milliseconds],
     * a Date object, jsDate Object or an options object of form {syntax: "perl", date:some Date} where all options are optional.
     */
jsDate.prototype.set=function(){switch(arguments.length){case 0:this.proxy=new Date;break;case 1:
// other objects either won't have a _type property or,
// if they do, it shouldn't be set to "jsDate", so
// assume it is an options argument.
if("[object Object]"==get_type(arguments[0])&&"jsDate"!=arguments[0]._type){var opts=this.options=arguments[0];this.syntax=opts.syntax||this.syntax,this.defaultCentury=opts.defaultCentury||this.defaultCentury,this.proxy=jsDate.createDate(opts.date)}else this.proxy=jsDate.createDate(arguments[0]);break;default:for(var a=[],i=0;i<arguments.length;i++)a.push(arguments[i]);
// this should be the current date/time
this.proxy=new Date,this.proxy.setFullYear.apply(this.proxy,a.slice(0,3)),a.slice(3).length&&this.proxy.setHours.apply(this.proxy,a.slice(3))}return this},/**
     * Sets the day of the month for a specified date according to local time.
     * @param {Integer} dayValue An integer from 1 to 31, representing the day of the month. 
     */
jsDate.prototype.setDate=function(n){return this.proxy.setDate(n),this},/**
     * Sets the full year for a specified date according to local time.
     * @param {Integer} yearValue The numeric value of the year, for example, 1995.  
     * @param {Integer} monthValue Optional, between 0 and 11 representing the months January through December.  
     * @param {Integer} dayValue Optional, between 1 and 31 representing the day of the month. If you specify the dayValue parameter, you must also specify the monthValue. 
     */
jsDate.prototype.setFullYear=function(){return this.proxy.setFullYear.apply(this.proxy,arguments),this},/**
     * Sets the hours for a specified date according to local time.
     * 
     * @param {Integer} hoursValue An integer between 0 and 23, representing the hour.  
     * @param {Integer} minutesValue Optional, An integer between 0 and 59, representing the minutes.  
     * @param {Integer} secondsValue Optional, An integer between 0 and 59, representing the seconds. 
     * If you specify the secondsValue parameter, you must also specify the minutesValue.  
     * @param {Integer} msValue Optional, A number between 0 and 999, representing the milliseconds. 
     * If you specify the msValue parameter, you must also specify the minutesValue and secondsValue. 
     */
jsDate.prototype.setHours=function(){return this.proxy.setHours.apply(this.proxy,arguments),this},/**
     * Implements Date functionality
     */
jsDate.prototype.setMilliseconds=function(n){return this.proxy.setMilliseconds(n),this},/**
     * Implements Date functionality
     */
jsDate.prototype.setMinutes=function(){return this.proxy.setMinutes.apply(this.proxy,arguments),this},/**
     * Implements Date functionality
     */
jsDate.prototype.setMonth=function(){return this.proxy.setMonth.apply(this.proxy,arguments),this},/**
     * Implements Date functionality
     */
jsDate.prototype.setSeconds=function(){return this.proxy.setSeconds.apply(this.proxy,arguments),this},/**
     * Implements Date functionality
     */
jsDate.prototype.setTime=function(n){return this.proxy.setTime(n),this},/**
     * Implements Date functionality
     */
jsDate.prototype.setYear=function(){return this.proxy.setYear.apply(this.proxy,arguments),this},/**
     * Provide a formatted string representation of this date.
     * 
     * @param {String} formatString A format string.  
     * See: {@link jsDate.formats}.
     * @returns {String} Date String.
     */
jsDate.prototype.strftime=function(formatString){return formatString=formatString||this.formatString||jsDate.regional[this.locale].formatString,jsDate.strftime(this,formatString,this.syntax)},/**
     * Return a String representation of this jsDate object.
     * @returns {String} Date string.
     */
jsDate.prototype.toString=function(){return this.proxy.toString()},/**
     * Convert the current date to an 8-digit integer (%Y%m%d)
     * 
     * @returns {Integer}
     */
jsDate.prototype.toYmdInt=function(){return 1e4*this.proxy.getFullYear()+100*this.getMonthNumber()+this.proxy.getDate()},/**
     * @namespace Holds localizations for month/day names.
     * <p>jsDate attempts to detect locale when loaded and defaults to 'en'.
     * If a localization is detected which is not available, jsDate defaults to 'en'.
     * Additional localizations can be added after jsDate loads.  After adding a localization,
     * call the jsDate.regional.getLocale() method.  Currently, en, fr and de are defined.</p>
     * 
     * <p>Localizations must be an object and have the following properties defined:  monthNames, monthNamesShort, dayNames, dayNamesShort and Localizations are added like:</p>
     * <pre class="code">
     * jsDate.regional['en'] = {
     * monthNames      : 'January February March April May June July August September October November December'.split(' '),
     * monthNamesShort : 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
     * dayNames        : 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
     * dayNamesShort   : 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
     * };
     * </pre>
     * <p>After adding localizations, call <code>jsDate.regional.getLocale();</code> to update the locale setting with the
     * new localizations.</p>
     */
jsDate.regional={en:{monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],formatString:"%Y-%m-%d %H:%M:%S"},fr:{monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],monthNamesShort:["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"],dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],dayNamesShort:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],formatString:"%Y-%m-%d %H:%M:%S"},de:{monthNames:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],monthNamesShort:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],dayNames:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],dayNamesShort:["So","Mo","Di","Mi","Do","Fr","Sa"],formatString:"%Y-%m-%d %H:%M:%S"},es:{monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Mi&eacute;rcoles","Jueves","Viernes","S&aacute;bado"],dayNamesShort:["Dom","Lun","Mar","Mi&eacute;","Juv","Vie","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"},ru:{monthNames:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],monthNamesShort:["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],dayNames:["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],dayNamesShort:["вск","пнд","втр","срд","чтв","птн","сбт"],formatString:"%Y-%m-%d %H:%M:%S"},ar:{monthNames:["كانون الثاني","شباط","آذار","نيسان","آذار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"],monthNamesShort:["1","2","3","4","5","6","7","8","9","10","11","12"],dayNames:["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"],dayNamesShort:["سبت","أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة"],formatString:"%Y-%m-%d %H:%M:%S"},pt:{monthNames:["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],dayNames:["Domingo","Segunda-feira","Ter&ccedil;a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S&aacute;bado"],dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"},"pt-BR":{monthNames:["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],dayNames:["Domingo","Segunda-feira","Ter&ccedil;a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S&aacute;bado"],dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"},pl:{monthNames:["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],monthNamesShort:["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"],dayNames:["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"],dayNamesShort:["Ni","Pn","Wt","Śr","Cz","Pt","Sb"],formatString:"%Y-%m-%d %H:%M:%S"},nl:{monthNames:["Januari","Februari","Maart","April","Mei","Juni","July","Augustus","September","Oktober","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],dayNames:",".Zaterdag,dayNamesShort:["Zo","Ma","Di","Wo","Do","Vr","Za"],formatString:"%Y-%m-%d %H:%M:%S"},sv:{monthNames:["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],monthNamesShort:["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"],dayNames:["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"],dayNamesShort:["sön","mån","tis","ons","tor","fre","lör"],formatString:"%Y-%m-%d %H:%M:%S"}},
// Set english variants to 'en'
jsDate.regional["en-US"]=jsDate.regional["en-GB"]=jsDate.regional.en,/**
     * Try to determine the users locale based on the lang attribute of the html page.  Defaults to 'en'
     * if it cannot figure out a locale of if the locale does not have a localization defined.
     * @returns {String} locale
     */
jsDate.regional.getLocale=function(){var l=jsDate.config.defaultLocale;return document&&document.getElementsByTagName("html")&&document.getElementsByTagName("html")[0].lang&&(l=document.getElementsByTagName("html")[0].lang,jsDate.regional.hasOwnProperty(l)||(l=jsDate.config.defaultLocale)),l};
// ms in day
var day=864e5,addZeros=function(num,digits){num=String(num);var i=digits-num.length,s=String(Math.pow(10,i)).slice(1);return s.concat(num)},multipliers={millisecond:1,second:1e3,minute:6e4,hour:36e5,day:day,week:7*day,month:{
// add a number of months
add:function(d,number){
// add any years needed (increments of 12)
multipliers.year.add(d,Math[number>0?"floor":"ceil"](number/12));
// ensure that we properly wrap betwen December and January
// 11 % 12 = 11
// 12 % 12 = 0
var prevMonth=d.getMonth()+number%12;12==prevMonth?(prevMonth=0,d.setYear(d.getFullYear()+1)):-1==prevMonth&&(prevMonth=11,d.setYear(d.getFullYear()-1)),d.setMonth(prevMonth)},
// get the number of months between two Date objects (decimal to the nearest day)
diff:function(d1,d2){
// get the number of years
var diffYears=d1.getFullYear()-d2.getFullYear(),diffMonths=d1.getMonth()-d2.getMonth()+12*diffYears,diffDays=d1.getDate()-d2.getDate();
// return the month difference with the days difference as a decimal
return diffMonths+diffDays/30}},year:{
// add a number of years
add:function(d,number){d.setYear(d.getFullYear()+Math[number>0?"floor":"ceil"](number))},
// get the number of years between two Date objects (decimal to the nearest day)
diff:function(d1,d2){return multipliers.month.diff(d1,d2)/12}}};
//
// Alias each multiplier with an 's' to allow 'year' and 'years' for example.
// This comes from Ken Snyders work.
//
for(var unit in multipliers)"s"!=unit.substring(unit.length-1)&&(// IE will iterate newly added properties :|
multipliers[unit+"s"]=multipliers[unit]);
//
// take a jsDate instance and a format code and return the formatted value.
// This is a somewhat modified version of Ken Snyder's method.
//
var format=function(d,code,syntax){
// if shorcut codes are used, recursively expand those.
if(jsDate.formats[syntax].shortcuts[code])return jsDate.strftime(d,jsDate.formats[syntax].shortcuts[code],syntax);
// get the format code function and addZeros() argument
var getter=(jsDate.formats[syntax].codes[code]||"").split("."),nbr=d["get"+getter[0]]?d["get"+getter[0]]():"";return getter[1]&&(nbr=addZeros(nbr,getter[1])),nbr};/**
     * @static
     * Static function for convert a date to a string according to a given format.  Also acts as namespace for strftime format codes.
     * <p>strftime formatting can be accomplished without creating a jsDate object by calling jsDate.strftime():</p>
     * <pre class="code">
     * var formattedDate = jsDate.strftime('Feb 8, 2006 8:48:32', '%Y-%m-%d %H:%M:%S');
     * </pre>
     * @param {String | Number | Array | jsDate&nbsp;Object | Date&nbsp;Object} date A parsable date string, JavaScript time stamp, Array of form [year, month, day, hours, minutes, seconds, milliseconds], jsDate Object or Date object.
     * @param {String} formatString String with embedded date formatting codes.  
     * See: {@link jsDate.formats}. 
     * @param {String} syntax Optional syntax to use [default perl].
     * @param {String} locale Optional locale to use.
     * @returns {String} Formatted representation of the date.
    */
//
// Logic as implemented here is very similar to Ken Snyder's Date Instance Methods.
//
jsDate.strftime=function(d,formatString,syntax,locale){var syn="perl",loc=jsDate.regional.getLocale();
// check if syntax and locale are available or reversed
syntax&&jsDate.formats.hasOwnProperty(syntax)?syn=syntax:syntax&&jsDate.regional.hasOwnProperty(syntax)&&(loc=syntax),locale&&jsDate.formats.hasOwnProperty(locale)?syn=locale:locale&&jsDate.regional.hasOwnProperty(locale)&&(loc=locale),("[object Object]"!=get_type(d)||"jsDate"!=d._type)&&(d=new jsDate(d),d.locale=loc),formatString||(formatString=d.formatString||jsDate.regional[loc].formatString);
// replace each format code
for(
// default the format string to year-month-day
var match,source=formatString||"%Y-%m-%d",result="";source.length>0;)(match=source.match(jsDate.formats[syn].codes.matcher))?(result+=source.slice(0,match.index),result+=(match[1]||"")+format(d,match[2],syn),source=source.slice(match.index+match[0].length)):(result+=source,source="");return result},/**
     * @namespace
     * Namespace to hold format codes and format shortcuts.  "perl" and "php" format codes 
     * and shortcuts are defined by default.  Additional codes and shortcuts can be
     * added like:
     * 
     * <pre class="code">
     * jsDate.formats["perl"] = {
     *     "codes": {
     *         matcher: /someregex/,
     *         Y: "fullYear",  // name of "get" method without the "get",
     *         ...,            // more codes
     *     },
     *     "shortcuts": {
     *         F: '%Y-%m-%d',
     *         ...,            // more shortcuts
     *     }
     * };
     * </pre>
     * 
     * <p>Additionally, ISO and SQL shortcuts are defined and can be accesses via:
     * <code>jsDate.formats.ISO</code> and <code>jsDate.formats.SQL</code>
     */
jsDate.formats={ISO:"%Y-%m-%dT%H:%M:%S.%N%G",SQL:"%Y-%m-%d %H:%M:%S"},/**
     * Perl format codes and shortcuts for strftime.
     * 
     * A hash (object) of codes where each code must be an array where the first member is 
     * the name of a Date.prototype or jsDate.prototype function to call
     * and optionally a second member indicating the number to pass to addZeros()
     * 
     * <p>The following format codes are defined:</p>
     * 
     * <pre class="code">
     * Code    Result                    Description
     * == Years ==           
     * %Y      2008                      Four-digit year
     * %y      08                        Two-digit year
     * 
     * == Months ==          
     * %m      09                        Two-digit month
     * %#m     9                         One or two-digit month
     * %B      September                 Full month name
     * %b      Sep                       Abbreviated month name
     * 
     * == Days ==            
     * %d      05                        Two-digit day of month
     * %#d     5                         One or two-digit day of month
     * %e      5                         One or two-digit day of month
     * %A      Sunday                    Full name of the day of the week
     * %a      Sun                       Abbreviated name of the day of the week
     * %w      0                         Number of the day of the week (0 = Sunday, 6 = Saturday)
     * 
     * == Hours ==           
     * %H      23                        Hours in 24-hour format (two digits)
     * %#H     3                         Hours in 24-hour integer format (one or two digits)
     * %I      11                        Hours in 12-hour format (two digits)
     * %#I     3                         Hours in 12-hour integer format (one or two digits)
     * %p      PM                        AM or PM
     * 
     * == Minutes ==         
     * %M      09                        Minutes (two digits)
     * %#M     9                         Minutes (one or two digits)
     * 
     * == Seconds ==         
     * %S      02                        Seconds (two digits)
     * %#S     2                         Seconds (one or two digits)
     * %s      1206567625723             Unix timestamp (Seconds past 1970-01-01 00:00:00)
     * 
     * == Milliseconds ==    
     * %N      008                       Milliseconds (three digits)
     * %#N     8                         Milliseconds (one to three digits)
     * 
     * == Timezone ==        
     * %O      360                       difference in minutes between local time and GMT
     * %Z      Mountain Standard Time    Name of timezone as reported by browser
     * %G      06:00                     Hours and minutes between GMT
     * 
     * == Shortcuts ==       
     * %F      2008-03-26                %Y-%m-%d
     * %T      05:06:30                  %H:%M:%S
     * %X      05:06:30                  %H:%M:%S
     * %x      03/26/08                  %m/%d/%y
     * %D      03/26/08                  %m/%d/%y
     * %#c     Wed Mar 26 15:31:00 2008  %a %b %e %H:%M:%S %Y
     * %v      3-Sep-2008                %e-%b-%Y
     * %R      15:31                     %H:%M
     * %r      03:31:00 PM               %I:%M:%S %p
     * 
     * == Characters ==      
     * %n      \n                        Newline
     * %t      \t                        Tab
     * %%      %                         Percent Symbol
     * </pre>
     * 
     * <p>Formatting shortcuts that will be translated into their longer version.
     * Be sure that format shortcuts do not refer to themselves: this will cause an infinite loop.</p>
     * 
     * <p>Format codes and format shortcuts can be redefined after the jsDate
     * module is imported.</p>
     * 
     * <p>Note that if you redefine the whole hash (object), you must supply a "matcher"
     * regex for the parser.  The default matcher is:</p>
     * 
     * <code>/()%(#?(%|[a-z]))/i</code>
     * 
     * <p>which corresponds to the Perl syntax used by default.</p>
     * 
     * <p>By customizing the matcher and format codes, nearly any strftime functionality is possible.</p>
     */
jsDate.formats.perl={codes:{
//
// 2-part regex matcher for format codes
//
// first match must be the character before the code (to account for escaping)
// second match must be the format code character(s)
//
matcher:/()%(#?(%|[a-z]))/i,
// year
Y:"FullYear",y:"ShortYear.2",
// month
m:"MonthNumber.2","#m":"MonthNumber",B:"MonthName",b:"AbbrMonthName",
// day
d:"Date.2","#d":"Date",e:"Date",A:"DayName",a:"AbbrDayName",w:"Day",
// hours
H:"Hours.2","#H":"Hours",I:"Hours12.2","#I":"Hours12",p:"AMPM",
// minutes
M:"Minutes.2","#M":"Minutes",
// seconds
S:"Seconds.2","#S":"Seconds",s:"Unix",
// milliseconds
N:"Milliseconds.3","#N":"Milliseconds",
// timezone
O:"TimezoneOffset",Z:"TimezoneName",G:"GmtOffset"},shortcuts:{
// date
F:"%Y-%m-%d",
// time
T:"%H:%M:%S",X:"%H:%M:%S",
// local format date
x:"%m/%d/%y",D:"%m/%d/%y",
// local format extended
"#c":"%a %b %e %H:%M:%S %Y",
// local format short
v:"%e-%b-%Y",R:"%H:%M",r:"%I:%M:%S %p",
// tab and newline
t:"	",n:"\n","%":"%"}},/**
     * PHP format codes and shortcuts for strftime.
     * 
     * A hash (object) of codes where each code must be an array where the first member is 
     * the name of a Date.prototype or jsDate.prototype function to call
     * and optionally a second member indicating the number to pass to addZeros()
     * 
     * <p>The following format codes are defined:</p>
     * 
     * <pre class="code">
     * Code    Result                    Description
     * === Days ===        
     * %a      Sun through Sat           An abbreviated textual representation of the day
     * %A      Sunday - Saturday         A full textual representation of the day
     * %d      01 to 31                  Two-digit day of the month (with leading zeros)
     * %e      1 to 31                   Day of the month, with a space preceding single digits.
     * %j      001 to 366                Day of the year, 3 digits with leading zeros
     * %u      1 - 7 (Mon - Sun)         ISO-8601 numeric representation of the day of the week
     * %w      0 - 6 (Sun - Sat)         Numeric representation of the day of the week
     *                                  
     * === Week ===                     
     * %U      13                        Full Week number, starting with the first Sunday as the first week
     * %V      01 through 53             ISO-8601:1988 week number, starting with the first week of the year 
     *                                   with at least 4 weekdays, with Monday being the start of the week
     * %W      46                        A numeric representation of the week of the year, 
     *                                   starting with the first Monday as the first week
     * === Month ===                    
     * %b      Jan through Dec           Abbreviated month name, based on the locale
     * %B      January - December        Full month name, based on the locale
     * %h      Jan through Dec           Abbreviated month name, based on the locale (an alias of %b)
     * %m      01 - 12 (Jan - Dec)       Two digit representation of the month
     * 
     * === Year ===                     
     * %C      19                        Two digit century (year/100, truncated to an integer)
     * %y      09 for 2009               Two digit year
     * %Y      2038                      Four digit year
     * 
     * === Time ===                     
     * %H      00 through 23             Two digit representation of the hour in 24-hour format
     * %I      01 through 12             Two digit representation of the hour in 12-hour format
     * %l      1 through 12              Hour in 12-hour format, with a space preceeding single digits
     * %M      00 through 59             Two digit representation of the minute
     * %p      AM/PM                     UPPER-CASE 'AM' or 'PM' based on the given time
     * %P      am/pm                     lower-case 'am' or 'pm' based on the given time
     * %r      09:34:17 PM               Same as %I:%M:%S %p
     * %R      00:35                     Same as %H:%M
     * %S      00 through 59             Two digit representation of the second
     * %T      21:34:17                  Same as %H:%M:%S
     * %X      03:59:16                  Preferred time representation based on locale, without the date
     * %z      -0500 or EST              Either the time zone offset from UTC or the abbreviation
     * %Z      -0500 or EST              The time zone offset/abbreviation option NOT given by %z
     * 
     * === Time and Date ===            
     * %D      02/05/09                  Same as %m/%d/%y
     * %F      2009-02-05                Same as %Y-%m-%d (commonly used in database datestamps)
     * %s      305815200                 Unix Epoch Time timestamp (same as the time() function)
     * %x      02/05/09                  Preferred date representation, without the time
     * 
     * === Miscellaneous ===            
     * %n        ---                     A newline character (\n)
     * %t        ---                     A Tab character (\t)
     * %%        ---                     A literal percentage character (%)
     * </pre>
     */
jsDate.formats.php={codes:{
//
// 2-part regex matcher for format codes
//
// first match must be the character before the code (to account for escaping)
// second match must be the format code character(s)
//
matcher:/()%((%|[a-z]))/i,
// day
a:"AbbrDayName",A:"DayName",d:"Date.2",e:"Date",j:"DayOfYear.3",u:"DayOfWeek",w:"Day",
// week
U:"FullWeekOfYear.2",V:"IsoWeek.2",W:"WeekOfYear.2",
// month
b:"AbbrMonthName",B:"MonthName",m:"MonthNumber.2",h:"AbbrMonthName",
// year
C:"Century.2",y:"ShortYear.2",Y:"FullYear",
// time
H:"Hours.2",I:"Hours12.2",l:"Hours12",p:"AMPM",P:"AmPm",M:"Minutes.2",S:"Seconds.2",s:"Unix",O:"TimezoneOffset",z:"GmtOffset",Z:"TimezoneAbbr"},shortcuts:{D:"%m/%d/%y",F:"%Y-%m-%d",T:"%H:%M:%S",X:"%H:%M:%S",x:"%m/%d/%y",R:"%H:%M",r:"%I:%M:%S %p",t:"	",n:"\n","%":"%"}},
//
// Conceptually, the logic implemented here is similar to Ken Snyder's Date Instance Methods.
// I use his idea of a set of parsers which can be regular expressions or functions,
// iterating through those, and then seeing if Date.parse() will create a date.
// The parser expressions and functions are a little different and some bugs have been
// worked out.  Also, a lot of "pre-parsing" is done to fix implementation
// variations of Date.parse() between browsers.
//
jsDate.createDate=function(date){function h1(parsable,match){var ny,nd,nm,str,m1=parseFloat(match[1]),m2=parseFloat(match[2]),m3=parseFloat(match[3]),cent=jsDate.config.defaultCentury;
// now replace 2 digit year with 4 digit year
// first number is a year
// last number is the year
return m1>31?(nd=m3,nm=m2,ny=cent+m1):(nd=m2,nm=m1,ny=cent+m3),str=nm+"/"+nd+"/"+ny,parsable.replace(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})/,str)}
// if passing in multiple arguments, try Date constructor
if(null==date)return new Date;
// If the passed value is already a date object, return it
if(date instanceof Date)return date;
// if (typeof date == 'number') return new Date(date * 1000);
// If the passed value is an integer, interpret it as a javascript timestamp
if("number"==typeof date)return new Date(date);
// Before passing strings into Date.parse(), have to normalize them for certain conditions.
// If strings are not formatted staccording to the EcmaScript spec, results from Date parse will be implementation dependent.  
// 
// For example: 
//  * FF and Opera assume 2 digit dates are pre y2k, Chome assumes <50 is pre y2k, 50+ is 21st century.  
//  * Chrome will correctly parse '1984-1-25' into localtime, FF and Opera will not parse.
//  * Both FF, Chrome and Opera will parse '1984/1/25' into localtime.
// remove leading and trailing spaces
var parsable=String(date).replace(/^\s*(.+)\s*$/g,"$1");parsable=parsable.replace(/^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,4})/,"$1/$2/$3"),parsable=parsable.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{4})/i,"$1 $2 $3");
// Now check for 'dd-mmm-yy' or 'dd/mmm/yy' and normalize years to default century.
var match=parsable.match(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i);if(match&&match.length>3){var m3=parseFloat(match[3]),ny=jsDate.config.defaultCentury+m3;ny=String(ny),
// now replace 2 digit year with 4 digit year
parsable=parsable.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i,match[1]+" "+match[2]+" "+ny)}match=parsable.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})[^0-9]/),match&&match.length>3&&(parsable=h1(parsable,match));
// Now check for '1/19/70' with nothing after and do as above
var match=parsable.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})$/);match&&match.length>3&&(parsable=h1(parsable,match));for(var pattern,ms,obj,i=0,length=jsDate.matchers.length,current=parsable;length>i;){if(ms=Date.parse(current),!isNaN(ms))return new Date(ms);if(pattern=jsDate.matchers[i],"function"==typeof pattern){if(obj=pattern.call(jsDate,current),obj instanceof Date)return obj}else current=parsable.replace(pattern[0],pattern[1]);i++}return NaN},/**
     * @static
     * Handy static utility function to return the number of days in a given month.
     * @param {Integer} year Year
     * @param {Integer} month Month (1-12)
     * @returns {Integer} Number of days in the month.
    */
//
// handy utility method Borrowed right from Ken Snyder's Date Instance Mehtods.
// 
jsDate.daysInMonth=function(year,month){return 2==month?29==new Date(year,1,29).getDate()?29:28:[undefined,31,undefined,31,30,31,30,31,31,30,31,30,31][month]},
//
// An Array of regular expressions or functions that will attempt to match the date string.
// Functions are called with scope of a jsDate instance.
//
jsDate.matchers=[
// convert dd.mmm.yyyy to mm/dd/yyyy (world date to US date).
[/(3[01]|[0-2]\d)\s*\.\s*(1[0-2]|0\d)\s*\.\s*([1-9]\d{3})/,"$2/$1/$3"],
// convert yyyy-mm-dd to mm/dd/yyyy (ISO date to US date).
[/([1-9]\d{3})\s*-\s*(1[0-2]|0\d)\s*-\s*(3[01]|[0-2]\d)/,"$2/$3/$1"],
// Handle 12 hour or 24 hour time with milliseconds am/pm and optional date part.
function(str){var match=str.match(/^(?:(.+)\s+)?([012]?\d)(?:\s*\:\s*(\d\d))?(?:\s*\:\s*(\d\d(\.\d*)?))?\s*(am|pm)?\s*$/i);
//                   opt. date      hour       opt. minute     opt. second       opt. msec   opt. am or pm
if(match){if(match[1]){var d=this.createDate(match[1]);if(isNaN(d))return}else{var d=new Date;d.setMilliseconds(0)}var hour=parseFloat(match[2]);return match[6]&&(hour="am"==match[6].toLowerCase()?12==hour?0:hour:12==hour?12:hour+12),d.setHours(hour,parseInt(match[3]||0,10),parseInt(match[4]||0,10),1e3*(parseFloat(match[5]||0)||0)),d}return str},
// Handle ISO timestamp with time zone.
function(str){var match=str.match(/^(?:(.+))[T|\s+]([012]\d)(?:\:(\d\d))(?:\:(\d\d))(?:\.\d+)([\+\-]\d\d\:\d\d)$/i);if(match){if(match[1]){var d=this.createDate(match[1]);if(isNaN(d))return}else{var d=new Date;d.setMilliseconds(0)}var hour=parseFloat(match[2]);return d.setHours(hour,parseInt(match[3],10),parseInt(match[4],10),1e3*parseFloat(match[5])),d}return str},
// Try to match ambiguous strings like 12/8/22.
// Use FF date assumption that 2 digit years are 20th century (i.e. 1900's).
// This may be redundant with pre processing of date already performed.
function(str){var match=str.match(/^([0-3]?\d)\s*[-\/.\s]{1}\s*([a-zA-Z]{3,9})\s*[-\/.\s]{1}\s*([0-3]?\d)$/);if(match){var ny,nd,nm,d=new Date,cent=jsDate.config.defaultCentury,m1=parseFloat(match[1]),m3=parseFloat(match[3]);m1>31?(nd=m3,ny=cent+m1):(nd=m1,ny=cent+m3);var nm=inArray(match[2],jsDate.regional[jsDate.regional.getLocale()].monthNamesShort);return-1==nm&&(nm=inArray(match[2],jsDate.regional[jsDate.regional.getLocale()].monthNames)),d.setFullYear(ny,nm,nd),d.setHours(0,0,0,0),d}return str}],$.jsDate=jsDate,/**
     * JavaScript printf/sprintf functions.
     * 
     * This code has been adapted from the publicly available sprintf methods
     * by Ash Searle. His original header follows:
     *
     *     This code is unrestricted: you are free to use it however you like.
     *     
     *     The functions should work as expected, performing left or right alignment,
     *     truncating strings, outputting numbers with a required precision etc.
     *
     *     For complex cases, these functions follow the Perl implementations of
     *     (s)printf, allowing arguments to be passed out-of-order, and to set the
     *     precision or length of the output based on arguments instead of fixed
     *     numbers.
     *
     *     See http://perldoc.perl.org/functions/sprintf.html for more information.
     *
     *     Implemented:
     *     - zero and space-padding
     *     - right and left-alignment,
     *     - base X prefix (binary, octal and hex)
     *     - positive number prefix
     *     - (minimum) width
     *     - precision / truncation / maximum width
     *     - out of order arguments
     *
     *     Not implemented (yet):
     *     - vector flag
     *     - size (bytes, words, long-words etc.)
     *     
     *     Will not implement:
     *     - %n or %p (no pass-by-reference in JavaScript)
     *
     *     @version 2007.04.27
     *     @author Ash Searle 
     * 
     * You can see the original work and comments on his blog:
     * http://hexmen.com/blog/2007/03/printf-sprintf/
     * http://hexmen.com/js/sprintf.js
     */
/**
      * @Modifications 2009.05.26
      * @author Chris Leonello
      * 
      * Added %p %P specifier
      * Acts like %g or %G but will not add more significant digits to the output than present in the input.
      * Example:
      * Format: '%.3p', Input: 0.012, Output: 0.012
      * Format: '%.3g', Input: 0.012, Output: 0.0120
      * Format: '%.4p', Input: 12.0, Output: 12.0
      * Format: '%.4g', Input: 12.0, Output: 12.00
      * Format: '%.4p', Input: 4.321e-5, Output: 4.321e-5
      * Format: '%.4g', Input: 4.321e-5, Output: 4.3210e-5
      * 
      * Example:
      * >>> $.jqplot.sprintf('%.2f, %d', 23.3452, 43.23)
      * "23.35, 43"
      * >>> $.jqplot.sprintf("no value: %n, decimal with thousands separator: %'d", 23.3452, 433524)
      * "no value: , decimal with thousands separator: 433,524"
      */
$.jqplot.sprintf=function(){function pad(str,len,chr,leftJustify){var padding=str.length>=len?"":Array(1+len-str.length>>>0).join(chr);return leftJustify?str+padding:padding+str}function thousand_separate(value){for(var value_str=new String(value),i=10;i>0&&value_str!=(value_str=value_str.replace(/^(\d+)(\d{3})/,"$1"+$.jqplot.sprintf.thousandsSeparator+"$2"));i--);return value_str}function justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace){var diff=minWidth-value.length;if(diff>0){var spchar=" ";htmlSpace&&(spchar="&nbsp;"),value=leftJustify||!zeroPad?pad(value,minWidth,spchar,leftJustify):value.slice(0,prefix.length)+pad("",diff,"0",!0)+value.slice(prefix.length)}return value}function formatBaseX(value,base,prefix,leftJustify,minWidth,precision,zeroPad,htmlSpace){
// Note: casts negative numbers to positive ones
var number=value>>>0;return prefix=prefix&&number&&{2:"0b",8:"0",16:"0x"}[base]||"",value=prefix+pad(number.toString(base),precision||0,"0",!1),justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace)}function formatString(value,leftJustify,minWidth,precision,zeroPad,htmlSpace){return null!=precision&&(value=value.slice(0,precision)),justify(value,"",leftJustify,minWidth,zeroPad,htmlSpace)}var a=arguments,i=0,format=a[i++];return format.replace($.jqplot.sprintf.regex,function(substring,valueIndex,flags,minWidth,_,precision,type){if("%%"==substring)return"%";for(var leftJustify=!1,positivePrefix="",zeroPad=!1,prefixBaseX=!1,htmlSpace=!1,thousandSeparation=!1,j=0;flags&&j<flags.length;j++)switch(flags.charAt(j)){case" ":positivePrefix=" ";break;case"+":positivePrefix="+";break;case"-":leftJustify=!0;break;case"0":zeroPad=!0;break;case"#":prefixBaseX=!0;break;case"&":htmlSpace=!0;break;case"'":thousandSeparation=!0}if(
// parameters may be null, undefined, empty-string or real valued
// we want to ignore null, undefined and empty-string values
minWidth=minWidth?"*"==minWidth?+a[i++]:"*"==minWidth.charAt(0)?+a[minWidth.slice(1,-1)]:+minWidth:0,0>minWidth&&(minWidth=-minWidth,leftJustify=!0),!isFinite(minWidth))throw new Error("$.jqplot.sprintf: (minimum-)width must be finite");precision=precision?"*"==precision?+a[i++]:"*"==precision.charAt(0)?+a[precision.slice(1,-1)]:+precision:"fFeE".indexOf(type)>-1?6:"d"==type?0:void 0;
// grab value using valueIndex if required?
var value=valueIndex?a[valueIndex.slice(0,-1)]:a[i++];switch(type){case"s":return null==value?"":formatString(String(value),leftJustify,minWidth,precision,zeroPad,htmlSpace);case"c":return formatString(String.fromCharCode(+value),leftJustify,minWidth,precision,zeroPad,htmlSpace);case"b":return formatBaseX(value,2,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace);case"o":return formatBaseX(value,8,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace);case"x":return formatBaseX(value,16,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace);case"X":return formatBaseX(value,16,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace).toUpperCase();case"u":return formatBaseX(value,10,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace);case"i":var number=parseInt(+value,10);if(isNaN(number))return"";var prefix=0>number?"-":positivePrefix,number_str=thousandSeparation?thousand_separate(String(Math.abs(number))):String(Math.abs(number));
//value = prefix + pad(String(Math.abs(number)), precision, '0', false);
return value=prefix+pad(number_str,precision,"0",!1),justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace);case"d":var number=Math.round(+value);if(isNaN(number))return"";var prefix=0>number?"-":positivePrefix,number_str=thousandSeparation?thousand_separate(String(Math.abs(number))):String(Math.abs(number));return value=prefix+pad(number_str,precision,"0",!1),justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace);case"e":case"E":case"f":case"F":case"g":case"G":var number=+value;if(isNaN(number))return"";var prefix=0>number?"-":positivePrefix,method=["toExponential","toFixed","toPrecision"]["efg".indexOf(type.toLowerCase())],textTransform=["toString","toUpperCase"]["eEfFgG".indexOf(type)%2],number_str=Math.abs(number)[method](precision),parts=number_str.toString().split(".");parts[0]=thousandSeparation?thousand_separate(parts[0]):parts[0],number_str=parts.join($.jqplot.sprintf.decimalMark),value=prefix+number_str;var justified=justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace)[textTransform]();return justified;case"p":case"P":
// make sure number is a number
var number=+value;if(isNaN(number))return"";var prefix=0>number?"-":positivePrefix,parts=String(Number(Math.abs(number)).toExponential()).split(/e|E/),sd=-1!=parts[0].indexOf(".")?parts[0].length-1:String(number).length,zeros=parts[1]<0?-parts[1]-1:0;if(Math.abs(number)<1)value=precision>=sd+zeros?prefix+Math.abs(number).toPrecision(sd):precision-1>=sd?prefix+Math.abs(number).toExponential(sd-1):prefix+Math.abs(number).toExponential(precision-1);else{var prec=precision>=sd?sd:precision;value=prefix+Math.abs(number).toPrecision(prec)}var textTransform=["toString","toUpperCase"]["pP".indexOf(type)%2];return justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace)[textTransform]();case"n":return"";default:return substring}})},$.jqplot.sprintf.thousandsSeparator=",",
// Specifies the decimal mark for floating point values. By default a period '.'
// is used. If you change this value to for example a comma be sure to also
// change the thousands separator or else this won't work since a simple String
// replace is used (replacing all periods with the mark specified here).
$.jqplot.sprintf.decimalMark=".",$.jqplot.sprintf.regex=/%%|%(\d+\$)?([-+#0&\' ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([nAscboxXuidfegpEGP])/g,$.jqplot.getSignificantFigures=function(number){var parts=String(Number(Math.abs(number)).toExponential()).split(/e|E/),sd=-1!=parts[0].indexOf(".")?parts[0].length-1:parts[0].length,zeros=parts[1]<0?-parts[1]-1:0,expn=parseInt(parts[1],10),dleft=expn+1>0?expn+1:0,dright=dleft>=sd?0:sd-expn-1;return{significantDigits:sd,digitsLeft:dleft,digitsRight:dright,zeros:zeros,exponent:expn}},$.jqplot.getPrecision=function(number){return $.jqplot.getSignificantFigures(number).digitsRight};var backCompat=$.uiBackCompat!==!1;$.jqplot.effects={effect:{}};
// prefix used for storing data on .data()
var dataSpace="jqplot.storage.";/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/
$.extend($.jqplot.effects,{version:"1.9pre",
// Saves a set of properties in a data storage
save:function(element,set){for(var i=0;i<set.length;i++)null!==set[i]&&element.data(dataSpace+set[i],element[0].style[set[i]])},
// Restores a set of previously saved properties from a data storage
restore:function(element,set){for(var i=0;i<set.length;i++)null!==set[i]&&element.css(set[i],element.data(dataSpace+set[i]))},setMode:function(el,mode){return"toggle"===mode&&(mode=el.is(":hidden")?"show":"hide"),mode},
// Wraps the element around a wrapper that copies position properties
createWrapper:function(element){
// if the element is already wrapped, return it
if(element.parent().is(".ui-effects-wrapper"))return element.parent();
// wrap the element
var props={width:element.outerWidth(!0),height:element.outerHeight(!0),"float":element.css("float")},wrapper=$("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),
// Store the size in case width/height are defined in % - Fixes #5245
size={width:element.width(),height:element.height()},active=document.activeElement;
// Fixes #7595 - Elements lose focus when wrapped.
//Hotfix for jQuery 1.4 since some change in wrap() seems to actually loose the reference to the wrapped element
// transfer positioning properties to the wrapper
return element.wrap(wrapper),(element[0]===active||$.contains(element[0],active))&&$(active).focus(),wrapper=element.parent(),"static"===element.css("position")?(wrapper.css({position:"relative"}),element.css({position:"relative"})):($.extend(props,{position:element.css("position"),zIndex:element.css("z-index")}),$.each(["top","left","bottom","right"],function(i,pos){props[pos]=element.css(pos),isNaN(parseInt(props[pos],10))&&(props[pos]="auto")}),element.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),element.css(size),wrapper.css(props).show()},removeWrapper:function(element){var active=document.activeElement;
// Fixes #7595 - Elements lose focus when wrapped.
return element.parent().is(".ui-effects-wrapper")&&(element.parent().replaceWith(element),(element[0]===active||$.contains(element[0],active))&&$(active).focus()),element}}),$.fn.extend({jqplotEffect:function(effect,options,speed,callback){function run(next){function done(){$.isFunction(complete)&&complete.call(elem[0]),$.isFunction(next)&&next()}var elem=$(this),complete=args.complete,mode=args.mode;
// if the element is hiddden and mode is hide,
// or element is visible and mode is show
(elem.is(":hidden")?"hide"===mode:"show"===mode)?done():effectMethod.call(elem[0],args,done)}var args=_normalizeArguments.apply(this,arguments),mode=args.mode,queue=args.queue,effectMethod=$.jqplot.effects.effect[args.effect],
// DEPRECATED: remove in 2.0 (#7115)
oldEffectMethod=!effectMethod&&backCompat&&$.jqplot.effects[args.effect];
// delegate to the original method (e.g., .show()) if possible
// TODO: remove this check in 2.0, effectMethod will always be true
return $.fx.off||!effectMethod&&!oldEffectMethod?mode?this[mode](args.duration,args.complete):this.each(function(){args.complete&&args.complete.call(this)}):effectMethod?queue===!1?this.each(run):this.queue(queue||"fx",run):oldEffectMethod.call(this,{options:args,duration:args.duration,callback:args.complete,mode:args.mode})}});var rvertical=/up|down|vertical/,rpositivemotion=/up|left|vertical|horizontal/;$.jqplot.effects.effect.blind=function(o,done){
// Create element
var wrapper,distance,top,el=$(this),props=["position","top","bottom","left","right","height","width"],mode=$.jqplot.effects.setMode(el,o.mode||"hide"),direction=o.direction||"up",vertical=rvertical.test(direction),ref=vertical?"height":"width",ref2=vertical?"top":"left",motion=rpositivemotion.test(direction),animation={},show="show"===mode;
// // if already wrapped, the wrapper's properties are my property. #6245
el.parent().is(".ui-effects-wrapper")?$.jqplot.effects.save(el.parent(),props):$.jqplot.effects.save(el,props),el.show(),top=parseInt(el.css("top"),10),wrapper=$.jqplot.effects.createWrapper(el).css({overflow:"hidden"}),distance=vertical?wrapper[ref]()+top:wrapper[ref](),animation[ref]=show?String(distance):"0",motion||(el.css(vertical?"bottom":"right",0).css(vertical?"top":"left","").css({position:"absolute"}),animation[ref2]=show?"0":String(distance)),show&&(wrapper.css(ref,0),motion||wrapper.css(ref2,distance)),wrapper.animate(animation,{duration:o.duration,easing:o.easing,queue:!1,complete:function(){"hide"===mode&&el.hide(),$.jqplot.effects.restore(el,props),$.jqplot.effects.removeWrapper(el),done()}})}}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
function($){
// called with scope of series
function barPreInit(target,data,seriesDefaults,options){if("horizontal"==this.rendererOptions.barDirection&&(this._stackAxis="x",this._primaryAxis="_yaxis"),1==this.rendererOptions.waterfall){this._data=$.extend(!0,[],this.data);for(var sum=0,pos=this.rendererOptions.barDirection&&"vertical"!==this.rendererOptions.barDirection&&this.transposedData!==!1?0:1,i=0;i<this.data.length;i++)sum+=this.data[i][pos],i>0&&(this.data[i][pos]+=this.data[i-1][pos]);this.data[this.data.length]=1==pos?[this.data.length+1,sum]:[sum,this.data.length+1],this._data[this._data.length]=1==pos?[this._data.length+1,sum]:[sum,this._data.length+1]}if(this.rendererOptions.groups>1){this.breakOnNull=!0;for(var l=this.data.length,skip=parseInt(l/this.rendererOptions.groups,10),count=0,i=skip;l>i;i+=skip)this.data.splice(i+count,0,[null,null]),this._plotData.splice(i+count,0,[null,null]),this._stackData.splice(i+count,0,[null,null]),count++;for(i=0;i<this.data.length;i++)"_xaxis"==this._primaryAxis?(this.data[i][0]=i+1,this._plotData[i][0]=i+1,this._stackData[i][0]=i+1):(this.data[i][1]=i+1,this._plotData[i][1]=i+1,this._stackData[i][1]=i+1)}}function getStart(sidx,didx,comp,plot,axis){
// check if sign change
var start,prevVal,seriesIndex=sidx,prevSeriesIndex=sidx-1,aidx="x"===axis?0:1;
// is this not the first series?
// is there a sign change
return seriesIndex>0?(prevVal=plot.series[prevSeriesIndex]._plotData[didx][aidx],start=0>comp*prevVal?getStart(prevSeriesIndex,didx,comp,plot,axis):plot.series[prevSeriesIndex].gridData[didx][aidx]):start=0===aidx?plot.series[seriesIndex]._xaxis.series_u2p(0):plot.series[seriesIndex]._yaxis.series_u2p(0),start}function postInit(target,data,options){for(var i=0;i<this.series.length;i++)this.series[i].renderer.constructor==$.jqplot.BarRenderer&&this.series[i].highlightMouseOver&&(this.series[i].highlightMouseDown=!1)}
// called within context of plot
// create a canvas which we can draw on.
// insert it before the eventCanvas, so eventCanvas will still capture events.
function postPlotDraw(){
// Memory Leaks patch    
this.plugins.barRenderer&&this.plugins.barRenderer.highlightCanvas&&(this.plugins.barRenderer.highlightCanvas.resetCanvas(),this.plugins.barRenderer.highlightCanvas=null),this.plugins.barRenderer={highlightedSeriesIndex:null},this.plugins.barRenderer.highlightCanvas=new $.jqplot.GenericCanvas,this.eventCanvas._elem.before(this.plugins.barRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-barRenderer-highlight-canvas",this._plotDimensions,this)),this.plugins.barRenderer.highlightCanvas.setContext(),this.eventCanvas._elem.bind("mouseleave",{plot:this},function(ev){unhighlight(ev.data.plot)})}function highlight(plot,sidx,pidx,points){var s=plot.series[sidx],canvas=plot.plugins.barRenderer.highlightCanvas;canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width,canvas._ctx.canvas.height),s._highlightedPoint=pidx,plot.plugins.barRenderer.highlightedSeriesIndex=sidx;var opts={fillStyle:s.highlightColors[pidx]};s.renderer.shapeRenderer.draw(canvas._ctx,points,opts),canvas=null}function unhighlight(plot){var canvas=plot.plugins.barRenderer.highlightCanvas;canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width,canvas._ctx.canvas.height);for(var i=0;i<plot.series.length;i++)plot.series[i]._highlightedPoint=null;plot.plugins.barRenderer.highlightedSeriesIndex=null,plot.target.trigger("jqplotDataUnhighlight"),canvas=null}function handleMove(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data],evt1=jQuery.Event("jqplotDataMouseOver");if(evt1.pageX=ev.pageX,evt1.pageY=ev.pageY,plot.target.trigger(evt1,ins),plot.series[ins[0]].show&&plot.series[ins[0]].highlightMouseOver&&(ins[0]!=plot.plugins.barRenderer.highlightedSeriesIndex||ins[1]!=plot.series[ins[0]]._highlightedPoint)){var evt=jQuery.Event("jqplotDataHighlight");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY,plot.target.trigger(evt,ins),highlight(plot,neighbor.seriesIndex,neighbor.pointIndex,neighbor.points)}}else null==neighbor&&unhighlight(plot)}function handleMouseDown(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data];if(plot.series[ins[0]].highlightMouseDown&&(ins[0]!=plot.plugins.barRenderer.highlightedSeriesIndex||ins[1]!=plot.series[ins[0]]._highlightedPoint)){var evt=jQuery.Event("jqplotDataHighlight");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY,plot.target.trigger(evt,ins),highlight(plot,neighbor.seriesIndex,neighbor.pointIndex,neighbor.points)}}else null==neighbor&&unhighlight(plot)}function handleMouseUp(ev,gridpos,datapos,neighbor,plot){var idx=plot.plugins.barRenderer.highlightedSeriesIndex;null!=idx&&plot.series[idx].highlightMouseDown&&unhighlight(plot)}function handleClick(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data],evt=jQuery.Event("jqplotDataClick");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY,plot.target.trigger(evt,ins)}}function handleRightClick(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data],idx=plot.plugins.barRenderer.highlightedSeriesIndex;null!=idx&&plot.series[idx].highlightMouseDown&&unhighlight(plot);var evt=jQuery.Event("jqplotDataRightClick");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY,plot.target.trigger(evt,ins)}}
// Class: $.jqplot.BarRenderer
// A plugin renderer for jqPlot to draw a bar plot.
// Draws series as a line.
$.jqplot.BarRenderer=function(){$.jqplot.LineRenderer.call(this)},$.jqplot.BarRenderer.prototype=new $.jqplot.LineRenderer,$.jqplot.BarRenderer.prototype.constructor=$.jqplot.BarRenderer,
// called with scope of series.
$.jqplot.BarRenderer.prototype.init=function(options,plot){
// Group: Properties
//
// prop: barPadding
// Number of pixels between adjacent bars at the same axis value.
this.barPadding=8,
// prop: barMargin
// Number of pixels between groups of bars at adjacent axis values.
this.barMargin=10,
// prop: barDirection
// 'vertical' = up and down bars, 'horizontal' = side to side bars
this.barDirection="vertical",
// prop: barWidth
// Width of the bar in pixels (auto by devaul).  null = calculated automatically.
this.barWidth=null,
// prop: shadowOffset
// offset of the shadow from the slice and offset of 
// each succesive stroke of the shadow from the last.
this.shadowOffset=2,
// prop: shadowDepth
// number of strokes to apply to the shadow, 
// each stroke offset shadowOffset from the last.
this.shadowDepth=5,
// prop: shadowAlpha
// transparency of the shadow (0 = transparent, 1 = opaque)
this.shadowAlpha=.08,
// prop: waterfall
// true to enable waterfall plot.
this.waterfall=!1,
// prop: groups
// group bars into this many groups
this.groups=1,
// prop: varyBarColor
// true to color each bar of a series separately rather than
// have every bar of a given series the same color.
// If used for non-stacked multiple series bar plots, user should
// specify a separate 'seriesColors' array for each series.
// Otherwise, each series will set their bars to the same color array.
// This option has no Effect for stacked bar charts and is disabled.
this.varyBarColor=!1,
// prop: highlightMouseOver
// True to highlight slice when moused over.
// This must be false to enable highlightMouseDown to highlight when clicking on a slice.
this.highlightMouseOver=!0,
// prop: highlightMouseDown
// True to highlight when a mouse button is pressed over a slice.
// This will be disabled if highlightMouseOver is true.
this.highlightMouseDown=!1,
// prop: highlightColors
// an array of colors to use when highlighting a bar.
this.highlightColors=[],
// prop: transposedData
// NOT IMPLEMENTED YET.  True if this is a horizontal bar plot and 
// x and y values are "transposed".  Tranposed, or "swapped", data is 
// required prior to rev. 894 builds of jqPlot with horizontal bars. 
// Allows backward compatability of bar renderer horizontal bars with 
// old style data sets.
this.transposedData=!0,this.renderer.animation={show:!1,direction:"down",speed:3e3,_supported:!0},this._type="bar",
// if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
options.highlightMouseDown&&null==options.highlightMouseOver&&(options.highlightMouseOver=!1),
//////
// This is probably wrong here.
// After going back and forth on whether renderer should be the thing
// or extend the thing, it seems that it it best if it is a property
// on the thing.  This should be something that is commonized 
// among series renderers in the future.
//////
$.extend(!0,this,options),
// really should probably do this
$.extend(!0,this.renderer,options),
// fill is still needed to properly draw the legend.
// bars have to be filled.
this.fill=!0,
// if horizontal bar and animating, reset the default direction
"horizontal"===this.barDirection&&this.rendererOptions.animation&&null==this.rendererOptions.animation.direction&&(this.renderer.animation.direction="left"),this.waterfall&&(this.fillToZero=!1,this.disableStack=!0),"vertical"==this.barDirection?(this._primaryAxis="_xaxis",this._stackAxis="y",this.fillAxis="y"):(this._primaryAxis="_yaxis",this._stackAxis="x",this.fillAxis="x"),
// index of the currenty highlighted point, if any
this._highlightedPoint=null,
// total number of values for all bar series, total number of bar series, and position of this series
this._plotSeriesInfo=null,
// Array of actual data colors used for each data point.
this._dataColors=[],this._barPoints=[];
// set the shape renderer options
var opts={lineJoin:"miter",lineCap:"round",fill:!0,isarc:!1,strokeStyle:this.color,fillStyle:this.color,closePath:this.fill};this.renderer.shapeRenderer.init(opts);
// set the shadow renderer options
var sopts={lineJoin:"miter",lineCap:"round",fill:!0,isarc:!1,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,closePath:this.fill};this.renderer.shadowRenderer.init(sopts),plot.postInitHooks.addOnce(postInit),plot.postDrawHooks.addOnce(postPlotDraw),plot.eventListenerHooks.addOnce("jqplotMouseMove",handleMove),plot.eventListenerHooks.addOnce("jqplotMouseDown",handleMouseDown),plot.eventListenerHooks.addOnce("jqplotMouseUp",handleMouseUp),plot.eventListenerHooks.addOnce("jqplotClick",handleClick),plot.eventListenerHooks.addOnce("jqplotRightClick",handleRightClick)},$.jqplot.preSeriesInitHooks.push(barPreInit),
// needs to be called with scope of series, not renderer.
$.jqplot.BarRenderer.prototype.calcSeriesNumbers=function(){
// loop through all series on this axis
for(var series,pos,nvals=0,nseries=0,paxis=this[this._primaryAxis],i=0;i<paxis._series.length;i++)series=paxis._series[i],series===this&&(pos=i),series.renderer.constructor==$.jqplot.BarRenderer&&(nvals+=series.data.length,nseries+=1);
// return total number of values for all bar series, total number of bar series, and position of this series
return[nvals,nseries,pos]},$.jqplot.BarRenderer.prototype.setBarWidth=function(){
// need to know how many data values we have on the approprate axis and figure it out.
var nvals=0,nseries=0,paxis=this[this._primaryAxis],temp=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);nvals=temp[0],nseries=temp[1];var nticks=paxis.numberTicks,nbins=(nticks-1)/2;
// so, now we have total number of axis values.
return"xaxis"==paxis.name||"x2axis"==paxis.name?this._stack?this.barWidth=(paxis._offsets.max-paxis._offsets.min)/nvals*nseries-this.barMargin:this.barWidth=((paxis._offsets.max-paxis._offsets.min)/nbins-this.barPadding*(nseries-1)-2*this.barMargin)/nseries:this._stack?this.barWidth=(paxis._offsets.min-paxis._offsets.max)/nvals*nseries-this.barMargin:this.barWidth=((paxis._offsets.min-paxis._offsets.max)/nbins-this.barPadding*(nseries-1)-2*this.barMargin)/nseries,[nvals,nseries]},$.jqplot.BarRenderer.prototype.draw=function(ctx,gridData,options,plot){var i,opts=$.extend({},options),shadow=void 0!=opts.shadow?opts.shadow:this.shadow,showLine=void 0!=opts.showLine?opts.showLine:this.showLine;void 0!=opts.fill?opts.fill:this.fill,this.xaxis,this.yaxis,this._xaxis.series_u2p,this._yaxis.series_u2p;
// clear out data colors.
this._dataColors=[],this._barPoints=[],null==this.barWidth&&this.renderer.setBarWidth.call(this);var temp=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this),nseries=(temp[0],temp[1]),pos=temp[2],points=[];if(this._stack?this._barNudge=0:this._barNudge=(-Math.abs(nseries/2-.5)+pos)*(this.barWidth+this.barPadding),showLine){var negativeColors=new $.jqplot.ColorGenerator(this.negativeSeriesColors),positiveColors=new $.jqplot.ColorGenerator(this.seriesColors),negativeColor=negativeColors.get(this.index);this.useNegativeColors||(negativeColor=opts.fillStyle);var base,xstart,ystart,positiveColor=opts.fillStyle;if("vertical"==this.barDirection){for(var i=0;i<gridData.length;i++)if(this._stack||null!=this.data[i][1]){
// now draw the shadows if not stacked.
// for stacked plots, they are predrawn by drawShadow
if(points=[],base=gridData[i][0]+this._barNudge,ystart=this._stack&&this._prevGridData.length?getStart(this.index,i,this._plotData[i][1],plot,"y"):this.fillToZero?this._yaxis.series_u2p(0):this.waterfall&&i>0&&i<this.gridData.length-1?this.gridData[i-1][1]:this.waterfall&&0==i&&i<this.gridData.length-1?this._yaxis.min<=0&&this._yaxis.max>=0?this._yaxis.series_u2p(0):this._yaxis.min>0?ctx.canvas.height:0:this.waterfall&&i==this.gridData.length-1?this._yaxis.min<=0&&this._yaxis.max>=0?this._yaxis.series_u2p(0):this._yaxis.min>0?ctx.canvas.height:0:ctx.canvas.height,this.fillToZero&&this._plotData[i][1]<0||this.waterfall&&this._data[i][1]<0?this.varyBarColor&&!this._stack?this.useNegativeColors?opts.fillStyle=negativeColors.next():opts.fillStyle=positiveColors.next():opts.fillStyle=negativeColor:this.varyBarColor&&!this._stack?opts.fillStyle=positiveColors.next():opts.fillStyle=positiveColor,!this.fillToZero||this._plotData[i][1]>=0?(points.push([base-this.barWidth/2,ystart]),points.push([base-this.barWidth/2,gridData[i][1]]),points.push([base+this.barWidth/2,gridData[i][1]]),points.push([base+this.barWidth/2,ystart])):(points.push([base-this.barWidth/2,gridData[i][1]]),points.push([base-this.barWidth/2,ystart]),points.push([base+this.barWidth/2,ystart]),points.push([base+this.barWidth/2,gridData[i][1]])),this._barPoints.push(points),shadow&&!this._stack){var sopts=$.extend(!0,{},opts);
// need to get rid of fillStyle on shadow.
delete sopts.fillStyle,this.renderer.shadowRenderer.draw(ctx,points,sopts)}var clr=opts.fillStyle||this.color;this._dataColors.push(clr),this.renderer.shapeRenderer.draw(ctx,points,opts)}}else if("horizontal"==this.barDirection)for(var i=0;i<gridData.length;i++)if(this._stack||null!=this.data[i][0]){
// now draw the shadows if not stacked.
// for stacked plots, they are predrawn by drawShadow
if(points=[],base=gridData[i][1]-this._barNudge,xstart=this._stack&&this._prevGridData.length?getStart(this.index,i,this._plotData[i][0],plot,"x"):this.fillToZero?this._xaxis.series_u2p(0):this.waterfall&&i>0&&i<this.gridData.length-1?this.gridData[i-1][0]:this.waterfall&&0==i&&i<this.gridData.length-1?this._xaxis.min<=0&&this._xaxis.max>=0?this._xaxis.series_u2p(0):(this._xaxis.min>0,0):this.waterfall&&i==this.gridData.length-1?this._xaxis.min<=0&&this._xaxis.max>=0?this._xaxis.series_u2p(0):this._xaxis.min>0?0:ctx.canvas.width:0,this.fillToZero&&this._plotData[i][0]<0||this.waterfall&&this._data[i][0]<0?this.varyBarColor&&!this._stack?this.useNegativeColors?opts.fillStyle=negativeColors.next():opts.fillStyle=positiveColors.next():opts.fillStyle=negativeColor:this.varyBarColor&&!this._stack?opts.fillStyle=positiveColors.next():opts.fillStyle=positiveColor,!this.fillToZero||this._plotData[i][0]>=0?(points.push([xstart,base+this.barWidth/2]),points.push([xstart,base-this.barWidth/2]),points.push([gridData[i][0],base-this.barWidth/2]),points.push([gridData[i][0],base+this.barWidth/2])):(points.push([gridData[i][0],base+this.barWidth/2]),points.push([gridData[i][0],base-this.barWidth/2]),points.push([xstart,base-this.barWidth/2]),points.push([xstart,base+this.barWidth/2])),this._barPoints.push(points),shadow&&!this._stack){var sopts=$.extend(!0,{},opts);delete sopts.fillStyle,this.renderer.shadowRenderer.draw(ctx,points,sopts)}var clr=opts.fillStyle||this.color;this._dataColors.push(clr),this.renderer.shapeRenderer.draw(ctx,points,opts)}}if(0==this.highlightColors.length)this.highlightColors=$.jqplot.computeHighlightColors(this._dataColors);else if("string"==typeof this.highlightColors){var temp=this.highlightColors;this.highlightColors=[];for(var i=0;i<this._dataColors.length;i++)this.highlightColors.push(temp)}},
// for stacked plots, shadows will be pre drawn by drawShadow.
$.jqplot.BarRenderer.prototype.drawShadow=function(ctx,gridData,options,plot){var i,points,nvals,nseries,pos,opts=void 0!=options?options:{},showLine=(void 0!=opts.shadow?opts.shadow:this.shadow,void 0!=opts.showLine?opts.showLine:this.showLine);void 0!=opts.fill?opts.fill:this.fill,this.xaxis,this.yaxis,this._xaxis.series_u2p,this._yaxis.series_u2p;if(this._stack&&this.shadow){null==this.barWidth&&this.renderer.setBarWidth.call(this);var temp=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);if(nvals=temp[0],nseries=temp[1],pos=temp[2],this._stack?this._barNudge=0:this._barNudge=(-Math.abs(nseries/2-.5)+pos)*(this.barWidth+this.barPadding),showLine)if("vertical"==this.barDirection){for(var i=0;i<gridData.length;i++)if(null!=this.data[i][1]){points=[];var ystart,base=gridData[i][0]+this._barNudge;ystart=this._stack&&this._prevGridData.length?getStart(this.index,i,this._plotData[i][1],plot,"y"):this.fillToZero?this._yaxis.series_u2p(0):ctx.canvas.height,points.push([base-this.barWidth/2,ystart]),points.push([base-this.barWidth/2,gridData[i][1]]),points.push([base+this.barWidth/2,gridData[i][1]]),points.push([base+this.barWidth/2,ystart]),this.renderer.shadowRenderer.draw(ctx,points,opts)}}else if("horizontal"==this.barDirection)for(var i=0;i<gridData.length;i++)if(null!=this.data[i][0]){points=[];var xstart,base=gridData[i][1]-this._barNudge;xstart=this._stack&&this._prevGridData.length?getStart(this.index,i,this._plotData[i][0],plot,"x"):this.fillToZero?this._xaxis.series_u2p(0):0,points.push([xstart,base+this.barWidth/2]),points.push([gridData[i][0],base+this.barWidth/2]),points.push([gridData[i][0],base-this.barWidth/2]),points.push([xstart,base-this.barWidth/2]),this.renderer.shadowRenderer.draw(ctx,points,opts)}}}}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
function($){function updateTooltip(gridpos,datapos,plot){var c=plot.plugins.cursor,s="",addbr=!1;if(c.showTooltipGridPosition&&(s=gridpos.x+", "+gridpos.y,addbr=!0),c.showTooltipUnitPosition)for(var g,i=0;i<c.tooltipAxisGroups.length;i++){if(g=c.tooltipAxisGroups[i],addbr&&(s+="<br />"),c.useAxesFormatters)for(var j=0;j<g.length;j++){j&&(s+=", ");var af=plot.axes[g[j]]._ticks[0].formatter,afstr=plot.axes[g[j]]._ticks[0].formatString;s+=af(afstr,datapos[g[j]])}else s+=$.jqplot.sprintf(c.tooltipFormatString,datapos[g[0]],datapos[g[1]]);addbr=!0}if(c.showTooltipDataPosition)for(var series=plot.series,ret=getIntersectingPoints(plot,gridpos.x,gridpos.y),addbr=!1,i=0;i<series.length;i++)if(series[i].show){var idx=series[i].index,label=series[i].label.toString(),cellid=$.inArray(idx,ret.indices),sx=void 0,sy=void 0;if(-1!=cellid){var data=ret.data[cellid].data;if(c.useAxesFormatters){var xf=series[i]._xaxis._ticks[0].formatter,yf=series[i]._yaxis._ticks[0].formatter,xfstr=series[i]._xaxis._ticks[0].formatString,yfstr=series[i]._yaxis._ticks[0].formatString;sx=xf(xfstr,data[0]),sy=yf(yfstr,data[1])}else sx=data[0],sy=data[1];addbr&&(s+="<br />"),s+=$.jqplot.sprintf(c.tooltipFormatString,label,sx,sy),addbr=!0}}c._tooltipElem.html(s)}function moveLine(gridpos,plot){var c=plot.plugins.cursor,ctx=c.cursorCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),c.showVerticalLine&&c.shapeRenderer.draw(ctx,[[gridpos.x,0],[gridpos.x,ctx.canvas.height]]),c.showHorizontalLine&&c.shapeRenderer.draw(ctx,[[0,gridpos.y],[ctx.canvas.width,gridpos.y]]);var ret=getIntersectingPoints(plot,gridpos.x,gridpos.y);if(c.showCursorLegend)for(var cells=$(plot.targetId+" td.jqplot-cursor-legend-label"),i=0;i<cells.length;i++){var idx=$(cells[i]).data("seriesIndex"),series=plot.series[idx],label=series.label.toString(),cellid=$.inArray(idx,ret.indices),sx=void 0,sy=void 0;if(-1!=cellid){var data=ret.data[cellid].data;if(c.useAxesFormatters){var xf=series._xaxis._ticks[0].formatter,yf=series._yaxis._ticks[0].formatter,xfstr=series._xaxis._ticks[0].formatString,yfstr=series._yaxis._ticks[0].formatString;sx=xf(xfstr,data[0]),sy=yf(yfstr,data[1])}else sx=data[0],sy=data[1]}plot.legend.escapeHtml?$(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString,label,sx,sy)):$(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString,label,sx,sy))}ctx=null}function getIntersectingPoints(plot,x,y){for(var s,i,j,r,p,threshold,ret={indices:[],data:[]},c=plot.plugins.cursor,i=0;i<plot.series.length;i++)if(s=plot.series[i],r=s.renderer,s.show){threshold=c.intersectionThreshold,s.showMarker&&(threshold+=s.markerRenderer.size/2);for(var j=0;j<s.gridData.length;j++)p=s.gridData[j],c.showVerticalLine&&Math.abs(x-p[0])<=threshold&&(ret.indices.push(i),ret.data.push({seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}))}return ret}function moveTooltip(gridpos,plot){var c=plot.plugins.cursor,elem=c._tooltipElem;switch(c.tooltipLocation){case"nw":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)-c.tooltipOffset,y=gridpos.y+plot._gridPadding.top-c.tooltipOffset-elem.outerHeight(!0);break;case"n":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)/2,y=gridpos.y+plot._gridPadding.top-c.tooltipOffset-elem.outerHeight(!0);break;case"ne":var x=gridpos.x+plot._gridPadding.left+c.tooltipOffset,y=gridpos.y+plot._gridPadding.top-c.tooltipOffset-elem.outerHeight(!0);break;case"e":var x=gridpos.x+plot._gridPadding.left+c.tooltipOffset,y=gridpos.y+plot._gridPadding.top-elem.outerHeight(!0)/2;break;case"se":var x=gridpos.x+plot._gridPadding.left+c.tooltipOffset,y=gridpos.y+plot._gridPadding.top+c.tooltipOffset;break;case"s":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)/2,y=gridpos.y+plot._gridPadding.top+c.tooltipOffset;break;case"sw":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)-c.tooltipOffset,y=gridpos.y+plot._gridPadding.top+c.tooltipOffset;break;case"w":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)-c.tooltipOffset,y=gridpos.y+plot._gridPadding.top-elem.outerHeight(!0)/2;break;default:var x=gridpos.x+plot._gridPadding.left+c.tooltipOffset,y=gridpos.y+plot._gridPadding.top+c.tooltipOffset}elem.css("left",x),elem.css("top",y),elem=null}function positionTooltip(plot){
// fake a grid for positioning
var grid=plot._gridPadding,c=plot.plugins.cursor,elem=c._tooltipElem;switch(c.tooltipLocation){case"nw":var a=grid.left+c.tooltipOffset,b=grid.top+c.tooltipOffset;elem.css("left",a),elem.css("top",b);break;case"n":var a=(grid.left+(plot._plotDimensions.width-grid.right))/2-elem.outerWidth(!0)/2,b=grid.top+c.tooltipOffset;elem.css("left",a),elem.css("top",b);break;case"ne":var a=grid.right+c.tooltipOffset,b=grid.top+c.tooltipOffset;elem.css({right:a,top:b});break;case"e":var a=grid.right+c.tooltipOffset,b=(grid.top+(plot._plotDimensions.height-grid.bottom))/2-elem.outerHeight(!0)/2;elem.css({right:a,top:b});break;case"se":var a=grid.right+c.tooltipOffset,b=grid.bottom+c.tooltipOffset;elem.css({right:a,bottom:b});break;case"s":var a=(grid.left+(plot._plotDimensions.width-grid.right))/2-elem.outerWidth(!0)/2,b=grid.bottom+c.tooltipOffset;elem.css({left:a,bottom:b});break;case"sw":var a=grid.left+c.tooltipOffset,b=grid.bottom+c.tooltipOffset;elem.css({left:a,bottom:b});break;case"w":var a=grid.left+c.tooltipOffset,b=(grid.top+(plot._plotDimensions.height-grid.bottom))/2-elem.outerHeight(!0)/2;elem.css({left:a,top:b});break;default:// same as 'se'
var a=grid.right-c.tooltipOffset,b=grid.bottom+c.tooltipOffset;elem.css({right:a,bottom:b})}elem=null}function handleClick(ev,gridpos,datapos,neighbor,plot){ev.preventDefault(),ev.stopImmediatePropagation();var c=plot.plugins.cursor;c.clickReset&&c.resetZoom(plot,c);var sel=window.getSelection;return document.selection&&document.selection.empty?document.selection.empty():sel&&!sel().isCollapsed&&sel().collapse(),!1}function handleDblClick(ev,gridpos,datapos,neighbor,plot){ev.preventDefault(),ev.stopImmediatePropagation();var c=plot.plugins.cursor;c.dblClickReset&&c.resetZoom(plot,c);var sel=window.getSelection;return document.selection&&document.selection.empty?document.selection.empty():sel&&!sel().isCollapsed&&sel().collapse(),!1}function handleMouseLeave(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;if(c.onGrid=!1,c.show){if($(ev.target).css("cursor",c.previousCursor),!c.showTooltip||c._zoom.zooming&&c.showTooltipOutsideZoom&&!c.constrainOutsideZoom||(c._tooltipElem.empty(),c._tooltipElem.hide()),c.zoom&&(c._zoom.gridpos=gridpos,c._zoom.datapos=datapos),c.showVerticalLine||c.showHorizontalLine){var ctx=c.cursorCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),ctx=null}if(c.showCursorLegend)for(var cells=$(plot.targetId+" td.jqplot-cursor-legend-label"),i=0;i<cells.length;i++){var idx=$(cells[i]).data("seriesIndex"),series=plot.series[idx],label=series.label.toString();plot.legend.escapeHtml?$(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString,label,void 0,void 0)):$(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString,label,void 0,void 0))}}}function handleMouseEnter(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;c.onGrid=!0,c.show&&(c.previousCursor=ev.target.style.cursor,ev.target.style.cursor=c.style,c.showTooltip&&(updateTooltip(gridpos,datapos,plot),c.followMouse?moveTooltip(gridpos,plot):positionTooltip(plot),c._tooltipElem.show()),(c.showVerticalLine||c.showHorizontalLine)&&moveLine(gridpos,plot))}function handleMouseMove(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;c.show&&(c.showTooltip&&(updateTooltip(gridpos,datapos,plot),c.followMouse&&moveTooltip(gridpos,plot)),(c.showVerticalLine||c.showHorizontalLine)&&moveLine(gridpos,plot))}function getEventPosition(ev){var n,axis,plot=ev.data.plot,go=plot.eventCanvas._elem.offset(),gridPos={x:ev.pageX-go.left,y:ev.pageY-go.top},dataPos={xaxis:null,yaxis:null,x2axis:null,y2axis:null,y3axis:null,y4axis:null,y5axis:null,y6axis:null,y7axis:null,y8axis:null,y9axis:null,yMidAxis:null},an=["xaxis","yaxis","x2axis","y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis","yMidAxis"],ax=plot.axes;for(n=11;n>0;n--)axis=an[n-1],ax[axis].show&&(dataPos[axis]=ax[axis].series_p2u(gridPos[axis.charAt(0)]));return{offsets:go,gridPos:gridPos,dataPos:dataPos}}function handleZoomMove(ev){var plot=ev.data.plot,c=plot.plugins.cursor;
// don't do anything if not on grid.
if(c.show&&c.zoom&&c._zoom.started&&!c.zoomTarget){ev.preventDefault();var ctx=c.zoomCanvas._ctx,positions=getEventPosition(ev),gridpos=positions.gridPos,datapos=positions.dataPos;c._zoom.gridpos=gridpos,c._zoom.datapos=datapos,c._zoom.zooming=!0;var xpos=gridpos.x,ypos=gridpos.y,height=ctx.canvas.height,width=ctx.canvas.width;c.showTooltip&&!c.onGrid&&c.showTooltipOutsideZoom&&(updateTooltip(gridpos,datapos,plot),c.followMouse&&moveTooltip(gridpos,plot)),"x"==c.constrainZoomTo?c._zoom.end=[xpos,height]:"y"==c.constrainZoomTo?c._zoom.end=[width,ypos]:c._zoom.end=[xpos,ypos];var sel=window.getSelection;document.selection&&document.selection.empty?document.selection.empty():sel&&!sel().isCollapsed&&sel().collapse(),drawZoomBox.call(c),ctx=null}}function handleMouseDown(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;plot.plugins.mobile?$(document).one("vmouseup.jqplot_cursor",{plot:plot},handleMouseUp):$(document).one("mouseup.jqplot_cursor",{plot:plot},handleMouseUp);plot.axes;if(void 0!=document.onselectstart&&(c._oldHandlers.onselectstart=document.onselectstart,document.onselectstart=function(){return!1}),void 0!=document.ondrag&&(c._oldHandlers.ondrag=document.ondrag,document.ondrag=function(){return!1}),void 0!=document.onmousedown&&(c._oldHandlers.onmousedown=document.onmousedown,document.onmousedown=function(){return!1}),c.zoom){if(!c.zoomProxy){var ctx=c.zoomCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),ctx=null}"x"==c.constrainZoomTo?c._zoom.start=[gridpos.x,0]:"y"==c.constrainZoomTo?c._zoom.start=[0,gridpos.y]:c._zoom.start=[gridpos.x,gridpos.y],c._zoom.started=!0;for(var ax in datapos)
// get zoom starting position.
c._zoom.axes.start[ax]=datapos[ax];plot.plugins.mobile?$(document).bind("vmousemove.jqplotCursor",{plot:plot},handleZoomMove):$(document).bind("mousemove.jqplotCursor",{plot:plot},handleZoomMove)}}function handleMouseUp(ev){var plot=ev.data.plot,c=plot.plugins.cursor;if(c.zoom&&c._zoom.zooming&&!c.zoomTarget){var xpos=c._zoom.gridpos.x,ypos=c._zoom.gridpos.y,datapos=c._zoom.datapos,height=c.zoomCanvas._ctx.canvas.height,width=c.zoomCanvas._ctx.canvas.width,axes=plot.axes;if(c.constrainOutsideZoom&&!c.onGrid){0>xpos?xpos=0:xpos>width&&(xpos=width),0>ypos?ypos=0:ypos>height&&(ypos=height);for(var axis in datapos)datapos[axis]&&("x"==axis.charAt(0)?datapos[axis]=axes[axis].series_p2u(xpos):datapos[axis]=axes[axis].series_p2u(ypos))}"x"==c.constrainZoomTo?ypos=height:"y"==c.constrainZoomTo&&(xpos=width),c._zoom.end=[xpos,ypos],c._zoom.gridpos={x:xpos,y:ypos},c.doZoom(c._zoom.gridpos,datapos,plot,c)}c._zoom.started=!1,c._zoom.zooming=!1,$(document).unbind("mousemove.jqplotCursor",handleZoomMove),void 0!=document.onselectstart&&null!=c._oldHandlers.onselectstart&&(document.onselectstart=c._oldHandlers.onselectstart,c._oldHandlers.onselectstart=null),void 0!=document.ondrag&&null!=c._oldHandlers.ondrag&&(document.ondrag=c._oldHandlers.ondrag,c._oldHandlers.ondrag=null),void 0!=document.onmousedown&&null!=c._oldHandlers.onmousedown&&(document.onmousedown=c._oldHandlers.onmousedown,c._oldHandlers.onmousedown=null)}function drawZoomBox(){var l,t,h,w,start=this._zoom.start,end=this._zoom.end,ctx=this.zoomCanvas._ctx;end[0]>start[0]?(l=start[0],w=end[0]-start[0]):(l=end[0],w=start[0]-end[0]),end[1]>start[1]?(t=start[1],h=end[1]-start[1]):(t=end[1],h=start[1]-end[1]),ctx.fillStyle="rgba(0,0,0,0.2)",ctx.strokeStyle="#999999",ctx.lineWidth=1,ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height),ctx.clearRect(l,t,w,h),
// IE won't show transparent fill rect, so stroke a rect also.
ctx.strokeRect(l,t,w,h),ctx=null}/**
     * Class: $.jqplot.Cursor
     * Plugin class representing the cursor as displayed on the plot.
     */
$.jqplot.Cursor=function(options){
// Group: Properties
//
// prop: style
// CSS spec for cursor style
this.style="crosshair",this.previousCursor="auto",
// prop: show
// whether to show the cursor or not.
this.show=$.jqplot.config.enablePlugins,
// prop: showTooltip
// show a cursor position tooltip.  Location of the tooltip
// will be controlled by followMouse and tooltipLocation.
this.showTooltip=!0,
// prop: followMouse
// Tooltip follows the mouse, it is not at a fixed location.
// Tooltip will show on the grid at the location given by
// tooltipLocation, offset from the grid edge by tooltipOffset.
this.followMouse=!1,
// prop: tooltipLocation
// Where to position tooltip.  If followMouse is true, this is
// relative to the cursor, otherwise, it is relative to the grid.
// One of 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
this.tooltipLocation="se",
// prop: tooltipOffset
// Pixel offset of tooltip from the grid boudaries or cursor center.
this.tooltipOffset=6,
// prop: showTooltipGridPosition
// show the grid pixel coordinates of the mouse.
this.showTooltipGridPosition=!1,
// prop: showTooltipUnitPosition
// show the unit (data) coordinates of the mouse.
this.showTooltipUnitPosition=!0,
// prop: showTooltipDataPosition
// Used with showVerticalLine to show intersecting data points in the tooltip.
this.showTooltipDataPosition=!1,
// prop: tooltipFormatString
// sprintf format string for the tooltip.
// Uses Ash Searle's javascript sprintf implementation
// found here: http://hexmen.com/blog/2007/03/printf-sprintf/
// See http://perldoc.perl.org/functions/sprintf.html for reference
// Note, if showTooltipDataPosition is true, the default tooltipFormatString
// will be set to the cursorLegendFormatString, not the default given here.
this.tooltipFormatString="%.4P, %.4P",
// prop: useAxesFormatters
// Use the x and y axes formatters to format the text in the tooltip.
this.useAxesFormatters=!0,
// prop: tooltipAxisGroups
// Show position for the specified axes.
// This is an array like [['xaxis', 'yaxis'], ['xaxis', 'y2axis']]
// Default is to compute automatically for all visible axes.
this.tooltipAxisGroups=[],
// prop: zoom
// Enable plot zooming.
this.zoom=!1,
// zoomProxy and zoomTarget properties are not directly set by user.  
// They Will be set through call to zoomProxy method.
this.zoomProxy=!1,this.zoomTarget=!1,
// prop: looseZoom
// Will expand zoom range to provide more rounded tick values.
// Works only with linear, log and date axes.
this.looseZoom=!0,
// prop: clickReset
// Will reset plot zoom if single click on plot without drag.
this.clickReset=!1,
// prop: dblClickReset
// Will reset plot zoom if double click on plot without drag.
this.dblClickReset=!0,
// prop: showVerticalLine
// draw a vertical line across the plot which follows the cursor.
// When the line is near a data point, a special legend and/or tooltip can
// be updated with the data values.
this.showVerticalLine=!1,
// prop: showHorizontalLine
// draw a horizontal line across the plot which follows the cursor.
this.showHorizontalLine=!1,
// prop: constrainZoomTo
// 'none', 'x' or 'y'
this.constrainZoomTo="none",
// // prop: autoscaleConstraint
// // when a constrained axis is specified, true will
// // auatoscale the adjacent axis.
// this.autoscaleConstraint = true;
this.shapeRenderer=new $.jqplot.ShapeRenderer,this._zoom={start:[],end:[],started:!1,zooming:!1,isZoomed:!1,axes:{start:{},end:{}},gridpos:{},datapos:{}},this._tooltipElem,this.zoomCanvas,this.cursorCanvas,
// prop: intersectionThreshold
// pixel distance from data point or marker to consider cursor lines intersecting with point.
// If data point markers are not shown, this should be >= 1 or will often miss point intersections.
this.intersectionThreshold=2,
// prop: showCursorLegend
// Replace the plot legend with an enhanced legend displaying intersection information.
this.showCursorLegend=!1,
// prop: cursorLegendFormatString
// Format string used in the cursor legend.  If showTooltipDataPosition is true,
// this will also be the default format string used by tooltipFormatString.
this.cursorLegendFormatString=$.jqplot.Cursor.cursorLegendFormatString,
// whether the cursor is over the grid or not.
this._oldHandlers={onselectstart:null,ondrag:null,onmousedown:null},
// prop: constrainOutsideZoom
// True to limit actual zoom area to edges of grid, even when zooming
// outside of plot area.  That is, can't zoom out by mousing outside plot.
this.constrainOutsideZoom=!0,
// prop: showTooltipOutsideZoom
// True will keep updating the tooltip when zooming of the grid.
this.showTooltipOutsideZoom=!1,
// true if mouse is over grid, false if not.
this.onGrid=!1,$.extend(!0,this,options)},$.jqplot.Cursor.cursorLegendFormatString="%s x:%s, y:%s",
// called with scope of plot
$.jqplot.Cursor.init=function(target,data,opts){
// add a cursor attribute to the plot
var options=opts||{};this.plugins.cursor=new $.jqplot.Cursor(options.cursor);var c=this.plugins.cursor;c.show&&($.jqplot.eventListenerHooks.push(["jqplotMouseEnter",handleMouseEnter]),$.jqplot.eventListenerHooks.push(["jqplotMouseLeave",handleMouseLeave]),$.jqplot.eventListenerHooks.push(["jqplotMouseMove",handleMouseMove]),c.showCursorLegend&&(opts.legend=opts.legend||{},opts.legend.renderer=$.jqplot.CursorLegendRenderer,opts.legend.formatString=this.plugins.cursor.cursorLegendFormatString,opts.legend.show=!0),c.zoom&&($.jqplot.eventListenerHooks.push(["jqplotMouseDown",handleMouseDown]),c.clickReset&&$.jqplot.eventListenerHooks.push(["jqplotClick",handleClick]),c.dblClickReset&&$.jqplot.eventListenerHooks.push(["jqplotDblClick",handleDblClick])),this.resetZoom=function(){var axes=this.axes;if(c.zoomProxy){var ctx=this.plugins.cursor.zoomCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),ctx=null}else{for(var ax in axes)axes[ax].reset(),axes[ax]._ticks=[],
// fake out tick creation algorithm to make sure original auto
// computed format string is used if _overrideFormatString is true
void 0!==c._zoom.axes[ax]&&(axes[ax]._autoFormatString=c._zoom.axes[ax].tickFormatString);this.redraw()}this.plugins.cursor._zoom.isZoomed=!1,this.target.trigger("jqplotResetZoom",[this,this.plugins.cursor])},c.showTooltipDataPosition&&(c.showTooltipUnitPosition=!1,c.showTooltipGridPosition=!1,void 0==options.cursor.tooltipFormatString&&(c.tooltipFormatString=$.jqplot.Cursor.cursorLegendFormatString)))},
// called with context of plot
$.jqplot.Cursor.postDraw=function(){var c=this.plugins.cursor;
// Memory Leaks patch
c.zoomCanvas&&(c.zoomCanvas.resetCanvas(),c.zoomCanvas=null),c.cursorCanvas&&(c.cursorCanvas.resetCanvas(),c.cursorCanvas=null),c._tooltipElem&&(c._tooltipElem.emptyForce(),c._tooltipElem=null),c.zoom&&(c.zoomCanvas=new $.jqplot.GenericCanvas,this.eventCanvas._elem.before(c.zoomCanvas.createElement(this._gridPadding,"jqplot-zoom-canvas",this._plotDimensions,this)),c.zoomCanvas.setContext());var elem=document.createElement("div");
// if we are showing the positions in unit coordinates, and no axes groups
// were specified, create a default set.
if(c._tooltipElem=$(elem),elem=null,c._tooltipElem.addClass("jqplot-cursor-tooltip"),c._tooltipElem.css({position:"absolute",display:"none"}),c.zoomCanvas?c.zoomCanvas._elem.before(c._tooltipElem):this.eventCanvas._elem.before(c._tooltipElem),(c.showVerticalLine||c.showHorizontalLine)&&(c.cursorCanvas=new $.jqplot.GenericCanvas,this.eventCanvas._elem.before(c.cursorCanvas.createElement(this._gridPadding,"jqplot-cursor-canvas",this._plotDimensions,this)),c.cursorCanvas.setContext()),c.showTooltipUnitPosition&&0===c.tooltipAxisGroups.length){for(var s,series=this.series,temp=[],i=0;i<series.length;i++){s=series[i];var ax=s.xaxis+","+s.yaxis;-1==$.inArray(ax,temp)&&temp.push(ax)}for(var i=0;i<temp.length;i++)c.tooltipAxisGroups.push(temp[i].split(","))}},
// Group: methods
//
// method: $.jqplot.Cursor.zoomProxy
// links targetPlot to controllerPlot so that plot zooming of
// targetPlot will be controlled by zooming on the controllerPlot.
// controllerPlot will not actually zoom, but acts as an
// overview plot.  Note, the zoom options must be set to true for
// zoomProxy to work.
$.jqplot.Cursor.zoomProxy=function(targetPlot,controllerPlot){function plotZoom(ev,gridpos,datapos,plot,cursor){tc.doZoom(gridpos,datapos,targetPlot,cursor)}function plotReset(ev,plot,cursor){targetPlot.resetZoom()}var tc=targetPlot.plugins.cursor,cc=controllerPlot.plugins.cursor;tc.zoomTarget=!0,tc.zoom=!0,tc.style="auto",tc.dblClickReset=!1,cc.zoom=!0,cc.zoomProxy=!0,controllerPlot.target.bind("jqplotZoom",plotZoom),controllerPlot.target.bind("jqplotResetZoom",plotReset)},$.jqplot.Cursor.prototype.resetZoom=function(plot,cursor){var axes=plot.axes,cax=cursor._zoom.axes;if(!plot.plugins.cursor.zoomProxy&&cursor._zoom.isZoomed){for(var ax in axes)
// axes[ax]._ticks = [];
// axes[ax].min = cax[ax].min;
// axes[ax].max = cax[ax].max;
// axes[ax].numberTicks = cax[ax].numberTicks; 
// axes[ax].tickInterval = cax[ax].tickInterval;
// // for date axes
// axes[ax].daTickInterval = cax[ax].daTickInterval;
axes[ax].reset(),axes[ax]._ticks=[],
// fake out tick creation algorithm to make sure original auto
// computed format string is used if _overrideFormatString is true
axes[ax]._autoFormatString=cax[ax].tickFormatString;plot.redraw(),cursor._zoom.isZoomed=!1}else{var ctx=cursor.zoomCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),ctx=null}plot.target.trigger("jqplotResetZoom",[plot,cursor])},$.jqplot.Cursor.resetZoom=function(plot){plot.resetZoom()},$.jqplot.Cursor.prototype.doZoom=function(gridpos,datapos,plot,cursor){var dp,span,newmin,newmax,curax,_numberTicks,ret,c=cursor,axes=plot.axes,zaxes=c._zoom.axes,start=zaxes.start,ctx=(zaxes.end,plot.plugins.cursor.zoomCanvas._ctx);
// don't zoom if zoom area is too small (in pixels)
if("none"==c.constrainZoomTo&&Math.abs(gridpos.x-c._zoom.start[0])>6&&Math.abs(gridpos.y-c._zoom.start[1])>6||"x"==c.constrainZoomTo&&Math.abs(gridpos.x-c._zoom.start[0])>6||"y"==c.constrainZoomTo&&Math.abs(gridpos.y-c._zoom.start[1])>6){if(!plot.plugins.cursor.zoomProxy){for(var ax in datapos)
// make a copy of the original axes to revert back.
void 0==c._zoom.axes[ax]&&(c._zoom.axes[ax]={},c._zoom.axes[ax].numberTicks=axes[ax].numberTicks,c._zoom.axes[ax].tickInterval=axes[ax].tickInterval,
// for date axes...
c._zoom.axes[ax].daTickInterval=axes[ax].daTickInterval,c._zoom.axes[ax].min=axes[ax].min,c._zoom.axes[ax].max=axes[ax].max,c._zoom.axes[ax].tickFormatString=null!=axes[ax].tickOptions?axes[ax].tickOptions.formatString:""),("none"==c.constrainZoomTo||"x"==c.constrainZoomTo&&"x"==ax.charAt(0)||"y"==c.constrainZoomTo&&"y"==ax.charAt(0))&&(dp=datapos[ax],null!=dp&&(dp>start[ax]?(newmin=start[ax],newmax=dp):(span=start[ax]-dp,newmin=dp,newmax=start[ax]),curax=axes[ax],_numberTicks=null,curax.alignTicks&&("x2axis"===curax.name&&plot.axes.xaxis.show?_numberTicks=plot.axes.xaxis.numberTicks:"y"===curax.name.charAt(0)&&"yaxis"!==curax.name&&"yMidAxis"!==curax.name&&plot.axes.yaxis.show&&(_numberTicks=plot.axes.yaxis.numberTicks)),!this.looseZoom||axes[ax].renderer.constructor!==$.jqplot.LinearAxisRenderer&&axes[ax].renderer.constructor!==$.jqplot.LogAxisRenderer?(axes[ax].min=newmin,axes[ax].max=newmax,axes[ax].tickInterval=null,axes[ax].numberTicks=null,axes[ax].daTickInterval=null):(ret=$.jqplot.LinearTickGenerator(newmin,newmax,curax._scalefact,_numberTicks),axes[ax].tickInset&&ret[0]<axes[ax].min+axes[ax].tickInset*axes[ax].tickInterval&&(ret[0]+=ret[4],ret[2]-=1),axes[ax].tickInset&&ret[1]>axes[ax].max-axes[ax].tickInset*axes[ax].tickInterval&&(ret[1]-=ret[4],ret[2]-=1),axes[ax].renderer.constructor===$.jqplot.LogAxisRenderer&&ret[0]<axes[ax].min&&(ret[0]+=ret[4],ret[2]-=1),axes[ax].min=ret[0],axes[ax].max=ret[1],axes[ax]._autoFormatString=ret[3],axes[ax].numberTicks=ret[2],axes[ax].tickInterval=ret[4],axes[ax].daTickInterval=[ret[4]/1e3,"seconds"]),axes[ax]._ticks=[]));ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),plot.redraw(),c._zoom.isZoomed=!0,ctx=null}plot.target.trigger("jqplotZoom",[gridpos,datapos,plot,cursor])}},$.jqplot.preInitHooks.push($.jqplot.Cursor.init),$.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw),$.jqplot.CursorLegendRenderer=function(options){$.jqplot.TableLegendRenderer.call(this,options),this.formatString="%s"},$.jqplot.CursorLegendRenderer.prototype=new $.jqplot.TableLegendRenderer,$.jqplot.CursorLegendRenderer.prototype.constructor=$.jqplot.CursorLegendRenderer,
// called in context of a Legend
$.jqplot.CursorLegendRenderer.prototype.draw=function(){function addrow(label,color,pad,idx){var rs=pad?this.rowSpacing:"0",tr=$('<tr class="jqplot-legend jqplot-cursor-legend"></tr>').appendTo(this._elem);tr.data("seriesIndex",idx),$('<td class="jqplot-legend jqplot-cursor-legend-swatch" style="padding-top:'+rs+';"><div style="border:1px solid #cccccc;padding:0.2em;"><div class="jqplot-cursor-legend-swatch" style="background-color:'+color+';"></div></div></td>').appendTo(tr);var td=$('<td class="jqplot-legend jqplot-cursor-legend-label" style="vertical-align:middle;padding-top:'+rs+';"></td>');td.appendTo(tr),td.data("seriesIndex",idx),this.escapeHtml?td.text(label):td.html(label),tr=null,td=null}if(this._elem&&(this._elem.emptyForce(),this._elem=null),this.show){var s,series=this._series,elem=document.createElement("table");this._elem=$(elem),elem=null,this._elem.addClass("jqplot-legend jqplot-cursor-legend"),this._elem.css("position","absolute");for(var pad=!1,i=0;i<series.length;i++)if(s=series[i],s.show&&s.showLabel){var lt=$.jqplot.sprintf(this.formatString,s.label.toString());if(lt){var color=s.color;s._stack&&!s.fill&&(color=""),addrow.call(this,lt,color,pad,i),pad=!0}
// let plugins add more rows to legend.  Used by trend line plugin.
for(var j=0;j<$.jqplot.addLegendRowHooks.length;j++){var item=$.jqplot.addLegendRowHooks[j].call(this,s);item&&(addrow.call(this,item.label,item.color,pad),pad=!0)}}series=s=null,delete series,delete s}return this._elem}}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
function($){/**
    *  Class: $.jqplot.CanvasAxisTickRenderer
    * Renderer to draw axis ticks with a canvas element to support advanced
    * featrues such as rotated text.  This renderer uses a separate rendering engine
    * to draw the text on the canvas.  Two modes of rendering the text are available.
    * If the browser has native font support for canvas fonts (currently Mozila 3.5
    * and Safari 4), you can enable text rendering with the canvas fillText method.
    * You do so by setting the "enableFontSupport" option to true. 
    * 
    * Browsers lacking native font support will have the text drawn on the canvas
    * using the Hershey font metrics.  Even if the "enableFontSupport" option is true
    * non-supporting browsers will still render with the Hershey font.
    */
$.jqplot.CanvasAxisTickRenderer=function(options){
// Group: Properties
// prop: mark
// tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
this.mark="outside",
// prop: showMark
// whether or not to show the mark on the axis.
this.showMark=!0,
// prop: showGridline
// whether or not to draw the gridline on the grid at this tick.
this.showGridline=!0,
// prop: isMinorTick
// if this is a minor tick.
this.isMinorTick=!1,
// prop: angle
// angle of text, measured clockwise from x axis.
this.angle=0,
// prop:  markSize
// Length of the tick marks in pixels.  For 'cross' style, length
// will be stoked above and below axis, so total length will be twice this.
this.markSize=4,
// prop: show
// whether or not to show the tick (mark and label).
this.show=!0,
// prop: showLabel
// whether or not to show the label.
this.showLabel=!0,
// prop: labelPosition
// 'auto', 'start', 'middle' or 'end'.
// Whether tick label should be positioned so the start, middle, or end
// of the tick mark.
this.labelPosition="auto",this.label="",this.value=null,this._styles={},
// prop: formatter
// A class of a formatter for the tick text.
// The default $.jqplot.DefaultTickFormatter uses sprintf.
this.formatter=$.jqplot.DefaultTickFormatter,
// prop: formatString
// string passed to the formatter.
this.formatString="",
// prop: prefix
// String to prepend to the tick label.
// Prefix is prepended to the formatted tick label.
this.prefix="",
// prop: fontFamily
// css spec for the font-family css attribute.
this.fontFamily='"Trebuchet MS", Arial, Helvetica, sans-serif',
// prop: fontSize
// CSS spec for font size.
this.fontSize="10pt",
// prop: fontWeight
// CSS spec for fontWeight
this.fontWeight="normal",
// prop: fontStretch
// Multiplier to condense or expand font width.  
// Applies only to browsers which don't support canvas native font rendering.
this.fontStretch=1,
// prop: textColor
// css spec for the color attribute.
this.textColor="#666666",
// prop: enableFontSupport
// true to turn on native canvas font support in Mozilla 3.5+ and Safari 4+.
// If true, tick label will be drawn with canvas tag native support for fonts.
// If false, tick label will be drawn with Hershey font metrics.
this.enableFontSupport=!0,
// prop: pt2px
// Point to pixel scaling factor, used for computing height of bounding box
// around a label.  The labels text renderer has a default setting of 1.4, which 
// should be suitable for most fonts.  Leave as null to use default.  If tops of
// letters appear clipped, increase this.  If bounding box seems too big, decrease.
// This is an issue only with the native font renderering capabilities of Mozilla
// 3.5 and Safari 4 since they do not provide a method to determine the font height.
this.pt2px=null,this._elem,this._ctx,this._plotWidth,this._plotHeight,this._plotDimensions={height:null,width:null},$.extend(!0,this,options);var ropts={fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily};this.pt2px&&(ropts.pt2px=this.pt2px),this.enableFontSupport&&$.jqplot.support_canvas_text()?this._textRenderer=new $.jqplot.CanvasFontRenderer(ropts):this._textRenderer=new $.jqplot.CanvasTextRenderer(ropts)},$.jqplot.CanvasAxisTickRenderer.prototype.init=function(options){$.extend(!0,this,options),this._textRenderer.init({fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily})},
// return width along the x axis
// will check first to see if an element exists.
// if not, will return the computed text box width.
$.jqplot.CanvasAxisTickRenderer.prototype.getWidth=function(ctx){if(this._elem)return this._elem.outerWidth(!0);var tr=this._textRenderer,l=tr.getWidth(ctx),h=tr.getHeight(ctx),w=Math.abs(Math.sin(tr.angle)*h)+Math.abs(Math.cos(tr.angle)*l);return w},
// return height along the y axis.
$.jqplot.CanvasAxisTickRenderer.prototype.getHeight=function(ctx){if(this._elem)return this._elem.outerHeight(!0);var tr=this._textRenderer,l=tr.getWidth(ctx),h=tr.getHeight(ctx),w=Math.abs(Math.cos(tr.angle)*h)+Math.abs(Math.sin(tr.angle)*l);return w},
// return top.
$.jqplot.CanvasAxisTickRenderer.prototype.getTop=function(ctx){return this._elem?this._elem.position().top:null},$.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad=function(){var a=this.angle*Math.PI/180;return a},$.jqplot.CanvasAxisTickRenderer.prototype.setTick=function(value,axisName,isMinor){return this.value=value,isMinor&&(this.isMinorTick=!0),this},$.jqplot.CanvasAxisTickRenderer.prototype.draw=function(ctx,plot){this.label||(this.label=this.prefix+this.formatter(this.formatString,this.value)),
// Memory Leaks patch
this._elem&&($.jqplot.use_excanvas&&void 0!==window.G_vmlCanvasManager.uninitElement&&window.G_vmlCanvasManager.uninitElement(this._elem.get(0)),this._elem.emptyForce(),this._elem=null);
// create a canvas here, but can't draw on it untill it is appended
// to dom for IE compatability.
var elem=plot.canvasManager.getCanvas();this._textRenderer.setText(this.label,ctx);var w=this.getWidth(ctx),h=this.getHeight(ctx);
// canvases seem to need to have width and heigh attributes directly set.
return elem.width=w,elem.height=h,elem.style.width=w,elem.style.height=h,elem.style.textAlign="left",elem.style.position="absolute",elem=plot.canvasManager.initCanvas(elem),this._elem=$(elem),this._elem.css(this._styles),this._elem.addClass("jqplot-"+this.axis+"-tick"),elem=null,this._elem},$.jqplot.CanvasAxisTickRenderer.prototype.pack=function(){this._textRenderer.draw(this._elem.get(0).getContext("2d"),this.label)}}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 *
 * included jsDate library by Chris Leonello:
 *
 * Copyright (c) 2010-2013 Chris Leonello
 *
 * jsDate is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly.
 *
 * jsDate borrows many concepts and ideas from the Date Instance 
 * Methods by Ken Snyder along with some parts of Ken's actual code.
 * 
 * Ken's original Date Instance Methods and copyright notice:
 * 
 * Ken Snyder (ken d snyder at gmail dot com)
 * 2008-09-10
 * version 2.0.2 (http://kendsnyder.com/sandbox/date/)     
 * Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 *
 * jqplotToImage function based on Larry Siden's export-jqplot-to-png.js.
 * Larry has generously given permission to adapt his code for inclusion
 * into jqPlot.
 *
 * Larry's original code can be found here:
 *
 * https://github.com/lsiden/export-jqplot-to-png
 * 
 * 
 */
function($){
// This code is a modified version of the canvastext.js code, copyright below:
//
// This code is released to the public domain by Jim Studt, 2007.
// He may keep some sort of up to date copy at http://www.federated.com/~jim/canvastext/
//
$.jqplot.CanvasTextRenderer=function(options){this.fontStyle="normal",// normal, italic, oblique [not implemented]
this.fontVariant="normal",// normal, small caps [not implemented]
this.fontWeight="normal",// normal, bold, bolder, lighter, 100 - 900
this.fontSize="10px",this.fontFamily="sans-serif",this.fontStretch=1,this.fillStyle="#666666",this.angle=0,this.textAlign="start",this.textBaseline="alphabetic",this.text,this.width,this.height,this.pt2px=1.28,$.extend(!0,this,options),this.normalizedFontSize=this.normalizeFontSize(this.fontSize),this.setHeight()},$.jqplot.CanvasTextRenderer.prototype.init=function(options){$.extend(!0,this,options),this.normalizedFontSize=this.normalizeFontSize(this.fontSize),this.setHeight()},
// convert css spec into point size
// returns float
$.jqplot.CanvasTextRenderer.prototype.normalizeFontSize=function(sz){sz=String(sz);var n=parseFloat(sz);return sz.indexOf("px")>-1?n/this.pt2px:sz.indexOf("pt")>-1?n:sz.indexOf("em")>-1?12*n:sz.indexOf("%")>-1?12*n/100:n/this.pt2px},$.jqplot.CanvasTextRenderer.prototype.fontWeight2Float=function(w){
// w = normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
// return values adjusted for Hershey font.
if(Number(w))return w/400;switch(w){case"normal":return 1;case"bold":return 1.75;case"bolder":return 2.25;case"lighter":return.75;default:return 1}},$.jqplot.CanvasTextRenderer.prototype.getText=function(){return this.text},$.jqplot.CanvasTextRenderer.prototype.setText=function(t,ctx){return this.text=t,this.setWidth(ctx),this},$.jqplot.CanvasTextRenderer.prototype.getWidth=function(ctx){return this.width},$.jqplot.CanvasTextRenderer.prototype.setWidth=function(ctx,w){return w?this.width=w:this.width=this.measure(ctx,this.text),this},
// return height in pixels.
$.jqplot.CanvasTextRenderer.prototype.getHeight=function(ctx){return this.height},
// w - height in pt
// set heigh in px
$.jqplot.CanvasTextRenderer.prototype.setHeight=function(w){
//height = this.fontSize /0.75;
return w?this.height=w:this.height=this.normalizedFontSize*this.pt2px,this},$.jqplot.CanvasTextRenderer.prototype.letter=function(ch){return this.letters[ch]},$.jqplot.CanvasTextRenderer.prototype.ascent=function(){return this.normalizedFontSize},$.jqplot.CanvasTextRenderer.prototype.descent=function(){return 7*this.normalizedFontSize/25},$.jqplot.CanvasTextRenderer.prototype.measure=function(ctx,str){for(var total=0,len=str.length,i=0;len>i;i++){var c=this.letter(str.charAt(i));c&&(total+=c.width*this.normalizedFontSize/25*this.fontStretch)}return total},$.jqplot.CanvasTextRenderer.prototype.draw=function(ctx,str){var x=0,y=.72*this.height,total=0,len=str.length,mag=this.normalizedFontSize/25;ctx.save();var tx,ty;
// 1st quadrant
-Math.PI/2<=this.angle&&this.angle<=0||3*Math.PI/2<=this.angle&&this.angle<=2*Math.PI?(tx=0,ty=-Math.sin(this.angle)*this.width):0<this.angle&&this.angle<=Math.PI/2||2*-Math.PI<=this.angle&&this.angle<=3*-Math.PI/2?(tx=Math.sin(this.angle)*this.height,ty=0):-Math.PI<this.angle&&this.angle<-Math.PI/2||Math.PI<=this.angle&&this.angle<=3*Math.PI/2?(tx=-Math.cos(this.angle)*this.width,ty=-Math.sin(this.angle)*this.width-Math.cos(this.angle)*this.height):(3*-Math.PI/2<this.angle&&this.angle<Math.PI||Math.PI/2<this.angle&&this.angle<Math.PI)&&(tx=Math.sin(this.angle)*this.height-Math.cos(this.angle)*this.width,ty=-Math.cos(this.angle)*this.height),ctx.strokeStyle=this.fillStyle,ctx.fillStyle=this.fillStyle,ctx.translate(tx,ty),ctx.rotate(this.angle),ctx.lineCap="round";
// multiplier was 2.0
var fact=this.normalizedFontSize>30?2:2+(30-this.normalizedFontSize)/20;ctx.lineWidth=fact*mag*this.fontWeight2Float(this.fontWeight);for(var i=0;len>i;i++){var c=this.letter(str.charAt(i));if(c){ctx.beginPath();for(var penUp=1,j=0;j<c.points.length;j++){var a=c.points[j];-1!=a[0]||-1!=a[1]?penUp?(ctx.moveTo(x+a[0]*mag*this.fontStretch,y-a[1]*mag),penUp=!1):ctx.lineTo(x+a[0]*mag*this.fontStretch,y-a[1]*mag):penUp=1}ctx.stroke(),x+=c.width*mag*this.fontStretch}}return ctx.restore(),total},$.jqplot.CanvasTextRenderer.prototype.letters={" ":{width:16,points:[]},"!":{width:10,points:[[5,21],[5,7],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},'"':{width:16,points:[[4,21],[4,14],[-1,-1],[12,21],[12,14]]},"#":{width:21,points:[[11,25],[4,-7],[-1,-1],[17,25],[10,-7],[-1,-1],[4,12],[18,12],[-1,-1],[3,6],[17,6]]},$:{width:20,points:[[8,25],[8,-4],[-1,-1],[12,25],[12,-4],[-1,-1],[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},"%":{width:24,points:[[21,21],[3,0],[-1,-1],[8,21],[10,19],[10,17],[9,15],[7,14],[5,14],[3,16],[3,18],[4,20],[6,21],[8,21],[10,20],[13,19],[16,19],[19,20],[21,21],[-1,-1],[17,7],[15,6],[14,4],[14,2],[16,0],[18,0],[20,1],[21,3],[21,5],[19,7],[17,7]]},"&":{width:26,points:[[23,12],[23,13],[22,14],[21,14],[20,13],[19,11],[17,6],[15,3],[13,1],[11,0],[7,0],[5,1],[4,2],[3,4],[3,6],[4,8],[5,9],[12,13],[13,14],[14,16],[14,18],[13,20],[11,21],[9,20],[8,18],[8,16],[9,13],[11,10],[16,3],[18,1],[20,0],[22,0],[23,1],[23,2]]},"'":{width:10,points:[[5,19],[4,20],[5,21],[6,20],[6,18],[5,16],[4,15]]},"(":{width:14,points:[[11,25],[9,23],[7,20],[5,16],[4,11],[4,7],[5,2],[7,-2],[9,-5],[11,-7]]},")":{width:14,points:[[3,25],[5,23],[7,20],[9,16],[10,11],[10,7],[9,2],[7,-2],[5,-5],[3,-7]]},"*":{width:16,points:[[8,21],[8,9],[-1,-1],[3,18],[13,12],[-1,-1],[13,18],[3,12]]},"+":{width:26,points:[[13,18],[13,0],[-1,-1],[4,9],[22,9]]},",":{width:10,points:[[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},"-":{width:18,points:[[6,9],[12,9]]},".":{width:10,points:[[5,2],[4,1],[5,0],[6,1],[5,2]]},"/":{width:22,points:[[20,25],[2,-7]]},0:{width:20,points:[[9,21],[6,20],[4,17],[3,12],[3,9],[4,4],[6,1],[9,0],[11,0],[14,1],[16,4],[17,9],[17,12],[16,17],[14,20],[11,21],[9,21]]},1:{width:20,points:[[6,17],[8,18],[11,21],[11,0]]},2:{width:20,points:[[4,16],[4,17],[5,19],[6,20],[8,21],[12,21],[14,20],[15,19],[16,17],[16,15],[15,13],[13,10],[3,0],[17,0]]},3:{width:20,points:[[5,21],[16,21],[10,13],[13,13],[15,12],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},4:{width:20,points:[[13,21],[3,7],[18,7],[-1,-1],[13,21],[13,0]]},5:{width:20,points:[[15,21],[5,21],[4,12],[5,13],[8,14],[11,14],[14,13],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},6:{width:20,points:[[16,18],[15,20],[12,21],[10,21],[7,20],[5,17],[4,12],[4,7],[5,3],[7,1],[10,0],[11,0],[14,1],[16,3],[17,6],[17,7],[16,10],[14,12],[11,13],[10,13],[7,12],[5,10],[4,7]]},7:{width:20,points:[[17,21],[7,0],[-1,-1],[3,21],[17,21]]},8:{width:20,points:[[8,21],[5,20],[4,18],[4,16],[5,14],[7,13],[11,12],[14,11],[16,9],[17,7],[17,4],[16,2],[15,1],[12,0],[8,0],[5,1],[4,2],[3,4],[3,7],[4,9],[6,11],[9,12],[13,13],[15,14],[16,16],[16,18],[15,20],[12,21],[8,21]]},9:{width:20,points:[[16,14],[15,11],[13,9],[10,8],[9,8],[6,9],[4,11],[3,14],[3,15],[4,18],[6,20],[9,21],[10,21],[13,20],[15,18],[16,14],[16,9],[15,4],[13,1],[10,0],[8,0],[5,1],[4,3]]},":":{width:10,points:[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},";":{width:10,points:[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},"<":{width:24,points:[[20,18],[4,9],[20,0]]},"=":{width:26,points:[[4,12],[22,12],[-1,-1],[4,6],[22,6]]},">":{width:24,points:[[4,18],[20,9],[4,0]]},"?":{width:18,points:[[3,16],[3,17],[4,19],[5,20],[7,21],[11,21],[13,20],[14,19],[15,17],[15,15],[14,13],[13,12],[9,10],[9,7],[-1,-1],[9,2],[8,1],[9,0],[10,1],[9,2]]},"@":{width:27,points:[[18,13],[17,15],[15,16],[12,16],[10,15],[9,14],[8,11],[8,8],[9,6],[11,5],[14,5],[16,6],[17,8],[-1,-1],[12,16],[10,14],[9,11],[9,8],[10,6],[11,5],[-1,-1],[18,16],[17,8],[17,6],[19,5],[21,5],[23,7],[24,10],[24,12],[23,15],[22,17],[20,19],[18,20],[15,21],[12,21],[9,20],[7,19],[5,17],[4,15],[3,12],[3,9],[4,6],[5,4],[7,2],[9,1],[12,0],[15,0],[18,1],[20,2],[21,3],[-1,-1],[19,16],[18,8],[18,6],[19,5]]},A:{width:18,points:[[9,21],[1,0],[-1,-1],[9,21],[17,0],[-1,-1],[4,7],[14,7]]},B:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[-1,-1],[4,11],[13,11],[16,10],[17,9],[18,7],[18,4],[17,2],[16,1],[13,0],[4,0]]},C:{width:21,points:[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5]]},D:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[11,21],[14,20],[16,18],[17,16],[18,13],[18,8],[17,5],[16,3],[14,1],[11,0],[4,0]]},E:{width:19,points:[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11],[-1,-1],[4,0],[17,0]]},F:{width:18,points:[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11]]},G:{width:21,points:[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[18,8],[-1,-1],[13,8],[18,8]]},H:{width:22,points:[[4,21],[4,0],[-1,-1],[18,21],[18,0],[-1,-1],[4,11],[18,11]]},I:{width:8,points:[[4,21],[4,0]]},J:{width:16,points:[[12,21],[12,5],[11,2],[10,1],[8,0],[6,0],[4,1],[3,2],[2,5],[2,7]]},K:{width:21,points:[[4,21],[4,0],[-1,-1],[18,21],[4,7],[-1,-1],[9,12],[18,0]]},L:{width:17,points:[[4,21],[4,0],[-1,-1],[4,0],[16,0]]},M:{width:24,points:[[4,21],[4,0],[-1,-1],[4,21],[12,0],[-1,-1],[20,21],[12,0],[-1,-1],[20,21],[20,0]]},N:{width:22,points:[[4,21],[4,0],[-1,-1],[4,21],[18,0],[-1,-1],[18,21],[18,0]]},O:{width:22,points:[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21]]},P:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,14],[17,12],[16,11],[13,10],[4,10]]},Q:{width:22,points:[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21],[-1,-1],[12,4],[18,-2]]},R:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[4,11],[-1,-1],[11,11],[18,0]]},S:{width:20,points:[[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},T:{width:16,points:[[8,21],[8,0],[-1,-1],[1,21],[15,21]]},U:{width:22,points:[[4,21],[4,6],[5,3],[7,1],[10,0],[12,0],[15,1],[17,3],[18,6],[18,21]]},V:{width:18,points:[[1,21],[9,0],[-1,-1],[17,21],[9,0]]},W:{width:24,points:[[2,21],[7,0],[-1,-1],[12,21],[7,0],[-1,-1],[12,21],[17,0],[-1,-1],[22,21],[17,0]]},X:{width:20,points:[[3,21],[17,0],[-1,-1],[17,21],[3,0]]},Y:{width:18,points:[[1,21],[9,11],[9,0],[-1,-1],[17,21],[9,11]]},Z:{width:20,points:[[17,21],[3,0],[-1,-1],[3,21],[17,21],[-1,-1],[3,0],[17,0]]},"[":{width:14,points:[[4,25],[4,-7],[-1,-1],[5,25],[5,-7],[-1,-1],[4,25],[11,25],[-1,-1],[4,-7],[11,-7]]},"\\":{width:14,points:[[0,21],[14,-3]]},"]":{width:14,points:[[9,25],[9,-7],[-1,-1],[10,25],[10,-7],[-1,-1],[3,25],[10,25],[-1,-1],[3,-7],[10,-7]]},"^":{width:16,points:[[6,15],[8,18],[10,15],[-1,-1],[3,12],[8,17],[13,12],[-1,-1],[8,17],[8,0]]},_:{width:16,points:[[0,-2],[16,-2]]},"`":{width:10,points:[[6,21],[5,20],[4,18],[4,16],[5,15],[6,16],[5,17]]},a:{width:19,points:[[15,14],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},b:{width:19,points:[[4,21],[4,0],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},c:{width:18,points:[[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},d:{width:19,points:[[15,21],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},e:{width:18,points:[[3,8],[15,8],[15,10],[14,12],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},f:{width:12,points:[[10,21],[8,21],[6,20],[5,17],[5,0],[-1,-1],[2,14],[9,14]]},g:{width:19,points:[[15,14],[15,-2],[14,-5],[13,-6],[11,-7],[8,-7],[6,-6],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},h:{width:19,points:[[4,21],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},i:{width:8,points:[[3,21],[4,20],[5,21],[4,22],[3,21],[-1,-1],[4,14],[4,0]]},j:{width:10,points:[[5,21],[6,20],[7,21],[6,22],[5,21],[-1,-1],[6,14],[6,-3],[5,-6],[3,-7],[1,-7]]},k:{width:17,points:[[4,21],[4,0],[-1,-1],[14,14],[4,4],[-1,-1],[8,8],[15,0]]},l:{width:8,points:[[4,21],[4,0]]},m:{width:30,points:[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0],[-1,-1],[15,10],[18,13],[20,14],[23,14],[25,13],[26,10],[26,0]]},n:{width:19,points:[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},o:{width:19,points:[[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3],[16,6],[16,8],[15,11],[13,13],[11,14],[8,14]]},p:{width:19,points:[[4,14],[4,-7],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},q:{width:19,points:[[15,14],[15,-7],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},r:{width:13,points:[[4,14],[4,0],[-1,-1],[4,8],[5,11],[7,13],[9,14],[12,14]]},s:{width:17,points:[[14,11],[13,13],[10,14],[7,14],[4,13],[3,11],[4,9],[6,8],[11,7],[13,6],[14,4],[14,3],[13,1],[10,0],[7,0],[4,1],[3,3]]},t:{width:12,points:[[5,21],[5,4],[6,1],[8,0],[10,0],[-1,-1],[2,14],[9,14]]},u:{width:19,points:[[4,14],[4,4],[5,1],[7,0],[10,0],[12,1],[15,4],[-1,-1],[15,14],[15,0]]},v:{width:16,points:[[2,14],[8,0],[-1,-1],[14,14],[8,0]]},w:{width:22,points:[[3,14],[7,0],[-1,-1],[11,14],[7,0],[-1,-1],[11,14],[15,0],[-1,-1],[19,14],[15,0]]},x:{width:17,points:[[3,14],[14,0],[-1,-1],[14,14],[3,0]]},y:{width:16,points:[[2,14],[8,0],[-1,-1],[14,14],[8,0],[6,-4],[4,-6],[2,-7],[1,-7]]},z:{width:17,points:[[14,14],[3,0],[-1,-1],[3,14],[14,14],[-1,-1],[3,0],[14,0]]},"{":{width:14,points:[[9,25],[7,24],[6,23],[5,21],[5,19],[6,17],[7,16],[8,14],[8,12],[6,10],[-1,-1],[7,24],[6,22],[6,20],[7,18],[8,17],[9,15],[9,13],[8,11],[4,9],[8,7],[9,5],[9,3],[8,1],[7,0],[6,-2],[6,-4],[7,-6],[-1,-1],[6,8],[8,6],[8,4],[7,2],[6,1],[5,-1],[5,-3],[6,-5],[7,-6],[9,-7]]},"|":{width:8,points:[[4,25],[4,-7]]},"}":{width:14,points:[[5,25],[7,24],[8,23],[9,21],[9,19],[8,17],[7,16],[6,14],[6,12],[8,10],[-1,-1],[7,24],[8,22],[8,20],[7,18],[6,17],[5,15],[5,13],[6,11],[10,9],[6,7],[5,5],[5,3],[6,1],[7,0],[8,-2],[8,-4],[7,-6],[-1,-1],[8,8],[6,6],[6,4],[7,2],[8,1],[9,-1],[9,-3],[8,-5],[7,-6],[5,-7]]},"~":{width:24,points:[[3,6],[3,8],[4,11],[6,12],[8,12],[10,11],[14,8],[16,7],[18,7],[20,8],[21,10],[-1,-1],[3,8],[4,10],[6,11],[8,11],[10,10],[14,7],[16,6],[18,6],[20,7],[21,10],[21,12]]}},$.jqplot.CanvasFontRenderer=function(options){options=options||{},options.pt2px||(options.pt2px=1.5),$.jqplot.CanvasTextRenderer.call(this,options)},$.jqplot.CanvasFontRenderer.prototype=new $.jqplot.CanvasTextRenderer({}),$.jqplot.CanvasFontRenderer.prototype.constructor=$.jqplot.CanvasFontRenderer,$.jqplot.CanvasFontRenderer.prototype.measure=function(ctx,str){
// var fstyle = this.fontStyle+' '+this.fontVariant+' '+this.fontWeight+' '+this.fontSize+' '+this.fontFamily;
var fstyle=this.fontSize+" "+this.fontFamily;ctx.save(),ctx.font=fstyle;var w=ctx.measureText(str).width;return ctx.restore(),w},$.jqplot.CanvasFontRenderer.prototype.draw=function(ctx,str){var x=0,y=.72*this.height;
//var y = 12;
ctx.save();var tx,ty;
// 1st quadrant
-Math.PI/2<=this.angle&&this.angle<=0||3*Math.PI/2<=this.angle&&this.angle<=2*Math.PI?(tx=0,ty=-Math.sin(this.angle)*this.width):0<this.angle&&this.angle<=Math.PI/2||2*-Math.PI<=this.angle&&this.angle<=3*-Math.PI/2?(tx=Math.sin(this.angle)*this.height,ty=0):-Math.PI<this.angle&&this.angle<-Math.PI/2||Math.PI<=this.angle&&this.angle<=3*Math.PI/2?(tx=-Math.cos(this.angle)*this.width,ty=-Math.sin(this.angle)*this.width-Math.cos(this.angle)*this.height):(3*-Math.PI/2<this.angle&&this.angle<Math.PI||Math.PI/2<this.angle&&this.angle<Math.PI)&&(tx=Math.sin(this.angle)*this.height-Math.cos(this.angle)*this.width,ty=-Math.cos(this.angle)*this.height),ctx.strokeStyle=this.fillStyle,ctx.fillStyle=this.fillStyle;
// var fstyle = this.fontStyle+' '+this.fontVariant+' '+this.fontWeight+' '+this.fontSize+' '+this.fontFamily;
var fstyle=this.fontSize+" "+this.fontFamily;ctx.font=fstyle,ctx.translate(tx,ty),ctx.rotate(this.angle),ctx.fillText(str,x,y),
// ctx.strokeText(str, x, y);
ctx.restore()}}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
function($){/**
    *  class: $.jqplot.CategoryAxisRenderer
    *  A plugin for jqPlot to render a category style axis, with equal pixel spacing between y data values of a series.
    *  
    *  To use this renderer, include the plugin in your source
    *  > <script type="text/javascript" language="javascript" src="plugins/jqplot.categoryAxisRenderer.js"></script>
    *  
    *  and supply the appropriate options to your plot
    *  
    *  > {axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}}}
    **/
$.jqplot.CategoryAxisRenderer=function(options){$.jqplot.LinearAxisRenderer.call(this),
// prop: sortMergedLabels
// True to sort tick labels when labels are created by merging
// x axis values from multiple series.  That is, say you have
// two series like:
// > line1 = [[2006, 4],            [2008, 9], [2009, 16]];
// > line2 = [[2006, 3], [2007, 7], [2008, 6]];
// If no label array is specified, tick labels will be collected
// from the x values of the series.  With sortMergedLabels
// set to true, tick labels will be:
// > [2006, 2007, 2008, 2009]
// With sortMergedLabels set to false, tick labels will be:
// > [2006, 2008, 2009, 2007]
//
// Note, this property is specified on the renderOptions for the 
// axes when creating a plot:
// > axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer, rendererOptions:{sortMergedLabels:true}}}
this.sortMergedLabels=!1},$.jqplot.CategoryAxisRenderer.prototype=new $.jqplot.LinearAxisRenderer,$.jqplot.CategoryAxisRenderer.prototype.constructor=$.jqplot.CategoryAxisRenderer,$.jqplot.CategoryAxisRenderer.prototype.init=function(options){this.groups=1,this.groupLabels=[],this._groupLabels=[],this._grouped=!1,this._barsPerGroup=null,this.reverse=!1,
// prop: tickRenderer
// A class of a rendering engine for creating the ticks labels displayed on the plot, 
// See <$.jqplot.AxisTickRenderer>.
// this.tickRenderer = $.jqplot.AxisTickRenderer;
// this.labelRenderer = $.jqplot.AxisLabelRenderer;
$.extend(!0,this,{tickOptions:{formatString:"%d"}},options);
// Go through all the series attached to this axis and find
// the min/max bounds for this axis.
for(var db=this._dataBounds,i=0;i<this._series.length;i++){var s=this._series[i];s.groups&&(this.groups=s.groups);for(var d=s.data,j=0;j<d.length;j++)"xaxis"==this.name||"x2axis"==this.name?((d[j][0]<db.min||null==db.min)&&(db.min=d[j][0]),(d[j][0]>db.max||null==db.max)&&(db.max=d[j][0])):((d[j][1]<db.min||null==db.min)&&(db.min=d[j][1]),(d[j][1]>db.max||null==db.max)&&(db.max=d[j][1]))}this.groupLabels.length&&(this.groups=this.groupLabels.length)},$.jqplot.CategoryAxisRenderer.prototype.createTicks=function(){
// we're are operating on an axis here
var dim,min,max,tt,i,userTicks=(this._ticks,this.ticks),name=this.name;this._dataBounds;
// if we already have ticks, use them.
if(userTicks.length){
// adjust with blanks if we have groups
if(this.groups>1&&!this._grouped){for(var l=userTicks.length,skip=parseInt(l/this.groups,10),count=0,i=skip;l>i;i+=skip)userTicks.splice(i+count,0," "),count++;this._grouped=!0}this.min=.5,this.max=userTicks.length+.5;var range=this.max-this.min;for(this.numberTicks=2*userTicks.length+1,i=0;i<userTicks.length;i++){tt=this.min+2*i*range/(this.numberTicks-1);
// need a marker before and after the tick
var t=new this.tickRenderer(this.tickOptions);t.showLabel=!1,
// t.showMark = true;
t.setTick(tt,this.name),this._ticks.push(t);var t=new this.tickRenderer(this.tickOptions);t.label=userTicks[i],
// t.showLabel = true;
t.showMark=!1,t.showGridline=!1,t.setTick(tt+.5,this.name),this._ticks.push(t)}
// now add the last tick at the end
var t=new this.tickRenderer(this.tickOptions);t.showLabel=!1,
// t.showMark = true;
t.setTick(tt+1,this.name),this._ticks.push(t)}else{dim="xaxis"==name||"x2axis"==name?this._plotDimensions.width:this._plotDimensions.height,
// if min, max and number of ticks specified, user can't specify interval.
null!=this.min&&null!=this.max&&null!=this.numberTicks&&(this.tickInterval=null),
// if max, min, and interval specified and interval won't fit, ignore interval.
null!=this.min&&null!=this.max&&null!=this.tickInterval&&parseInt((this.max-this.min)/this.tickInterval,10)!=(this.max-this.min)/this.tickInterval&&(this.tickInterval=null);for(var max,val,labels=[],numcats=0,min=.5,isMerged=!1,i=0;i<this._series.length;i++)for(var s=this._series[i],j=0;j<s.data.length;j++)val="xaxis"==this.name||"x2axis"==this.name?s.data[j][0]:s.data[j][1],-1==$.inArray(val,labels)&&(isMerged=!0,numcats+=1,labels.push(val));isMerged&&this.sortMergedLabels&&("string"==typeof labels[0]?labels.sort():labels.sort(function(a,b){return a-b})),
// keep a reference to these tick labels to use for redrawing plot (see bug #57)
this.ticks=labels;
// now bin the data values to the right lables.
for(var i=0;i<this._series.length;i++)for(var s=this._series[i],j=0;j<s.data.length;j++){val="xaxis"==this.name||"x2axis"==this.name?s.data[j][0]:s.data[j][1];
// for category axis, force the values into category bins.
// we should have the value in the label array now.
var idx=$.inArray(val,labels)+1;"xaxis"==this.name||"x2axis"==this.name?s.data[j][0]=idx:s.data[j][1]=idx}
// adjust with blanks if we have groups
if(this.groups>1&&!this._grouped){for(var l=labels.length,skip=parseInt(l/this.groups,10),count=0,i=skip;l>i;i+=skip+1)labels[i]=" ";this._grouped=!0}max=numcats+.5,null==this.numberTicks&&(this.numberTicks=2*numcats+1);var range=max-min;this.min=min,this.max=max;var track=0,maxVisibleTicks=parseInt(3+dim/10,10),skip=parseInt(numcats/maxVisibleTicks,10);null==this.tickInterval&&(this.tickInterval=range/(this.numberTicks-1));
// if tickInterval is specified, we will ignore any computed maximum.
for(var i=0;i<this.numberTicks;i++){tt=this.min+i*this.tickInterval;var t=new this.tickRenderer(this.tickOptions);
// if even tick, it isn't a category, it's a divider
i/2==parseInt(i/2,10)?(t.showLabel=!1,t.showMark=!0):(skip>0&&skip>track?(t.showLabel=!1,track+=1):(t.showLabel=!0,track=0),t.label=t.formatter(t.formatString,labels[(i-1)/2]),t.showMark=!1,t.showGridline=!1),t.setTick(tt,this.name),this._ticks.push(t)}}},
// called with scope of axis
$.jqplot.CategoryAxisRenderer.prototype.draw=function(ctx,plot){if(this.show){
// populate the axis label and value properties.
// createTicks is a method on the renderer, but
// call it within the scope of the axis.
this.renderer.createTicks.call(this);if(
// Added for theming.
this._elem&&
// this._elem.empty();
// Memory Leaks patch
this._elem.emptyForce(),this._elem=this._elem||$('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>'),"xaxis"==this.name||"x2axis"==this.name?this._elem.width(this._plotDimensions.width):this._elem.height(this._plotDimensions.height),
// create a _label object.
this.labelOptions.axis=this.name,this._label=new this.labelRenderer(this.labelOptions),this._label.show){var elem=this._label.draw(ctx,plot);elem.appendTo(this._elem)}for(var t=this._ticks,i=0;i<t.length;i++){var tick=t[i];if(tick.showLabel&&(!tick.isMinorTick||this.showMinorTicks)){var elem=tick.draw(ctx,plot);elem.appendTo(this._elem)}}this._groupLabels=[];
// now make group labels
for(var i=0;i<this.groupLabels.length;i++){var elem=$('<div style="position:absolute;" class="jqplot-'+this.name+'-groupLabel"></div>');elem.html(this.groupLabels[i]),this._groupLabels.push(elem),elem.appendTo(this._elem)}}return this._elem},
// called with scope of axis
$.jqplot.CategoryAxisRenderer.prototype.set=function(){var temp,dim=0,w=0,h=0,lshow=null==this._label?!1:this._label.show;if(this.show){for(var t=this._ticks,i=0;i<t.length;i++){var tick=t[i];!tick.showLabel||tick.isMinorTick&&!this.showMinorTicks||(temp="xaxis"==this.name||"x2axis"==this.name?tick._elem.outerHeight(!0):tick._elem.outerWidth(!0),temp>dim&&(dim=temp))}for(var dim2=0,i=0;i<this._groupLabels.length;i++){var l=this._groupLabels[i];temp="xaxis"==this.name||"x2axis"==this.name?l.outerHeight(!0):l.outerWidth(!0),temp>dim2&&(dim2=temp)}lshow&&(w=this._label._elem.outerWidth(!0),h=this._label._elem.outerHeight(!0)),"xaxis"==this.name?(dim+=dim2+h,this._elem.css({height:dim+"px",left:"0px",bottom:"0px"})):"x2axis"==this.name?(dim+=dim2+h,this._elem.css({height:dim+"px",left:"0px",top:"0px"})):"yaxis"==this.name?(dim+=dim2+w,this._elem.css({width:dim+"px",left:"0px",top:"0px"}),lshow&&this._label.constructor==$.jqplot.AxisLabelRenderer&&this._label._elem.css("width",w+"px")):(dim+=dim2+w,this._elem.css({width:dim+"px",right:"0px",top:"0px"}),lshow&&this._label.constructor==$.jqplot.AxisLabelRenderer&&this._label._elem.css("width",w+"px"))}},
// called with scope of axis
$.jqplot.CategoryAxisRenderer.prototype.pack=function(pos,offsets){var i,ticks=this._ticks,max=this.max,min=this.min,offmax=offsets.max,offmin=offsets.min,lshow=null==this._label?!1:this._label.show;for(var p in pos)this._elem.css(p,pos[p]);this._offsets=offsets;
// pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
var pixellength=offmax-offmin,unitlength=max-min;if(this.reverse?(
// point to unit and unit to point conversions references to Plot DOM element top left corner.
this.u2p=function(u){return offmin+(max-u)*pixellength/unitlength},this.p2u=function(p){return min+(p-offmin)*unitlength/pixellength},"xaxis"==this.name||"x2axis"==this.name?(this.series_u2p=function(u){return(max-u)*pixellength/unitlength},this.series_p2u=function(p){return p*unitlength/pixellength+max}):(this.series_u2p=function(u){return(min-u)*pixellength/unitlength},this.series_p2u=function(p){return p*unitlength/pixellength+min})):(
// point to unit and unit to point conversions references to Plot DOM element top left corner.
this.u2p=function(u){return(u-min)*pixellength/unitlength+offmin},this.p2u=function(p){return(p-offmin)*unitlength/pixellength+min},"xaxis"==this.name||"x2axis"==this.name?(this.series_u2p=function(u){return(u-min)*pixellength/unitlength},this.series_p2u=function(p){return p*unitlength/pixellength+min}):(this.series_u2p=function(u){return(u-max)*pixellength/unitlength},this.series_p2u=function(p){return p*unitlength/pixellength+max})),this.show)if("xaxis"==this.name||"x2axis"==this.name){for(i=0;i<ticks.length;i++){var t=ticks[i];if(t.show&&t.showLabel){var shim;if(t.constructor==$.jqplot.CanvasAxisTickRenderer&&t.angle){
// will need to adjust auto positioning based on which axis this is.
var temp="xaxis"==this.name?1:-1;switch(t.labelPosition){case"auto":
// position at end
shim=temp*t.angle<0?-t.getWidth()+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2:-t._textRenderer.height*Math.sin(t._textRenderer.angle)/2;break;case"end":shim=-t.getWidth()+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;case"start":shim=-t._textRenderer.height*Math.sin(t._textRenderer.angle)/2;break;case"middle":shim=-t.getWidth()/2+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;default:shim=-t.getWidth()/2+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2}}else shim=-t.getWidth()/2;var val=this.u2p(t.value)+shim+"px";t._elem.css("left",val),t.pack()}}var labeledge=["bottom",0];if(lshow){var w=this._label._elem.outerWidth(!0);this._label._elem.css("left",offmin+pixellength/2-w/2+"px"),"xaxis"==this.name?(this._label._elem.css("bottom","0px"),labeledge=["bottom",this._label._elem.outerHeight(!0)]):(this._label._elem.css("top","0px"),labeledge=["top",this._label._elem.outerHeight(!0)]),this._label.pack()}
// draw the group labels
var step=parseInt(this._ticks.length/this.groups,10)+1;for(i=0;i<this._groupLabels.length;i++){for(var mid=0,count=0,j=i*step;(i+1)*step>j;j++)if(!(j>=this._ticks.length-1)&&this._ticks[j]._elem&&" "!=this._ticks[j].label){var t=this._ticks[j]._elem,p=t.position();mid+=p.left+t.outerWidth(!0)/2,count++}mid/=count,this._groupLabels[i].css({left:mid-this._groupLabels[i].outerWidth(!0)/2}),this._groupLabels[i].css(labeledge[0],labeledge[1])}}else{for(i=0;i<ticks.length;i++){var t=ticks[i];if(t.show&&t.showLabel){var shim;if(t.constructor==$.jqplot.CanvasAxisTickRenderer&&t.angle){
// will need to adjust auto positioning based on which axis this is.
var temp="yaxis"==this.name?1:-1;switch(t.labelPosition){case"auto":
// position at end
case"end":shim=temp*t.angle<0?-t._textRenderer.height*Math.cos(-t._textRenderer.angle)/2:-t.getHeight()+t._textRenderer.height*Math.cos(t._textRenderer.angle)/2;break;case"start":shim=t.angle>0?-t._textRenderer.height*Math.cos(-t._textRenderer.angle)/2:-t.getHeight()+t._textRenderer.height*Math.cos(t._textRenderer.angle)/2;break;case"middle":
// if (t.angle > 0) {
//     shim = -t.getHeight()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
// }
// else {
//     shim = -t.getHeight()/2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
// }
shim=-t.getHeight()/2;break;default:shim=-t.getHeight()/2}}else shim=-t.getHeight()/2;var val=this.u2p(t.value)+shim+"px";t._elem.css("top",val),t.pack()}}var labeledge=["left",0];if(lshow){var h=this._label._elem.outerHeight(!0);this._label._elem.css("top",offmax-pixellength/2-h/2+"px"),"yaxis"==this.name?(this._label._elem.css("left","0px"),labeledge=["left",this._label._elem.outerWidth(!0)]):(this._label._elem.css("right","0px"),labeledge=["right",this._label._elem.outerWidth(!0)]),this._label.pack()}
// draw the group labels, position top here, do left after label position.
var step=parseInt(this._ticks.length/this.groups,10)+1;// step is one more than before as we don't want to have overlaps in loops
for(i=0;i<this._groupLabels.length;i++){for(var mid=0,count=0,j=i*step;(i+1)*step>j;j++)// j must never reach (i+1)*step as we don't want to have overlap between loops
if(!(j>=this._ticks.length-1)&&this._ticks[j]._elem&&" "!=this._ticks[j].label){var t=this._ticks[j]._elem,p=t.position();mid+=p.top+t.outerHeight()/2,count++}mid/=count,this._groupLabels[i].css({top:mid-this._groupLabels[i].outerHeight()/2}),this._groupLabels[i].css(labeledge[0],labeledge[1])}}}}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
function($){function bestDateInterval(min,max,titarget){for(var temp,bestTi,bestfmt,badness=Number.MAX_VALUE,i=0,l=niceIntervals.length;l>i;i++)temp=Math.abs(titarget-niceIntervals[i]),badness>temp&&(badness=temp,bestTi=niceIntervals[i],bestfmt=niceFormatStrings[i]);return[bestTi,bestfmt]}/**
     * Class: $.jqplot.DateAxisRenderer
     * A plugin for a jqPlot to render an axis as a series of date values.
     * This renderer has no options beyond those supplied by the <Axis> class.
     * It supplies its own tick formatter, so the tickOptions.formatter option
     * should not be overridden.
     * 
     * Thanks to Ken Synder for his enhanced Date instance methods which are
     * included with this code <http://kendsnyder.com/sandbox/date/>.
     * 
     * To use this renderer, include the plugin in your source
     * > <script type="text/javascript" language="javascript" src="plugins/jqplot.dateAxisRenderer.js"></script>
     * 
     * and supply the appropriate options to your plot
     * 
     * > {axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}}
     * 
     * Dates can be passed into the axis in almost any recognizable value and 
     * will be parsed.  They will be rendered on the axis in the format
     * specified by tickOptions.formatString.  e.g. tickOptions.formatString = '%Y-%m-%d'.
     * 
     * Accecptable format codes 
     * are:
     * 
     * > Code    Result                  Description
     * >             == Years ==
     * > %Y      2008                Four-digit year
     * > %y      08                  Two-digit year
     * >             == Months ==
     * > %m      09                  Two-digit month
     * > %#m     9                   One or two-digit month
     * > %B      September           Full month name
     * > %b      Sep                 Abbreviated month name
     * >             == Days ==
     * > %d      05                  Two-digit day of month
     * > %#d     5                   One or two-digit day of month
     * > %e      5                   One or two-digit day of month
     * > %A      Sunday              Full name of the day of the week
     * > %a      Sun                 Abbreviated name of the day of the week
     * > %w      0                   Number of the day of the week (0 = Sunday, 6 = Saturday)
     * > %o      th                  The ordinal suffix string following the day of the month
     * >             == Hours ==
     * > %H      23                  Hours in 24-hour format (two digits)
     * > %#H     3                   Hours in 24-hour integer format (one or two digits)
     * > %I      11                  Hours in 12-hour format (two digits)
     * > %#I     3                   Hours in 12-hour integer format (one or two digits)
     * > %p      PM                  AM or PM
     * >             == Minutes ==
     * > %M      09                  Minutes (two digits)
     * > %#M     9                   Minutes (one or two digits)
     * >             == Seconds ==
     * > %S      02                  Seconds (two digits)
     * > %#S     2                   Seconds (one or two digits)
     * > %s      1206567625723       Unix timestamp (Seconds past 1970-01-01 00:00:00)
     * >             == Milliseconds ==
     * > %N      008                 Milliseconds (three digits)
     * > %#N     8                   Milliseconds (one to three digits)
     * >             == Timezone ==
     * > %O      360                 difference in minutes between local time and GMT
     * > %Z      Mountain Standard Time  Name of timezone as reported by browser
     * > %G      -06:00              Hours and minutes between GMT
     * >             == Shortcuts ==
     * > %F      2008-03-26          %Y-%m-%d
     * > %T      05:06:30            %H:%M:%S
     * > %X      05:06:30            %H:%M:%S
     * > %x      03/26/08            %m/%d/%y
     * > %D      03/26/08            %m/%d/%y
     * > %#c     Wed Mar 26 15:31:00 2008  %a %b %e %H:%M:%S %Y
     * > %v      3-Sep-2008          %e-%b-%Y
     * > %R      15:31               %H:%M
     * > %r      3:31:00 PM          %I:%M:%S %p
     * >             == Characters ==
     * > %n      \n                  Newline
     * > %t      \t                  Tab
     * > %%      %                   Percent Symbol 
     */
$.jqplot.DateAxisRenderer=function(){$.jqplot.LinearAxisRenderer.call(this),this.date=new $.jsDate};var second=1e3,minute=60*second,hour=60*minute,day=24*hour,week=7*day,month=30.4368499*day,year=365.242199*day,niceFormatStrings=["%M:%S.%#N","%M:%S.%#N","%M:%S.%#N","%M:%S","%M:%S","%M:%S","%M:%S","%H:%M:%S","%H:%M:%S","%H:%M","%H:%M","%H:%M","%H:%M","%H:%M","%H:%M","%a %H:%M","%a %H:%M","%b %e %H:%M","%b %e %H:%M","%b %e %H:%M","%b %e %H:%M","%v","%v","%v","%v","%v","%v","%v"],niceIntervals=[.1*second,.2*second,.5*second,second,2*second,5*second,10*second,15*second,30*second,minute,2*minute,5*minute,10*minute,15*minute,30*minute,hour,2*hour,4*hour,6*hour,8*hour,12*hour,day,2*day,3*day,4*day,5*day,week,2*week];$.jqplot.DateAxisRenderer.prototype=new $.jqplot.LinearAxisRenderer,$.jqplot.DateAxisRenderer.prototype.constructor=$.jqplot.DateAxisRenderer,$.jqplot.DateTickFormatter=function(format,val){return format||(format="%Y/%m/%d"),$.jsDate.strftime(val,format)},$.jqplot.DateAxisRenderer.prototype.init=function(options){
// prop: tickRenderer
// A class of a rendering engine for creating the ticks labels displayed on the plot, 
// See <$.jqplot.AxisTickRenderer>.
// this.tickRenderer = $.jqplot.AxisTickRenderer;
// this.labelRenderer = $.jqplot.AxisLabelRenderer;
this.tickOptions.formatter=$.jqplot.DateTickFormatter,
// prop: tickInset
// Controls the amount to inset the first and last ticks from 
// the edges of the grid, in multiples of the tick interval.
// 0 is no inset, 0.5 is one half a tick interval, 1 is a full
// tick interval, etc.
this.tickInset=0,
// prop: drawBaseline
// True to draw the axis baseline.
this.drawBaseline=!0,
// prop: baselineWidth
// width of the baseline in pixels.
this.baselineWidth=null,
// prop: baselineColor
// CSS color spec for the baseline.
this.baselineColor=null,this.daTickInterval=null,this._daTickInterval=null,$.extend(!0,this,options);
// Go through all the series attached to this axis and find
// the min/max bounds for this axis.
for(var stats,sum,s,d,pd,sd,intv,db=this._dataBounds,i=0;i<this._series.length;i++){stats={intervals:[],frequencies:{},sortedIntervals:[],min:null,max:null,mean:null},sum=0,s=this._series[i],d=s.data,pd=s._plotData,sd=s._stackData,intv=0;for(var j=0;j<d.length;j++)"xaxis"==this.name||"x2axis"==this.name?(d[j][0]=new $.jsDate(d[j][0]).getTime(),pd[j][0]=new $.jsDate(d[j][0]).getTime(),sd[j][0]=new $.jsDate(d[j][0]).getTime(),(null!=d[j][0]&&d[j][0]<db.min||null==db.min)&&(db.min=d[j][0]),(null!=d[j][0]&&d[j][0]>db.max||null==db.max)&&(db.max=d[j][0]),j>0&&(intv=Math.abs(d[j][0]-d[j-1][0]),stats.intervals.push(intv),stats.frequencies.hasOwnProperty(intv)?stats.frequencies[intv]+=1:stats.frequencies[intv]=1),sum+=intv):(d[j][1]=new $.jsDate(d[j][1]).getTime(),pd[j][1]=new $.jsDate(d[j][1]).getTime(),sd[j][1]=new $.jsDate(d[j][1]).getTime(),(null!=d[j][1]&&d[j][1]<db.min||null==db.min)&&(db.min=d[j][1]),(null!=d[j][1]&&d[j][1]>db.max||null==db.max)&&(db.max=d[j][1]),j>0&&(intv=Math.abs(d[j][1]-d[j-1][1]),stats.intervals.push(intv),stats.frequencies.hasOwnProperty(intv)?stats.frequencies[intv]+=1:stats.frequencies[intv]=1)),sum+=intv;if(s.renderer.bands){if(s.renderer.bands.hiData.length)for(var bd=s.renderer.bands.hiData,j=0,l=bd.length;l>j;j++)"xaxis"===this.name||"x2axis"===this.name?(bd[j][0]=new $.jsDate(bd[j][0]).getTime(),(null!=bd[j][0]&&bd[j][0]>db.max||null==db.max)&&(db.max=bd[j][0])):(bd[j][1]=new $.jsDate(bd[j][1]).getTime(),(null!=bd[j][1]&&bd[j][1]>db.max||null==db.max)&&(db.max=bd[j][1]));if(s.renderer.bands.lowData.length)for(var bd=s.renderer.bands.lowData,j=0,l=bd.length;l>j;j++)"xaxis"===this.name||"x2axis"===this.name?(bd[j][0]=new $.jsDate(bd[j][0]).getTime(),(null!=bd[j][0]&&bd[j][0]<db.min||null==db.min)&&(db.min=bd[j][0])):(bd[j][1]=new $.jsDate(bd[j][1]).getTime(),(null!=bd[j][1]&&bd[j][1]<db.min||null==db.min)&&(db.min=bd[j][1]))}for(var n in stats.frequencies)stats.sortedIntervals.push({interval:n,frequency:stats.frequencies[n]});stats.sortedIntervals.sort(function(a,b){return b.frequency-a.frequency}),stats.min=$.jqplot.arrayMin(stats.intervals),stats.max=$.jqplot.arrayMax(stats.intervals),stats.mean=sum/d.length,this._intervalStats.push(stats),stats=sum=s=d=pd=sd=null}db=null},
// called with scope of an axis
$.jqplot.DateAxisRenderer.prototype.reset=function(){this.min=this._options.min,this.max=this._options.max,this.tickInterval=this._options.tickInterval,this.numberTicks=this._options.numberTicks,this._autoFormatString="",this._overrideFormatString&&this.tickOptions&&this.tickOptions.formatString&&(this.tickOptions.formatString=""),this.daTickInterval=this._daTickInterval},$.jqplot.DateAxisRenderer.prototype.createTicks=function(plot){
// we're are operating on an axis here
var min,max,tt,i,ticks=this._ticks,userTicks=this.ticks,name=this.name,db=this._dataBounds,dim=(this._intervalStats,"x"===this.name.charAt(0)?this._plotDimensions.width:this._plotDimensions.height),threshold=30,insetMult=1,daTickInterval=null;
// if user specified a tick interval, convert to usable.
if(null!=this.tickInterval)
// if interval is a number or can be converted to one, use it.
// Assume it is in SECONDS!!!
if(Number(this.tickInterval))daTickInterval=[Number(this.tickInterval),"seconds"];else if("string"==typeof this.tickInterval){var parts=this.tickInterval.split(" ");1==parts.length?daTickInterval=[1,parts[0]]:2==parts.length&&(daTickInterval=[parts[0],parts[1]])}this.tickInterval;min=new $.jsDate(null!=this.min?this.min:db.min).getTime(),max=new $.jsDate(null!=this.max?this.max:db.max).getTime();
// see if we're zooming.  if we are, don't use the min and max we're given,
// but compute some nice ones.  They will be reset later.
var cursor=plot.plugins.cursor;cursor&&cursor._zoom&&cursor._zoom.zooming&&(this.min=null,this.max=null);var range=max-min;if(null!=this.tickOptions&&this.tickOptions.formatString||(this._overrideFormatString=!0),userTicks.length){
// ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
for(i=0;i<userTicks.length;i++){var ut=userTicks[i],t=new this.tickRenderer(this.tickOptions);ut.constructor==Array?(t.value=new $.jsDate(ut[0]).getTime(),t.label=ut[1],this.showTicks?this.showTickMarks||(t.showMark=!1):(t.showLabel=!1,t.showMark=!1),t.setTick(t.value,this.name),this._ticks.push(t)):(t.value=new $.jsDate(ut).getTime(),this.showTicks?this.showTickMarks||(t.showMark=!1):(t.showLabel=!1,t.showMark=!1),t.setTick(t.value,this.name),this._ticks.push(t))}this.numberTicks=userTicks.length,this.min=this._ticks[0].value,this.max=this._ticks[this.numberTicks-1].value,this.daTickInterval=[(this.max-this.min)/(this.numberTicks-1)/1e3,"seconds"]}else if(null==this.min&&null==this.max&&db.min==db.max){var onePointOpts=$.extend(!0,{},this.tickOptions,{name:this.name,value:null}),delta=3e5;this.min=db.min-delta,this.max=db.max+delta,this.numberTicks=3;for(var i=this.min;i<=this.max;i+=delta){onePointOpts.value=i;var t=new this.tickRenderer(onePointOpts);this._overrideFormatString&&""!=this._autoFormatString&&(t.formatString=this._autoFormatString),t.showLabel=!1,t.showMark=!1,this._ticks.push(t)}this.showTicks&&(this._ticks[1].showLabel=!0),this.showTickMarks&&(this._ticks[1].showTickMarks=!0)}else if(null==this.min&&null==this.max){var nttarget,titarget,opts=$.extend(!0,{},this.tickOptions,{name:this.name,value:null});
// if no tickInterval or numberTicks options specified,  make a good guess.
if(this.tickInterval||this.numberTicks)this.tickInterval?titarget=new $.jsDate(0).add(daTickInterval[0],daTickInterval[1]).getTime():this.numberTicks&&(nttarget=this.numberTicks,titarget=(max-min)/(nttarget-1));else{var tdim=Math.max(dim,threshold+1),spacingFactor=115;this.tickRenderer===$.jqplot.CanvasAxisTickRenderer&&this.tickOptions.angle&&(spacingFactor=115-40*Math.abs(Math.sin(this.tickOptions.angle/180*Math.PI))),nttarget=Math.ceil((tdim-threshold)/spacingFactor+1),titarget=(max-min)/(nttarget-1)}
// If we can use an interval of 2 weeks or less, pick best one
if(19*day>=titarget){var ret=bestDateInterval(min,max,titarget),tempti=ret[0];this._autoFormatString=ret[1],min=new $.jsDate(min),min=Math.floor((min.getTime()-min.getUtcOffset())/tempti)*tempti+min.getUtcOffset(),nttarget=Math.ceil((max-min)/tempti)+1,this.min=min,this.max=min+(nttarget-1)*tempti,
// if max is less than max, add an interval
this.max<max&&(this.max+=tempti,nttarget+=1),this.tickInterval=tempti,this.numberTicks=nttarget;for(var i=0;nttarget>i;i++)opts.value=this.min+i*tempti,t=new this.tickRenderer(opts),this._overrideFormatString&&""!=this._autoFormatString&&(t.formatString=this._autoFormatString),this.showTicks?this.showTickMarks||(t.showMark=!1):(t.showLabel=!1,t.showMark=!1),this._ticks.push(t);insetMult=this.tickInterval}else if(9*month>=titarget){this._autoFormatString="%v";
// how many months in an interval?
var intv=Math.round(titarget/month);1>intv?intv=1:intv>6&&(intv=6);
// figure out the starting month and ending month.
var mstart=new $.jsDate(min).setDate(1).setHours(0,0,0,0),tempmend=new $.jsDate(max),mend=new $.jsDate(max).setDate(1).setHours(0,0,0,0);tempmend.getTime()!==mend.getTime()&&(mend=mend.add(1,"month"));var nmonths=mend.diff(mstart,"month");nttarget=Math.ceil(nmonths/intv)+1,this.min=mstart.getTime(),this.max=mstart.clone().add((nttarget-1)*intv,"month").getTime(),this.numberTicks=nttarget;for(var i=0;nttarget>i;i++)0===i?opts.value=mstart.getTime():opts.value=mstart.add(intv,"month").getTime(),t=new this.tickRenderer(opts),this._overrideFormatString&&""!=this._autoFormatString&&(t.formatString=this._autoFormatString),this.showTicks?this.showTickMarks||(t.showMark=!1):(t.showLabel=!1,t.showMark=!1),this._ticks.push(t);insetMult=intv*month}else{this._autoFormatString="%v";
// how many years in an interval?
var intv=Math.round(titarget/year);1>intv&&(intv=1);
// figure out the starting and ending years.
var mstart=new $.jsDate(min).setMonth(0,1).setHours(0,0,0,0),mend=new $.jsDate(max).add(1,"year").setMonth(0,1).setHours(0,0,0,0),nyears=mend.diff(mstart,"year");nttarget=Math.ceil(nyears/intv)+1,this.min=mstart.getTime(),this.max=mstart.clone().add((nttarget-1)*intv,"year").getTime(),this.numberTicks=nttarget;for(var i=0;nttarget>i;i++)0===i?opts.value=mstart.getTime():opts.value=mstart.add(intv,"year").getTime(),t=new this.tickRenderer(opts),this._overrideFormatString&&""!=this._autoFormatString&&(t.formatString=this._autoFormatString),this.showTicks?this.showTickMarks||(t.showMark=!1):(t.showLabel=!1,t.showMark=!1),this._ticks.push(t);insetMult=intv*year}}else{
// if min and max are same, space them out a bit
if(dim="xaxis"==name||"x2axis"==name?this._plotDimensions.width:this._plotDimensions.height,null!=this.min&&null!=this.max&&null!=this.numberTicks&&(this.tickInterval=null),null!=this.tickInterval&&null!=daTickInterval&&(this.daTickInterval=daTickInterval),min==max){var adj=432e5;// 1/2 day
min-=adj,max+=adj}range=max-min;var rmin,rmax;2+parseInt(Math.max(0,dim-100)/100,10);if(rmin=null!=this.min?new $.jsDate(this.min).getTime():min-range/2*(this.padMin-1),rmax=null!=this.max?new $.jsDate(this.max).getTime():max+range/2*(this.padMax-1),this.min=rmin,this.max=rmax,range=this.max-this.min,null==this.numberTicks)
// if tickInterval is specified by user, we will ignore computed maximum.
// max will be equal or greater to fit even # of ticks.
if(null!=this.daTickInterval){var nc=new $.jsDate(this.max).diff(this.min,this.daTickInterval[1],!0);this.numberTicks=Math.ceil(nc/this.daTickInterval[0])+1,
// this.max = new $.jsDate(this.min).add(this.numberTicks-1, this.daTickInterval[1]).getTime();
this.max=new $.jsDate(this.min).add((this.numberTicks-1)*this.daTickInterval[0],this.daTickInterval[1]).getTime()}else dim>200?this.numberTicks=parseInt(3+(dim-200)/100,10):this.numberTicks=2;insetMult=range/(this.numberTicks-1)/1e3,null==this.daTickInterval&&(this.daTickInterval=[insetMult,"seconds"]);for(var i=0;i<this.numberTicks;i++){var min=new $.jsDate(this.min);tt=min.add(i*this.daTickInterval[0],this.daTickInterval[1]).getTime();var t=new this.tickRenderer(this.tickOptions);
// var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
this.showTicks?this.showTickMarks||(t.showMark=!1):(t.showLabel=!1,t.showMark=!1),t.setTick(tt,this.name),this._ticks.push(t)}}this.tickInset&&(this.min=this.min-this.tickInset*insetMult,this.max=this.max+this.tickInset*insetMult),null==this._daTickInterval&&(this._daTickInterval=this.daTickInterval),ticks=null}}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
function($){
// class $.jqplot.EnhancedLegendRenderer
// Legend renderer which can specify the number of rows and/or columns in the legend.
$.jqplot.EnhancedLegendRenderer=function(){$.jqplot.TableLegendRenderer.call(this)},$.jqplot.EnhancedLegendRenderer.prototype=new $.jqplot.TableLegendRenderer,$.jqplot.EnhancedLegendRenderer.prototype.constructor=$.jqplot.EnhancedLegendRenderer,
// called with scope of legend.
$.jqplot.EnhancedLegendRenderer.prototype.init=function(options){
// prop: numberRows
// Maximum number of rows in the legend.  0 or null for unlimited.
this.numberRows=null,
// prop: numberColumns
// Maximum number of columns in the legend.  0 or null for unlimited.
this.numberColumns=null,
// prop: seriesToggle
// false to not enable series on/off toggling on the legend.
// true or a fadein/fadeout speed (number of milliseconds or 'fast', 'normal', 'slow') 
// to enable show/hide of series on click of legend item.
this.seriesToggle="normal",
// prop: seriesToggleReplot
// True to replot the chart after toggling series on/off.
// This will set the series show property to false.
// This allows for rescaling or other maniplation of chart.
// Set to an options object (e.g. {resetAxes: true}) for replot options.
this.seriesToggleReplot=!1,
// prop: disableIEFading
// true to toggle series with a show/hide method only and not allow fading in/out.  
// This is to overcome poor performance of fade in some versions of IE.
this.disableIEFading=!0,$.extend(!0,this,options),this.seriesToggle&&$.jqplot.postDrawHooks.push(postDraw)},
// called with scope of legend
$.jqplot.EnhancedLegendRenderer.prototype.draw=function(offsets,plot){if(this.show){var s,series=this._series,ss="position:absolute;";ss+=this.background?"background:"+this.background+";":"",ss+=this.border?"border:"+this.border+";":"",ss+=this.fontSize?"font-size:"+this.fontSize+";":"",ss+=this.fontFamily?"font-family:"+this.fontFamily+";":"",ss+=this.textColor?"color:"+this.textColor+";":"",ss+=null!=this.marginTop?"margin-top:"+this.marginTop+";":"",ss+=null!=this.marginBottom?"margin-bottom:"+this.marginBottom+";":"",ss+=null!=this.marginLeft?"margin-left:"+this.marginLeft+";":"",ss+=null!=this.marginRight?"margin-right:"+this.marginRight+";":"",this._elem=$('<table class="jqplot-table-legend" style="'+ss+'"></table>'),this.seriesToggle&&this._elem.css("z-index","3");var nr,nc,pad=!1,reverse=!1;this.numberRows?(nr=this.numberRows,nc=this.numberColumns?this.numberColumns:Math.ceil(series.length/nr)):this.numberColumns?(nc=this.numberColumns,nr=Math.ceil(series.length/this.numberColumns)):(nr=series.length,nc=1);var i,j,tr,td1,td2,lt,rs,div0,div1,idx=0;
// check to see if we need to reverse
for(i=series.length-1;i>=0;i--)(1==nc&&series[i]._stack||series[i].renderer.constructor==$.jqplot.BezierCurveRenderer)&&(reverse=!0);for(i=0;nr>i;i++){for(tr=$(document.createElement("tr")),tr.addClass("jqplot-table-legend"),reverse?tr.prependTo(this._elem):tr.appendTo(this._elem),j=0;nc>j;j++){if(idx<series.length&&(series[idx].show||series[idx].showLabel)&&(s=series[idx],lt=this.labels[idx]||s.label.toString())){var color=s.color;if(pad=reverse?i==nr-1?!1:!0:i>0?!0:!1,rs=pad?this.rowSpacing:"0",td1=$(document.createElement("td")),td1.addClass("jqplot-table-legend jqplot-table-legend-swatch"),td1.css({textAlign:"center",paddingTop:rs}),div0=$(document.createElement("div")),div0.addClass("jqplot-table-legend-swatch-outline"),div1=$(document.createElement("div")),div1.addClass("jqplot-table-legend-swatch"),div1.css({backgroundColor:color,borderColor:color}),td1.append(div0.append(div1)),td2=$(document.createElement("td")),td2.addClass("jqplot-table-legend jqplot-table-legend-label"),td2.css("paddingTop",rs),this.escapeHtml?td2.text(lt):td2.html(lt),reverse?(this.showLabels&&td2.prependTo(tr),this.showSwatches&&td1.prependTo(tr)):(this.showSwatches&&td1.appendTo(tr),this.showLabels&&td2.appendTo(tr)),this.seriesToggle){
// add an overlay for clicking series on/off
// div0 = $(document.createElement('div'));
// div0.addClass('jqplot-table-legend-overlay');
// div0.css({position:'relative', left:0, top:0, height:'100%', width:'100%'});
// tr.append(div0);
var speed;("string"==typeof this.seriesToggle||"number"==typeof this.seriesToggle)&&($.jqplot.use_excanvas&&this.disableIEFading||(speed=this.seriesToggle)),this.showSwatches&&(td1.bind("click",{series:s,speed:speed,plot:plot,replot:this.seriesToggleReplot},handleToggle),td1.addClass("jqplot-seriesToggle")),this.showLabels&&(td2.bind("click",{series:s,speed:speed,plot:plot,replot:this.seriesToggleReplot},handleToggle),td2.addClass("jqplot-seriesToggle")),
// for series that are already hidden, add the hidden class
!s.show&&s.showLabel&&(td1.addClass("jqplot-series-hidden"),td2.addClass("jqplot-series-hidden"))}pad=!0}idx++}td1=td2=div0=div1=null}}return this._elem};var handleToggle=function(ev){var d=ev.data,s=d.series,replot=d.replot,plot=d.plot,speed=d.speed,sidx=s.index,showing=!1;(s.canvas._elem.is(":hidden")||!s.show)&&(showing=!0);var doLegendToggle=function(){if(replot){var opts={};
// if showing, there was no canvas element to fade in, so hide here
// and then do a fade in.
if($.isPlainObject(replot)&&$.extend(!0,opts,replot),plot.replot(opts),showing&&speed){var s=plot.series[sidx];s.shadowCanvas._elem&&s.shadowCanvas._elem.hide().fadeIn(speed),s.canvas._elem.hide().fadeIn(speed),s.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+s.index).hide().fadeIn(speed)}}else{var s=plot.series[sidx];s.canvas._elem.is(":hidden")||!s.show?(
// Not sure if there is a better way to check for showSwatches and showLabels === true.
// Test for "undefined" since default values for both showSwatches and showLables is true.
("undefined"==typeof plot.options.legend.showSwatches||plot.options.legend.showSwatches===!0)&&plot.legend._elem.find("td").eq(2*sidx).addClass("jqplot-series-hidden"),("undefined"==typeof plot.options.legend.showLabels||plot.options.legend.showLabels===!0)&&plot.legend._elem.find("td").eq(2*sidx+1).addClass("jqplot-series-hidden")):(("undefined"==typeof plot.options.legend.showSwatches||plot.options.legend.showSwatches===!0)&&plot.legend._elem.find("td").eq(2*sidx).removeClass("jqplot-series-hidden"),("undefined"==typeof plot.options.legend.showLabels||plot.options.legend.showLabels===!0)&&plot.legend._elem.find("td").eq(2*sidx+1).removeClass("jqplot-series-hidden"))}};s.toggleDisplay(ev,doLegendToggle)},postDraw=function(){if(this.legend.renderer.constructor==$.jqplot.EnhancedLegendRenderer&&this.legend.seriesToggle){var e=this.legend._elem.detach();this.eventCanvas._elem.after(e)}}}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
function($){function draw(plot,neighbor){var hl=plot.plugins.highlighter,s=plot.series[neighbor.seriesIndex],smr=s.markerRenderer,mr=hl.markerRenderer;mr.style=smr.style,mr.lineWidth=smr.lineWidth+hl.lineWidthAdjust,mr.size=smr.size+hl.sizeAdjust;var rgba=$.jqplot.getColorComponents(smr.color),newrgb=[rgba[0],rgba[1],rgba[2]],alpha=rgba[3]>=.6?.6*rgba[3]:rgba[3]*(2-rgba[3]);mr.color="rgba("+newrgb[0]+","+newrgb[1]+","+newrgb[2]+","+alpha+")",mr.init(),mr.draw(s.gridData[neighbor.pointIndex][0],s.gridData[neighbor.pointIndex][1],hl.highlightCanvas._ctx)}function showTooltip(plot,series,neighbor){
// neighbor looks like: {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]}
// gridData should be x,y pixel coords on the grid.
// add the plot._gridPadding to that to get x,y in the target.
var hl=plot.plugins.highlighter,elem=hl._tooltipElem,serieshl=series.highlighter||{},opts=$.extend(!0,{},hl,serieshl);if(opts.useAxesFormatters){for(var str,xf=series._xaxis._ticks[0].formatter,yf=series._yaxis._ticks[0].formatter,xfstr=series._xaxis._ticks[0].formatString,yfstr=series._yaxis._ticks[0].formatString,xstr=xf(xfstr,neighbor.data[0]),ystrs=[],i=1;i<opts.yvalues+1;i++)ystrs.push(yf(yfstr,neighbor.data[i]));if("string"==typeof opts.formatString)switch(opts.tooltipAxes){case"both":case"xy":ystrs.unshift(xstr),ystrs.unshift(opts.formatString),str=$.jqplot.sprintf.apply($.jqplot.sprintf,ystrs);break;case"yx":ystrs.push(xstr),ystrs.unshift(opts.formatString),str=$.jqplot.sprintf.apply($.jqplot.sprintf,ystrs);break;case"x":str=$.jqplot.sprintf.apply($.jqplot.sprintf,[opts.formatString,xstr]);break;case"y":ystrs.unshift(opts.formatString),str=$.jqplot.sprintf.apply($.jqplot.sprintf,ystrs);break;default:// same as xy
ystrs.unshift(xstr),ystrs.unshift(opts.formatString),str=$.jqplot.sprintf.apply($.jqplot.sprintf,ystrs)}else switch(opts.tooltipAxes){case"both":case"xy":str=xstr;for(var i=0;i<ystrs.length;i++)str+=opts.tooltipSeparator+ystrs[i];break;case"yx":str="";for(var i=0;i<ystrs.length;i++)str+=ystrs[i]+opts.tooltipSeparator;str+=xstr;break;case"x":str=xstr;break;case"y":str=ystrs.join(opts.tooltipSeparator);break;default:// same as 'xy'
str=xstr;for(var i=0;i<ystrs.length;i++)str+=opts.tooltipSeparator+ystrs[i]}}else{var str;"string"==typeof opts.formatString?str=$.jqplot.sprintf.apply($.jqplot.sprintf,[opts.formatString].concat(neighbor.data)):"both"==opts.tooltipAxes||"xy"==opts.tooltipAxes?str=$.jqplot.sprintf(opts.tooltipFormatString,neighbor.data[0])+opts.tooltipSeparator+$.jqplot.sprintf(opts.tooltipFormatString,neighbor.data[1]):"yx"==opts.tooltipAxes?str=$.jqplot.sprintf(opts.tooltipFormatString,neighbor.data[1])+opts.tooltipSeparator+$.jqplot.sprintf(opts.tooltipFormatString,neighbor.data[0]):"x"==opts.tooltipAxes?str=$.jqplot.sprintf(opts.tooltipFormatString,neighbor.data[0]):"y"==opts.tooltipAxes&&(str=$.jqplot.sprintf(opts.tooltipFormatString,neighbor.data[1]))}$.isFunction(opts.tooltipContentEditor)&&(
// args str, seriesIndex, pointIndex are essential so the hook can look up
// extra data for the point.
str=opts.tooltipContentEditor(str,neighbor.seriesIndex,neighbor.pointIndex,plot)),elem.html(str);var gridpos={x:neighbor.gridData[0],y:neighbor.gridData[1]},ms=0,fact=.707;1==series.markerRenderer.show&&(ms=(series.markerRenderer.size+opts.sizeAdjust)/2);var loc=locations;switch(series.fillToZero&&series.fill&&neighbor.data[1]<0&&(loc=oppositeLocations),loc[locationIndicies[opts.tooltipLocation]]){case"nw":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)-opts.tooltipOffset-fact*ms,y=gridpos.y+plot._gridPadding.top-opts.tooltipOffset-elem.outerHeight(!0)-fact*ms;break;case"n":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)/2,y=gridpos.y+plot._gridPadding.top-opts.tooltipOffset-elem.outerHeight(!0)-ms;break;case"ne":var x=gridpos.x+plot._gridPadding.left+opts.tooltipOffset+fact*ms,y=gridpos.y+plot._gridPadding.top-opts.tooltipOffset-elem.outerHeight(!0)-fact*ms;break;case"e":var x=gridpos.x+plot._gridPadding.left+opts.tooltipOffset+ms,y=gridpos.y+plot._gridPadding.top-elem.outerHeight(!0)/2;break;case"se":var x=gridpos.x+plot._gridPadding.left+opts.tooltipOffset+fact*ms,y=gridpos.y+plot._gridPadding.top+opts.tooltipOffset+fact*ms;break;case"s":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)/2,y=gridpos.y+plot._gridPadding.top+opts.tooltipOffset+ms;break;case"sw":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)-opts.tooltipOffset-fact*ms,y=gridpos.y+plot._gridPadding.top+opts.tooltipOffset+fact*ms;break;case"w":var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)-opts.tooltipOffset-ms,y=gridpos.y+plot._gridPadding.top-elem.outerHeight(!0)/2;break;default:// same as 'nw'
var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(!0)-opts.tooltipOffset-fact*ms,y=gridpos.y+plot._gridPadding.top-opts.tooltipOffset-elem.outerHeight(!0)-fact*ms}elem.css("left",x),elem.css("top",y),opts.fadeTooltip?
// Fix for stacked up animations.  Thnanks Trevor!
elem.stop(!0,!0).fadeIn(opts.tooltipFadeSpeed):elem.show(),elem=null}function handleMove(ev,gridpos,datapos,neighbor,plot){var hl=plot.plugins.highlighter,c=plot.plugins.cursor;if(hl.show)if(null==neighbor&&hl.isHighlighting){var evt=jQuery.Event("jqplotHighlighterUnhighlight");plot.target.trigger(evt);var ctx=hl.highlightCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),hl.fadeTooltip?hl._tooltipElem.fadeOut(hl.tooltipFadeSpeed):hl._tooltipElem.hide(),hl.bringSeriesToFront&&plot.restorePreviousSeriesOrder(),hl.isHighlighting=!1,hl.currentNeighbor=null,ctx=null}else if(null!=neighbor&&plot.series[neighbor.seriesIndex].showHighlight&&!hl.isHighlighting){var evt=jQuery.Event("jqplotHighlighterHighlight");evt.which=ev.which,evt.pageX=ev.pageX,evt.pageY=ev.pageY;var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data,plot];plot.target.trigger(evt,ins),hl.isHighlighting=!0,hl.currentNeighbor=neighbor,hl.showMarker&&draw(plot,neighbor),!plot.series[neighbor.seriesIndex].show||!hl.showTooltip||c&&c._zoom.started||showTooltip(plot,plot.series[neighbor.seriesIndex],neighbor),hl.bringSeriesToFront&&plot.moveSeriesToFront(neighbor.seriesIndex)}else if(null!=neighbor&&hl.isHighlighting&&hl.currentNeighbor!=neighbor&&plot.series[neighbor.seriesIndex].showHighlight){var ctx=hl.highlightCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height),hl.isHighlighting=!0,hl.currentNeighbor=neighbor,hl.showMarker&&draw(plot,neighbor),!plot.series[neighbor.seriesIndex].show||!hl.showTooltip||c&&c._zoom.started||showTooltip(plot,plot.series[neighbor.seriesIndex],neighbor),hl.bringSeriesToFront&&plot.moveSeriesToFront(neighbor.seriesIndex)}}$.jqplot.eventListenerHooks.push(["jqplotMouseMove",handleMove]),/**
     * Class: $.jqplot.Highlighter
     * Plugin which will highlight data points when they are moused over.
     * 
     * To use this plugin, include the js
     * file in your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.highlighter.js"></script>
     * 
     * A tooltip providing information about the data point is enabled by default.
     * To disable the tooltip, set "showTooltip" to false.
     * 
     * You can control what data is displayed in the tooltip with various
     * options.  The "tooltipAxes" option controls whether the x, y or both
     * data values are displayed.
     * 
     * Some chart types (e.g. hi-low-close) have more than one y value per
     * data point. To display the additional values in the tooltip, set the
     * "yvalues" option to the desired number of y values present (3 for a hlc chart).
     * 
     * By default, data values will be formatted with the same formatting
     * specifiers as used to format the axis ticks.  A custom format code
     * can be supplied with the tooltipFormatString option.  This will apply 
     * to all values in the tooltip.  
     * 
     * For more complete control, the "formatString" option can be set.  This
     * Allows conplete control over tooltip formatting.  Values are passed to
     * the format string in an order determined by the "tooltipAxes" and "yvalues"
     * options.  So, if you have a hi-low-close chart and you just want to display 
     * the hi-low-close values in the tooltip, you could set a formatString like:
     * 
     * > highlighter: {
     * >     tooltipAxes: 'y',
     * >     yvalues: 3,
     * >     formatString:'<table class="jqplot-highlighter">
     * >         <tr><td>hi:</td><td>%s</td></tr>
     * >         <tr><td>low:</td><td>%s</td></tr>
     * >         <tr><td>close:</td><td>%s</td></tr></table>'
     * > }
     * 
     */
$.jqplot.Highlighter=function(options){
// Group: Properties
//
//prop: show
// true to show the highlight.
this.show=$.jqplot.config.enablePlugins,
// prop: markerRenderer
// Renderer used to draw the marker of the highlighted point.
// Renderer will assimilate attributes from the data point being highlighted,
// so no attributes need set on the renderer directly.
// Default is to turn off shadow drawing on the highlighted point.
this.markerRenderer=new $.jqplot.MarkerRenderer({shadow:!1}),
// prop: showMarker
// true to show the marker
this.showMarker=!0,
// prop: lineWidthAdjust
// Pixels to add to the lineWidth of the highlight.
this.lineWidthAdjust=2.5,
// prop: sizeAdjust
// Pixels to add to the overall size of the highlight.
this.sizeAdjust=5,
// prop: showTooltip
// Show a tooltip with data point values.
this.showTooltip=!0,
// prop: tooltipLocation
// Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
this.tooltipLocation="nw",
// prop: fadeTooltip
// true = fade in/out tooltip, flase = show/hide tooltip
this.fadeTooltip=!0,
// prop: tooltipFadeSpeed
// 'slow', 'def', 'fast', or number of milliseconds.
this.tooltipFadeSpeed="fast",
// prop: tooltipOffset
// Pixel offset of tooltip from the highlight.
this.tooltipOffset=2,
// prop: tooltipAxes
// Which axes to display in tooltip, 'x', 'y' or 'both', 'xy' or 'yx'
// 'both' and 'xy' are equivalent, 'yx' reverses order of labels.
this.tooltipAxes="both",
// prop; tooltipSeparator
// String to use to separate x and y axes in tooltip.
this.tooltipSeparator=", ",
// prop; tooltipContentEditor
// Function used to edit/augment/replace the formatted tooltip contents.
// Called as str = tooltipContentEditor(str, seriesIndex, pointIndex)
// where str is the generated tooltip html and seriesIndex and pointIndex identify
// the data point being highlighted. Should return the html for the tooltip contents.
this.tooltipContentEditor=null,
// prop: useAxesFormatters
// Use the x and y axes formatters to format the text in the tooltip.
this.useAxesFormatters=!0,
// prop: tooltipFormatString
// sprintf format string for the tooltip.
// Uses Ash Searle's javascript sprintf implementation
// found here: http://hexmen.com/blog/2007/03/printf-sprintf/
// See http://perldoc.perl.org/functions/sprintf.html for reference.
// Additional "p" and "P" format specifiers added by Chris Leonello.
this.tooltipFormatString="%.5P",
// prop: formatString
// alternative to tooltipFormatString
// will format the whole tooltip text, populating with x, y values as
// indicated by tooltipAxes option.  So, you could have a tooltip like:
// 'Date: %s, number of cats: %d' to format the whole tooltip at one go.
// If useAxesFormatters is true, values will be formatted according to
// Axes formatters and you can populate your tooltip string with 
// %s placeholders.
this.formatString=null,
// prop: yvalues
// Number of y values to expect in the data point array.
// Typically this is 1.  Certain plots, like OHLC, will
// have more y values in each data point array.
this.yvalues=1,
// prop: bringSeriesToFront
// This option requires jQuery 1.4+
// True to bring the series of the highlighted point to the front
// of other series.
this.bringSeriesToFront=!1,this._tooltipElem,this.isHighlighting=!1,this.currentNeighbor=null,$.extend(!0,this,options)};var locations=["nw","n","ne","e","se","s","sw","w"],locationIndicies={nw:0,n:1,ne:2,e:3,se:4,s:5,sw:6,w:7},oppositeLocations=["se","s","sw","w","nw","n","ne","e"];
// axis.renderer.tickrenderer.formatter
// called with scope of plot
$.jqplot.Highlighter.init=function(target,data,opts){var options=opts||{};
// add a highlighter attribute to the plot
this.plugins.highlighter=new $.jqplot.Highlighter(options.highlighter)},
// called within scope of series
$.jqplot.Highlighter.parseOptions=function(defaults,options){
// Add a showHighlight option to the series 
// and set it to true by default.
this.showHighlight=!0},
// called within context of plot
// create a canvas which we can draw on.
// insert it before the eventCanvas, so eventCanvas will still capture events.
$.jqplot.Highlighter.postPlotDraw=function(){
// Memory Leaks patch    
this.plugins.highlighter&&this.plugins.highlighter.highlightCanvas&&(this.plugins.highlighter.highlightCanvas.resetCanvas(),this.plugins.highlighter.highlightCanvas=null),this.plugins.highlighter&&this.plugins.highlighter._tooltipElem&&(this.plugins.highlighter._tooltipElem.emptyForce(),this.plugins.highlighter._tooltipElem=null),this.plugins.highlighter.highlightCanvas=new $.jqplot.GenericCanvas,this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding,"jqplot-highlight-canvas",this._plotDimensions,this)),this.plugins.highlighter.highlightCanvas.setContext();var elem=document.createElement("div");this.plugins.highlighter._tooltipElem=$(elem),elem=null,this.plugins.highlighter._tooltipElem.addClass("jqplot-highlighter-tooltip"),this.plugins.highlighter._tooltipElem.css({position:"absolute",display:"none"}),this.eventCanvas._elem.before(this.plugins.highlighter._tooltipElem)},$.jqplot.preInitHooks.push($.jqplot.Highlighter.init),$.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Highlighter.parseOptions),$.jqplot.postDrawHooks.push($.jqplot.Highlighter.postPlotDraw)}(jQuery),/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
function($){/**
     * Class: $.jqplot.PointLabels
     * Plugin for putting labels at the data points.
     * 
     * To use this plugin, include the js
     * file in your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.pointLabels.js"></script>
     * 
     * By default, the last value in the data ponit array in the data series is used
     * for the label.  For most series renderers, extra data can be added to the 
     * data point arrays and the last value will be used as the label.
     * 
     * For instance, 
     * this series:
     * 
     * > [[1,4], [3,5], [7,2]]
     * 
     * Would, by default, use the y values in the labels.
     * Extra data can be added to the series like so:
     * 
     * > [[1,4,'mid'], [3 5,'hi'], [7,2,'low']]
     * 
     * And now the point labels would be 'mid', 'low', and 'hi'.
     * 
     * Options to the point labels and a custom labels array can be passed into the
     * "pointLabels" option on the series option like so:
     * 
     * > series:[{pointLabels:{
     * >    labels:['mid', 'hi', 'low'],
     * >    location:'se',
     * >    ypadding: 12
     * >    }
     * > }]
     * 
     * A custom labels array in the options takes precendence over any labels
     * in the series data.  If you have a custom labels array in the options,
     * but still want to use values from the series array as labels, set the
     * "labelsFromSeries" option to true.
     * 
     * By default, html entities (<, >, etc.) are escaped in point labels.  
     * If you want to include actual html markup in the labels, 
     * set the "escapeHTML" option to false.
     * 
     */
$.jqplot.PointLabels=function(options){
// Group: Properties
//
// prop: show
// show the labels or not.
this.show=$.jqplot.config.enablePlugins,
// prop: location
// compass location where to position the label around the point.
// 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
this.location="n",
// prop: labelsFromSeries
// true to use labels within data point arrays.
this.labelsFromSeries=!1,
// prop: seriesLabelIndex
// array index for location of labels within data point arrays.
// if null, will use the last element of the data point array.
this.seriesLabelIndex=null,
// prop: labels
// array of arrays of labels, one array for each series.
this.labels=[],
// actual labels that will get displayed.
// needed to preserve user specified labels in labels array.
this._labels=[],
// prop: stackedValue
// true to display value as stacked in a stacked plot.
// no effect if labels is specified.
this.stackedValue=!1,
// prop: ypadding
// vertical padding in pixels between point and label
this.ypadding=6,
// prop: xpadding
// horizontal padding in pixels between point and label
this.xpadding=6,
// prop: escapeHTML
// true to escape html entities in the labels.
// If you want to include markup in the labels, set to false.
this.escapeHTML=!0,
// prop: edgeTolerance
// Number of pixels that the label must be away from an axis
// boundary in order to be drawn.  Negative values will allow overlap
// with the grid boundaries.
this.edgeTolerance=-5,
// prop: formatter
// A class of a formatter for the tick text.  sprintf by default.
this.formatter=$.jqplot.DefaultTickFormatter,
// prop: formatString
// string passed to the formatter.
this.formatString="",
// prop: hideZeros
// true to not show a label for a value which is 0.
this.hideZeros=!1,this._elems=[],$.extend(!0,this,options)};var locationIndicies={nw:0,n:1,ne:2,e:3,se:4,s:5,sw:6,w:7},oppositeLocations=["se","s","sw","w","nw","n","ne","e"];
// called with scope of a series
$.jqplot.PointLabels.init=function(target,data,seriesDefaults,opts,plot){var options=$.extend(!0,{},seriesDefaults,opts);options.pointLabels=options.pointLabels||{},this.renderer.constructor!==$.jqplot.BarRenderer||"horizontal"!==this.barDirection||options.pointLabels.location||(options.pointLabels.location="e"),
// add a pointLabels attribute to the series plugins
this.plugins.pointLabels=new $.jqplot.PointLabels(options.pointLabels),this.plugins.pointLabels.setLabels.call(this)},
// called with scope of series
$.jqplot.PointLabels.prototype.setLabels=function(){var labelIdx,p=this.plugins.pointLabels;if(labelIdx=null!=p.seriesLabelIndex?p.seriesLabelIndex:this.renderer.constructor===$.jqplot.BarRenderer&&"horizontal"===this.barDirection?this._plotData[0].length<3?0:this._plotData[0].length-1:0===this._plotData.length?0:this._plotData[0].length-1,p._labels=[],0===p.labels.length||p.labelsFromSeries)if(p.stackedValue){if(this._plotData.length&&this._plotData[0].length)
// var idx = p.seriesLabelIndex || this._plotData[0].length -1;
for(var i=0;i<this._plotData.length;i++)p._labels.push(this._plotData[i][labelIdx])}else{
// var d = this._plotData;
var d=this.data;if(this.renderer.constructor===$.jqplot.BarRenderer&&this.waterfall&&(d=this._data),d.length&&d[0].length)
// var idx = p.seriesLabelIndex || d[0].length -1;
for(var i=0;i<d.length;i++)p._labels.push(d[i][labelIdx]);d=null}else p.labels.length&&(p._labels=p.labels)},$.jqplot.PointLabels.prototype.xOffset=function(elem,location,padding){location=location||this.location,padding=padding||this.xpadding;var offset;switch(location){case"nw":offset=-elem.outerWidth(!0)-this.xpadding;break;case"n":offset=-elem.outerWidth(!0)/2;break;case"ne":offset=this.xpadding;break;case"e":offset=this.xpadding;break;case"se":offset=this.xpadding;break;case"s":offset=-elem.outerWidth(!0)/2;break;case"sw":offset=-elem.outerWidth(!0)-this.xpadding;break;case"w":offset=-elem.outerWidth(!0)-this.xpadding;break;default:// same as 'nw'
offset=-elem.outerWidth(!0)-this.xpadding}return offset},$.jqplot.PointLabels.prototype.yOffset=function(elem,location,padding){location=location||this.location,padding=padding||this.xpadding;var offset;switch(location){case"nw":offset=-elem.outerHeight(!0)-this.ypadding;break;case"n":offset=-elem.outerHeight(!0)-this.ypadding;break;case"ne":offset=-elem.outerHeight(!0)-this.ypadding;break;case"e":offset=-elem.outerHeight(!0)/2;break;case"se":offset=this.ypadding;break;case"s":offset=this.ypadding;break;case"sw":offset=this.ypadding;break;case"w":offset=-elem.outerHeight(!0)/2;break;default:// same as 'nw'
offset=-elem.outerHeight(!0)-this.ypadding}return offset},
// called with scope of series
$.jqplot.PointLabels.draw=function(sctx,options,plot){var p=this.plugins.pointLabels;
// set labels again in case they have changed.
p.setLabels.call(this);
// remove any previous labels
for(var i=0;i<p._elems.length;i++)
// Memory Leaks patch
// p._elems[i].remove();
p._elems[i].emptyForce();if(p._elems.splice(0,p._elems.length),p.show){var ax="_"+this._stackAxis+"axis";p.formatString||(p.formatString=this[ax]._ticks[0].formatString,p.formatter=this[ax]._ticks[0].formatter);for(var elem,helem,pd=this._plotData,xax=(this._prevPlotData,this._xaxis),yax=this._yaxis,i=0,l=p._labels.length;l>i;i++){var label=p._labels[i];if(!(null==label||p.hideZeros&&0==parseInt(label,10))){label=p.formatter(p.formatString,label),helem=document.createElement("div"),p._elems[i]=$(helem),elem=p._elems[i],elem.addClass("jqplot-point-label jqplot-series-"+this.index+" jqplot-point-"+i),elem.css("position","absolute"),elem.insertAfter(sctx.canvas),p.escapeHTML?elem.text(label):elem.html(label);var location=p.location;(this.fillToZero&&pd[i][1]<0||this.fillToZero&&"bar"===this._type&&"horizontal"===this.barDirection&&pd[i][0]<0||(this.waterfall&&parseInt(label,10))<0)&&(location=oppositeLocations[locationIndicies[location]]);var ell=xax.u2p(pd[i][0])+p.xOffset(elem,location),elt=yax.u2p(pd[i][1])+p.yOffset(elem,location);
// we have stacked chart but are not showing stacked values,
// place labels in center.
this._stack&&!p.stackedValue&&("vertical"===this.barDirection?elt=(this._barPoints[i][0][1]+this._barPoints[i][1][1])/2+plot._gridPadding.top-.5*elem.outerHeight(!0):ell=(this._barPoints[i][2][0]+this._barPoints[i][0][0])/2+plot._gridPadding.left-.5*elem.outerWidth(!0)),this.renderer.constructor==$.jqplot.BarRenderer&&("vertical"==this.barDirection?ell+=this._barNudge:elt-=this._barNudge),elem.css("left",ell),elem.css("top",elt);var elr=ell+elem.width(),elb=elt+elem.height(),et=p.edgeTolerance,scl=$(sctx.canvas).position().left,sct=$(sctx.canvas).position().top,scr=sctx.canvas.width+scl,scb=sctx.canvas.height+sct;
// if label is outside of allowed area, remove it
(scl>ell-et||sct>elt-et||elr+et>scr||elb+et>scb)&&elem.remove(),elem=null,helem=null}}}},$.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init),$.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw)}(jQuery);