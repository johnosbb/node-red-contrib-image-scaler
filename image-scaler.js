module.exports = function (RED) {
  "use strict";

  const sharp = require("sharp");

  function ImageScaleFileNode(config) {
    RED.nodes.createNode(this, config);
    this.inFilename = config.inFilename;
    this.outFilename = config.outFilename;
    this.height = parseInt(config.height);
    this.width = parseInt(config.width);
    var node = this;
    node.on("input", function (msg) {
      console.log(
        `${this.inFilename} Image Resized to ${this.width} X ${this.height} `,
        config
      );
      ConvertImageToFile(this, msg);
    });
  }

  function ImageScaleBufferNode(config) {
    RED.nodes.createNode(this, config);
    this.inFilename = config.inFilename;
    this.height = parseInt(config.height);
    this.width = parseInt(config.width);
    var node = this;
    node.on("input", function (msg) {
      console.log(
        `${this.inFilename} Image Resized to ${this.width} X ${this.height} `,
        config
      );
      ConvertImageToBuffer(this, msg);
    });
  }


  RED.nodes.registerType("image-scaler-to-file", ImageScaleFileNode);

  function ConvertImageToFile(node, msg) {
    let imageFilePath = msg.payload;
    let imageOutputPath = `${node.outFilename}`;
    sharp(imageFilePath)
      .resize({ height: node.height, width: node.width })
      .toFile(imageOutputPath)
      .then(function (info) {
        let status = `${imageFilePath} ${node.inFilename} ${info.channels} channels ${info.format} Image Resized to ${info.width} X ${info.height}, ${info.size} in file ${imageOutputPath}`;
        console.log(status, info);
        msg.topic = "Status";
        msg.payload = status;
        node.send(msg);
      })

      .catch(function (err) {
        let errorMessage = `Error: imageFilePath was ${imageFilePath}, error was ${err}`;
        console.log(errorMessage);
        msg.payload = errorMessage;
        msg.topic = "Error";
        node.send(msg);
      });
  }

  

  function ConvertImageToBuffer(node, msg) {
    let imageFilePath = msg.payload;
    sharp(imageFilePath)
      .resize({ height: node.height, width: node.width })
      .toBuffer({ resolveWithObject: true })
      .then(function (result) {
        let info = result.info;
        let data = result.data;
        let status = `${imageFilePath} ${node.inFilename} ${info.channels} channels ${info.format} Image Resized to ${info.width} X ${info.height}, ${info.size} `;
        console.log(status, info);
        msg.topic = "Status";
        msg.payload = data;
        node.send(msg);
      })

      .catch(function (err) {
        let errorMessage = `Error: imageFilePath was ${imageFilePath}, error was ${err}`;
        console.log(errorMessage);
        msg.payload = errorMessage;
        msg.topic = "Error";
        node.send(msg);
      });
  }

  RED.nodes.registerType("image-scaler-to-buffer", ImageScaleBufferNode);
};
