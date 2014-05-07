function UR_pullUnapprovedRevisions()
{
    $.ajax('/get/unapproved', {
        async: true,
        dataType: 'json',
        success: function(data){
            if (data && data.length > 0)
            {
                var $noti = NO_showNotification('unapproved-rev', 'There are unapproved changes', NO_TYPES.INFO, null);
                $noti.on('noti.click', function(ev){
                    UR_showUnapprovedRevisions(data);
                });
            }
        },
    });
}

function UR_showUnapprovedRevisions(unapprovedRevs)
{
    var choices = [];
    $.each(unapprovedRevs, function(index, revDict){
        choices.push({
            eventID: revDict.event_id,
            eventDict: revDict,
            buttons: [
                {
                    value: 'up',
                    pretty: '<span class="glyphicon glyphicon-thumbs-up"></span>',
                },
                {
                    value: 'down',
                    pretty: '<span class="glyphicon glyphicon-thumbs-down"></span>',
                },
            ],
        });
    });
    var ep = EP_init('Does this change look correct?', choices);
    SB_setMainContent(ep);
    SB_fill();

    // set the left hand component of the side bar
    UR_updateLeft(0, unapprovedRevs);
    
    // set event listeners
    $(ep).on('ep.cancel', function(ev){
        var mainPopUp = PopUp_getMainPopUp();
        PopUp_close(mainPopUp);
        SB_pop(this);
        SB_unfill();
        SB_hide();
    });
    $(ep).on('ep.select', function(ev, meta){
        if (meta.button == 'up')
        {
        }
        else
        {
        }
        if (unapprovedRevs.length == 1)
        {
            var mainPopUp = PopUp_getMainPopUp();
            PopUp_close(mainPopUp);
            SB_pop(this);
            SB_unfill();
            SB_hide();
        }
        else
        {
            EP_removeItemAtIndex(ep, index);
            unapprovedRevs.splice(index, 1); // remove item from array as well
        }
    });
    $(ep).on('ep.slid', function(ev, meta){
        UR_updateLeft(meta.index, unapprovedRevs);
    });
}

function UR_updateLeft(index, unapprovedRevs)
{
    if (EventsMan_hasEvent(unapprovedRevs[index].event_id))
    {
        var mainPopUp = PopUp_getMainPopUp();
        PopUp_setToEventID(mainPopUp, unapprovedRevs[index].event_id);
        $(mainPopUp).draggable('disable');
    }
    else
    {
        if (PopUp_hasMain())
        {
            var mainPopUp = PopUp_getMainPopUp();
            PopUp_close(mainPopUp);
        }
        //SB_pop(mainPopUp);
    }
}
