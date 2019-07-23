const chai = require("chai");
const expect = require("chai").expect;
//
// class Pixel {
//   constructor(r = 0, g = 0, b = 0, a = 0) {
//     this.r = r;
//     this.g = g;
//     this.b = b;
//     this.a = a;
//   }
// }
//
// class View {
//   constructor(width = 64, height = 64) {
//     (this.width = width), (this.height = height);
//
//     const inititalView = [];
//     for (var i = 0; i < width * height; i++) {
//       inititalView.push(new Pixel(0, 0, 0, 0));
//     }
//     this.views = [inititalView];
//   }
//
//   update(row, column, pixel) {
//     if (row > this.height || column > this.width) {
//       throw new Error("out of bounds");
//     }
//     const view = this.views[this.views.length - 1];
//     view[(row - 1) * this.width + column - 1] = pixel;
//     this.views.push(view);
//     return view;
//   }
// }
//
// describe("", () => {
//   it("a view is an array of pixels", async () => {
//     const height = 100,
//       width = 100;
//     const view = new View(height, width).views[0];
//
//     expect(view)
//       .to.be.an("array")
//       .of.length(width * height);
//
//     for (var i = 0; i < view.length; i++) {
//       expect(view[i]).to.be.an.instanceOf(Pixel);
//     }
//   });
//
//   it("can update the pixel to be any value in 0-255", async () => {
//     const view = new View(3, 3);
//     const pixel = new Pixel(255, 255, 255, 1);
//     const updatedView = view.update(2, 2, pixel);
//     expect(updatedView[4]).to.eq(pixel);
//     expect(view.views.length).to.eq(2);
//   });
//
//   it("can't update pixel outside view", async () => {
//     const view = new View(3, 3);
//     const pixel = new Pixel(255, 255, 255, 1);
//     const outOfBounds = 7;
//     const withinBounds = 2;
//     expect(() => view.update(outOfBounds, withinBounds, pixel)).to.throw();
//     expect(() => view.update(withinBounds, outOfBounds, pixel)).to.throw();
//   });
//
//   xit("can have a view of the world", async () => {
//     class World {
//       constructor() {}
//     }
//     const world = new World();
//     expect(world);
//   });
//
//   xit("can generate a random view", async () => {});
// });

class Vector {
  constructor(...points) {
    this.points = [...points];
  }

  dot(vector) {
    if (this.points.length != vector.points.length) {
      throw new Error("vectors must be same length");
    }
    let result = 0;
    for (var i = 0; i < this.points.length; i++) {
      result += this.points[i] * vector.points[i];
    }
    return result;
  }

  scale(scaleFactor) {
    this.points = this.points.map(p => p * scaleFactor);
    return this;
  }
}

const assertVectorEquals = (a, b) => {
  for (var i = 0; i < a.points.length; i++) {
    expect(a.points[i]).to.eq(b.points[i]);
  }
};
const assertWorldObjectEquals = (a, b) => {
  for (var i = 0; i < a.points.length; i++) {
    expect(a.points[i]).to.eq(b.points[i]);
  }
};

const projectPointOntoPlane = (point, plane) => {
  const scaleFactor = plane.point.dot(plane.normal) / point.dot(plane.normal);
  return point.scale(scaleFactor);
};

class Plane {
  constructor(point, normal) {
    this.point = point;
    this.normal = normal;
  }
}

class World {
  constructor({ objects = [] } = {}) {
    this.objects = objects;
  }

  projectOnto(plane) {
    const projectedObjects = this.objects.map(object =>
      object.projectOnto(plane)
    );
    return projectedObjects;
  }

  projectPointsOnto(plane) {
    return this.objects
      .reduce((allPoints, object) => allPoints.concat(object.points), [])
      .map(point => projectPointOntoPlane(point, plane));
  }
}

class WorldObject {
  constructor({ points = [] } = {}) {
    this.points = points;
  }

  projectOnto(plane) {
    const projectedPoints = this.points.map(point =>
      projectPointOntoPlane(point, plane)
    );
    const projectedObject = new WorldObject({ points: projectedPoints });
    return projectedObject;
  }
}

describe("projector", () => {
  it("projects", async () => {
    const project = (world, position, direction, distance) => {
      return {};
    };
    const world = [],
      position = [0, 0, 0],
      direction = [1, 0, 0],
      distance = 0;
    const plane = [];
    // expect(project(world, position, direction, distance)).to.eq(plane);
  });

  it("can dot product two vectors", async () => {
    const v = new Vector(1, 2, 3),
      w = new Vector(1, -1, 2);
    expect(v.dot(w)).to.eq(1 + -2 + 6);
  });

  it("can define a plane in point normal form", async () => {
    const point = new Vector(0, 0, 0);
    const normal = new Vector(0, 1, 0);
    expect(new Plane(point, normal)).to.be.ok;
  });

  it("can scale a vector by a constant", async () => {
    const v = new Vector(1, 1, 2);
    v.scale(2);
    assertVectorEquals(v, new Vector(2, 2, 4));
  });

  it("can project a point onto a plane", async () => {
    const point = new Vector(5, 8, 7);
    const plane = new Plane(new Vector(1, 2, 3), new Vector(0, 1, 0));
    const expectedProjection = point.scale(1 / 4);
    expect(projectPointOntoPlane(point, plane)).to.eq(expectedProjection);
  });

  it("can add an object to a world", async () => {
    expect(new World()).to.be.ok;
    expect(new World().objects).to.be.an("array");
    expect(
      new World({
        objects: [new WorldObject()]
      }).objects
    )
      .to.be.an("array")
      .of.length(1);
  });

  it("a world object has points", async () => {
    const p = new Vector(1, 1, 1);
    const q = new Vector(-1, 1, 3);
    const points = [p, q];
    const wo = new WorldObject({ points });
    expect(wo.points).to.have.length(2);
    for (var i = 0; i < wo.points.length; i++) {
      assertVectorEquals(wo.points[i], points[i]);
    }
  });

  it("can project an object onto a plane", async () => {
    const p = new Vector(1, 1, 1);
    const q = new Vector(-1, 1, 3);
    const points = [p, q];
    const wo = new WorldObject({ points });
    const plane = new Plane(new Vector(1, 2, 3), new Vector(0, 1, 0));
    const projectedObject = wo.projectOnto(plane);
    expect(projectedObject.points).to.have.length(2);
    expect(projectedObject.points[0]).to.eq(projectPointOntoPlane(p, plane));
    expect(projectedObject.points[1]).to.eq(projectPointOntoPlane(q, plane));
  });

  it("can project a world onto a plane", async () => {
    const p = new Vector(1, 1, 1);
    const q = new Vector(-1, 1, 3);
    const points = [p, q];
    const wo = new WorldObject({ points });
    const world = new World({ objects: [wo] });
    const plane = new Plane(new Vector(1, 2, 3), new Vector(0, 1, 0));

    const projectedWorldObjects = world.projectOnto(plane);
    expect(projectedWorldObjects)
      .to.be.an("array")
      .of.length(1);

    for (var i = 0; i < projectedWorldObjects[0].points.length; i++) {
      assertVectorEquals(
        projectedWorldObjects[0].points[i],
        wo.projectOnto(plane).points[i]
      );
    }
  });

  it("can render a projected world to a list of points", async () => {
    const p = new Vector(1, 1, 1);
    const q = new Vector(-1, 1, 3);
    const points = [p, q];
    const wo = new WorldObject({ points });
    const world = new World({ objects: [wo] });
    const plane = new Plane(new Vector(1, 2, 3), new Vector(0, 1, 0));

    const projectedPoints = world.projectPointsOnto(plane);
    expect(projectedPoints)
      .to.be.an("array")
      .of.length(2);

    projectedPoints.map((pp, i) =>
      assertVectorEquals(pp, projectPointOntoPlane(points[i], plane))
    );
  });

  it("can project a cube downwards", async () => {
    const cubePoints = [
      new Vector(0, 0, 0),
      new Vector(0, 0, 1),
      new Vector(0, 1, 0),
      new Vector(0, 1, 1),
      new Vector(1, 0, 1),
      new Vector(1, 0, 0),
      new Vector(1, 1, 1)
    ];
    const cube = new WorldObject({ points: cubePoints });
    const world = new World({ objects: [cube] });
    const plane = new Plane(new Vector(0, 0, -1), new Vector(0, 0, 1));

    const projectedWorld = world.projectPointsOnto(plane);
    console.log(projectedWorld);
    expect;
  });

  it("projects properly if focal point (p) is in plane", async () => {});
});
/*
model the world as ball of radius big R? in however many dimensions
  the world is a collection of all objects in that world,

a view as a ball of radius r
around a point p
the screen/view is a restriction to some 2d shape, of the plane π, which is some 2d plane we're projecting onto
π should be normal to the direction vector of the camera
at a distance d away


*/
