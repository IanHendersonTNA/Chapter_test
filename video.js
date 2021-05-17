function Video(id) {
  this.element = document.getElementById(id);
  this.originalTop = this.element.style.top;
  this.originalLeft = this.element.style.left;
  this.originalWidth = this.element.style.width;
  this.originalHeight = this.element.style.height;
  this.select = function() {
    animate(this.element.style, "top", "-20px");
    animate(this.element.style, "left", "250px");
    animate(this.element.style, "width", "100%");
    animate(this.element.style, "height", "100%");
    this.element.style.opacity = 1.0;
    this.element.volume = 1.0;
    this.element.play();
    this.element.controls = true;
  }
  this.deselect = function() {
    animate(this.element.style, "top", this.originalTop);
    animate(this.element.style, "left", this.originalLeft);
    animate(this.element.style, "width", this.originalWidth);
    animate(this.element.style, "height", this.originalHeight);
    this.element.style.opacity = 1.0;
    this.element.style.zIndex = 0;
    this.element.volume = 1.0;
    this.element.pause();
    this.element.controls = false;
  }
  this.preview = function() {
    animate(this.element.style, "width", "20px");
    animate(this.element.style, "height", "20px");
    this.element.style.opacity = 0.7;
    this.element.style.zIndex = 10;
    this.element.volume = 0.0;
    this.element.play();
  }
  this.togglePlay = function() {
    if (this.element.paused) {
      this.element.play();
    } else {
      this.element.pause();
    }
  }
  this.fastForward = function() {
    var ct = this.element.currentTime;
    ct += 8;
    this.element.currentTime = ct;
    this.element.play();
  }
  this.rewind = function() {
    var ct = this.element.currentTime;
    ct -= 2;
    if (ct < 0) {
      ct = 0;
    }
    this.element.currentTime = ct;
    this.element.play();
  }
}
