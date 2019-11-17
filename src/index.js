const customTitlebar = require('custom-electron-titlebar');
const BDF = require('bdfjs');
const fs = require('fs');
const { dialog } = require('electron').remote;

//const btn_input_file = document.querySelector('#btn-input-file');
const glyphs_out = document.querySelector('#glyph');
var glyphSampleData = [];

let MyTitleBar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex('#191919'),
  shadow: true,
  icon: '../assets/images/U8g2.png'
});

MyTitleBar.updateTitle('U8G2 Fonter');

//document.querySelector('#actual-file').innerText = 'No file selcted';

/*
btn_input_file.addEventListener(
  'click',
  () => {
    document.querySelector('#actual-file').innerText = '';

    dialog.showOpenDialog(
      {
        title: 'Select a bdf font',
        filters: [{ name: 'Font', extensions: ['bdf'] }],
        properties: ['openFile']
      },
      fileNames => {
        // fileNames is an array that contains all the selected
        if (fileNames === undefined) {
          alert('No file selected');
          return;
        }

        fs.readFile(filepath, 'utf-8', (err, data) => {
          if (err) {
            alert('An error ocurred reading the file :' + err.message);
            return;
          }

          // Change how to handle the file content
          alert('The file content is : ' + data);
        });
      }
    );
  },
  false
);

document.querySelector('#convert').addEventListener('click', () => {
  document.querySelector('#actual-file').innerText = pickGameFolder();
});

function pickGameFolder() {
  var gameFolder = dialog.showOpenDialog({
    title: 'Select your games folder',
    message: 'Select your games folder',
    properties: ['openDirectory']
  });

  if (!gameFolder) {
    return false;
  }
  return gameFolder[0];
}

*/

const fontPath = './font.bdf';
fs.readFile(fontPath, 'utf-8', (err, data) => {
  if (err) {
    glyphs_out.innerHTML = 'An error ocurred reading the file :' + err.message;
    return;
  }
  var font = BDF.parse(data);

  document.getElementById('font_name').innerHTML = font.meta.name;
  document.getElementById('font_version').innerHTML = font.meta.version;
  document.getElementById('font_totalchars').innerHTML = font.meta.totalChars;
  document.getElementById(
    'font_size'
  ).innerHTML = `<div>Points: ${font.meta.size.points}</div>
  <div>ResolutionX: ${font.meta.size.resolutionX}</div>
  <div>ResolutionY: ${font.meta.size.resolutionY}</div>`;
  document.getElementById(
    'font_boundingbox'
  ).innerHTML = `<div>Height: ${font.meta.boundingBox.height}</div>
  <div>Width: ${font.meta.boundingBox.width}</div>
  <div>X: ${font.meta.boundingBox.x}</div>
  <div>Y: ${font.meta.boundingBox.y}</div>`;
  document.getElementById(
    'font_properties'
  ).innerHTML = `<div>FontAscent: ${font.meta.properties.fontAscent}</div>
  <div>DontDescent: ${font.meta.properties.fontDescent}</div>`;
  glyphSampleData = font.glyphs[65].bitmap;
  sampleGlyph('showSampleGlyph', glyphSampleData, 10, 10, 1);

  glyphs_out.innerHTML = Object.keys(font.glyphs)
    .map(key => {
      return `<div class="col s3 l2 glyph-item hoverable">

      <div class="row">
        <div class="left-align s6 col">${font.glyphs[key].name}</div>
        <div class="right-align s6 col">${font.glyphs[key].code}</div>
      </div>
      <div class="row" id="${font.glyphs[key].char}"></div>
      <div class="row">${font.glyphs[key].char}</div>
      </div>`;
    })
    .join('');
  Object.keys(font.glyphs).map(key => {
    sampleGlyph(font.glyphs[key].char, font.glyphs[key].bitmap);
  });
});

const sampleGlyph = (id, glyphData, w = 4, h = 4, stroke = 0.5) => {
  var w1 = w;
  var h1 = h;
  var x1 = 0;
  var y1 = 0;
  var input = glyphData;
  var width = w * glyphData[1].length;
  var height = h * glyphData.length;

  if (input.length > 0) {
    var stage = new Konva.Stage({
      container: id,
      width: width,
      height: height
    });

    var layer = new Konva.Layer();

    for (let i = 0; i < input.length; i++) {
      for (let f = 0; f < input[i].length; f++) {
        //var layerNew = new Konva.Layer();
        if (input[i][f] == 1) {
          var rect2 = new Konva.Rect({
            x: x1,
            y: y1,
            width: w1,
            height: h1,
            fill: '#222222',
            stroke: 'black',
            strokeWidth: stroke
          });
          // add the shape to the layer
          layer.add(rect2);
        } else {
          var rect2 = new Konva.Rect({
            x: x1,
            y: y1,
            width: w1,
            height: h1,
            fill: '#FFFFFF',
            stroke: 'black',
            strokeWidth: stroke
          });
          // add the shape to the layer
          layer.add(rect2);
        }

        x1 = x1 + w1;
      }
      y1 = y1 + h1;
      x1 = 0;
    }

    // add the layer to the stage
    stage.add(layer);
  }
};
