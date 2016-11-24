var Reflex = {

    widgetElement: null,
    
    feedbackCaptureEndpoint: null,
    
    styles: (
            '.reflex-feedback-widget { box-shadow:0px 0px 2px #000; border-radius:5px; box-sizing:border-box; position:fixed; top:10px; left:10px; background:#2C3C42; color:#fff; width:300px; font-size:12px; padding:5px 12px; }' +
            '.reflex-feedback-widget h3 { font-weight:normal; margin-bottom:10px; }' +
            '.reflex-feedback-widget textarea { width:100%; outline:none; border:1px solid #666; height:85px; padding:5px; }' +
            '.reflex-feedback-widget .send-button { cursor:pointer; display:inline-block; padding:5px 25px; background:#2C3C42; border-radius:3px; border:2px solid #43859C; margin:10px 0 0 0; font-size:14px; font-weight:bold; }' +
            '.reflex-feedback-widget .send-button:hover { background-color:#345D6B }' +
            '.reflex-feedback-widget .button-container { text-align: right; }'
        ),
    
    init: function(_containerElement, _feedbackCaptureEndpoint) {

        this.widgetElement = this._appendHTML(_containerElement, '<div class="reflex-feedback-widget"></div>', function(elem) {

        });

        this.feedbackCaptureEndpoint = _feedbackCaptureEndpoint;
        this._setupStyles();
    },
    
    /**
     * DOM helper method to append HTML into DOM
     * @param _parentElement
     * @param _childHTML
     * @param _beforeAppend
     */
    _appendHTML: function(_parentElement, _childHTML, _beforeAppend) {
        var tempElem = document.createElement('div');
        tempElem.innerHTML = _childHTML;
        var firstChild = tempElem.firstChild;

        if(typeof _beforeAppend !== 'undefined') {
            _beforeAppend(firstChild);
        }

        _parentElement.appendChild(firstChild);

        return firstChild;
    },

    /**
     * Setup a <style> block with the widget CSS styles
     */
    _setupStyles: function() {        
        // put styles onto page (if they're not already there)
        if(document.getElementById('reflexFeedbackStyles') === null) {
            var style = document.createElement('style');
            style.id = 'reflexFeedbackStyles';
            style.type = 'text/css';
            style.innerHTML = this.styles;
            document.getElementsByTagName('head')[0].appendChild(style);
        }                
    },
        
    
    _submitFeedback: function () {

        var feedbackTxtElem = this.widgetElement.getElementsByClassName('feedback-text');
       
        var xmlhttp = new XMLHttpRequest(); 
        xmlhttp.open("POST", this.feedbackCaptureEndpoint, true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send('feedbackText=' + encodeURIComponent(feedbackTxtElem[0].value));
                
    },
    
    _renderWidget: function(_presentationData) {
        var widgetHTML = 
            `<form>
                    <h3>${_presentationData.userPrompt}</h3>
                    <textarea class="feedback-text"></textarea>
                    <div class="button-container"><a class="send-button" id="reflexFeedbackSendButton">${_presentationData.sendButtonText}</a></div>
             </form>`;        
            
        this.widgetElement.innerHTML = widgetHTML;

        var self = this;
        
        var sendButton = this.widgetElement.getElementsByClassName('send-button');
        sendButton[0].addEventListener(
            "click",
            function() {
                self._submitFeedback();
            },
            false
        );
    },
    
    // assuming presentation concerns can change on demand
    show: function(_presentationData) {
        this._renderWidget(_presentationData);
    },
       
};
