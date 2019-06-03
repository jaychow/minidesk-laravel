import axios from 'axios';

const state = {
    options: {
        'chart': {
            "zIndex": 0,
            "enabled": true,
            "type": "stock",
            "background": {
                "zIndex": 0.5,
                "enabled": true
            },
            "tooltip": {
                "zIndex": 0,
                "enabled": false,
                "title": {
                    "zIndex": 1,
                    "enabled": true,
                    "fontSize": 13,
                    "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                    "fontColor": "#ffffff",
                    "fontOpacity": 1,
                    "fontDecoration": "none",
                    "fontStyle": "normal",
                    "fontVariant": "normal",
                    "fontWeight": "normal",
                    "letterSpacing": "normal",
                    "textDirection": "ltr",
                    "lineHeight": "normal",
                    "textIndent": 0,
                    "vAlign": "top",
                    "hAlign": "left",
                    "wordWrap": "normal",
                    "wordBreak": "normal",
                    "textOverflow": "",
                    "selectable": false,
                    "disablePointerEvents": false,
                    "useHtml": false,
                    "width": null,
                    "height": null,
                    "align": "left",
                    "orientation": "top",
                    "rotation": 0,
                    "text": "",
                    "margin": {
                        "left": 0,
                        "top": 0,
                        "bottom": 0,
                        "right": 0
                    },
                    "padding": {
                        "left": 0,
                        "top": 0,
                        "bottom": 0,
                        "right": 0
                    },
                    "background": {
                        "enabled": false
                    }
                },
                "separator": {
                    "zIndex": 1,
                    "enabled": true,
                    "fill": {
                        "color": "#CECECE",
                        "opacity": 0.3
                    },
                    "stroke": "none",
                    "width": "100%",
                    "height": 1,
                    "orientation": "top",
                    "margin": {
                        "left": 0,
                        "top": 5,
                        "bottom": 5,
                        "right": 0
                    }
                },
                "background": {
                    "zIndex": 0,
                    "enabled": true
                },
                "padding": {
                    "left": 10,
                    "top": 5,
                    "bottom": 5,
                    "right": 10
                }
            },
            "margin": {
                "left": 0,
                "top": 0,
                "bottom": 0,
                "right": 0
            },
            "padding": {
                "left": 60,
                "top": 20,
                "bottom": 20,
                "right": 30
            },
            "a11y": {
                "enabled": true,
                "mode": "chart-elements"
            },
            "autoRedraw": true,
            "bounds": {
                "top": 0,
                "left": 0,
                "width": "90%",
                "height": "100%"
            },
            "credits": {
                "text": "MiniDesk",
                "url": "",
                "alt": "",
                "imgAlt": "",
                "logoSrc": "",
                "enabled": true
            },
            "selectMarqueeFill": {
                "color": "#d3d3d3",
                "opacity": 0.4
            },
            "selectMarqueeStroke": "#d3d3d3",
            "grouping": {
                "enabled": true,
                "forced": false,
                "levels": [
                    {
                        "unit": "millisecond",
                        "count": 1
                    },
                    {
                        "unit": "millisecond",
                        "count": 5
                    },
                    {
                        "unit": "millisecond",
                        "count": 10
                    },
                    {
                        "unit": "millisecond",
                        "count": 25
                    },
                    {
                        "unit": "millisecond",
                        "count": 50
                    },
                    {
                        "unit": "millisecond",
                        "count": 100
                    },
                    {
                        "unit": "millisecond",
                        "count": 250
                    },
                    {
                        "unit": "millisecond",
                        "count": 500
                    },
                    {
                        "unit": "second",
                        "count": 1
                    },
                    {
                        "unit": "second",
                        "count": 5
                    },
                    {
                        "unit": "second",
                        "count": 10
                    },
                    {
                        "unit": "second",
                        "count": 20
                    },
                    {
                        "unit": "second",
                        "count": 30
                    },
                    {
                        "unit": "minute",
                        "count": 1
                    },
                    {
                        "unit": "minute",
                        "count": 5
                    },
                    {
                        "unit": "minute",
                        "count": 15
                    },
                    {
                        "unit": "minute",
                        "count": 30
                    },
                    {
                        "unit": "hour",
                        "count": 1
                    },
                    {
                        "unit": "hour",
                        "count": 2
                    },
                    {
                        "unit": "hour",
                        "count": 6
                    },
                    {
                        "unit": "hour",
                        "count": 12
                    },
                    {
                        "unit": "day",
                        "count": 1
                    },
                    {
                        "unit": "week",
                        "count": 1
                    },
                    {
                        "unit": "month",
                        "count": 1
                    },
                    {
                        "unit": "month",
                        "count": 3
                    },
                    {
                        "unit": "month",
                        "count": 6
                    },
                    {
                        "unit": "year",
                        "count": 1
                    }
                ],
                "maxVisiblePoints": 500,
                "minPixPerPoint": null
            },
            "scrollerGrouping": {
                "enabled": true,
                "forced": false,
                "levels": [
                    {
                        "unit": "millisecond",
                        "count": 1
                    },
                    {
                        "unit": "millisecond",
                        "count": 2
                    },
                    {
                        "unit": "millisecond",
                        "count": 5
                    },
                    {
                        "unit": "millisecond",
                        "count": 10
                    },
                    {
                        "unit": "millisecond",
                        "count": 25
                    },
                    {
                        "unit": "millisecond",
                        "count": 50
                    },
                    {
                        "unit": "millisecond",
                        "count": 100
                    },
                    {
                        "unit": "millisecond",
                        "count": 250
                    },
                    {
                        "unit": "millisecond",
                        "count": 500
                    },
                    {
                        "unit": "second",
                        "count": 1
                    },
                    {
                        "unit": "second",
                        "count": 2
                    },
                    {
                        "unit": "second",
                        "count": 5
                    },
                    {
                        "unit": "second",
                        "count": 10
                    },
                    {
                        "unit": "second",
                        "count": 20
                    },
                    {
                        "unit": "second",
                        "count": 30
                    },
                    {
                        "unit": "minute",
                        "count": 1
                    },
                    {
                        "unit": "minute",
                        "count": 2
                    },
                    {
                        "unit": "minute",
                        "count": 5
                    },
                    {
                        "unit": "minute",
                        "count": 10
                    },
                    {
                        "unit": "minute",
                        "count": 20
                    },
                    {
                        "unit": "minute",
                        "count": 30
                    },
                    {
                        "unit": "hour",
                        "count": 1
                    },
                    {
                        "unit": "hour",
                        "count": 2
                    },
                    {
                        "unit": "hour",
                        "count": 3
                    },
                    {
                        "unit": "hour",
                        "count": 4
                    },
                    {
                        "unit": "hour",
                        "count": 6
                    },
                    {
                        "unit": "hour",
                        "count": 12
                    },
                    {
                        "unit": "day",
                        "count": 1
                    },
                    {
                        "unit": "day",
                        "count": 2
                    },
                    {
                        "unit": "day",
                        "count": 4
                    },
                    {
                        "unit": "week",
                        "count": 1
                    },
                    {
                        "unit": "week",
                        "count": 2
                    },
                    {
                        "unit": "month",
                        "count": 1
                    },
                    {
                        "unit": "month",
                        "count": 2
                    },
                    {
                        "unit": "month",
                        "count": 3
                    },
                    {
                        "unit": "month",
                        "count": 6
                    },
                    {
                        "unit": "year",
                        "count": 1
                    }
                ],
                "maxVisiblePoints": null,
                "minPixPerPoint": 1
            },
            "xScale": {},
            "scroller": {
                "zIndex": 40,
                "enabled": false,
                "height": 40,
                "minHeight": null,
                "maxHeight": null,
                "orientation": "bottom",
                "inverted": false,
                "autoHide": false,
                "fill": "none",
                "selectedFill": {
                    "color": "#1976d2",
                    "opacity": 0.2
                },
                "outlineStroke": "#cecece",
                "allowRangeChange": true,
                "thumbs": {
                    "normal": {
                        "fill": "#E9E9E9",
                        "stroke": "#7c868e"
                    },
                    "hovered": {
                        "fill": "#ffffff",
                        "stroke": "#757575"
                    },
                    "enabled": true,
                    "autoHide": false
                },
                "defaultSeriesType": "line",
                "palette": {
                    "type": "distinct",
                    "items": [
                        "#64b5f6",
                        "#1976d2",
                        "#ef6c00",
                        "#ffd54f",
                        "#455a64",
                        "#96a6a6",
                        "#dd2c00",
                        "#00838f",
                        "#00bfa5",
                        "#ffa000"
                    ]
                },
                "hatchFillPalette": {
                    "items": [
                        {
                            "type": "backward-diagonal",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "forward-diagonal",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "horizontal",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "vertical",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "dashed-backward-diagonal",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "grid",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "dashed-forward-diagonal",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "dashed-horizontal",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "dashed-vertical",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "diagonal-cross",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "diagonal-brick",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "divot",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "horizontal-brick",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "vertical-brick",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "checker-board",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "confetti",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "plaid",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "solid-diamond",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "zig-zag",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "weave",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-05",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-10",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-20",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-25",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-30",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-40",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-50",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-60",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-70",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-75",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-80",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        },
                        {
                            "type": "percent-90",
                            "color": "black 0.5",
                            "thickness": 1,
                            "size": 10
                        }
                    ]
                }
            },
            "plots": [
                {
                    "zIndex": 10,
                    "enabled": true,
                    "maxPointWidth": "100%",
                    "minPointLength": 0,
                    "baseline": 0,
                    "yScale": 0,
                    "defaultSeriesType": "line",
                    "background": {
                        "zIndex": 1,
                        "enabled": false
                    },
                    "title": {
                        "zIndex": 80,
                        "enabled": false,
                        "fontSize": 12,
                        "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                        "fontColor": "#7c868e",
                        "fontOpacity": 1,
                        "fontDecoration": "none",
                        "fontStyle": "normal",
                        "fontVariant": "normal",
                        "fontWeight": "normal",
                        "letterSpacing": "normal",
                        "textDirection": "ltr",
                        "lineHeight": "normal",
                        "textIndent": 0,
                        "vAlign": "top",
                        "hAlign": "center",
                        "wordWrap": "normal",
                        "wordBreak": "normal",
                        "textOverflow": "",
                        "selectable": false,
                        "disablePointerEvents": false,
                        "useHtml": false,
                        "width": null,
                        "height": null,
                        "align": "center",
                        "text": "Plot Title",
                        "margin": {
                            "left": 0,
                            "top": 0,
                            "bottom": 0,
                            "right": 0
                        },
                        "padding": {
                            "left": 5,
                            "top": 5,
                            "bottom": 2,
                            "right": 5
                        },
                        "background": {
                            "zIndex": 0,
                            "enabled": false
                        }
                    },
                    "noDataLabel": {
                        "zIndex": 999999,
                        "enabled": false,
                        "fontSize": 15,
                        "fontFamily": "Arial",
                        "fontColor": "black",
                        "fontOpacity": 1,
                        "fontDecoration": "none",
                        "fontStyle": "normal",
                        "fontVariant": "normal",
                        "fontWeight": "bold",
                        "letterSpacing": "normal",
                        "textDirection": "ltr",
                        "lineHeight": "normal",
                        "textIndent": 0,
                        "vAlign": "top",
                        "hAlign": "start",
                        "wordWrap": "normal",
                        "wordBreak": "normal",
                        "textOverflow": "",
                        "selectable": false,
                        "disablePointerEvents": false,
                        "useHtml": false,
                        "text": "No data.",
                        "position": "center",
                        "width": null,
                        "height": null,
                        "anchor": "center",
                        "offsetX": 0,
                        "offsetY": 0,
                        "rotation": 0,
                        "adjustFontSize": {
                            "width": false,
                            "height": false
                        },
                        "minFontSize": 8,
                        "maxFontSize": 72,
                        "background": {
                            "zIndex": 0,
                            "enabled": false
                        },
                        "padding": {}
                    },
                    "dataArea": {
                        "zIndex": 10,
                        "enabled": true,
                        "background": {
                            "enabled": false
                        }
                    },
                    "xAxis": {
                        "zIndex": 35,
                        "enabled": true,
                        "height": 25,
                        "showHelperLabel": true,
                        "overlapMode": "no-overlap",
                        "labels": {
                            "zIndex": 35,
                            "enabled": true,
                            "fontColor": "#8b8dbb"
                        },
                        "minorLabels": {
                            "zIndex": 35,
                            "enabled": true
                        },
                        "ticks": {
                            "zIndex": 35,
                            "enabled": false,
                            "stroke": "#CECECE",
                            "length": 6,
                            "position": "center"
                        },
                        "minorTicks": {
                            "zIndex": 35,
                            "enabled": false,
                            "stroke": "#EAEAEA",
                            "length": 4,
                            "position": "outside"
                        },
                        "background": {
                            "enabled": false
                        }
                    },
                    "palette": {
                        "type": "distinct",
                        "items": [
                            "#64b5f6",
                            "#1976d2",
                            "#ef6c00",
                            "#ffd54f",
                            "#455a64",
                            "#96a6a6",
                            "#dd2c00",
                            "#00838f",
                            "#00bfa5",
                            "#ffa000"
                        ]
                    },
                    "markerPalette": {
                        "items": [
                            "circle",
                            "diamond",
                            "square",
                            "triangle-down",
                            "triangle-up",
                            "diagonal-cross",
                            "pentagon",
                            "cross",
                            "v-line",
                            "star5",
                            "star4",
                            "trapezium",
                            "star7",
                            "star6",
                            "star10"
                        ]
                    },
                    "hatchFillPalette": {
                        "items": [
                            {
                                "type": "backward-diagonal",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "forward-diagonal",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "horizontal",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "vertical",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "dashed-backward-diagonal",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "grid",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "dashed-forward-diagonal",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "dashed-horizontal",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "dashed-vertical",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "diagonal-cross",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "diagonal-brick",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "divot",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "horizontal-brick",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "vertical-brick",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "checker-board",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "confetti",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "plaid",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "solid-diamond",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "zig-zag",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "weave",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-05",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-10",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-20",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-25",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-30",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-40",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-50",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-60",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-70",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-75",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-80",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            },
                            {
                                "type": "percent-90",
                                "color": "black 0.5",
                                "thickness": 1,
                                "size": 10
                            }
                        ]
                    },
                    "crosshair": {
                        "zIndex": 201,
                        "enabled": true,
                        "xLabels": [
                            {
                                "fontColor": "white",
                                "background": {
                                    "enabled": true,
                                    "fill": "#4a475f",
                                    "stroke": "#4a475f"
                                },
                                "padding": {}
                            }
                        ],
                        "yLabels": [
                            {
                                "background": {
                                    "enabled": true,
                                    "fill": "#4a475f",
                                    "stroke": "#4a475f"
                                },
                                "padding": {}
                            }
                        ]
                    },
                    "yAxes": [
                        {
                            "zIndex": 35,
                            "enabled": true,
                            "width": 50,
                            "drawFirstLabel": true,
                            "drawLastLabel": true,
                            "staggerMode": false,
                            "overlapMode": "no-overlap",
                            "staggerMaxLines": 2,
                            "staggerLines": null,
                            "orientation": "right",
                            "stroke": "#CECECE",
                            "title": {
                                "zIndex": 35,
                                "enabled": false,
                                "fontSize": 13,
                                "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                                "fontColor": "#545f69",
                                "fontOpacity": 1,
                                "fontDecoration": "none",
                                "fontStyle": "normal",
                                "fontVariant": "normal",
                                "fontWeight": "normal",
                                "letterSpacing": "normal",
                                "textDirection": "ltr",
                                "lineHeight": "normal",
                                "textIndent": 0,
                                "vAlign": "top",
                                "hAlign": "center",
                                "wordWrap": "normal",
                                "wordBreak": "normal",
                                "textOverflow": "",
                                "selectable": false,
                                "disablePointerEvents": false,
                                "useHtml": false,
                                "width": null,
                                "height": null,
                                "align": "center",
                                "text": "Y-Axis",
                                "margin": {
                                    "left": 0,
                                    "top": 0,
                                    "bottom": 0,
                                    "right": 0
                                },
                                "padding": {
                                    "left": 5,
                                    "top": 5,
                                    "bottom": 5,
                                    "right": 5
                                },
                                "background": {
                                    "enabled": false
                                }
                            },
                            "labels": {
                                "zIndex": 35,
                                "enabled": true,
                                "fontColor": "#8b8dbb"
                            },
                            "minorLabels": {
                                "zIndex": 35,
                                "enabled": false
                            },
                            "ticks": {
                                "zIndex": 35,
                                "enabled": true,
                                "stroke": "#CECECE",
                                "length": 6,
                                "position": "outside"
                            },
                            "minorTicks": {
                                "zIndex": 35,
                                "enabled": false,
                                "stroke": "#EAEAEA",
                                "length": 4,
                                "position": "outside"
                            },
                            "scale": 0
                        }
                    ],
                    "xGrids": [
                        {
                            "zIndex": 11.001,
                            "enabled": false,
                            "stroke": "#CECECE",
                            "drawFirstLine": true,
                            "drawLastLine": true,
                            "isMinor": false
                        }
                    ],
                    "yGrids": [
                        {
                            "zIndex": 11,
                            "enabled": false,
                            "stroke": "#CECECE",
                            "drawFirstLine": true,
                            "drawLastLine": true,
                            "isMinor": false
                        }
                    ],
                    "xMinorGrids": [
                        {
                            "zIndex": 10.003,
                            "enabled": false,
                            "stroke": "#EAEAEA",
                            "drawFirstLine": true,
                            "drawLastLine": true,
                            "isMinor": true
                        }
                    ],
                    "yMinorGrids": [
                        {
                            "zIndex": 10.002,
                            "enabled": false,
                            "stroke": "#EAEAEA",
                            "drawFirstLine": true,
                            "drawLastLine": true,
                            "isMinor": true
                        }
                    ],
                    "series": [
                        {
                            "enabled": true,
                            "seriesType": "candlestick",
                            "clip": true,
                            "id": "candle",
                            "color": null,
                            "pointWidth": "75%",
                            "isVertical": null,
                            "normal": {
                                "risingFill": "#64b5f6",
                                "fallingFill": "#ef6c00",
                                "risingStroke": "#64b5f6",
                                "fallingStroke": "#ef6c00",
                                "hatchFill": "none",
                                "risingHatchFill": "none",
                                "fallingHatchFill": "none",
                                "labels": {
                                    "enabled": null,
                                    "padding": {
                                        "left": 4,
                                        "top": 4,
                                        "bottom": 4,
                                        "right": 4
                                    }
                                },
                                "minLabels": {
                                    "enabled": null
                                },
                                "maxLabels": {
                                    "enabled": null
                                },
                                "markers": {
                                    "enabled": false,
                                    "disablePointerEvents": false,
                                    "position": "high",
                                    "anchor": "center",
                                    "offsetX": 0,
                                    "offsetY": 0,
                                    "rotation": 0,
                                    "size": 4
                                },
                                "outlierMarkers": {
                                    "enabled": null,
                                    "anchor": "center",
                                    "offsetX": 0,
                                    "offsetY": 0,
                                    "rotation": 0,
                                    "size": 6
                                }
                            },
                            "hovered": {
                                "hatchFill": "none",
                                "risingHatchFill": "none",
                                "fallingHatchFill": "none",
                                "labels": {
                                    "enabled": null
                                },
                                "minLabels": {
                                    "enabled": null
                                },
                                "maxLabels": {
                                    "enabled": null
                                },
                                "markers": {
                                    "enabled": null,
                                    "size": 6
                                },
                                "outlierMarkers": {
                                    "enabled": null,
                                    "anchor": "center",
                                    "offsetX": 0,
                                    "offsetY": 0,
                                    "rotation": 0,
                                    "size": 6
                                }
                            },
                            "selected": {
                                "fill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "negativeFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "risingFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "fallingFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "stroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "lowStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "highStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "lowFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "highFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "negativeStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "risingStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "fallingStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "hatchFill": "none",
                                "risingHatchFill": "none",
                                "fallingHatchFill": "none",
                                "labels": {
                                    "enabled": null
                                },
                                "minLabels": {
                                    "enabled": null
                                },
                                "maxLabels": {
                                    "enabled": null
                                },
                                "markers": {
                                    "enabled": null,
                                    "size": 6,
                                    "fill": {
                                        "color": "#333",
                                        "opacity": 0.85
                                    },
                                    "stroke": {
                                        "color": "#212121",
                                        "thickness": 1.5
                                    }
                                },
                                "outlierMarkers": {
                                    "enabled": null,
                                    "anchor": "center",
                                    "offsetX": 0,
                                    "offsetY": 0,
                                    "rotation": 0,
                                    "size": 6
                                }
                            },
                            "a11y": {
                                "enabled": false,
                                "titleFormat": "Series named {%SeriesName} with {%SeriesPointsCount} points. Min value is {%SeriesYMin}, max value is {%SeriesYMax}"
                            },
                            "yScale": 0
                        },
                        {
                            "enabled": false,
                            "seriesType": "line",
                            "clip": true,
                            "id": "line",
                            "color": null,
                            "connectMissingPoints": false,
                            "isVertical": null,
                            "normal": {
                                "hatchFill": "none",
                                "risingHatchFill": "none",
                                "fallingHatchFill": "none",
                                "labels": {
                                    "enabled": null,
                                    "padding": {
                                        "left": 4,
                                        "top": 4,
                                        "bottom": 4,
                                        "right": 4
                                    }
                                },
                                "minLabels": {
                                    "enabled": null
                                },
                                "maxLabels": {
                                    "enabled": null
                                },
                                "markers": {
                                    "enabled": false,
                                    "disablePointerEvents": false,
                                    "position": "value",
                                    "anchor": "center",
                                    "offsetX": 0,
                                    "offsetY": 0,
                                    "rotation": 0,
                                    "size": 4
                                },
                                "outlierMarkers": {
                                    "enabled": null,
                                    "anchor": "center",
                                    "offsetX": 0,
                                    "offsetY": 0,
                                    "rotation": 0,
                                    "size": 6
                                }
                            },
                            "hovered": {
                                "hatchFill": "none",
                                "risingHatchFill": "none",
                                "fallingHatchFill": "none",
                                "labels": {
                                    "enabled": null
                                },
                                "minLabels": {
                                    "enabled": null
                                },
                                "maxLabels": {
                                    "enabled": null
                                },
                                "markers": {
                                    "enabled": null,
                                    "size": 6
                                },
                                "outlierMarkers": {
                                    "enabled": null,
                                    "anchor": "center",
                                    "offsetX": 0,
                                    "offsetY": 0,
                                    "rotation": 0,
                                    "size": 6
                                }
                            },
                            "selected": {
                                "fill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "negativeFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "risingFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "fallingFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "stroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "lowStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "highStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "lowFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "highFill": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "negativeStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "risingStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "fallingStroke": {
                                    "color": "#333",
                                    "opacity": 0.85
                                },
                                "hatchFill": "none",
                                "risingHatchFill": "none",
                                "fallingHatchFill": "none",
                                "labels": {
                                    "enabled": null
                                },
                                "minLabels": {
                                    "enabled": null
                                },
                                "maxLabels": {
                                    "enabled": null
                                },
                                "markers": {
                                    "enabled": null,
                                    "size": 6,
                                    "fill": {
                                        "color": "#333",
                                        "opacity": 0.85
                                    },
                                    "stroke": {
                                        "color": "#212121",
                                        "thickness": 1.5
                                    }
                                },
                                "outlierMarkers": {
                                    "enabled": null,
                                    "anchor": "center",
                                    "offsetX": 0,
                                    "offsetY": 0,
                                    "rotation": 0,
                                    "size": 6
                                }
                            },
                            "a11y": {
                                "enabled": false,
                                "titleFormat": "Series named {%SeriesName} with {%SeriesPointsCount} points. Min value is {%SeriesYMin}, max value is {%SeriesYMax}"
                            },
                            "yScale": 0
                        }
                    ],
                    "scales": [
                        {
                            "type": "linear",
                            "inverted": false,
                            "maximum": null,
                            "minimum": null,
                            "minimumGap": 0.1,
                            "maximumGap": 0.1,
                            "softMinimum": null,
                            "softMaximum": null,
                            "alignMinimum": true,
                            "alignMaximum": true,
                            "maxTicksCount": 1000,
                            "ticks": {
                                "mode": "linear",
                                "base": 0,
                                "allowFractional": true,
                                "interval": 1
                            },
                            "minorTicks": {
                                "mode": "linear",
                                "base": 0,
                                "allowFractional": true,
                                "count": 5
                            },
                            "stackMode": "none",
                            "stackDirection": "direct",
                            "stickToZero": true,
                            "comparisonMode": "percent"
                        }
                    ]
                }
            ],
            "crosshair": {
                "enabled": true,
                "xStroke": "#969EA5",
                "yStroke": "#969EA5",
                "displayMode": "sticky",
                "xLabels": [
                    {
                        "enabled": true,
                        "fontSize": 12,
                        "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                        "fontColor": "#ffffff",
                        "fontOpacity": 1,
                        "fontDecoration": "none",
                        "fontStyle": "normal",
                        "fontVariant": "normal",
                        "fontWeight": 400,
                        "letterSpacing": "normal",
                        "textDirection": "ltr",
                        "lineHeight": "normal",
                        "textIndent": 0,
                        "vAlign": "top",
                        "hAlign": "start",
                        "wordWrap": "normal",
                        "wordBreak": "normal",
                        "textOverflow": "",
                        "selectable": false,
                        "disablePointerEvents": true,
                        "useHtml": false,
                        "text": "Label text",
                        "width": null,
                        "height": null,
                        "anchor": null,
                        "offsetX": 0,
                        "offsetY": 0,
                        "rotation": 0,
                        "adjustFontSize": {
                            "width": false,
                            "height": false
                        },
                        "minFontSize": 8,
                        "maxFontSize": 16,
                        "background": {
                            "zIndex": 0,
                            "enabled": true
                        },
                        "padding": {
                            "left": 10,
                            "top": 5,
                            "bottom": 5,
                            "right": 10
                        },
                        "axisIndex": 0
                    }
                ],
                "yLabels": [
                    {
                        "enabled": true,
                        "fontSize": 12,
                        "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                        "fontColor": "#ffffff",
                        "fontOpacity": 1,
                        "fontDecoration": "none",
                        "fontStyle": "normal",
                        "fontVariant": "normal",
                        "fontWeight": 400,
                        "letterSpacing": "normal",
                        "textDirection": "ltr",
                        "lineHeight": "normal",
                        "textIndent": 0,
                        "vAlign": "top",
                        "hAlign": "start",
                        "wordWrap": "normal",
                        "wordBreak": "normal",
                        "textOverflow": "",
                        "selectable": false,
                        "disablePointerEvents": true,
                        "useHtml": false,
                        "text": "Label text",
                        "width": null,
                        "height": null,
                        "anchor": null,
                        "offsetX": 0,
                        "offsetY": 0,
                        "rotation": 0,
                        "adjustFontSize": {
                            "width": false,
                            "height": false
                        },
                        "minFontSize": 8,
                        "maxFontSize": 16,
                        "background": {
                            "zIndex": 0,
                            "enabled": true
                        },
                        "padding": {
                            "left": 10,
                            "top": 5,
                            "bottom": 5,
                            "right": 10
                        },
                        "axisIndex": 0
                    }
                ]
            },
            "eventMarkers": {
                "direction": "auto",
                "position": "axis",
                "seriesId": "0",
                "fieldName": "value",
                "stickToLeft": true,
                "normal": {
                    "type": "circle",
                    "width": 22,
                    "height": 22,
                    "fill": "#515151",
                    "stroke": "#515151",
                    "format": "A",
                    "fontPadding": 2,
                    "minFontSize": 6,
                    "maxFontSize": 20,
                    "adjustFontSize": {
                        "width": true,
                        "height": true
                    },
                    "fontSize": null,
                    "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                    "fontColor": "#fff",
                    "fontOpacity": 1,
                    "fontDecoration": "none",
                    "fontStyle": "normal",
                    "fontVariant": "normal",
                    "fontWeight": "normal",
                    "letterSpacing": "normal",
                    "textDirection": "ltr",
                    "lineHeight": "normal",
                    "textIndent": 0,
                    "vAlign": "middle",
                    "hAlign": "center",
                    "wordWrap": "normal",
                    "wordBreak": "normal",
                    "textOverflow": "",
                    "selectable": false,
                    "disablePointerEvents": false,
                    "useHtml": false,
                    "connector": {
                        "stroke": "#455a64",
                        "length": 5
                    }
                },
                "hovered": {
                    "connector": {}
                },
                "selected": {
                    "fill": "#dd2c00",
                    "connector": {}
                },
                "tooltip": {
                    "zIndex": 0,
                    "enabled": true,
                    "title": {
                        "zIndex": 1,
                        "enabled": true,
                        "fontSize": 14,
                        "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                        "fontColor": "#fff",
                        "fontOpacity": 1,
                        "fontDecoration": "none",
                        "fontStyle": "normal",
                        "fontVariant": "normal",
                        "fontWeight": "normal",
                        "letterSpacing": "normal",
                        "textDirection": "ltr",
                        "lineHeight": "normal",
                        "textIndent": 0,
                        "vAlign": "top",
                        "hAlign": "left",
                        "wordWrap": "normal",
                        "wordBreak": "normal",
                        "textOverflow": "",
                        "selectable": false,
                        "disablePointerEvents": false,
                        "useHtml": false,
                        "width": null,
                        "height": null,
                        "align": "left",
                        "orientation": "top",
                        "rotation": 0,
                        "text": "",
                        "margin": {
                            "left": 0,
                            "top": 0,
                            "bottom": 0,
                            "right": 0
                        },
                        "padding": {
                            "left": 0,
                            "top": 0,
                            "bottom": 0,
                            "right": 0
                        },
                        "background": {
                            "enabled": false
                        }
                    },
                    "separator": {
                        "zIndex": 1,
                        "enabled": true,
                        "fill": {
                            "color": "#CECECE",
                            "opacity": 0.3
                        },
                        "stroke": "none",
                        "width": "100%",
                        "height": 1,
                        "orientation": "top",
                        "margin": {
                            "left": 0,
                            "top": 5,
                            "bottom": 5,
                            "right": 0
                        }
                    },
                    "background": {
                        "zIndex": 0,
                        "enabled": true
                    },
                    "padding": {
                        "left": 10,
                        "top": 5,
                        "bottom": 5,
                        "right": 10
                    }
                }
            },
            "zoomMarqueeFill": {
                "color": "#d3d3d3",
                "opacity": 0.4
            },
            "zoomMarqueeStroke": "#d3d3d3",
            "interactivity": {
                "spotRadius": 2,
                "multiSelectOnClick": false,
                "unselectOnClickOutOfPoint": true,
                "hoverMode": "single",
                "selectionMode": "multi-select"
            }
        }
    }
};

const getters = {
    getChartOptions:  (state) => state.chart
};

const actions  = {
    async fetchData({commit}, params) {
        const response = await axios.get(window.APP_URL + '/chart/getTable',{
            params: {
                pair: params['pair'],
                timeRage: params['timeRange'],
                status: params['status'],
                interval: params['interval'],
            }
        });

        commit('setData', response.data);
    }
};

const mutations = {
    setData: (state, data) => (state.chart.data = data)

};

export default {
    state,
    getters,
    actions,
    mutations
}
