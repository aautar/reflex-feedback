/*
    
Reflex Feedback
AJAX, JQuery UI widget for user feedback

Copyright (c) 2010, Avishkar Autar
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.
* The name of the author may not be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

var Reflex = {}

Reflex.feedbackType = 'idea';
Reflex.txtAreaHasDefault = true;
Reflex.curDefaultTxt = '';
Reflex.feedbackPostUrl = 'test.php';

Reflex.sendFeedback = function (feedbackType, feedbackTxt)
{
    $.ajax({
        type: 'POST',
        url: Reflex.feedbackPostUrl,
        data: "feedback_type=" + feedbackType + "&feedback_txt=" + feedbackTxt,
        success: function (data)
        {
            var result = $('result', data).text();
            if (result != 'ok') {
                Reflex.onSendFailure();
            }
            else {
                Reflex.onSendSuccess();
            }
        },
        error: function (xhr, textStatus, errorThrown)
        {
            Reflex.onSendFailure();
        }
    });
}

Reflex.onSendSuccess = function ()
{
    $('#reflex-feedback-dialog').dialog('close');
    $('#reflex-feedback-send-success-dialog').dialog({ title: 'Thank you!' }, { width: 400 }, { modal: true }, { resizable: false }, { draggable: true }, 
    { buttons: { "OK": function ()
    {
        $('#reflex-feedback-send-success-dialog').dialog('close');
    }
    }
    });
}

Reflex.onSendFailure = function ()
{
    $('#reflex-feedback-send-failure-msg').show();

    $('#reflex-feedback-dialog-entry-area-submitsec .reflex-feedback-preloader').hide();

    $("#reflex-feedback-dialog-entry-area button").button('refresh');
    $("#reflex-feedback-dialog-entry-area button").button('enable');
    Reflex.bindSendButton();
}

Reflex.bindSendButton = function ()
{
    $("#reflex-feedback-dialog-entry-area button").click(function ()
    {
        $('#reflex-feedback-send-failure-msg').hide();
        $('#reflex-feedback-dialog-entry-area-submitsec .reflex-feedback-preloader').show();
        $("#reflex-feedback-dialog-entry-area button").unbind();
        $("#reflex-feedback-dialog-entry-area button").button('disable');

        Reflex.sendFeedback(Reflex.feedbackType, $('#reflex-feedback-dialog-entry-area-txt').val());

    });
}

Reflex.showDialog = function ()
{
    $('#reflex-feedback-dialog').dialog({ title: 'Feedback...' }, { width: 520 }, { modal: true }, { resizable: false }, { draggable: true },
                                        { beforeClose: function (event, ui)
                                        {
                                            Reflex.txtAreaHasDefault = true;
                                            Reflex.menuIdeaSelect();
                                            $("#reflex-feedback-dialog-entry-area button").unbind();
                                            $('#reflex-feedback-dialog-entry-area-txt').unbind();
                                            $('#reflex-feedback-dialog-entry-area-submitsec .reflex-feedback-preloader').hide();
                                        }
                                        },
			        					{ open: function (event, ui)
			        					{

			        					    $('#reflex-feedback-send-failure-msg').hide();

			        					    $("#reflex-feedback-dialog-entry-area button").button('refresh');
			        					    $("#reflex-feedback-dialog-entry-area button").button('enable');
			        					    Reflex.bindSendButton();

			        					    $('#reflex-feedback-dialog-entry-area-txt').focusin(function ()
			        					    {
			        					        if (Reflex.txtAreaHasDefault) {
			        					            $('#reflex-feedback-dialog-entry-area-txt').val('');
			        					            $('#reflex-feedback-dialog-entry-area-txt').css('color', '#000');
			        					        }
			        					    });

			        					    $('#reflex-feedback-dialog-entry-area-txt').keypress(function ()
			        					    {
			        					        Reflex.txtAreaHasDefault = false;
			        					    });

			        					    $('#reflex-feedback-dialog-entry-area-txt').focusout(function ()
			        					    {
			        					        if (Reflex.txtAreaHasDefault) {
			        					            $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
			        					            $('#reflex-feedback-dialog-entry-area-txt').css('color', '#ccc');
			        					        }
			        					    });

			        					    var footer = '<div style="margin:5px 10px;"><p style="font-size: 10px; color: rgb(136, 136, 136);">Reflex feedback widget<br />&copy; Avishkar Autar<br />Some Icons by <a href="http://p.yusukekamiyamane.com/" style="font-family: inherit; font-size: inherit; color: inherit;">Yusuke Kamiyamane</a>.</p></div>';
			        					    $('.ui-dialog-buttonpane', $('#reflex-feedback-dialog').parent()).append(footer);

			        					}
			        					},
                                        { buttons: { "Close": function ()
                                        {
                                            $('#reflex-feedback-dialog').dialog('close');
                                        }
                                        }
                                        });
}

Reflex.menuReset = function ()
{
    $('#reflex-feedback-dialog-menu .reflex-feedback-icondiv').css('opacity', '1.0');
    $('#reflex-feedback-dialog-menu .reflex-feedback-icondiv').css('filter', 'alpha(opacity=100)');
    $('#reflex-feedback-dialog-menu a').css('color', '#888');
    $('#reflex-feedback-dialog-menu li').css('border', '2px solid transparent');
}

Reflex.menuIdeaSelect = function ()
{
    Reflex.menuReset();

    $('#reflex-feedback-dialog-menu-idea .reflex-feedback-icondiv').css('opacity', '1.0');
    $('#reflex-feedback-dialog-menu-idea .reflex-feedback-icondiv').css('filter', 'alpha(opacity=100)');
    $('#reflex-feedback-dialog-menu-idea a').css('color', '#000');
    $('#reflex-feedback-dialog-menu-idea').css('border', '2px solid #ddd');

    if (Reflex.txtAreaHasDefault) {
        Reflex.curDefaultTxt = 'Tell us about your idea...';
        $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
        $('#reflex-feedback-dialog-entry-area-txt').css('color', '#ccc');
    }

    Reflex.feedbackType = 'idea';
}

Reflex.menuQuestionSelect = function ()
{
    Reflex.menuReset();

    $('#reflex-feedback-dialog-menu-question .reflex-feedback-icondiv').css('opacity', '1.0');
    $('#reflex-feedback-dialog-menu-question .reflex-feedback-icondiv').css('filter', 'alpha(opacity=100)');
    $('#reflex-feedback-dialog-menu-question a').css('color', '#000');
    $('#reflex-feedback-dialog-menu-question').css('border', '2px solid #ddd');

    if (Reflex.txtAreaHasDefault) {
        Reflex.curDefaultTxt = 'What\'s on your mind...';
        $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
        $('#reflex-feedback-dialog-entry-area-txt').css('color', '#ccc');
    }

    Reflex.feedbackType = 'question';
}

Reflex.menuProblemSelect = function ()
{
    Reflex.menuReset();

    $('#reflex-feedback-dialog-menu-problem .reflex-feedback-icondiv').css('opacity', '1.0');
    $('#reflex-feedback-dialog-menu-problem .reflex-feedback-icondiv').css('filter', 'alpha(opacity=100)');
    $('#reflex-feedback-dialog-menu-problem a').css('color', '#000');
    $('#reflex-feedback-dialog-menu-problem').css('border', '2px solid #ddd');

    if (Reflex.txtAreaHasDefault) {
        Reflex.curDefaultTxt = 'Tell us about your problem...';
        $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
        $('#reflex-feedback-dialog-entry-area-txt').css('color', '#ccc');
    }

    Reflex.feedbackType = 'problem';
}

Reflex.menuLikeSelect = function ()
{
    Reflex.menuReset();

    $('#reflex-feedback-dialog-menu-like .reflex-feedback-icondiv').css('opacity', '1.0');
    $('#reflex-feedback-dialog-menu-like .reflex-feedback-icondiv').css('filter', 'alpha(opacity=100)');
    $('#reflex-feedback-dialog-menu-like a').css('color', '#000');
    $('#reflex-feedback-dialog-menu-like').css('border', '2px solid #ddd');

    if (Reflex.txtAreaHasDefault) {
        Reflex.curDefaultTxt = 'What do you like...';
        $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
        $('#reflex-feedback-dialog-entry-area-txt').css('color', '#ccc');
    }

    Reflex.feedbackType = 'like';
}

// sendFeedbackFunc([string] feedbackType, [string] feedbackText, [function] onSendSuccess, [function] onSendError);
Reflex.init = function (body, feedbackPostUrl)
{
    Reflex.feedbackPostUrl = feedbackPostUrl;

    var css = '<style type="text/css"> #reflex-feedback-dialog-menu { margin:30px 0px 10px 0px; float:left; margin-left:20px; } #reflex-feedback-dialog-menu li { border:1px solid transparent; background:url(reflex.content/btn-bg1.png) 0 0 repeat-x; border-radius:10px; -moz-border-radius:10px; clear:both; margin:10px 0px; height:30px; width:90px; position:relative; display:block; } #reflex-feedback-dialog-menu .reflex-feedback-icondiv { opacity:1.0;filter:alpha(opacity=100); width:16px; height:16px; background:url(reflex.content/icons.png) 0 0 no-repeat; position:absolute; top:-5px; left:-5px; } #reflex-feedback-dialog-menu a { display:block; width:100%; height:100%; font-family:trebuchet MS; font-size:16px; text-indent:15px; color:#888; padding-top:3px; } #reflex-feedback-dialog-entry-area { float:left; width:65%; margin:20px 25px; } #reflex-feedback-dialog-entry-area-txt { width:100%; padding:7px; color:#ccc; font-family:Tahoma; font-size:12px; } #reflex-feedback-dialog-entry-area-submitsec { margin-top:10px; margin-left:100px; } .reflex-feedback-preloader { margin-right:10px; vertical-align:middle; display:none; }</style>';
    $(body).append(css);

    var dialog = '<div style="display:none;" id="reflex-feedback-dialog"><ul id="reflex-feedback-dialog-menu"><li id="reflex-feedback-dialog-menu-idea"><div class="reflex-feedback-icondiv" style="background-position:-32px 0px;"></div><a onclick="Reflex.menuIdeaSelect(); return false;" href="#">Idea</a></li><li id="reflex-feedback-dialog-menu-question"><div class="reflex-feedback-icondiv" style="background-position:-48px 0px;"></div><a onclick="Reflex.menuQuestionSelect(); return false;" href="#">Question</a></li><li id="reflex-feedback-dialog-menu-problem"><div class="reflex-feedback-icondiv" style="background-position:0px 0px;"></div><a onclick="Reflex.menuProblemSelect(); return false;" href="#">Problem</a></li><li id="reflex-feedback-dialog-menu-like"><div class="reflex-feedback-icondiv" style="background-position:-16px 0px;"></div><a onclick="Reflex.menuLikeSelect(); return false;" href="#">Like</a></li></ul><div id="reflex-feedback-dialog-entry-area"><textarea id="reflex-feedback-dialog-entry-area-txt" name="reflex-feedback-dialog-entry-area-txt" rows="12"></textarea><div id="reflex-feedback-dialog-entry-area-submitsec"><img class="reflex-feedback-preloader" src="reflex.content/preloader.gif" alt="preloader" /><button>Send Feedback</button></div><p id="reflex-feedback-send-failure-msg" style="display:none; text-align:center; font-weight:bold; margin-top:20px;">Failed to send your message. Please try again.</p></div></div>';
    var successDialog = '<div style="display:none; text-align:center; padding:30px; font-size:17px; font-weight:bold;" id="reflex-feedback-send-success-dialog"><p>Thank you for your feedback!</p></div>'
    var widgetMarkup = '<div style="position:fixed; top:37%; left:0; background-color:#f00; width:30px; height:100px;" id="reflex-feedback-widget"><a onclick="Reflex.showDialog(); return false;" style="display:block; width:100%; height:100%; background:url(reflex.content/feedback.png) 0 0 no-repeat; text-indent:-999999px;" href="#">FEEDBACK</a>' + dialog + successDialog + '</div>';

    $(body).append(widgetMarkup);
    $("#reflex-feedback-dialog-entry-area button").button();


    Reflex.menuIdeaSelect();
}

Reflex.unInit = function ()
{
    $('#reflex-feedback-dialog').dialog('close');
}