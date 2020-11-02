

    var video, transcriptDiv;
    // TextTracks, html tracks, urls of tracks
    var tracks, trackElems, tracksURLs = [];
    var buttonEnglish, buttonDeutsch;

    window.onload = function() {
       console.log("init");
       // when the page is loaded, get the different DOM nodes
       // we're going to work with
       video = document.querySelector("#myVideo");
       transcriptDiv = document.querySelector("#transcript");
       // The tracks as HTML elements
       trackElems = document.querySelectorAll("track");
       // Get the URLs of the vtt files
       for(var i = 0; i < trackElems.length; i++) {
          var currentTrackElem = trackElems[i];
          tracksURLs[i] = currentTrackElem.src;
       }
       buttonEnglish = document.querySelector("#buttonEnglish");
       buttonDeutsch = document.querySelector("#buttonDeutsch");
       // we enable the buttons only in this load callback,
       // we cannot click before the video is in the DOM
       buttonEnglish.disabled = false;
       buttonDeutsch.disabled = false;
       // The tracks as TextTrack JS objects
       tracks = video.textTracks;
    };

    function loadTranscript(lang) {
      // Called when a button is clicked
      // clear current transcript
      clearTranscriptDiv();
      // set all track modes to disabled. We will only activate the
      // one whose content will be displayed as transcript
      disableAllTracks();
      // Locate the track with language = lang
      for(var i = 0; i < tracks.length; i++) {
        // current track
        var track = tracks[i];
        var trackAsHtmlElem = trackElems[i];
        // Only subtitles/captions are ok for this example...
        if((track.language === lang) && (track.kind !== "chapters")) {
           track.mode="showing";

           if(trackAsHtmlElem.readyState === 2) {
              // the track has already been loaded
              displayCues(track);
           } else {
              displayCuesAfterTrackLoaded(trackAsHtmlElem, track);
           }
           /* Fallback for FireFox that still does not implement cue enter and exit events
             track.addEventListener("cuechange", function(e) {
                 var cue = this.activeCues[0];
                 console.log("cue change");
                 var transcriptText = document.getElementById(cue.id);
                 transcriptText.classList.add("current");
             });
          */
        }
      }
    }
    function displayCuesAfterTrackLoaded(trackElem, track) {
      // Create a listener that will only be called once the track has
      // been loaded. We cannot display the transcript before
      // the track is loaded
       trackElem.addEventListener('load', function(e) {
          console.log("track loaded");
          displayCues(track);
       });
    }
    function disableAllTracks() {
      for(var i = 0; i < tracks.length; i++)
         // the track mode is important: disabled tracks do not fire events
         tracks[i].mode = "disabled";
    }

    function displayCues(track) {
       // displays the transcript of a TextTrack
       var cues = track.cues;
       // iterate on all cues of the current track
       for(var i=0, len = cues.length; i < len; i++) {
          // current cue, also add enter and exit listeners to it
          var cue = cues[i];
          addCueListeners(cue);

          // Test if the cue content is a voice <v speaker>....</v>
          var voices = getVoices(cue.text);
          var transText="";
          if (voices.length > 0) {
             for (var j = 0; j < voices.length; j++) { // how many voices?
                transText += voices[j].voice + ': ' + removeHTML(voices[j].text);
             }
          } else
             transText = cue.text; // not a voice text
          var clickableTransText = "<li class='cues' id=" + cue.id + " onclick='jumpTo("+ cue.startTime + ");'" + ">"+ transText + "</li>";

          addToTranscriptDiv(clickableTransText);
       }
    }

    function getVoices(speech) {
       // takes a text content and check if there are voices
       var voices = []; // inside
       var pos = speech.indexOf('<v'); // voices are like <v Michel> ....
       while (pos != -1) {
          endVoice = speech.indexOf('>');
          var voice = speech.substring(pos + 2, endVoice).trim();
          var endSpeech = speech.indexOf('</v>');
          var text = speech.substring(endVoice + 1, endSpeech);
          voices.push({
              'voice': voice,
              'text': text
          });
          speech = speech.substring(endSpeech + 4);
          pos = speech.indexOf('<v');
      }
      return voices;
    }

    function removeHTML(text) {
      var div = document.createElement('div');
      div.innerHTML = text;
      return div.textContent || div.innerText || '';
    }
    function jumpTo(time) {
      // Make the video jump at the time position + force play
      // if it was not playing
      video.currentTime = time;
      video.play();
    }

    function clearTranscriptDiv() {
      transcriptDiv.innerHTML = "";
    }

    function addToTranscriptDiv(htmlText) {
      transcriptDiv.innerHTML += htmlText;
    }

    function addCueListeners(cue) {
      cue.onenter = function(){
         // Highlight current cue transcript by adding the
         // cue.current CSS class
         console.log('enter id=' + this.id);
         var transcriptText = document.getElementById(this.id);
         transcriptText.classList.add("current");
    };

    cue.onexit = function(){
       console.log('exit id=' + cue.id);
       var transcriptText = document.getElementById(this.id);
       transcriptText.classList.remove("current");
    };
    } // end of addCueListeners...
