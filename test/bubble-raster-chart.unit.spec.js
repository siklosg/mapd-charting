import {expect} from "chai"
import * as dc from "../src"
import mapboxglMock from "./mapbox-gl-mock"

describe("Bubble Raster Chart", () => {
  describe("constructor", () => {
    it('should create a bubble raster chart', () => {
      const node = window.document.createElement("DIV")
      node.setAttribute('id', 'test')
      const bubbleRaster = dc.bubbleRasterChart(node, false, null, mapboxglMock)
      expect(bubbleRaster.anchor()).to.equal(node)
    })
  })
})
