var current_request;
setInterval(get_status, 1000);


$( '#btn-back-more' ).button().click( function() { seek( -60*5 );  });
$( '#btn-back' ).button().click( function() { seek( -10 );  });
$( '#btn-forward' ).button().click( function() { seek( 10 )  });
$( '#btn-forward-more' ).button().click( function() { seek( 60*5 );  });

$('#flip-pauseplay').slider().change( function(){
current_request = $.getJSON('/mplayer/pause', function(data)
{
    update_status( data );
})
.error( function(){ error('Error') });
});

$('#flip-fullscreen').slider().change( function(){
    current_request = $.getJSON('/mplayer/fullscreen', function(data)
    {
        update_status( data );
    })
    .error( function(){ error('Error') });
});

$('#flip-subs').slider().change( function(){
    current_request = $.getJSON('/mplayer/subs', function(data)
    {
        update_status( data );
    })
    .error( function(){ error('Error') });
});

function play( hash )
{
    current_request = $.getJSON('/mplayer/play', {file_hash:hash}, function(data)
    {
        update_status( data );
    })
    .error( function(){ error('Error') });
}

function seek( step )
{
    current_request = $.getJSON('/mplayer/seek', {step:step}, function(data)
    {
        update_status( data );
    })
    .error( function(){ error('Error') });
}


function get_status()
{
    current_request = $.getJSON('/mplayer/status', function(data)
    {
        update_status( data );
    })
    .error( function(){ error('Error') });
}

//in here we want to update our buttons, clocks and sliders
function update_status( status )
{
    //alert(JSON.stringify(status));
    if( status['pause'] == true ){
        $( '#flip-pauseplay' ).val('pause');
    }else{
        $( '#flip-pauseplay' ).val('play');
    }
    if( status['fullscreen'] == true ){
        $( '#flip-fullscreen' ).val('fullscreen_on');
    }else{
        $( '#flip-fullscreen' ).val('fullscreen_off');
    }
    if( status['subs'] == true ){
        $( '#flip-subs' ).val('subs_on');
    }else{
        $( '#flip-subs' ).val('subs_off');
    }

    $( '#flip-pauseplay, #flip-fullscreen, #flip-subs' ).slider('refresh');

    $('#time').html( format_seconds(status['time_pos']) +'/'+ format_seconds(status['length']) + ' ('+ status['percent_pos'] +'%)' );

}

