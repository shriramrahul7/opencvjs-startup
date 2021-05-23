document.body.classList.add("loading");

let imgElement = document.getElementById("imageSrc");
let inputElement = document.getElementById("fileInput");

inputElement.onchange = () => {
  imgElement.src = URL.createObjectURL(event.target.files[0]);
};

imgElement.onload = function () {
  let image = cv.imread(imgElement);
  cv.imshow("imageCanvas", image);
  image.delete();
};

document.getElementById("circlesButton").onclick = () => {
  this.disabled = true;
  document.body.classList.add("loading");
  //circle detection code here

  let mat = cv.imread("imageCanvas");
  let dst = mat.clone();
  let circles = new cv.Mat();

  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);
  cv.HoughCircles(mat, circles, cv.HOUGH_GRADIENT, 2, 45);

  let temp = new cv.Mat();
  circles.convertTo(temp, cv.CV_16U);
  console.log(circles);
  console.log(temp);
  //   circles = [[x, y, radius], [x, y, radius], ......]
  /*
		[
				a, b, c, d, e, f, g, h, i 
				[d, e, f], 
				3
		]
*/
  for (let i = 0; i < temp.cols; i++) {
    let x = temp.data16U[3 * i + 0];
    let y = temp.data16U[3 * i + 1];
    let r = temp.data16U[3 * i + 2];

    let center = new cv.Point(x, y);
    let color = new cv.Scalar(0, 0, 255, 255);
    cv.circle(dst, center, r, color, 3);
  }
  // for (let i = 0; i < circles.cols; i++) {
  //   let x = circles.data32F[3 * i + 0];
  //   let y = circles.data32F[3 * i + 1];
  //   let r = circles.data32F[3 * i + 2];

  //   let center = new cv.Point(x, y);
  //   let color = new cv.Scalar(0, 0, 255, 255);
  //   cv.circle(dst, center, r, color, 3);
  // }

  cv.imshow("imageCanvas", dst);

  mat.delete();
  dst.delete();
  //   circles.delete();

  this.disabled = false;
  document.body.classList.remove("loading");
};

function onOpenCvReady() {
  document.body.classList.remove("loading");
}
