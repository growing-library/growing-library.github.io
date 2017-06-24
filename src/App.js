import React, {Component} from 'react';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg.css';
import ImageMapper from 'react-image-mapper';
import './App.css';
import * as ReactDOM from "react-dom";

var MAP = {
    name: "my-map",
    areas: [
        {_id : "fant_youth", shape: "poly", coords: [507, 99, 917, 225, 913, 324, 491, 265]},
        {_id : "en_lit", shape: "poly", coords: [938, 351, 1187, 363, 1187, 491, 925, 484]},
        {_id : "short_nov", shape: "poly", coords: [1548, 278, 2048, 257, 2045, 361, 1545, 345]},
        {_id : "comics", shape: "poly", coords:[1208, 513, 1513, 498, 1509, 621, 1201, 632] },
        {_id : "theater", shape: "poly", coords:[2069, 532, 2473, 569, 2464, 746, 2069, 649,] },
        {_id : "poetry", shape: "poly", coords:[909, 660, 1173, 657, 1173, 801, 906, 822] },
        {_id : "essays", shape: "poly", coords:[1198, 657, 1506, 648, 1506, 792, 1186, 796] },
        {_id : "sci_fi", shape: "poly", coords:[437, 792, 862, 842, 840, 1024, 424, 994] },
        {_id : "art_book", shape: "poly", coords:[1530, 798, 2017, 845, 1997, 994, 1517, 966] },
        {_id : "detective", shape: "poly", coords:[1186, 1009, 1493, 990, 1474, 1154, 1393, 1176, 1177, 1169] },
        {_id : "french_lit", shape: "poly", coords:[2056, 1198, 2022, 1221, 2021, 1234, 2288, 1296, 2382, 1282, 2360, 1458, 2090, 1390, 2088, 1352, 2004, 1334, 2018, 1190] },
        {_id : "add", shape: "poly", coords:[945, 1252, 2088, 1354, 2092, 1506, 625, 1362, 801, 1262, 900, 1277 ] },
        {_id : "landscape", shape: "poly", coords:[5, 6, 117, 1, 130, 641, 157, 865, 100, 1185, 86, 1548, 4, 1558, ] }
    ]
};

//var URL = "https://c1.staticflickr.com/5/4052/4503898393_303cfbc9fd_b.jpg" ;
var URL = "img/2.jpg";

var original_height = 1817;
var original_width = 2559;
var ratio_h_w = original_height / original_width;
var ratio_w_h = original_width / original_height;
//
// <ImageMapper ref="mapper" src={URL} map={MAP} height={this.props.windowWidth * ratio_h_w}
//              width={this.props.windowHeight * ratio_w_h}
//              onImageClick={(e) => this.onImageClick(e)}/>
var FindPosition = function(oElement)
{
    if(typeof( oElement.offsetParent ) != "undefined")
    {
        for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
        {
            posX += oElement.offsetLeft;
            posY += oElement.offsetTop;
        }
        return [ posX, posY ];
    }
    else
    {
        return [ oElement.x, oElement.y ];
    }
}

var GetCoordinates = function(e, image_node, previous_result)
{
    var PosX = 0;
    var PosY = 0;
    var ImgPos;
    ImgPos = FindPosition(image_node);
    if (!e) var e = window.event;
    if (e.pageX || e.pageY)
    {
        PosX = e.pageX;
        PosY = e.pageY;
    }
    else if (e.clientX || e.clientY)
    {
        PosX = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }
    PosX = PosX - ImgPos[0];
    PosY = PosY - ImgPos[1];
    previous_result += PosX;
    previous_result += ", ";
    previous_result += PosY;
    previous_result += ", ";
    return previous_result
    // console.log(PosX, PosY)
};

var previous = [];
class App extends Component {

    constructor(props) {
        super(props);

        console.log('Constructor')

        var new_width = window.innerHeight * ratio_w_h;
        var new_height = new_width * ratio_h_w;
        // var new_width = original_width
        // var new_height = new_width * ratio_h_w;

        console.log(window.innerWidth,  window.innerHeight, original_width, original_height, new_width, new_height)

        var new_map = JSON.parse(JSON.stringify(MAP));

        for (var i = 0; i < MAP.areas.length; i++) {
            for (var j = 0; j < MAP.areas[i].coords.length; j+=2) {
                var x = MAP.areas[i].coords[j];
                var y = MAP.areas[i].coords[j+1];

                var new_x = new_width * x / original_width;
                var new_y = new_height * y / original_height;

                new_map.areas[i].coords[j] = new_x;
                new_map.areas[i].coords[j+1] = new_y;

            }
        }

            this.state = {
            map:new_map,
            height: new_height,
            width: new_width
        };
    }

    onImageClick(e){

        if (previous.length === 4)
            previous = []

        var node = ReactDOM.findDOMNode(this.refs.mapper)
        previous = GetCoordinates(e, node, previous)
        console.log(previous)
    }

    onLoad(){
        console.log("Loaded")
        console.log(this.state)
    }

    render() {
        return (
            <div id="img">
                <center>
                    <ImageMapper ref="mapper" src={URL} map={this.state.map}
                                 width={this.state.width}
                                 onLoad={() => this.onLoad()}
                                 onImageClick={(e) => this.onImageClick(e)}/>
                </center>
            </div>

        );
    };
}

export default App;
