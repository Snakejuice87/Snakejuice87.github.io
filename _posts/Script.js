      $(function() {
        $('video').on('mouseenter', function() {
          if (this.paused) this.play();
        }).on('mouseleave', function() {
          if (!this.playing) this.pause();
        });
      });
